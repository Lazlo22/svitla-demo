import { useState } from 'react';

import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';
import { Input } from '@ui/input';

interface FileRenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  onRename: (newName: string) => Promise<void>;
}

export function FileRenameDialog({ open, onOpenChange, fileName, onRename }: FileRenameDialogProps) {
  const [newName, setNewName] = useState('');

  const handleRename = async () => {
    if (newName.trim()) {
      await onRename(newName.trim());
      onOpenChange(false);
      setNewName('');
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setNewName(fileName.replace(/\.pdf$/i, ''));
    } else {
      setNewName('');
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename File</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              id="fileName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter file name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleRename();
                }
              }}
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

FileRenameDialog.displayName = 'FileRenameDialog';
