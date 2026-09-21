# Portfolio Website — Increment 1: Foundation + Home

> Parent spec: [`2026-09-21-portfolio-website-design.md`](./2026-09-21-portfolio-website-design.md)
>
> Status: **Approved**. This document scopes the first buildable increment and records the decisions made during the 2026-09-21 brainstorming session.

## Scope

Everything needed to ship a **deployable homepage** with its full cinematic scroll animation:

- Project scaffold: Next.js 14 App Router + TypeScript + Tailwind CSS
- Design tokens, global styles, CSS grain overlay, fonts
- Global systems: Lenis smooth scroll, custom cursor, scroll-aware navbar with mobile overlay menu, footer
- All five homepage sections: Hero, About, Projects (pinned horizontal scroll), Skills, Contact
- GSAP animation hooks and wrappers, client-isolated, with reduced-motion + mobile guards
- Typed data layer for projects and skills

**Out of scope (deferred to increment 2):**

- MDX content pipeline (`gray-matter` / `next-mdx-remote`)
- `/projects/[slug]` detail pages, lightbox, prev/next navigation
- `/blog` listing + `/blog/[slug]` article pages, code syntax highlighting, reading-time, table of contents
- Sitemap generation, JSON-LD structured data
- Working Formspree submission handler (markup only this increment)

## Decisions (from brainstorming)

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Increment scope | Foundation + Home page | Ships a complete, impressive, deployable homepage; defers the heavier MDX/blog machinery |
| Fonts | Syne (headings, variable 600–800) + Space Grotesk (UI/body) via `next/font/google` | Spec offered "Clash Display / Syne". Clash Display is Fontshare-only and adds a manual asset to maintain. Syne gives the same bold editorial feel, is variable, free, and self-hosted/subset by Next.js at build time — no runtime CDN call. |
| Content | User supplies real project titles, links, and skill list | Nothing fabricated as real work. Data files ship with clearly-labeled empty slots for the user to fill. |
| Data shape | Typed array in `src/content/` this increment; MDX glob loader in increment 2 | The array's `Project` type mirrors the spec's frontmatter schema exactly, so increment 2 swaps only the loader — components stay untouched. |
| Thumbnails | Generated abstract SVG/gradient placeholders, local only | No real screenshots exist yet; avoids broken-looking images while keeping the gallery intentional and network-free. |
| Horizontal scroll | Desktop-only pin; mobile stacks vertically | Spec requires simplifying complex animations on mobile/touch. |
| Contact form | Static markup with a Formspree-ready `action` attribute | No form key baked into the repo. |

## Architecture

### File map

```
src/
├── app/
│   ├── layout.tsx              # Fonts, SmoothScroll, CustomCursor, Navbar, Footer, metadata
│   ├── page.tsx                # Home: composes sections in order
│   └── globals.css             # Tailwind + tokens + grain + cursor base
├── components/
│   ├── layout/
│   │   ├── SmoothScroll.tsx    # Lenis provider (React SDK)
│   │   ├── CustomCursor.tsx    # Dot follower, scales on interactive hover
│   │   ├── Navbar.tsx          # Transparent → solid on scroll; mobile overlay menu
│   │   └── Footer.tsx          # Minimal, back-to-top
│   ├── sections/
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Projects.tsx        # Pinned horizontal gallery
│   │   ├── Skills.tsx
│   │   └── Contact.tsx
│   ├── animations/
│   │   ├── useGsapFadeIn.ts    # ScrollTrigger fade/slide, staggered children
│   │   ├── useSplitReveal.ts   # Per-character stagger, clip-path line mask
│   │   ├── useHorizontalPin.ts # ScrollTrigger pin → translateX
│   │   └── useParallax.ts      # Transform-only parallax
│   └── ui/
│       ├── Tag.tsx
│       ├── MagneticButton.tsx  # Button that drifts toward cursor
│       └── SectionHeading.tsx  # Clip-path reveal heading
├── content/
│   ├── projects.ts             # Typed Project[] — user fills real data
│   └── skills.ts               # Typed SkillGroup[] — user fills real data
├── lib/
│   ├── gsap.ts                 # Single plugin registration + shared config
│   └── utils.ts                # cn() class merge, slug helpers
└── types/
    └── content.ts              # Project, Skill, SkillGroup
```

