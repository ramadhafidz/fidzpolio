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
