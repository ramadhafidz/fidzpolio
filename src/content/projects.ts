import type { Project } from '@/types/content';

// TODO(user): replace with real projects. Thumbnails are generated
// gradient placeholders in /public/projects — swap for real screenshots.
export const projects: Project[] = [
  {
    slug: 'placeholder-one',
    title: 'Placeholder Project One',
    description: '',
    thumbnail: { src: '/projects/gradient-1.svg', alt: '' },
    tags: [],
    liveUrl: '',
    githubUrl: '',
    date: '2026-01-01',
    featured: true,
  },
  {
    slug: 'placeholder-two',
    title: 'Placeholder Project Two',
    description: '',
    thumbnail: { src: '/projects/gradient-2.svg', alt: '' },
    tags: [],
    liveUrl: '',
    githubUrl: '',
    date: '2026-01-01',
    featured: true,
  },
  {
    slug: 'placeholder-three',
    title: 'Placeholder Project Three',
    description: '',
    thumbnail: { src: '/projects/gradient-3.svg', alt: '' },
    tags: [],
    liveUrl: '',
    githubUrl: '',
    date: '2026-01-01',
    featured: true,
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
