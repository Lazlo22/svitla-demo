import { describe, it, expect, vi } from 'vitest';
import { renderHook } from '@test/test-utils';
import { useFileDrop } from '@hooks/use-file-drop';

describe('useFileDrop', () => {
  it('returns isDragging as false initially', () => {
    const onDrop = vi.fn();

    const { result } = renderHook(() => useFileDrop({ onDrop }));

    expect(result.current.isDragging).toBe(false);
  });

  it('returns a dropRef function', () => {
    const onDrop = vi.fn();

    const { result } = renderHook(() => useFileDrop({ onDrop }));

    expect(typeof result.current.dropRef).toBe('function');
  });

  it('accepts custom accept types', () => {
    const onDrop = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(() =>
      useFileDrop({
        onDrop,
        accept: ['application/pdf', 'image/png'],
        onError,
      })
    );

    expect(result.current.isDragging).toBe(false);
    expect(typeof result.current.dropRef).toBe('function');
  });

  it('uses default accept types when not provided', () => {
    const onDrop = vi.fn();

    const { result } = renderHook(() => useFileDrop({ onDrop }));

    // Hook should work with default PDF accept type
    expect(result.current.dropRef).toBeDefined();
  });
});
