'use client';

export function Footer() {
  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-[var(--content-max-width)] flex-col items-center justify-between gap-6 px-6 md:flex-row md:px-10">
        <p className="text-sm text-text-muted">
          &copy; 2026 Ramadhafidz
        </p>
        <p className="text-sm text-text-muted">
          Built with Next.js &amp; GSAP
        </p>
        <button
          type="button"
          onClick={scrollTop}
          data-cursor="hover"
          className="text-sm text-text-secondary transition-colors duration-fast hover:text-accent"
        >
          Back to top &uarr;
        </button>
      </div>
    </footer>
  );
}
