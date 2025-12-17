import { useState, lazy, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { FolderPlus, Folder, Upload } from 'lucide-react';

import { useFolderStore } from '@stores/folderStore';
import { useFileStore } from '@stores/fileStore';
import { useDisclosure } from '@hooks/use-disclosure';
import { Button } from '@ui/button';
import { FolderCard } from '@components/folders/FolderCard';
import { FileList } from '@components/files/FileList';
import { FileUploadDialog } from '@components/files/FileUploadDialog';
import EmptyState from '@components/common/EmptyState';
import type { IFolder } from '@type/folder';

const CreateFolderDialog = lazy(() => import('@components/folders/CreateFolderDialog'));
const EditFolderDialog = lazy(() => import('@components/folders/EditFolderDialog'));
const DeleteFolderDialog = lazy(() => import('@components/folders/DeleteFolderDialog'));

export default function FoldersPage() {
  const navigate = useNavigate();
  
  const {
    createFolder, 
    updateFolder, 
    deleteFolder,
    getFoldersByParentId 
  } = useFolderStore();

  const allFiles = useFileStore((state) => state.files);

  const { isOpen: isCreateDialogOpen, onOpen: onCreateDialogOpen, onToggle: onCreateDialogToggle } = useDisclosure();
  const { isOpen: isEditDialogOpen, onOpen: onEditDialogOpen, onToggle: onEditDialogToggle } = useDisclosure();
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onToggle: onDeleteDialogToggle } = useDisclosure();
  const { isOpen: isUploadDialogOpen, onOpen: onUploadDialogOpen, onToggle: onUploadDialogToggle } = useDisclosure();
  
  const [selectedFolder, setSelectedFolder] = useState<IFolder | null>(null);
  const [parentForCreate, setParentForCreate] = useState<IFolder | null>(null);

  const rootFolders = getFoldersByParentId(null);
  
  const rootFiles = useMemo(() => allFiles.filter(f => f.folderId === null), [allFiles]);

  const handleCreateFolder = async (name: string) => {
    await createFolder(name, parentForCreate?.id || null);
    setParentForCreate(null);
  };

  const handleUpdateFolder = async (name: string) => {
    if (selectedFolder) {
      await updateFolder(selectedFolder.id, name);
      setSelectedFolder(null);
    }
  };

  const handleDeleteFolder = async () => {
    if (selectedFolder) {
      await deleteFolder(selectedFolder.id);
      setSelectedFolder(null);
    }
  };

  const handleOpenFolder = (folder: IFolder) => {
    navigate(`/folder/${folder.id}`);
  };

  const handleEditClick = (folder: IFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFolder(folder);
    onEditDialogOpen();
  };

  const handleDeleteClick = (folder: IFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFolder(folder);
    onDeleteDialogOpen();
  };

  const handleCreateSubfolderClick = (folder: IFolder, e: React.MouseEvent) => {
    e.stopPropagation();
    setParentForCreate(folder);
    onCreateDialogOpen();
  };

  return (
    <div className="container mx-auto p-6 py-0 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Folders</h1>
          <p className="text-muted-foreground mt-1">
            Manage your folders and their contents
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onUploadDialogOpen}>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
          <Button onClick={onCreateDialogOpen}>
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Folders Section */}
        {rootFolders.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Folders</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {rootFolders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onOpen={() => handleOpenFolder(folder)}
                  onEdit={(e) => handleEditClick(folder, e)}
                  onDelete={(e) => handleDeleteClick(folder, e)}
                  onCreateSubfolder={(e) => handleCreateSubfolderClick(folder, e)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Files Section */}
        {rootFiles.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Files</h2>
            <FileList folderId={null} />
          </div>
        )}

        {/* Empty State */}
        {rootFolders.length === 0 && rootFiles.length === 0 && (
          <EmptyState
            icon={Folder}
            title="No folders or files yet"
            description="Create your first folder or upload a file to get started"
            actionLabel="Create Folder"
            actionIcon={FolderPlus}
            onAction={onCreateDialogOpen}
          />
        )}
      </div>

      <CreateFolderDialog
        open={isCreateDialogOpen}
        onOpenChange={onCreateDialogToggle}
        onCreateFolder={handleCreateFolder}
        parentFolderName={parentForCreate?.name}
      />

      <FileUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={onUploadDialogToggle}
        folderId={null}
      />

      {selectedFolder && (
        <>
          <EditFolderDialog
            open={isEditDialogOpen}
            onOpenChange={onEditDialogToggle}
            onUpdateFolder={handleUpdateFolder}
            currentName={selectedFolder.name}
          />

          <DeleteFolderDialog
            open={isDeleteDialogOpen}
            onOpenChange={onDeleteDialogToggle}
            onDeleteFolder={handleDeleteFolder}
            folderName={selectedFolder.name}
          />
        </>
      )}
    </div>
  );
}
