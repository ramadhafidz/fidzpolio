# Ramadhafidz Portfolio Website — Design Spec

## Overview

A cinematic, scroll-driven portfolio website for **Ramadhafidz** (Hafidz Ramadhan Ghiffari), a Creative Developer. The site showcases animation skills, interactive experiences, and creative projects through a Dark & Edgy visual identity with GSAP-powered scroll storytelling.

**Goal:** A portfolio that _is_ the proof of skill — every scroll, hover, and transition demonstrates what Ramadhafidz can build.

## Tech Stack

| Layer        | Choice                        | Rationale                                      |
|-------------|-------------------------------|-------------------------------------------------|
| Framework   | Next.js 14+ (App Router)      | SSR/SSG, great SEO for blog, React ecosystem    |
| Language    | TypeScript                    | Type safety, better DX                          |
| Styling     | Tailwind CSS                  | Rapid styling, consistent design tokens         |
| Animation   | GSAP + ScrollTrigger          | Industry-standard, powerful scroll animations   |
| Content     | MDX                           | Write projects & blog posts as files, no CMS    |
| Fonts       | Clash Display / Syne (heading), Inter / Space Grotesk (body) | Bold editorial headings, clean readable body |
| Deploy      | Vercel                        | Zero-config Next.js hosting                     |
| Forms       | Formspree                     | Simple contact form, no backend needed           |
| Smooth Scroll | Lenis                       | Buttery smooth scroll feel                       |

## Visual Identity

