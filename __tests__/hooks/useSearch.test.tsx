import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useSearch } from '@hooks/useSearch';
import { useFileStore } from '@stores/fileStore';
import { useFolderStore } from '@stores/folderStore';
import { mockFiles, mockFolders } from '@test/mocks/search';

describe('useSearch', () => {
  beforeEach(() => {
    // Reset store states before each test
    act(() => {
      useFileStore.setState({ files: mockFiles });
      useFolderStore.setState({ folders: mockFolders });
    });
  });

  it('initializes with empty search query', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.searchQuery).toBe('');
    expect(result.current.isSearching).toBe(false);
    expect(result.current.hasResults).toBe(false);
    expect(result.current.searchResults.totalResults).toBe(0);
  });

  it('updates search query when setSearchQuery is called', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchQuery('test');
    });

    expect(result.current.searchQuery).toBe('test');
    expect(result.current.isSearching).toBe(true);
  });

  it('searches files by name (case insensitive)', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchQuery('document');
    });

    expect(result.current.searchResults.files).toHaveLength(1);
    expect(result.current.searchResults.files[0].name).toBe('Document.pdf');
    expect(result.current.hasResults).toBe(true);
  });

  it('searches folders by name (case insensitive)', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchQuery('reports');
    });

    expect(result.current.searchResults.folders).toHaveLength(1);
    expect(result.current.searchResults.folders[0].name).toBe('Reports');
    expect(result.current.hasResults).toBe(true);
  });

  it('searches both files and folders', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchQuery('invoice');
    });

    expect(result.current.searchResults.files).toHaveLength(1);
    expect(result.current.searchResults.folders).toHaveLength(1);
    expect(result.current.searchResults.totalResults).toBe(2);
  });

  it('returns empty results for non-matching query', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchQuery('nonexistent');
    });

    expect(result.current.searchResults.files).toHaveLength(0);
    expect(result.current.searchResults.folders).toHaveLength(0);
    expect(result.current.hasResults).toBe(false);
  });

  it('searches partial matches', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchQuery('doc');
    });

    expect(result.current.searchResults.files.length).toBeGreaterThan(0);
    expect(result.current.searchResults.folders.length).toBeGreaterThan(0);
  });

  it('clears results when search query is empty', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchQuery('document');
    });

    expect(result.current.hasResults).toBe(true);

    act(() => {
      result.current.setSearchQuery('');
    });

    expect(result.current.hasResults).toBe(false);
    expect(result.current.isSearching).toBe(false);
    expect(result.current.searchResults.totalResults).toBe(0);
  });

  it('handles whitespace-only queries', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchQuery('   ');
    });

    expect(result.current.searchResults.totalResults).toBe(0);
    expect(result.current.hasResults).toBe(false);
  });

  it('updates results when store data changes', () => {
    const { result, rerender } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchQuery('new');
    });

    expect(result.current.searchResults.files).toHaveLength(0);

    // Add a new file to the store
    act(() => {
      useFileStore.setState({
        files: [
          ...mockFiles,
          {
            id: '4',
            name: 'NewFile.pdf',
            folderId: null,
            type: 'application/pdf',
            size: 1024,
            content: 'base64content',
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        ],
      });
    });

    rerender();

    expect(result.current.searchResults.files).toHaveLength(1);
    expect(result.current.searchResults.files[0].name).toBe('NewFile.pdf');
  });

  it('calculates total results correctly', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setSearchQuery('e'); // Common letter
    });

    const totalFiles = result.current.searchResults.files.length;
    const totalFolders = result.current.searchResults.folders.length;

    expect(result.current.searchResults.totalResults).toBe(totalFiles + totalFolders);
  });
});
