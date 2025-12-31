
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { mockNavigate } from '@test/setup';
import { useBackNavigation } from '@hooks/useBackNavigation';

describe('useBackNavigation', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('returns goBack function', () => {
    const { result } = renderHook(() => useBackNavigation());

    expect(typeof result.current.goBack).toBe('function');
  });

  it('calls navigate with -1 when goBack is called', () => {
    const { result } = renderHook(() => useBackNavigation());

    result.current.goBack();

    expect(mockNavigate).toHaveBeenCalledWith(-1);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('maintains stable function reference', () => {
    const { result, rerender } = renderHook(() => useBackNavigation());

    const firstGoBack = result.current.goBack;
    rerender();
    const secondGoBack = result.current.goBack;

    expect(firstGoBack).toBe(secondGoBack);
  });
});
