'use client';

import { ReactLenis, type LenisRef } from 'lenis/react';
import { useEffect, useRef, useState } from 'react';
import { getGsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

/**
 * Lenis smooth scroll, wired into the GSAP ticker so ScrollTrigger
 * stays in sync. Disabled entirely under prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Read the preference in an effect, not in render: matchMedia during
  // render would risk a hydration mismatch between the SSR output and a
  // reduced-motion client. CustomCursor uses the same pattern.
  const [reduced, setReduced] = useState(false);
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();

    // lenis@1.3 publishes the instance on the ReactLenis ref (LenisRef.lenis),
    // not on window.__lenis — that global is never set, so the ref is the
    // only path. The `root` prop registers the instance in an internal
    // module store, not on window.
    const ticker = (time: number) => {
      lenisRef.current?.lenis?.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
    };
  }, []);

  if (reduced) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        lerp: 0.1,
        // Lenis would otherwise schedule its own requestAnimationFrame loop
        // on top of the one we drive from the GSAP ticker below, advancing
        // scroll on a different clock than ScrollTrigger reads it.
        autoRaf: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
