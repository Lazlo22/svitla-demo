import { FileText, Upload } from 'lucide-react';

import { useSearch } from '@hooks/useSearch';
import { useFileListOperations } from '@hooks/useFileListOperations';
import { useFileDialogs } from '@context/FileDialogsContext';
import { Button } from '@ui/button';
import { FileItem } from '@components/files/FileItem';
import { SearchBar } from '@components/common/SearchBar';
import EmptyState from '@components/common/EmptyState';
import type { IFile } from '@/types/file';

export default function FilesPage() {
  const {
    files,
    dropError,
    setRenamingFile,
    setDeletingFile,
    handleFileDrop,
    handleFileDropError,
    handleRename,
    handleDelete,
  } = useFileListOperations(null);
  
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch();
  const { openUploadDialog, openRenameDialog, openDeleteDialog } = useFileDialogs();

  const displayFiles = isSearching ? searchResults.files : files;

  const handleUploadClick = () => openUploadDialog(null);

  const handleRenameClick = (file: IFile | null) => {
    if (file) {
      openRenameDialog(file, async (newName) => {
        setRenamingFile(file);
        await handleRename(newName);
      });
    }
  };

  const handleDeleteClick = (file: IFile | null) => {
    if (file) {
      openDeleteDialog(file, async () => {
        setDeletingFile(file);
        await handleDelete();
      });
    }
  };

  const isEmptyFileList = files.length === 0 && !isSearching;

  return (
    <div className="container mx-auto p-6 py-0 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">All Files</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your PDF files
          </p>
        </div>
        <Button onClick={handleUploadClick}>
          <Upload className="mr-2 h-4 w-4" />
          Upload File
        </Button>
      </div>

      {dropError && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-sm text-destructive">{dropError}</p>
        </div>
      )}

      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search files by name..."
        className="mb-6"
      />

      {isEmptyFileList ? (
        <EmptyState
          icon={FileText}
          title={isSearching ? "No results found" : "No files yet"}
          description={isSearching ? `No files match "${searchQuery}"` : "Upload your first PDF file to get started or drag and drop here"}
          actionLabel="Upload File"
          actionIcon={Upload}
          onAction={handleUploadClick}
          enableFileDrop={!isSearching}
          onFileDrop={handleFileDrop}
          onFileDropError={handleFileDropError}
        />
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">All Files ({displayFiles.length})</h2>
          <div className="space-y-1">
            {displayFiles.map((file) => (
              <FileItem
                key={file.id}
                file={file}
                onRename={handleRenameClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
