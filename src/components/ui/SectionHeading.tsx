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
        'font-display text-4xl font-bold leading-[0.95] text-text-primary',
        'md:text-6xl',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
