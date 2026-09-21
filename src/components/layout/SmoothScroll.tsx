'use client';

import { ReactLenis, type LenisRef } from 'lenis/react';
import { useEffect, useRef } from 'react';
import { getGsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

/**
 * Lenis smooth scroll, wired into the GSAP ticker so ScrollTrigger
 * stays in sync. Disabled entirely under prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();

    const ticker = (time: number) => {
      if (typeof window !== 'undefined' && window.__lenis) {
        window.__lenis.raf(time * 1000);
      } else {
        lenisRef.current?.lenis?.raf(time * 1000);
      }
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
    };
  }, []);

  if (prefersReducedMotion()) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
