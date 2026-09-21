'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

export interface HorizontalPinOptions {
  /** Selector for the track that translates horizontally. */
  trackSelector: string;
  /** Desktop only — mobile stacks vertically per spec. */
  minWidth?: number;
}

/**
 * Pins a section and translates an inner track horizontally as the user
 * scrolls. Disabled below `minWidth`, where the track must already be
 * laid out as a vertical stack by CSS. Also skipped under
 * prefers-reduced-motion, where pinning and translating would fight the
 * native scroll the user asked for.
 */
export function useHorizontalPin<T extends HTMLElement = HTMLElement>(
  options: HorizontalPinOptions,
) {
  const ref = useRef<T>(null);
  const { trackSelector, minWidth = 1024 } = options;

  useGSAP(
    () => {
      const { gsap } = getGsap();
      const section = ref.current;
      const track = section?.querySelector<HTMLElement>(trackSelector);
      if (!section || !track) return;

      // Reduced motion: no pin, no horizontal translation — the track
      // stays a plain vertical stack, fully reachable by native scroll.
      if (prefersReducedMotion()) return;

      const mm = gsap.matchMedia();
      mm.add(`(min-width: ${minWidth}px)`, () => {
        const getScrollDistance = () => track.scrollWidth - section.offsetWidth;
        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return ref;
}
