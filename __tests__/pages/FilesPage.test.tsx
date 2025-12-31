import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@test/test-utils';
import userEvent from '@testing-library/user-event';
import FilesPage from '@pages/FilesPage';
import { useFileStore } from '@stores/fileStore';
import { act } from '@testing-library/react';
import { mockFile } from '@test/mocks/files';

describe('FilesPage', () => {
  beforeEach(() => {
    act(() => {
      useFileStore.setState({ files: [] });
    });
  });

  it('renders page title', async () => {
    render(<FilesPage />);

    expect(await screen.findByText('All Files')).toBeInTheDocument();
  });

  it('renders page description', async () => {
    render(<FilesPage />);

    expect(
      await screen.findByText('View and manage all your PDF files')
    ).toBeInTheDocument();
  });

  it('renders upload button', async () => {
    render(<FilesPage />);

    const uploadButtons = await screen.findAllByRole('button', {
      name: /Upload File/i,
    });
    // Header button + EmptyState button when no files
    expect(uploadButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('shows empty state when no files exist', async () => {
    render(<FilesPage />);

    expect(await screen.findByText('No files yet')).toBeInTheDocument();
    expect(
      screen.getByText(/Upload your first PDF file to get started/i)
    ).toBeInTheDocument();
  });

  it('shows file list when files exist', async () => {
    act(() => {
      useFileStore.setState({ files: [mockFile] });
    });

    render(<FilesPage />);

    expect(await screen.findByText('All Files (1)')).toBeInTheDocument();
    expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
  });

  it('shows multiple files', async () => {
    const files = [
      mockFile,
      { ...mockFile, id: 'file-2', name: 'another-file.pdf' },
      { ...mockFile, id: 'file-3', name: 'third-file.pdf' },
    ];

    act(() => {
      useFileStore.setState({ files });
    });

    render(<FilesPage />);

    expect(await screen.findByText('All Files (3)')).toBeInTheDocument();
    expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
    expect(screen.getByText('another-file.pdf')).toBeInTheDocument();
    expect(screen.getByText('third-file.pdf')).toBeInTheDocument();
  });

  it('shows file size in MB', async () => {
    act(() => {
      useFileStore.setState({ files: [mockFile] });
    });

    render(<FilesPage />);

    expect(await screen.findByText('1.00 MB')).toBeInTheDocument();
  });

  it('opens upload dialog when upload button is clicked', async () => {
    const user = userEvent.setup();

    render(<FilesPage />);

    const uploadButtons = await screen.findAllByRole('button', {
      name: /Upload File/i,
    });
    // Click the first upload button (header button)
    await user.click(uploadButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('filters files when searching', async () => {
    const user = userEvent.setup();

    const files = [
      mockFile,
      { ...mockFile, id: 'file-2', name: 'another-file.pdf' },
      { ...mockFile, id: 'file-3', name: 'test-file.pdf' },
    ];

    act(() => {
      useFileStore.setState({ files });
    });

    render(<FilesPage />);

    const searchInput = await screen.findByPlaceholderText('Search files by name...');
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
      expect(screen.getByText('test-file.pdf')).toBeInTheDocument();
      expect(screen.queryByText('another-file.pdf')).not.toBeInTheDocument();
    });
  });

  it('shows no results message when search has no matches', async () => {
    const user = userEvent.setup();

    act(() => {
      useFileStore.setState({ files: [mockFile] });
    });

    render(<FilesPage />);

    const searchInput = await screen.findByPlaceholderText('Search files by name...');
    await user.type(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('All Files (0)')).toBeInTheDocument();
      expect(screen.queryByText('test-document.pdf')).not.toBeInTheDocument();
    });
  });
});
