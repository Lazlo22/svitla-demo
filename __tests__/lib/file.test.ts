import { describe, it, expect } from 'vitest';
import { fileSizeToMB } from '@lib/file';

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
