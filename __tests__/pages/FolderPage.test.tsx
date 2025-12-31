import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@test/test-utils';
import { mockNavigate, mockParams } from '@test/setup';
import { mockFolder, mockSubfolder, mockFile } from '@test/mocks/data';
import userEvent from '@testing-library/user-event';
import FolderPage from '@pages/FolderPage';
import { useFolderStore } from '@stores/folderStore';
import { useFileStore } from '@stores/fileStore';
import { act } from '@testing-library/react';

describe('FolderPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockParams.mockReturnValue({ '*': 'folder-1' });
    act(() => {
      useFolderStore.setState({ folders: [mockFolder] });
      useFileStore.setState({ files: [] });
    });
  });

  it('renders folder name as title', async () => {
    render(<FolderPage />);

    expect(
      await screen.findByRole('heading', { name: 'Test Folder' })
    ).toBeInTheDocument();
  });

  it('renders New Subfolder button', async () => {
    render(<FolderPage />);

    expect(
      await screen.findByRole('button', { name: /New Subfolder/i })
    ).toBeInTheDocument();
  });

  it('renders Upload File button', async () => {
    render(<FolderPage />);

    expect(
      await screen.findByRole('button', { name: /Upload File/i })
    ).toBeInTheDocument();
  });

  it('shows empty state when folder is empty', async () => {
    render(<FolderPage />);

    expect(await screen.findByText('This folder is empty')).toBeInTheDocument();
  });

  it('shows subfolders when subfolders exist', async () => {
    act(() => {
      useFolderStore.setState({ folders: [mockFolder, mockSubfolder] });
    });

    render(<FolderPage />);

    expect(await screen.findByText('Subfolder')).toBeInTheDocument();
  });

  it('shows files when files exist in folder', async () => {
    act(() => {
      useFileStore.setState({ files: [{ ...mockFile, folderId: 'folder-1' }] });
    });

    render(<FolderPage />);

    expect(await screen.findByText('test-document.pdf')).toBeInTheDocument();
  });

  it('shows FolderNotFound when folder does not exist', async () => {
    mockParams.mockReturnValue({ '*': 'non-existent-folder' });

    render(<FolderPage />);

    expect(await screen.findByText(/not found/i)).toBeInTheDocument();
  });

  it('navigates to subfolder when clicked', async () => {
    const user = userEvent.setup();

    act(() => {
      useFolderStore.setState({ folders: [mockFolder, mockSubfolder] });
    });

    render(<FolderPage />);

    await user.click(await screen.findByText('Subfolder'));

    expect(mockNavigate).toHaveBeenCalledWith('/folder/subfolder-1');
  });

  it('opens create subfolder dialog when New Subfolder is clicked', async () => {
    const user = userEvent.setup();

    render(<FolderPage />);

    await user.click(
      await screen.findByRole('button', { name: /New Subfolder/i })
    );

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('only shows files belonging to current folder', async () => {
    const files = [
      { ...mockFile, folderId: 'folder-1' },
      {
        ...mockFile,
        id: 'file-2',
        name: 'other-file.pdf',
        folderId: 'other-folder',
      },
      { ...mockFile, id: 'file-3', name: 'root-file.pdf', folderId: null },
    ];

    act(() => {
      useFileStore.setState({ files });
    });

    render(<FolderPage />);

    expect(await screen.findByText('test-document.pdf')).toBeInTheDocument();
    expect(screen.queryByText('other-file.pdf')).not.toBeInTheDocument();
    expect(screen.queryByText('root-file.pdf')).not.toBeInTheDocument();
  });

  it('only shows direct subfolders', async () => {
    const folders = [
      mockFolder,
      mockSubfolder,
      { ...mockSubfolder, id: 'nested', name: 'Nested', parentId: 'subfolder-1' },
    ];

    act(() => {
      useFolderStore.setState({ folders });
    });

    render(<FolderPage />);

    expect(await screen.findByText('Subfolder')).toBeInTheDocument();
    expect(screen.queryByText('Nested')).not.toBeInTheDocument();
  });

  it('filters subfolders and files when searching', async () => {
    const user = userEvent.setup();

    act(() => {
      useFolderStore.setState({
        folders: [
          mockFolder,
          mockSubfolder,
          { ...mockSubfolder, id: 'subfolder-2', name: 'Another Subfolder' }
        ]
      });
      useFileStore.setState({
        files: [
          { ...mockFile, folderId: 'folder-1' },
          { ...mockFile, id: 'file-2', name: 'another-doc.pdf', folderId: 'folder-1' }
        ]
      });
    });

    render(<FolderPage />);

    const searchInput = await screen.findByPlaceholderText('Search in this folder...');
    await user.type(searchInput, 'test');

    await waitFor(() => {
      expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
      expect(screen.queryByText('another-doc.pdf')).not.toBeInTheDocument();
    });
  });

  it('shows no results message when search has no matches', async () => {
    const user = userEvent.setup();

    act(() => {
      useFolderStore.setState({ folders: [mockFolder, mockSubfolder] });
    });

    render(<FolderPage />);

    const searchInput = await screen.findByPlaceholderText('Search in this folder...');
    await user.type(searchInput, 'nonexistent');

    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });
  });

  it('updates file name immediately after rename in folder', async () => {
    const user = userEvent.setup();

    act(() => {
      useFileStore.setState({ files: [{ ...mockFile, folderId: 'folder-1' }] });
    });

    render(<FolderPage />);

    // Wait for file to appear
    expect(await screen.findByText('test-document.pdf')).toBeInTheDocument();

    // Find and click the rename button (it's in the FileItem component)
    const fileItem = screen.getByText('test-document.pdf').closest('[role="button"]');
    expect(fileItem).toBeInTheDocument();

    // Hover to show the rename button
    await user.hover(fileItem!);

    // Click rename button
    const renameButton = screen.getByTitle('Rename');
    await user.click(renameButton);

    // Wait for dialog
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Change the name
    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'renamed-in-folder');

    // Save
    const saveButton = screen.getByRole('button', { name: /rename/i });
    await user.click(saveButton);

    // Verify the name updates immediately
    await waitFor(() => {
      expect(screen.getByText('renamed-in-folder.pdf')).toBeInTheDocument();
      expect(screen.queryByText('test-document.pdf')).not.toBeInTheDocument();
    });
  });
});
