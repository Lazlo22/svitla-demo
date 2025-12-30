import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router';

import { useFolderActions, useFolderGetters, useFolderStore, selectGetFoldersByParentId } from '@stores/folderStore';
import type { IFolder } from '@type/folder';

export function useFolderOperations(folderId: string | null = null) {
  const navigate = useNavigate();
  
  const { createFolder, updateFolder, deleteFolder } = useFolderActions();
  const { getFolderById, getFoldersByParentId, getFolderPath } = useFolderGetters();

  const [selectedFolder, setSelectedFolder] = useState<IFolder | null>(null);
  const [parentForCreate, setParentForCreate] = useState<IFolder | null>(null);

  const currentFolder = folderId ? getFolderById(folderId) : null;
  const subfolders = getFoldersByParentId(folderId);
  const breadcrumbs = folderId ? getFolderPath(folderId) : [];

  const handleCreateFolder = (name: string) => {
    createFolder(name, parentForCreate?.id || folderId);
    setParentForCreate(null);
  };

  const handleUpdateFolder = (name: string, folder?: IFolder) => {
    const targetFolder = folder || selectedFolder;

    if (targetFolder) {
      updateFolder(targetFolder.id, name);
      setSelectedFolder(null);
    }
  };

  const handleDeleteFolder = (folder?: IFolder) => {
    const targetFolder = folder || selectedFolder;

    if (targetFolder) {
      deleteFolder(targetFolder.id);
      setSelectedFolder(null);
    }
  };

  const handleOpenFolder = useCallback((folder: IFolder) => {
    navigate(`/folder/${folder.id}`);
  }, []);

  const handleDeleteClick = useCallback((e: React.MouseEvent, folder: IFolder) => {
    e.stopPropagation();
    setSelectedFolder(folder);
  }, []);

  const navigateToFolder = useCallback((e: React.MouseEvent, folder: IFolder) => {
    e.stopPropagation();
    navigate(`/folder/${folder.id}`);
  }, []);

  return {
    currentFolder,
    subfolders,
    breadcrumbs,
    handleCreateFolder,
    handleUpdateFolder,
    handleDeleteFolder,
    handleOpenFolder,
    handleDeleteClick,
    navigateToFolder,
  };
}

export function useRootFolders() {
  const getFoldersByParentId = useFolderStore(selectGetFoldersByParentId);
  
  return getFoldersByParentId(null);
}
