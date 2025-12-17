import { useNavigate } from 'react-router';
import { FileText, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@ui/button';
import type { IFile } from '@type/file';
import { fileSizeToMB } from '@lib/file';

interface FileItemProps {
  file: IFile;
  onRename: (file: IFile) => void;
  onDelete: (file: IFile) => void;
}

export function FileItem({ file, onRename, onDelete }: FileItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/file/${file.id}`);
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRename(file);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div 
      role="button"
      tabIndex={0}
      className="group flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`View ${file.name}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <FileText className="size-6 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {fileSizeToMB(file.size)} MB
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleRenameClick}
          title="Rename"
        >
          <Pencil className="size-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          title="Delete"
        >
          <Trash2 className="size-5 text-destructive" />
        </Button>
      </div>
    </div>
  );
}

FileItem.displayName = 'FileItem';
