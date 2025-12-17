import { useState, lazy, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { FolderPlus, Folder, Upload } from 'lucide-react';

import { useFolderStore, useFolderActions, selectGetFoldersByParentId } from '@stores/folderStore';
import { useFileStore, selectFiles, selectUploadFile } from '@stores/fileStore';
import { useDisclosure } from '@hooks/use-disclosure';
import { useSearch } from '@hooks/use-search';
import { Button } from '@ui/button';
import { FolderCard } from '@components/folders/FolderCard';
import { FileList } from '@components/files/FileList';
import { FileUploadDialog } from '@components/files/FileUploadDialog';
import { SearchBar } from '@components/common/SearchBar';
import EmptyState from '@components/common/EmptyState';
import type { IFolder } from '@type/folder';

const CreateFolderDialog = lazy(() => import('@components/folders/CreateFolderDialog'));
const EditFolderDialog = lazy(() => import('@components/folders/EditFolderDialog'));
const DeleteFolderDialog = lazy(() => import('@components/folders/DeleteFolderDialog'));

export default function FoldersPage() {
  const navigate = useNavigate();
  
  const { createFolder, updateFolder, deleteFolder } = useFolderActions();
  const getFoldersByParentId = useFolderStore(selectGetFoldersByParentId);

  const allFiles = useFileStore(selectFiles);
  const uploadFile = useFileStore(selectUploadFile);

  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch();
  const { isOpen: isCreateDialogOpen, onOpen: onCreateDialogOpen, onToggle: onCreateDialogToggle } = useDisclosure();
  const { isOpen: isEditDialogOpen, onOpen: onEditDialogOpen, onToggle: onEditDialogToggle } = useDisclosure();
  const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onToggle: onDeleteDialogToggle } = useDisclosure();
  const { isOpen: isUploadDialogOpen, onOpen: onUploadDialogOpen, onToggle: onUploadDialogToggle } = useDisclosure();
  
  const [selectedFolder, setSelectedFolder] = useState<IFolder | null>(null);
  const [parentForCreate, setParentForCreate] = useState<IFolder | null>(null);
  const [dropError, setDropError] = useState<string>('');

  const rootFolders = getFoldersByParentId(null);
  
  const rootFiles = useMemo(() => allFiles.filter(f => f.folderId === null), [allFiles]);

  const displayFolders = isSearching ? searchResults.folders : rootFolders;
  const displayFiles = isSearching ? searchResults.files : rootFiles;

  const handleFileDrop = async (file: File) => {
    try {
      setDropError('');
      await uploadFile(file, null);
    } catch (err) {
      setDropError(err instanceof Error ? err.message : 'Failed to upload file');
    }
  };

  const handleFileDropError = (error: string) => {
    setDropError(error);
  };

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

      {dropError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{dropError}</p>
        </div>
      )}

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search folders and files..."
        className="mb-6"
      />

      <div className="space-y-8">
        {displayFolders.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Folders</h2>
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
            <FileList folderId={null} files={displayFiles} />
          </div>
        )}

        {displayFolders.length === 0 && displayFiles.length === 0 && (
          <EmptyState
            icon={Folder}
            title={isSearching ? "No results found" : "No folders or files yet"}
            description={isSearching ? `No folders or files match "${searchQuery}"` : "Create your first folder or upload a file to get started, or drag and drop here"}
            actionLabel="Create Folder"
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
        parentFolderName={parentForCreate?.name}
      />

      <FileUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={onUploadDialogToggle}
        folderId={null}
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
