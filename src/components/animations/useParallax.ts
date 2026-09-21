'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

export interface ParallaxOptions {
  /** Movement in px at full scroll progress. */
  distance?: number;
  start?: string;
  end?: string;
}

/**
 * GPU-friendly transform-only parallax tied to scroll progress.
 * Never toggles opacity or layout properties. Skipped entirely under
 * prefers-reduced-motion — parallax is non-essential motion.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: ParallaxOptions = {},
) {
  const ref = useRef<T>(null);
  const { distance = 80, start = 'top bottom', end = 'bottom top' } = options;

  useGSAP(
    () => {
      const { gsap } = getGsap();
      const el = ref.current;
      if (!el) return;

      // Reduced motion: leave the element at its natural position rather
      // than scrolling it around the viewport.
      if (prefersReducedMotion()) return;

      gsap.fromTo(
        el,
        { y: -distance },
        {
          y: distance,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return ref;
}
