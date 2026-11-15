import { useEffect, useState } from "react";

// Read saved data once, then keep localStorage in sync whenever it changes.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const savedValue = window.localStorage.getItem(key);
      return savedValue ? JSON.parse(savedValue) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // The app remains usable even when browser storage is unavailable.
    }
  }, [key, value]);

  return [value, setValue];
}
