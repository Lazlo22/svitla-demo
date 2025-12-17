import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@ui/button';

export function FileNotFound() {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-2">File not found</h1>
        <p className="text-muted-foreground mb-4">The file you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/files')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Files
        </Button>
      </div>
    </div>
  );
}

FileNotFound.displayName = 'FileNotFound';
