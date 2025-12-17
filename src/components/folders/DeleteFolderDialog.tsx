import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@ui/dialog';
import { Button } from '@ui/button';

interface DeleteFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleteFolder: () => void;
  folderName: string;
}

export default function DeleteFolderDialog({ 
  open, 
  onOpenChange, 
  onDeleteFolder,
  folderName 
}: DeleteFolderDialogProps) {
  const handleDelete = () => {
    onDeleteFolder();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Folder</DialogTitle>
          <DialogDescription className='mt-2'>
            Are you sure you want to delete "{folderName}"? This will also delete all nested folders and files inside it. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

DeleteFolderDialog.displayName = 'DeleteFolderDialog';
