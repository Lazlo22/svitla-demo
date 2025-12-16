import { Home, Folder, File } from 'lucide-react';
import { navigationRoutes } from './routes';

export const menuItems = [
  {
    title: navigationRoutes.home.name,
    url: `/${navigationRoutes.home.path}`,
    icon: Home,
  },
  {
    title: navigationRoutes.folders.name,
    url: `/${navigationRoutes.folders.path}`,
    icon: Folder,
  },
  {
    title: navigationRoutes.files.name,
    url: `/${navigationRoutes.files.path}`,
    icon: File,
  },
];
