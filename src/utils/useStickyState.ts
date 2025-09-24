import { useState, useEffect } from 'react';

// A custom hook that works like useState but saves/retrieves from localStorage
export function useStickyState<T>(defaultValue: T, key: string): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stickyValue = window.localStorage.getItem(key);
      return stickyValue !== null
        ? JSON.parse(stickyValue)
        : defaultValue;
    } catch (error) {
      console.error(`Error retrieving sticky state for key "${key}":`, error);
      return defaultValue;
    }
  });

  // Update localStorage when the state value changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting sticky state for key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue];
}