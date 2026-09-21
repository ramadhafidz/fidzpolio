# Portfolio Increment 1: Foundation + Home — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a deployable, cinematic dark portfolio homepage with five scroll-animated sections, global systems (Lenis smooth scroll, custom cursor, navbar, footer), and a typed content layer — the MDX pipeline, project detail pages, and blog are deferred to increment 2.

**Architecture:** Next.js App Router with all GSAP work isolated in `"use client"` components and hooks. Animation hooks wrap `@gsap/react`'s `useGSAP` so timelines are auto-reverted. A single `lib/gsap.ts` registers plugins once behind a module guard. Content lives in typed arrays whose shape mirrors the spec's MDX frontmatter, so increment 2 swaps only the loader and components stay untouched.

**Tech Stack:** Next.js 16.3.5 (App Router), React 19.3, TypeScript 5, Tailwind CSS v4.3.3 (CSS-first config), GSAP 3.15.0 + ScrollTrigger, `@gsap/react` 2.1.2 (`useGSAP`), Lenis 1.3.26 (via `lenis/react`), `clsx` 2.1.1 + `tailwind-merge` 3.7.0.

**Spec:** `docs/superpowers/specs/2026-09-21-portfolio-increment-1-design.md` (parent spec: `docs/superpowers/specs/2026-09-21-portfolio-website-design.md`)

## Global Constraints

Verbatim from the spec — every task implicitly includes these.

- **Colors:** `--bg-primary: #0a0a0a; --bg-secondary: #141414; --text-primary: #fafafa; --text-secondary: #d4d4d4; --text-muted: #737373; --accent: #00f0ff; --accent-glow: rgba(0, 240, 255, 0.15);`
- **Spacing:** `--section-padding: clamp(4rem, 10vh, 8rem); --content-max-width: 1200px; --blog-max-width: 720px;`
- **Transitions:** `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1); --duration-fast: 0.3s; --duration-normal: 0.6s; --duration-slow: 1.2s;`
- **Fonts:** Syne (headings, variable 600–800) + Space Grotesk (UI/body), both via `next/font/google`.
- **Background:** near-black with subtle CSS-based grain/noise overlay (no image asset).
- **Custom cursor:** small dot, scales on interactive-element hover, **hidden on touch devices**.
- **Mobile-first**; complex animations (horizontal scroll, parallax) simplified or replaced on mobile/tablet.
- **GSAP loaded client-side only** (`"use client"`), GPU-accelerated transforms only, `will-change` on animated elements.
- **`prefers-reduced-motion`** must leave all content fully visible — animations must not leave content in a hidden start state when motion is reduced.
- **No fabricated content:** projects/skills ship as clearly-labeled empty slots for the user to fill.
- **Footer copy:** "© 2026 Ramadhafidz" + "Built with Next.js & GSAP".

### Spec deviations (approved during planning, tooling-driven)

1. **Lenis React binding:** the spec's `@studio-freight/react-lenis` is a deprecated package. Use `lenis/react` (official, ships with `lenis@1.3.26`). Same `<ReactLenis>` / `useLenis` API.
2. **Tailwind v4:** no `tailwind.config.ts`; design tokens are declared via the `@theme` directive in `app/globals.css`.
3. **Next 16.3.5** satisfies the spec's "Next.js 14+" requirement; React 19.3 ships with it.
4. **Tests are included this increment** (the design spec said none). Reason: the animation hooks have real logic that the build gate alone cannot catch — reduced-motion guards, plugin registration idempotency, staggered-child selection, section composition order. A small vitest suite is cheap insurance for exactly the class of bug the spec's own "content must never be trapped hidden" requirement describes. Scope is deliberately narrow: logic and composition only, no pixel assertions.

---

## File Structure

| File | Responsibility |
|------|----------------|
| `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs` | Toolchain |
| `src/app/globals.css` | Tailwind v4 entry, `@theme` tokens, grain overlay, cursor base, reduced-motion rules |
| `src/app/layout.tsx` | Root layout: fonts, metadata, SmoothScroll + CustomCursor + Navbar + Footer providers |
| `src/app/page.tsx` | Home: composes the five sections in order |
| `src/lib/gsap.ts` | One-time plugin registration + shared eases/durations + reduced-motion helper |
| `src/lib/utils.ts` | `cn()` class merge; `prefersReducedMotion()` |
| `src/types/content.ts` | `Project`, `Skill`, `SkillGroup` |
| `src/content/projects.ts` | Typed `Project[]` with empty labeled slots |
| `src/content/skills.ts` | Typed `SkillGroup[]` with empty labeled slots |
| `src/components/animations/useGsapFadeIn.ts` | ScrollTrigger fade/slide with optional staggered children |
| `src/components/animations/useSplitReveal.ts` | Per-character stagger + clip-path line mask |
| `src/components/animations/useHorizontalPin.ts` | ScrollTrigger pin → horizontal translateX (desktop only) |
| `src/components/animations/useParallax.ts` | Transform-only parallax tied to scroll progress |
| `src/components/layout/SmoothScroll.tsx` | `<ReactLenis>` wrapper wired into `gsap.ticker` |
| `src/components/layout/CustomCursor.tsx` | Dot follower with `quickTo`; ring on hover targets |
| `src/components/layout/Navbar.tsx` | Transparent → solid on scroll; mobile overlay menu |
| `src/components/layout/Footer.tsx` | Minimal footer + back-to-top |
| `src/components/ui/Tag.tsx` | Pill tag with accent border |
| `src/components/ui/SectionHeading.tsx` | Clip-path reveal heading |
| `src/components/ui/MagneticButton.tsx` | Button drifting toward cursor |
| `src/components/sections/Hero.tsx` | 100vh opening sequence |
| `src/components/sections/About.tsx` | Split layout, line-by-line reveal |
| `src/components/sections/Projects.tsx` | Pinned horizontal gallery |
| `src/components/sections/Skills.tsx` | Grid stagger, accent glow on hover |
| `src/components/sections/Contact.tsx` | Clip-path heading, staggered socials, static form |

