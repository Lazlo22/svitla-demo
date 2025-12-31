import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFileListOperations } from '@hooks/useFileListOperations';
import { useFileStore } from '@stores/fileStore';
import { mockFiles, createMockPdfFile } from '@test/mocks/files';

describe('useFileListOperations', () => {
  beforeEach(() => {
    act(() => {
      useFileStore.setState({ files: mockFiles });
    });
  });

  it('returns all files and filters by default folderId (null)', () => {
    const { result } = renderHook(() => useFileListOperations());

    expect(result.current.files).toHaveLength(3);
    // When called without arguments, folderId defaults to null
    // So folderFiles will be filtered to show only files with folderId === null
    expect(result.current.folderFiles).toHaveLength(2); // file-1 and file-3
  });

  it('filters files by folderId', () => {
    const { result } = renderHook(() => useFileListOperations('folder-1'));

    expect(result.current.folderFiles).toHaveLength(1);
    expect(result.current.folderFiles[0].id).toBe('file-2');
  });

  it('returns root files when folderId is null', () => {
    const { result } = renderHook(() => useFileListOperations(null));

    expect(result.current.folderFiles).toHaveLength(2);
    expect(result.current.folderFiles.map(f => f.id)).toEqual(['file-1', 'file-3']);
  });

  it('initializes with empty states', () => {
    const { result } = renderHook(() => useFileListOperations());

    expect(result.current.dropError).toBe('');
  });

  describe('handleFileDrop', () => {
    it('uploads file successfully', async () => {
      const { result } = renderHook(() => useFileListOperations(null));
      const mockFile = createMockPdfFile('new.pdf');

      await act(async () => {
        await result.current.handleFileDrop(mockFile);
      });

      expect(result.current.dropError).toBe('');
      expect(useFileStore.getState().files.length).toBeGreaterThan(3);
    });

    it('sets error on upload failure', async () => {
      const { result } = renderHook(() => useFileListOperations(null));
      const mockFile = new File(['content'], 'test.txt', { type: 'text/plain' });

      await act(async () => {
        await result.current.handleFileDrop(mockFile);
      });

      expect(result.current.dropError).toBe('Only PDF files are supported');
    });

    it('clears previous error on successful upload', async () => {
      const { result } = renderHook(() => useFileListOperations(null));

      // First, trigger an error
      const textFile = new File(['content'], 'test.txt', { type: 'text/plain' });
      await act(async () => {
        await result.current.handleFileDrop(textFile);
      });
      expect(result.current.dropError).toBeTruthy();

      // Then upload a valid file
      const pdfFile = createMockPdfFile('valid.pdf');
      await act(async () => {
        await result.current.handleFileDrop(pdfFile);
      });

      expect(result.current.dropError).toBe('');
    });
  });

  describe('handleFileDropError', () => {
    it('sets drop error', () => {
      const { result } = renderHook(() => useFileListOperations());

      act(() => {
        result.current.handleFileDropError('Custom error message');
      });

      expect(result.current.dropError).toBe('Custom error message');
    });
  });

  describe('handleRename', () => {
    it('renames file and clears renamingFile state', async () => {
      const { result } = renderHook(() => useFileListOperations());
      const fileToRename = mockFiles[0];

      act(() => {
        result.current.setRenamingFile(fileToRename);
      });

      act(() => {
        result.current.handleRename('renamed');
      });

      const updatedFile = useFileStore.getState().getFileById('file-1');
      expect(updatedFile?.name).toBe('renamed.pdf');
    });

    it('does nothing when no file is being renamed', () => {
      const { result } = renderHook(() => useFileListOperations());

      act(() => {
        result.current.handleRename('test');
      });

      // Should not throw error
      expect(useFileStore.getState().files).toHaveLength(3);
    });
  });

  describe('handleDelete', () => {
    it('deletes file and clears deletingFile state', () => {
      const { result } = renderHook(() => useFileListOperations());
      const fileToDelete = mockFiles[0];

      act(() => {
        result.current.setDeletingFile(fileToDelete);
      });

      act(() => {
        result.current.handleDelete();
      });

      expect(useFileStore.getState().files).toHaveLength(2);
      expect(useFileStore.getState().getFileById('file-1')).toBeUndefined();
    });

    it('does nothing when no file is being deleted', () => {
      const { result } = renderHook(() => useFileListOperations());

      act(() => {
        result.current.handleDelete();
      });

      expect(useFileStore.getState().files).toHaveLength(3);
    });
  });

  it('updates folderFiles when store changes', () => {
    const { result, rerender } = renderHook(() => useFileListOperations(null));

    expect(result.current.folderFiles).toHaveLength(2);

    act(() => {
      useFileStore.getState().deleteFile('file-1');
    });

    rerender();

    expect(result.current.folderFiles).toHaveLength(1);
  });
});
