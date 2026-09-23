import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Tag } from '../Tag';

describe('Tag', () => {
  it('renders its label', () => {
    expect(render(<Tag>GSAP</Tag>).getByText('GSAP')).toBeInTheDocument();
  });

  it('renders as a hairline chip, not a pill', () => {
    const { getByText } = render(<Tag>GSAP</Tag>);
    expect(getByText('GSAP').className).toContain('rounded-sm');
  });
});
