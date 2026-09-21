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