- **Background:** Near-black (#0a0a0a) with subtle grain/noise texture overlay
- **Text:** Off-white (#fafafa) for headings, lighter gray (#d4d4d4) for body
- **Accent:** Electric blue (#00f0ff) — used sparingly for hover states, glows, highlights
- **Typography:** Oversized headings (8-12vw on hero), bold weights, editorial feel
- **Custom Cursor:** Small dot that scales up on interactive element hover
- **Grain Texture:** CSS-based noise overlay for cinematic depth

## Sections

### 1. Hero / Landing

Full-viewport (100vh) cinematic opening.

**Animation Sequence (on page load):**
1. Screen fully dark → grain texture fades in
2. "Ramadhafidz" reveals per-character with stagger animation (slide up + fade in)
3. Tagline "Creative Developer" reveals with clip-path mask animation
4. Decorative line elements animate in from edges
5. Scroll indicator (animated arrow/line) appears last at bottom

**Interactions:**
- Mouse movement triggers subtle parallax shift on text/background elements
- Scroll down → hero elements fade out and scale with ScrollTrigger

**Typography:** Name displayed at 8-12vw, single impactful word.

### 2. About Me

Split layout — text left, photo/visual element right.

**Content:** 3-4 sentence narrative about Hafidz Ramadhan Ghiffari as a Creative Developer. Focused on passion and story, not a CV.

**Animation (ScrollTrigger):**
- Text reveals line by line with stagger on scroll entry
- Photo/visual scales up from small with slight rotation
- Accent glow pulse in background

**Visual Elements:**
- Space for personal photo or abstract visual (added later)
- Decorative lines/shapes animated by scroll position
- Subtle gradient or glow effect around accent color

### 3. Projects / Works

The showcase centerpiece — most impressive section.

**Layout:** Horizontal scroll gallery. On vertical scroll, this section pins and translates horizontally (GSAP ScrollTrigger pin + horizontal translateX). Each project occupies near-full-screen.

**Per Project Card:**
- Large screenshot/thumbnail (70% of area)
- Bold project title
- Small tech-stack tags
- Hover: image slight zoom + color shift, cursor becomes "View Project" text
- Click → dynamic route `/projects/[slug]`

**Section Entry Animation:**
- "Selected Projects" heading reveals with clip-path animation
- Project number indicators ("01", "02", "03") count up during scroll
- Parallax: images translate slower than containers

**Project Detail Page (`/projects/[slug]`):**
- Page transition animation (expand or slide-in)
- Full-width hero image
- Description, challenge, solution, tech stack
- Image gallery with lightbox
- Links to live site & GitHub repo
- Prev/next project navigation

**Data Source:** MDX files in `/content/projects/`
```yaml
# Frontmatter schema
title: string
description: string
thumbnail: string       # path to thumbnail image
tags: string[]          # tech stack tags
liveUrl: string         # optional
githubUrl: string       # optional
date: string            # YYYY-MM-DD
featured: boolean       # show on homepage
```

### 4. Skills / Tech Stack

Grid layout with icons/logos per technology, grouped by category.

**Categories:**
- Languages (TypeScript, JavaScript, HTML, CSS)
- Frameworks (Next.js, React, etc.)
- Animation (GSAP, etc.)
- Tools (Git, Figma, VS Code, etc.)
- (User fills with actual skills)

**Animation (ScrollTrigger):**
- Each skill item staggers in: scale from 0 + fade in, left to right
- Hover: item glows with accent color, slight lift/float

**Style:**
- Monochrome icons on dark background
- Accent color appears on hover
- Clean grid with generous whitespace

### 5. Blog

Grid of 2-3 columns for article listing.

**Blog Card:**
- Thumbnail/cover image
- Title, date, tags, short excerpt
- Reading time (auto-calculated from word count)

**Blog System:**
- MDX files in `/content/blog/`
- Frontmatter: title, date, description, tags, coverImage
- Code syntax highlighting for technical articles

**Blog Article Page (`/blog/[slug]`):**
- Clean reading layout, max-width ~720px
- Readable typography (#d4d4d4 body text)
- Optional table of contents sidebar on large screens
- Prev/next article navigation
- Code blocks with dark theme (One Dark or custom)
- Tags as pill/badge with accent color border

```yaml
# Blog frontmatter schema
title: string
date: string            # YYYY-MM-DD
description: string
tags: string[]
coverImage: string      # optional
```

**Animation:**
- Cards stagger in with fade-in + slide-up on scroll
- Hover: card lifts, shadow glows accent color
- Page transitions smooth between listing and article

### 6. Contact

Full-viewport closing section.

**Content:**
- Large heading: "Let's Work Together" or "Get In Touch"
- Email address (clickable mailto link)
- Social links: GitHub, LinkedIn, Twitter/X, Instagram (as applicable)
- Simple contact form (name, email, message) via Formspree

**Animation:**
- Heading reveals with clip-path animation
- Social links stagger in one by one
- Subtle background gradient pulse or floating particles

**Footer:**
- Minimalist: "© 2026 Ramadhafidz" + "Built with Next.js & GSAP"
- Back-to-top button with smooth scroll

## Global Elements

### Custom Cursor
Small dot that follows mouse position. Scales up when hovering over interactive elements (links, buttons, project cards). Hidden on mobile/touch devices.

### Navbar
- Fixed at top, transparent background (gains background on scroll)
- "Ramadhafidz" logo on the left
- Navigation links on the right: About, Projects, Blog, Contact
- Hamburger menu on mobile → full-screen overlay menu with stagger animation

### Page Transitions
Smooth fade/slide transitions between pages using GSAP or Next.js view transitions.

### Smooth Scroll
Lenis for buttery smooth scrolling experience across the site.

### Responsive Design
- Mobile-first approach
- Complex animations (horizontal scroll, parallax) simplified or replaced on mobile/tablet
- Touch-friendly interactions replace hover effects on touch devices
- Custom cursor hidden on touch devices

### SEO
- Meta tags and Open Graph tags per page
- Structured data (JSON-LD) for person, blog articles
- Sitemap generation
- Proper heading hierarchy

## Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout, fonts, metadata
│   ├── page.tsx                # Home page (all sections)
│   ├── projects/
│   │   └── [slug]/
│   │       └── page.tsx        # Project detail page
│   └── blog/
│       ├── page.tsx            # Blog listing page
│       └── [slug]/
│           └── page.tsx        # Blog article page
├── components/
│   ├── layout/                 # Navbar, Footer, CustomCursor
│   ├── sections/               # Hero, About, Projects, Skills, Blog, Contact
│   ├── ui/                     # Reusable: Button, Card, Tag, Badge, etc.
│   └── animations/             # GSAP hooks & wrapper components
├── content/
│   ├── projects/               # MDX project files
│   └── blog/                   # MDX blog posts
├── lib/
│   ├── mdx.ts                  # MDX parsing & utilities
│   └── gsap.ts                 # GSAP plugin registration & shared config
└── styles/
    └── globals.css             # Tailwind base + custom CSS (grain, etc.)
```

## Performance Considerations

- GSAP loaded only on client side (`"use client"` components)
- Images optimized via Next.js `<Image />` component
- Font subsetting and preloading for critical fonts
- Lazy load below-fold sections
- ScrollTrigger animations use `will-change` and GPU-accelerated transforms only
- Grain texture via CSS (no heavy image overlay)

## Design Tokens

```css
/* Colors */
--bg-primary: #0a0a0a;
--bg-secondary: #141414;
--text-primary: #fafafa;
--text-secondary: #d4d4d4;
--text-muted: #737373;
--accent: #00f0ff;
--accent-glow: rgba(0, 240, 255, 0.15);

/* Spacing */
--section-padding: clamp(4rem, 10vh, 8rem);
--content-max-width: 1200px;
--blog-max-width: 720px;

/* Transitions */
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--duration-fast: 0.3s;
--duration-normal: 0.6s;
--duration-slow: 1.2s;
```

## Content Strategy

All content is file-based (MDX). No CMS, no database. Adding a new project or blog post means creating a new `.mdx` file in the appropriate `/content/` subdirectory with the correct frontmatter. The site rebuilds automatically on deploy.

This keeps the portfolio simple to maintain and version-controlled alongside the code.