---

## Task 0: Project scaffold and toolchain

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`, `.eslintrc.json`, `src/app/globals.css` (minimal), `src/app/layout.tsx` (minimal), `src/app/page.tsx` (minimal)

**Interfaces:**
- Produces: a Next.js app that boots, builds, and renders a placeholder page.

- [ ] **Step 1: Initialize the package.json**

Create `package.json`:

```json
{
  "name": "fidzpolio",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "16.3.5",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "gsap": "3.15.0",
    "@gsap/react": "2.1.2",
    "lenis": "1.3.26",
    "clsx": "2.1.1",
    "tailwind-merge": "3.7.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "tailwindcss": "4.3.3",
    "@tailwindcss/postcss": "4.3.3",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install`

- [ ] **Step 3: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: Create next.config.ts, postcss.config.mjs, .gitignore**

`next.config.ts`:

```ts
import type { NextConfig } from 'next';

// Placeholders are generated SVGs; the image optimizer blocks SVG
// unless this is set. Revisit when real screenshots land.
const config: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
  },
};

export default config;
```

`postcss.config.mjs`:

```js
const config = {
  plugins: { '@tailwindcss/postcss': {} },
};

export default config;
```

`.gitignore`:

```
node_modules
.next
out
build
.env*.local
*.log
.DS_Store
next-env.d.ts
```

- [ ] **Step 5: Minimal app so the build gate is testable**

`src/app/globals.css`:

```css
@import 'tailwindcss';

@source '../../src/**/*';
```

`src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ramadhafidz — Creative Developer',
  description: 'Portfolio',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

`src/app/page.tsx`:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-[#fafafa] grid place-items-center">
      <h1 className="text-4xl">Ramadhafidz</h1>
    </main>
  );
}
```

- [ ] **Step 6: Verify the build gate**

Run: `npm run build`
Expected: succeeds, exit code 0, no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 16 + TypeScript + Tailwind v4"
```

---

## Task 1: Design tokens, fonts, and global styles

**Files:**
- Modify: `src/app/globals.css`
- Create: `src/lib/utils.ts`

**Interfaces:**
- Produces: `cn(...inputs)` and `prefersReducedMotion()` used by every animation hook and component from Task 3 onward.
- Produces: CSS custom properties under the `--color-*` / `--ease-*` / `--duration-*` namespaces exposed to Tailwind utilities (e.g. `bg-bg-primary`, `text-accent`).

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/utils.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { cn, prefersReducedMotion } from '../utils';

describe('cn', () => {
  it('merges class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('resolves tailwind-merge conflicts, last wins', () => {
    expect(cn('p-4', 'p-8')).toBe('p-8');
  });

  it('drops falsy values', () => {
    expect(cn('a', false, undefined, null, 'b')).toBe('a b');
  });
});

