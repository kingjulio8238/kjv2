Figure's Index collects **35 minutes of new human video every second** — 50,400 hours a day, 2,100× realtime, uploaded from phones in 108 countries. The obvious worry is storage. The arithmetic says storage is a rounding error, and the real constraint sits somewhere almost nobody looks: the **video decoder**. On one H100 the crossover between decode-bound and compute-bound training lands at **407 million parameters** — which means the production model is fine and *every scaling-law ablation is not*.

Except that number isn't robust, and chasing down why turned out to be the more interesting result.

This is an outside analysis. Every input is public and cited; the assumptions are marked, and the ones that would move the answer are listed at the end.

## The Stream

Thirty-five minutes per second is the number Figure published with Helix 2.5. Unpacked:

- **50,400 hours/day** of new egocentric video
- **5.44 × 10⁹ frames/day** at 30 fps — a sustained **63,000 frames/second**, forever
- **~2.7M hours** accumulated, from 16M uploads at an assumed ~10 minutes each
- That is **~128× EgoScale**, the largest public egocentric corpus, at 20,854 hours

And the number worth carrying around: at 50,400 hours/day against a 2.7M-hour corpus, **the dataset doubles about every 53 days.** Any architectural decision that takes longer than a corpus doubling to evaluate is a decision made on data that no longer exists.

## Storage Is a Rounding Error

![What a day of Index costs to keep](/chart/helix-storage)

At 1080p30 and 8 Mbps — a typical phone — one hour is 3.6 GB. A day of Index is **181 TB**; a year is **66 PB**. Sustained ingest is **2.1 GB/s**. If the uploads are 4K, multiply by 6.3: 1.13 PB/day, 414 PB/year, 13 GB/s.

Those are real bills, but they are ordinary ones, and 2–13 GB/s of sustained write is nothing against a fleet of this size. **Storage capacity and ingest bandwidth are both non-issues.** Anyone who says the hard part is storing the video hasn't done the multiplication.

## The Decoder Is the Constraint — and Only at Small N

An H100 has **7 NVDEC engines**. NVIDIA's own PyNvVideoCodec benchmarks put it at roughly **2,500 frames/second** for 1080p H.264 (2,390 simple / 2,531 cached on 30-second clips). That rate depends on the *source* resolution and essentially nothing about what you train.

The training side depends only on the model. At 40% MFU on 989 TFLOP/s, with 64 tokens per input frame from a Wan-VAE-class tokenizer at 256², the model consumes `6·N·V` FLOPs per frame:

![Frames per second a single H100 can train, against what it can decode](/chart/helix-crossover)

The crossover is exact and it is a formula, not a number:

```
N_crit = (peak × MFU) / (6 · V · decode_fps)
       = 396e12 / (6 · 64 · 2500)
       ≈ 4.1 × 10⁸ parameters
```

A 14B world model is compute-bound by 34× and will never notice its decoder. **A 300M ablation is decode-bound**, with its tensor cores idle about a quarter of the time waiting for frames.

That is exactly backwards from where you want it. The production run is safe; the *scaling study* — the experiment whose entire job is to tell you how to spend the next nine figures — is the one running in the regime where a naive pipeline benchmarks its data loader and calls the result a scaling law.

Worse, read the formula again. N_crit moves **linearly with decode throughput** and **inversely with tokens per frame** — both of which a scaling study deliberately sweeps. A single experiment crosses from decode-bound to compute-bound partway through its own grid, which means throughput numbers aren't comparable across points *within one run*.

In aggregate, decode is cheap: keeping pace with the entire live stream costs about **25 GPUs' worth of NVDEC** out of up to 100,000. Decode is not an expensive problem. It is a badly-placed one.

## The Same Question, Swept

The 407M figure assumes one source format. It shouldn't — that conflates two independent things. **Source resolution and codec** set what the decoder can supply. **Training resolution** sets tokens per frame, and therefore what the model consumes. You can train at 256² from a 4K source. Separating them turns a number into a surface:

![N_crit by source format, training fixed at 256²](/chart/helix-format-sweep)

| Source | Codec | train 224² | train 256² | train 384² | train 480² |
|---|---|---|---|---|---|
| 480p | h264 | 134 | 103 | 46 | 29 |
| 720p | h264 | 252 | **193** | 86 | 55 |
| **1080p** | **h264** | 532 | **407** | 181 | 116 |
| 1080p | hevc | 488 | 373 | 166 | 106 |
| 4K | h264 | 2,080 | **1,592** | 708 | 453 |

N_crit in millions of parameters. Codec multipliers are estimates — HEVC ≈1.09× H.264 from a single public transcode datapoint, and AV1 has no published NVDEC decode figure at all.

A 300M ablation training at 256² is **compute-bound** from a 480p or 720p source, **marginally decode-bound** from 1080p, and **badly decode-bound** from 4K, where the crossover sits five times above the model. That's a **15× range** across plausible formats.

So the honest version of the claim isn't "video pretraining is decode-bound." It's: **whether you are decode-bound is set by a capture decision made before any of this code runs, and the sensitivity is 15×.**

## Which Makes Capture Resolution a Training-Systems Decision

