'use client';

export function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-[var(--layout-width)] flex-col items-center justify-between gap-6 px-[var(--safe)] py-10 md:flex-row">
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-text-secondary">
          &copy; 2026 Ramadhafidz
        </p>
        <p className="font-mono text-xs uppercase tracking-[0.1em] text-text-secondary">
          Built with Next.js &amp; GSAP
        </p>
        <button
          type="button"
          onClick={scrollTop}
          className="font-mono text-xs uppercase tracking-[0.1em] text-text-primary transition-opacity duration-fast hover:opacity-60"
        >
          Back to top &uarr;
        </button>
      </div>
    </footer>
  );
}
