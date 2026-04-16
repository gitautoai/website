import { render } from '@testing-library/react';
import DemoVideo from './Demo';
import { ABSOLUTE_URLS } from '@/config/urls';

describe('DemoVideo', () => {
  it('renders the YouTube demo video iframe with correct attributes', () => {
    // Verify that the component renders an iframe with the correct source URL and allow attributes
    const { container } = render(<DemoVideo />);
    const iframe = container.querySelector('iframe');

    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src', ABSOLUTE_URLS.YOUTUBE.DEMO_EMBED);
    expect(iframe).toHaveAttribute(
      'allow',
      'accelerometer; autoplay; encrypted-media; fullscreen; gyroscope; picture-in-picture'
    );
    expect(iframe).toHaveClass('w-full aspect-video');
  });
});
