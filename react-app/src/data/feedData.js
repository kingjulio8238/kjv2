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
