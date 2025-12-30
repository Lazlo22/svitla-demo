import { useParams } from 'react-router';
import { ArrowLeft, Download, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@ui/button';
import { Badge } from '@ui/badge';
import { useFileOperations } from '@hooks/useFileOperations';
import { useBackNavigation } from '@hooks/useBackNavigation';
import { useFileDialogs } from '@context/FileDialogsContext';
import { fileSizeToMB, formatFileType } from '@lib/file';
import { FileNotFound } from '@components/file/FileNotFound';
import { FileViewer } from '@components/file/FileViewer';

interface FilePageParams {
  id: string;
}

export default function FilePage() {
  const { id } = useParams<Readonly<FilePageParams>>();
  const { goBack } = useBackNavigation();
  
  const { file, renameFile, deleteFile, downloadFile } = useFileOperations(id);
  const { openRenameDialog, openDeleteDialog } = useFileDialogs();

  const handleRenameClick = () => {
    if (file) {
      openRenameDialog(file, renameFile);
    }
  };

  const handleDeleteClick = () => {
    if (file) {
      openDeleteDialog(file, deleteFile);
    }
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
                onClick={goBack}
                title="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold truncate max-w-[800px]">{file.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{formatFileType(file.type)}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {fileSizeToMB(file.size)} MB
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={downloadFile}
                title="Download"
              >
                <Download className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleRenameClick}
                title="Rename"
              >
                <Pencil className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDeleteClick}
                title="Delete"
              >
                <Trash2 className="h-5 w-5 text-destructive" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <FileViewer file={file} className="flex-1" />
    </div>
  );
}
