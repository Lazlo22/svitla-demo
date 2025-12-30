import { lazy } from 'react';
import { createBrowserRouter } from 'react-router';

// Lazy load all components
const RootLayout = lazy(() => import('@layouts/RootLayout'));
const DndLayout = lazy(() => import('@layouts/DndLayout'));
const FileDialogsLayout = lazy(() => import('@layouts/FileDialogsLayout'));
const FolderDialogsLayout = lazy(() => import('@layouts/FolderDialogsLayout'));
const ErrorPage = lazy(() => import('@pages/ErrorPage'));
const HomePage = lazy(() => import('@pages/HomePage'));
const FoldersPage = lazy(() => import('@pages/FoldersPage'));
const FilesPage = lazy(() => import('@pages/FilesPage'));
const FolderPage = lazy(() => import('@pages/FolderPage'));
const FilePage = lazy(() => import('@pages/FilePage'));

export const navigationRoutes = {
  home: {
    path: '',
    name: 'Home',
  },
  folders: {
    path: 'folders',
    name: 'Folders',
  },
  files: {
    path: 'files',
    name: 'Files',
  },
  folder: {
    path: 'folder/*',
    name: 'Folder',
  },
  file: {
    path: 'file/:id',
    name: 'File',
  },
  error: {
    path: '*',
    name: 'Error',
  },
} as const;

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        id: navigationRoutes.home.name,
        element: <HomePage />,
      },
      {
        element: <DndLayout />,
        children: [
          {
            element: <FileDialogsLayout />,
            children: [
              {
                path: navigationRoutes.file.path,
                id: navigationRoutes.file.name,
                element: <FilePage />,
              },
              {
                path: navigationRoutes.files.path,
                id: navigationRoutes.files.name,
                element: <FilesPage />,
              },
              {
                element: <FolderDialogsLayout />,
                children: [
                  {
                    path: navigationRoutes.folders.path,
                    id: navigationRoutes.folders.name,
                    element: <FoldersPage />,
                  },
                  {
                    path: navigationRoutes.folder.path,
                    id: navigationRoutes.folder.name,
                    element: <FolderPage />,
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: navigationRoutes.error.path,
        id: navigationRoutes.error.name,
        element: <ErrorPage />,
      },
    ],
  },
]);
