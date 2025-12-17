import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@test/test-utils';
import userEvent from '@testing-library/user-event';
import FolderPage from '@pages/FolderPage';
import { useFolderStore } from '@stores/folderStore';
import { useFileStore } from '@stores/fileStore';
import { act } from '@testing-library/react';

const mockNavigate = vi.fn();
let mockParams = { '*': 'folder-1' };

vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

const mockFolder = {
  id: 'folder-1',
  name: 'Test Folder',
  parentId: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const mockSubfolder = {
  id: 'subfolder-1',
  name: 'Subfolder',
  parentId: 'folder-1',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

const mockFile = {
  id: 'file-1',
  name: 'test-document.pdf',
  folderId: 'folder-1',
  type: 'application/pdf' as const,
  size: 1048576,
  content: 'base64content',
  createdAt: Date.now(),
  updatedAt: Date.now(),
};

describe('FolderPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockParams = { '*': 'folder-1' };
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
      useFileStore.setState({ files: [mockFile] });
    });

    render(<FolderPage />);

    expect(await screen.findByText('test-document.pdf')).toBeInTheDocument();
  });

  it('shows FolderNotFound when folder does not exist', async () => {
    mockParams = { '*': 'non-existent-folder' };

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
      mockFile,
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
});
