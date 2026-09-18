Two pieces ago I worked out on paper that video pretraining at Index scale is decode-bound, and put the crossover at **407 million parameters**. Then I rented an H100 for **$2.18** and measured it.

The paper number was right about the direction and wrong about the size by roughly 6×. The crossover is **2.4 billion**. And the largest single factor turned out not to be anything in that analysis — it's a choice about *how you sample clips* that no vision-language-action paper writes down, and that costs a **9.8× swing in fleet size** for identical supervision.

One more thing, which is the honest part: the specific mechanism I predicted for that cost was backwards.

## The Setup

Real egocentric video this time, not a synthetic pattern: **EgoSuite-Open100K**, a 100,000-hour open dataset of head-view human demonstrations. The capture rig turns out to be a close analogue of the sort of device Figure ships to Index contributors — its metadata carries serial numbers, firmware versions, battery level and CPU, GPU and skin temperatures with throttle points. A purpose-built, battery-powered wearable.

What it records: **1920×1456 H.264 High at 30 fps**, stereo left and right head cameras, plus a 320×240 depth stream at 5 fps, already undistorted. Mean keyframe interval ~170 frames. Mean clip 21.7 seconds.

Note the three things there that a back-of-envelope would miss. The frame is **1.35× the pixels of 1080p**. It's **stereo**, so two streams per observation. And clips are short, which turns out to matter more than everything else.

## Does the Published Number Survive?

NVIDIA publishes **2,531 frames/second** for 1080p H.264 on an H100. That figure anchored the whole paper analysis, so it was the first thing to check.

| | fps | vs published |
|---|---|---|
| NVIDIA published, 1080p, 1 stream | 2,531 | — |
| **measured, naive 1 stream @1920×1456** | **264** | **7.11× off** |
| measured, 1080p, 7 workers | **2,287** | **1.11× off** |

Both. The published number is real and reachable — and you get **one seventh of it** by writing the obvious code.

That reframes a whole class of result. Anyone who dropped a straightforward decoder into a training loop, measured throughput, and concluded decode wasn't their bottleneck was measuring their own call overhead.

## Seven Engines, and the Curve Finds Them

![Decode throughput against concurrent decoders](/chart/helix-nvdec-scaling)

Going from 1 to 7 concurrent decoders buys **5.14×**. Going from 7 to 14 buys **1.09×**.

An H100 has exactly **7 NVDEC engines**. The scaling curve locates the hardware without being told it exists, and flattens precisely there. It's the cleanest result in the run, and the lever is free — it's a thread pool, not a kernel.

## The Actual Finding

Training doesn't read video files end to end. It samples. So: whole clips versus random 16-frame windows.

| | whole clip | 16-frame windows | penalty |
|---|---|---|---|
| 1 worker | 263 | 54.9 | **4.8×** |
| 7 workers | 860 | 87.3 | **9.8×** |
| 14 workers | — | 89.8 | *3% over 7* |

Random windows don't just cost more. They **stop responding to concurrency entirely**. Seven workers make whole-clip reading 3.3× faster and random windows 1.6× faster; fourteen workers add 3%. The bottleneck has moved off the decoder and onto per-window setup, which is serial and paid per call.

In the unit that matters — Figure reports Index as *"35 minutes of new human experience every second,"* which is 2,100× realtime — that looks like this:

![GPUs of pure decode to keep up with Index](/chart/helix-sampling-policy)

**147 GPUs or 1,443 GPUs**, for the same supervision, decided by how you sample. Nobody states which one they used.

## Where I Was Wrong

I had a mechanism for that cost, and it was wrong.

Sampling a random 16-frame window means seeking to the preceding keyframe and decoding forward. At a keyframe interval of 250 you might decode 249 frames to deliver 16; at 15 you'd decode at most 30. So short GOPs should be much faster for random access. That's tidy, it's the standard explanation, and I believed it enough to build an axis around it.

![Random 16-frame windows by keyframe interval](/chart/helix-gop-falsified)

**Backwards.** Longer keyframe intervals are *faster*.

The decode-forward distance isn't what you're paying for. The cost is **fixed per window** — seek, set up, tear down — and it dominates at these window sizes. Short-GOP files also carry more keyframes, so at a fixed bitrate they compress worse and there are more bytes to parse, pushing the same way.

Which inverts the obvious remedy. Re-encoding the archive to short GOPs so random access gets cheap would make it **slower**, after a full pass over the corpus to find out. The fix for random-access cost is to stop doing random access — and since clips average 21.7 seconds, reading them whole is entirely practical.

## One More Correction

In an earlier environment check I measured decode at 361 fps and blamed the synthetic test clip for being unrepresentative — flat, over-compressible, nothing like real video.

| Content | stream-fps | vs real |
|---|---|---|
| real egocentric | 263 | 1.00× |
| mandelbrot | 225 | 0.86× |
| testsrc | 297 | 1.13× |

Content is worth **±13%**. The low number was the naive API and a single decoder instance. I'd diagnosed it confidently on no evidence.

## What It Does to the Original Claim

On the best configuration measured — whole clips, 7 workers, stereo, native resolution — the crossover between decode-bound and compute-bound training is:

> **N_crit = 2.4 billion parameters.**

Below that, an H100 running this pipeline is starved for frames. That covers essentially every VLA policy in existence and every video model short of the 14-billion-parameter world-model class.

The paper analysis said 407M and framed it as an ablation-scale concern — production models were safe. Measured, it's not an ablation problem. Three things moved it: stereo capture doubles the streams, the native frame is 1.35× the pixels of 1080p, and the real decode rate sits well below the published single-stream figure unless you run seven decoders.

The original direction holds. The magnitude was understated by about 6×, and the part that mattered most wasn't in the analysis at all.

## The Bill, and the Mistake In It

**$2.18** total, across a smoke test, a full run that crashed, and a targeted re-run.

The crash is worth recording. A decoder path segfaulted, and **the platform retried it four times at full price**, replaying the sweep from the top each time, because I hadn't set retries to zero. That's about a dollar of the $2.18 — roughly half the run — spent on the same failure four times. An automatic retry on an expensive job is a silent expensive mistake, and it usually re-runs the same crash.

The harness now carries retries at zero, a 45-second per-run watchdog, and a global deadline. The attempt before that hung outright on an unbounded loop in a video reader that wraps around rather than signalling the end of a file.

---

*One H100, one driver version, eight episodes, single machine. AV1 went unmeasured — the container's ffmpeg lacked the encoder — so the archival re-encode question is still open, though given the keyframe result the expected answer is "don't."*
