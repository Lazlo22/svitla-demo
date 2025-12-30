import { useState, useMemo, useCallback } from 'react';

import { useFileStore, selectFiles, useFileActions } from '@stores/fileStore';
import type { IFile } from '@type/file';

export function useFileListOperations(folderId: string | null = null) {
  const files = useFileStore(selectFiles);
  const { uploadFile, updateFileName, deleteFile } = useFileActions();

  const [renamingFile, setRenamingFile] = useState<IFile | null>(null);
  const [deletingFile, setDeletingFile] = useState<IFile | null>(null);
  const [dropError, setDropError] = useState<string>('');

  const folderFiles = useMemo(
    () => (folderId !== undefined ? files.filter(f => f.folderId === folderId) : files),
    [files, folderId]
  );

  const handleFileDrop = useCallback(async (file: File) => {
    try {
      setDropError('');
      await uploadFile(file, folderId);
    } catch (err) {
      setDropError(err instanceof Error ? err.message : 'Failed to upload file');
    }
  }, [uploadFile, folderId]);

  const handleFileDropError = useCallback((error: string) => {
    setDropError(error);
  }, []);

  const handleRename = useCallback((newName: string) => {
    if (renamingFile) {
      updateFileName(renamingFile.id, newName);
      setRenamingFile(null);
    }
  }, [renamingFile, updateFileName]);

  const handleDelete = useCallback(() => {
    if (deletingFile) {
      deleteFile(deletingFile.id);
      setDeletingFile(null);
    }
  }, [deletingFile, deleteFile]);

  return {
    files,
    folderFiles,
    dropError,
    setRenamingFile,
    setDeletingFile,
    handleFileDrop,
    handleFileDropError,
    handleRename,
    handleDelete,
  };
}
