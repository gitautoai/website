/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-var-requires */
import { render } from '@testing-library/react';
import ChevronIcon from './Chevron';

describe('ChevronIcon', () => {
  it('renders with correct base styles and no rotation when isOpen is false', () => {
    // Verify that when isOpen is false, the icon does not have the rotate-180 class
    const { container } = render(<ChevronIcon isOpen={false} />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('w-6', 'h-6', 'flex-none', 'transform', 'transition-transform');
    expect(svg).not.toHaveClass('rotate-180');
  });

  it('renders with rotate-180 class when isOpen is true', () => {
    // Verify that when isOpen is true, the icon has the rotate-180 class for animation
    const { container } = render(<ChevronIcon isOpen={true} />);
    const svg = container.querySelector('svg');

    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('rotate-180');
  });
});
