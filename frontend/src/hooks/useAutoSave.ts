import { useState, useEffect, useCallback, useRef } from 'react';
import { debounce } from '../utils/helpers';
import type { DebouncedFunction } from '../utils/helpers';

interface UseAutoSaveReturn {
  value: string;
  setValue: (value: string) => void;
  isSaving: boolean;
  error: string | null;
  flush: () => void;
  cancel: () => void;
  reset: () => void;
}

/**
 * Custom hook for auto-saving content with debouncing
 * @param initialValue - Initial string value
 * @param saveFn - Function to call for saving
 * @param delay - Debounce delay in ms (default: 1000)
 * @returns Auto-save utilities and state
 */
export const useAutoSave = (
  initialValue: string,
  saveFn: (value: string) => Promise<void>,
  delay = 1000
): UseAutoSaveReturn => {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previousValueRef = useRef(initialValue);
  const isMountedRef = useRef(true);

  // Create stable save function reference
  const stableSaveFn = useCallback(saveFn, [saveFn]);

  // Create debounced save function
  const debouncedSaveRef = useRef<DebouncedFunction<(value: string) => Promise<void>>>(
    debounce(async (val: string) => {
      if (!isMountedRef.current) return;
      
      try {
        setIsSaving(true);
        setError(null);
        await stableSaveFn(val);
        previousValueRef.current = val;
      } catch (err) {
        if (isMountedRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to save');
        }
      } finally {
        if (isMountedRef.current) {
          setIsSaving(false);
        }
      }
    }, delay)
  );

  // Update value and trigger save when changed
  const handleChange = useCallback((newValue: string) => {
    setValue(newValue);
    if (newValue !== previousValueRef.current) {
      debouncedSaveRef.current(newValue);
    }
  }, []);

  // Flush pending saves
  const flush = useCallback(() => {
    debouncedSaveRef.current.flush();
  }, []);

  // Cancel pending saves
  const cancel = useCallback(() => {
    debouncedSaveRef.current.cancel();
  }, []);

  // Reset to initial value
  const reset = useCallback(() => {
    cancel();
    setValue(initialValue);
    previousValueRef.current = initialValue;
  }, [initialValue, cancel]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      debouncedSaveRef.current.cancel();
    };
  }, []);

  return {
    value,
    setValue: handleChange,
    isSaving,
    error,
    flush,
    cancel,
    reset
  };
};