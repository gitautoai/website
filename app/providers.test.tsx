import React from 'react';
import { render, screen } from '@testing-library/react';
import { Providers } from './providers';
import { useTheme } from '@chakra-ui/react';
import theme from '../theme/styles';

// Mock Chakra UI theme
jest.mock('../theme/styles', () => ({
  __esModule: true,
  default: {
    fonts: {
      body: "var(--font-lexend), sans-serif",
    },
  },
}));

// Test component to verify theme context
const TestComponent = () => {
  const theme = useTheme();
  return <div data-testid="theme-test">{theme.fonts.body}</div>;
};

describe('Providers', () => {
  it('renders children correctly', () => {
    const testText = 'Test Child';
    render(
      <Providers>
        <div>{testText}</div>
      </Providers>
    );
    
    expect(screen.getByText(testText)).toBeInTheDocument();
  });

  it('provides Chakra theme context to children', () => {
    render(
      <Providers>
        <TestComponent />
      </Providers>
    );
    
    expect(screen.getByTestId('theme-test')).toHaveTextContent("var(--font-lexend), sans-serif");
  });

  it('renders multiple children', () => {
    render(
      <Providers>
        <div>First Child</div>
        <div>Second Child</div>
      </Providers>
    );
    
    expect(screen.getByText('First Child')).toBeInTheDocument();
    expect(screen.getByText('Second Child')).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { container } = render(
      <Providers>
        <div>Test Content</div>
      </Providers>
    );
    expect(container).toMatchSnapshot();
  });
});