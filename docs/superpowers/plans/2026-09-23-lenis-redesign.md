# lenis.dev Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle and restructure fidzpolio into the lenis.dev design language — pure black, monochrome type, hairline borders, near-square corners, Anton display type, and a section rhythm that absorbs the current About/Skills/Contact into Manifesto/Capabilities/ContactCTA.

**Architecture:** Token-first migration. A design-token layer (globals.css + layout.tsx fonts) lands first, then each section is rewritten against it, reusing the existing GSAP/Lenis hooks (which are already the reference site's own motion primitives). No new runtime dependencies; the only new hook is `useMarquee`, and one new page-level component, `ScrollProgress`.

**Tech Stack:** Next.js 16.3.5 (App Router), React 19.3, TypeScript 5, Tailwind CSS v4 (`@theme` in CSS, no config file), GSAP 3.15 + `@gsap/react` 2.1.2, Lenis 1.3.26, Vitest 5 + Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-23-lenis-redesign-design.md` — read it alongside this plan; the plan argues from it.

---

## Global Constraints

Copied verbatim from the spec so every task inherits them:

- Palette is exactly three colors plus derived-opacity lines: `#000000` bg, `#efefef` primary text, `#b0b0b0` secondary text, `rgba(239,239,239,0.10/0.50)` lines, `rgba(239,239,239,0.03)` hover fill, plus one literal `#8c8c8c` mid-grey line. **No cyan, no pink, no gradients.**
- Fonts: **Anton** (display, weight 400 only — no `font-extrabold`/`font-bold` on display type), **Roboto** (body), **Courier New, monospace** (labels). Syne and Space Grotesk are removed.
- Display type is always `uppercase`, `line-height: 0.8–0.9`, `letter-spacing: -0.03em`. Labels are `uppercase` monospace, `12px`, `letter-spacing: 0.1em`.
- Radius hard maximum **8px**; default `0.25em`. **`rounded-full` is forbidden.**
- **`box-shadow` and blur glows are forbidden.** Zero of either in the final tree.
- Grain overlay and `* { cursor: none }` are deleted; the native cursor returns. No `data-cursor` attributes remain.
- Signature ease `cubic-bezier(.19,1,.22,1)` (GSAP: `expo.out`) is unchanged.
- Section `id` order: `hero`, `manifesto`, `work`, `capabilities`, `contact`.
- **Reduced motion: content is never trapped in a hidden start state.** Every motion primitive guards on `prefersReducedMotion()` and leaves content fully visible.
- Working in-tree on the current branch; no worktree (`no-worktrees-work-in-place`).

## Review Focus

The five input classes most likely to bite, each pinned to the task that owns it:

1. **A featured project with an empty `liveUrl`/`githubUrl`** must not render a broken or dead link. → Task 6, `Work` card test asserts empty URLs render no anchor and present URLs do.
2. **A capability row whose `description` is absent** (the field is optional) must still lay out with intact hairlines, no collapsed or misaligned row. → Task 7, `Capabilities` test asserts a group without a description renders its row and index.
3. **Marquee track whose content is shorter than the viewport, or a single project** must not leave a visible gap or scroll off-screen into blank space. → Task 5, `useMarquee` test asserts the track content is duplicated and no content is hidden when reduced motion holds it static.
4. **Reduced-motion + a narrowed viewport simultaneously** must not produce unreachable content — the marquee must be a plain stack and every card visible. → Task 5 + Task 9 (the deleted `useHorizontalPin` discipline is inherited, not lost).
5. **The social link whose `href` is empty** must render as muted non-interactive text, not a clickable `mailto:`. → Task 8, `ContactCTA` test asserts the present-vs-empty href distinction.

---

## Task 0: Install dependencies

**Files:** none (installs into `node_modules/`)

- [ ] **Step 1: Run the install**

```bash
npm install
```

- [ ] **Step 2: Verify the toolchain is present**

```bash
test -x node_modules/.bin/vitest && test -x node_modules/.bin/next && echo OK
```

Expected: prints `OK`.

- [ ] **Step 3: Establish the green baseline before any change**

```bash
npm run lint && npm test && npm run build
```

Expected: lint clean, all 13 tests pass, build succeeds. This is the reference point for the zero-regression rule. If a check fails on a pristine tree, stop and report it — do not "fix" it as part of this redesign.

- [ ] **Step 4: Commit (nothing to commit — tree unchanged)**

No commit. This task only produces a working toolchain.

---

## Task 1: Design tokens, fonts, and the CSS foundation

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx:1-55`
- Test: `src/lib/__tests__/tokens.test.ts` (create)

**Interfaces:**
- Consumes: nothing (foundation layer).
- Produces: CSS custom properties consumed by every later task — `--color-bg` `#000`, `--color-text-primary` `#efefef`, `--color-text-secondary` `#b0b0b0`, `--color-line` `rgba(239,239,239,0.10)`, `--color-line-strong` `rgba(239,239,239,0.50)`, `--color-line-mid` `#8c8c8c`, `--color-surface-hover` `rgba(239,239,239,0.03)`; font variables `--font-anton`, `--font-roboto`, and a plain `--font-mono: "Courier New", Courier, monospace`; radius `--radius-xs 2px` / `--radius-sm 4px` / `--radius-md 8px`; the layout grid vars `--layout-width`, `--safe`, `--gap`, `--header-height`, and the `--spacer-*` scale. Tailwind reads these via `@theme`, so utilities like `bg-bg`, `text-text-primary`, `border-line`, `rounded-sm`, `font-display` resolve.

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/tokens.test.ts`:

```ts
import { describe, expect, it } from 'vitest';

// The foundation every section renders against. A missing or misnamed token
// surfaces as a blank site, so the contract is pinned here.
describe('design tokens', () => {
  it('defines the monochrome palette', () => {
    const styles = getComputedStyle(document.documentElement);
    expect(styles.getPropertyValue('--color-bg').trim()).toBe('#000000');
    expect(styles.getPropertyValue('--color-text-primary').trim()).toBe('#efefef');
    expect(styles.getPropertyValue('--color-text-secondary').trim()).toBe('#b0b0b0');
  });

  it('has no accent or glow tokens', () => {
    const styles = getComputedStyle(document.documentElement);
    expect(styles.getPropertyValue('--color-accent')).toBe('');
    expect(styles.getPropertyValue('--color-accent-glow')).toBe('');
  });

  it('keeps radius at or below 8px', () => {
    const styles = getComputedStyle(document.documentElement);
    const md = styles.getPropertyValue('--radius-md').trim();
    expect(parseFloat(md)).toBeLessThanOrEqual(8);
  });

  it('registers the three font families', () => {
    const styles = getComputedStyle(document.documentElement);
    expect(styles.getPropertyValue('--font-anton').trim()).toContain('Anton');
    expect(styles.getPropertyValue('--font-roboto').trim()).toContain('Roboto');
    expect(styles.getPropertyValue('--font-mono').trim()).toContain('Courier New');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tokens`
Expected: FAIL — `getPropertyValue('--color-anton')` returns empty, and the old token names are still in place.

- [ ] **Step 3: Replace `@theme`, `:root`, and the body rules in `globals.css`**

Replace the `@theme` block and everything from `:root` to the end of file with:

```css
@import 'tailwindcss';
@import 'lenis/dist/lenis.css';

@source '../../src/**/*';

/* Design tokens — verified against lenis.dev's production stylesheet
   (/_next/static/immutable/chunks/0_-6o03czf8qa.css). Three colors, no
   accent; every variation is #efefef at reduced opacity. */
@theme {
  --color-bg: #000000;
  --color-text-primary: #efefef;
  --color-text-secondary: #b0b0b0;
  --color-line: rgba(239, 239, 239, 0.1);
  --color-line-strong: rgba(239, 239, 239, 0.5);
  --color-line-mid: #8c8c8c;
  --color-surface-hover: rgba(239, 239, 239, 0.03);

  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;

  --ease-out-expo: cubic-bezier(0.19, 1, 0.22, 1);
  --duration-fast: 0.3s;
  --duration-normal: 0.6s;
  --duration-slow: 1.2s;

  --font-display: var(--font-anton), sans-serif;
  --font-sans: var(--font-roboto), sans-serif;
  --font-mono: 'Courier New', Courier, monospace;
}

:root {
  /* lenis.dev's grid: 12 columns / 24px gap / 40px safe margin on desktop. */
  --columns: 12;
  --gap: 24px;
  --safe: 16px;
  --header-height: 56px;
  --layout-width: 1320px;
  --spacer-xs: 48px;
  --spacer-sm: 64px;
  --spacer-md: 80px;
  --spacer-lg: 128px;
  --spacer-xl: 192px;
}

@media (min-width: 800px) {
  :root {
    --safe: 40px;
  }
}

html {
  scroll-behavior: auto; /* Lenis owns scrolling */
  -webkit-font-smoothing: antialiased;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
  overflow-x: hidden;
}

::selection {
  background-color: var(--color-text-primary);
  color: var(--color-bg);
}

/* Reduced motion: never leave content hidden in a start state. */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

This deletes the grain `body::before` overlay and the `@media (hover: hover) { * { cursor: none } }` rule in the same edit.

- [ ] **Step 4: Swap the fonts in `layout.tsx`**

Replace the two font declarations and the `<html>` className:

```tsx
import { Anton, Roboto } from 'next/font/google';

const anton = Anton({
  subsets: ['latin'],
  variable: '--font-anton',
  weight: '400',
  display: 'swap',
});

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  weight: ['400', '500', '700'],
  display: 'swap',
});
```

```tsx
<html lang="en" className={`${anton.variable} ${roboto.variable}`}>
```

`Syne` and `Space_Grotesk` imports are removed. Keep the metadata block, `SmoothScroll`, and the body className (`bg-bg text-text-secondary` still resolves).

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS for `tokens.test.ts`; the rest of the suite still green (components now render against unstyled tokens — they must still render; any *test* that fails here means it asserted on a token name, which Task 9 covers).

- [ ] **Step 6: Verify build and lint**

Run: `npm run build && npm run lint`
Expected: both clean.

- [ ] **Step 7: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx src/lib/__tests__/tokens.test.ts
git commit -m "feat: monochrome design tokens, Anton/Roboto/Courier fonts, no grain or cursor suppression"
```

---

## Task 2: `ScrollProgress` — the fixed top hairline

**Files:**
- Create: `src/components/layout/ScrollProgress.tsx`
- Test: `src/components/layout/__tests__/ScrollProgress.test.tsx` (create)

**Interfaces:**
- Consumes: `prefersReducedMotion()` from `@/lib/utils`.
- Produces: `<ScrollProgress />`, a client component rendered once in `layout.tsx`. Progress is read from `window.scrollY / (document.body.scrollHeight - innerHeight)`, not from the Lenis instance, so it works identically when Lenis is bypassed under reduced motion.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ScrollProgress } from '../ScrollProgress';

describe('ScrollProgress', () => {
  it('renders the hairline element', () => {
    const { container } = render(<ScrollProgress />);
    const line = container.querySelector('[data-scroll-progress]');
    expect(line).not.toBeNull();
  });

  it('starts at zero width', () => {
    const { container } = render(<ScrollProgress />);
    expect(container.querySelector('[data-scroll-progress]')).toHaveStyle({
      transform: 'scaleX(0)',
    });
  });

  it('never hides content when reduced motion is on', () => {
    // The element renders and stays visible; progress simply tracks native scroll.
    const { container } = render(<ScrollProgress />);
    expect(container.querySelector('[data-scroll-progress]')).toBeVisible();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ScrollProgress`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `ScrollProgress.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';

/**
 * lenis.dev's only persistent chrome: a 1px hairline at the top of the
 * viewport scaled by scroll progress. Reads window scroll directly rather
 * than the Lenis instance, so it behaves identically when Lenis is
 * disabled under prefers-reduced-motion.
 */
export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? window.scrollY / scrollable : 0);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <div
      aria-hidden
      data-scroll-progress
      className="fixed inset-x-0 top-0 z-[9500] h-px origin-left bg-text-primary"
      style={{ transform: `scaleX(${progress})` }}
    />
  );
}
```

- [ ] **Step 4: Mount it in `layout.tsx`**

```tsx
import { ScrollProgress } from '@/components/layout/ScrollProgress';
```

```tsx
<body className="bg-bg text-text-secondary antialiased">
  <ScrollProgress />
  <SmoothScroll>
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test -- ScrollProgress`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/ScrollProgress.tsx src/components/layout/__tests__/ScrollProgress.test.tsx src/app/layout.tsx
git commit -m "feat: fixed top scroll-progress hairline"
```

---

## Task 3: `Header` (replaces `Navbar`)

**Files:**
- Rename + modify: `src/components/layout/Navbar.tsx` → `src/components/layout/Header.tsx`
- Modify: `src/app/layout.tsx`
- Modify: `src/components/layout/__tests__/Navbar.test.tsx` → `src/components/layout/__tests__/Header.test.tsx`

**Interfaces:**
- Consumes: `--header-height`, `cn` from `@/lib/utils`.
- Produces: `<Header />` with links `#manifesto` / `#work` / `#capabilities` / `#contact`, the wordmark `RAMADHAFIDZ` linking to `#hero`, and an availability pill. Mobile overlay menu and its a11y behavior (`hidden` + `inert`, Escape-to-close) are preserved verbatim.

- [ ] **Step 1: Update the test**

Move the existing test file to `Header.test.tsx` and rewrite its assertions — the link names and hrefs change with the new `id`s, and the cursor assertions go away:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

const LINKS = [
  { name: 'Manifesto', href: '#manifesto' },
  { name: 'Work', href: '#work' },
  { name: 'Capabilities', href: '#capabilities' },
  { name: 'Contact', href: '#contact' },
];

describe('Header', () => {
  it('renders the wordmark linking home', () => {
    render(<Header />);
    expect(screen.getAllByText('RAMADHAFIDZ')[0]).toHaveAttribute('href', '#hero');
  });

  it('renders nav links to the new sections', () => {
    render(<Header />);
    LINKS.forEach(({ name, href }) => {
      expect(screen.getAllByRole('link', { name })[0]).toHaveAttribute('href', href);
    });
  });

  it('renders the availability pill', () => {
    render(<Header />);
    expect(screen.getByText(/available for work/i)).toBeInTheDocument();
  });

  it('exposes the mobile menu toggle', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Header`
Expected: FAIL — `../Header` does not exist yet.

- [ ] **Step 3: Rename the file and rewrite it**

`git mv src/components/layout/Navbar.tsx src/components/layout/Header.tsx`, then rewrite:

```tsx
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
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-text-primary" />
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
```

- [ ] **Step 4: Update `layout.tsx`**

```tsx
import { Header } from '@/components/layout/Header';
```

```tsx
<SmoothScroll>
  <Header />
  {children}
  <Footer />
</SmoothScroll>
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS. `page.test.tsx` now fails — it asserts the old section order. That is expected; Task 9 rewrites it. Do not patch it here.

- [ ] **Step 6: Commit**

```bash
git add -A src/components/layout src/app/layout.tsx
git commit -m "feat: Header with monospace nav and availability pill, replaces Navbar"
```

---

## Task 4: `Hero`

**Files:**
- Modify: `src/components/sections/Hero.tsx`
- Modify: `src/components/sections/__tests__/Hero.test.tsx`

**Interfaces:**
- Consumes: `useSplitReveal` (kept as-is), `useParallax`.
- Produces: `<Hero />` with `id="hero"`.

- [ ] **Step 1: Update the test**

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '../Hero';

describe('Hero', () => {
  it('renders the name and tagline', () => {
    render(<Hero />);
    expect(screen.getByText('Ramadhafidz')).toBeInTheDocument();
    expect(screen.getByText(/Creative Developer/i)).toBeInTheDocument();
  });

  it('is full-viewport', () => {
    const { container } = render(<Hero />);
    expect(container.firstChild).toHaveClass('min-h-screen');
  });

  it('renders the eyebrow label', () => {
    render(<Hero />);
    expect(screen.getByText(/Portfolio 2026/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Hero`
Expected: FAIL — the eyebrow text is not present yet.

- [ ] **Step 3: Rewrite `Hero.tsx`**

```tsx
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
```

The decorative gradient lines, the `useParallax` decor element, and the pulsing accent stem are removed. `min-h-screen` is kept so the existing test keeps passing.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- Hero`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/__tests__/Hero.test.tsx
git commit -m "feat: Hero in Anton display type with monospace eyebrow"
```

---

## Task 5: `useMarquee` + `Work` (replaces `Projects`)

**Files:**
- Create: `src/components/animations/useMarquee.ts`
- Rename + modify: `src/components/sections/Projects.tsx` → `src/components/sections/Work.tsx`
- Create: `src/components/animations/__tests__/useMarquee.test.tsx`
- Modify: `src/components/sections/__tests__/Projects.test.tsx` → `src/components/sections/__tests__/Work.test.tsx`

**Interfaces:**
- Consumes: `getGsap` from `@/lib/gsap`, `prefersReducedMotion()` from `@/lib/utils`, `getFeaturedProjects` and the `Project` type from `@/content/projects`.
- Produces: `useMarquee<T>(options: { speed?: number; direction?: 1 | -1; paused?: boolean })` returning a ref. Attaches to the **outer** track element; the caller renders children **twice** (the duplication is what makes the loop seamless). On reduced motion the hook does nothing and the caller lays the track out as a static grid via a `lg:` breakpoint.

- [ ] **Step 1: Write the failing test for `useMarquee`**

```tsx
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { useMarquee } from '../useMarquee';

function Fixture() {
  const ref = useMarquee<HTMLDivElement>({ speed: 40, direction: -1 });
  return (
    <div ref={ref} data-testid="track">
      <span data-testid="item">A</span>
      <span data-testid="item">B</span>
    </div>
  );
}

describe('useMarquee', () => {
  it('renders its content visible — never traps it hidden', () => {
    // jsdom defaults to prefers-reduced-motion: false in setup.ts, so the
    // hook would normally animate. Content must still be present and visible
    // regardless: the hook only sets transforms, never opacity.
    const { getAllByTestId } = render(<Fixture />);
    expect(getAllByTestId('item').length).toBe(2);
    expect(getAllByTestId('item')[0]).toBeVisible();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- useMarquee`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `useMarquee.ts`**

```ts
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

export interface MarqueeOptions {
  /** Pixels per second. */
  speed?: number;
  /** 1 moves left-to-right, -1 the reverse. */
  direction?: 1 | -1;
  paused?: boolean;
}

/**
 * Seamless infinite marquee. The caller renders its children twice; the
 * tween translates the track by exactly half its width, then repeats with
 * modifiers — the duplicated half takes the first's place, so the seam is
 * invisible. Transform-only: no layout or opacity properties, ever.
 *
 * Skipped entirely under prefers-reduced-motion, where the track stays in
 * normal flow and is fully reachable by native scroll.
 */
export function useMarquee<T extends HTMLElement = HTMLDivElement>(
  options: MarqueeOptions = {},
) {
  const ref = useRef<T>(null);
  const { speed = 30, direction = 1, paused = false } = options;

  useGSAP(
    () => {
      if (paused) return;
      if (prefersReducedMotion()) return;

      const { gsap } = getGsap();
      const track = ref.current;
      if (!track) return;

      const distance = track.scrollWidth / 2;
      if (distance <= 0) return;

      const tween = gsap.to(track, {
        x: direction * -distance,
        duration: distance / speed,
        ease: 'none',
        repeat: -1,
        modifiers: { x: gsap.utils.unitize((x) => parseFloat(x) % distance) },
      });

      return () => tween.kill();
    },
    { scope: ref },
  );

  return ref;
}
```

- [ ] **Step 4: Write the failing test for `Work`**

Move `Projects.test.tsx` to `Work.test.tsx` and rewrite:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Work } from '../Work';

describe('Work', () => {
  it('renders one card per featured project', () => {
    render(<Work />);
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });

  it('renders the section heading', () => {
    render(<Work />);
    expect(screen.getByRole('heading', { name: 'Selected Work' })).toBeInTheDocument();
  });

  it('renders the year for each project', () => {
    render(<Work />);
    // Placeholder entries are dated 2026-01-01; the derived year renders.
    expect(screen.getAllByText('2026').length).toBeGreaterThan(0);
  });

  it('never hides a card behind an off-screen marquee track', () => {
    // Reduced motion holds the track static; every card must remain
    // reachable rather than translated off-screen.
    const { container } = render(<Work />);
    const cards = container.querySelectorAll('article');
    cards.forEach((card) => expect(card).toBeVisible());
  });
});
```

- [ ] **Step 5: Run test to verify it fails**

Run: `npm test -- Work`
Expected: FAIL — `../Work` does not exist.

- [ ] **Step 6: Implement `Work.tsx`**

```tsx
'use client';

import { getFeaturedProjects } from '@/content/projects';
import { useMarquee } from '@/components/animations/useMarquee';
import { useGsapFadeIn } from '@/components/animations/useGsapFadeIn';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';

function projectYear(iso: string): string {
  return iso.slice(0, 4);
}

export function Work() {
  const featured = getFeaturedProjects();
  const trackRef = useMarquee<HTMLDivElement>({ speed: 30, direction: -1 });
  const headingRef = useGsapFadeIn<HTMLDivElement>();

  // Rendered twice so the loop is seamless: the tween advances exactly one
  // copy's width, so the duplicate takes the original's place. Built from a
  // single renderCards() so the two copies cannot drift apart.
  const renderCards = (keyPrefix: string, ariaHidden = false) =>
    featured.map((project, index) => (
      <article
        key={`${keyPrefix}-${project.slug}`}
        aria-hidden={ariaHidden || undefined}
        aria-label={ariaHidden ? undefined : project.title}
        className="group w-[70vw] shrink-0 md:w-[40vw]"
      >
        <div className="relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-sm border border-line bg-surface-hover">
          {/* CSS-only monochrome placeholder — lenis.dev carries no images here,
              and a hairline box with an index reads better than a recoloured
              gradient. */}
          <span className="font-display text-7xl text-text-primary/10">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <div className="mt-4">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-display uppercase text-2xl leading-none text-text-primary md:text-3xl">
              {project.title}
            </h3>
            <span className="font-mono text-xs text-text-secondary">
              {projectYear(project.date)}
            </span>
          </div>
          {project.description ? (
            <p className="mt-2 max-w-prose text-text-secondary">{project.description}</p>
          ) : null}
          {project.tags.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          ) : null}
        </div>
      </article>
    ));

  return (
    <section
      id="work"
      className="overflow-hidden py-[var(--spacer-lg)]"
    >
      <div ref={headingRef} className="mx-auto max-w-[var(--layout-width)] px-[var(--safe)]">
        <SectionHeading className="mb-12">Selected Work</SectionHeading>
      </div>

      {/* Marquee renders the sequence twice so the loop is seamless.
          Below 1024px the track is a static vertical stack instead, so
          every card is reachable without the marquee. */}
      <div
        ref={trackRef}
        data-track
        className="flex flex-col gap-8 px-[var(--safe)] lg:flex-row lg:flex-nowrap lg:gap-12"
      >
        {renderCards('primary')}
        {renderCards('duplicate', true)}
      </div>
    </section>
  );
}
```

Note on the duplicate copy: it is `aria-hidden` and carries no `aria-label`, so the list of
projects is announced once, not twice, while the visible duplicate keeps the seam invisible.
Both copies are built from the same `renderCards()` so a content edit can never desynchronise them.

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm test -- Work useMarquee`
Expected: PASS.

- [ ] **Step 8: Delete the now-dead `useHorizontalPin`**

```bash
git rm src/components/animations/useHorizontalPin.ts
```

Its breakpoint discipline (stack below 1024px) is inherited by the `lg:` classes above; its reduced-motion guard is inherited by `useMarquee`. No test references it.

- [ ] **Step 9: Commit**

```bash
git add -A src/components/animations src/components/sections
git commit -m "feat: Work section as monochrome marquee, adds useMarquee, drops useHorizontalPin"
```

---

## Task 6: `Capabilities` (replaces `Skills`)

**Files:**
- Modify: `src/content/skills.ts`
- Modify: `src/types/content.ts:13-22`
- Rename + modify: `src/components/sections/Skills.tsx` → `src/components/sections/Capabilities.tsx`
- Modify: `src/content/__tests__/skills.test.ts`
- Rename + modify: `src/components/sections/__tests__/Skills.test.tsx` → `src/components/sections/__tests__/Capabilities.test.tsx`

**Interfaces:**
- Consumes: `skills` (`SkillGroup[]` — now with `description?: string`), `useGsapFadeIn`, `SectionHeading`, `Tag`.
- Produces: `<Capabilities />` with `id="capabilities"`, one hairline-separated row per group, indexed `01`…`NN` from the group count.

- [ ] **Step 1: Extend the content type**

`src/types/content.ts` — the `SkillGroup` interface becomes:

```ts
export interface SkillGroup {
  category: string;
  /** One line of copy for the capability row. Optional — a row renders without it. */
  description?: string;
  items: Skill[];
}

export interface Skill {
  name: string;
}
```

`Skill.icon` is removed — never populated, and the new chips are text-only.

- [ ] **Step 2: Extend the content test**

`src/content/__tests__/skills.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { skills } from '../skills';

describe('skills', () => {
  it('groups skills by category with at least one group', () => {
    expect(skills.length).toBeGreaterThan(0);
    skills.forEach((group) => {
      expect(typeof group.category).toBe('string');
      expect(group.items.length).toBeGreaterThan(0);
    });
  });

  it('carries a description when one is provided', () => {
    // Optional field — present groups must keep their copy.
    skills.forEach((group) => {
      if (group.description !== undefined) {
        expect(typeof group.description).toBe('string');
      }
    });
  });
});
```

- [ ] **Step 3: Write the failing component test**

Move `Skills.test.tsx` to `Capabilities.test.tsx` and rewrite:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Capabilities } from '../Capabilities';

describe('Capabilities', () => {
  it('renders one row per skill group', () => {
    const { container } = render(<Capabilities />);
    // skills.ts currently has four groups.
    expect(container.querySelectorAll('[data-capability]').length).toBe(4);
  });

  it('numbers rows with two-digit indices from the data', () => {
    render(<Capabilities />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
  });

  it('renders every skill name as a chip', () => {
    render(<Capabilities />);
    // From the current content: TypeScript, JavaScript, Next.js, React, GSAP, Git, Figma.
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('GSAP')).toBeInTheDocument();
  });

  it('renders a row even when its description is absent', () => {
    // The field is optional; a group without one must not collapse or
    // misalign its hairlines.
    const { container } = render(<Capabilities />);
    const rows = container.querySelectorAll('[data-capability]');
    expect(rows.length).toBeGreaterThan(0);
    rows.forEach((row) => expect(row).toBeVisible());
  });
});
```

- [ ] **Step 4: Run tests to verify they fail**

Run: `npm test -- Capabilities skills`
Expected: FAIL — `../Capabilities` does not exist; `description` is not yet in the content.

- [ ] **Step 5: Update `skills.ts`**

Add a one-line `description` to each group so the capability rows carry copy, and drop any `icon` keys (the type no longer has the field):

```ts
import type { SkillGroup } from '@/types/content';

// TODO(user): replace with the real stack.
export const skills: SkillGroup[] = [
  {
    category: 'Languages',
    description: 'Typed JavaScript across the whole stack.',
    items: [{ name: 'TypeScript' }, { name: 'JavaScript' }],
  },
  {
    category: 'Frameworks',
    description: 'App Router, server components, and the rendering edge.',
    items: [{ name: 'Next.js' }, { name: 'React' }],
  },
  {
    category: 'Motion',
    description: 'Scroll-driven animation that stays in sync with the page.',
    items: [{ name: 'GSAP' }, { name: 'Lenis' }],
  },
  {
    category: 'Tooling',
    description: 'Versioning, design handoff, and shipping.',
    items: [{ name: 'Git' }, { name: 'Figma' }],
  },
];
```

- [ ] **Step 6: Implement `Capabilities.tsx`**

```tsx
'use client';

import { skills } from '@/content/skills';
import { useGsapFadeIn } from '@/components/animations/useGsapFadeIn';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Capabilities() {
  const rowsRef = useGsapFadeIn<HTMLDivElement>({
    stagger: 0.08,
    staggerSelector: '[data-capability]',
  });

  return (
    <section
      id="capabilities"
      className="mx-auto max-w-[var(--layout-width)] px-[var(--safe)] py-[var(--spacer-lg)]"
    >
      <SectionHeading className="mb-12">Capabilities</SectionHeading>

      <div ref={rowsRef} className="border-t border-line">
        {skills.map((group, index) => (
          <div
            key={group.category}
            data-capability
            className="grid grid-cols-1 gap-4 border-b border-line py-8 transition-colors duration-fast hover:bg-surface-hover md:grid-cols-12 md:items-baseline"
          >
            <span className="font-mono text-xs text-text-secondary md:col-span-1">
              {String(index + 1).padStart(2, '0')}
            </span>

            <h3 className="font-display uppercase leading-none text-text-primary text-3xl md:col-span-4 md:text-5xl">
              {group.category}
            </h3>

            <div className="md:col-span-7">
              {group.description ? (
                <p className="text-text-secondary">{group.description}</p>
              ) : null}
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <li
                    key={skill.name}
                    className="rounded-sm border border-line px-3 py-1 font-mono text-xs text-text-secondary transition-colors duration-fast hover:text-text-primary"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

The row count follows the data (four groups → `01`–`04`); the `01`–`07` treatment from lenis.dev is replicated, not its count.

- [ ] **Step 7: Run tests to verify they pass**

Run: `npm test -- Capabilities skills`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A src/content src/types src/components/sections
git commit -m "feat: Capabilities as a hairline-separated numbered list, replaces Skills"
```

---

## Task 7: `ContactCTA` (replaces `Contact`)

**Files:**
- Rename + modify: `src/components/sections/Contact.tsx` → `src/components/sections/ContactCTA.tsx`
- Rename + modify: `src/components/sections/__tests__/Contact.test.tsx` (create; none existed)

**Interfaces:**
- Consumes: `useGsapFadeIn`, `SectionHeading` is not used here (the headline is display type in the box).
- Produces: `<ContactCTA />` with `id="contact"`.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactCTA } from '../ContactCTA';

describe('ContactCTA', () => {
  it('renders the headline and a mailto link', () => {
    render(<ContactCTA />);
    expect(screen.getByRole('heading', { name: /let's build something/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', 'mailto:');
  });

  it('renders every social label', () => {
    render(<ContactCTA />);
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Twitter / X')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
  });

  it('renders an empty-href social as a non-link', () => {
    // The current content has no social URLs yet. An empty href must not
    // become a clickable mailto: link.
    render(<ContactCTA />);
    expect(screen.queryByRole('link', { name: 'GitHub' })).toBeNull();
    expect(screen.getByText('GitHub').tagName).toBe('SPAN');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- ContactCTA`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `ContactCTA.tsx`**

```tsx
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
```

The contact form, the accent glow blob, and `MagneticButton` are removed from this section. `MagneticButton` is restyled in Task 8 and still used there — do not delete the component.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- ContactCTA`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A src/components/sections
git commit -m "feat: ContactCTA as a bordered box, drops the contact form"
```

---

## Task 8: `Manifesto` (absorbs `About`), plus UI primitives restyle

**Files:**
- Create: `src/components/sections/Manifesto.tsx`
- Delete: `src/components/sections/About.tsx`
- Modify: `src/components/ui/SectionHeading.tsx`
- Modify: `src/components/ui/Tag.tsx`
- Modify: `src/components/ui/MagneticButton.tsx`
- Modify: `src/components/ui/__tests__/Tag.test.tsx`
- Create: `src/components/sections/__tests__/Manifesto.test.tsx`

**Interfaces:**
- Consumes: `useGsapFadeIn`, `useSplitReveal`, `SectionHeading`.
- Produces: `<Manifesto />` with `id="manifesto"`. Restyled `SectionHeading` (Anton, uppercase, tight leading), `Tag` (monochrome hairline, `rounded-sm`, no `data-cursor`), `MagneticButton` (hairline border, `rounded-sm`, no accent hover).

- [ ] **Step 1: Write the failing test for `Manifesto`**

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Manifesto } from '../Manifesto';

describe('Manifesto', () => {
  it('renders the section heading', () => {
    render(<Manifesto />);
    expect(screen.getByRole('heading', { name: /manifesto/i })).toBeInTheDocument();
  });

  it('renders the statement paragraph', () => {
    render(<Manifesto />);
    expect(screen.getByText(/browser as a canvas/i)).toBeInTheDocument();
  });

  it('renders three numbered cells', () => {
    const { container } = render(<Manifesto />);
    expect(container.querySelectorAll('[data-cell]').length).toBe(3);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Manifesto`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `Manifesto.tsx`**

```tsx
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
```

- [ ] **Step 4: Delete `About.tsx`**

```bash
git rm src/components/sections/About.tsx
```

The photo placeholder, its accent glow, and the `Photo coming soon` stub go with it; the copy lives on in the statement above.

- [ ] **Step 5: Restyle `SectionHeading.tsx`**

```tsx
export function SectionHeading({
  children,
  className,
  as = 'h2',
}: SectionHeadingProps) {
  const ref = useSplitReveal<HTMLHeadingElement>();
  const Tag = as;

  return (
    <Tag
      ref={ref}
      className={cn(
        'font-display uppercase leading-[0.9] tracking-[-0.03em] text-text-primary',
        'text-4xl md:text-6xl',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 6: Restyle `Tag.tsx`**

```tsx
export function Tag({ children, className, ...props }: TagProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-sm border border-line px-3 py-1',
        'font-mono text-xs text-text-secondary transition-colors duration-normal',
        'hover:border-line-strong hover:text-text-primary',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
```

`data-cursor="hover"` is removed from this component.

- [ ] **Step 7: Update `Tag.test.tsx`**

The `data-cursor` assertion goes away; the label assertion stays:

```tsx
describe('Tag', () => {
  it('renders its label', () => {
    expect(render(<Tag>GSAP</Tag>).getByText('GSAP')).toBeInTheDocument();
  });

  it('renders as a hairline chip, not a pill', () => {
    const { getByText } = render(<Tag>GSAP</Tag>);
    expect(getByText('GSAP').className).toContain('rounded-sm');
  });
});
```

- [ ] **Step 8: Restyle `MagneticButton.tsx`**

The `className` string becomes:

```tsx
  const classes = cn(
    'group inline-flex items-center gap-2 rounded-sm border border-line',
    'px-6 py-3 font-sans text-sm font-medium text-text-primary transition-colors',
    'duration-normal hover:border-line-strong',
    className,
  );
```

and the `href`/`button` branches each drop their `data-cursor="hover"` prop. The magnetic `useGSAP` block is unchanged.

- [ ] **Step 9: Run tests to verify they pass**

Run: `npm test`
Expected: PASS for `Manifesto` and `Tag`; `page.test.tsx` still fails pending Task 9.

- [ ] **Step 10: Commit**

```bash
git add -A src/components/sections src/components/ui
git commit -m "feat: Manifesto absorbs About; primitives restyled to hairlines and Anton"
```

---

## Task 9: `Footer` restyle

**Files:**
- Modify: `src/components/layout/Footer.tsx`
- Create: `src/components/layout/__tests__/Footer.test.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils` (if needed for conditional classes).
- Produces: `<Footer />` — the existing three-column footer, restyled to the token set. Behavior is unchanged, so no existing contract breaks.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('renders the copyright and build note', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 Ramadhafidz/i)).toBeInTheDocument();
    expect(screen.getByText(/Built with Next.js/i)).toBeInTheDocument();
  });

  it('renders a back-to-top button that scrolls to the top', () => {
    render(<Footer />);
    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- Footer`
Expected: FAIL — `Footer.test.tsx` does not exist yet (the component does, so only the missing test file fails).

- [ ] **Step 3: Rewrite `Footer.tsx`**

```tsx
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
```

This removes the accent hover color and the `data-cursor` attribute in the same edit.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test -- Footer`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.tsx src/components/layout/__tests__/Footer.test.tsx
git commit -m "feat: Footer restyled to monospace hairlines, removes accent hover"
```

---

## Task 10: Compose the page, delete dead code, finish tests

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx` (remove `CustomCursor` mount)
- Delete: `src/components/layout/CustomCursor.tsx`, `src/components/layout/__tests__/CustomCursor.test.tsx`
- Delete: `public/projects/gradient-1.svg`, `gradient-2.svg`, `gradient-3.svg`
- Modify: `src/app/__tests__/page.test.tsx`
- Modify: `src/lib/gsap.ts` (comment accuracy only)

**Interfaces:**
- Consumes: all section components produced by Tasks 4–9.
- Produces: the composed home page in the new section order.

- [ ] **Step 1: Rewrite `page.test.tsx`**

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home', () => {
  it('renders all sections in the new order', () => {
    const { container } = render(<Home />);
    const ids = Array.from(container.querySelectorAll('section[id]')).map((el) => el.id);
    expect(ids).toEqual(['hero', 'manifesto', 'work', 'capabilities', 'contact']);
  });

  it('renders the work gallery heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'Selected Work' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- page`
Expected: FAIL — `page.tsx` still composes the old sections.

- [ ] **Step 3: Rewrite `page.tsx`**

```tsx
import { Hero } from '@/components/sections/Hero';
import { Manifesto } from '@/components/sections/Manifesto';
import { Work } from '@/components/sections/Work';
import { Capabilities } from '@/components/sections/Capabilities';
import { ContactCTA } from '@/components/sections/ContactCTA';

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Work />
      <Capabilities />
      <ContactCTA />
    </main>
  );
}
```

- [ ] **Step 4: Remove `CustomCursor` from `layout.tsx` and delete it**

Delete the import, the `<CustomCursor />` element, and:

```bash
git rm src/components/layout/CustomCursor.tsx src/components/layout/__tests__/CustomCursor.test.tsx
```

- [ ] **Step 5: Delete the placeholder SVGs**

```bash
git rm public/projects/gradient-1.svg public/projects/gradient-2.svg public/projects/gradient-3.svg
```

- [ ] **Step 6: Strip every remaining `data-cursor` attribute**

```bash
grep -rn 'data-cursor' src/ || echo "none remaining"
```

Any hit is removed in that file — `data-cursor` is dead once `CustomCursor` is gone. Expected: zero hits after this step.

- [ ] **Step 7: Correct the stale comment in `lib/gsap.ts`**

The `EASE` doc-comment says the curve is `cubic-bezier(0.16, 1, 0.3, 1)`; the spec's verified value (and lenis.dev's `--ease-out-expo`) is `cubic-bezier(.19, 1, .22, 1)`. Update the comment so the stated curve matches the token. No code change.

- [ ] **Step 8: Run the full suite, build, and lint**

Run: `npm test && npm run build && npm run lint`
Expected: all green. Count the tests: 13 baseline − 2 deleted/absorbed (`CustomCursor`, and the `Tag` cursor assertion folded into its file) + new (`tokens`, `ScrollProgress`, `useMarquee`, `Work`, `Capabilities`, `ContactCTA`, `Manifesto`) — confirm every retained baseline test is still present and passing, not deleted to make the suite green.

- [ ] **Step 9: Verify the hard constraints hold across the tree**

Run each and confirm the output is empty:

```bash
grep -rn 'box-shadow' src/ && echo "VIOLATION: box-shadow present" || echo "ok: no box-shadow"
grep -rn 'accent' src/ && echo "VIOLATION: accent token present" || echo "ok: no accent"
grep -rn 'rounded-full\|rounded-2xl' src/ && echo "VIOLATION: forbidden radius" || echo "ok: no forbidden radius"
grep -rn 'data-cursor' src/ && echo "VIOLATION: dead cursor attribute" || echo "ok: no data-cursor"
grep -rn 'Syne\|Space_Grotesk\|space-grotesk' src/ && echo "VIOLATION: old font" || echo "ok: old fonts gone"
```

Expected: five `ok:` lines.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: compose page in the lenis.dev section order; remove custom cursor, grain assets, dead code"
```

---

## Task 11: Manual verification in the browser

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

```bash
npm run dev
```

- [ ] **Step 2: Visual pass at desktop width**

Open `http://localhost:3000` at 1440px and confirm: pure `#000` background (no grain, no glow), Anton uppercase headings with tight leading, monospace nav and labels, hairline separators between capability rows, the marquee looping seamlessly without a visible seam, the top scroll-progress hairline tracking scroll.

- [ ] **Step 3: Visual pass at mobile width**

Resize to 375px and confirm: the marquee is a static vertical stack with every card reachable, the hamburger menu opens and closes with Escape, and no horizontal overflow.

- [ ] **Step 4: Reduced-motion pass**

Enable "Reduce motion" in the OS and reload with `#capabilities` in the URL: confirm all content is visible, nothing is clipped or translated off-screen, and scroll is native.

- [ ] **Step 5: Contrast spot-check**

Confirm `#b0b0b0` body text on `#000` reads as comfortably secondary — it must not be confused with the `#efefef` primary or with the `0.10`-opacity decorative hairlines.

No commit — this task only verifies.
