import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { CustomCursor } from '../CustomCursor';

describe('CustomCursor', () => {
  it('renders nothing on the server / non-pointer layout', () => {
    const { container } = render(<CustomCursor />);
    // Component is client-gated; SSR output must be empty.
    expect(container.firstChild).toBeNull();
  });
});
