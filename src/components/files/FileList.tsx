import { useState, useMemo, lazy } from 'react';

import { FileItem } from '@components/files/FileItem';
import { EmptyFileListState } from '@components/files/EmptyFileListState';
import type { IFile } from '@type/file';
import { useFileStore } from '@stores/fileStore';

const FileRenameDialog = lazy(() => import('@components/files/FileRenameDialog').then(m => ({ default: m.FileRenameDialog })));
const FileDeleteDialog = lazy(() => import('@components/files/FileDeleteDialog').then(m => ({ default: m.FileDeleteDialog })));

interface FileListProps {
  folderId: string | null;
}

export function FileList({ folderId }: FileListProps) {
  const [renamingFile, setRenamingFile] = useState<IFile | null>(null);
  const [deletingFile, setDeletingFile] = useState<IFile | null>(null);
  
  const allFiles = useFileStore((state) => state.files);
  const updateFileName = useFileStore((state) => state.updateFileName);
  const deleteFile = useFileStore((state) => state.deleteFile);
  
  const files = useMemo(() => allFiles.filter(f => f.folderId === folderId), [allFiles, folderId]);

  const handleRename = async (newName: string) => {
    if (renamingFile) {
      await updateFileName(renamingFile.id, newName);
    }
  };

  const handleDelete = async () => {
    if (deletingFile) {
      await deleteFile(deletingFile.id);
    }
  };

  if (files.length === 0) {
    return <EmptyFileListState />;
  }

  return (
    <>
      <div className="space-y-1">
        {files.map((file) => (
          <FileItem
            key={file.id}
            file={file}
            onRename={setRenamingFile}
            onDelete={setDeletingFile}
          />
        ))}
      </div>

      <FileRenameDialog
        open={!!renamingFile}
        onOpenChange={(open) => !open && setRenamingFile(null)}
        fileName={renamingFile?.name || ''}
        onRename={handleRename}
      />

      <FileDeleteDialog
        open={!!deletingFile}
        onOpenChange={(open) => !open && setDeletingFile(null)}
        fileName={deletingFile?.name || ''}
        onDelete={handleDelete}
      />
    </>
  );
}

FileList.displayName = 'FileList';