### Data contracts

Mirrors the parent spec's frontmatter schema so increment 2 swaps the loader without touching components.

```ts
// src/types/content.ts
export interface Project {
  slug: string;
  title: string;
  description: string;
  thumbnail: { src: string; alt: string };  // local asset path
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  date: string;            // YYYY-MM-DD
  featured: boolean;
}

export interface SkillGroup {
  category: string;
  items: Skill[];
}

export interface Skill {
  name: string;
  icon?: string;           // local SVG path or null for text-only chip
}
```

### Global systems

- **Smooth scroll** — `@studio-freight/react-lenis`. Wraps the app in `layout.tsx`. Integrated with GSAP's ticker so ScrollTrigger stays in sync (Lenis `raf` drives `gsap.ticker`). Disabled when `prefers-reduced-motion`.
- **Custom cursor** — client component. A dot following the pointer with a brief lag (GSAP `quickTo`); scales up and blends with a ring on `[data-cursor="hover"]` targets. `@media (hover: none)` hides it entirely.
- **GSAP** — registered once in `lib/gsap.ts` behind a module-level guard flag so HMR and any SSR path can't double-register. All animation components are `"use client"`.

### Section behaviors

| Section | Desktop | Mobile |
|---------|---------|--------|
| Hero | 100vh, per-character name reveal, clip-path tagline, mouse parallax, scroll-out fade/scale | Same reveals, parallax via device tilt disabled — static |
| About | Split layout, line-by-line text reveal, photo scale-in with slight rotation, accent glow pulse | Single column, same reveals |
| Projects | Pinned horizontal scroll; project number counters; image parallax | Vertical stack, counters static |
| Skills | Grid stagger (scale 0 → 1, left-to-right), accent glow on hover | Same, simplified timing |
| Contact | Clip-path heading, staggered social links, gradient pulse, static form | Same |

## Content slots

`src/content/projects.ts` and `src/content/skills.ts` ship with clearly-labeled placeholder structure — a `Project[]` with generic slugs and empty/`""` string fields marked with a comment (`// TODO: replace with real content`). The homepage reads from these arrays, so the site renders immediately and looks intentional, but nothing is presented as real past work. Replacing the file contents is the only work required to go live with real content.

## Responsiveness & accessibility

- Mobile-first Tailwind breakpoints; complex motion (horizontal pin, parallax) is guarded behind `gsap.matchMedia()` `(min-width: 1024px)`.
- `prefers-reduced-motion` disables Lenis and non-essential GSAP timelines; content remains visible (animations set their end state, not the start state, when reduced motion is active).
- Custom cursor is decorative only — all interactions work with the native pointer.
- Semantic headings and `alt` text on all imagery.

## Testing

- **Build gate:** `npm run build` must pass with zero TypeScript errors. This is the acceptance bar for the increment — a portfolio site with no build is undeployable.
- **Manual smoke check:** `npm run dev`, verify each section enters on scroll, horizontal pin works on desktop and stacks on mobile, cursor and menu behave, no console errors.
- No unit tests this increment. The surface is visual and DOM-gesture-driven; the build gate plus manual smoke covers what matters. Tests become worthwhile once logic (MDX parsing, reading-time, routing) arrives in increment 2.

## Definition of done

1. `npm run build` passes clean.
2. Home page renders all five sections with scroll animations working on desktop Chromium.
3. Mobile layout stacks correctly; cursor and smooth scroll are inactive on touch.
4. `prefers-reduced-motion` leaves all content fully visible.
5. `src/content/projects.ts` and `src/content/skills.ts` contain the agreed empty slots ready for real content.
