import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from '../Hero';

describe('Hero', () => {
  it('renders the name, tagline, and scroll cue', () => {
    render(<Hero />);
    expect(screen.getByText('Ramadhafidz')).toBeInTheDocument();
    expect(screen.getByText(/Creative Developer/i)).toBeInTheDocument();
    expect(screen.getByText(/scroll/i)).toBeInTheDocument();
  });

  it('is full-viewport', () => {
    const { container } = render(<Hero />);
    expect(container.firstChild).toHaveClass('min-h-screen');
  });
});
