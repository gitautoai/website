@@ -0,0 +1,42 @@
import { render } from '@testing-library/react';
import XIcon from './XIcon';

describe('XIcon', () => {
  it('renders an SVG element', () => {
    const { container } = render(<XIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
  });

  it('has correct CSS classes', () => {
    const { container } = render(<XIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveClass('w-4', 'h-4', 'text-white');
  });

  it('has correct SVG attributes', () => {
    const { container } = render(<XIcon />);
    const svg = container.querySelector('svg');

    expect(svg).toHaveAttribute('fill', 'none');
    expect(svg).toHaveAttribute('stroke', 'currentColor');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
  });

  it('renders the X path element with correct attributes', () => {
    const { container } = render(<XIcon />);
    const path = container.querySelector('path');

    expect(path).toBeInTheDocument();
    expect(path).toHaveAttribute('strokeLinecap', 'round');
    expect(path).toHaveAttribute('strokeLinejoin', 'round');
    expect(path).toHaveAttribute('strokeWidth', '2');
    expect(path).toHaveAttribute('d', 'M6 18L18 6M6 6l12 12');
  });

  it('renders without crashing', () => {
    expect(() => render(<XIcon />)).not.toThrow();
  });
});
