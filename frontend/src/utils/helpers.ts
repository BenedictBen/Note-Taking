import type { Note } from '../types/types';

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