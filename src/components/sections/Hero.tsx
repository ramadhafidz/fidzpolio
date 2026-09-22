'use client';

import { useSplitReveal } from '@/components/animations/useSplitReveal';

export function Hero() {
  const nameRef = useSplitReveal<HTMLHeadingElement>({
    type: 'chars',
    stagger: 0.05,
    start: 'top 90%',
  });

  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-[var(--safe)] py-[var(--header-height)]"
    >
      <div className="mx-auto w-full max-w-[var(--layout-width)]">
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.1em] text-text-secondary">
          Portfolio 2026
        </p>

        <h1 className="font-display uppercase leading-[0.8] tracking-[-0.03em] text-text-primary text-[clamp(2.75rem,14vw,9.5rem)]">
          <span className="sr-only">Ramadhafidz</span>
          <span ref={nameRef}>Ramadhafidz</span>
        </h1>

        <p className="mt-6 font-sans text-lg text-text-secondary md:text-2xl">
          Creative Developer
        </p>
      </div>

      <div className="absolute bottom-8 left-[var(--safe)] flex items-center gap-3 text-text-secondary">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em]">Scroll</span>
        <span aria-hidden className="h-12 w-px bg-text-primary/40" />
      </div>
    </section>
  );
}