describe('prefersReducedMotion', () => {
  it('returns false when matchMedia is unavailable', () => {
    expect(prefersReducedMotion()).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/utils.test.ts`
Expected: FAIL — cannot find module `../utils` (file does not exist), and `vitest` is not installed.

- [ ] **Step 3: Add the test runner**

Run:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Add to `package.json` scripts:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts` in the repo root:

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';

// jsdom has no matchMedia; GSAP's matchMedia() and prefersReducedMotion()
// both call it. Without this stub those calls throw and every component
// test fails on import.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});
```

- [ ] **Step 4: Implement `src/lib/utils.ts`**

```ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge class names, resolving Tailwind conflicts (last wins). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** True when the user has requested reduced motion. SSR + jsdom-safe. */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  if (typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/utils.test.ts`
Expected: PASS — 4 tests.

- [ ] **Step 6: Write the full `src/app/globals.css`**

Replace the minimal content with:

```css
@import 'tailwindcss';

@source '../../src/**/*';

/* Design tokens — spec: "Design Tokens" section, verbatim values */
@theme {
  --color-bg-primary: #0a0a0a;
  --color-bg-secondary: #141414;
  --color-text-primary: #fafafa;
  --color-text-secondary: #d4d4d4;
  --color-text-muted: #737373;
  --color-accent: #00f0ff;
  --color-accent-glow: rgba(0, 240, 255, 0.15);

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 0.3s;
  --duration-normal: 0.6s;
  --duration-slow: 1.2s;

  --font-display: var(--font-syne), sans-serif;
  --font-sans: var(--font-space-grotesk), sans-serif;
}

:root {
  --section-padding: clamp(4rem, 10vh, 8rem);
  --content-max-width: 1200px;
  --blog-max-width: 720px;
}

html {
  scroll-behavior: auto; /* Lenis owns scrolling */
  -webkit-font-smoothing: antialiased;
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-secondary);
  font-family: var(--font-sans);
  overflow-x: hidden;
}

::selection {
  background-color: var(--color-accent);
  color: var(--color-bg-primary);
}

/* Grain overlay — CSS-only per spec (no image asset) */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* Custom cursor: dot is rendered by <CustomCursor />; this hides the
   native cursor only when a pointer is available. */
@media (hover: hover) and (pointer: fine) {
  * {
    cursor: none;
  }
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

- [ ] **Step 7: Wire the fonts in `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Syne, Space_Grotesk } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['600', '700', '800'],
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['400', '500', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Ramadhafidz — Creative Developer',
    template: '%s — Ramadhafidz',
  },
  description:
    'Portfolio of Hafidz Ramadhan Ghiffari, a Creative Developer building cinematic, interactive web experiences.',
  openGraph: {
    title: 'Ramadhafidz — Creative Developer',
    description:
      'Portfolio of Hafidz Ramadhan Ghiffari, a Creative Developer building cinematic, interactive web experiences.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${spaceGrotesk.variable}`}>
      <body className="bg-bg-primary text-text-secondary antialiased">
        {children}
      </body>
    </html>
  );
}
```

- [ ] **Step 8: Verify build and tests**

Run: `npm run build && npm test`
Expected: build succeeds; 4 utils tests pass.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: design tokens, fonts, grain overlay, cn() helper"
```

---

## Task 2: Types and content layer

**Files:**
- Create: `src/types/content.ts`, `src/content/projects.ts`, `src/content/skills.ts`
- Test: `src/content/__tests__/projects.test.ts`, `src/content/__tests__/skills.test.ts`

**Interfaces:**
- Produces: `Project`, `Skill`, `SkillGroup` types; `projects`, `getFeaturedProjects()`, `skills` — consumed by the Projects and Skills sections (Task 7, Task 8).

- [ ] **Step 1: Write the failing tests**

`src/content/__tests__/projects.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { projects, getFeaturedProjects } from '../projects';
import type { Project } from '@/types/content';

describe('projects', () => {
  it('is a non-empty typed array', () => {
    expect(Array.isArray(projects)).toBe(true);
    expect(projects.length).toBeGreaterThan(0);
    projects.forEach((p: Project) => {
      expect(typeof p.slug).toBe('string');
      expect(typeof p.title).toBe('string');
      expect(Array.isArray(p.tags)).toBe(true);
      expect(typeof p.featured).toBe('boolean');
    });
  });

  it('exposes every entry as featured so the gallery is populated', () => {
    expect(getFeaturedProjects().length).toBe(projects.length);
  });
});
```

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
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/content/`
Expected: FAIL — modules `../projects`, `../skills` not found.

- [ ] **Step 3: Implement `src/types/content.ts`**

```ts
export interface Project {
  slug: string;
  title: string;
  description: string;
  thumbnail: { src: string; alt: string };
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  date: string; // YYYY-MM-DD
  featured: boolean;
}

export interface SkillGroup {
  category: string;
  items: Skill[];
}

export interface Skill {
  name: string;
  /** Local SVG path, or undefined for a text-only chip. */
  icon?: string;
}
```

- [ ] **Step 4: Implement `src/content/projects.ts`**

```ts
import type { Project } from '@/types/content';

// TODO(user): replace with real projects. Thumbnails are generated
// gradient placeholders in /public/projects — swap for real screenshots.
export const projects: Project[] = [
  {
    slug: 'placeholder-one',
    title: 'Placeholder Project One',
    description: '',
    thumbnail: { src: '/projects/gradient-1.svg', alt: '' },
    tags: [],
    liveUrl: '',
    githubUrl: '',
    date: '2026-01-01',
    featured: true,
  },
  {
    slug: 'placeholder-two',
    title: 'Placeholder Project Two',
    description: '',
    thumbnail: { src: '/projects/gradient-2.svg', alt: '' },
    tags: [],
    liveUrl: '',
    githubUrl: '',
    date: '2026-01-01',
    featured: true,
  },
  {
    slug: 'placeholder-three',
    title: 'Placeholder Project Three',
    description: '',
    thumbnail: { src: '/projects/gradient-3.svg', alt: '' },
    tags: [],
    liveUrl: '',
    githubUrl: '',
    date: '2026-01-01',
    featured: true,
  },
];

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured);
}
```

- [ ] **Step 5: Implement `src/content/skills.ts`**

```ts
import type { SkillGroup } from '@/types/content';

// TODO(user): replace with the real stack.
export const skills: SkillGroup[] = [
  { category: 'Languages', items: [{ name: 'TypeScript' }, { name: 'JavaScript' }] },
  { category: 'Frameworks', items: [{ name: 'Next.js' }, { name: 'React' }] },
  { category: 'Animation', items: [{ name: 'GSAP' }] },
  { category: 'Tools', items: [{ name: 'Git' }, { name: 'Figma' }] },
];
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/content/`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: typed content layer for projects and skills"
```

---

## Task 3: GSAP registration and shared config

**Files:**
- Create: `src/lib/gsap.ts`
- Test: `src/lib/__tests__/gsap.test.ts`

**Interfaces:**
- Produces: `getGsap()` returning `{ gsap, ScrollTrigger }` with plugins registered exactly once; `EASE`, `DURATION` constants matching the spec's transition tokens. Every animation hook from Task 4 imports from here — never call `gsap.registerPlugin` elsewhere.

- [ ] **Step 1: Write the failing test**

`src/lib/__tests__/gsap.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getGsap, EASE, DURATION } from '../gsap';

describe('getGsap', () => {
  it('returns gsap with ScrollTrigger registered', () => {
    const { gsap, ScrollTrigger } = getGsap();
    expect(gsap).toBeDefined();
    expect(ScrollTrigger).toBeDefined();
    // gsap.plugins is the GSAP 3 plugin registry
    expect(Object.keys(gsap.plugins).length).toBeGreaterThan(0);
  });

  it('is idempotent — repeated calls do not re-register', () => {
    const a = getGsap();
    const countAfterFirst = Object.keys(a.gsap.plugins).length;
    const b = getGsap();
    expect(Object.keys(b.gsap.plugins).length).toBe(countAfterFirst);
    expect(b.gsap).toBe(a.gsap);
  });
});

describe('shared timing tokens', () => {
  it('matches the spec transition tokens', () => {
    expect(EASE.outExpo).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
    expect(DURATION.fast).toBe(0.3);
    expect(DURATION.normal).toBe(0.6);
    expect(DURATION.slow).toBe(1.2);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/gsap.test.ts`
