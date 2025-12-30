import { ACCEPTED_FILE_MIME_TYPES } from '@constants/files';
import type { AcceptedMimeType, IFile } from '@type/file';

/**
 * Convert file to base64 data URL
 * @param file - File to convert
 * @returns Promise resolving to base64 data URL string
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Convert file size in bytes to megabytes
 * @param sizeInBytes - File size in bytes
 * @returns Size in MB formatted to 2 decimal places
 */
export function fileSizeToMB(sizeInBytes: number): string {
  return (sizeInBytes / 1024 / 1024).toFixed(2);
}

/**
 * Extract and format file type from MIME type
 * @param mimeType - Full MIME type (e.g., "application/pdf")
 * @returns Formatted file extension in uppercase (e.g., "PDF")
 */
export function formatFileType(mimeType: string): string {
  const parts = mimeType.split('/');
  const extension = parts[parts.length - 1];
  return extension.toUpperCase();
}

/**
 * Check if a file has a valid/accepted MIME type
 * @param mimeType - MIME type to validate
 * @returns true if the MIME type is accepted
 */
export function isValidFileType(mimeType: string): mimeType is AcceptedMimeType {
  return ACCEPTED_FILE_MIME_TYPES.includes(mimeType as AcceptedMimeType);
}


/**
 * Remove .pdf extension from filename
 * @param fileName - File name with or without .pdf extension
 * @returns File name without .pdf extension
 */
export function removeFileExtension(fileName: string): string {
  return fileName.replace(/\.pdf$/i, '');
}

interface GenerateFileParams {
  name: string;
  folderId: string | null;
  size: number;
  content: string;
}

/**
 * Generate a new IFile object
 */
export function generateFile({ name, folderId, size, content }: GenerateFileParams): IFile {
  return {
    id: crypto.randomUUID(),
    name: `${name}.pdf`,
    folderId,
    type: 'application/pdf',
    size,
    content,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}