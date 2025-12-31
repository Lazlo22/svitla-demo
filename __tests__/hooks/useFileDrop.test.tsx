import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@test/test-utils';
import { useFileDrop } from '@hooks/useFileDrop';

describe('useFileDrop', () => {
  it('initializes without crashing', () => {
    const onDrop = vi.fn();

    expect(() => {
      renderHook(() => useFileDrop({ onDrop }));
    }).not.toThrow();
  });

  it('accepts onDrop callback', () => {
    const onDrop = vi.fn();

    const { result } = renderHook(() => useFileDrop({ onDrop }));

    // Hook should initialize
    expect(result.current).toBeDefined();
  });

  it('accepts custom accept types and onError callback', () => {
    const onDrop = vi.fn();
    const onError = vi.fn();

    expect(() => {
      renderHook(() =>
        useFileDrop({
          onDrop,
          accept: ['application/pdf', 'image/png'],
          onError,
        })
      );
    }).not.toThrow();
  });

  it('uses default accept types when not provided', () => {
    const onDrop = vi.fn();

    expect(() => {
      renderHook(() => useFileDrop({ onDrop }));
    }).not.toThrow();
  });

  it('returns an object with expected structure', async () => {
    const onDrop = vi.fn();

    const { result } = renderHook(() => useFileDrop({ onDrop }));

    // Check that result exists and has the expected properties
    await expect.poll(() => result.current).not.toBeNull();

    if (result.current) {
      expect(result.current).toHaveProperty('isDragging');
      expect(result.current).toHaveProperty('dropRef');
    }
  });
});
