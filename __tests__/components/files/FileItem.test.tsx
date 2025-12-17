import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@test/test-utils';
import userEvent from '@testing-library/user-event';
import { FileItem } from '@components/files/FileItem';
import type { IFile } from '@type/file';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockFile: IFile = {
  id: 'file-1',
  name: 'test-document.pdf',
  folderId: null,
  type: 'application/pdf',
  size: 1048576, // 1 MB
  content: 'base64content',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

describe('FileItem', () => {
  const defaultProps = {
    file: mockFile,
    onRename: vi.fn(),
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders file name', () => {
    render(<FileItem {...defaultProps} />);
    
    expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
  });

  it('renders file size in MB', () => {
    render(<FileItem {...defaultProps} />);
    
    expect(screen.getByText('1.00 MB')).toBeInTheDocument();
  });

  it('navigates to file page on click', async () => {
    const user = userEvent.setup();
    
    render(<FileItem {...defaultProps} />);
    
    const fileItem = screen.getByRole('button', { name: /view test-document.pdf/i });
    await user.click(fileItem);
    
    expect(mockNavigate).toHaveBeenCalledWith('/file/file-1');
  });

  it('navigates on Enter key press', async () => {
    const user = userEvent.setup();
    
    render(<FileItem {...defaultProps} />);
    
    const fileItem = screen.getByRole('button', { name: /view test-document.pdf/i });
    fileItem.focus();
    await user.keyboard('{Enter}');
    
    expect(mockNavigate).toHaveBeenCalledWith('/file/file-1');
  });

  it('navigates on Space key press', async () => {
    const user = userEvent.setup();
    
    render(<FileItem {...defaultProps} />);
    
    const fileItem = screen.getByRole('button', { name: /view test-document.pdf/i });
    fileItem.focus();
    await user.keyboard(' ');
    
    expect(mockNavigate).toHaveBeenCalledWith('/file/file-1');
  });

  it('calls onRename when rename button is clicked', async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    
    render(<FileItem {...defaultProps} onRename={onRename} />);
    
    const renameButton = screen.getByTitle('Rename');
    await user.click(renameButton);
    
    expect(onRename).toHaveBeenCalledWith(mockFile);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    const onDelete = vi.fn();
    
    render(<FileItem {...defaultProps} onDelete={onDelete} />);
    
    const deleteButton = screen.getByTitle('Delete');
    await user.click(deleteButton);
    
    expect(onDelete).toHaveBeenCalledWith(mockFile);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('has correct accessibility attributes', () => {
    render(<FileItem {...defaultProps} />);
    
    const fileItem = screen.getByRole('button', { name: /view test-document.pdf/i });
    expect(fileItem).toHaveAttribute('tabIndex', '0');
  });
});
