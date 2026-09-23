'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

export interface MarqueeOptions {
  /** Pixels per second. */
  speed?: number;
  /** 1 moves left-to-right, -1 the reverse. */
  direction?: 1 | -1;
  paused?: boolean;
}

/**
 * Seamless infinite marquee. The caller renders its children twice; the
 * tween translates the track by exactly half its width, then repeats with
 * modifiers — the duplicated half takes the first's place, so the seam is
 * invisible. Transform-only: no layout or opacity properties, ever.
 *
 * Skipped entirely under prefers-reduced-motion, where the track stays in
 * normal flow and is fully reachable by native scroll.
 */
export function useMarquee<T extends HTMLElement = HTMLDivElement>(
  options: MarqueeOptions = {},
) {
  const ref = useRef<T>(null);
  const { speed = 30, direction = 1, paused = false } = options;

  useGSAP(
    () => {
      if (paused) return;
      if (prefersReducedMotion()) return;

      const { gsap } = getGsap();
      const track = ref.current;
      if (!track) return;

      const distance = track.scrollWidth / 2;
      if (distance <= 0) return;

      const tween = gsap.to(track, {
        x: direction * -distance,
        duration: distance / speed,
        ease: 'none',
        repeat: -1,
        modifiers: { x: gsap.utils.unitize((x) => parseFloat(x) % distance) },
      });

      return () => tween.kill();
    },
    { scope: ref },
  );

  return ref;
}
