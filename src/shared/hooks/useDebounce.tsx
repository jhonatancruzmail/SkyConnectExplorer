import { useState, useEffect } from 'react'

/**
 * Simple debounce hook.
 * Returns the value only after it has stopped changing for `delay` milliseconds.
 *
 * @param value - The value to debounce
 * @param delay - Delay in milliseconds (default: 400)
 * @returns The debounced value
 *
 * @example
 * const debouncedQuery = useDebounce(query, 300);
 */
export function useDebounce(value: string, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
