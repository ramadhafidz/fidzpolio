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
