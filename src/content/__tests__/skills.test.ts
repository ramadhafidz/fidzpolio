import { describe, expect, it } from 'vitest';
import { skills } from '../skills';

describe('skills', () => {
  it('groups skills by category with at least one group', () => {
    expect(skills.length).toBeGreaterThan(0);
    skills.forEach((group) => {
      expect(typeof group.category).toBe('string');
      expect(group.items.length).toBeGreaterThan(0);
    });
  });
});
