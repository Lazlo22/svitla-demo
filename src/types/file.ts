import { ACCEPTED_FILE_MIME_TYPES } from '@constants/files';

export type AcceptedMimeType = typeof ACCEPTED_FILE_MIME_TYPES[number];

export interface IFile {
  id: string;
  name: string;
  folderId: string | null;
  type: AcceptedMimeType;
  size: number;
  content: string; // Base64 encoded PDF content
  createdAt: number;
  updatedAt: number;
}
