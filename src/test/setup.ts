import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
  mediaQueryListeners.clear();
});

// Mock window.matchMedia
export const mediaQueryListeners = new Set<(e?: MediaQueryListEvent) => void>();

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: window.innerWidth < 768,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((type, handler) => {
      if (type === 'change') mediaQueryListeners.add(handler);
    }),
    removeEventListener: vi.fn((type, handler) => {
      if (type === 'change') mediaQueryListeners.delete(handler);
    }),
    dispatchEvent: vi.fn(),
  })),
});

export const triggerMediaQueryChange = () => {
  mediaQueryListeners.forEach((listener) => {
    listener({
      matches: window.innerWidth < 768,
      media: '',
    } as MediaQueryListEvent);
  });
};

// Mock crypto.randomUUID
Object.defineProperty(globalThis, 'crypto', {
  value: {
    randomUUID: () => `test-uuid-${Math.random().toString(36).substring(7)}`,
  },
});

// Mock idb-keyval
vi.mock('idb-keyval', () => ({
  get: vi.fn().mockResolvedValue(null),
  set: vi.fn().mockResolvedValue(undefined),
  del: vi.fn().mockResolvedValue(undefined),
}));

export const mockNavigate = vi.fn();
export const mockParams = vi.fn().mockReturnValue({});

vi.mock('react-router', async () => {
  const actual = await vi.importActual<typeof import('react-router')>('react-router');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: mockParams,
  };
});
