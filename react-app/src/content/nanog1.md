A Unitree G1 humanoid, learning to walk **from scratch** with pure reinforcement learning on **a single GPU**. The first full walk took **~6 hours**. The last one took **58.9 seconds** — a **~380× speedup in 6 days**.

![Time to walk](/chart/waterfall)

This is what nanoGPT is to language models, but for robot locomotion. Here's how I got there.

## The Clock

Training time comes down to one ratio: how many practice steps the robot needs, divided by how many of those steps you can run per second. The two **multiply**, so there are only two levers — cut the steps, or run them faster. I pulled both: a **24× faster simulator** and a **16× more efficient learning recipe**, which together give the ~380×.

![Two levers multiply to 380x](/chart/decomposition)

## A Faster Engine (24×)

Physics simulation isn't slow for reinforcement learning — it's just never been specialized for a single robot. I compile the simulator for one fixed robot, so its body structure and contact points become built-in constants and the physics turns into lean, specialized code with none of the usual general-purpose overhead. Throughput went from **54,000 to 1.3 million practice steps per second** — about **8.9 million physics steps per second** — on a single RTX PRO 6000, ahead of every general-purpose simulator.

![Engine throughput vs other simulators](/chart/throughput)

## Fewer Practice Steps (16×)

The other lever is sample efficiency, and the full **16×** came in three steps. The first was the recipe. The old one needed about **1.2 billion practice steps** across four training stages; a sweep over the learning settings, plus a redesigned reward — keep the feet from crossing, discourage bad posture, use the robot's standard joint controllers — collapsed that to a single **116-million-step** run. I then **froze that policy's quality as the bar** every later change had to clear. The next two steps are where it got interesting.

![Practice steps to walk, dropping 16x](/chart/samples)

## The Unlock: Symmetry

Walking is left-right symmetric, so the policy should be too. I added a **symmetry penalty** — a gentle nudge against behaving differently when you mirror the robot left-to-right — with the mirror mapping checked against the physics engine itself. It cut the practice steps needed by **26%** *and* smoothed the gait by **31%** at the same time. Every other way of cutting steps traded quality away; symmetry gave both. **89.3 seconds → 67 seconds.**

![Symmetry cuts steps and smooths the gait](/chart/symmetry)

## The Last Few Seconds

To break **60 seconds**, I added a penalty on **torso wobble** — switched on only once the robot is already upright, so it never interferes with first learning to balance. With symmetry keeping things stable, the policy reached the bar about **10 million steps sooner**, at 75 million. **67 seconds → 58.9 seconds.**

![The wobble penalty reaches the bar sooner](/chart/lastsecond)

## Same Quality, Just Faster

None of this is a watered-down policy. The quality bar — falls, how well it tracks the commanded speed, and three measures of smoothness — was fixed up front and held constant the whole way. The 58.9-second policy clears all six checks, the same as the 89.3-second one did. Faster *and* smoother — not faster by gaming the reward.

![Every quality check, passed](/chart/gate)

## What Didn't Work

Getting under a minute was not a straight line. Every other way of cutting practice steps — reusing past experience more aggressively, easing the robot in with simpler commands first, or directly penalizing jerky motion — made the gait worse and missed the bar. The lesson: don't penalize the motion itself (that fights learning to move at the right speed); constrain its **structure** instead. And symmetry only pays off because everything here is built around one robot — the same single-robot focus that makes the simulator fast. A general-purpose tool, serving every robot at once, can't lean on one body's structure like this.

![What didn't work: every shortcut except symmetry](/chart/deadends)

## Try It

The trained robot runs live in the browser — drive it with the arrow keys. Everything is open source: train your own G1 in under a minute on a single GPU.

- **Live demo** : [nanog1.com](https://nanog1.com)
- **Code** : [github.com/kingjulio8238/nanoG1](https://github.com/kingjulio8238/nanoG1)
- **Model** : [huggingface.co/kingJulio/nanoG1](https://huggingface.co/kingJulio/nanoG1)

*Built on [PufferLib](https://github.com/PufferAI/PufferLib)*
