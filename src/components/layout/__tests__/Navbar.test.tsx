import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navbar } from '../Navbar';

describe('Navbar', () => {
  it('renders the logo and all nav links', () => {
    render(<Navbar />);
    expect(screen.getByText('Ramadhafidz')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: 'About' })[0]).toHaveAttribute('href', '#about');
    expect(screen.getAllByRole('link', { name: 'Projects' })[0]).toHaveAttribute('href', '#projects');
    expect(screen.getAllByRole('link', { name: 'Skills' })[0]).toHaveAttribute('href', '#skills');
    expect(screen.getAllByRole('link', { name: 'Contact' })[0]).toHaveAttribute('href', '#contact');
  });

  it('exposes the mobile menu toggle', () => {
    render(<Navbar />);
    expect(screen.getByRole('button', { name: /menu/i })).toBeInTheDocument();
  });
});
