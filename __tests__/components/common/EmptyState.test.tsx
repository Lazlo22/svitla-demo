import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@test/test-utils';
import userEvent from '@testing-library/user-event';
import { FileText, Upload } from 'lucide-react';
import EmptyState from '@components/common/EmptyState';

describe('EmptyState', () => {
  const defaultProps = {
    icon: FileText,
    title: 'No files yet',
    description: 'Upload your first file to get started',
    actionLabel: 'Upload File',
    onAction: vi.fn(),
  };

  it('renders title', () => {
    render(<EmptyState {...defaultProps} />);
    
    expect(screen.getByText('No files yet')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<EmptyState {...defaultProps} />);
    
    expect(screen.getByText('Upload your first file to get started')).toBeInTheDocument();
  });

  it('renders action button with label', () => {
    render(<EmptyState {...defaultProps} />);
    
    expect(screen.getByRole('button', { name: 'Upload File' })).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    
    render(<EmptyState {...defaultProps} onAction={onAction} />);
    
    await user.click(screen.getByRole('button', { name: 'Upload File' }));
    
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('renders action icon when provided', () => {
    render(<EmptyState {...defaultProps} actionIcon={Upload} />);
    
    // Check that the button contains an SVG (the icon)
    const button = screen.getByRole('button', { name: 'Upload File' });
    const svg = button.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('renders without file drop by default', () => {
    const { container } = render(<EmptyState {...defaultProps} />);
    
    // Should not have dashed border styling for drop zone
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('border-dashed');
  });

  it('renders with file drop zone when enabled', () => {
    const { container } = render(
      <EmptyState
        {...defaultProps}
        enableFileDrop={true}
        onFileDrop={vi.fn()}
      />
    );
    
    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('border-dashed');
  });
});
