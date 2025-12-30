import { useParams } from 'react-router';
import { FolderPlus, Upload } from 'lucide-react';

import { useFolderOperations } from '@hooks/useFolderOperations';
import { useFileListOperations } from '@hooks/useFileListOperations';
import { useSearch } from '@hooks/useSearch';
import { useFileDialogs } from '@context/FileDialogsContext';
import { useFolderDialogs } from '@context/FolderDialogsContext';
import { Button } from '@ui/button';
import { FolderCard } from '@components/folders/FolderCard';
import { FolderBreadcrumb } from '@components/folder/FolderBreadcrumb';
import { FolderNotFound } from '@components/folder/FolderNotFound';
import { FileList } from '@components/files/FileList';
import { SearchBar } from '@components/common/SearchBar';
import EmptyState from '@components/common/EmptyState';
import type { IFolder } from '@type/folder';

export default function FolderPage() {
  const params = useParams();

  const folderId = params['*'] || '';
  
  const {
    currentFolder,
    subfolders,
    breadcrumbs,
    handleCreateFolder,
    handleUpdateFolder,
    handleDeleteFolder,
    handleOpenFolder,
    navigateToFolder,
  } = useFolderOperations(folderId);

  const {
    folderFiles: files,
    dropError,
    handleFileDrop,
    handleFileDropError,
  } = useFileListOperations(folderId);

  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch();
  const { openUploadDialog } = useFileDialogs();
  const { openCreateDialog, openEditDialog, openDeleteDialog } = useFolderDialogs();

  const displayFolders = isSearching ? searchResults.folders.filter(f => f.parentId === folderId) : subfolders;
  const displayFiles = isSearching ? searchResults.files.filter(f => f.folderId === folderId) : files;

  const handleUploadClick = () => openUploadDialog(folderId);
  const handleNewSubfolderClick = () => openCreateDialog(currentFolder, handleCreateFolder);

  const onEditClick = (e: React.MouseEvent, folder: IFolder) => {
    e.stopPropagation();
    openEditDialog(folder, (name) => handleUpdateFolder(name, folder));
  };

  const onDeleteClick = (e: React.MouseEvent, folder: IFolder) => {
    e.stopPropagation();
    openDeleteDialog(folder, () => handleDeleteFolder(folder));
  };

  const hasFiles = displayFiles.length > 0;
  const hasFolders = displayFolders.length > 0;

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
          <Button variant="outline" onClick={handleUploadClick}>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
          <Button onClick={handleNewSubfolderClick}>
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
        {hasFolders && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Subfolders</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {displayFolders.map((folder) => (
                <FolderCard
                  key={folder.id}
                  folder={folder}
                  onOpen={() => handleOpenFolder(folder)}
                  onEdit={(e) => onEditClick(e, folder)}
                  onDelete={(e) => onDeleteClick(e, folder)}
                  onCreateSubfolder={(e) => navigateToFolder(e, folder)}
                />
              ))}
            </div>
          </div>
        )}

        {hasFiles && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Files</h2>
            <FileList folderId={folderId} files={displayFiles} />
          </div>
        )}

        {!hasFolders && !hasFiles && (
          <EmptyState
            icon={FolderPlus}
            title={isSearching ? "No results found" : "This folder is empty"}
            description={isSearching ? `No folders or files match "${searchQuery}"` : "Create a subfolder or upload (drag and drop) a file to get started"}
            actionLabel="Create Subfolder"
            actionIcon={FolderPlus}
            onAction={handleNewSubfolderClick}
            enableFileDrop={!isSearching}
            onFileDrop={handleFileDrop}
            onFileDropError={handleFileDropError}
          />
        )}
      </div>
    </div>
  );
}
