import memaryContent from '../content/memary.md?raw';
import texasBlockchainContent from '../content/texas-blockchain.md?raw';
import onPolicyContent from '../content/on-policy.md?raw';
import whyHyperionNowContent from '../content/why-hyperion-now.md?raw';
import whenWeHaveEverythingContent from '../content/when-we-have-everything.md?raw';
import sovereignAiContent from '../content/sovereign-ai.md?raw';
import hiring100xContent from '../content/hiring-100x-engineers.md?raw';
import memaryImage from '../assets/memary.png';

export const feedArticles = [
  {
    slug: 'hiring-100x-engineers',
    title: "Evaluating 100x Engineers",
    description: "Coding agents write most production code now. AQ measures the engineers who can actually direct them.",
    tag: 'Company',
    categories: ['AI', 'Hiring'],
    image: '/feed-hiring-100x.png',
    imageAlt: 'Hiring 100x Engineers',
    date: 'March 2026',
    content: hiring100xContent,
  },
  {
    slug: 'sovereign-ai',
    title: "America's AI Hostage Crisis",
    description: "The US is fighting a war with AI tools it doesn\u2019t own. The case for sovereign AI.",
    tag: 'Thought',
    categories: ['AI', 'National Security'],
    image: '/feed-sovereign-ai.png',
    imageAlt: 'Sovereign AI',
    date: 'March 2026',
    content: sovereignAiContent,
  },
  {
    slug: 'when-we-have-everything',
    title: 'When We Have Everything, What Do We Do?',
    description: 'Abundance is not a destination; it is a test of intent.',
    tag: 'Thought',
    categories: ['Philosophy', 'Future'],
    image: '/feed-what-to-do.png',
    imageAlt: 'When We Have Everything',
    date: 'February 2026',
    content: whenWeHaveEverythingContent,
  },
  {
    slug: 'why-hyperion-now',
    title: 'Why Build Hyperion Now?',
    description: 'The era of earned intelligence and why the time is right for Hyperion.',
    tag: 'Company',
    categories: ['Robotics', 'Infrastructure'],
    image: '/feed-hyperion.png',
    imageAlt: 'Hyperion',
    date: 'February 2026',
    content: whyHyperionNowContent,
  },
  {
    slug: 'on-policy',
    title: 'The On-Policy Robotics Future',
    description: 'Why frontier labs will shift from buying data to earning data.',
    tag: 'Thought',
    categories: ['Robotics'],
    image: '/feed-on-policy-v2.png',
    imageAlt: 'Robotics',
    date: 'January 2026',
    content: onPolicyContent,
  },
  {
    slug: 'memary',
    title: 'Memary',
    description: 'The open source memory layer for autonomous agents.',
    tag: 'Project',
    categories: ['Agents', 'Memory'],
    image: memaryImage,
    imageAlt: 'Memary',
    date: '2023 - 2024',
    content: memaryContent,
  },
  {
    slug: 'texas-blockchain',
    title: 'Texas Blockchain',
    description: 'Building a state-wide blockchain organization from the ground up.',
    tag: 'Project',
    categories: ['Blockchain', 'Leadership'],
    image: '/feed-texas-blockchain-v2.png',
    imageAlt: 'Texas Blockchain',
    date: '2021 - 2024',
    content: texasBlockchainContent,
  },
];
