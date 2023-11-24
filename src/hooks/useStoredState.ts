import { useState, useEffect } from 'react';

function useStoredState<T>(initialValue: T, key: string, restore: (rawJSON: any) => T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return restore(JSON.parse(JSON.stringify(storedValue)));
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value]);

  return [value, setValue];
}

export default useStoredState;
