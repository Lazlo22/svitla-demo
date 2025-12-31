import { describe, it, expect } from 'vitest';
import { 
  fileSizeToMB, 
  formatFileType, 
  isValidFileType, 
  removeFileExtension,
  generateFile 
} from '@lib/file';

describe('fileSizeToMB', () => {
  it('converts bytes to megabytes correctly', () => {
    expect(fileSizeToMB(1048576)).toBe('1.00'); // 1 MB
    expect(fileSizeToMB(2097152)).toBe('2.00'); // 2 MB
    expect(fileSizeToMB(524288)).toBe('0.50'); // 0.5 MB
  });

  it('handles small file sizes', () => {
    expect(fileSizeToMB(1024)).toBe('0.00'); // 1 KB
    expect(fileSizeToMB(102400)).toBe('0.10'); // 100 KB
  });

  it('handles large file sizes', () => {
    expect(fileSizeToMB(104857600)).toBe('100.00'); // 100 MB
    expect(fileSizeToMB(1073741824)).toBe('1024.00'); // 1 GB
  });

  it('handles zero bytes', () => {
    expect(fileSizeToMB(0)).toBe('0.00');
  });

  it('formats to 2 decimal places', () => {
    expect(fileSizeToMB(1500000)).toBe('1.43');
    expect(fileSizeToMB(3333333)).toBe('3.18');
  });
});

describe('formatFileType', () => {
  it('extracts and formats PDF type', () => {
    expect(formatFileType('application/pdf')).toBe('PDF');
  });

  it('handles different MIME types', () => {
    expect(formatFileType('image/png')).toBe('PNG');
    expect(formatFileType('image/jpeg')).toBe('JPEG');
    expect(formatFileType('text/plain')).toBe('PLAIN');
  });

  it('converts to uppercase', () => {
    expect(formatFileType('application/json')).toBe('JSON');
  });
});

describe('isValidFileType', () => {
  it('returns true for PDF files', () => {
    expect(isValidFileType('application/pdf')).toBe(true);
  });

  it('returns false for non-PDF files', () => {
    expect(isValidFileType('text/plain')).toBe(false);
    expect(isValidFileType('image/png')).toBe(false);
    expect(isValidFileType('application/json')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidFileType('')).toBe(false);
  });

  it('returns false for invalid MIME types', () => {
    expect(isValidFileType('invalid')).toBe(false);
    expect(isValidFileType('pdf')).toBe(false);
  });
});

describe('removeFileExtension', () => {
  it('removes .pdf extension', () => {
    expect(removeFileExtension('document.pdf')).toBe('document');
    expect(removeFileExtension('report.pdf')).toBe('report');
  });

  it('handles case-insensitive extension', () => {
    expect(removeFileExtension('file.PDF')).toBe('file');
    expect(removeFileExtension('file.Pdf')).toBe('file');
  });

  it('returns unchanged if no .pdf extension', () => {
    expect(removeFileExtension('document')).toBe('document');
    expect(removeFileExtension('file.txt')).toBe('file.txt');
  });

  it('handles multiple dots in filename', () => {
    expect(removeFileExtension('my.document.pdf')).toBe('my.document');
  });

  it('handles empty string', () => {
    expect(removeFileExtension('')).toBe('');
  });
});

describe('generateFile', () => {
  it('generates file with correct properties', () => {
    const file = generateFile({
      name: 'test',
      folderId: null,
      size: 1024,
      content: 'base64content',
    });

    expect(file.id).toBeDefined();
    expect(file.name).toBe('test.pdf');
    expect(file.folderId).toBeNull();
    expect(file.type).toBe('application/pdf');
    expect(file.size).toBe(1024);
    expect(file.content).toBe('base64content');
    expect(file.createdAt).toBeDefined();
    expect(file.updatedAt).toBeDefined();
  });

  it('generates file with folder ID', () => {
    const file = generateFile({
      name: 'test',
      folderId: 'folder-123',
      size: 2048,
      content: 'content',
    });

    expect(file.folderId).toBe('folder-123');
  });

  it('adds .pdf extension to name', () => {
    const file = generateFile({
      name: 'document',
      folderId: null,
      size: 1024,
      content: 'content',
    });

    expect(file.name).toBe('document.pdf');
  });

  it('generates unique IDs for different files', () => {
    const file1 = generateFile({
      name: 'test1',
      folderId: null,
      size: 1024,
      content: 'content1',
    });

    const file2 = generateFile({
      name: 'test2',
      folderId: null,
      size: 1024,
      content: 'content2',
    });

    expect(file1.id).not.toBe(file2.id);
  });

  it('sets createdAt and updatedAt timestamps', () => {
    const before = Date.now();
    const file = generateFile({
      name: 'test',
      folderId: null,
      size: 1024,
      content: 'content',
    });
    const after = Date.now();

    expect(file.createdAt).toBeGreaterThanOrEqual(before);
    expect(file.createdAt).toBeLessThanOrEqual(after);
    expect(file.updatedAt).toBeGreaterThanOrEqual(before);
    expect(file.updatedAt).toBeLessThanOrEqual(after);
  });
});
