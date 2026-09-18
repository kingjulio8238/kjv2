I built the data loader that the measurements said to build. It beats the obvious implementation by **8.2×** on a real training loop. It still cannot keep an H100 busy, and the reason it can't is the useful part.

The target was 80% GPU utilisation training on real egocentric video. The best result across four model sizes was **0.685**, and the gap doesn't close by making the loader better — it closes by making the model bigger, or by deleting video decoding from the training loop entirely.

## Measuring "utilisation" so the number means something

`nvidia-smi` reports whether kernels are running. A GPU spinning on resize kernels while starved of frames looks busy. So the metric here is bound-relative:

```
data-path efficiency = step time with pre-made tensors
                     ÷ step time with the real loader
```

Run the same model, same batch, twice: once fed tensors that already exist in memory, once fed actual video. If the loader were free, the ratio would be 1.0. Everything below that is time the GPU spent waiting for pixels.

## The 8.2×

Two loaders, same 150M model, batch of 4, 16-frame windows at 256².

The **naive** one does what the obvious code does: pick a clip, seek to a random position, decode 16 frames, repeat four times, assemble a batch.

The **tuned** one follows from an earlier measurement — that decoding whole clips sequentially is roughly 10× faster than seeking to random windows, and that concurrency rescues the first and not the second. So: decode each clip once, straight through, then take ~40 training windows from frames already sitting in memory. Decode gets paid once per ten steps instead of four times per step.

![Milliseconds per training step, 150M model](/chart/helix-loader-8x)

| Loader | ms/step | efficiency |
|---|---|---|
| naive — seek per sample | 2,296 | **0.041** |
| whole clip, serial | 280 | **0.332** |
| whole clip, overlapped | 273 | 0.340 |

The naive loader runs the GPU at **4% of its own ceiling**. Not 4% of peak FLOPs — 4% of what that same model achieves on the same hardware when the data is already there.

The third row is the one I didn't expect. Overlapping decode with compute, using a worker pool so the two happen at once, buys **3%**. Once decode is amortised across forty windows there's almost nothing left to hide, and an elaborate prefetch pipeline would be work spent on a problem that has already gone away.

## Where the loader stops mattering

If the data path costs a fixed amount per step, then efficiency should improve as the model gets slower — the same overhead, divided into a bigger number. So: sweep the model size.

![Data-path efficiency by model size](/chart/helix-gate-gc)

| Size | Ceiling | Real | Overhead | Efficiency |
|---|---|---|---|---|
| 150M | 93 ms | 453 ms | 360 ms | 0.206 |
| 450M | 254 ms | 476 ms | 223 ms | 0.532 |
| 900M | 390 ms | 656 ms | 266 ms | 0.595 |
| 1.8B | 608 ms | 887 ms | 279 ms | **0.685** |

The overhead column is the whole story. Across a **12× range of model size** the data path costs a roughly **constant 256 ms per step** — because frames per step is set by the batch and window length, not by the model. The loader does identical work whether it's feeding 150M parameters or 1.8B. Efficiency improves only because the denominator grows.

Which makes the target solvable rather than a matter of tuning. Hitting 0.80 needs a step that takes at least 1,023 ms on its own, and extrapolating from the 1.8B point puts that at about:

> **3.0 billion parameters.**

Below that, on this hardware, at this resolution, no loader reaches 80% — because the floor isn't in the code. It's the cost of moving pixels.

## Two things I had wrong

**I expected `nvidia-smi` to be lying.** I'd built the bound-relative metric partly to expose it. It came within ±0.09 of true efficiency on every GPU-decode configuration — 33.5% against 0.332, 71.9% against 0.685. The one real divergence was the CPU-threaded loader, where the GPU genuinely idles and the sampler caught it.

So the sharper criticism isn't that the number is wrong. It's that **it can't tell you what the ceiling was.** 71.9% reads as healthy until you notice the ceiling it's 68.5% of is itself only about 15% of peak FLOPs.

**I expected threads to work.** The natural design is a pool of workers decoding on the GPU while the main thread trains. It faults the hardware: `Xid 31, MMU Fault, ENGINE GRAPHICS GPC4, FAULT_PDE`, then the process dies with a segfault. Giving each worker its own CUDA stream and synchronising before handoff didn't help — two attempts, two identical faults. The designs that work are GPU decode on the main thread, or CPU decode in threads with a host-to-device copy. I couldn't find this documented anywhere, and finding it out cost about a dollar.

## What the failure is actually saying

The tuned loader already extracts 8.2× over the obvious implementation and leaves behind a constant floor. Every further hour spent on it buys less than the hour before.

The floor exists because the training loop is decoding video. The fix is to stop doing that: encode the corpus once, offline, store latents, and never decode during training again. By an earlier measurement that costs about **0.13% of a large fleet** and makes the stored data **4.1× smaller**, because it discards resolution the model was never going to see.

This piece is the evidence that there's no cheaper way out. A failed gate is worth more than a passed one here — it rules out the option everyone tries first.

---

*$2.23, against a $2.00 budget I set myself and didn't enforce. About $1.08 of it went on two crashed runs before a single usable number — the GPU-thread fault killed the container twice, and a container that dies still bills for the time it ran. There was a cheaper path: test the threading model on two clips before wiring it to a training loop. Eight episodes, warm page cache, one GPU, one driver — a petabyte-scale corpus is always cold, which makes the real data path worse than this, not better.*
