import { render } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading spinner with correct styles', () => {
    const { getByTestId } = render(<LoadingSpinner />);

    const container = getByTestId('loading-spinner');
    expect(container).toHaveClass(
      'fixed',
      'top-1/2',
      'left-1/2',
      '-translate-x-1/2',
      '-translate-y-1/2',
      'pointer-events-none'
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