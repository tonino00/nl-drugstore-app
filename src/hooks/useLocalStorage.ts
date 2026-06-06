import { useCallback } from 'react';

export const useLocalStorage = <T,>(key: string) => {
  const get = useCallback((): T | null => {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }, [key]);

  const set = useCallback(
    (value: T) => {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    [key]
  );

  const remove = useCallback(() => {
    sessionStorage.removeItem(key);
  }, [key]);

  return { get, set, remove };
};
