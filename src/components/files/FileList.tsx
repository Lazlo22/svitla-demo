import { useMemo } from 'react';

import { FileItem } from '@components/files/FileItem';
import { EmptyFileListState } from '@components/files/EmptyFileListState';
import type { IFile } from '@type/file';
import { useFileStore, selectFiles, selectUpdateFileName, selectDeleteFile } from '@stores/fileStore';
import { useFileDialogs } from '@context/FileDialogsContext';

interface FileListProps {
  folderId: string | null;
  files?: IFile[];
}

export function FileList({ folderId, files: filesProp }: FileListProps) {
  const { openRenameDialog, openDeleteDialog } = useFileDialogs();
  
  const allFiles = useFileStore(selectFiles);
  const updateFileName = useFileStore(selectUpdateFileName);
  const deleteFile = useFileStore(selectDeleteFile);
  
  const files = useMemo(() => 
    filesProp ?? allFiles.filter(f => f.folderId === folderId), 
    [filesProp, allFiles, folderId]
  );

  const handleRename = (file: IFile) => {
    openRenameDialog(file, (newName: string) => {
      updateFileName(file.id, newName);
    });
  };

  const handleDelete = (file: IFile) => {
    openDeleteDialog(file, () => {
      deleteFile(file.id);
    });
  };

  if (files.length === 0) {
    return <EmptyFileListState />;
  }

  return (
    <div className="space-y-1">
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          onRename={handleRename}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}

FileList.displayName = 'FileList';
