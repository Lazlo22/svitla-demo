import { Outlet } from 'react-router';

import { FileDialogsProvider } from '@context/FileDialogsContext';

export default function FileDialogsLayout() {
  return (
    <FileDialogsProvider>
      <Outlet />
    </FileDialogsProvider>
  );
}
