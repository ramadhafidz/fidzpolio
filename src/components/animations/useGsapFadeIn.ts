'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap, EASE, DURATION } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

export interface FadeInOptions {
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  /** Selector for children to stagger instead of animating the container. */
  staggerSelector?: string;
  start?: string;
}

export function useGsapFadeIn<T extends HTMLElement = HTMLDivElement>(
  options: FadeInOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    y = 24,
    duration = DURATION.normal,
    delay = 0,
    stagger = 0,
    staggerSelector,
    start = 'top 85%',
  } = options;

  useGSAP(
    () => {
      const { gsap, ScrollTrigger } = getGsap();
      const el = ref.current;
      if (!el) return;

      const targets = staggerSelector
        ? Array.from(el.querySelectorAll(staggerSelector))
        : [el];
      if (targets.length === 0) return;

      // Reduced motion: skip the hidden start state entirely so content
      // is never trapped invisible. This is the spec's hard requirement.
      if (prefersReducedMotion()) return;

      const vars: gsap.TweenVars = {
        y,
        opacity: 0,
        duration,
        ease: EASE.outExpo,
        delay,
        stagger,
      };

      gsap.set(targets, vars);
      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration,
        ease: EASE.outExpo,
        delay,
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
        },
      });

      // SSR / reduced-motion safety: never leave content hidden.
      ScrollTrigger.refresh();
    },
    { scope: ref },
  );

  return ref;
}
