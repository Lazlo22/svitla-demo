import { Folder, Edit, Trash2, FolderPlus } from 'lucide-react';

import { Button } from '@ui/button';
import type { IFolder as FolderType } from '@type/folder';

interface FolderCardProps {
  folder: FolderType;
  onOpen: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onCreateSubfolder: (e: React.MouseEvent) => void;
}

export function FolderCard({ 
  folder, 
  onOpen, 
  onEdit, 
  onDelete,
  onCreateSubfolder 
}: FolderCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-2">
        <Button
          variant="ghost"
          onClick={onOpen}
          className="flex items-center gap-3 flex-1 text-left group h-auto p-0 hover:bg-transparent"
        >
          <Folder className="size-8 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h3 className="font-medium truncate group-hover:text-primary">
              {folder.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {new Date(folder.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </Button>
        <div className="flex gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={onCreateSubfolder}
            title="Create subfolder"
          >
            <FolderPlus className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            title="Rename"
          >
            <Edit className="size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            title="Delete"
          >
            <Trash2 className="size-5 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}

FolderCard.displayName = 'FolderCard';
