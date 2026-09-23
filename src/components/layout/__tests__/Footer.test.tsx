import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer', () => {
  it('renders the copyright and build note', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2026 Ramadhafidz/i)).toBeInTheDocument();
    expect(screen.getByText(/Built with Next.js/i)).toBeInTheDocument();
  });

  it('renders a back-to-top button that scrolls to the top', () => {
    render(<Footer />);
    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toBeInTheDocument();
  });
});
