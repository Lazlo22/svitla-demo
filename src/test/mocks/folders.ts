import type { IFolder } from '@type/folder';

export const mockFolder: IFolder = {
    id: 'folder-1',
    name: 'Test Folder',
    parentId: null,
    createdAt: 1735636000000,
    updatedAt: 1735636000000,
};

export const mockSubfolder: IFolder = {
    id: 'subfolder-1',
    name: 'Subfolder',
    parentId: 'folder-1',
    createdAt: 1735636000000,
    updatedAt: 1735636000000,
};

export const mockFolders: IFolder[] = [
    {
        id: 'folder-1',
        name: 'Root Folder',
        parentId: null,
        createdAt: 1735636000000,
        updatedAt: 1735636000000,
    },
    {
        id: 'folder-2',
        name: 'Subfolder',
        parentId: 'folder-1',
        createdAt: 1735636000000,
        updatedAt: 1735636000000,
    },
    {
        id: 'folder-3',
        name: 'Another Root',
        parentId: null,
        createdAt: 1735636000000,
        updatedAt: 1735636000000,
    },
];
