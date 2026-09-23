'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';

export interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  /** How far the button drifts toward the cursor, in px. */
  strength?: number;
}

export function MagneticButton({
  children,
  href,
  className,
  strength = 12,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useGSAP(
    () => {
      const { gsap } = getGsap();
      const el = ref.current;
      if (!el) return;

      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        xTo((relX / (rect.width / 2)) * strength);
        yTo((relY / (rect.height / 2)) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    },
    { scope: ref },
  );

  const classes = cn(
    'group inline-flex items-center gap-2 rounded-sm border border-line',
    'px-6 py-3 font-sans text-sm font-medium text-text-primary transition-colors',
    'duration-normal hover:border-line-strong',
    className,
  );

  if (href) {
    return (
      <a ref={ref} href={href} className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref} type="button" className={classes}>
      {children}
    </button>
  );
}
