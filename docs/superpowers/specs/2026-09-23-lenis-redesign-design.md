# Redesign fidzpolio to the lenis.dev design language

**Status:** Draft, awaiting review
**Date:** 2026-09-23
**Reference:** https://lenis.dev/ (darkroom.engineering)
**Working mode:** In-tree, no worktree (`no-worktrees-work-in-place` memory rule)

## 1. Intent

The site today reads as "standard portfolio with a cyber accent": cyan `#00f0ff`, glow
blobs, `rounded-2xl`, grain overlay, centered name hero. The user wants it to read the
way lenis.dev reads — expensive through restraint: pure black, off-white type, hairline
borders, near-square corners, huge condensed typography, and motion that lives in the
text rather than in fades and glows.

Two scope decisions, both confirmed by the user:

1. **Replicate the structure too**, not only the surface. lenis.dev's section rhythm is
   copied and mapped onto portfolio content. The current About / Skills / Contact
   sections are absorbed into new sections rather than restyled in place.
2. **Pure monochrome.** The cyan accent, accent glow, gradients and grain are deleted.
   No fourth color enters the palette.

## 2. Evidence base — verified, not guessed

All token values in this spec were extracted from lenis.dev's production stylesheet,
fetched directly:

```
https://lenis.dev/                                                (HTML, 178 KB)
https://lenis.dev/_next/static/immutable/chunks/0_-6o03czf8qa.css  (81 KB)
```

Two corrections to assumptions made earlier in the conversation, both now resolved
against the real CSS:

- **"Off-black background"** — wrong. The background is literal `#000000`. lenis.dev is
  darker than this site, not warmer.
- **"No monospace labels"** — wrong, and this one materially changes the label treatment.
  lenis.dev *does* use a monospace face for labels/rich text: `font-family: "Courier New",
  Courier, monospace`. The small uppercase labels are monospace, not Roboto-with-tracking.
- **"Three colors only"** — incomplete. The core palette is `#000` / `#efefef` / `#b0b0b0`,
  but lenis.dev also carries a genuine **pink accent `#ff98a2`** (`--color-pink`,
  `--color-contrast`, used 5× as `border-color: var(--theme-contrast)`, and with
  `mix-blend-mode: difference` on the scroll hint), a single `#8c8c8c` mid-grey hairline,
  and soft hairlines via `color-mix(in oklab, var(--theme-contrast) 50%, transparent)` and
  a 30% variant. §3.1 records this as a deliberate deviation, not a faithful reading.
- A draft circulated tokens named `--color-bg-card: #111`, `--color-text-muted: #666`,
  and `--font-mono: JetBrains Mono`. **None of these exist on lenis.dev.** They are not
  used in this spec; the monospace label face is Courier New (§3.2), not a named variable.

Unverified, and deliberately not specified: exact per-section spacing on lenis.dev is
computed with viewport-relative `calc()` tied to a fixed `--device-width` of 1440/375.
This spec uses the underlying pixel values with media queries instead — same visual
result, maintainable in Tailwind.

## 3. Design tokens

### 3.1 Palette — monochrome, with lenis.dev's pink recorded as a deliberate omission

| Token | Value | Source on lenis.dev |
|---|---|---|
| `--color-bg` | `#000000` | `--color-black` / `--color-primary: #000` |
| `--color-text-primary` | `#efefef` | `--color-white` / `--color-secondary` |
| `--color-text-secondary` | `#b0b0b0` | `--color-grey` |
| `--color-line` | `rgba(239,239,239,0.10)` | `color-mix(in oklab, <contrast> 30%, transparent)` |
| `--color-line-strong` | `rgba(239,239,239,0.50)` | `color-mix(in oklab, <contrast> 50%, transparent)` |
| `--color-line-mid` | `#8c8c8c` | single `border-color: #8c8c8c` declaration |
| `--color-surface-hover` | `rgba(239,239,239,0.03)` | derived hover fill |

**Deliberate deviation, stated so it is not mistaken for an oversight:** lenis.dev has a
real accent, pink `#ff98a2` (`--color-pink` / `--color-contrast`), used five times as
`border-color: var(--theme-contrast)` and combined with `mix-blend-mode: difference` on the
scroll hint. **This redesign omits it**, per the user's explicit choice of pure monochrome.
The user's existing cyan `#00f0ff` is also dropped, so the site loses its accent rather than
swapping one hue for another. Any future change of heart should restore `#ff98a2` — lenis.dev's
actual accent — not the cyan.

