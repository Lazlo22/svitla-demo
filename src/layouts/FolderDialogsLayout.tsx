import { Outlet } from 'react-router';

import { FolderDialogsProvider } from '@context/FolderDialogsContext';

export default function FolderDialogsLayout() {
  return (
    <FolderDialogsProvider>
      <Outlet />
    </FolderDialogsProvider>
  );
}
