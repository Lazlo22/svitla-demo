import { describe, it, expect } from 'vitest';
import { generateUniqueName, getExistingNames } from '@lib/store';

describe('generateUniqueName', () => {
  it('returns original name if not in existing names', () => {
    const existingNames = new Set(['file1', 'file2']);
    expect(generateUniqueName('file3', existingNames)).toBe('file3');
  });

  it('appends (1) for first duplicate', () => {
    const existingNames = new Set(['test']);
    expect(generateUniqueName('test', existingNames)).toBe('test (1)');
  });

  it('increments counter for multiple duplicates', () => {
    const existingNames = new Set(['test', 'test (1)', 'test (2)']);
    expect(generateUniqueName('test', existingNames)).toBe('test (3)');
  });

  it('handles case-insensitive comparison', () => {
    const existingNames = new Set(['test']);
    expect(generateUniqueName('Test', existingNames)).toBe('Test (1)');
    expect(generateUniqueName('TEST', existingNames)).toBe('TEST (1)');
  });

  it('finds first available counter', () => {
    const existingNames = new Set(['file', 'file (1)', 'file (3)']);
    expect(generateUniqueName('file', existingNames)).toBe('file (2)');
  });

  it('handles empty existing names set', () => {
    const existingNames = new Set<string>();
    expect(generateUniqueName('test', existingNames)).toBe('test');
  });

  it('handles names with special characters', () => {
    const existingNames = new Set(['my-file!']);
    expect(generateUniqueName('my-file!', existingNames)).toBe('my-file! (1)');
  });

  it('handles names with spaces', () => {
    const existingNames = new Set(['my file']);
    expect(generateUniqueName('my file', existingNames)).toBe('my file (1)');
  });
});

describe('getExistingNames', () => {
  it('extracts names from items', () => {
    const items = [
      { name: 'File1' },
      { name: 'File2' },
      { name: 'File3' },
    ];
    const names = getExistingNames(items, (item) => item.name);
    
    expect(names.has('file1')).toBe(true);
    expect(names.has('file2')).toBe(true);
    expect(names.has('file3')).toBe(true);
  });

  it('converts names to lowercase', () => {
    const items = [
      { name: 'Test' },
      { name: 'TEST' },
      { name: 'TeSt' },
    ];
    const names = getExistingNames(items, (item) => item.name);
    
    expect(names.size).toBe(1);
    expect(names.has('test')).toBe(true);
  });

  it('handles empty array', () => {
    const names = getExistingNames([], (item: any) => item.name);
    expect(names.size).toBe(0);
  });

  it('works with custom getName function', () => {
    const items = [
      { title: 'Item 1' },
      { title: 'Item 2' },
    ];
    const names = getExistingNames(items, (item) => item.title);
    
    expect(names.has('item 1')).toBe(true);
    expect(names.has('item 2')).toBe(true);
  });

  it('handles duplicate names', () => {
    const items = [
      { name: 'duplicate' },
      { name: 'Duplicate' },
      { name: 'DUPLICATE' },
    ];
    const names = getExistingNames(items, (item) => item.name);
    
    expect(names.size).toBe(1);
  });
});
