import { Outlet } from 'react-router';

import { SidebarProvider, SidebarInset, SidebarTrigger } from '@ui/sidebar';
import NavigationMenu from '@components/common/NavigationMenu';

export default function RootLayout() {
  return (
    <SidebarProvider>
      <NavigationMenu />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className='cursor-pointer' />
        </header>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};
