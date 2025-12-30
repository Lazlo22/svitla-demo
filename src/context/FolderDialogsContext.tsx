import { createContext, useContext, useState, lazy, useCallback, type ReactNode } from 'react';

import { useDisclosure } from '@hooks/useDisclosure';
import type { IFolder } from '@type/folder';

const CreateFolderDialog = lazy(() => import('@components/folders/CreateFolderDialog'));
const EditFolderDialog = lazy(() => import('@components/folders/EditFolderDialog'));
const DeleteFolderDialog = lazy(() => import('@components/folders/DeleteFolderDialog'));

interface FolderDialogsContext {
  openCreateDialog: (parentFolder?: IFolder | null, onCreate?: (name: string) => void) => void;
  openEditDialog: (folder: IFolder, onUpdate: (name: string) => void) => void;
  openDeleteDialog: (folder: IFolder, onDelete: () => void) => void;
}

const FolderDialogsContext = createContext<FolderDialogsContext | null>(null);

export function useFolderDialogs() {
  const context = useContext(FolderDialogsContext);

  if (!context) throw new Error('useFolderDialogs must be used within a FolderDialogsProvider');

  return context;
}

interface FolderDialogsProviderProps {
  children: ReactNode;
}

export function FolderDialogsProvider({ children }: FolderDialogsProviderProps) {
  const { isOpen: createDialogOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();
  const [parentFolder, setParentFolder] = useState<IFolder | null>(null);
  const [onCreateCallback, setOnCreateCallback] = useState<((name: string) => void) | null>(null);

  const { isOpen: editDialogOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const [editFolder, setEditFolder] = useState<IFolder | null>(null);
  const [onUpdateCallback, setOnUpdateCallback] = useState<((name: string) => void) | null>(null);

  const { isOpen: deleteDialogOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const [deleteFolder, setDeleteFolder] = useState<IFolder | null>(null);
  const [onDeleteCallback, setOnDeleteCallback] = useState<(() => void) | null>(null);

  const openCreateDialog = useCallback((parent?: IFolder | null, onCreate?: (name: string) => void) => {
    setParentFolder(parent || null);
    setOnCreateCallback(() => onCreate || null);
    onCreateOpen();
  }, [onCreateOpen]);

  const openEditDialog = useCallback((folder: IFolder, onUpdate: (name: string) => void) => {
    setEditFolder(folder);
    setOnUpdateCallback(() => onUpdate);
    onEditOpen();
  }, [onEditOpen]);

  const openDeleteDialog = useCallback((folder: IFolder, onDelete: () => void) => {
    setDeleteFolder(folder);
    setOnDeleteCallback(() => onDelete);
    onDeleteOpen();
  }, [onDeleteOpen]);

  const handleCreate = (name: string) => {
    if (onCreateCallback) {
      onCreateCallback(name);
    }
  };

  const handleUpdate = (name: string) => {
    if (onUpdateCallback) {
      onUpdateCallback(name);
    }
  };

  const handleDelete = () => {
    if (onDeleteCallback) {
      onDeleteCallback();
    }
  };

  const handleCreateOpenChange = useCallback((open: boolean) => {
    if (!open) onCreateClose();
  }, [onCreateClose]);

  const handleEditOpenChange = useCallback((open: boolean) => {
    if (!open) onEditClose();
  }, [onEditClose]);

  const handleDeleteOpenChange = useCallback((open: boolean) => {
    if (!open) onDeleteClose();
  }, [onDeleteClose]);

  return (
    <FolderDialogsContext value={{ openCreateDialog, openEditDialog, openDeleteDialog }}>
      {children}

      <CreateFolderDialog
        open={createDialogOpen}
        onOpenChange={handleCreateOpenChange}
        onCreateFolder={handleCreate}
        parentFolderName={parentFolder?.name}
      />

      <EditFolderDialog
        open={editDialogOpen}
        onOpenChange={handleEditOpenChange}
        onUpdateFolder={handleUpdate}
        currentName={editFolder?.name || ''}
      />

      <DeleteFolderDialog
        open={deleteDialogOpen}
        onOpenChange={handleDeleteOpenChange}
        onDeleteFolder={handleDelete}
        folderName={deleteFolder?.name || ''}
      />
    </FolderDialogsContext>
  );
}
