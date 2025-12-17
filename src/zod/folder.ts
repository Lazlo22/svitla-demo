import { z } from 'zod';

export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, 'Folder name is required')
    .max(255, 'Folder name must be less than 255 characters')
    .regex(/^[^/\\:*?"<>|]+$/, 'Folder name contains invalid characters'),
});

export const editFolderSchema = z.object({
  name: z
    .string()
    .min(1, 'Folder name is required')
    .max(255, 'Folder name must be less than 255 characters')
    .regex(/^[^/\\:*?"<>|]+$/, 'Folder name contains invalid characters'),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;
export type EditFolderInput = z.infer<typeof editFolderSchema>;
