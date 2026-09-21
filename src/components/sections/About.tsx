'use client';

import { useGsapFadeIn } from '@/components/animations/useGsapFadeIn';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function About() {
  const textRef = useGsapFadeIn<HTMLDivElement>({
    stagger: 0.08,
    staggerSelector: '[data-line]',
  });
  const visualRef = useGsapFadeIn<HTMLDivElement>({ y: 60, duration: 1.2 });

  return (
    <section
      id="about"
      className="mx-auto grid max-w-[var(--content-max-width)] gap-12 px-6 py-[var(--section-padding)] md:grid-cols-2 md:items-center md:px-10"
    >
      <div ref={textRef}>
        <SectionHeading className="mb-8">About</SectionHeading>
        <div className="space-y-6 text-lg leading-relaxed text-text-secondary">
          <p data-line>
            I&rsquo;m Hafidz Ramadhan Ghiffari, a Creative Developer who treats
            the browser as a canvas and code as a material.
          </p>
          <p data-line>
            I build cinematic, scroll-driven experiences where animation serves
            the story — not the other way around.
          </p>
          <p data-line>
            Currently exploring the seam between motion design and engineering.
          </p>
        </div>
      </div>

      <div ref={visualRef} className="relative aspect-[4/5] w-full">
        <div
          aria-hidden
          className="absolute -inset-6 rounded-full bg-accent-glow blur-3xl"
        />
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-bg-secondary to-bg-primary">
          {/* Placeholder visual — replace with a real photo */}
          <span className="absolute bottom-4 left-4 text-xs text-text-muted">
            Photo coming soon
          </span>
        </div>
      </div>
    </section>
  );
}
