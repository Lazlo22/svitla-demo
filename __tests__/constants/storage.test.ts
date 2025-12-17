import { describe, it, expect } from 'vitest';
import {
  FOLDERS_STORAGE_KEY,
  FOLDERS_STORE_NAME,
  FILES_STORAGE_KEY,
  FILES_STORE_NAME,
} from '@constants/storage';

describe('Storage Constants', () => {
  describe('Folder storage constants', () => {
    it('should have correct folder storage key', () => {
      expect(FOLDERS_STORAGE_KEY).toBe('folders-store');
    });

    it('should have correct folder store name', () => {
      expect(FOLDERS_STORE_NAME).toBe('FolderStore');
    });
  });

  describe('File storage constants', () => {
    it('should have correct file storage key', () => {
      expect(FILES_STORAGE_KEY).toBe('files-store');
    });

    it('should have correct file store name', () => {
      expect(FILES_STORE_NAME).toBe('FileStore');
    });
  });
});
