import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Capabilities } from '../Capabilities';

describe('Capabilities', () => {
  it('renders one row per skill group', () => {
    const { container } = render(<Capabilities />);
    // skills.ts currently has four groups.
    expect(container.querySelectorAll('[data-capability]').length).toBe(4);
  });

  it('numbers rows with two-digit indices from the data', () => {
    render(<Capabilities />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
  });

  it('renders every skill name as a chip', () => {
    render(<Capabilities />);
    // From the current content: TypeScript, JavaScript, Next.js, React, GSAP, Git, Figma.
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('GSAP')).toBeInTheDocument();
  });

  it('renders a row even when its description is absent', () => {
    // The field is optional; a group without one must not collapse or
    // misalign its hairlines.
    const { container } = render(<Capabilities />);
    const rows = container.querySelectorAll('[data-capability]');
    expect(rows.length).toBeGreaterThan(0);
    rows.forEach((row) => expect(row).toBeVisible());
  });
});
