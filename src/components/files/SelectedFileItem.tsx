import { X } from 'lucide-react';

import { Button } from '@ui/button';
import { Badge } from '@ui/badge';
import { fileSizeToMB, formatFileType } from '@lib/file';

interface SelectedFileItemProps {
  file: File;
  onRemove: () => void;
}

export function SelectedFileItem({ file, onRemove }: SelectedFileItemProps) {
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
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
      <Button variant="ghost" size="sm" onClick={onRemove}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

SelectedFileItem.displayName = 'SelectedFileItem';
