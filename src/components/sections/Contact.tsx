'use client';

import { useGsapFadeIn } from '@/components/animations/useGsapFadeIn';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { MagneticButton } from '@/components/ui/MagneticButton';

const SOCIALS = [
  { label: 'GitHub', href: '' },
  { label: 'LinkedIn', href: '' },
  { label: 'Twitter / X', href: '' },
  { label: 'Instagram', href: '' },
] as const;

export function Contact() {
  const socialsRef = useGsapFadeIn<HTMLUListElement>({
    stagger: 0.08,
    staggerSelector: '[data-social]',
  });

  return (
    <section
      id="contact"
      className="relative flex min-h-screen flex-col justify-center overflow-hidden px-6 py-[var(--section-padding)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-glow blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-[var(--content-max-width)]">
        <SectionHeading className="mb-10 text-center md:text-left">
          Let&rsquo;s Work Together
        </SectionHeading>

        <a
          href="mailto:"
          data-cursor="hover"
          className="inline-block font-display text-2xl text-text-primary transition-colors duration-fast hover:text-accent md:text-4xl"
        >
          Get in touch
        </a>

        <ul
          ref={socialsRef}
          className="mt-12 flex flex-wrap gap-4"
        >
          {SOCIALS.map((social) => (
            <li key={social.label} data-social>
              {social.href ? (
                <a
                  href={social.href}
                  data-cursor="hover"
                  className="text-sm text-text-secondary transition-colors duration-fast hover:text-accent"
                >
                  {social.label}
                </a>
              ) : (
                <span className="text-sm text-text-muted">{social.label}</span>
              )}
            </li>
          ))}
        </ul>

        {/* Formspree-ready static form — paste your form action URL. */}
        <form
          action=""
          method="POST"
          className="mt-16 grid max-w-xl gap-4"
        >
          <label className="grid gap-2 text-sm text-text-muted">
            Name
            <input
              type="text"
              name="name"
              required
              className="rounded-lg border border-white/10 bg-bg-secondary px-4 py-3 text-text-primary outline-none focus:border-accent"
            />
          </label>
          <label className="grid gap-2 text-sm text-text-muted">
            Email
            <input
              type="email"
              name="email"
              required
              className="rounded-lg border border-white/10 bg-bg-secondary px-4 py-3 text-text-primary outline-none focus:border-accent"
            />
          </label>
          <label className="grid gap-2 text-sm text-text-muted">
            Message
            <textarea
              name="message"
              rows={5}
              required
              className="resize-y rounded-lg border border-white/10 bg-bg-secondary px-4 py-3 text-text-primary outline-none focus:border-accent"
            />
          </label>
          <MagneticButton>Send Message</MagneticButton>
        </form>
      </div>
    </section>
  );
}
