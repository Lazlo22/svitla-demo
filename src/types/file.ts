export interface IFile {
  id: string;
  name: string;
  folderId: string | null;
  type: 'application/pdf';
  size: number;
  content: string; // Base64 encoded PDF content
  createdAt: number;
  updatedAt: number;
}
