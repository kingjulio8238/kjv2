Every video pretraining paper reports two numbers that don't mean what they look like they mean. The first is **MFU**, which measures the wrong resource for a large class of the runs that matter. The second is **"trained on N tokens"** — and in video, the token count isn't a property of the dataset at all. It's a number you *chose* when you picked the autoencoder.

The first is a known problem showing up in a new regime. The second is the interesting one, because it means published video scaling laws **cannot be compared to each other**, and it has a fix that someone has already worked out for text.

## MFU Measures the Wrong Resource

Model FLOPs Utilization is achieved FLOP/s over peak FLOP/s. It answers "how busy are the tensor cores," which is the right question exactly when the tensor cores are the constraint.

[As the decode arithmetic shows](/feed/index-decode-bound), for video pretraining they often aren't. A 300M model training at 256² from a 1080p source is **decode-bound**: its NVDEC engines are saturated while its SMs sit idle, and MFU reads around 29%.

*(That piece put the crossover at ~400M. [Measured](/feed/decode-measured), it is **2.4 billion** — so the argument below applies far more widely than it first appeared, not less.)*

A team optimizing that number looks at 29% and concludes the model is too small. The change MFU recommends is *make N bigger* — which is precisely the change that destroys the ablation the run exists to produce.

Three distinct failure modes:

**It has no denominator for the binding resource.** NVDEC sits on the same die and outside MFU's accounting entirely. You can be at 100% decoder utilization and 29% MFU at the same instant, and MFU will describe a machine running at its physical limit as a machine running at a third of it.

**It rewards waste.** Raising tokens-per-frame — by training at higher resolution, or by choosing a tokenizer with a worse compression ratio — raises achieved FLOP/s and therefore MFU, whether or not the extra tokens carry any information. The metric is maximized by inefficiency along the exact axis the job is about.

**The regime flips mid-experiment.** N_crit scales linearly with decode throughput and inversely with tokens per frame, both of which a scaling study sweeps on purpose. MFU isn't comparable across points inside a single experiment.

Where MFU is fine: a run whose model is large enough to outpace its decoder means what it usually means. Measurement moved that boundary to **~2.4B**, so the problem is not confined to small ablations — it covers essentially every VLA policy and every video model short of the 14B world-model class.

## Tokens Are Not a Property of the Data

Here is the same video, encoded by three mainstream tokenizers:

![Tokens per frame at 256², identical input](/chart/helix-tokenizers)

An **8× spread**, on identical input, from a design choice. In text, one token is roughly one fixed chunk of corpus and the token count is a measurement. In video, the tokenizer *is a compression ratio you select*.

Two consequences, and the second is worse than the first. "Trained on 2T tokens" isn't falsifiable across labs. And a scaling law fitted in tokens **does not transfer to a different tokenizer** — so the published video scaling laws are not mutually comparable, and a lab with the world's largest video corpus cannot safely inherit any of them.

## What Text Already Figured Out

Recent compute-optimal-tokenization work fits, for text:

```
B*(C,T) = B₀ · C^α · T^β        N*(C,T) = N₀ · C^(1-α) · T^(1-β)
B₀ = 17.5   α = 0.465   β = 0.471   N₀ = 0.0095
```

and reports something clean: **ρ\* ≈ 60 bytes of data per parameter, near-constant across compute budgets and across compression rates**, while the optimal compression rate itself *decreases* with compute (T\* = 3.69 at 10²⁰ FLOPs → 3.33 at 2×10²¹).

Parameters scale with **bytes**, not tokens. Chinchilla's "20 tokens per parameter" is an artifact of one tokenizer, not a law of nature.

The video version is wide open: is there a `ρ*_video` in bytes-per-parameter that's invariant to the VAE's compression ratio? If there is, it's the correct axis for a video scaling law and it makes results portable. If there isn't, the deviation localizes exactly what video tokenization destroys. Either answer is worth having, and it isn't a new project — it changes what you plot on the x-axis of a study you were running anyway.

One more detail from that work points somewhere unexpected: ρ\* varies by language, tracking the information density of the bytes (English 62.1, Russian 96.3, Hindi 95.5). The video analogue would have ρ\* vary with **scene entropy** — static footage versus dense manipulation. Which makes it a *curation* result, not just a scaling one.

## What to Report Instead

**Bound-Relative Utilization.** Achieved throughput over the binding roofline, where the bound is taken as the minimum over SM FLOPs, decode, HBM bandwidth, storage read, and network — identified per run rather than assumed. This is just roofline done honestly, and MFU is the special case where FLOPs happens to win the minimum. Reporting it forces the useful disclosure — *which resource is binding* — which is the one fact a reader needs and no paper currently states.

**Effective frames per second per GPU.** Unique, deduplicated, non-replayed input frames of supervision consumed per GPU-second. Hardware- and tokenizer-agnostic, so it compares across architectures the way FLOP-based numbers can't. It ignores model size, so it's a throughput number, not an efficiency one — report it next to BRU, not instead of it.

**Loss reduction per dollar**, with the denominator including ingest, curation, tokenization and storage. At 50,400 hours a day through a five-stage pipeline, the non-GPU cost isn't a rounding error, and a metric that ignores it will systematically choose the wrong operating point.

## Two Numbers That Change How the Curve Gets Fit

Fitted on video diffusion transformers:

```
N_opt = 1.5787 · C^0.4146
B_opt = 2.1797e4 · T^0.8080 · N^0.1906
η_opt = 0.0002 · T^(-0.0453) · N^(-0.1619)
```

That exponent — **0.4146 against Chinchilla's ~0.5** — says the compute-optimal video model is *smaller and trained on more data* than language intuition predicts. Good news for a data-rich lab, and it pushes the optimum toward the decode-bound regime rather than away from it.

The same work found video DiT loss far more sensitive to batch size and learning rate than LLM loss, and that fitting a scaling law with fixed suboptimal hyperparameters produces a **30.26% slope error** — enough to invert a conclusion. So `B_opt` and `η_opt` have to be re-fit at every point of the grid, not held constant. That roughly doubles the cost of doing a video scaling study correctly, and it is the most common reason a published one is wrong.

## The Prediction

> At fixed training FLOPs on Index-class egocentric video, loss will be more sensitive to **frames per second** than to spatial resolution, over at least a 4× range in each — and the compute-optimal operating point will sit at *lower resolution and higher frame rate* than current video-generation practice (480p, 16–24 fps).

The reasoning: vision-encoder cost is `c_ViT = 2·x_M·x_T·x_W`, **linear in frames**, so temporal coverage is the cheap axis and spatial detail is the expensive one. And generation models are graded on perceptual quality, which buys resolution. A model learning physical dynamics is not.

Cheap to test at ablation scale. Wrong in an interesting way if it's wrong.

---

*Sources: [Compute-Optimal Tokenization](https://arxiv.org/html/2605.01188v1) · [Precise Scaling Laws for Video Diffusion Transformers](https://arxiv.org/pdf/2411.17470) · [Inference Compute-Optimal Video VLMs](https://arxiv.org/pdf/2505.18855) · [Cosmos tokenizer](https://research.nvidia.com/labs/cosmos-lab/cosmos-tokenizer/) · [Wan2.1](https://github.com/Wan-Video/Wan2.1)*
