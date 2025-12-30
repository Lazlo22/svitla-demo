import React from 'react';
import { Home } from 'lucide-react';
import { useNavigate } from 'react-router';

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@ui/breadcrumb';
import { Button } from '@ui/button';
import type { IFolder as Folder } from '@type/folder';

interface FolderBreadcrumbProps {
  breadcrumbs: Folder[];
}

export function FolderBreadcrumb({ breadcrumbs }: FolderBreadcrumbProps) {
  const navigate = useNavigate();

  return (
    <Breadcrumb className="mb-6">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Button
              variant="ghost"
              onClick={() => navigate('/folders')}
              className="flex items-center gap-1 h-auto !p-0 hover:bg-transparent"
            >
              <Home className="h-4 w-4" />
              Folders
            </Button>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {breadcrumbs.map((folder, index) => (
          <React.Fragment key={folder.id}>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {index === breadcrumbs.length - 1 ? (
                <BreadcrumbPage>{folder.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/folder/${folder.id}`)}
                    className="h-auto p-0 hover:bg-transparent"
                  >
                    {folder.name}
                  </Button>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

FolderBreadcrumb.displayName = 'FolderBreadcrumb';
