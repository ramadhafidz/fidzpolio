import { describe, expect, it, vi, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { useSplitReveal } from '../useSplitReveal';

/**
 * The default matchMedia stub in setup.ts reports matches:false, so the
 * reduced-motion paths in these hooks are never exercised. These tests
 * flip it on to lock in the spec's "content must never be trapped hidden"
 * guarantee: the hook must leave the node untouched and fully visible.
 */

// afterEach() restores the spy, so the caller does not need the handle.
function withReducedMotion(): void {
  // Guard the argument: some library call sites invoke matchMedia() with no
  // query during setup, and the spy must not throw on those.
  vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: typeof query === 'string' && query.includes('reduce'),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
}

function Target({ text }: { text: string }) {
  const ref = useSplitReveal<HTMLHeadingElement>({ type: 'chars' });
  return <h1 ref={ref}>{text}</h1>;
}

describe('useSplitReveal under prefers-reduced-motion', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('leaves the text node untouched — no span split, no aria-label', () => {
    const restore = withReducedMotion();
    const { container } = render(<Target text="Ramadhafidz" />);

    const h1 = container.querySelector('h1');
    expect(h1?.children.length).toBe(0);
    expect(h1?.getAttribute('aria-label')).toBeNull();
    expect(h1?.textContent).toBe('Ramadhafidz');
  });

  it('keeps the text fully visible', () => {
    const restore = withReducedMotion();
    const { container } = render(<Target text="Ramadhafidz" />);

    const h1 = container.querySelector('h1');
    // No inline opacity hiding the content.
    expect(h1?.style.opacity).toBe('');
    expect(h1).not.toHaveAttribute('aria-hidden');
  });
});
