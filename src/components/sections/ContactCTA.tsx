'use client';

import { useGsapFadeIn } from '@/components/animations/useGsapFadeIn';

const SOCIALS = [
  { label: 'GitHub', href: '' },
  { label: 'LinkedIn', href: '' },
  { label: 'Twitter / X', href: '' },
  { label: 'Instagram', href: '' },
] as const;

export function ContactCTA() {
  const boxRef = useGsapFadeIn<HTMLDivElement>();

  return (
    <section
      id="contact"
      className="flex min-h-screen items-center px-[var(--safe)] py-[var(--spacer-lg)]"
    >
      <div
        ref={boxRef}
        className="mx-auto w-full max-w-[var(--layout-width)] rounded-md border border-line px-6 py-12 md:px-12 md:py-20"
      >
        <p className="mb-6 font-mono text-xs uppercase tracking-[0.1em] text-text-secondary">
          Contact
        </p>

        <h2 className="font-display uppercase leading-[0.85] tracking-[-0.03em] text-text-primary text-5xl md:text-7xl">
          Let&rsquo;s build something
        </h2>

        <a
          href="mailto:"
          className="mt-8 inline-block font-display uppercase text-2xl text-text-primary underline underline-offset-4 transition-opacity duration-fast hover:opacity-60 md:text-4xl"
        >
          Get in touch
        </a>

        <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-8">
          {SOCIALS.map((social) => (
            <li key={social.label}>
              {social.href ? (
                <a
                  href={social.href}
                  className="font-mono text-xs uppercase tracking-[0.1em] text-text-secondary transition-colors duration-fast hover:text-text-primary"
                >
                  {social.label}
                </a>
              ) : (
                <span className="font-mono text-xs uppercase tracking-[0.1em] text-text-primary/40">
                  {social.label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
