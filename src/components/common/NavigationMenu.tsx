import { Link, useLocation } from 'react-router';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@ui/sidebar';
import { menuItems } from '@constants/navigation';

export default function NavigationMenu() {
  const location = useLocation();

  const isActiveSidebarItem = (url: string) => location.pathname === url;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-2">
          <Link to="/" className="text-xl font-bold text-gray-900 hover:text-gray-800">
            SV - Harvey - Demo
          </Link>
        </div>
      </SidebarHeader>
      <SidebarSeparator className='mx-0 mt-0.75' />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActiveSidebarItem(item.url)}
                  >
                    <Link 
                      to={item.url}
                      className='py-3 px-4'
                    >
                      <item.icon />
                      <span className="font-semibold">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

NavigationMenu.displayName = 'NavigationMenu';
