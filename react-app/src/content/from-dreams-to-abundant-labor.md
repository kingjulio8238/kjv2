There has been a lot of progress in world models over the past year going from just a few models (open source & proprietary) to recently a 15M param JEPA. So, with all this progress, different types of architectures, and all the hype, how can world models actually help us achieve our dream of a world full of abundant labor?

I've been following world models closely and still convinced they play 3 key roles in improving physical autonomy:

## 1. Internal Planners

We humans don't realize it, but we model every future scenario unconsciously and the effects of our actions before taking them (aka dreams). How many dreams do we execute at any time in parallel? I'm not sure of this but curious to know - any neurosci guys lmk :)

The promise for world models here is to be small enough to run onboard a Jetson and allow the "S2" system to run enough dreams in parallel to be highly confident that the future action will achieve desired intentions. **Action-conditioned world models like DreamerV4 & RISE work best here** as a Jetson (Orin or Thor) lacks the VRAM to "dream" in high-resolution pixels in parallel. These world models imagine the future as latents rather than images, which allows the robot to simulate hundreds if not thousands of "what-if" scenarios simultaneously, score them based on a learned reward function, and execute the best path. This bypasses the overhead of video decoding and is done all on device with low latency. I expect a lot of progress here given there are a lot of folks building world models for gaming.

## 2. Offline Policy Evaluation

While speed is crucial for "internal world modeling," it isn't the priority for evaluation. Instead, accurate physics and "internet-scale common sense" are treated as first-class citizens. **High-fidelity video world models like UniSim or DreamGen are best suited here**, as they can leverage a massive trained backbone and "play back" a new policy's actions in a photorealistic dream to see if they would have succeeded in the real world.

These high fidelity world models essentially create a digital twin of reality without the hassle of manual simulation setup, allowing us to iterate on policies way faster and evaluate in environments that are hard to access / dangerous. GAIA-2 by Wayve provides a perfect view into this future (even though it is used for AVs).

## 3. Recovery Mode and In-Painting

When a robot fails in the real world, it ideally needs to be able to understand the current failure state and align it back with the original goal. **Joint World Action Models (WAMs) are best here** because they implicitly understand how the world should evolve to reach a goal.

In an offline setting, WAMs can in-paint from the point of failure back to a successful trajectory; essentially, the world model allows the robot to dream a path to recovery, turning every mistake into a successful synthetic training rollout without a human needing to manually reset anything. As on-board compute scales and becomes more efficient, it will be interesting to see how this can be done online.

## Looking Ahead

It is very exciting to think of a future with a world model S1 / S2 hybrid approach using these massive video backbones as the slow S2 planner giving the robot foresight, while a low-latency JEPA handles the high-speed tactile reality. It is also exciting to explore RL within the world model but that's for another post..
