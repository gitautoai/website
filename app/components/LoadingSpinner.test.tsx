import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner with correct styles', () => {
    render(<LoadingSpinner />);
    
    const container = screen.getByTestId('loading-spinner');
    expect(container).toHaveClass(
      'fixed',
      'inset-0',
      'flex',
      'items-center',
      'justify-center',
      'bg-white/50',
      'z-50'
    );

    const spinner = container.firstChild as HTMLElement;
    expect(spinner).toHaveClass(
      'w-8',
      'h-8',
      'border-4',
      'border-pink-500',
      'border-t-transparent',
      'rounded-full',
      'animate-spin'
    );
  });
});