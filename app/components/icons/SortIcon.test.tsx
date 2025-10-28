import { render, screen } from '@testing-library/react';
import SortIcon from './SortIcon';

describe('SortIcon', () => {
  describe('ascending direction', () => {
    it('renders up arrow for ascending direction', () => {
      render(<SortIcon direction="asc" />);

      const icon = screen.getByText('↑');
      expect(icon).toBeInTheDocument();
    });

    it('applies correct CSS classes for ascending direction', () => {
      render(<SortIcon direction="asc" />);

      const icon = screen.getByText('↑');
      expect(icon).toHaveClass('ml-1', 'text-gray-400');
    });
  });

  describe('descending direction', () => {
    it('renders down arrow for descending direction', () => {
      render(<SortIcon direction="desc" />);

      const icon = screen.getByText('↓');
      expect(icon).toBeInTheDocument();
    });

    it('applies correct CSS classes for descending direction', () => {
      render(<SortIcon direction="desc" />);

      const icon = screen.getByText('↓');
      expect(icon).toHaveClass('ml-1', 'text-gray-400');
    });
  });

  describe('component structure', () => {
    it('renders as a span element', () => {
      const { container } = render(<SortIcon direction="asc" />);

      const span = container.querySelector('span');
      expect(span).toBeInTheDocument();
    });
  });
});