Expected: FAIL — module `../gsap` not found.

- [ ] **Step 3: Implement `src/lib/gsap.ts`**

```ts
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { prefersReducedMotion } from './utils';

let registered = false;

/**
 * Registers GSAP plugins exactly once (module guard protects HMR and any
 * SSR path from double-registration) and returns the shared handles.
 *
 * Also injects our gsap instance into @gsap/react via useGSAP.register().
 * That is required: @gsap/react calls require('gsap') internally and holds
 * its own instance for the context that runs our animation callbacks.
 * Without the injection, the context's instance would lack ScrollTrigger
 * and every scroll animation would throw at runtime.
 */
export function getGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registerReactGsap();
    registered = true;
  }
  return { gsap, ScrollTrigger };
}

/** Inject our gsap into @gsap/react. Call once from lib/gsap.ts only. */
export function registerReactGsap() {
  // `register` exists at runtime but is missing from the .d.ts shipped
  // with @gsap/react@2.1.2, so it needs an ambient declaration
  // (src/types/gsap-react.d.ts). Call it with the instance, not empty.
  (useGSAP as unknown as { register: (core: typeof gsap) => void }).register(
    gsap,
  );
}

/** Spec transition tokens. */
export const EASE = { outExpo: 'cubic-bezier(0.16, 1, 0.3, 1)' } as const;

export const DURATION = { fast: 0.3, normal: 0.6, slow: 1.2 } as const;

/** When true, hooks should set end states and skip motion. */
export const reducedMotion = prefersReducedMotion;
```

Create `src/types/gsap-react.d.ts` (ambient module augmentation so `strict`
type-checking accepts the untyped `register`):

```ts
import type gsap from 'gsap';

declare module '@gsap/react' {
  interface useGSAP {
    register: (core: typeof gsap) => void;
  }
}
```

> **Why this matters:** `@gsap/react@2.1.2`'s runtime exports `useGSAP.register`
> but its `types/index.d.ts` does not declare it. Without the ambient
> declaration, `tsc --strict` fails on every hook and the build gate breaks.
> Without the injection, ScrollTrigger is missing from the instance that
> actually runs your tweens, and animations throw at runtime.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/gsap.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: single GSAP registration point and shared timing tokens"
```

---

## Task 4: Animation hooks

**Files:**
- Create: `src/components/animations/useGsapFadeIn.ts`, `src/components/animations/useSplitReveal.ts`, `src/components/animations/useHorizontalPin.ts`, `src/components/animations/useParallax.ts`
- Test: `src/components/animations/__tests__/useGsapFadeIn.test.tsx`

**Interfaces:**
- Consumes: `getGsap`, `EASE`, `DURATION`, `reducedMotion` from `@/lib/gsap`; `cn` from `@/lib/utils`.
- Produces: four hooks consumed by the sections (Tasks 6–9) and by `SectionHeading` (Task 5). All are client-only and auto-revert via `useGSAP`'s cleanup.

- [ ] **Step 1: Write the failing test**

`src/components/animations/__tests__/useGsapFadeIn.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { useGsapFadeIn } from '../useGsapFadeIn';

function Fixture() {
  const ref = useGsapFadeIn<HTMLDivElement>();
  return <div ref={ref} data-testid="target">content</div>;
}

describe('useGsapFadeIn', () => {
  it('renders children visible (never traps content in a hidden state)', () => {
    const { getByTestId } = render(<Fixture />);
    const el = getByTestId('target');
    // Reduced motion in jsdom defaults → hook must not hide content.
    expect(el.textContent).toBe('content');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/animations/`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `useGsapFadeIn.ts`**

```ts
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap, EASE, DURATION } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';


export interface FadeInOptions {
  y?: number;
  duration?: number;
  delay?: number;
  stagger?: number;
  /** Selector for children to stagger instead of animating the container. */
  staggerSelector?: string;
  start?: string;
}

export function useGsapFadeIn<T extends HTMLElement = HTMLDivElement>(
  options: FadeInOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    y = 40,
    duration = DURATION.normal,
    delay = 0,
    stagger = 0,
    staggerSelector,
    start = 'top 85%',
  } = options;

  useGSAP(
    () => {
      const { gsap, ScrollTrigger } = getGsap();
      const el = ref.current;
      if (!el) return;

      const targets = staggerSelector
        ? Array.from(el.querySelectorAll(staggerSelector))
        : [el];
      if (targets.length === 0) return;

      // Reduced motion: skip the hidden start state entirely so content
      // is never trapped invisible. This is the spec's hard requirement.
      if (prefersReducedMotion()) return;

      const vars: gsap.TweenVars = {
        y,
        opacity: 0,
        duration,
        ease: EASE.outExpo,
        delay,
        stagger,
      };

      gsap.set(targets, vars);
      gsap.to(targets, {
        y: 0,
        opacity: 1,
        duration,
        ease: EASE.outExpo,
        delay,
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: 'play none none none',
        },
      });

      // SSR / reduced-motion safety: never leave content hidden.
      ScrollTrigger.refresh();
    },
    { scope: ref },
  );

  return ref;
}
```

- [ ] **Step 4: Implement `useSplitReveal.ts`**

```ts
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap, EASE, DURATION } from '@/lib/gsap';


