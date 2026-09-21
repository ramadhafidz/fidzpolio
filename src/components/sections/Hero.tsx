'use client';

import { useSplitReveal } from '@/components/animations/useSplitReveal';
import { useParallax } from '@/components/animations/useParallax';

export function Hero() {
  const nameRef = useSplitReveal<HTMLHeadingElement>({
    type: 'chars',
    stagger: 0.05,
    start: 'top 90%',
  });
  const taglineRef = useSplitReveal<HTMLParagraphElement>({
    type: 'lines',
    stagger: 0.12,
  });
  const decorRef = useParallax<HTMLDivElement>({ distance: 30 });

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Decorative lines animating in from edges */}
      <div
        ref={decorRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
      >
        <span className="absolute left-0 top-1/4 h-px w-1/4 bg-gradient-to-r from-accent/60 to-transparent" />
        <span className="absolute right-0 top-2/3 h-px w-1/4 bg-gradient-to-l from-accent/60 to-transparent" />
      </div>

      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-text-muted">
        Portfolio
      </p>

      <h1
        className="font-display text-[clamp(3rem,12vw,10rem)] font-extrabold leading-[0.9] text-text-primary"
      >
        <span className="sr-only">Ramadhafidz</span>
        <span ref={nameRef} aria-hidden>Ramadhafidz</span>
      </h1>

      <p
        ref={taglineRef}
        className="mt-6 overflow-hidden text-lg text-text-secondary md:text-2xl"
      >
        <span data-line className="block">Creative Developer</span>
      </p>

      <div className="mt-16 flex flex-col items-center gap-3 text-text-muted">
        <span className="text-[0.65rem] uppercase tracking-[0.25em]">Scroll</span>
        <span
          aria-hidden
          className="h-12 w-px animate-pulse bg-gradient-to-b from-accent to-transparent"
        />
      </div>
    </section>
  );
}
