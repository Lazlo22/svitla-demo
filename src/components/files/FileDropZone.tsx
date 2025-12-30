import { forwardRef } from 'react';
import { Upload } from 'lucide-react';

import { Input } from '@ui/input';
import { cn } from '@lib/utils';
import { isActivationKey } from '@lib/keyboard';
import { ACCEPTED_FILE_TYPES } from '@constants/files';

interface FileDropZoneProps {
  isDragging: boolean;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FileDropZone = forwardRef<HTMLDivElement, FileDropZoneProps>(
  ({ isDragging, fileInputRef, onFileSelect }, ref) => {
    const handleClick = () => {
      fileInputRef.current?.click();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isActivationKey(e)) {
        e.preventDefault();
        fileInputRef.current?.click();
      }
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={0}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/5" : "hover:border-primary"
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
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
          onChange={onFileSelect}
          className="hidden"
          aria-hidden="true"
          multiple
        />
      </div>
    );
  }
);

FileDropZone.displayName = 'FileDropZone';
