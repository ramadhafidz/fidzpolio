'use client';

import { useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap } from '@/lib/gsap';


export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;
    setEnabled(true);

    const onOver = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('[data-cursor="hover"]')) {
        setHovering(true);
      }
    };
    const onOut = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('[data-cursor="hover"]')) {
        setHovering(false);
      }
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  useGSAP(
    () => {
      const { gsap } = getGsap();
      const dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
      if (!dot) return;

      const xTo = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' });
      const yTo = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' });
      const onMove = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      window.addEventListener('mousemove', onMove);
      return () => window.removeEventListener('mousemove', onMove);
    },
    { dependencies: [enabled] },
  );

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      data-cursor-dot
      className={[
        'pointer-events-none fixed left-0 top-0 z-[10000] -ml-1 -mt-1 h-2 w-2',
        'rounded-full bg-accent transition-transform duration-fast ease-out-expo',
        hovering ? 'scale-[2.5] opacity-70' : 'scale-100 opacity-100',
      ].join(' ')}
    />
  );
}
