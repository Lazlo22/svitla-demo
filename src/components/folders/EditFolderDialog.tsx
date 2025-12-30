import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@ui/dialog';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@ui/form';
import { editFolderSchema, type EditFolderInput } from '@zod/folder';

interface EditFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateFolder: (name: string) => void;
  currentName: string;
}

export default function EditFolderDialog({ 
  open, 
  onOpenChange, 
  onUpdateFolder,
  currentName 
}: EditFolderDialogProps) {
  const form = useForm<EditFolderInput>({
    resolver: zodResolver(editFolderSchema),
    defaultValues: {
      name: currentName,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({ name: currentName });
    }
  }, [currentName, open, form]);

  const onSubmit = (data: EditFolderInput) => {
    if (data.name !== currentName) {
      onUpdateFolder(data.name);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename Folder</DialogTitle>
          <DialogDescription>Enter a new name for this folder</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 pb-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter folder name" {...field} autoFocus />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={form.formState.isSubmitting || form.watch('name') === currentName}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

EditFolderDialog.displayName = 'EditFolderDialog';
