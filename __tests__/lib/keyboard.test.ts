import { describe, it, expect } from 'vitest';
import { isEnterPress, isSpacePress, isActivationKey } from '@lib/keyboard';
import type { KeyboardEvent } from 'react';

describe('keyboard utilities', () => {
  describe('isEnterPress', () => {
    it('returns true for Enter key', () => {
      const event = { key: 'Enter' } as KeyboardEvent;
      expect(isEnterPress(event)).toBe(true);
    });

    it('returns false for other keys', () => {
      expect(isEnterPress({ key: ' ' } as KeyboardEvent)).toBe(false);
      expect(isEnterPress({ key: 'a' } as KeyboardEvent)).toBe(false);
      expect(isEnterPress({ key: 'Escape' } as KeyboardEvent)).toBe(false);
    });
  });

  describe('isSpacePress', () => {
    it('returns true for Space key', () => {
      const event = { key: ' ' } as KeyboardEvent;
      expect(isSpacePress(event)).toBe(true);
    });

    it('returns false for other keys', () => {
      expect(isSpacePress({ key: 'Enter' } as KeyboardEvent)).toBe(false);
      expect(isSpacePress({ key: 'a' } as KeyboardEvent)).toBe(false);
      expect(isSpacePress({ key: 'Tab' } as KeyboardEvent)).toBe(false);
    });
  });

  describe('isActivationKey', () => {
    it('returns true for Enter key', () => {
      const event = { key: 'Enter' } as KeyboardEvent;
      expect(isActivationKey(event)).toBe(true);
    });

    it('returns true for Space key', () => {
      const event = { key: ' ' } as KeyboardEvent;
      expect(isActivationKey(event)).toBe(true);
    });

    it('returns false for other keys', () => {
      expect(isActivationKey({ key: 'a' } as KeyboardEvent)).toBe(false);
      expect(isActivationKey({ key: 'Tab' } as KeyboardEvent)).toBe(false);
      expect(isActivationKey({ key: 'Escape' } as KeyboardEvent)).toBe(false);
    });
  });
});
