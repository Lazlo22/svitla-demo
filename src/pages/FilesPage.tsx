import { useState, lazy } from 'react';
import { FileText, Upload } from 'lucide-react';

import { useFileStore, selectFiles, useFileActions } from '@stores/fileStore';
import { useDisclosure } from '@hooks/useDisclosure';
import { useSearch } from '@hooks/useSearch';
import { Button } from '@ui/button';
import { FileItem } from '@components/files/FileItem';
import { SearchBar } from '@components/common/SearchBar';
import EmptyState from '@components/common/EmptyState';
import type { IFile } from '@type/file';

const FileUploadDialog = lazy(() => import('@components/files/FileUploadDialog').then(m => ({ default: m.FileUploadDialog })));
const FileRenameDialog = lazy(() => import('@components/files/FileRenameDialog').then(m => ({ default: m.FileRenameDialog })));
const FileDeleteDialog = lazy(() => import('@components/files/FileDeleteDialog').then(m => ({ default: m.FileDeleteDialog })));

export default function FilesPage() {
  const files = useFileStore(selectFiles);
  const { uploadFile, updateFileName, deleteFile } = useFileActions();
  
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch();
  const { isOpen: isUploadDialogOpen, onOpen: onUploadDialogOpen, onToggle: onUploadDialogToggle } = useDisclosure();
  
  const [renamingFile, setRenamingFile] = useState<IFile | null>(null);
  const [deletingFile, setDeletingFile] = useState<IFile | null>(null);
  const [dropError, setDropError] = useState<string>('');

  const displayFiles = isSearching ? searchResults.files : files;

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

  return (
    <div className="container mx-auto p-6 py-0 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">All Files</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your PDF files
          </p>
        </div>
        <Button onClick={onUploadDialogOpen}>
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

      {displayFiles.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={isSearching ? "No results found" : "No files yet"}
          description={isSearching ? `No files match "${searchQuery}"` : "Upload your first PDF file to get started or drag and drop here"}
          actionLabel="Upload File"
          actionIcon={Upload}
          onAction={onUploadDialogOpen}
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
                onRename={setRenamingFile}
                onDelete={setDeletingFile}
              />
            ))}
          </div>
        </div>
      )}

      <FileUploadDialog
        open={isUploadDialogOpen}
        onOpenChange={onUploadDialogToggle}
        folderId={null}
      />

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
    </div>
  );
}
