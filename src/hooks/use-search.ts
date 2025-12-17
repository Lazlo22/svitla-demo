import { useMemo, useState } from 'react';

import { useFileStore, selectFiles } from '@stores/fileStore';
import { useFolderStore, selectFolders } from '@stores/folderStore';
import type { IFile } from '@type/file';
import type { IFolder } from '@type/folder';

export interface SearchResult {
  files: IFile[];
  folders: IFolder[];
  totalResults: number;
}

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const allFiles = useFileStore(selectFiles);
  const allFolders = useFolderStore(selectFolders);

  const searchResults = useMemo<SearchResult>(() => {
    if (!searchQuery.trim()) {
      return {
        files: [],
        folders: [],
        totalResults: 0,
      };
    }

    const query = searchQuery.toLowerCase();

    // Search in folders by name
    const matchedFolders = allFolders.filter((folder) => {
      const folderName = folder.name.toLowerCase();

      return folderName.includes(query);
    });

    // Search in files by name
    const matchedFiles = allFiles.filter((file) => {
      const fileName = file.name.toLowerCase();
      
      return fileName.includes(query);
    });

    return {
      files: matchedFiles,
      folders: matchedFolders,
      totalResults: matchedFiles.length + matchedFolders.length,
    };
  }, [searchQuery, allFiles, allFolders]);

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    hasResults: searchResults.totalResults > 0,
    isSearching: searchQuery.trim().length > 0,
  };
}
