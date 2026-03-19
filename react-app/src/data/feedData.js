import memaryContent from '../content/memary.md?raw';
import texasBlockchainContent from '../content/texas-blockchain.md?raw';
import onPolicyContent from '../content/on-policy.md?raw';
import whenWeHaveEverythingContent from '../content/when-we-have-everything.md?raw';
import sovereignAiContent from '../content/sovereign-ai.md?raw';
import humanoidAtlasContent from '../content/humanoid-atlas.md?raw';

export const feedArticles = [
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
