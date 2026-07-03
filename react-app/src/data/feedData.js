import memaryContent from '../content/memary.md?raw';
import texasBlockchainContent from '../content/texas-blockchain.md?raw';
import onPolicyContent from '../content/on-policy.md?raw';
import whenWeHaveEverythingContent from '../content/when-we-have-everything.md?raw';
import sovereignAiContent from '../content/sovereign-ai.md?raw';
import humanoidAtlasContent from '../content/humanoid-atlas.md?raw';
import fromDreamsContent from '../content/from-dreams-to-abundant-labor.md?raw';
import harmonicDriveContent from '../content/harmonic-drive-shortage.md?raw';
import jepaZooContent from '../content/jepa-zoo.md?raw';
import jepasWorldContent from '../content/jepas-world.md?raw';
import tactileWorldModelsContent from '../content/tactile-world-models.md?raw';
import theActuatorRaceContent from '../content/the-actuator-race.md?raw';
import alliedSupplyChainContent from '../content/allied-supply-chain.md?raw';
import onePersonUnicornContent from '../content/one-person-unicorn.md?raw';
import nanoG1Content from '../content/nanog1.md?raw';
import wan89xContent from '../content/wan-89x.md?raw';

// Inferencemaxxing — the inference/kernel work, a collection (feed-within-a-feed).
// Each entry is tagged by the kernel it's about; the hub row's tag tracks the
// kernel currently in focus. Each entry carries a model-unique `timeline`: the
// scalar we drive down (for video-gen, seconds-per-clip), with a stop at each
// build milestone. The SpeedTimeline component renders it, synced to the h2
// sections whose text matches each stop's `heading`.
export const inferenceArticles = [
  {
    slug: 'wan-89x',
    title: 'Making Wan Video Gen 89× Faster',
    description: 'How an open video-diffusion model went from 365 seconds to 4.0 seconds per clip on one B200 — six changes, each measured by the clock it left us at. The hand-CUDA kernel is one of them.',
    tag: 'VSA',
    categories: ['Inference', 'GPU', 'Video'],
    date: 'July 2026',
    content: wan89xContent,
    timeline: {
      metric: 'video generation',
      unit: 's',
      hint: '832×480 · 81 frames · one B200 · warm median',
      stops: [
        { heading: 'The Dense Baseline', value: '365', mult: '1×' },
        { heading: 'Going Below the DSL', value: '215', mult: '1.7×' },
        { heading: 'Four Steps, Not Forty', value: '11.2', mult: '32.6×' },
        { heading: 'Let the Compiler Fuse the Glue', value: '6.9', mult: '53×' },
        { heading: 'Four-Bit Math', value: '5.1', mult: '71×' },
        { heading: 'Stack, and Ship', value: '4.0', mult: '89×' },
      ],
    },
  },
];

// The hub row shown in the main feed. Clicking it opens the collection page
// (a sub-feed), not a single article. Tag = the kernel in focus; date tracks
// the newest entry inside.
export const inferenceCollection = {
  slug: 'inferencemaxxing',
  title: 'Inferencemaxxing',
  description: 'Making advanced, non-LLM models fast and cheap to serve — kernels, roofline floors, and the runtime beneath the DSLs.',
  tag: inferenceArticles[0]?.tag ?? 'VSA',
  date: inferenceArticles[0]?.date ?? '',
  isCollection: true,
};

