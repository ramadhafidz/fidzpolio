import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Projects } from '../Projects';

describe('Projects', () => {
  it('renders one card per featured project', () => {
    render(<Projects />);
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });

  it('renders the section heading', () => {
    render(<Projects />);
    expect(screen.getByRole('heading', { name: 'Selected Projects' })).toBeInTheDocument();
  });
});
