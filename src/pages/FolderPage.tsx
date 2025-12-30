import { useState, lazy } from 'react';
import { useParams, useNavigate } from 'react-router';
import { FolderPlus, Upload } from 'lucide-react';

import { useFolderActions, useFolderGetters } from '@stores/folderStore';
import { useFileStore, selectFiles, selectUploadFile } from '@stores/fileStore';
import { useDisclosure } from '@hooks/use-disclosure';
import { useSearch } from '@hooks/use-search';
import { Button } from '@ui/button';
import { FolderCard } from '@components/folders/FolderCard';
import { FolderBreadcrumb } from '@components/folder/FolderBreadcrumb';
import { FolderNotFound } from '@components/folder/FolderNotFound';
import { FileList } from '@components/files/FileList';
import { FileUploadDialog } from '@components/files/FileUploadDialog';
import { SearchBar } from '@components/common/SearchBar';
import EmptyState from '@components/common/EmptyState';
import type { IFolder } from '@type/folder';

const CreateFolderDialog = lazy(() => import('@components/folders/CreateFolderDialog'));
const EditFolderDialog = lazy(() => import('@components/folders/EditFolderDialog'));
const DeleteFolderDialog = lazy(() => import('@components/folders/DeleteFolderDialog'));

export default function FolderPage() {
  const params = useParams();
  const navigate = useNavigate();

  const folderId = params['*'] || '';
  
  const { createFolder, updateFolder, deleteFolder } = useFolderActions();
  const { getFolderById, getFoldersByParentId, getFolderPath } = useFolderGetters();

  const allFiles = useFileStore(selectFiles);
  const uploadFile = useFileStore(selectUploadFile);

  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch();
  const { isOpen: isCreateDialogOpen, onOpen: onCreateDialogOpen, onToggle: onCreateDialogToggle } = useDisclosure();
  const { isOpen: isEditDialogOpen, onOpen: onEditDialogOpen, onToggle: onEditDialogToggle } = useDisclosure();
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onToggle: onDeleteDialogToggle } = useDisclosure();
  const { isOpen: isUploadDialogOpen, onOpen: onUploadDialogOpen, onToggle: onUploadDialogToggle } = useDisclosure();

  const [selectedFolder, setSelectedFolder] = useState<IFolder | null>(null);
  const [dropError, setDropError] = useState<string>('');

  const currentFolder = getFolderById(folderId);
  const subfolders = getFoldersByParentId(folderId);
  const breadcrumbs = getFolderPath(folderId);
  
  const files = allFiles.filter(f => f.folderId === folderId);

  const displayFolders = isSearching ? searchResults.folders.filter(f => f.parentId === folderId) : subfolders;
  const displayFiles = isSearching ? searchResults.files.filter(f => f.folderId === folderId) : files;

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

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search in this folder..."
        className="mb-6"
      />

      <div className="space-y-8">
        {displayFolders.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Subfolders</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayFolders.map((folder) => (
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

        {displayFiles.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Files</h2>
            <FileList folderId={folderId} files={displayFiles} />
          </div>
        )}

        {displayFolders.length === 0 && displayFiles.length === 0 && (
          <EmptyState
            icon={FolderPlus}
            title={isSearching ? "No results found" : "This folder is empty"}
            description={isSearching ? `No folders or files match "${searchQuery}"` : "Create a subfolder or upload (drag and drop) a file to get started"}
            actionLabel="Create Subfolder"
            actionIcon={FolderPlus}
            onAction={onCreateDialogOpen}
            enableFileDrop={!isSearching}
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

      <EditFolderDialog
        open={isEditDialogOpen}
        onOpenChange={onEditDialogToggle}
        onUpdateFolder={handleUpdateFolder}
        currentName={selectedFolder?.name || ""}
      />

      <DeleteFolderDialog
        open={isDeleteDialogOpen}
        onOpenChange={onDeleteDialogToggle}
        onDeleteFolder={handleDeleteFolder}
        folderName={selectedFolder?.name || ""}
      />
    </div>
  );
}
