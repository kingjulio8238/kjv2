In the world of AI Robotics, there is a gold rush for data. We see startups raising millions to curate third-party datasets - egocentric videos, tactile sensor logs, and teleoperated demonstrations.

But in the next decade, more than 99% of all robotics data will be collected from **on-policy autonomous rollouts**. If this prediction holds, the shelf life for companies whose sole value-add is selling third-party data will deteriorate rapidly. Here is why I believe frontier labs will shift from "buying data" to "earning data."

## The Death of Distribution Shift

The biggest silent killer in robotics is the distribution shift. You can train a model on 10,000 hours of third-party video of people washing dishes or in a simulator, but the moment your specific robot arm enters a kitchen with some specific out of distribution characteristics, the model fails to generalize.

On-policy rollouts - data collected by the robot while it is actually performing its task - solves this. When the robot collects data during deployment, the **training distribution is the deployment distribution**. There is no translation layer required. By learning from its own successes and failures in real-time, the system closes the gap between simulation and reality in a way that static, third-party datasets never can.

## The Data Economic Flywheel

Historically, data collection has been a massive cost to labs. They had to (still do) pay humans to wear VR suits or record themselves doing teleoperation.

We are now entering the era of the **Data Economic Flywheel**. As we see deployment numbers increase across the industry, the **cost of data collection is being subsidized by the work itself**.

When a robot is deployed to move pallets in a warehouse or fold laundry in a hotel, it is providing economic value. The data it generates while doing that work is essentially "free" - a byproduct of the robot doing its job. **Why would a company pay a premium for third-party egocentric data when their own fleet is generating high-fidelity, task-specific data while simultaneously generating revenue?**

## From RT-1 to Real-World Scale

It is easy to forget how fast the robotics industry is moving. It was only late 2022 when Google's RT-1 showed us that we could tokenize robotic inputs and outputs like language. In just a few years, we've moved from early robot learning approaches to starting to deploy fully end-to-end learned policies in the wild.

As deployment numbers scale, the sheer volume of on-policy data will dwarf any curated dataset a third-party company could provide. We will be moving from a **data-scarce industry to a data-abundant one**, where the challenge isn't finding data, but filtering the massive stream of on-policy experience.

## The End of Third-Party Dataset Providers

Given this trend, **companies whose sole value-add is selling third-party data have a rapidly expiring shelf life**. They are providing a temporary solution which is only useful while deployment numbers remain low and robotics companies lack their own data flywheel.

But as soon as a frontier robotics labs hits a certain fleet size, their internal on-policy data becomes their greatest moat. They won't need to buy data; they will have their own data factories, generating proprietary datasets that are perfectly aligned with their desired customer deployment environments.

## Earn the Data 

The bet is simple: The future of robotics isn't about who can buy the most data but rather **who can deploy the most robots to earn it**. In 2036, we won't be looking for third-party ego-videos sourced across the world to teach a robot how to move. We'll be watching robots **learning from experience** improving every time they successfully complete a task for a paying customer.
