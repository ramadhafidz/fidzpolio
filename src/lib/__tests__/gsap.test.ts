import { describe, expect, it } from 'vitest';
import { getGsap, EASE, DURATION } from '../gsap';

describe('getGsap', () => {
  it('returns gsap with ScrollTrigger registered', () => {
    const { gsap, ScrollTrigger } = getGsap();
    expect(gsap).toBeDefined();
    expect(ScrollTrigger).toBeDefined();
    // corePlugins lists registered plugins
    expect(Object.keys(gsap.plugins).length).toBeGreaterThan(0);
  });

  it('is idempotent — repeated calls do not re-register', () => {
    const a = getGsap();
    const countAfterFirst = Object.keys(a.gsap.plugins).length;
    const b = getGsap();
    expect(Object.keys(b.gsap.plugins).length).toBe(countAfterFirst);
    expect(b.gsap).toBe(a.gsap);
  });
});

describe('shared timing tokens', () => {
  it('matches the spec transition tokens', () => {
    expect(EASE.outExpo).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
    expect(DURATION.fast).toBe(0.3);
    expect(DURATION.normal).toBe(0.6);
    expect(DURATION.slow).toBe(1.2);
  });
});
