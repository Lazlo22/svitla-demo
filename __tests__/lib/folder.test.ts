import { describe, it, expect } from 'vitest';
import { generateFolder } from '@lib/folder';

describe('generateFolder', () => {
  it('generates folder with correct properties', () => {
    const folder = generateFolder({
      name: 'Test Folder',
      parentId: null,
    });

    expect(folder.id).toBeDefined();
    expect(folder.name).toBe('Test Folder');
    expect(folder.parentId).toBeNull();
    expect(folder.createdAt).toBeDefined();
    expect(folder.updatedAt).toBeDefined();
  });

  it('generates folder with parent ID', () => {
    const folder = generateFolder({
      name: 'Subfolder',
      parentId: 'parent-123',
    });

    expect(folder.parentId).toBe('parent-123');
  });

  it('generates unique IDs for different folders', () => {
    const folder1 = generateFolder({
      name: 'Folder 1',
      parentId: null,
    });

    const folder2 = generateFolder({
      name: 'Folder 2',
      parentId: null,
    });

    expect(folder1.id).not.toBe(folder2.id);
  });

  it('sets createdAt and updatedAt timestamps', () => {
    const before = Date.now();
    const folder = generateFolder({
      name: 'Test',
      parentId: null,
    });
    const after = Date.now();

    expect(folder.createdAt).toBeGreaterThanOrEqual(before);
    expect(folder.createdAt).toBeLessThanOrEqual(after);
    expect(folder.updatedAt).toBeGreaterThanOrEqual(before);
    expect(folder.updatedAt).toBeLessThanOrEqual(after);
  });

  it('preserves exact name provided', () => {
    const folder = generateFolder({
      name: 'My Special Folder!',
      parentId: null,
    });

    expect(folder.name).toBe('My Special Folder!');
  });
});
