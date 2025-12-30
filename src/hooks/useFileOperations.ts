import { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router';

import { useFileStore, selectFiles, selectUpdateFileName, selectDeleteFile } from '@stores/fileStore';

export function useFileOperations(fileId?: string) {
  const navigate = useNavigate();
  
  const files = useFileStore(selectFiles);
  const updateFileName = useFileStore(selectUpdateFileName);
  const deleteFileFromStore = useFileStore(selectDeleteFile);

  const file = useMemo(
    () => (fileId ? files.find(f => f.id === fileId) : undefined),
    [files, fileId]
  );

  const renameFile = useCallback((newName: string) => {
    if (!file) return;

    updateFileName(file.id, newName);
  }, [file, updateFileName]);

  const deleteFile = useCallback(() => {
    if (!file) return;

    deleteFileFromStore(file.id);

    navigate('/files');
  }, [file, deleteFileFromStore, navigate]);

  const downloadFile = useCallback(() => {
    if (!file) return;

    const link = document.createElement('a');

    link.href = file.content;
    link.download = file.name;
    link.click();
  }, [file]);

  return {
    file,
    renameFile,
    deleteFile,
    downloadFile,
  };
}
