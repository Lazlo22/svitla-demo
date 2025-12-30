import { create } from 'zustand';
import { createJSONStorage } from 'zustand/middleware';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';
import { useShallow } from 'zustand/react/shallow';

import type { IFile } from '@type/file';
import { FILES_STORAGE_KEY, FILES_STORE_NAME } from '@constants/storage';
import { composeMiddleware } from '@lib/storage';
import { removeFileExtension, isValidFileType, fileToBase64, generateFile } from '@lib/file';
import { generateUniqueName, getExistingNames } from '@lib/store';

interface FileState {
  files: IFile[];
  // Actions
  uploadFile: (file: File, folderId: string | null) => Promise<IFile>;
  uploadFiles: (files: File[], folderId: string | null) => Promise<IFile[]>;
  updateFileName: (id: string, name: string) => void;
  deleteFile: (id: string) => void;
  getFileById: (id: string) => IFile | undefined;
  getFilesByFolderId: (folderId: string | null) => IFile[];
}

const idbStorageAdapter = createJSONStorage<FileState>(() => ({
  getItem: async (name: string) => {
    const value = await idbGet(name);
    return value ?? null;
  },
  setItem: async (name: string, value: unknown) => {
    await idbSet(name, value);
  },
  removeItem: async (name: string) => {
    await idbDel(name);
  },
}));

const persistOptions = {
  name: FILES_STORAGE_KEY,
  storage: idbStorageAdapter,
};

const devToolsOptions = { name: FILES_STORE_NAME };

export const useFileStore = create<FileState>()(
  composeMiddleware<FileState>(
    (set, get) => ({
      files: [],
      uploadFile: async (file: File, folderId: string | null) => {
        // Validate file type
        if (!isValidFileType(file.type)) {
          throw new Error('Only PDF files are supported');
        }

        const content = await fileToBase64(file);

        const existingNames = getExistingNames(get().getFilesByFolderId(folderId), (f) => removeFileExtension(f.name));

        const originalName = removeFileExtension(file.name);
        const uniqueName = generateUniqueName(originalName, existingNames);

        const newFile = generateFile({
          name: uniqueName,
          folderId,
          size: file.size,
          content,
        });

        set((state) => {
          state.files.push(newFile);
        });

        return newFile;
      },
      uploadFiles: async (files: File[], folderId: string | null) => {
        const invalidFiles = files.filter(file => !isValidFileType(file.type));
        
        if (invalidFiles.length > 0) {
          const errorMessages = invalidFiles.map(f => `${f.name}: Only PDF files are supported`);
          
          throw new Error(errorMessages.join('\n'));
        }

        const uploadedFiles: IFile[] = [];
        const errors: string[] = [];

        const existingNames = getExistingNames(get().getFilesByFolderId(folderId), (f) => removeFileExtension(f.name));

        for (const file of files) {
          try {
            const content = await fileToBase64(file);

            const originalName = removeFileExtension(file.name);
            const uniqueName = generateUniqueName(originalName, existingNames);

            existingNames.add(uniqueName.toLowerCase());

            const newFile = generateFile({
              name: uniqueName,
              folderId,
              size: file.size,
              content,
            });

            uploadedFiles.push(newFile);
          } catch (err) {
            errors.push(`${file.name}: ${err instanceof Error ? err.message : 'Failed to upload'}`);
          }
        }

        if (errors.length > 0) {
          throw new Error(errors.join('\n'));
        }

        if (uploadedFiles.length > 0) {
          set((state) => {
            state.files.push(...uploadedFiles);
          });
        }

        return uploadedFiles;
      },
      updateFileName: (id: string, name: string) => {
        const file = get().getFileById(id);

        if (!file) return;

        const siblingFiles = get().getFilesByFolderId(file.folderId).filter((f: IFile) => f.id !== id);
        const existingNames = getExistingNames(siblingFiles, (f) => removeFileExtension(f.name));

        const nameWithoutExt = removeFileExtension(name);
        const uniqueName = generateUniqueName(nameWithoutExt, existingNames);

        set((state) => {
          const fileToUpdate = state.files.find((f: IFile) => f.id === id);
          
          if (fileToUpdate) {
            fileToUpdate.name = `${uniqueName}.pdf`;
            fileToUpdate.updatedAt = Date.now();
          }
        });
      },
      deleteFile: (id: string) => {
        set((state) => {
          state.files = state.files.filter((f: IFile) => f.id !== id);
        });
      },
      getFileById: (id: string) => {
        const state = get();
        
        return state.files.find(f => f.id === id);
      },
      getFilesByFolderId: (folderId: string | null) => {
        return get().files.filter(f => f.folderId === folderId);
      },
    }),
    persistOptions,
    devToolsOptions
  )
);

export const selectFiles = (state: FileState) => state.files;
export const selectFilesCount = (state: FileState) => state.files.length;
export const selectUploadFile = (state: FileState) => state.uploadFile;
export const selectUploadFiles = (state: FileState) => state.uploadFiles;
export const selectUpdateFileName = (state: FileState) => state.updateFileName;
export const selectDeleteFile = (state: FileState) => state.deleteFile;

export const useFileActions = () =>
  useFileStore(
    useShallow((state) => ({
      uploadFile: state.uploadFile,
      uploadFiles: state.uploadFiles,
      updateFileName: state.updateFileName,
      deleteFile: state.deleteFile,
    }))
  );
