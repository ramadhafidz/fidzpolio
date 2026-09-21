import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../page';

describe('Home', () => {
  it('renders all five sections in order', () => {
    const { container } = render(<Home />);
    const ids = Array.from(container.querySelectorAll('section[id]')).map(
      (el) => el.id,
    );
    expect(ids).toEqual(['hero', 'about', 'projects', 'skills', 'contact']);
  });

  it('renders the projects gallery', () => {
    render(<Home />);
    expect(screen.getByRole('heading', { name: 'Selected Projects' })).toBeInTheDocument();
  });
});
