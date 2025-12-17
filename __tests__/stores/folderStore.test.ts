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
    it('creates a folder with correct properties', async () => {
      const store = useFolderStore.getState();
      
      const folder = await store.createFolder('Test Folder', null);
      
      expect(folder.name).toBe('Test Folder');
      expect(folder.parentId).toBeNull();
      expect(folder.id).toBeDefined();
      expect(folder.createdAt).toBeDefined();
      expect(folder.updatedAt).toBeDefined();
    });

    it('creates a subfolder with parent ID', async () => {
      const store = useFolderStore.getState();
      
      const parentFolder = await store.createFolder('Parent', null);
      const childFolder = await store.createFolder('Child', parentFolder.id);
      
      expect(childFolder.parentId).toBe(parentFolder.id);
    });

    it('generates unique name for duplicate folder names', async () => {
      const store = useFolderStore.getState();
      
      await store.createFolder('Test', null);
      const duplicate = await store.createFolder('Test', null);
      
      expect(duplicate.name).toBe('Test (1)');
    });

    it('increments counter for multiple duplicates', async () => {
      const store = useFolderStore.getState();
      
      await store.createFolder('Test', null);
      await store.createFolder('Test', null);
      const third = await store.createFolder('Test', null);
      
      expect(third.name).toBe('Test (2)');
    });

    it('handles case-insensitive duplicate detection', async () => {
      const store = useFolderStore.getState();
      
      await store.createFolder('Test', null);
      const duplicate = await store.createFolder('test', null);
      
      expect(duplicate.name).toBe('test (1)');
    });
  });

  describe('updateFolder', () => {
    it('updates folder name', async () => {
      const store = useFolderStore.getState();
      
      const folder = await store.createFolder('Original', null);
      await store.updateFolder(folder.id, 'Updated');
      
      const updatedFolder = useFolderStore.getState().getFolderById(folder.id);
      expect(updatedFolder?.name).toBe('Updated');
    });

    it('updates the updatedAt timestamp', async () => {
      const store = useFolderStore.getState();
      
      const folder = await store.createFolder('Test', null);
      const originalUpdatedAt = folder.updatedAt;
      
      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));
      await store.updateFolder(folder.id, 'Updated');
      
      const updatedFolder = useFolderStore.getState().getFolderById(folder.id);
      expect(updatedFolder?.updatedAt).toBeGreaterThan(originalUpdatedAt);
    });

    it('does nothing for non-existent folder', async () => {
      const store = useFolderStore.getState();
      
      await store.updateFolder('non-existent-id', 'Test');
      
      expect(useFolderStore.getState().folders).toHaveLength(0);
    });
  });

  describe('deleteFolder', () => {
    it('deletes a folder', async () => {
      const store = useFolderStore.getState();
      
      const folder = await store.createFolder('Test', null);
      await store.deleteFolder(folder.id);
      
      expect(useFolderStore.getState().folders).toHaveLength(0);
    });

    it('deletes folder and all children recursively', async () => {
      const store = useFolderStore.getState();
      
      const parent = await store.createFolder('Parent', null);
      await store.createFolder('Child 1', parent.id);
      const child2 = await store.createFolder('Child 2', parent.id);
      await store.createFolder('Grandchild', child2.id);
      
      expect(useFolderStore.getState().folders).toHaveLength(4);
      
      await store.deleteFolder(parent.id);
      
      expect(useFolderStore.getState().folders).toHaveLength(0);
    });

    it('only deletes specified folder and its children', async () => {
      const store = useFolderStore.getState();
      
      const folder1 = await store.createFolder('Folder 1', null);
      await store.createFolder('Folder 2', null);
      await store.createFolder('Child of 1', folder1.id);
      
      await store.deleteFolder(folder1.id);
      
      const remaining = useFolderStore.getState().folders;
      expect(remaining).toHaveLength(1);
      expect(remaining[0].name).toBe('Folder 2');
    });
  });

  describe('getFolderById', () => {
    it('returns folder by ID', async () => {
      const store = useFolderStore.getState();
      
      const folder = await store.createFolder('Test', null);
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
    it('returns root folders when parentId is null', async () => {
      const store = useFolderStore.getState();
      
      await store.createFolder('Root 1', null);
      await store.createFolder('Root 2', null);
      
      const rootFolders = store.getFoldersByParentId(null);
      
      expect(rootFolders).toHaveLength(2);
    });

    it('returns child folders for given parent ID', async () => {
      const store = useFolderStore.getState();
      
      const parent = await store.createFolder('Parent', null);
      await store.createFolder('Child 1', parent.id);
      await store.createFolder('Child 2', parent.id);
      
      const children = useFolderStore.getState().getFoldersByParentId(parent.id);
      
      expect(children).toHaveLength(2);
    });

    it('returns empty array when no children exist', async () => {
      const store = useFolderStore.getState();
      
      const folder = await store.createFolder('Empty', null);
      const children = store.getFoldersByParentId(folder.id);
      
      expect(children).toHaveLength(0);
    });
  });

  describe('getFolderPath', () => {
    it('returns path from root to folder', async () => {
      const store = useFolderStore.getState();
      
      const root = await store.createFolder('Root', null);
      const child = await store.createFolder('Child', root.id);
      const grandchild = await store.createFolder('Grandchild', child.id);
      
      const path = useFolderStore.getState().getFolderPath(grandchild.id);
      
      expect(path).toHaveLength(3);
      expect(path[0].name).toBe('Root');
      expect(path[1].name).toBe('Child');
      expect(path[2].name).toBe('Grandchild');
    });

    it('returns single folder for root folder', async () => {
      const store = useFolderStore.getState();
      
      const root = await store.createFolder('Root', null);
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
