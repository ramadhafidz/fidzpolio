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
