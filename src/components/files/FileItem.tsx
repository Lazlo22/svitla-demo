import { useNavigate } from 'react-router';
import { FileText, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@ui/button';
import { Badge } from '@ui/badge';
import type { IFile } from '@type/file';
import { fileSizeToMB, formatFileType } from '@lib/file';
import { isActivationKey } from '@lib/keyboard';

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
    if (isActivationKey(e)) {
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
        <FileText className="size-8 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge className="text-xs">{formatFileType(file.type)}</Badge>
            <span className="text-xs text-muted-foreground">
              {fileSizeToMB(file.size)} MB
            </span>
          </div>
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
