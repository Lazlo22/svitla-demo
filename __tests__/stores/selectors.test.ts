import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from '@testing-library/react';
import {
  useFolderStore,
  selectFolders,
  selectFoldersCount,
  selectCreateFolder,
  selectUpdateFolder,
  selectDeleteFolder,
  selectGetFolderById,
  selectGetFoldersByParentId,
  selectGetFolderPath,
} from '@stores/folderStore';
import {
  useFileStore,
  selectFiles,
  selectFilesCount,
  selectUploadFile,
  selectUpdateFileName,
  selectDeleteFile,
} from '@stores/fileStore';

describe('Folder Store Selectors', () => {
  beforeEach(() => {
    act(() => {
      useFolderStore.setState({ folders: [] });
    });
  });

  it('selectFolders returns folders array', async () => {
    const store = useFolderStore.getState();
    await store.createFolder('Test', null);
    
    const folders = selectFolders(useFolderStore.getState());
    
    expect(folders).toHaveLength(1);
    expect(folders[0].name).toBe('Test');
  });

  it('selectFoldersCount returns correct count', async () => {
    const store = useFolderStore.getState();
    await store.createFolder('Folder 1', null);
    await store.createFolder('Folder 2', null);
    
    const count = selectFoldersCount(useFolderStore.getState());
    
    expect(count).toBe(2);
  });

  it('selectCreateFolder returns createFolder function', () => {
    const createFolder = selectCreateFolder(useFolderStore.getState());
    
    expect(typeof createFolder).toBe('function');
  });

  it('selectUpdateFolder returns updateFolder function', () => {
    const updateFolder = selectUpdateFolder(useFolderStore.getState());
    
    expect(typeof updateFolder).toBe('function');
  });

  it('selectDeleteFolder returns deleteFolder function', () => {
    const deleteFolder = selectDeleteFolder(useFolderStore.getState());
    
    expect(typeof deleteFolder).toBe('function');
  });

  it('selectGetFolderById returns getFolderById function', () => {
    const getFolderById = selectGetFolderById(useFolderStore.getState());
    
    expect(typeof getFolderById).toBe('function');
  });

  it('selectGetFoldersByParentId returns getFoldersByParentId function', () => {
    const getFoldersByParentId = selectGetFoldersByParentId(useFolderStore.getState());
    
    expect(typeof getFoldersByParentId).toBe('function');
  });

  it('selectGetFolderPath returns getFolderPath function', () => {
    const getFolderPath = selectGetFolderPath(useFolderStore.getState());
    
    expect(typeof getFolderPath).toBe('function');
  });
});

describe('File Store Selectors', () => {
  beforeEach(() => {
    act(() => {
      useFileStore.setState({ files: [] });
    });
  });

  it('selectFiles returns files array', () => {
    act(() => {
      useFileStore.setState({
        files: [{
          id: 'file-1',
          name: 'test.pdf',
          folderId: null,
          type: 'application/pdf',
          size: 1024,
          content: 'base64',
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }],
      });
    });
    
    const files = selectFiles(useFileStore.getState());
    
    expect(files).toHaveLength(1);
    expect(files[0].name).toBe('test.pdf');
  });

  it('selectFilesCount returns correct count', () => {
    act(() => {
      useFileStore.setState({
        files: [
          { id: '1', name: 'a.pdf', folderId: null, type: 'application/pdf', size: 100, content: '', createdAt: 0, updatedAt: 0 },
          { id: '2', name: 'b.pdf', folderId: null, type: 'application/pdf', size: 100, content: '', createdAt: 0, updatedAt: 0 },
        ],
      });
    });
    
    const count = selectFilesCount(useFileStore.getState());
    
    expect(count).toBe(2);
  });

  it('selectUploadFile returns uploadFile function', () => {
    const uploadFile = selectUploadFile(useFileStore.getState());
    
    expect(typeof uploadFile).toBe('function');
  });

  it('selectUpdateFileName returns updateFileName function', () => {
    const updateFileName = selectUpdateFileName(useFileStore.getState());
    
    expect(typeof updateFileName).toBe('function');
  });

  it('selectDeleteFile returns deleteFile function', () => {
    const deleteFile = selectDeleteFile(useFileStore.getState());
    
    expect(typeof deleteFile).toBe('function');
  });
});
