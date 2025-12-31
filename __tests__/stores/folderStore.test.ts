import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import { useFolderStore } from '@stores/folderStore';

describe('folderStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useFolderStore.setState({ folders: [] });
    });
  });

  describe('createFolder', () => {
    it('creates a folder with correct properties', () => {
      const store = useFolderStore.getState();
      
      const folder = store.createFolder('Test Folder', null);
      
      expect(folder.name).toBe('Test Folder');
      expect(folder.parentId).toBeNull();
      expect(folder.id).toBeDefined();
      expect(folder.createdAt).toBeDefined();
      expect(folder.updatedAt).toBeDefined();
    });

    it('creates a subfolder with parent ID', () => {
      const store = useFolderStore.getState();
      
      const parentFolder = store.createFolder('Parent', null);
      const childFolder = store.createFolder('Child', parentFolder.id);
      
      expect(childFolder.parentId).toBe(parentFolder.id);
    });

    it('generates unique name for duplicate folder names', () => {
      const store = useFolderStore.getState();
      
      store.createFolder('Test', null);
      const duplicate = store.createFolder('Test', null);
      
      expect(duplicate.name).toBe('Test (1)');
    });

    it('increments counter for multiple duplicates', () => {
      const store = useFolderStore.getState();
      
      store.createFolder('Test', null);
      store.createFolder('Test', null);
      const third = store.createFolder('Test', null);
      
      expect(third.name).toBe('Test (2)');
    });

    it('handles case-insensitive duplicate detection', () => {
      const store = useFolderStore.getState();
      
      store.createFolder('Test', null);
      const duplicate = store.createFolder('test', null);
      
      expect(duplicate.name).toBe('test (1)');
    });
  });

  describe('updateFolder', () => {
    it('updates folder name', () => {
      const store = useFolderStore.getState();
      
      const folder = store.createFolder('Original', null);
      store.updateFolder(folder.id, 'Updated');
      
      const updatedFolder = useFolderStore.getState().getFolderById(folder.id);
      expect(updatedFolder?.name).toBe('Updated');
    });

    it('updates the updatedAt timestamp', async () => {
      const store = useFolderStore.getState();
      
      const folder = store.createFolder('Test', null);
      const originalUpdatedAt = folder.updatedAt;
      
      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));
      store.updateFolder(folder.id, 'Updated');
      
      const updatedFolder = useFolderStore.getState().getFolderById(folder.id);
      expect(updatedFolder?.updatedAt).toBeGreaterThan(originalUpdatedAt);
    });

    it('does nothing for non-existent folder', () => {
      const store = useFolderStore.getState();
      
      store.updateFolder('non-existent-id', 'Test');
      
      expect(useFolderStore.getState().folders).toHaveLength(0);
    });
  });

  describe('deleteFolder', () => {
    it('deletes a folder', () => {
      const store = useFolderStore.getState();
      
      const folder = store.createFolder('Test', null);
      store.deleteFolder(folder.id);
      
      expect(useFolderStore.getState().folders).toHaveLength(0);
    });

    it('deletes folder and all children recursively', () => {
      const store = useFolderStore.getState();
      
      const parent = store.createFolder('Parent', null);
      store.createFolder('Child 1', parent.id);
      const child2 = store.createFolder('Child 2', parent.id);
      store.createFolder('Grandchild', child2.id);
      
      expect(useFolderStore.getState().folders).toHaveLength(4);
      
      store.deleteFolder(parent.id);
      
      expect(useFolderStore.getState().folders).toHaveLength(0);
    });

    it('only deletes specified folder and its children', () => {
      const store = useFolderStore.getState();
      
      const folder1 = store.createFolder('Folder 1', null);
      store.createFolder('Folder 2', null);
      store.createFolder('Child of 1', folder1.id);
      
      store.deleteFolder(folder1.id);
      
      const remaining = useFolderStore.getState().folders;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].name).toBe('Folder 2');
    });
  });

  describe('getFolderById', () => {
    it('returns folder by ID', () => {
      const store = useFolderStore.getState();
      
      const folder = store.createFolder('Test', null);
      const found = store.getFolderById(folder.id);
      
      expect(found).toEqual(folder);
    });

    it('returns undefined for non-existent ID', () => {
      const store = useFolderStore.getState();
      
      const found = store.getFolderById('non-existent');
      
      expect(found).toBeUndefined();
    });
  });

  describe('getFoldersByParentId', () => {
    it('returns root folders when parentId is null', () => {
      const store = useFolderStore.getState();
      
      store.createFolder('Root 1', null);
      store.createFolder('Root 2', null);
      
      const rootFolders = store.getFoldersByParentId(null);
      
      expect(rootFolders).toHaveLength(2);
    });

    it('returns child folders for given parent ID', () => {
      const store = useFolderStore.getState();
      
      const parent = store.createFolder('Parent', null);
      store.createFolder('Child 1', parent.id);
      store.createFolder('Child 2', parent.id);
      
      const children = useFolderStore.getState().getFoldersByParentId(parent.id);
      
      expect(children).toHaveLength(2);
    });

    it('returns empty array when no children exist', () => {
      const store = useFolderStore.getState();
      
      const folder = store.createFolder('Empty', null);
      const children = store.getFoldersByParentId(folder.id);
      
      expect(children).toHaveLength(0);
    });
  });

  describe('getFolderPath', () => {
    it('returns path from root to folder', () => {
      const store = useFolderStore.getState();
      
      const root = store.createFolder('Root', null);
      const child = store.createFolder('Child', root.id);
      const grandchild = store.createFolder('Grandchild', child.id);
      
      const path = useFolderStore.getState().getFolderPath(grandchild.id);
      
      expect(path).toHaveLength(3);
      expect(path[0].name).toBe('Root');
      expect(path[1].name).toBe('Child');
      expect(path[2].name).toBe('Grandchild');
    });

    it('returns single folder for root folder', () => {
      const store = useFolderStore.getState();
      
      const root = store.createFolder('Root', null);
      const path = store.getFolderPath(root.id);
      
      expect(path).toHaveLength(1);
      expect(path[0].name).toBe('Root');
    });

    it('returns empty array for non-existent folder', () => {
      const store = useFolderStore.getState();
      
      const path = store.getFolderPath('non-existent');
      
      expect(path).toHaveLength(0);
    });
  });
});
