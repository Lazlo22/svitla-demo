import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { mockNavigate } from '@test/setup';
import { useFileOperations } from '@hooks/useFileOperations';
import { useFileStore } from '@stores/fileStore';
import { mockFile } from '@test/mocks/files';

describe('useFileOperations', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    act(() => {
      useFileStore.setState({ files: [mockFile] });
    });
  });

  it('returns undefined file when no fileId provided', () => {
    const { result } = renderHook(() => useFileOperations());

    expect(result.current.file).toBeUndefined();
  });

  it('returns file when valid fileId provided', () => {
    const { result } = renderHook(() => useFileOperations('file-1'));

    expect(result.current.file).toEqual(mockFile);
  });

  it('returns undefined for non-existent fileId', () => {
    const { result } = renderHook(() => useFileOperations('non-existent'));

    expect(result.current.file).toBeUndefined();
  });

  describe('renameFile', () => {
    it('updates file name', () => {
      const { result } = renderHook(() => useFileOperations('file-1'));

      act(() => {
        result.current.renameFile('updated');
      });

      const updatedFile = useFileStore.getState().getFileById('file-1');
      expect(updatedFile?.name).toBe('updated.pdf');
    });

    it('does nothing when file is undefined', () => {
      const { result } = renderHook(() => useFileOperations());

      act(() => {
        result.current.renameFile('test');
      });

      // Should not throw error
      expect(useFileStore.getState().files).toHaveLength(1);
    });
  });

  describe('deleteFile', () => {
    it('deletes file and navigates to /files', () => {
      const { result } = renderHook(() => useFileOperations('file-1'));

      act(() => {
        result.current.deleteFile();
      });

      expect(useFileStore.getState().files).toHaveLength(0);
      expect(mockNavigate).toHaveBeenCalledWith('/files');
    });

    it('does nothing when file is undefined', () => {
      const { result } = renderHook(() => useFileOperations());

      act(() => {
        result.current.deleteFile();
      });

      expect(useFileStore.getState().files).toHaveLength(1);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('downloadFile', () => {
    it('creates download link and triggers click', () => {
      const { result } = renderHook(() => useFileOperations('file-1'));

      const mockLink = {
        href: '',
        download: '',
        click: vi.fn(),
      };

      const createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);

      act(() => {
        result.current.downloadFile();
      });

      expect(mockLink.href).toBe(mockFile.content);
      expect(mockLink.download).toBe(mockFile.name);
      expect(mockLink.click).toHaveBeenCalled();

      createElementSpy.mockRestore();
    });

    it('does nothing when file is undefined', () => {
      const { result } = renderHook(() => useFileOperations());

      const createElementSpy = vi.spyOn(document, 'createElement');

      act(() => {
        result.current.downloadFile();
      });

      expect(createElementSpy).not.toHaveBeenCalled();

      createElementSpy.mockRestore();
    });
  });

  it('updates file when store changes', () => {
    const { result, rerender } = renderHook(() => useFileOperations('file-1'));

    expect(result.current.file?.name).toBe(mockFile.name);

    act(() => {
      useFileStore.getState().updateFileName('file-1', 'updated');
    });

    rerender();

    expect(result.current.file?.name).toBe('updated.pdf');
  });
});
