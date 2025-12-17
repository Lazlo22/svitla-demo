import { describe, it, expect } from 'vitest';
import { menuItems } from '@constants/navigation';

describe('Navigation Constants', () => {
  describe('menuItems', () => {
    it('should have 3 menu items', () => {
      expect(menuItems).toHaveLength(3);
    });

    it('should have Home as first item', () => {
      expect(menuItems[0].title).toBe('Home');
      expect(menuItems[0].url).toBe('/');
    });

    it('should have Folders as second item', () => {
      expect(menuItems[1].title).toBe('Folders');
      expect(menuItems[1].url).toBe('/folders');
    });

    it('should have Files as third item', () => {
      expect(menuItems[2].title).toBe('Files');
      expect(menuItems[2].url).toBe('/files');
    });

    it('should have icons for all items', () => {
      menuItems.forEach((item) => {
        expect(item.icon).toBeDefined();
        // Lucide icons are ForwardRef objects
        expect(item.icon).toHaveProperty('$$typeof');
      });
    });
  });
});
