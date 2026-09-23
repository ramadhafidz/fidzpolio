'use client';

import { useSplitReveal } from '@/components/animations/useSplitReveal';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  children: string;
  className?: string;
  as?: 'h2' | 'h3';
}

export function SectionHeading({
  children,
  className,
  as = 'h2',
}: SectionHeadingProps) {
  const ref = useSplitReveal<HTMLHeadingElement>();
  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={cn(
        'font-display uppercase leading-[0.9] tracking-[-0.03em] text-text-primary',
        'text-4xl md:text-6xl',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
