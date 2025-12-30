import { createContext, useContext, useState, lazy, useCallback, type ReactNode } from 'react';

import { useDisclosure } from '@hooks/useDisclosure';
import type { IFile } from '@type/file';

const FileUploadDialog = lazy(() => import('@components/files/FileUploadDialog'));
const FileRenameDialog = lazy(() => import('@components/files/FileRenameDialog'));
const FileDeleteDialog = lazy(() => import('@components/files/FileDeleteDialog'));

interface FileDialogsContext {
  openUploadDialog: (folderId: string | null) => void;
  openRenameDialog: (file: IFile, onRename: (newName: string) => void) => void;
  openDeleteDialog: (file: IFile, onDelete: () => void) => void;
}

const FileDialogsContext = createContext<FileDialogsContext | null>(null);

export function useFileDialogs() {
  const context = useContext(FileDialogsContext);
  
  if (!context) throw new Error('useFileDialogs must be used within a FileDialogsProvider');

  return context;
}

interface FileDialogsProviderProps {
  children: ReactNode;
}

export function FileDialogsProvider({ children }: FileDialogsProviderProps) {
  const { isOpen: uploadDialogOpen, onOpen: onUploadOpen, onClose: onUploadClose } = useDisclosure();
  const [uploadFolderId, setUploadFolderId] = useState<string | null>(null);

  const { isOpen: renameDialogOpen, onOpen: onRenameOpen, onClose: onRenameClose } = useDisclosure();
  const [renameFile, setRenameFile] = useState<IFile | null>(null);
  const [onRenameCallback, setOnRenameCallback] = useState<((newName: string) => void) | null>(null);

  const { isOpen: deleteDialogOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deleteFile, setDeleteFile] = useState<IFile | null>(null);
  const [onDeleteCallback, setOnDeleteCallback] = useState<(() => void) | null>(null);

  const openUploadDialog = useCallback((folderId: string | null) => {
    setUploadFolderId(folderId);
    onUploadOpen();
  }, [onUploadOpen]);

  const openRenameDialog = useCallback((file: IFile, onRename: (newName: string) => void) => {
    setRenameFile(file);
    setOnRenameCallback(() => onRename);
    onRenameOpen();
  }, [onRenameOpen]);

  const openDeleteDialog = useCallback((file: IFile, onDelete: () => void) => {
    setDeleteFile(file);
    setOnDeleteCallback(() => onDelete);
    onDeleteOpen();
  }, [onDeleteOpen]);

  const handleRename = (newName: string) => {
    if (onRenameCallback) {
      onRenameCallback(newName);
    }
  };

  const handleDelete = () => {
    if (onDeleteCallback) {
      onDeleteCallback();
    }
  };

  const handleUploadOpenChange = useCallback((open: boolean) => {
    if (!open) onUploadClose();
  }, [onUploadClose]);

  const handleRenameOpenChange = useCallback((open: boolean) => {
    if (!open) onRenameClose();
  }, [onRenameClose]);

  const handleDeleteOpenChange = useCallback((open: boolean) => {
    if (!open) onDeleteClose();
  }, [onDeleteClose]);

  return (
    <FileDialogsContext value={{ openUploadDialog, openRenameDialog, openDeleteDialog }}>
      {children}

      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={handleUploadOpenChange}
        folderId={uploadFolderId}
      />

      <FileRenameDialog
        open={renameDialogOpen}
        onOpenChange={handleRenameOpenChange}
        fileName={renameFile?.name || ''}
        onRename={handleRename}
      />

      <FileDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={handleDeleteOpenChange}
        fileName={deleteFile?.name || ''}
        onDelete={handleDelete}
      />
    </FileDialogsContext>
  );
}
