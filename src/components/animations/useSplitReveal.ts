'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap, EASE, DURATION } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

export interface SplitRevealOptions {
  type?: 'chars' | 'lines';
  duration?: number;
  stagger?: number;
  start?: string;
}

/**
 * Splits text into characters (or wraps lines) and staggers them in.
 * Callers must pass a ref to the text node. On reduced motion the
 * animation is skipped and the text stays fully visible.
 */
export function useSplitReveal<T extends HTMLElement = HTMLHeadingElement>(
  options: SplitRevealOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    type = 'chars',
    duration = DURATION.slow,
    stagger = 0.04,
    start = 'top 85%',
  } = options;

  useGSAP(
    () => {
      const { gsap } = getGsap();
      const el = ref.current;
      if (!el || !el.textContent) return;

      // Reduced motion: leave the text node untouched and fully visible.
      // Splitting into aria-hidden spans here would hide it from assistive
      // tech with no animation to justify that cost.
      if (prefersReducedMotion()) return;

      if (type === 'lines') {
        const lines = Array.from(el.querySelectorAll<HTMLElement>('[data-line]'));
        if (lines.length === 0) return;
        gsap.set(lines, { clipPath: 'inset(0 0 100% 0)' });
        gsap.to(lines, {
          clipPath: 'inset(0 0 -10% 0)',
          duration,
          ease: EASE.outExpo,
          stagger,
          scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
        });
        return;
      }

      const text = el.textContent;
      el.setAttribute('aria-label', text);
      el.textContent = '';
      const chars = text.split('').map((ch) => {
        const span = document.createElement('span');
        span.setAttribute('aria-hidden', 'true');
        span.style.display = 'inline-block';
        span.textContent = ch === ' ' ? ' ' : ch;
        el.appendChild(span);
        return span;
      });

      gsap.set(chars, { yPercent: 120, opacity: 0 });
      gsap.to(chars, {
        yPercent: 0,
        opacity: 1,
        duration,
        ease: EASE.outExpo,
        stagger,
        scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
      });
    },
    { scope: ref },
  );

  return ref;
}
