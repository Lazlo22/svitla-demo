import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@test/test-utils';
import userEvent from '@testing-library/user-event';
import FoldersPage from '@pages/FoldersPage';
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

const mockFolder = {
  id: 'folder-1',
  name: 'Test Folder',
  parentId: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const mockFile = {
  id: 'file-1',
  name: 'test-document.pdf',
  folderId: null,
  type: 'application/pdf' as const,
  size: 1048576,
  content: 'base64content',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

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
      useFileStore.setState({ files: [mockFile] });
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
      mockFile,
      { ...mockFile, id: 'file-2', name: 'nested-file.pdf', folderId: 'folder-1' },
    ];

    act(() => {
      useFileStore.setState({ files });
    });

    render(<FoldersPage />);

    expect(await screen.findByText('test-document.pdf')).toBeInTheDocument();
    expect(screen.queryByText('nested-file.pdf')).not.toBeInTheDocument();
  });
});
