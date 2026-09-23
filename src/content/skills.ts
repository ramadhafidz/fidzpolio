import type { SkillGroup } from '@/types/content';

// TODO(user): replace with the real stack.
export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    description: 'Typed JavaScript across the whole stack.',
    items: [{ name: 'TypeScript' }, { name: 'JavaScript' }],
  },
  {
    category: 'Frameworks',
    description: 'App Router, server components, and the rendering edge.',
    items: [{ name: 'Next.js' }, { name: 'React' }],
  },
  {
    category: 'Motion',
    description: 'Scroll-driven animation that stays in sync with the page.',
    items: [{ name: 'GSAP' }, { name: 'Lenis' }],
  },
  {
    category: 'Tooling',
    description: 'Versioning, design handoff, and shipping.',
    items: [{ name: 'Git' }, { name: 'Figma' }],
  },
];
