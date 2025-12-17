import { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';

import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { Input } from '@ui/input';
import { useFileStore } from '@stores/fileStore';
import { ACCEPTED_FILE_TYPES, ACCEPTED_FILE_MIME_TYPES } from '@constants/files';
import { fileSizeToMB } from '@lib/file';

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folderId: string | null;
}

export function FileUploadDialog({ open, onOpenChange, folderId }: FileUploadDialogProps) {
  const uploadFile = useFileStore((state) => state.uploadFile);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    setError('');
    
    if (file) {
      if (!ACCEPTED_FILE_MIME_TYPES.includes(file.type as typeof ACCEPTED_FILE_MIME_TYPES[number])) {
        setError('Only PDF files are supported');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError('');

    try {
      await uploadFile(selectedFile, folderId);
      setSelectedFile(null);
      onOpenChange(false);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
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

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload PDF File</DialogTitle>
          <DialogDescription>
            Select a PDF file to upload to this folder
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div
            role="button"
            tabIndex={0}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={handleClickUploadArea}
            onKeyDown={handleKeyDownUploadArea}
            aria-label="Click to select a PDF file"
          >
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Click to select a PDF file
            </p>
            <Input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              onChange={handleFileSelect}
              className="hidden"
              aria-hidden="true"
            />
          </div>

          {selectedFile ? (
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex-1 max-w-full">
                <p className="text-sm font-medium" title={selectedFile.name}>
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fileSizeToMB(selectedFile.size)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : null}

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={!selectedFile || isUploading}>
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

FileUploadDialog.displayName = 'FileUploadDialog';
