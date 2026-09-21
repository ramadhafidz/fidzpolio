import { describe, expect, it } from 'vitest';
import { cn, prefersReducedMotion } from '../utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('resolves tailwind-merge conflicts, last wins', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b');
  });
});

describe('prefersReducedMotion', () => {
  it('returns false when matchMedia is unavailable', () => {
    expect(prefersReducedMotion()).toBe(false);
  });
});