export const feedArticles = [
  {
    slug: 'nanog1',
    title: 'A G1 That Learns to Walk in <60 Seconds',
    description: 'A Unitree G1 humanoid learns to walk from scratch with pure reinforcement learning, on one graphics card. The first walk took ~6.1 hours; the last took 58.9 seconds — a ~375× speedup. How it got there, in plots.',
    tag: 'Project',
    categories: ['Robotics', 'RL', 'AI'],
    date: 'June 2026',
    content: nanoG1Content,
  },
  {
    slug: 'one-person-unicorn',
    title: 'The One Person Unicorn',
    description: 'For the first time, a single founder can run the work of fifty. The first one-person unicorn is closer than people think — and the constraint has shifted from labor to judgment.',
    tag: 'Thought',
    categories: ['AI', 'Future'],
    date: 'May 2026',
    content: onePersonUnicornContent,
  },
  {
    slug: 'allied-supply-chain',
    title: 'The Allied Supply Chain',
    description: 'US defense startups have to move fast, stay NDAA-compliant, and keep BOM costs low. Today they can pick two — unless they source from Japan.',
    tag: 'Thought',
    categories: ['Robotics', 'Supply Chain', 'National Security'],
    date: 'May 2026',
    content: alliedSupplyChainContent,
  },
  {
    slug: 'the-actuator-race',
    title: 'The Actuator Race',
    description: 'Actuators are 56% of every humanoid. The US builds almost none of them. The case for a domestic rotary and linear actuator industry.',
    tag: 'Thought',
    categories: ['Robotics', 'Supply Chain'],
    date: 'April 2026',
    content: theActuatorRaceContent,
  },
  {
    slug: 'tactile-world-models',
    title: 'Tactile World Models',
    description: 'Robots can see but can\'t feel. Video + actions should be enough to predict touch.',
    tag: 'Project',
    categories: ['Robotics', 'World Models', 'AI'],
    date: 'April 2026',
    content: tactileWorldModelsContent,
  },
  {
    slug: 'harmonic-drive-shortage',
    title: 'Own Both the Brains & the Muscle',
    description: 'The US builds robots but imports every joint. Why domestic harmonic drive manufacturing is a national security priority.',
    tag: 'Thought',
    categories: ['Robotics', 'Supply Chain'],
    date: 'April 2026',
    content: harmonicDriveContent,
  },
  {
    slug: 'jepa-zoo',
    title: 'JEPA Zoo',
    description: 'All JEPA variants visualized — interactive walkthroughs, architecture diagrams, and an evolution tree.',
    tag: 'Project',
    categories: ['AI', 'World Models'],
    date: 'April 2026',
    content: jepaZooContent,
  },
  {
    slug: 'jepas-world',
    title: "It's JEPA's World & We're Just Living in It",
    description: 'A breakdown of the JEPA family - from latent prediction to world models.',
    tag: 'Thought',
    categories: ['AI', 'World Models', 'Robotics'],
    date: 'March 2026',
    content: jepasWorldContent,
  },
  {
    slug: 'from-dreams-to-abundant-labor',
    title: 'From Dreams to Abundant Labor',
    description: 'How world models play 3 key roles in improving physical autonomy.',
    tag: 'Thought',
    categories: ['Robotics', 'World Models', 'AI'],
    date: 'March 2026',
    content: fromDreamsContent,
  },
  {
    slug: 'humanoid-atlas',
    title: 'Humanoid Atlas',
    description: 'An open-source intelligence platform mapping the humanoid robotics supply chain.',
    tag: 'Project',
    categories: ['Robotics', 'Supply Chain'],
    date: 'March 2026',
    content: humanoidAtlasContent,
  },
  {
    slug: 'sovereign-ai',
    title: "America's AI Hostage Crisis",
    description: "The US is fighting a war with AI tools it doesn\u2019t own. The case for sovereign AI.",
    tag: 'Thought',
    categories: ['AI', 'National Security'],
    date: 'March 2026',
    content: sovereignAiContent,
  },
  {
    slug: 'when-we-have-everything',
    title: 'When We Have Everything, What Do We Do?',
    description: 'Abundance is not a destination; it is a test of intent.',
    tag: 'Thought',
    categories: ['Philosophy', 'Future'],
    date: 'February 2026',
    content: whenWeHaveEverythingContent,
  },
  {
    slug: 'on-policy',
    title: 'The On-Policy Robotics Future',
    description: 'Why frontier labs will shift from buying data to earning data.',
    tag: 'Thought',
    categories: ['Robotics'],
    date: 'January 2026',
    content: onPolicyContent,
  },
  {
    slug: 'memary',
    title: 'Memary',
    description: 'The open source memory layer for autonomous agents.',
    tag: 'Project',
    categories: ['Agents', 'Memory'],
    date: '2023 - 2024',
    content: memaryContent,
  },
  {
    slug: 'texas-blockchain',
    title: 'Texas Blockchain',
    description: 'Building a state-wide blockchain organization from the ground up.',
    tag: 'Project',
    categories: ['Blockchain', 'Leadership'],
    date: '2021 - 2024',
    content: texasBlockchainContent,
  },
];

// Every article the article page can resolve by slug (top-level + collections).
export const allArticles = [...feedArticles, ...inferenceArticles];
