import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDisclosure } from '@hooks/use-disclosure';

describe('useDisclosure', () => {
  it('initializes with default closed state', () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.isOpen).toBe(false);
  });

  it('initializes with provided initial state', () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.isOpen).toBe(true);
  });

  it('opens when onOpen is called', () => {
    const { result } = renderHook(() => useDisclosure());
    
    act(() => {
      result.current.onOpen();
    });
    
    expect(result.current.isOpen).toBe(true);
  });

  it('closes when onClose is called', () => {
    const { result } = renderHook(() => useDisclosure(true));
    
    act(() => {
      result.current.onClose();
    });
    
    expect(result.current.isOpen).toBe(false);
  });

  it('toggles state when onToggle is called', () => {
    const { result } = renderHook(() => useDisclosure());
    
    act(() => {
      result.current.onToggle();
    });
    expect(result.current.isOpen).toBe(true);
    
    act(() => {
      result.current.onToggle();
    });
    expect(result.current.isOpen).toBe(false);
  });

  it('maintains stable function references', () => {
    const { result, rerender } = renderHook(() => useDisclosure());
    
    const { onOpen, onClose, onToggle } = result.current;
    
    rerender();
    
    expect(result.current.onOpen).toBe(onOpen);
    expect(result.current.onClose).toBe(onClose);
    expect(result.current.onToggle).toBe(onToggle);
  });
});
