import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Download, Pencil, Trash2 } from 'lucide-react';
import { useState, lazy } from 'react';

import { Button } from '@ui/button';
import { useFileStore } from '@stores/fileStore';
import { fileSizeToMB } from '@lib/file';
import { FileNotFound } from '@components/file/FileNotFound';
import { FileViewer } from '@components/file/FileViewer';

const FileRenameDialog = lazy(() => import('@components/files/FileRenameDialog').then(m => ({ default: m.FileRenameDialog })));
const FileDeleteDialog = lazy(() => import('@components/files/FileDeleteDialog').then(m => ({ default: m.FileDeleteDialog })));

interface FilePageParams {
  id: string;
}

export default function FilePage() {
  const { id } = useParams<Readonly<FilePageParams>>();
  const navigate = useNavigate();
  
  const files = useFileStore((state) => state.files);
  const updateFileName = useFileStore((state) => state.updateFileName);
  const deleteFile = useFileStore((state) => state.deleteFile);
  
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const file = files.find(f => f.id === id);

  const handleRename = async (newName: string) => {
    if (!file) return;

    await updateFileName(file.id, newName);
  };

  const handleDelete = async () => {
    if (!file) return;

    await deleteFile(file.id);
    navigate('/files');
  };

  const handleDownload = () => {
    if (!file) return;

    const link = document.createElement('a');
    link.href = file.content;
    link.download = file.name;
    link.click();
  };

  if (!file) {
    return <FileNotFound />;
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="border-b bg-background">
        <div className="flex flex-col pb-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                title="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold truncate max-w-[800px]">{file.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {fileSizeToMB(file.size)} MB
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDownload}
                title="Download"
              >
                <Download className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowRenameDialog(true)}
                title="Rename"
              >
                <Pencil className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                title="Delete"
              >
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FileViewer file={file} className="flex-1" />

      <FileRenameDialog
        open={showRenameDialog}
        onOpenChange={setShowRenameDialog}
        fileName={file.name}
        onRename={handleRename}
      />

      <FileDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        fileName={file.name}
        onDelete={handleDelete}
      />
    </div>
  );
}
