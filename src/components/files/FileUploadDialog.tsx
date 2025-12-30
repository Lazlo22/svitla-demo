import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

import { Button } from '@ui/button';
import { Badge } from '@ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { Input } from '@ui/input';
import { useFileStore, selectUploadFiles } from '@stores/fileStore';
import { ACCEPTED_FILE_TYPES, ACCEPTED_FILE_MIME_TYPES } from '@constants/files';
import { fileSizeToMB, formatFileType } from '@lib/file';
import { useFileDrop } from '@hooks/use-file-drop';
import { cn } from '@lib/utils';

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string | null;
}

export function FileUploadDialog({ open, onOpenChange, folderId }: FileUploadDialogProps) {
  const uploadFiles = useFileStore(selectUploadFiles);
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileDrop = (files: File[]) => {
    setError('');
    setSelectedFiles(files);
  };

  const handleDropError = (errorMessage: string) => {
    setError(errorMessage);
    setSelectedFiles([]);
  };

  const { isDragging, dropRef } = useFileDrop({
    onDrop: handleFileDrop,
    accept: ACCEPTED_FILE_MIME_TYPES as unknown as string[],
    onError: handleDropError,
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    setError('');
    
    if (files.length > 0) {
      const invalidFiles = files.filter(file => 
        !ACCEPTED_FILE_MIME_TYPES.includes(file.type as typeof ACCEPTED_FILE_MIME_TYPES[number])
      );
      
      if (invalidFiles.length > 0) {
        setError('Only PDF files are supported');
        setSelectedFiles([]);
        return;
      }
      setSelectedFiles(files);
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

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClickUploadArea = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDownUploadArea = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <div
            ref={dropRef}
            role="button"
            tabIndex={0}
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
              isDragging 
                ? "border-primary bg-primary/5" 
                : "hover:border-primary"
            )}
            onClick={handleClickUploadArea}
            onKeyDown={handleKeyDownUploadArea}
            aria-label="Click to select PDF files or drag and drop"
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              {isDragging ? 'Drop PDF files here' : 'Click to select or drag and drop PDF files'}
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              onChange={handleFileSelect}
              className="hidden"
              aria-hidden="true"
              multiple
            />
          </div>

          {selectedFiles.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1 max-w-full">
                    <p className="text-sm font-medium" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="text-xs">{formatFileType(file.type)}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {fileSizeToMB(file.size)} MB
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : null}

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

FileUploadDialog.displayName = 'FileUploadDialog';
