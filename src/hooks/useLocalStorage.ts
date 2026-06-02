import { useCallback } from 'react';

export const useLocalStorage = <T,>(key: string) => {
  const get = useCallback((): T | null => {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }, [key]);

  const set = useCallback(
    (value: T) => {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [key]
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return { get, set, remove };
};
