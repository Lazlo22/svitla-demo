import type { IFolder } from '@type/folder';

interface GenerateFolderParams {
  name: string;
  parentId: string | null;
}

/**
 * Generate a new IFolder object
 */
export function generateFolder({ name, parentId }: GenerateFolderParams): IFolder {
  return {
    id: crypto.randomUUID(),
    name,
    parentId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
