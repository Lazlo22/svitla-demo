import { useState, useRef } from 'react';

import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { useFileStore, selectUploadFiles } from '@stores/fileStore';
import { useFileDrop } from '@hooks/useFileDrop';
import { isValidFileType } from '@lib/file';
import { ACCEPTED_FILE_MIME_TYPES } from '@constants/files';
import { FileDropZone } from './FileDropZone';
import { SelectedFileItem } from './SelectedFileItem';

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string | null;
}

export default function FileUploadDialog({ open, onOpenChange, folderId }: FileUploadDialogProps) {
  const uploadFiles = useFileStore(selectUploadFiles);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isDragging, dropRef } = useFileDrop({
    onDrop: (files) => {
      setError('');
      setSelectedFiles(files);
    },
    accept: ACCEPTED_FILE_MIME_TYPES as unknown as string[],
    onError: (errorMessage) => {
      setError(errorMessage);
      setSelectedFiles([]);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setError('');
    
    if (files.length > 0) {
      const invalidFiles = files.filter(file => !isValidFileType(file.type));
      
      if (invalidFiles.length > 0) {
        setError('Only PDF files are supported');
        setSelectedFiles([]);
        return;
      }
      setSelectedFiles(files);
    }
  };

  const resetInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setError('');

    try {
      await uploadFiles(selectedFiles, folderId);
      setSelectedFiles([]);
      onOpenChange(false);
      resetInput();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFiles([]);
    setError('');
    onOpenChange(false);
    resetInput();
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    resetInput();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF Files</DialogTitle>
          <DialogDescription>
            Select one or more PDF files to upload to this folder
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <FileDropZone
            ref={dropRef}
            isDragging={isDragging}
            fileInputRef={fileInputRef}
            onFileSelect={handleFileSelect}
          />
          {selectedFiles.length > 0 && (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <SelectedFileItem
                  key={index}
                  file={file}
                  onRemove={() => handleRemoveFile(index)}
                />
              ))}
            </div>
          )}
          {error && (
            <p className="text-sm text-destructive whitespace-pre-line">{error}</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={selectedFiles.length === 0 || isUploading}>
            {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
