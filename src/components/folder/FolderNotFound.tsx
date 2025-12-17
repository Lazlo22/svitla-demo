import { useNavigate } from 'react-router';

import { Button } from '@ui/button';

export function FolderNotFound() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 py-0 max-w-6xl">
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Folder not found</h2>
        <p className="text-muted-foreground mb-4">
          The folder you're looking for doesn't exist
        </p>
        <Button onClick={() => navigate('/folders')}>Go to Folders</Button>
      </div>
    </div>
  );
}

FolderNotFound.displayName = 'FolderNotFound';
