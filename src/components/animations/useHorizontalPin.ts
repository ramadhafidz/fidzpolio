'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap } from '@/lib/gsap';

export interface HorizontalPinOptions {
  /** Selector for the track that translates horizontally. */
  trackSelector: string;
  /** Desktop only — mobile stacks vertically per spec. */
  minWidth?: number;
}

/**
 * Pins a section and translates an inner track horizontally as the user
 * scrolls. Disabled below `minWidth`, where the track must already be
 * laid out as a vertical stack by CSS.
 */
export function useHorizontalPin<T extends HTMLElement = HTMLElement>(
  options: HorizontalPinOptions,
) {
  const ref = useRef<T>(null);
  const { trackSelector, minWidth = 1024 } = options;

  useGSAP(
    () => {
      const { gsap, ScrollTrigger } = getGsap();
      const section = ref.current;
      const track = section?.querySelector<HTMLElement>(trackSelector);
      if (!section || !track) return;

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
