import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@test/test-utils';
import userEvent from '@testing-library/user-event';
import HomePage from '@pages/HomePage';
import { useFolderStore } from '@stores/folderStore';
import { useFileStore } from '@stores/fileStore';
import { act } from '@testing-library/react';

const mockNavigate = vi.fn();

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('HomePage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    act(() => {
      useFolderStore.setState({ folders: [] });
      useFileStore.setState({ files: [] });
    });
  });

  it('renders welcome message', () => {
    render(<HomePage />);
    
    expect(screen.getByText(/Welcome to SV - Harvey - Demo/i)).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<HomePage />);
    
    expect(screen.getByText(/Organize and manage your PDF files with ease/i)).toBeInTheDocument();
  });

  it('displays folder count of 0 when empty', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Total Folders')).toBeInTheDocument();
    // Both folder and file counts are 0
    const zeros = screen.getAllByText('0');
    expect(zeros).toHaveLength(2);
  });

  it('displays file count of 0 when empty', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Total Files')).toBeInTheDocument();
  });

  it('shows get started section when no folders or files', () => {
    render(<HomePage />);
    
    expect(screen.getByText('Get Started')).toBeInTheDocument();
    expect(screen.getByText(/You haven't created any folders/i)).toBeInTheDocument();
  });

  it('navigates to folders page when Create Folder is clicked', async () => {
    const user = userEvent.setup();
    
    render(<HomePage />);
    
    await user.click(screen.getByRole('button', { name: /Create Folder/i }));
    
    expect(mockNavigate).toHaveBeenCalledWith('/folders');
  });

  it('navigates to files page when Upload File is clicked', async () => {
    const user = userEvent.setup();
    
    render(<HomePage />);
    
    await user.click(screen.getByRole('button', { name: /Upload File/i }));
    
    expect(mockNavigate).toHaveBeenCalledWith('/files');
  });

  it('hides get started section when folders exist', async () => {
    await act(async () => {
      await useFolderStore.getState().createFolder('Test', null);
    });
    
    render(<HomePage />);
    
    expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
  });

  it('hides get started section when files exist', async () => {
    act(() => {
      useFileStore.setState({
        files: [{
          id: 'file-1',
          name: 'test.pdf',
          folderId: null,
          type: 'application/pdf',
          size: 1024,
          content: 'base64',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }],
      });
    });
    
    render(<HomePage />);
    
    expect(screen.queryByText('Get Started')).not.toBeInTheDocument();
  });

  it('navigates to folders page when Total Folders card is clicked', async () => {
    const user = userEvent.setup();
    
    render(<HomePage />);
    
    await user.click(screen.getByText('Total Folders').closest('div[class*="cursor-pointer"]')!);
    
    expect(mockNavigate).toHaveBeenCalledWith('/folders');
  });

  it('navigates to files page when Total Files card is clicked', async () => {
    const user = userEvent.setup();
    
    render(<HomePage />);
    
    await user.click(screen.getByText('Total Files').closest('div[class*="cursor-pointer"]')!);
    
    expect(mockNavigate).toHaveBeenCalledWith('/files');
  });
});
