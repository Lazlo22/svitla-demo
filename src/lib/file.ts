/**
 * Convert file size in bytes to megabytes
 * @param sizeInBytes - File size in bytes
 * @returns Size in MB formatted to 2 decimal places
 */
export function fileSizeToMB(sizeInBytes: number): string {
  return (sizeInBytes / 1024 / 1024).toFixed(2);
}
