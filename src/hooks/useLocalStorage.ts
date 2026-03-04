/**
 * @author Anil Kumar Thatha Venkatachalapathy
 * @email aniltv06@gmail.com
 *
 * Generic localStorage hook — replaces 11+ scattered try/catch + JSON.parse blocks.
 */

import { useState, useCallback } from 'react';

type SetValue<T> = (value: T | ((prev: T) => T)) => void;

export function useLocalStorage<T>(key: string, initial: T): [T, SetValue<T>] {
  const [stored, setStored] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initial;
    } catch {
      return initial;
    }
  });

  const setValue: SetValue<T> = useCallback(
    (value) => {
      setStored((prev) => {
        const next = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value;
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // Quota exceeded or private browsing — silently ignore.
        }
        return next;
      });
    },
    [key],
  );

  return [stored, setValue];
}
