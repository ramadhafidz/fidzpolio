'use client';

import { useEffect, useState } from 'react';

/**
 * lenis.dev's only persistent chrome: a 1px hairline at the top of the
 * viewport scaled by scroll progress. Reads window scroll directly rather
 * than the Lenis instance, so it behaves identically when Lenis is
 * disabled under prefers-reduced-motion.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      aria-hidden
      data-scroll-progress
      className="fixed inset-x-0 top-0 z-[9500] h-px origin-left bg-text-primary"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
