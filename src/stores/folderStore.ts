import { create } from 'zustand';
import { createJSONStorage } from 'zustand/middleware';
import { get as idbGet, set as idbSet, del as idbDel } from 'idb-keyval';
import { useShallow } from 'zustand/react/shallow';

import type { IFolder } from '@type/folder';
import { FOLDERS_STORAGE_KEY, FOLDERS_STORE_NAME } from '@constants/storage';
import { composeMiddleware } from '@lib/storage';

interface FolderState {
  folders: IFolder[];
  
  // Actions
  createFolder: (name: string, parentId: string | null) => Promise<IFolder>;
  updateFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;
  getFolderById: (id: string) => IFolder | undefined;
  getFoldersByParentId: (parentId: string | null) => IFolder[];
  getFolderPath: (id: string) => IFolder[];
}

const idbStorageAdapter = createJSONStorage<FolderState>(() => ({
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
  name: FOLDERS_STORAGE_KEY,
  storage: idbStorageAdapter,
};

const devToolsOptions = { name: FOLDERS_STORE_NAME };

export const useFolderStore = create<FolderState>()(
  composeMiddleware<FolderState>(
    (set, get) => ({
        folders: [],

        createFolder: async (name: string, parentId: string | null) => {
          // Get all folders with the same parent
          const siblingFolders = get().getFoldersByParentId(parentId);
          const existingNames = new Set(siblingFolders.map((f: IFolder) => f.name.toLowerCase()));
          
          // Generate unique name (if we have folders with the same name we follow incremental pattern)
          let uniqueName = name;

          if (existingNames.has(name.toLowerCase())) {
            let counter = 1;

            while (existingNames.has(`${name} (${counter})`.toLowerCase())) {
              counter++;
            }

            uniqueName = `${name} (${counter})`;
          }

          const newFolder: IFolder = {
            id: crypto.randomUUID(),
            name: uniqueName,
            parentId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          set((state) => {
            state.folders.push(newFolder);
          });

          return newFolder;
        },

        updateFolder: async (id: string, name: string) => {
          const folder = get().getFolderById(id);
          if (!folder) return;

          // Get all folders with the same parent (excluding the current folder)
          const siblingFolders = get().getFoldersByParentId(folder.parentId).filter((f: IFolder) => f.id !== id);
          const existingNames = new Set(siblingFolders.map((f: IFolder) => f.name.toLowerCase()));
          
          // Generate unique name if needed
          let uniqueName = name;

          if (existingNames.has(name.toLowerCase())) {
            let counter = 1;
            while (existingNames.has(`${name} (${counter})`.toLowerCase())) {
              counter++;
            }
            uniqueName = `${name} (${counter})`;
          }

          set((state) => {
            const folderToUpdate = state.folders.find((f: IFolder) => f.id === id);
            
            if (folderToUpdate) {
              folderToUpdate.name = uniqueName;
              folderToUpdate.updatedAt = Date.now();
            }
          });
        },

        deleteFolder: async (id: string) => {
          const getAllChildIds = (parentId: string): string[] => {
            const state = get();
            const folders = Array.isArray(state.folders) ? state.folders : [];
            const children = folders.filter((f: IFolder) => f.parentId === parentId);

            return [
              parentId,
              ...children.flatMap(child => getAllChildIds(child.id))
            ];
          };

          const idsToDelete = getAllChildIds(id);
          
          set((state) => {
            const currentFolders = Array.isArray(state.folders) ? state.folders : [];
            
            state.folders = currentFolders.filter((f: IFolder) => !idsToDelete.includes(f.id));
          });
        },

        getFolderById: (id: string) => {
          const state = get();
          const folders = Array.isArray(state.folders) ? state.folders : [];
          
          return folders.find(f => f.id === id);
        },

        getFoldersByParentId: (parentId: string | null) => {
          const state = get();
          const folders = Array.isArray(state.folders) ? state.folders : [];
          
          return folders.filter(f => f.parentId === parentId);
        },

        getFolderPath: (id: string) => {
          const path: IFolder[] = [];
          let currentId: string | null = id;

          while (currentId) {
            const folder = get().getFolderById(currentId);

            if (!folder) break;
            
            path.unshift(folder);
            currentId = folder.parentId;
          }

          return path;
        },
    }),
    persistOptions,
    devToolsOptions
  )
);

export const selectFolders = (state: FolderState) => state.folders;
export const selectFoldersCount = (state: FolderState) => state.folders.length;
export const selectCreateFolder = (state: FolderState) => state.createFolder;
export const selectUpdateFolder = (state: FolderState) => state.updateFolder;
export const selectDeleteFolder = (state: FolderState) => state.deleteFolder;
export const selectGetFolderById = (state: FolderState) => state.getFolderById;
export const selectGetFoldersByParentId = (state: FolderState) =>
  state.getFoldersByParentId;
export const selectGetFolderPath = (state: FolderState) => state.getFolderPath;

export const useFolderActions = () =>
  useFolderStore(
    useShallow((state) => ({
      createFolder: state.createFolder,
      updateFolder: state.updateFolder,
      deleteFolder: state.deleteFolder,
    }))
  );

export const useFolderGetters = () =>
  useFolderStore(
    useShallow((state) => ({
      getFolderById: state.getFolderById,
      getFoldersByParentId: state.getFoldersByParentId,
      getFolderPath: state.getFolderPath,
    }))
  );