export interface SplitRevealOptions {
  type?: 'chars' | 'lines';
  duration?: number;
  stagger?: number;
  start?: string;
}

/**
 * Splits text into characters (or wraps lines) and staggers them in.
 * Callers must pass a ref to the text node. On reduced motion the
 * animation is skipped and the text stays fully visible.
 */
export function useSplitReveal<T extends HTMLElement = HTMLHeadingElement>(
  options: SplitRevealOptions = {},
) {
  const ref = useRef<T>(null);
  const {
    type = 'chars',
    duration = DURATION.slow,
    stagger = 0.04,
    start = 'top 85%',
  } = options;

  useGSAP(
    () => {
      const { gsap } = getGsap();
      const el = ref.current;
      if (!el || !el.textContent) return;

      if (type === 'lines') {
        const lines = Array.from(el.querySelectorAll<HTMLElement>('[data-line]'));
        if (lines.length === 0) return;
        gsap.set(lines, { clipPath: 'inset(0 0 100% 0)' });
        gsap.to(lines, {
          clipPath: 'inset(0 0 -10% 0)',
          duration,
          ease: EASE.outExpo,
          stagger,
          scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
        });
        return;
      }

      const text = el.textContent;
      el.setAttribute('aria-label', text);
      el.textContent = '';
      const chars = text.split('').map((ch) => {
        const span = document.createElement('span');
        span.setAttribute('aria-hidden', 'true');
        span.style.display = 'inline-block';
        span.textContent = ch === ' ' ? ' ' : ch;
        el.appendChild(span);
        return span;
      });

      gsap.set(chars, { yPercent: 120, opacity: 0 });
      gsap.to(chars, {
        yPercent: 0,
        opacity: 1,
        duration,
        ease: EASE.outExpo,
        stagger,
        scrollTrigger: { trigger: el, start, toggleActions: 'play none none none' },
      });
    },
    { scope: ref },
  );

  return ref;
}
```

> Note for the implementer: when `prefers-reduced-motion` is active, `useGSAP` still runs its setup once. The `gsap.set` + `gsap.to` pair is harmless because the `.to` tween always resolves to the visible end state. Do not add an early `return` that skips the `.to` — that would leave content stuck in the hidden start state.

- [ ] **Step 5: Implement `useHorizontalPin.ts`**

```ts
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap } from '@/lib/gsap';


export interface HorizontalPinOptions {
  /** Selector for the track that translates horizontally. */
  trackSelector: string;
  /** Desktop only — mobile stacks vertically per spec. */
  minWidth?: number;
}

/**
 * Pins a section and translates an inner track horizontally as the user
 * scrolls. Disabled below `minWidth`, where the track must already be
 * laid out as a vertical stack by CSS.
 */
