import type { IFile } from '@type/file';
import type { IFolder } from '@type/folder';

export const mockFiles: IFile[] = [
    {
        id: '1',
        name: 'Document.pdf',
        folderId: null,
        type: 'application/pdf',
        size: 1024,
        content: 'base64content',
        createdAt: 1735636000000,
        updatedAt: 1735636000000,
    },
    {
        id: '2',
        name: 'Report.pdf',
        folderId: 'folder1',
        type: 'application/pdf',
        size: 2048,
        content: 'base64content',
        createdAt: 1735636000000,
        updatedAt: 1735636000000,
    },
    {
        id: '3',
        name: 'Invoice.pdf',
        folderId: null,
        type: 'application/pdf',
        size: 512,
        content: 'base64content',
        createdAt: 1735636000000,
        updatedAt: 1735636000000,
    },
];

export const mockFolders: IFolder[] = [
    {
        id: 'folder1',
        name: 'Documents',
        parentId: null,
        createdAt: 1735636000000,
        updatedAt: 1735636000000,
    },
    {
        id: 'folder2',
        name: 'Reports',
        parentId: null,
        createdAt: 1735636000000,
        updatedAt: 1735636000000,
    },
    {
        id: 'folder3',
        name: 'Invoices',
        parentId: 'folder1',
        createdAt: 1735636000000,
        updatedAt: 1735636000000,
    },
];
