import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '@hooks/useMobile';

describe('useIsMobile', () => {
  const originalInnerWidth = window.innerWidth;
  let mediaQueryListeners: Array<() => void> = [];

  beforeEach(() => {
    mediaQueryListeners = [];
    
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: window.innerWidth < 768,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn((_, handler) => {
          mediaQueryListeners.push(handler);
        }),
        removeEventListener: vi.fn((_, handler) => {
          mediaQueryListeners = mediaQueryListeners.filter(h => h !== handler);
        }),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  afterEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: originalInnerWidth,
    });
  });

  it('returns false for desktop width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });
    
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true for mobile width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 500,
    });
    
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('returns false at exactly 768px (breakpoint)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 768,
    });
    
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('returns true at 767px (just below breakpoint)', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 767,
    });
    
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('updates when window is resized', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });
    
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
    
    // Simulate resize to mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 500,
    });
    
    act(() => {
      mediaQueryListeners.forEach(listener => listener());
    });
    
    expect(result.current).toBe(true);
  });

  it('cleans up event listener on unmount', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      value: 1024,
    });
    
    const { unmount } = renderHook(() => useIsMobile());
    
    expect(mediaQueryListeners.length).toBe(1);
    
    unmount();
    
    expect(mediaQueryListeners.length).toBe(0);
  });
});