Here's the part that makes the sweep more than a hedge. Index doesn't rely on whatever camera a contributor happens to own — **accepted Creators are sent a recording device**, stated in the App Store listing and corroborated independently. Some materials also mention a sensor headset. Figure controls the format.

Capture resolution is normally argued as a data-quality question: more pixels, more signal. The arithmetic says it's also a *throughput* question, and the two pull opposite ways. Capturing at 4K rather than 720p makes every downstream ablation roughly 8× more decode-bound — for pixels a 256²-trained model discards in the tokenizer anyway. If you're training at 256²–384², capturing above 1080p buys resolution you pay to decode and then throw away.

Unless you intend to raise training resolution later. In which case the capture decision is a bet on the scaling surface — and it's one you can only price *after* running the study. Which is the ordering trap again, one level up.

## Tokenize Once, and Storage Gets *Smaller*

The fix is to encode with the 3D causal VAE once, offline, store latents, and never decode during training again. The surprise is which direction the storage bill moves.

At 256² with 8× spatial and 4× temporal compression and 16 latent channels, one frame of latent is **8,192 bytes** — 0.88 GB/hour at 30 fps, against 3.6 GB/hour for the source. **Latents are 4.1× smaller than the compressed video they came from**, because you are throwing away resolution you were never going to train on.

Tokenizing the entire live stream costs about **126 GPUs running continuously — 0.13% of a 100k fleet.**

So offline tokenization removes the bottleneck *and* cuts the storage bill. On throughput grounds there is nothing to argue about.

## The Ordering Trap

The real cost of tokenizing is optionality. Encoding freezes three things: resolution, frame rate, and the tokenizer weights. Change any one and you re-run the pass — cheap in isolation, but it means those three choices are now upstream of every experiment you will ever run on the corpus.

Which forces a sequence that is the opposite of the obvious one:

1. Sample a subset. Tokenize it at **every** point in the (resolution, fps, clip-length) grid.
2. Run the scaling study on that subset. Decode-bound is fine here — it is small.
3. Pick the operating point from the fitted surface.
4. *Then* do one full tokenization pass, at the winner.

The scaling study has to come **before** the tokenization pass, because the study is what chooses the configuration the pass will freeze. Obvious afterward. Backwards from how anyone would naturally build it.

## Where I Was Wrong: 6ND Survives

I went in expecting 3D attention to wreck `6ND` FLOP accounting at video sequence lengths. Measured, it doesn't:

| Config | Sequence length | Attention share | `6ND` underestimates by |
|---|---|---|---|
| 256², 8 fps, 5 s | 2,560 | 0.8% | 1% |
| 480², 16 fps, 10 s | 36,000 | 10.0% | 11% |
| 720², 30 fps, 10 s | 151,875 | 31.8% | **47%** |
| 1080², 30 fps, 10 s | 341,719 | 51.2% | **105%** |

(N = 1B, d = 1536, full 3D attention, forward + backward.) The crossover is `L* = N/(2d)` — 326k tokens for a 1B model at d=1536, but only 37k for a wide-and-small 300M at d=4096.

So `6ND` is accurate to about 5% at the configurations that actually matter, and the error is driven by the *aspect ratio of the model* rather than by video as such. FLOP accounting is not where this problem is hard. The decoder is.

## What Would Change the Answer

Ranked by how much they'd move it:

1. ~~**Source resolution.**~~ Swept above rather than assumed — still the largest lever at 15×, but now a stated dependence instead of a hidden assumption. Unknowable from outside; a one-query answer for anyone inside Figure.
2. **Codec.** The 1.09× HEVC multiplier rests on a single public datapoint and AV1 on none. Both want measuring.
3. **Random access.** These benchmarks are *sequential* decode. Training wants random clips, which means seeking to keyframes and decoding forward. The gap between simple and cached decoders on short clips — 1,461 vs 2,602 fps at 1080p — is the visible edge of that tax, and it's the most likely place a real system falls short of the paper number.
4. **The MFU assumption.** 40% is generous for a DiT with 3D attention. At 25%, N_crit rises to ~660M and *more* models are decode-bound, not fewer.
5. **Mean upload length.** The 10-minute assumption sets the corpus estimate, the 128× multiple, and the doubling interval. All three move together if it's wrong.
6. **Ingested is not trained-on.** Three of Index's five pipeline stages *discard* video — filtering, deduplication, rebalancing — and the discard rate isn't published. 50,400 hours a day is what arrives, not what reaches the model. Every corpus figure above is an upper bound, and the size of that gap is exactly the thing worth measuring next.

---

*Sources: [Helix 2.5](https://www.figure.ai/news/helix-2-5-zero-shot-30-home-generalization) · [Index launch](https://www.humanoidsdaily.com/news/figure-ai-unveils-index-crowdsourcing-real-world-human-video-to-train-helix) · [PyNvVideoCodec benchmarks](https://docs.nvidia.com/video-technologies/pynvvideocodec/pynvc-api-prog-guide/application-note.html) · [H100 datasheet](https://resources.nvidia.com/en-us-gpu-resources/h100-datasheet-24306) · [Wan2.1](https://github.com/Wan-Video/Wan2.1) · [Cosmos tokenizer](https://research.nvidia.com/labs/cosmos-lab/cosmos-tokenizer/)*
