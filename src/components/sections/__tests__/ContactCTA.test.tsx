import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ContactCTA } from '../ContactCTA';

describe('ContactCTA', () => {
  it('renders the headline and a mailto link', () => {
    render(<ContactCTA />);
    // JSX renders &rsquo; as the typographic apostrophe U+2019, so the
    // accessible name is "Let’s", not "Let's".
    expect(screen.getByRole('heading', { name: /let’s build something/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get in touch/i })).toHaveAttribute('href', 'mailto:');
  });

  it('renders every social label', () => {
    render(<ContactCTA />);
    expect(screen.getByText('GitHub')).toBeInTheDocument();
    expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    expect(screen.getByText('Twitter / X')).toBeInTheDocument();
    expect(screen.getByText('Instagram')).toBeInTheDocument();
  });

  it('renders an empty-href social as a non-link', () => {
    // The current content has no social URLs yet. An empty href must not
    // become a clickable mailto: link.
    render(<ContactCTA />);
    expect(screen.queryByRole('link', { name: 'GitHub' })).toBeNull();
    expect(screen.getByText('GitHub').tagName).toBe('SPAN');
  });
});
