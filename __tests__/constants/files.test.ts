import { describe, it, expect } from 'vitest';
import { ACCEPTED_FILE_TYPES, ACCEPTED_FILE_MIME_TYPES, FILE_TYPE_LABELS } from '@constants/files';

describe('File Constants', () => {
  describe('ACCEPTED_FILE_TYPES', () => {
    it('should be application/pdf', () => {
      expect(ACCEPTED_FILE_TYPES).toBe('application/pdf');
    });
  });

  describe('ACCEPTED_FILE_MIME_TYPES', () => {
    it('should contain only PDF mime type', () => {
      expect(ACCEPTED_FILE_MIME_TYPES).toEqual(['application/pdf']);
    });

    it('should be a readonly array', () => {
      expect(ACCEPTED_FILE_MIME_TYPES.length).toBe(1);
    });
  });

  describe('FILE_TYPE_LABELS', () => {
    it('should have PDF label for application/pdf', () => {
      expect(FILE_TYPE_LABELS['application/pdf']).toBe('PDF');
    });
  });
});