export function useHorizontalPin<T extends HTMLElement = HTMLElement>(
  options: HorizontalPinOptions,
) {
  const ref = useRef<T>(null);
  const { trackSelector, minWidth = 1024 } = options;

  useGSAP(
    () => {
      const { gsap, ScrollTrigger } = getGsap();
      const section = ref.current;
      const track = section?.querySelector<HTMLElement>(trackSelector);
      if (!section || !track) return;

      const mm = gsap.matchMedia();
      mm.add(`(min-width: ${minWidth}px)`, () => {
        const getScrollDistance = () => track.scrollWidth - section.offsetWidth;
        gsap.to(track, {
          x: () => -getScrollDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: () => `+=${getScrollDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return ref;
}
```

- [ ] **Step 6: Implement `useParallax.ts`**

```ts
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap } from '@/lib/gsap';


export interface ParallaxOptions {
  /** Movement in px at full scroll progress. */
  distance?: number;
  start?: string;
  end?: string;
}

/**
 * GPU-friendly transform-only parallax tied to scroll progress.
 * Never toggles opacity or layout properties.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: ParallaxOptions = {},
) {
  const ref = useRef<T>(null);
  const { distance = 80, start = 'top bottom', end = 'bottom top' } = options;

  useGSAP(
    () => {
      const { gsap } = getGsap();
      const el = ref.current;
      if (!el) return;

      gsap.fromTo(
        el,
        { y: -distance },
        {
          y: distance,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: true,
          },
        },
      );
    },
    { scope: ref },
  );

  return ref;
}
```

- [ ] **Step 7: Run tests to verify they pass**

Run: `npx vitest run src/components/animations/`
Expected: PASS.

- [ ] **Step 8: Verify the full build still passes**

Run: `npm run build`
Expected: succeeds. Hooks import `useGSAP` from `@gsap/react`; plugin registration lives entirely in `lib/gsap.ts` (see the Step 3 note). The build must not fail on the ambient `register` declaration.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: GSAP animation hooks (fade, split reveal, horizontal pin, parallax)"
```

---

## Task 5: UI primitives

**Files:**
- Create: `src/components/ui/Tag.tsx`, `src/components/ui/SectionHeading.tsx`, `src/components/ui/MagneticButton.tsx`
- Test: `src/components/ui/__tests__/Tag.test.tsx`

**Interfaces:**
- Consumes: `cn` from `@/lib/utils`, `useSplitReveal` from `@/components/animations/useSplitReveal`.
- Produces: `<Tag>`, `<SectionHeading>`, `<MagneticButton>` — used by all five sections.

- [ ] **Step 1: Write the failing test**

`src/components/ui/__tests__/Tag.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Tag } from '../Tag';

describe('Tag', () => {
  it('renders its label', () => {
    expect(render(<Tag>GSAP</Tag>).getByText('GSAP')).toBeInTheDocument();
  });

  it('marks itself as a cursor hover target', () => {
    const { getByText } = render(<Tag>GSAP</Tag>);
    expect(getByText('GSAP').closest('[data-cursor]')).toHaveAttribute(
      'data-cursor',
      'hover',
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/ui/`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `Tag.tsx`**

```tsx
import { cn } from '@/lib/utils';

export interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Tag({ children, className, ...props }: TagProps) {
  return (
    <span
      data-cursor="hover"
      className={cn(
        'inline-block rounded-full border border-accent/40 px-3 py-1 text-xs',
        'text-text-secondary transition-colors duration-normal hover:border-accent hover:text-accent',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
```

- [ ] **Step 4: Implement `SectionHeading.tsx`**

```tsx
'use client';

import { useSplitReveal } from '@/components/animations/useSplitReveal';
import { cn } from '@/lib/utils';

export interface SectionHeadingProps {
  children: string;
  className?: string;
  as?: 'h2' | 'h3';
}

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
        'font-display text-4xl font-bold leading-[0.95] text-text-primary',
        'md:text-6xl',
        className,
      )}
    >
      {children}
    </Tag>
  );
}
```

- [ ] **Step 5: Implement `MagneticButton.tsx`**

```tsx
'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap } from '@/lib/gsap';
import { cn } from '@/lib/utils';


export interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  /** How far the button drifts toward the cursor, in px. */
  strength?: number;
}

export function MagneticButton({
  children,
  href,
  className,
  strength = 12,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);

  useGSAP(
    () => {
      const { gsap } = getGsap();
      const el = ref.current;
      if (!el) return;

      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const relX = e.clientX - rect.left - rect.width / 2;
        const relY = e.clientY - rect.top - rect.height / 2;
        xTo((relX / (rect.width / 2)) * strength);
        yTo((relY / (rect.height / 2)) * strength);
      };
      const onLeave = () => {
        xTo(0);
        yTo(0);
      };

      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    },
    { scope: ref },
  );

  const classes = cn(
    'group inline-flex items-center gap-2 rounded-full border border-text-muted/40',
    'px-6 py-3 font-sans text-sm font-medium text-text-primary transition-colors',
    'duration-normal hover:border-accent hover:text-accent',
    className,
  );

  if (href) {
    return (
      <a ref={ref} href={href} data-cursor="hover" className={classes}>
        {children}
      </a>
    );
  }
  return (
    <button ref={ref} type="button" data-cursor="hover" className={classes}>
      {children}
    </button>
  );
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/components/ui/`
Expected: PASS — 2 tests.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: UI primitives — Tag, SectionHeading, MagneticButton"
```

---

## Task 6: Global systems — SmoothScroll and CustomCursor

**Files:**
- Create: `src/components/layout/SmoothScroll.tsx`, `src/components/layout/CustomCursor.tsx`
- Test: `src/components/layout/__tests__/CustomCursor.test.tsx`

**Interfaces:**
- Consumes: `getGsap` from `@/lib/gsap`.
- Produces: `<SmoothScroll>` (wraps the app in `layout.tsx`), `<CustomCursor>` (mounted in `layout.tsx`). Both client-only.

- [ ] **Step 1: Write the failing test**

`src/components/layout/__tests__/CustomCursor.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { CustomCursor } from '../CustomCursor';

describe('CustomCursor', () => {
  it('renders nothing on the server / non-pointer layout', () => {
    const { container } = render(<CustomCursor />);
    // Component is client-gated; SSR output must be empty.
    expect(container.firstChild).toBeNull();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/layout/`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `SmoothScroll.tsx`**

```tsx
'use client';

import { ReactLenis } from 'lenis/react';
import { useEffect } from 'react';
import { getGsap } from '@/lib/gsap';
import { prefersReducedMotion } from '@/lib/utils';

/**
 * Lenis smooth scroll, wired into the GSAP ticker so ScrollTrigger
 * stays in sync. Disabled entirely under prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const { gsap } = getGsap();
    let rafId = 0;

    const ticker = (time: number) => {
      window.__lenis?.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (prefersReducedMotion()) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
      }}
    >
      {children}
    </ReactLenis>
  );
}
```

- [ ] **Step 4: Implement `CustomCursor.tsx`**

```tsx
'use client';

import { useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { getGsap } from '@/lib/gsap';


export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!fine.matches) return;
    setEnabled(true);

    const onOver = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('[data-cursor="hover"]')) {
        setHovering(true);
      }
    };
    const onOut = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('[data-cursor="hover"]')) {
        setHovering(false);
      }
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
    };
  }, []);

  useGSAP(
    () => {
      const { gsap } = getGsap();
      const dot = document.querySelector<HTMLElement>('[data-cursor-dot]');
      if (!dot) return;

      const xTo = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3' });
      const yTo = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3' });
      const onMove = (e: MouseEvent) => {
        xTo(e.clientX);
        yTo(e.clientY);
      };
      window.addEventListener('mousemove', onMove);
      return () => window.removeEventListener('mousemove', onMove);
    },
    { dependencies: [enabled] },
  );

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      data-cursor-dot
      className={[
        'pointer-events-none fixed left-0 top-0 z-[10000] -ml-1 -mt-1 h-2 w-2',
        'rounded-full bg-accent transition-transform duration-fast ease-out-expo',
        hovering ? 'scale-[2.5] opacity-70' : 'scale-100 opacity-100',
      ].join(' ')}
    />
  );
}
```

- [ ] **Step 5: Augment the window type**

Create `src/types/global.d.ts`:

```ts
import type Lenis from 'lenis';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}
```

`ReactLenis` from `lenis/react` exposes the instance on `window.__lenis` when `root` is set. If the installed version does not populate it, read the instance from the render-prop instead — see the note in Step 6.

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/components/layout/`
Expected: PASS.

> Implementer note: if `window.__lenis` is `undefined` at runtime, replace the ticker wiring with the `ReactLenis` render-prop form, which hands the instance directly:
>
> ```tsx
> <ReactLenis root options={{ lerp: 0.1 }}>
>   {(lenis) => { /* store lenis in a ref and drive it in the ticker */ }}
> </ReactLenis>
> ```
>
> Keep the GSAP-ticker integration either way — without it ScrollTrigger desyncs from Lenis.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: Lenis smooth scroll and custom cursor"
```

---

## Task 7: Navbar and Footer

**Files:**
- Create: `src/components/layout/Navbar.tsx`, `src/components/layout/Footer.tsx`
- Test: `src/components/layout/__tests__/Navbar.test.tsx`

**Interfaces:**
- Consumes: `cn`, `MagneticButton`.
- Produces: `<Navbar>` and `<Footer>` mounted in `layout.tsx`.

- [ ] **Step 1: Write the failing test**

`src/components/layout/__tests__/Navbar.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '../Navbar';

describe('Navbar', () => {
  it('renders the logo and all nav links', () => {
    render(<Navbar />);
    expect(screen.getByText('Ramadhafidz')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about');
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects');
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills');
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact');
  });

  it('exposes the mobile menu toggle', () => {
    render(<Navbar />);
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/layout/__tests__/Navbar.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `Navbar.tsx`**

```tsx
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
```

- [ ] **Step 4: Implement `Footer.tsx`**

```tsx
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
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/components/layout/__tests__/Navbar.test.tsx`
Expected: PASS — 2 tests.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scroll-aware navbar with mobile overlay menu, footer"
```

---

## Task 8: Hero and About sections

**Files:**
- Create: `src/components/sections/Hero.tsx`, `src/components/sections/About.tsx`
- Create: `public/projects/gradient-1.svg`, `public/projects/gradient-2.svg`, `public/projects/gradient-3.svg`
- Test: `src/components/sections/__tests__/Hero.test.tsx`

**Interfaces:**
- Consumes: `useSplitReveal`, `useParallax`, `SectionHeading`, `cn`.
- Produces: `<Hero id="hero">`, `<About id="about">` — mounted on the home page (Task 10).

- [ ] **Step 1: Write the failing test**

`src/components/sections/__tests__/Hero.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '../Hero';

describe('Hero', () => {
  it('renders the name, tagline, and scroll cue', () => {
    render(<Hero />);
    expect(screen.getByText('Ramadhafidz')).toBeInTheDocument();
    expect(screen.getByText(/Creative Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/scroll/i)).toBeInTheDocument();
  });

  it('is full-viewport', () => {
    const { container } = render(<Hero />);
    expect(container.firstChild).toHaveClass('min-h-screen');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/sections/`
Expected: FAIL — module not found.

- [ ] **Step 3: Create gradient placeholder thumbnails**

`public/projects/gradient-1.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0a0a0a"/>
      <stop offset="1" stop-color="#00f0ff"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="#0a0a0a"/>
  <circle cx="400" cy="400" r="300" fill="url(#g)" opacity="0.25"/>
  <circle cx="800" cy="350" r="220" fill="#00f0ff" opacity="0.08"/>
</svg>
```

Duplicate as `gradient-2.svg` (swap the two circle positions: cx 800/400) and `gradient-3.svg` (single large circle at cx 600, r 380, opacity 0.18).

- [ ] **Step 4: Implement `Hero.tsx`**

```tsx
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
        ref={nameRef}
        className="font-display text-[clamp(3rem,12vw,10rem)] font-extrabold leading-[0.9] text-text-primary"
      >
        Ramadhafidz
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
```

- [ ] **Step 5: Implement `About.tsx`**

```tsx
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
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/components/sections/`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: Hero and About sections"
```

---

## Task 9: Projects, Skills, and Contact sections

**Files:**
- Create: `src/components/sections/Projects.tsx`, `src/components/sections/Skills.tsx`, `src/components/sections/Contact.tsx`
- Test: `src/components/sections/__tests__/Projects.test.tsx`

**Interfaces:**
- Consumes: `getFeaturedProjects`, `projects` from `@/content/projects`; `skills` from `@/content/skills`; `useHorizontalPin`, `useGsapFadeIn`, `SectionHeading`, `Tag`, `MagneticButton`, `cn`.
- Produces: `<Projects id="projects">`, `<Skills id="skills">`, `<Contact id="contact">` — mounted on the home page (Task 10).

- [ ] **Step 1: Write the failing test**

`src/components/sections/__tests__/Projects.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Projects } from '../Projects';

describe('Projects', () => {
  it('renders one card per featured project', () => {
    render(<Projects />);
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });

  it('renders the section heading', () => {
    render(<Projects />);
    expect(screen.getByText('Selected Projects')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/sections/__tests__/Projects.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `Projects.tsx`**

```tsx
'use client';

import Image from 'next/image';
import { getFeaturedProjects } from '@/content/projects';
import { useHorizontalPin } from '@/components/animations/useHorizontalPin';
import { useGsapFadeIn } from '@/components/animations/useGsapFadeIn';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Tag } from '@/components/ui/Tag';

export function Projects() {
  const featured = getFeaturedProjects();
  const sectionRef = useHorizontalPin<HTMLDivElement>({
    trackSelector: '[data-track]',
  });
  const headingRef = useGsapFadeIn<HTMLDivElement>();

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative overflow-hidden bg-bg-primary py-[var(--section-padding)]"
    >
      <div
        ref={headingRef}
        className="mx-auto max-w-[var(--content-max-width)] px-6 md:px-10"
      >
        <SectionHeading className="mb-12">Selected Projects</SectionHeading>
      </div>

      {/* Desktop: pinned horizontal track. Mobile: vertical stack. */}
      <div
        data-track
        className="flex flex-col gap-8 px-6 md:flex-row md:flex-nowrap md:gap-10 md:px-10 lg:gap-16"
      >
        {featured.map((project, index) => (
          <article
            key={project.slug}
            data-cursor="hover"
            className="group relative w-full shrink-0 md:w-[60vw] lg:w-[55vw]"
          >
            <span className="absolute -top-10 left-0 font-display text-6xl font-extrabold text-white/5">
              {String(index + 1).padStart(2, '0')}
            </span>

            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
              {project.thumbnail.src ? (
                <Image
                  src={project.thumbnail.src}
                  alt={project.thumbnail.alt || project.title}
                  fill
                  className="object-cover transition-transform duration-slow ease-out-expo group-hover:scale-105"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                />
              ) : null}
            </div>

            <div className="mt-6">
              <h3 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                {project.title}
              </h3>
              {project.description ? (
                <p className="mt-2 max-w-prose text-text-secondary">
                  {project.description}
                </p>
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
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Implement `Skills.tsx`**

```tsx
'use client';

import { skills } from '@/content/skills';
import { useGsapFadeIn } from '@/components/animations/useGsapFadeIn';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { cn } from '@/lib/utils';

export function Skills() {
  const gridRef = useGsapFadeIn<HTMLDivElement>({
    stagger: 0.06,
    staggerSelector: '[data-skill]',
  });

  return (
    <section
      id="skills"
      className="mx-auto max-w-[var(--content-max-width)] px-6 py-[var(--section-padding)] md:px-10"
    >
      <SectionHeading className="mb-12">Skills</SectionHeading>

      <div
        ref={gridRef}
        className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4"
      >
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="mb-5 text-xs uppercase tracking-[0.2em] text-accent">
              {group.category}
            </h3>
            <ul className="flex flex-wrap gap-2.5">
              {group.items.map((skill) => (
                <li
                  key={skill.name}
                  data-skill
                  data-cursor="hover"
                  className={cn(
                    'rounded-lg border border-white/10 bg-bg-secondary px-4 py-2 text-sm',
                    'text-text-secondary transition-all duration-fast',
                    'hover:-translate-y-1 hover:border-accent/60 hover:text-accent',
                  )}
                >
                  {skill.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Implement `Contact.tsx`**

```tsx
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
          <MagneticButton type="button">Send Message</MagneticButton>
        </form>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/components/sections/`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: Projects horizontal gallery, Skills grid, Contact section"
```

---

## Task 10: Compose the home page and verify

**Files:**
- Modify: `src/app/layout.tsx`, `src/app/page.tsx`
- Test: `src/app/__tests__/page.test.tsx`

**Interfaces:**
- Consumes: all five sections, `SmoothScroll`, `CustomCursor`, `Navbar`, `Footer`.

- [ ] **Step 1: Write the failing test**

`src/app/__tests__/page.test.tsx`:

```tsx
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home', () => {
  it('renders all five sections in order', () => {
    const { container } = render(<Home />);
    const ids = Array.from(container.querySelectorAll('section[id]')).map(
      (el) => el.id,
    );
    expect(ids).toEqual(['hero', 'about', 'projects', 'skills', 'contact']);
  });

  it('renders the projects gallery', () => {
    render(<Home />);
    expect(screen.getByText('Selected Projects')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/app/`
Expected: FAIL — `Home` renders only the placeholder.

- [ ] **Step 3: Compose `src/app/page.tsx`**

```tsx
import { Hero } from '@/components/sections/Hero';
import { About } from '@/components/sections/About';
import { Projects } from '@/components/sections/Projects';
import { Skills } from '@/components/sections/Skills';
import { Contact } from '@/components/sections/Contact';

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 4: Mount global systems in `src/app/layout.tsx`**

Add to the root layout, inside `<body>`:

```tsx
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { CustomCursor } from '@/components/layout/CustomCursor';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ...inside <body>:
<CustomCursor />
<SmoothScroll>
  <Navbar />
  {children}
  <Footer />
</SmoothScroll>
```

Keep the font variables and metadata from Task 1 intact.

- [ ] **Step 5: Run the full test suite**

Run: `npm test`
Expected: all tests pass.

- [ ] **Step 6: Run the build gate**

Run: `npm run build`
Expected: succeeds, exit code 0, no TypeScript errors.

- [ ] **Step 7: Manual smoke check**

Run: `npm run dev`, then open `http://localhost:3000` and verify:
- Hero name reveals per-character on load
- Nav bar gains a background after scrolling 40px
- Projects section pins and scrolls horizontally on desktop (≥1024px)
- Projects section stacks vertically at narrow widths
- Custom cursor dot is visible and scales over links on desktop; absent on touch
- Mobile hamburger opens the overlay menu and links close it
- `prefers-reduced-motion` (browser devtools emulation) leaves all content visible
- No console errors

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: compose home page with all sections and global systems"
```

---

## Definition of done

Matches the spec's acceptance criteria:

1. `npm run build` passes clean.
2. Home renders all five sections with working scroll animations on desktop Chromium.
3. Mobile layout stacks; cursor and smooth scroll inactive on touch.
4. `prefers-reduced-motion` leaves all content visible.
5. `src/content/projects.ts` and `src/content/skills.ts` hold the agreed empty slots.
