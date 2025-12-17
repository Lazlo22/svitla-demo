import { useState, lazy, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { FolderPlus, Upload } from 'lucide-react';

import { useFolderStore } from '@stores/folderStore';
import { useFileStore } from '@stores/fileStore';
import { useDisclosure } from '@hooks/use-disclosure';
import { Button } from '@ui/button';
import { FolderCard } from '@components/folders/FolderCard';
import { FolderBreadcrumb } from '@components/folder/FolderBreadcrumb';
import { FolderNotFound } from '@components/folder/FolderNotFound';
import { FileList } from '@components/files/FileList';
import { FileUploadDialog } from '@components/files/FileUploadDialog';
import EmptyState from '@components/common/EmptyState';
import type { IFolder } from '@type/folder';

const CreateFolderDialog = lazy(() => import('@components/folders/CreateFolderDialog'));
const EditFolderDialog = lazy(() => import('@components/folders/EditFolderDialog'));
const DeleteFolderDialog = lazy(() => import('@components/folders/DeleteFolderDialog'));

export default function FolderPage() {
  const params = useParams();
  const navigate = useNavigate();

  const folderId = params['*'] || '';
  
  const {
    createFolder, 
    updateFolder, 
    deleteFolder,
    getFolderById,
    getFoldersByParentId,
    getFolderPath
  } = useFolderStore();

  const allFiles = useFileStore((state) => state.files);
  const uploadFile = useFileStore((state) => state.uploadFile);

  const { isOpen: isCreateDialogOpen, onOpen: onCreateDialogOpen, onToggle: onCreateDialogToggle } = useDisclosure();
  const { isOpen: isEditDialogOpen, onOpen: onEditDialogOpen, onToggle: onEditDialogToggle } = useDisclosure();
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onToggle: onDeleteDialogToggle } = useDisclosure();
  const { isOpen: isUploadDialogOpen, onOpen: onUploadDialogOpen, onToggle: onUploadDialogToggle } = useDisclosure();

  const [selectedFolder, setSelectedFolder] = useState<IFolder | null>(null);
  const [dropError, setDropError] = useState<string>('');

  const currentFolder = getFolderById(folderId);
  const subfolders = getFoldersByParentId(folderId);
  const breadcrumbs = getFolderPath(folderId);
  
  const files = useMemo(() => allFiles.filter(f => f.folderId === folderId), [allFiles.length, folderId]);

  const handleFileDrop = async (file: File) => {
    try {
      setDropError('');
      await uploadFile(file, folderId);
    } catch (err) {
      setDropError(err instanceof Error ? err.message : 'Failed to upload file');
    }
  };

  const handleFileDropError = (error: string) => {
    setDropError(error);
  };

  const handleCreateFolder = async (name: string) => {
    await createFolder(name, folderId);
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
    navigate(`/folder/${folder.id}`);
  };

  if (!currentFolder) {
    return <FolderNotFound />;
  }

  return (
    <div className="container mx-auto p-6 py-0 max-w-6xl">
      <FolderBreadcrumb breadcrumbs={breadcrumbs} />

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">{currentFolder.name}</h1>
          <p className="text-muted-foreground mt-1">
            {subfolders.length} {`subfolder${subfolders.length === 1 ? '' : 's'}`} • {files.length} {`file${files.length === 1 ? '' : 's'}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onUploadDialogOpen}>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
          <Button onClick={onCreateDialogOpen}>
            <FolderPlus className="mr-2 h-4 w-4" />
            New Subfolder
          </Button>
        </div>
      </div>

      {dropError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{dropError}</p>
        </div>
      )}

      <div className="space-y-8">
        {/* Subfolders Section */}
        {subfolders.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Subfolders</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {subfolders.map((folder) => (
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
        {files.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Files</h2>
            <FileList folderId={folderId} />
          </div>
        )}

        {/* Empty State */}
        {subfolders.length === 0 && files.length === 0 && (
          <EmptyState
            icon={FolderPlus}
            title="This folder is empty"
            description="Create a subfolder or upload (drag and drop) a file to get started"
            actionLabel="Create Subfolder"
            actionIcon={FolderPlus}
            onAction={onCreateDialogOpen}
            enableFileDrop={true}
            onFileDrop={handleFileDrop}
            onFileDropError={handleFileDropError}
          />
        )}
      </div>

      <CreateFolderDialog
        open={isCreateDialogOpen}
        onOpenChange={onCreateDialogToggle}
        onCreateFolder={handleCreateFolder}
        parentFolderName={currentFolder.name}
      />

      <FileUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={onUploadDialogToggle}
        folderId={folderId}
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
