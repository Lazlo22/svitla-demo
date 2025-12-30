import { useState, useEffect } from 'react';

import { Button } from '@ui/button';
import { isEnterPress } from '@lib/keyboard';
import { removeFileExtension } from '@lib/file';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { Input } from '@ui/input';

interface FileRenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  onRename: (newName: string) => void;
}

export default function FileRenameDialog({ open, onOpenChange, fileName, onRename }: FileRenameDialogProps) {
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (open) {
      setNewName(removeFileExtension(fileName));
    }
  }, [open, fileName]);

  const handleRename = () => {
    if (newName.trim()) {
      onRename(newName.trim());
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isEnterPress(e)) {
      handleRename();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
          <DialogDescription>Enter a new name for this file</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              id="fileName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter file name"
              autoFocus
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={!newName.trim()}>
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
