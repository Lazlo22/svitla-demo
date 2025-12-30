import type { KeyboardEvent } from 'react';

/**
 * Checks if the Enter key was pressed
 */
export function isEnterPress(e: KeyboardEvent): boolean {
  return e.key === 'Enter';
}

/**
 * Checks if the Space key was pressed
 */
export function isSpacePress(e: KeyboardEvent): boolean {
  return e.key === ' ';
}

/**
 * Checks if either Enter or Space key was pressed (common for accessible click handlers)
 */
export function isActivationKey(e: KeyboardEvent): boolean {
  return isEnterPress(e) || isSpacePress(e);
}
