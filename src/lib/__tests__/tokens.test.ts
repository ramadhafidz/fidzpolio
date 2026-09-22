import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// The foundation every section renders against: a missing or misnamed token
// surfaces as a blank site. jsdom cannot resolve CSS custom properties
// (it returns var() unevaluated), so the contract is pinned against the
// stylesheet source that defines them.
const css = readFileSync(resolve(__dirname, '../../app/globals.css'), 'utf8');

/** All custom-property declarations in the stylesheet, as written. */
const declarations = new Map(
  [...css.matchAll(/^[\s]*(--[\w-]+)\s*:\s*([^;]+);/gm)].map(([_, name, value]) => [
    name,
    value.trim(),
  ]),
);

const token = (name: string) => declarations.get(name);

describe('design tokens', () => {
  it('defines the monochrome palette', () => {
    expect(token('--color-bg')).toBe('#000000');
    expect(token('--color-text-primary')).toBe('#efefef');
    expect(token('--color-text-secondary')).toBe('#b0b0b0');
  });

  it('derives every line color from #efefef at reduced opacity', () => {
    expect(token('--color-line')).toBe('rgba(239, 239, 239, 0.1)');
    expect(token('--color-line-strong')).toBe('rgba(239, 239, 239, 0.5)');
    expect(token('--color-line-mid')).toBe('#8c8c8c');
    expect(token('--color-surface-hover')).toBe('rgba(239, 239, 239, 0.03)');
  });

  it('has no accent or glow tokens', () => {
    expect(token('--color-accent')).toBeUndefined();
    expect(token('--color-accent-glow')).toBeUndefined();
    // The whole palette is three colors plus derived-opacity lines.
    const colors = [...declarations.keys()].filter((k) => k.startsWith('--color-'));
    expect(colors.sort()).toEqual(
      [
        '--color-bg',
        '--color-line',
        '--color-line-mid',
        '--color-line-strong',
        '--color-surface-hover',
        '--color-text-primary',
        '--color-text-secondary',
      ].sort(),
    );
  });

  it('keeps radius at or below 8px', () => {
    expect(token('--radius-xs')).toBe('2px');
    expect(token('--radius-sm')).toBe('4px');
    expect(token('--radius-md')).toBe('8px');
    for (const [name, value] of declarations) {
      if (!name.startsWith('--radius-')) continue;
      expect(parseFloat(value)).toBeLessThanOrEqual(8);
    }
  });

  it('registers the three font families', () => {
    expect(token('--font-display')).toBe('var(--font-anton), sans-serif');
    expect(token('--font-sans')).toBe('var(--font-roboto), sans-serif');
    expect(token('--font-mono')).toBe("'Courier New', Courier, monospace");
  });

  it('keeps the signature expo ease, not the old curve', () => {
    // Spec §3.5: lenis.dev's --ease-out-expo is cubic-bezier(.19,1,.22,1).
    // The old token carried the .16,1,.3,1 curve.
    expect(token('--ease-out-expo')).toBe('cubic-bezier(0.19, 1, 0.22, 1)');
  });

  it('ports the lenis.dev layout grid', () => {
    expect(token('--header-height')).toBe('56px');
    expect(token('--layout-width')).toBe('1320px');
    expect(token('--gap')).toBe('24px');
    // --safe is 16px on mobile and overridden to 40px at ≥800px, so it is
    // asserted as written rather than by resolved value.
    expect(css).toContain('--safe: 16px');
    expect(css).toMatch(/@media \(min-width: 800px\)[\s\S]*--safe: 40px/);
  });

  it('drops the grain overlay and cursor suppression', () => {
    // Both are removed by the redesign; the reduced-motion guard stays.
    expect(css).not.toMatch(/cursor:\s*none/);
    expect(css).not.toMatch(/body::before/);
    expect(css).toMatch(/prefers-reduced-motion/);
  });
});
