import { useState, useEffect } from "react";

/**
 * Generic localStorage hook with React state sync.
 * Seeded from defaultValue on first use; persists all changes automatically.
 */
export function useLocalStorage<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage quota exceeded or private browsing — fail silently
    }
  }, [key, value]);

  return [value, setValue] as const;
}
