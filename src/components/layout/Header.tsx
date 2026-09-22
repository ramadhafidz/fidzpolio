'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

const LINKS = [
  { label: 'Manifesto', href: '#manifesto' },
  { label: 'Work', href: '#work' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Contact', href: '#contact' },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 56);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Escape closes the open menu. Keyboard and AT users cannot see the
  // overlay while it is visually hidden, so it must not stay reachable.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[9000] transition-colors duration-normal',
        scrolled
          ? 'border-b border-line bg-bg'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-[var(--header-height)] max-w-[var(--layout-width)] items-center justify-between px-[var(--safe)]">
        <a
          href="#hero"
          className="font-sans text-sm font-bold uppercase tracking-[0.15em] text-text-primary"
        >
          RAMADHAFIDZ
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-xs uppercase tracking-[0.1em] text-text-secondary transition-colors duration-fast hover:text-text-primary"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="flex items-center gap-2 border border-line px-3 py-1.5">
            <span aria-hidden className="h-1.5 w-1.5 rounded-xs bg-text-primary" />
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.1em] text-text-primary">
              Available for work
            </span>
          </li>
        </ul>

        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
        >
          <span
            className={cn(
              'h-px w-6 bg-text-primary transition-transform duration-fast',
              menuOpen && 'translate-y-2 rotate-45',
            )}
          />
          <span
            className={cn(
              'h-px w-6 bg-text-primary transition-opacity duration-fast',
              menuOpen && 'opacity-0',
            )}
          />
          <span
            className={cn(
              'h-px w-6 bg-text-primary transition-transform duration-fast',
              menuOpen && '-translate-y-2 -rotate-45',
            )}
          />
        </button>
      </nav>

      {/* Mobile overlay menu */}
      <div
        id="mobile-menu"
        // While closed the links must not be focusable or exposed to AT —
        // opacity/pointer-events alone leave them in the tab order. `hidden`
        // drops them from the a11y tree and removes them from focus order;
        // `inert` is belt-and-braces for browsers that ignore `hidden`
        // inside a flex container.
        hidden={!menuOpen}
        inert={!menuOpen}
        className={cn(
          'fixed inset-0 top-0 z-[-1] flex flex-col items-center justify-center gap-8',
          'bg-bg transition-opacity duration-normal md:hidden',
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="font-display uppercase leading-none text-text-primary text-4xl"
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}
