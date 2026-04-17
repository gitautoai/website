/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { render } from '@testing-library/react';
import { TrashIcon } from './TrashIcon';

describe('TrashIcon', () => {
  // ===== solitary =====

  it('renders with default className when none is provided', () => {
    // Verify that the default className "w-5 h-5" is applied when no className prop is passed
    const { container } = render(<TrashIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-5', 'h-5');
  });

  it('renders with custom className when provided', () => {
    // Verify that the provided className overrides the default
    const customClass = 'w-10 h-10 text-red-500';
    const { container } = render(<TrashIcon className={customClass} />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass(customClass);
    expect(svg).not.toHaveClass('w-5', 'h-5');
  });

  it('has correct SVG attributes', () => {
    // Verify that the SVG has the expected attributes for correct rendering
    const { container } = render(<TrashIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('renders the correct path data', () => {
    // Verify that the path element exists and has the correct d attribute
    const { container } = render(<TrashIcon />);
    const path = container.querySelector('path');

    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('d', 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16');
  });
});