Derived rather than hard-coded: lenis.dev builds its soft hairlines with `color-mix(in oklab,
…)`, and the spec mirrors that by deriving `--color-line` / `--color-line-strong` from
`#efefef` via opacity. `--color-line-mid` is kept as a literal because it appears once as a
plain `#8c8c8c` and a 50%-opacity white reads differently from that mid-grey.

Deleted: `--color-accent: #00f0ff`, `--color-accent-glow`, `--color-bg-secondary: #141414`,
`--color-text-muted: #737373`, `--color-text-primary: #fafafa`, `--color-text-secondary: #d4d4d4`.

`::selection` becomes `background: #efefef; color: #000` — monochrome, replacing the
cyan highlight.

### 3.2 Typography

| Role | Family | Notes |
|---|---|---|
| Display | **Anton** (`next/font/google`) | Replaces Syne. Weight 400 only — Anton is already heavy; all `font-extrabold`/`font-bold` on display type is removed. |
| Body | **Roboto** (`next/font/google`) | Replaces Space Grotesk. lenis.dev's actual body face. |
| Labels | **Courier New**, `monospace` | Corrected: lenis.dev uses `"Courier New", Courier, monospace` for labels/rich text. Previously this spec wrongly said there was no monospace face and prescribed Roboto-with-tracking. |
| Section headings | Anton | Single display family. Panchang is not on Google Fonts and is not used. |

