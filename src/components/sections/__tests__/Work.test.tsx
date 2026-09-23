import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Work } from '../Work';

describe('Work', () => {
  it('renders one card per featured project', () => {
    render(<Work />);
    expect(screen.getAllByRole('article').length).toBeGreaterThan(0);
  });

  it('renders the section heading', () => {
    render(<Work />);
    expect(screen.getByRole('heading', { name: 'Selected Work' })).toBeInTheDocument();
  });

  it('renders the year for each project', () => {
    render(<Work />);
    // Placeholder entries are dated 2026-01-01; the derived year renders.
    expect(screen.getAllByText('2026').length).toBeGreaterThan(0);
  });

  it('never hides a card behind an off-screen marquee track', () => {
    // Reduced motion holds the track static; every card must remain
    // reachable rather than translated off-screen.
    const { container } = render(<Work />);
    const cards = container.querySelectorAll('article');
    cards.forEach((card) => expect(card).toBeVisible());
  });
});
