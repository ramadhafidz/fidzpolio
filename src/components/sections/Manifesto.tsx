'use client';

import { useGsapFadeIn } from '@/components/animations/useGsapFadeIn';
import { useSplitReveal } from '@/components/animations/useSplitReveal';
import { SectionHeading } from '@/components/ui/SectionHeading';

const PILLARS = [
  {
    index: '01',
    title: 'Motion serves story',
    body: 'Animation guides attention; it never competes with the content.',
  },
  {
    index: '02',
    title: 'Built to be maintained',
    body: 'Typed components, documented tokens, and tests that pin behavior.',
  },
  {
    index: '03',
    title: 'Performance is the feel',
    body: 'Transform-only animation on a single scroll clock, frame for frame.',
  },
];

export function Manifesto() {
  const textRef = useSplitReveal<HTMLParagraphElement>({ type: 'lines' });
  const gridRef = useGsapFadeIn<HTMLDivElement>({
    stagger: 0.08,
    staggerSelector: '[data-cell]',
  });

  return (
    <section
      id="manifesto"
      className="mx-auto max-w-[var(--layout-width)] px-[var(--safe)] py-[var(--spacer-lg)]"
    >
      <SectionHeading className="mb-12">Manifesto</SectionHeading>

      <p
        ref={textRef}
        className="max-w-2xl text-xl leading-[1.33] text-text-primary md:text-2xl"
      >
        <span data-line className="block">
          I&rsquo;m Hafidz Ramadhan Ghiffari, a Creative Developer who treats the browser as
          a canvas and code as a material.
        </span>
        <span data-line className="block">
          I build cinematic, scroll-driven experiences where animation serves the story —
          not the other way around.
        </span>
      </p>

      <div
        ref={gridRef}
        className="mt-16 grid grid-cols-1 gap-px bg-line md:grid-cols-3"
      >
        {PILLARS.map((pillar) => (
          <div
            key={pillar.index}
            data-cell
            className="bg-bg p-8 transition-colors duration-fast hover:bg-surface-hover"
          >
            <span className="font-mono text-xs text-text-secondary">{pillar.index}</span>
            <h3 className="mt-6 font-display uppercase leading-none text-text-primary text-3xl">
              {pillar.title}
            </h3>
            <p className="mt-4 text-text-secondary">{pillar.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
