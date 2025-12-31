import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { mockNavigate } from '@test/setup';
import { useFolderOperations, useRootFolders } from '@hooks/useFolderOperations';
import { useFolderStore } from '@stores/folderStore';
import { mockFolders } from '@test/mocks/folders';

describe('useFolderOperations', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    act(() => {
      useFolderStore.setState({ folders: mockFolders });
    });
  });

  it('returns null currentFolder when no folderId provided', () => {
    const { result } = renderHook(() => useFolderOperations());

    expect(result.current.currentFolder).toBeNull();
  });

  it('returns currentFolder when valid folderId provided', () => {
    const { result } = renderHook(() => useFolderOperations('folder-1'));

    expect(result.current.currentFolder).toEqual(mockFolders[0]);
  });

  it('returns subfolders for given folderId', () => {
    const { result } = renderHook(() => useFolderOperations('folder-1'));

    expect(result.current.subfolders).toHaveLength(1);
    expect(result.current.subfolders[0].id).toBe('folder-2');
  });

  it('returns root folders when folderId is null', () => {
    const { result } = renderHook(() => useFolderOperations(null));

    expect(result.current.subfolders).toHaveLength(2);
    expect(result.current.subfolders.map(f => f.id)).toEqual(['folder-1', 'folder-3']);
  });

  it('returns breadcrumbs for folder path', () => {
    const { result } = renderHook(() => useFolderOperations('folder-2'));

    expect(result.current.breadcrumbs).toHaveLength(2);
    expect(result.current.breadcrumbs[0].id).toBe('folder-1');
    expect(result.current.breadcrumbs[1].id).toBe('folder-2');
  });

  it('returns empty breadcrumbs when no folderId', () => {
    const { result } = renderHook(() => useFolderOperations());

    expect(result.current.breadcrumbs).toHaveLength(0);
  });

  describe('handleCreateFolder', () => {
    it('creates folder in current location', () => {
      const { result } = renderHook(() => useFolderOperations('folder-1'));

      act(() => {
        result.current.handleCreateFolder('New Folder');
      });

      const folders = useFolderStore.getState().folders;
      const newFolder = folders.find(f => f.name === 'New Folder');

      expect(newFolder).toBeDefined();
      expect(newFolder?.parentId).toBe('folder-1');
    });

    it('creates folder in root when no folderId', () => {
      const { result } = renderHook(() => useFolderOperations());

      act(() => {
        result.current.handleCreateFolder('Root Folder New');
      });

      const folders = useFolderStore.getState().folders;
      const newFolder = folders.find(f => f.name === 'Root Folder New');

      expect(newFolder).toBeDefined();
      expect(newFolder?.parentId).toBeNull();
    });
  });

  describe('handleUpdateFolder', () => {
    it('updates selected folder', () => {
      const { result } = renderHook(() => useFolderOperations());

      act(() => {
        result.current.handleUpdateFolder('Updated Name', mockFolders[0]);
      });

      const updatedFolder = useFolderStore.getState().getFolderById('folder-1');
      expect(updatedFolder?.name).toBe('Updated Name');
    });

    it('does nothing when no folder provided', () => {
      const { result } = renderHook(() => useFolderOperations());

      act(() => {
        result.current.handleUpdateFolder('Test');
      });

      // Should not throw error
      expect(useFolderStore.getState().folders).toHaveLength(3);
    });
  });

  describe('handleDeleteFolder', () => {
    it('deletes specified folder', () => {
      const { result } = renderHook(() => useFolderOperations());

      act(() => {
        result.current.handleDeleteFolder(mockFolders[2]);
      });

      expect(useFolderStore.getState().folders).toHaveLength(2);
      expect(useFolderStore.getState().getFolderById('folder-3')).toBeUndefined();
    });

    it('does nothing when no folder provided', () => {
      const { result } = renderHook(() => useFolderOperations());

      act(() => {
        result.current.handleDeleteFolder();
      });

      expect(useFolderStore.getState().folders).toHaveLength(3);
    });
  });

  describe('handleOpenFolder', () => {
    it('navigates to folder page', () => {
      const { result } = renderHook(() => useFolderOperations());

      act(() => {
        result.current.handleOpenFolder(mockFolders[0]);
      });

      expect(mockNavigate).toHaveBeenCalledWith('/folder/folder-1');
    });
  });

  describe('handleDeleteClick', () => {
    it('stops event propagation', () => {
      const { result } = renderHook(() => useFolderOperations());
      const mockEvent = {
        stopPropagation: vi.fn(),
      } as any;

      act(() => {
        result.current.handleDeleteClick(mockEvent, mockFolders[0]);
      });

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('navigateToFolder', () => {
    it('stops event propagation and navigates', () => {
      const { result } = renderHook(() => useFolderOperations());
      const mockEvent = {
        stopPropagation: vi.fn(),
      } as any;

      act(() => {
        result.current.navigateToFolder(mockEvent, mockFolders[0]);
      });

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/folder/folder-1');
    });
  });

  it('updates subfolders when store changes', () => {
    const { result, rerender } = renderHook(() => useFolderOperations('folder-1'));

    expect(result.current.subfolders).toHaveLength(1);

    act(() => {
      useFolderStore.getState().createFolder('Another Subfolder', 'folder-1');
    });

    rerender();

    expect(result.current.subfolders).toHaveLength(2);
  });
});

describe('useRootFolders', () => {
  beforeEach(() => {
    act(() => {
      useFolderStore.setState({ folders: mockFolders });
    });
  });

  it('returns only root folders', () => {
    const { result } = renderHook(() => useRootFolders());

    expect(result.current).toHaveLength(2);
    expect(result.current.map(f => f.id)).toEqual(['folder-1', 'folder-3']);
  });

  it('updates when store changes', () => {
    const { result, rerender } = renderHook(() => useRootFolders());

    expect(result.current).toHaveLength(2);

    act(() => {
      useFolderStore.getState().createFolder('New Root', null);
    });

    rerender();

    expect(result.current).toHaveLength(3);
  });
});
