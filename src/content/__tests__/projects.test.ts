import { describe, expect, it } from 'vitest';
import { projects, getFeaturedProjects } from '../projects';
import type { Project } from '@/types/content';

describe('projects', () => {
  it('is a non-empty typed array', () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    projects.forEach((p: Project) => {
      expect(typeof p.slug).toBe('string');
      expect(typeof p.title).toBe('string');
      expect(Array.isArray(p.tags)).toBe(true);
      expect(typeof p.featured).toBe('boolean');
    });
  });

  it('exposes every entry as featured so the gallery is populated', () => {
    expect(getFeaturedProjects().length).toBe(projects.length);
  });
});
