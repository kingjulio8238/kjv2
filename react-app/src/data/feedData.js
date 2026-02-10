import memaryContent from '../content/memary.md?raw';
import texasBlockchainContent from '../content/texas-blockchain.md?raw';
import onPolicyContent from '../content/on-policy.md?raw';

export const feedArticles = [
  {
    slug: 'on-policy',
    title: 'Why the Future of Robotics is On-Policy',
    description: 'Why frontier labs will shift from buying data to earning data.',
    tag: 'THOUGHT',
    categories: ['Robotics'],
    image: '/feed-on-policy.png',
    imageAlt: 'Robotics',
    date: 'January 2026',
    content: onPolicyContent,
  },
  {
    slug: 'memary',
    title: 'Memary',
    description: 'The open source memory layer for autonomous agents.',
    tag: 'PROJECT',
    categories: ['Agents', 'Memory'],
    image: '/feed-memary.png',
    imageAlt: 'Memary',
    date: 'January 2026',
    content: memaryContent,
  },
  {
    slug: 'texas-blockchain',
    title: 'Texas Blockchain',
    description: 'Building a state-wide blockchain organization from the ground up.',
    tag: 'PROJECT',
    categories: ['Blockchain', 'Leadership'],
    image: '/feed-texas-blockchain.png',
    imageAlt: 'Texas Blockchain',
    date: 'January 2026',
    content: texasBlockchainContent,
  },
];
