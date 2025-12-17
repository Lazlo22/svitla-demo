import { create } from 'zustand';
import { createJSONStorage } from 'zustand/middleware';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';

import type { IFile } from '@type/file';
import { FILES_STORAGE_KEY, FILES_STORE_NAME } from '@constants/storage';
import { ACCEPTED_FILE_MIME_TYPES } from '@constants/files';
import { composeMiddleware } from '@lib/storage';

interface FileState {
  files: IFile[];
  
  // Actions
  uploadFile: (file: File, folderId: string | null) => Promise<IFile>;
  updateFileName: (id: string, name: string) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
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
        if (!ACCEPTED_FILE_MIME_TYPES.includes(file.type as typeof ACCEPTED_FILE_MIME_TYPES[number])) {
          throw new Error('Only PDF files are supported');
        }

        // Convert file to base64
        const content = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        // Get existing files in the same folder
        const siblingFiles = get().getFilesByFolderId(folderId);
        const existingNames = new Set(siblingFiles.map((f: IFile) => {
          const nameWithoutExt = f.name.replace(/\.pdf$/i, '');
          return nameWithoutExt.toLowerCase();
        }));

        // Generate unique name
        const originalName = file.name.replace(/\.pdf$/i, '');
        let uniqueName = originalName;

        if (existingNames.has(originalName.toLowerCase())) {
          let counter = 1;
          while (existingNames.has(`${originalName} (${counter})`.toLowerCase())) {
            counter++;
          }
          uniqueName = `${originalName} (${counter})`;
        }

        const newFile: IFile = {
          id: crypto.randomUUID(),
          name: `${uniqueName}.pdf`,
          folderId,
          type: 'application/pdf',
          size: file.size,
          content,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => {
          state.files.push(newFile);
        });

        return newFile;
      },

      updateFileName: async (id: string, name: string) => {
        set((state) => {
          const file = state.files.find((f: IFile) => f.id === id);
          
          if (file) {
            // Ensure .pdf extension
            const newName = name.endsWith('.pdf') ? name : `${name}.pdf`;
            file.name = newName;
            file.updatedAt = Date.now();
          }
        });
      },

      deleteFile: async (id: string) => {
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
