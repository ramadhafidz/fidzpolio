import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Manifesto } from '../Manifesto';

describe('Manifesto', () => {
  it('renders the section heading', () => {
    render(<Manifesto />);
    expect(screen.getByRole('heading', { name: /manifesto/i })).toBeInTheDocument();
  });

  it('renders the statement paragraph', () => {
    render(<Manifesto />);
    expect(screen.getByText(/browser as a canvas/i)).toBeInTheDocument();
  });

  it('renders three numbered cells', () => {
    const { container } = render(<Manifesto />);
    expect(container.querySelectorAll('[data-cell]').length).toBe(3);
  });
});
