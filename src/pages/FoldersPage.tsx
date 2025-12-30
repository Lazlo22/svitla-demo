import { FolderPlus, Folder, Upload } from 'lucide-react';

import { useFolderOperations, useRootFolders } from '@hooks/useFolderOperations';
import { useFileListOperations } from '@hooks/useFileListOperations';
import { useSearch } from '@hooks/useSearch';
import { useFileDialogs } from '@context/FileDialogsContext';
import { useFolderDialogs } from '@context/FolderDialogsContext';
import { Button } from '@ui/button';
import { FolderCard } from '@components/folders/FolderCard';
import { FileList } from '@components/files/FileList';
import { SearchBar } from '@components/common/SearchBar';
import EmptyState from '@components/common/EmptyState';
import type { IFolder } from '@type/folder';

export default function FoldersPage() {
  const rootFolders = useRootFolders();
  
  const {
    handleCreateFolder,
    handleUpdateFolder,
    handleDeleteFolder,
    handleOpenFolder,
  } = useFolderOperations(null);

  const {
    folderFiles: rootFiles,
    dropError,
    handleFileDrop,
    handleFileDropError,
  } = useFileListOperations(null);

  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch();
  const { openUploadDialog } = useFileDialogs();
  const { openCreateDialog, openEditDialog, openDeleteDialog } = useFolderDialogs();

  const displayFolders = isSearching ? searchResults.folders : rootFolders;
  const displayFiles = isSearching ? searchResults.files : rootFiles;

  const handleUploadClick = () => openUploadDialog(null);
  const handleNewFolderClick = () => openCreateDialog(null, handleCreateFolder);

  const onEditClick = (e: React.MouseEvent, folder: IFolder) => {
    e.stopPropagation();
    openEditDialog(folder, (name) => handleUpdateFolder(name, folder));
  };

  const onDeleteClick = (e: React.MouseEvent, folder: IFolder) => {
    e.stopPropagation();
    openDeleteDialog(folder, () => handleDeleteFolder(folder));
  };

  const onCreateSubfolderClick = (e: React.MouseEvent, folder: IFolder) => {
    e.stopPropagation();
    openCreateDialog(folder, handleCreateFolder);
  };

  const hasFolders = displayFolders.length > 0;
  const hasFiles = displayFiles.length > 0;

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
          <Button variant="outline" onClick={handleUploadClick}>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
          <Button onClick={handleNewFolderClick}>
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
        {hasFolders && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Folders</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayFolders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onOpen={() => handleOpenFolder(folder)}
                  onEdit={(e) => onEditClick(e, folder)}
                  onDelete={(e) => onDeleteClick(e, folder)}
                  onCreateSubfolder={(e) => onCreateSubfolderClick(e, folder)}
                />
              ))}
            </div>
          </div>
        )}

        {hasFiles && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Files</h2>
            <FileList folderId={null} files={displayFiles} />
          </div>
        )}

        {!hasFolders && !hasFiles && (
          <EmptyState
            icon={Folder}
            title={isSearching ? "No results found" : "No folders or files yet"}
            description={isSearching ? `No folders or files match "${searchQuery}"` : "Create your first folder or upload a file to get started, or drag and drop here"}
            actionLabel="Create Folder"
            actionIcon={FolderPlus}
            onAction={handleNewFolderClick}
            enableFileDrop={!isSearching}
            onFileDrop={handleFileDrop}
            onFileDropError={handleFileDropError}
          />
        )}
      </div>
    </div>
  );
}
