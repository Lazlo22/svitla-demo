import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useFileStore } from '@stores/fileStore';

// Helper to create a mock PDF file
function createMockPdfFile(name: string, size = 1024): File {
  const blob = new Blob(['mock pdf content'], { type: 'application/pdf' });
  return new File([blob], name, { type: 'application/pdf' });
}

// Helper to create a mock non-PDF file
function createMockTextFile(name: string): File {
  const blob = new Blob(['mock text content'], { type: 'text/plain' });
  return new File([blob], name, { type: 'text/plain' });
}

describe('fileStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useFileStore.setState({ files: [] });
    });
  });

  describe('uploadFile', () => {
    it('uploads a PDF file with correct properties', async () => {
      const store = useFileStore.getState();
      const mockFile = createMockPdfFile('test.pdf');
      
      const file = await store.uploadFile(mockFile, null);
      
      expect(file.name).toBe('test.pdf');
      expect(file.folderId).toBeNull();
      expect(file.type).toBe('application/pdf');
      expect(file.id).toBeDefined();
      expect(file.content).toBeDefined();
      expect(file.createdAt).toBeDefined();
      expect(file.updatedAt).toBeDefined();
    });

    it('uploads file to specific folder', async () => {
      const store = useFileStore.getState();
      const mockFile = createMockPdfFile('test.pdf');
      const folderId = 'folder-123';
      
      const file = await store.uploadFile(mockFile, folderId);
      
      expect(file.folderId).toBe(folderId);
    });

    it('rejects non-PDF files', async () => {
      const store = useFileStore.getState();
      const mockFile = createMockTextFile('test.txt');
      
      await expect(store.uploadFile(mockFile, null)).rejects.toThrow(
        'Only PDF files are supported'
      );
    });

    it('generates unique name for duplicate file names', async () => {
      const store = useFileStore.getState();
      
      await store.uploadFile(createMockPdfFile('test.pdf'), null);
      const duplicate = await store.uploadFile(createMockPdfFile('test.pdf'), null);
      
      expect(duplicate.name).toBe('test (1).pdf');
    });

    it('increments counter for multiple duplicates', async () => {
      const store = useFileStore.getState();
      
      await store.uploadFile(createMockPdfFile('test.pdf'), null);
      await store.uploadFile(createMockPdfFile('test.pdf'), null);
      const third = await store.uploadFile(createMockPdfFile('test.pdf'), null);
      
      expect(third.name).toBe('test (2).pdf');
    });

    it('handles case-insensitive duplicate detection', async () => {
      const store = useFileStore.getState();
      
      await store.uploadFile(createMockPdfFile('Test.pdf'), null);
      const duplicate = await store.uploadFile(createMockPdfFile('TEST.pdf'), null);
      
      expect(duplicate.name).toBe('TEST (1).pdf');
    });

    it('allows same name in different folders', async () => {
      const store = useFileStore.getState();
      
      await store.uploadFile(createMockPdfFile('test.pdf'), 'folder-1');
      const file2 = await store.uploadFile(createMockPdfFile('test.pdf'), 'folder-2');
      
      expect(file2.name).toBe('test.pdf');
    });
  });

  describe('uploadFiles', () => {
    it('uploads multiple PDF files', async () => {
      const store = useFileStore.getState();
      const mockFiles = [
        createMockPdfFile('file1.pdf'),
        createMockPdfFile('file2.pdf'),
        createMockPdfFile('file3.pdf'),
      ];
      
      const files = await store.uploadFiles(mockFiles, null);
      
      expect(files).toHaveLength(3);
      expect(files[0].name).toBe('file1.pdf');
      expect(files[1].name).toBe('file2.pdf');
      expect(files[2].name).toBe('file3.pdf');
      expect(useFileStore.getState().files).toHaveLength(3);
    });

    it('handles duplicate names across multiple files', async () => {
      const store = useFileStore.getState();
      const mockFiles = [
        createMockPdfFile('test.pdf'),
        createMockPdfFile('test.pdf'),
        createMockPdfFile('test.pdf'),
      ];
      
      const files = await store.uploadFiles(mockFiles, null);
      
      expect(files[0].name).toBe('test.pdf');
      expect(files[1].name).toBe('test (1).pdf');
      expect(files[2].name).toBe('test (2).pdf');
    });

    it('rejects all files if any are non-PDF', async () => {
      const store = useFileStore.getState();
      const mockFiles = [
        createMockPdfFile('file1.pdf'),
        createMockTextFile('file2.txt'),
        createMockPdfFile('file3.pdf'),
      ];
      
      await expect(store.uploadFiles(mockFiles, null)).rejects.toThrow();
      
      // No files should be uploaded if any fail
      expect(useFileStore.getState().files).toHaveLength(0);
    });

    it('uploads files to specific folder', async () => {
      const store = useFileStore.getState();
      const folderId = 'folder-123';
      const mockFiles = [
        createMockPdfFile('file1.pdf'),
        createMockPdfFile('file2.pdf'),
      ];
      
      const files = await store.uploadFiles(mockFiles, folderId);
      
      expect(files[0].folderId).toBe(folderId);
      expect(files[1].folderId).toBe(folderId);
    });

    it('returns empty array for empty file list', async () => {
      const store = useFileStore.getState();
      
      const files = await store.uploadFiles([], null);
      
      expect(files).toHaveLength(0);
    });
  });

  describe('updateFileName', () => {
    it('updates file name', async () => {
      const store = useFileStore.getState();
      const file = await store.uploadFile(createMockPdfFile('original.pdf'), null);
      
      store.updateFileName(file.id, 'updated');
      
      const updatedFile = useFileStore.getState().getFileById(file.id);
      expect(updatedFile?.name).toBe('updated.pdf');
    });

    it('adds .pdf extension if missing', async () => {
      const store = useFileStore.getState();
      const file = await store.uploadFile(createMockPdfFile('test.pdf'), null);
      
      store.updateFileName(file.id, 'newname');
      
      const updatedFile = useFileStore.getState().getFileById(file.id);
      expect(updatedFile?.name).toBe('newname.pdf');
    });

    it('preserves .pdf extension if already present', async () => {
      const store = useFileStore.getState();
      const file = await store.uploadFile(createMockPdfFile('test.pdf'), null);
      
      store.updateFileName(file.id, 'newname.pdf');
      
      const updatedFile = useFileStore.getState().getFileById(file.id);
      expect(updatedFile?.name).toBe('newname.pdf');
    });

    it('updates the updatedAt timestamp', async () => {
      const store = useFileStore.getState();
      const file = await store.uploadFile(createMockPdfFile('test.pdf'), null);
      const originalUpdatedAt = file.updatedAt;
      
      await new Promise(resolve => setTimeout(resolve, 10));
      store.updateFileName(file.id, 'updated');
      
      const updatedFile = useFileStore.getState().getFileById(file.id);
      expect(updatedFile?.updatedAt).toBeGreaterThan(originalUpdatedAt);
    });

    it('does nothing for non-existent file', () => {
      const store = useFileStore.getState();
      
      store.updateFileName('non-existent-id', 'test');
      
      expect(useFileStore.getState().files).toHaveLength(0);
    });
  });

  describe('deleteFile', () => {
    it('deletes a file', async () => {
      const store = useFileStore.getState();
      const file = await store.uploadFile(createMockPdfFile('test.pdf'), null);
      
      store.deleteFile(file.id);
      
      expect(useFileStore.getState().files).toHaveLength(0);
    });

    it('only deletes specified file', async () => {
      const store = useFileStore.getState();
      await store.uploadFile(createMockPdfFile('file1.pdf'), null);
      const file2 = await store.uploadFile(createMockPdfFile('file2.pdf'), null);
      
      store.deleteFile(file2.id);
      
      const remaining = useFileStore.getState().files;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].name).toBe('file1.pdf');
    });
  });

  describe('getFileById', () => {
    it('returns file by ID', async () => {
      const store = useFileStore.getState();
      const file = await store.uploadFile(createMockPdfFile('test.pdf'), null);
      
      const found = store.getFileById(file.id);
      
      expect(found?.id).toBe(file.id);
      expect(found?.name).toBe(file.name);
    });

    it('returns undefined for non-existent ID', () => {
      const store = useFileStore.getState();
      
      const found = store.getFileById('non-existent');
      
      expect(found).toBeUndefined();
    });
  });

  describe('getFilesByFolderId', () => {
    it('returns files in root when folderId is null', async () => {
      const store = useFileStore.getState();
      
      await store.uploadFile(createMockPdfFile('file1.pdf'), null);
      await store.uploadFile(createMockPdfFile('file2.pdf'), null);
      await store.uploadFile(createMockPdfFile('file3.pdf'), 'folder-1');
      
      const rootFiles = store.getFilesByFolderId(null);
      
      expect(rootFiles).toHaveLength(2);
    });

    it('returns files for given folder ID', async () => {
      const store = useFileStore.getState();
      const folderId = 'folder-123';
      
      await store.uploadFile(createMockPdfFile('file1.pdf'), folderId);
      await store.uploadFile(createMockPdfFile('file2.pdf'), folderId);
      await store.uploadFile(createMockPdfFile('file3.pdf'), null);
      
      const folderFiles = useFileStore.getState().getFilesByFolderId(folderId);
      
      expect(folderFiles).toHaveLength(2);
    });

    it('returns empty array when no files in folder', () => {
      const store = useFileStore.getState();
      
      const files = store.getFilesByFolderId('empty-folder');
      
      expect(files).toHaveLength(0);
    });
  });
});
