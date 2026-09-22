import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '../Hero';

describe('Hero', () => {
  it('renders the name and tagline', () => {
    render(<Hero />);
    expect(screen.getByText('Ramadhafidz')).toBeInTheDocument();
    expect(screen.getByText(/Creative Developer/i)).toBeInTheDocument();
  });

  it('is full-viewport', () => {
    const { container } = render(<Hero />);
    expect(container.firstChild).toHaveClass('min-h-screen');
  });

  it('renders the eyebrow label', () => {
    render(<Hero />);
    expect(screen.getByText(/Portfolio 2026/i)).toBeInTheDocument();
  });
});
