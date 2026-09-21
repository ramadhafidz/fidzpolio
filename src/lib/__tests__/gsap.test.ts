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
    // CSS spelling is recorded in globals.css as --ease-out-expo.
    expect(DURATION.fast).toBe(0.3);
    expect(DURATION.normal).toBe(0.6);
    expect(DURATION.slow).toBe(1.2);
  });

  it('EASE is a string GSAP can actually parse', () => {
    // A CSS `cubic-bezier(...)` string is not a GSAP ease: parseEase returns
    // undefined and the tween silently falls back to the default ease. The
    // spec's curve is expo-like, so 'expo.out' is the JS spelling.
    const parsed = getGsap().gsap.parseEase(EASE.outExpo);
    expect(typeof parsed).toBe('function');
  });
});
