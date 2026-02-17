import memaryContent from '../content/memary.md?raw';
import texasBlockchainContent from '../content/texas-blockchain.md?raw';
import onPolicyContent from '../content/on-policy.md?raw';
import whyHyperionNowContent from '../content/why-hyperion-now.md?raw';
import memaryImage from '../assets/memary.png';

export const feedArticles = [
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
