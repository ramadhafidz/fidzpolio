import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Header } from '../Header';

const LINKS = [
  { name: 'Manifesto', href: '#manifesto' },
  { name: 'Work', href: '#work' },
  { name: 'Capabilities', href: '#capabilities' },
  { name: 'Contact', href: '#contact' },
];

describe('Header', () => {
  it('renders the wordmark linking home', () => {
    render(<Header />);
    expect(screen.getAllByText('RAMADHAFIDZ')[0]).toHaveAttribute('href', '#hero');
  });

  it('renders nav links to the new sections', () => {
    render(<Header />);
    LINKS.forEach(({ name, href }) => {
      expect(screen.getAllByRole('link', { name })[0]).toHaveAttribute('href', href);
    });
  });

  it('renders the availability pill', () => {
    render(<Header />);
    expect(screen.getByText(/available for work/i)).toBeInTheDocument();
  });

  it('exposes the mobile menu toggle', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });
});
