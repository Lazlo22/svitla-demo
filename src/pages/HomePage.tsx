import { useNavigate } from 'react-router';
import { Folder, FileText, Upload, FolderPlus } from 'lucide-react';

import { useFolderStore, selectFoldersCount } from '@stores/folderStore';
import { useFileStore, selectFilesCount } from '@stores/fileStore';
import { Button } from '@ui/button';
import { navigationRoutes } from '@constants/routes';

export default function HomePage() {
  const navigate = useNavigate();

  const foldersCount = useFolderStore(selectFoldersCount);
  const filesCount = useFileStore(selectFilesCount);

  const stats = [
    {
      title: 'Total Folders',
      value: foldersCount,
      icon: Folder,
      link: `/${navigationRoutes.folders.path}`,
    },
    {
      title: 'Total Files',
      value: filesCount,
      icon: FileText,
      link: `/${navigationRoutes.files.path}`,
    },
  ];

  return (
    <div className="container mx-auto p-6 py-0 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome to SV - Harvey - Demo</h1>
        <p className="text-muted-foreground text-lg">
          Organize and manage your PDF files with ease
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              onClick={() => navigate(stat.link)}
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <Icon className="h-8 w-8 text-foreground" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {foldersCount === 0 && filesCount === 0 && (
        <div className="bg-muted/50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold mb-2">Get Started</h3>
          <p className="text-muted-foreground mb-6">
            You haven't created any folders or uploaded any files yet. Start by creating a folder or uploading your first PDF file.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate(`/${navigationRoutes.folders.path}`)}>
              <FolderPlus className="mr-2 h-4 w-4" />
              Create Folder
            </Button>
            <Button variant="outline" onClick={() => navigate(`/${navigationRoutes.files.path}`)}>
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
