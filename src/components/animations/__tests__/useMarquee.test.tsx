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
