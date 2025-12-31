import type { IFile } from '@type/file';

export const mockFile: IFile = {
    id: 'file-1',
    name: 'test-document.pdf',
    folderId: null,
    type: 'application/pdf',
    size: 1048576,
    content: 'data:application/pdf;base64,mockbase64content',
    createdAt: 1735636000000,
    updatedAt: 1735636000000,
};

// Based on useFileListOperations.test.ts
export const mockFiles: IFile[] = [
    {
        id: 'file-1',
        name: 'file1.pdf',
        folderId: null,
        type: 'application/pdf',
        size: 1024,
        content: 'base64',
        createdAt: 1735636000000,
        updatedAt: 1735636000000,
    },
    {
        id: 'file-2',
        name: 'file2.pdf',
        folderId: 'folder-1',
        type: 'application/pdf',
        size: 2048,
        content: 'base64',
        createdAt: 1735636000000,
        updatedAt: 1735636000000,
    },
    {
        id: 'file-3',
        name: 'file3.pdf',
        folderId: null,
        type: 'application/pdf',
        size: 512,
        content: 'base64',
        createdAt: 1735636000000,
        updatedAt: 1735636000000,
    },
];

export function createMockPdfFile(name: string): File {
    const blob = new Blob(['mock pdf content'], { type: 'application/pdf' });
    // @ts-ignore
    blob.lastModified = 1735636000000;
    // @ts-ignore - lastModifiedDate is deprecated but often tested
    blob.lastModifiedDate = new Date(1735636000000);

    return new File([blob], name, { type: 'application/pdf', lastModified: 1735636000000 });
}
