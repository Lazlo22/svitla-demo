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
