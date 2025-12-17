import { Button } from '@ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@ui/dialog';

interface FileDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  onDelete: () => Promise<void>;
}

export function FileDeleteDialog({ open, onOpenChange, fileName, onDelete }: FileDeleteDialogProps) {
  const handleDelete = async () => {
    await onDelete();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete File</DialogTitle>
          <DialogDescription className='mt-2'>
            Are you sure you want to delete "{fileName}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

FileDeleteDialog.displayName = 'FileDeleteDialog';
