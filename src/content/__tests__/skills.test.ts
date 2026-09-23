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

  it('carries a description when one is provided', () => {
    // Optional field — present groups must keep their copy.
    skills.forEach((group) => {
      if (group.description !== undefined) {
        expect(typeof group.description).toBe('string');
      }
    });
  });
});
