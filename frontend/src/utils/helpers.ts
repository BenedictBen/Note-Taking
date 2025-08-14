import type { Note } from '../types/types';

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

/**
 * Formats a date string to a human-readable format
 * @param dateString - ISO date string
 * @returns Formatted date string (e.g., "Jan 1, 2023, 12:00 PM")
 */
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Creates a debounced function that delays invoking func
 * @param func - The function to debounce
 * @param delay - Number of milliseconds to delay
 * @returns Debounced function with cancel and flush methods
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): DebouncedFunction<T> => {
  let timeoutId: ReturnType<typeof setTimeout>;
  let lastArgs: Parameters<T> | null = null;

  const debounced = (...args: Parameters<T>) => {
    lastArgs = args;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
      lastArgs = null;
    }, delay);
  };

  debounced.cancel = () => {
    clearTimeout(timeoutId);
    lastArgs = null;
  };

  debounced.flush = () => {
    clearTimeout(timeoutId);
    if (lastArgs) {
      func(...lastArgs);
      lastArgs = null;
    }
  };

  return debounced;
};

/**
 * Validates note fields before submission
 * @param note - Partial note object
 * @returns Error message or null if valid
 */
export const validateNote = (note: Partial<Note>): string | null => {
  if (!note.title?.trim()) return 'Title is required';
  if (!note.body?.trim()) return 'Content is required';
  if (note.title.length > 100) return 'Title must be less than 100 characters';
  return null;
};

/**
 * Helper to check if two notes are different
 * @param a - First note
 * @param b - Second note
 * @returns True if notes are different
 */
export const hasNoteChanged = (a: Partial<Note>, b: Partial<Note>): boolean => {
  return a.title !== b.title || a.body !== b.body;
};