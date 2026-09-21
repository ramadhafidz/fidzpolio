'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Contact', href: '#contact' },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[9000] transition-colors duration-normal',
        scrolled
          ? 'border-b border-white/5 bg-bg-primary/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-[var(--content-max-width)] items-center justify-between px-6 py-5 md:px-10">
        <a
          href="#hero"
          data-cursor="hover"
          className="font-display text-lg font-bold tracking-tight text-text-primary"
        >
          Ramadhafidz
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                data-cursor="hover"
                className="text-sm text-text-secondary transition-colors duration-fast hover:text-accent"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              data-cursor="hover"
              className="rounded-full border border-accent/40 px-4 py-2 text-sm text-accent transition-colors duration-fast hover:bg-accent hover:text-bg-primary"
            >
              Let&rsquo;s Talk
            </a>
          </li>
        </ul>

        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          data-cursor="hover"
        >
          <span
            className={cn(
              'h-0.5 w-6 bg-text-primary transition-transform duration-fast',
              menuOpen && 'translate-y-2 rotate-45',
            )}
          />
          <span
            className={cn(
              'h-0.5 w-6 bg-text-primary transition-opacity duration-fast',
              menuOpen && 'opacity-0',
            )}
          />
          <span
            className={cn(
              'h-0.5 w-6 bg-text-primary transition-transform duration-fast',
              menuOpen && '-translate-y-2 -rotate-45',
            )}
          />
        </button>
      </nav>

      {/* Mobile overlay menu */}
      <div
        className={cn(
          'fixed inset-0 top-0 z-[-1] flex flex-col items-center justify-center gap-8',
          'bg-bg-primary transition-opacity duration-normal md:hidden',
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="font-display text-4xl font-bold text-text-primary"
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}
