import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import GlobalLoader from '@components/common/GlobalLoader';

describe('GlobalLoader', () => {
  it('renders without crashing', () => {
    const { container } = render(<GlobalLoader />);
    
    // Should render the main container
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has correct layout structure', () => {
    const { container } = render(<GlobalLoader />);
    
    // Should have main flex container
    const mainContainer = container.querySelector('.flex.min-h-screen');
    expect(mainContainer).toBeInTheDocument();
  });

  it('has sidebar skeleton on desktop', () => {
    const { container } = render(<GlobalLoader />);
    
    // Should have hidden sidebar for mobile, visible on md
    const sidebar = container.querySelector('.hidden.md\\:flex');
    expect(sidebar).toBeInTheDocument();
  });

  it('has content area', () => {
    const { container } = render(<GlobalLoader />);
    
    // Should have flex-1 content area
    const contentArea = container.querySelector('.flex-1.flex.flex-col');
    expect(contentArea).toBeInTheDocument();
  });
});