Display type scale (px at desktop 1440 / mobile 375, from lenis.dev's own scale):

- Hero name: `clamp(2.75rem, 14vw, 9.5rem)` — lenis uses 96–160px with `vh`-linked variants
- Section heading: `56px` desktop / `40px` mobile
- Capability title: `52px` desktop / `32px` mobile
- Body large (manifesto): `20px` / `18px`
- Body: `16px` / `14px`
- Label: `12px` / `12px`

Display treatment, non-negotiable — this is what carries the mood once color is gone:
`text-transform: uppercase`, `line-height: 0.8–0.9`, `letter-spacing: -0.03em`.
lenis.dev uses `line-height: .8`, `90%`, `100%` and `letter-spacing: -.03em` on display.

Labels: `text-transform: uppercase` (8 uses on lenis.dev), **Courier New monospace**,
`12px`, `--color-text-secondary`. Note lenis.dev keeps label tracking at `letter-spacing: 0`
(the tightness is the point); this spec widens ours slightly to `0.1em` for legibility at
`12px` — a small, explicit deviation.

### 3.3 Radius, borders, shadows

- Default radius: `0.25em` (the single most common value on lenis.dev, 12 uses).
- Scale: `--radius-xs: 2px`, `--radius-sm: 4px` (= `.25em` at 16px), `--radius-md: 8px`.
  Hard maximum anywhere in the product: **8px**, down from `rounded-2xl` (24px).
- `rounded-full` is removed entirely — tags and buttons become hairline rectangles with
  `.25em` radius. lenis.dev has no pill shapes.
- Borders are the primary structural device on lenis.dev: `1px` hairlines (plus a 2px and a
  4px weight, and one responsive `≈1.4px`). Hairlines separate rows, outline cards, and box
  the CTA. Note lenis.dev also carries two `border-style: dashed` uses — not adopted here;
  our hairlines are all solid.
- **`box-shadow` is forbidden.** lenis.dev's stylesheet contains zero box-shadow
  declarations and no blur glows. Depth comes from hairlines and type scale, not shadows.

### 3.4 Layout grid

lenis.dev's grid, ported:

- `--columns: 12` desktop / `6` mobile, `--gap: 24px`
- `--safe` (outer margin): `40px` desktop / `16px` mobile
- `--header-height: 56px`
- Spacers: `xs 48`, `sm 64`, `md 80`, `lg 128`, `xl 192` desktop; `32 / 32 / 48 / 64 / 80`
  mobile. Section vertical padding lands at `lg`–`xl`.

The current `--content-max-width: 1200px` container is **replaced** by this fluid grid
(a `max-w-[var(--layout-width)]` centered wrapper with the safe margins above).

### 3.5 Motion

- Signature ease stays: `cubic-bezier(.19,1,.22,1)` (lenis `--ease-out-expo`) — already
  `--ease-out-expo` in this repo. ✔ unchanged.
- `useGsapFadeIn` default `y` is retuned `40 → 24`. lenis's motion is subtle and close;
  40px reads as bouncy.
- Marquee: constant-speed transform loop, `ease: 'none'`, seamless via duplicated track.
- Reduced motion: **content is never trapped in a hidden start state.** This is the
  existing repo invariant (`prefersReducedMotion()` guards in every hook) and it extends
  to the new marquee hook, which renders a static grid instead of animating.

### 3.6 Removed decoration

| Removed | Where it lives now |
|---|---|
| Grain overlay | `globals.css:53-61` (`body::before` SVG noise) |
| Native cursor suppression | `globals.css:65-69` (`* { cursor: none }`) |
| Custom cursor dot | `src/components/layout/CustomCursor.tsx` (+ its test) |
| Accent glow blobs | `About.tsx:38-39`, `Contact.tsx:27-28` |
| Gradient hero lines | `Hero.tsx:24-31` |
| Cyan `::selection` | `globals.css:47-50` |
| Gradient placeholder thumbnails | `public/projects/gradient-1..3.svg` |

lenis.dev ships no cursor replacement and no texture overlay. Removing the custom cursor
is also an accessibility gain — the native pointer returns for low-vision and
magnification users.

## 4. Structure — lenis.dev section rhythm mapped to portfolio content

New document order, with the old sections shown as absorbed:

| # | New section | Absorbs | lenis.dev analogue |
|---|---|---|---|
| 1 | `Header` | Navbar | Minimal fixed header + status pill |
| 2 | `Hero` | Hero | Giant statement word + byline |
| 3 | `Manifesto` ("Why work with me") | **About** | "Why smooth scroll?" + feature cards |
| 4 | `Work` ("Selected Work") | **Projects** | "Lenis runs the web" marquee |
| 5 | `Capabilities` | **Skills** | "Lenis brings the heat" numbered list |
| 6 | `ContactCTA` | **Contact** | "As it should be" bordered box |
| 7 | `Footer` | Footer | Minimal hairline footer |

Section `id`s change to `hero`, `manifesto`, `work`, `capabilities`, `contact`. Navbar
anchor links are updated to match.

A page-level detail this spec adopts: lenis.dev runs a **fixed scroll-progress hairline at
the top of the viewport** (`transform: scaleX(progress)`, `transform-origin: 0 50%`, hidden
under `@media (hover: none)`) — the only persistent UI chrome on the page. §4.8 specifies a
monochrome equivalent, driven by Lenis scroll progress, replacing the current navbar's
opaque scroll state as the primary scroll cue.

### 4.1 Header

Fixed, `56px` tall. Transparent at scroll-top; on scroll past `56px` gains
`background: var(--color-bg)` and a bottom hairline. Left: wordmark `RAMADHAFIDZ`
(Roboto 700, uppercase, wide tracking). Right: nav links + an availability pill — a
`1px`-bordered cell reading `AVAILABLE FOR WORK` with a small `#efefef` dot. This dot is
the only decorative shape in the product. Mobile hamburger and overlay menu are kept
(existing a11y work: `hidden` + `inert`, Escape-to-close — see §7).

### 4.2 Hero

Full viewport. Eyebrow label `PORTFOLIO 2026`. The name `RAMADHAFIDZ` in Anton, uppercase,
`letter-spacing: -0.03em`, `line-height: 0.8`, at `clamp(2.75rem, 14vw, 9.5rem)`. Below it,
one line: `Creative Developer`. Bottom-left/right corners hold the scroll cue (label +
hairline stem), repositioned from center-bottom to a corner to match lenis's asymmetric
composition. Char-split reveal via the existing `useSplitReveal`.

### 4.3 Manifesto — absorbs About

A large statement paragraph (Roboto `20px`, `line-height: 133%`, max width ~28rem) drawn
from the About copy, followed by three bordered cells in a 3-column grid, each with an
Anton index (`01`–`03`), a title and one line of body. The About photo placeholder, its
glow and the `Photo coming soon` stub are deleted — lenis.dev has no portrait, and a
placeholder image is worse than a well-set paragraph.

### 4.4 Work — absorbs Projects

A marquee showcase replacing the pinned horizontal track. Cards: `1px` hairline outline,
`--radius-sm`, `aspect-ratio: 16/10`, project title in Anton, year (from `Project.date`),
and tags. Two rows scrolling in opposite directions on desktop; below `1024px` a single
vertical stack — the same breakpoint discipline the current `useHorizontalPin` already
enforces, so no card is ever unreachable. Thumbnails become CSS-only monochrome
placeholders (hairline box + Anton index) so the gradient SVGs can be deleted rather
than recoloured.

### 4.5 Capabilities — absorbs Skills

The most recognisable lenis.dev pattern. Full-width rows separated by hairlines, each:
an Anton index (`01`, `02`, … two-digit padded), capability title in Anton (`52px`),
one-line description, and the skill names from `skills.ts` as small hairline chips. Row
hover fills `--color-surface-hover` and brightens the hairline. `skills.ts` categories map
to capabilities; see §5.

The number of rows is the number of skill groups, not a fixed 7 — lenis.dev happens to
list seven features, but a capabilities list whose length is hard-coded to content it does
not have would render two-digit indices for empty rows. The `01`–`07` *treatment* is what
is replicated; the count follows the data (currently four groups → `01`–`04`).

### 4.6 ContactCTA — absorbs Contact

A single bordered box (lenis's "As it should be"): Anton headline `LET'S BUILD SOMETHING`,
one line of copy, a `mailto:` link styled as a large underlined display line, and the
social links as a hairline-separated row. **The contact form is deleted** — the
Formspree-ready name/email/message form does not exist in this design language, and a
`mailto:` CTA is the authentic lenis pattern. Social entries with empty `href` still
render as muted non-links, preserving the current behaviour.

### 4.7 Footer

Hairline top rule, three columns: wordmark/copyright, build note, back-to-top. Unchanged
in spirit, restyled to the token set.

### 4.8 ScrollProgress

A fixed `1px`-tall hairline pinned to the top of the viewport, `#efefef`, scaled horizontally
with scroll: `transform: scaleX(progress)`, `transform-origin: 0 50%`. On lenis.dev this is
the only persistent UI chrome. It reads the scroll progress off the Lenis instance (or
`window.scrollY / scrollHeight` as a fallback when Lenis is bypassed under reduced motion)
and is hidden on coarse pointers (`@media (hover: none)`). Because the header already sits at
`top: 0`, the hairline renders *above* the header (`z-index` higher) — the header's bottom
hairline is retained for its scrolled state, and the progress line is the page-level cue.

## 5. Content data

- `src/content/projects.ts` — type is reused as-is. Display gains a derived year from the
  existing `date` field; no schema change. Placeholder entries are renamed to clearly
  non-real titles so the marquee reads sensibly while empty.
- `src/content/skills.ts` — `SkillGroup` gains an optional `description?: string` so each
  capability row can carry one line of copy. `Skill.icon` is removed from the type (never
  populated, and the new chips are text-only). Existing group names become capability
  titles (`Languages` → capability using those languages, etc.); the content rewrite is
  small and stays in this file.
- `src/types/content.ts` — updated for the two changes above.

## 6. Components — reuse map

| Component | Action |
|---|---|
| `SmoothScroll` | **Keep as-is.** It is literally Lenis (`lerp: 0.1`, GSAP single-clock, reduced-motion bypass). The reference site's own product. |
| `useSplitReveal` | **Keep.** Char split + clip-line reveal is the core lenis text motion. |
| `useGsapFadeIn` | **Keep**, retune `y: 40 → 24`. |
| `useParallax` | **Keep.** Subtle transform-only drift for the marquee rows. |
| `useHorizontalPin` | **Delete.** The marquee replaces the pinned track. Its reduced-motion and breakpoint discipline are inherited by the new hook. |
| `useMarquee` | **New.** Seamless infinite loop, direction + speed options, transform-only, `ease: none`; under reduced motion it lays the track out statically. |
| `SectionHeading` | **Retune** to Anton, uppercase, `ls: -0.03em`, `lh: 0.9`. |
| `Tag` | **Restyle** monochrome hairline, `.25em` radius; drop `data-cursor`. |
| `MagneticButton` | **Keep**, restyle to hairline / no accent hover / `--radius-sm`. |
| `CustomCursor` | **Delete** (+ test). |
| `Navbar` → `Header` | **Rename + restyle**; availability pill added. |
| `Hero` | **Restyle** per §4.2. |
| `About` | **Delete**; copy moves into `Manifesto`. |
| `Projects` → `Work` | **Rewrite** as marquee. |
| `Skills` → `Capabilities` | **Rewrite** as numbered list. |
| `Contact` → `ContactCTA` | **Rewrite** as bordered box; form deleted. |
| `Footer` | **Restyle**. |
| `ScrollProgress` | **New.** Fixed top hairline scaled by scroll progress (§4.8). |
| `public/projects/*.svg` | **Delete.** |

Dead-code rule: components removed by this redesign are **deleted**, not left as unused
fallbacks. Every `data-cursor="hover"` attribute is stripped site-wide (dead once
`CustomCursor` goes) — this touches Navbar, Hero, Projects, Contact, Tag,
MagneticButton and Footer.

## 7. Accessibility — carried forward, not relaxed

Guarantees the redesign must keep, all already implemented and tested:

- Reduced motion: no pinned sections, no marquee animation, no parallax, no split reveal,
  no hidden start states. Content is fully visible and reachable by native scroll.
- Mobile menu stays `hidden` + `inert` when closed (not just opacity/pointer-events), with
  Escape-to-close.
- Custom cursor removal returns the native pointer — a net a11y win.
- Contrast, verified against `#000`: `#efefef` ≈ 18:1, `#b0b0b0` ≈ 9.3:1,
  `rgba(239,239,239,0.6)` ≈ 6.9:1. All pass AA for body text. Hairlines at `0.10`
  opacity are decorative only and never carry text.
- Anton's condensed forms are used only at display sizes; body copy stays Roboto at
  ≥14px mobile.

## 8. Testing plan

The suite currently cannot run — `node_modules` is absent (see §10). The test changes
below are specified now so the plan can implement them alongside the components.

Existing tests, and their fate:

| Test | Fate |
|---|---|
| `page.test.tsx` | **Update** — asserts `['hero','about','projects','skills','contact']`; new order is `['hero','manifesto','work','capabilities','contact']`. Also its `Selected Projects` heading assertion moves to the Work heading. This is a spec-mandated change, not a regression. |
| `Navbar.test.tsx` | **Update** — link names/hrefs change with the new `id`s; menu-toggle assertion kept. |
| `Hero.test.tsx` | **Update** — `Ramadhafidz` and `Creative Developer` strings survive; the `scroll` cue moves but the text stays; `min-h-screen` kept. |
| `Tag.test.tsx` | **Update** — drop the `data-cursor` assertion (cursor is gone); label assertion kept. |
| `CustomCursor.test.tsx` | **Delete** with the component. |
| `useSplitReveal.test.tsx` | **Keep unchanged** — reduced-motion invariant still guards the hook. |
| `useGsapFadeIn.test.tsx` | **Keep unchanged.** |
| `projects.test.ts` / `skills.test.ts` | **Keep**; extend skills test for the new `description` field. |

New tests: `useMarquee` (static layout under reduced motion, no hidden content), render
tests for `Work` (one card per featured project) and `Capabilities` (one row per group), and
`ScrollProgress` (renders the hairline element; the fallback path must not hide it).

Zero-regression rule: every retained test file stays green and unchanged except where
this section explicitly requires an update. No test is weakened to make a component pass.

## 9. Migration order

For the implementation plan that follows this spec:

1. Tokens, `globals.css`, fonts in `layout.tsx` (Anton + Roboto in, Syne + Space Grotesk
   out), grain and cursor rules removed.
2. `Header` + `ScrollProgress`.
3. `Hero`.
4. `Manifesto`; delete `About`, its glow and photo stub.
5. `useMarquee`; rewrite `Projects` → `Work`.
6. `Capabilities`; delete `Skills`; extend `SkillGroup`.
7. `ContactCTA`; delete `Contact` form.
8. `Footer` restyle; `page.tsx` recomposition.
9. Delete `CustomCursor`, `useHorizontalPin`, `data-cursor` attributes, gradient SVGs.
10. Test updates and new tests; full suite + `next build` + lint green.

## 10. Prerequisites

- **`npm install`** — `node_modules` is not present, so `vitest`, `next`, and ESLint
  cannot run. This is step zero of implementation. It is an implementation action and is
  not run until this spec is approved.
- No dependency additions are expected: Anton and Roboto come from `next/font/google`,
  and GSAP / Lenis are already installed. The new `useMarquee` uses only GSAP.

## 11. Out of scope

- No new pages or routes.
- No real project content, photos, or social URLs — placeholders stay clearly marked as
  placeholders.
- No changes to `next.config.ts`, `vitest.config.ts`, or deployment setup.
- No internationalization, no CMS, no analytics.
