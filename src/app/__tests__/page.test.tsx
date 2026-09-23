import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home', () => {
  it('renders all sections in the new order', () => {
    const { container } = render(<Home />);
    const ids = Array.from(container.querySelectorAll('section[id]')).map((el) => el.id);
    expect(ids).toEqual(['hero', 'manifesto', 'work', 'capabilities', 'contact']);
  });

  it('renders the work gallery heading', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'Selected Work' })).toBeInTheDocument();
  });
});
