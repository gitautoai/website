import XIcon from './XIcon';
import { render } from '@testing-library/react';

describe('XIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<XIcon />)
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument()
  })

  it('renders with correct CSS classes', () => {
    const { container }=render(<XIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveClass('w-4', 'h-4', 'text-white');
  });

  it('renders with correct SVG attributes', () => {
    const { container } = render(<XIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('renders the X path element', () => {
    const { container } = render(<XIcon />);
    const path = container.querySelector('path');

    expect(path).toBeInTheDocument();
  });

  it('renders path with correct attributes', () => {
    const { container } = render(<XIcon />);
    const path = container.querySelector('path');

    expect(path).toHaveAttribute('strokeLinecap', 'round');
    expect(path).toHaveAttribute('strokeLinejoin', 'round');
    expect(path).toHaveAttribute('strokeWidth', '2');
    expect(path).toHaveAttribute('d', 'M6 18L18 6M6 6l12 12');
  });

  it('renders the complete icon structure', () => {
    const { container }=render(<XIcon />);

    // Verify the structure: svg > path
    const svg = container.querySelector('svg');
    const path = svg?.querySelector('path');

    expect(svg).toBeInTheDocument();
    expect(path).toBeInTheDocument();
    expect(svg?.children.length).toBe(1);
  });
});
