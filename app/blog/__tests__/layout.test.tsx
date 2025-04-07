import { render, screen } from '@testing-library/react';
import BlogLayout from '../layout';

// Mock the InstallButton component
jest.mock('@/components/Button/Install', () => {
  return function MockInstallButton({ text }: { text: string }) {
    return <button data-testid="mock-install-button">{text}</button>;
  };
});

describe('BlogLayout', () => {
  it('renders children content', () => {
    const testContent = <div data-testid="test-child">Test Content</div>;
    render(<BlogLayout>{testContent}</BlogLayout>);
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders promotional section with correct content', () => {
    render(<BlogLayout>Test</BlogLayout>);
    
    // Check heading
    expect(screen.getByText('Want to ship 500x faster?')).toBeInTheDocument();
    
    // Check promotional text
    expect(screen.getByText(/GitAuto is your AI coding agent/)).toBeInTheDocument();
    expect(screen.getByText(/It requires GitHub sign-in./)).toBeInTheDocument();
  });

  it('renders InstallButton with correct text', () => {
    render(<BlogLayout>Test</BlogLayout>);
    
    const installButton = screen.getByTestId('mock-install-button');
    expect(installButton).toBeInTheDocument();
    expect(installButton).toHaveTextContent('Install GitAuto');
  });

  it('applies correct styling classes', () => {
    const { container } = render(<BlogLayout>Test</BlogLayout>);
    
    // Check main container classes
    const mainDiv = container.firstChild as HTMLElement;
    expect(mainDiv).toHaveClass('px-5', 'md:px-52', 'pt-28', 'md:pt-36', 'pb-20', 'md:pb-36');

    // Check promotional section classes
    const promoSection = container.querySelector('div > div') as HTMLElement;
    expect(promoSection).toHaveClass(
      'flex', 'flex-col', 'items-center', 'justify-center', 'gap-4',
      'text-center', 'mt-20', 'md:mt-36', 'border-t', 'pt-20', 'md:pt-36'
    );
  });
});