Out of the box, an open video-diffusion model makes a five-second 480p clip in **365 seconds**. We got it to **4.0 seconds** on a single B200 — **89× faster** — and the quality holds. This is the story of six changes, each measured by the clock it left us at. The famous one — hand-writing a kernel below the compiler — turns out to be one of the smaller steps.

![The descent](/chart/vsa-e2e)

## The Dense Baseline

Dense attention, 40 denoising steps, torch's stock kernels. **365 seconds** per clip on a B200. That's the number to beat, and it sets the rules: every change below earns its place only by the clock it leaves us at. No hand-waving about "up to N×" — just the wall time to make one video.

## Going Below the DSL

Attention is **36% of the model's compute**, so it's the obvious first target. We hand-wrote a sparse-attention kernel that runs **4× faster than the best Triton can compile** (4.99 ms vs 20.2 ms, landing 1.49× off the theoretical floor), and on Blackwell it gathers *scattered* blocks of memory for a **1.02× penalty — essentially free**. That's real, hard-won kernel work.

And end-to-end it bought **1.7×**. From 365 down to **215 seconds**. At batch one, a 17 ms software wrapper dwarfed the 5 ms kernel — the honest lesson that shaped everything after: at these sizes the kernel isn't the bottleneck. Its job is to be correct, fast, and *out of the way* of the levers that actually move the clock.

![The kernel ladder](/chart/vsa-ladder)

## Four Steps, Not Forty

Here's where the speed actually lives. A distilled **4-step** schedule replaces the 40-step denoising loop — one small LoRA per expert, trained to take giant steps instead of tiny ones. **32.6×**, in a single change. From 215 down to **11.2 seconds**. The kernel's contribution wasn't 1.7× for its own sake; it was making sure the four steps we keep are as cheap as possible.

![Forty steps become four](/chart/vsa-steps)

## Let the Compiler Fuse the Glue

Between the big matrix multiplies and the attention sits a layer of small operations — normalizations, scale-and-shift, residual adds. Individually trivial, collectively they re-stream the whole tensor through memory again and again. `torch.compile` fuses them into single passes. **53× → 6.9 seconds.** (The one trap: hide the step counter from the compiler, or it recompiles the whole graph 64 times chasing a number that keeps changing.)

## Four-Bit Math

The projection matrix-multiplies don't need 16-bit precision. Quantized to **NVFP4** — four-bit — the tensor cores run them **2.46× faster**, with no visible quality cost. **71× → 5.1 seconds.** The fight here wasn't the math; it was the toolchain — the win only appeared once we found the right prebuilt kernel library and CUDA version. Below the framework, the plumbing is half the battle.

![Four-bit GEMMs](/chart/vsa-fp4)

## Stack, and Ship

The last second came from order of operations. Fuse the 4-step LoRA *into* the base weights **before** quantizing — do it after, on a separate path, and it regresses. Cast the decoder to bf16. **89× → 4.0 seconds.** Quality, measured against the full dense model on held-out prompts: **CLIP-cosine 0.926** — the clip you get is the clip you'd have waited 365 seconds for.

## Where the 4 Seconds Go

Being honest about the number: 2.7 seconds is the denoiser, 1.3 is the decoder. The best public result does the same clip in ~2.5 seconds, so we're not the fastest in absolute terms yet — and the entire gap is **the glue** (~1 second), the tensor re-streamed through memory around the opaque kernels. Not the attention kernel. Not the decoder. Closing it means fusing the glue *into* the big kernels' edges by hand — mapped, and deliberately deferred.

![Where the 4.0 s goes](/chart/vsa-budget)

## What Didn't Work

The failures are the credibility. Hand-fused normalization kernels beat eager PyTorch **1.92×** — and then **lost** to `torch.compile`, because the compiler fuses across more operations than a standalone kernel can. CUDA-graphing the decoder bought **1.02×** — it's compute-bound, not launch-bound, so there were no launches to hide. And training the quality back, the move that rescued a smaller model, barely moved this one — at 14B it already tolerates the sparsity. Three good ideas, measured, and set down.

![What didn't work](/chart/vsa-honest)

## Why It Matters

The 89× didn't come from one heroic kernel. It came from **stacking levers in a runtime** — sparse attention, few-step distillation, compilation, four-bit quantization — and measuring each one honestly. The kernel is the portable piece of IP: the algorithm ports to other silicon where the vendor's fast kernels simply don't exist. But the product is the runtime that wields it. Fastest ratio on the card we serve today; the absolute record is the next build.

*Wan2.2-T2V-A14B, 832×480, 81 frames, one B200. Warm medians, warmup dropped. The kernel: 40 heads, sequence length 39,936, honest scattered gather.*
