import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@test/test-utils';
import { mockNavigate } from '@test/setup';
import { mockFolder, mockFile } from '@test/mocks/data';
import userEvent from '@testing-library/user-event';
import FoldersPage from '@pages/FoldersPage';
import { useFolderStore } from '@stores/folderStore';
import { useFileStore } from '@stores/fileStore';
import { act } from '@testing-library/react';

describe('FoldersPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    act(() => {
      useFolderStore.setState({ folders: [] });
      useFileStore.setState({ files: [] });
    });
  });

  it('renders page title', async () => {
    render(<FoldersPage />);

    expect(
      await screen.findByRole('heading', { name: 'Folders' })
    ).toBeInTheDocument();
  });

  it('renders page description', async () => {
    render(<FoldersPage />);

    expect(
      await screen.findByText('Manage your folders and their contents')
    ).toBeInTheDocument();
  });

  it('renders New Folder button', async () => {
    render(<FoldersPage />);

    expect(
      await screen.findByRole('button', { name: /New Folder/i })
    ).toBeInTheDocument();
  });

  it('renders Upload File button', async () => {
    render(<FoldersPage />);

    expect(
      await screen.findByRole('button', { name: /Upload File/i })
    ).toBeInTheDocument();
  });

  it('shows empty state when no folders or files exist', async () => {
    render(<FoldersPage />);

    expect(
      await screen.findByText('No folders or files yet')
    ).toBeInTheDocument();
  });

  it('shows folders when folders exist', async () => {
    act(() => {
      useFolderStore.setState({ folders: [mockFolder] });
    });

    render(<FoldersPage />);

    expect(await screen.findByText('Test Folder')).toBeInTheDocument();
  });

  it('shows files when root files exist', async () => {
    act(() => {
      useFileStore.setState({ files: [{ ...mockFile, folderId: null }] });
    });

    render(<FoldersPage />);

    expect(await screen.findByText('test-document.pdf')).toBeInTheDocument();
  });

  it('navigates to folder when folder is clicked', async () => {
    const user = userEvent.setup();

    act(() => {
      useFolderStore.setState({ folders: [mockFolder] });
    });

    render(<FoldersPage />);

    await user.click(await screen.findByText('Test Folder'));

    expect(mockNavigate).toHaveBeenCalledWith('/folder/folder-1');
  });

  it('opens create folder dialog when New Folder is clicked', async () => {
    const user = userEvent.setup();

    render(<FoldersPage />);

    await user.click(
      await screen.findByRole('button', { name: /New Folder/i })
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('only shows root folders (parentId is null)', async () => {
    const folders = [
      mockFolder,
      {
        ...mockFolder,
        id: 'folder-2',
        name: 'Child Folder',
        parentId: 'folder-1',
      },
    ];

    act(() => {
      useFolderStore.setState({ folders });
    });

    render(<FoldersPage />);

    expect(await screen.findByText('Test Folder')).toBeInTheDocument();
    expect(screen.queryByText('Child Folder')).not.toBeInTheDocument();
  });

  it('only shows root files (folderId is null)', async () => {
    const files = [
      { ...mockFile, folderId: null },
      { ...mockFile, id: 'file-2', name: 'nested-file.pdf', folderId: 'folder-1' },
    ];

    act(() => {
      useFileStore.setState({ files });
    });

    render(<FoldersPage />);

    expect(await screen.findByText('test-document.pdf')).toBeInTheDocument();
    expect(screen.queryByText('nested-file.pdf')).not.toBeInTheDocument();
  });

  it('filters folders and files when searching', async () => {
    const user = userEvent.setup();

    act(() => {
      useFolderStore.setState({ folders: [mockFolder, { ...mockFolder, id: 'folder-2', name: 'Another Folder' }] });
      useFileStore.setState({ files: [{ ...mockFile, folderId: null }, { ...mockFile, id: 'file-2', name: 'another-doc.pdf', folderId: null }] });
    });

    render(<FoldersPage />);

    const searchInput = await screen.findByPlaceholderText('Search folders and files...');
    await user.type(searchInput, 'Test');

    await waitFor(() => {
      expect(screen.getByText('Test Folder')).toBeInTheDocument();
      expect(screen.queryByText('Another Folder')).not.toBeInTheDocument();
    });
  });

  it('shows no results message when search has no matches', async () => {
    const user = userEvent.setup();

    act(() => {
      useFolderStore.setState({ folders: [mockFolder] });
    });

    render(<FoldersPage />);

    const searchInput = await screen.findByPlaceholderText('Search folders and files...');
    await user.type(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });
});
