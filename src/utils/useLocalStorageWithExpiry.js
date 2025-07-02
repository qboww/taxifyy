// utils/useLocalStorageWithExpiry.js
import { useState, useEffect } from "react";

export const useLocalStorageWithExpiry = (key, initialValue, expiryDays = 30) => {
  const [value, setValue] = useState(() => {
    const item = localStorage.getItem(key);
    if (!item) return initialValue;
    try {
      const parsed = JSON.parse(item);
      if (parsed.expiry && new Date().getTime() > parsed.expiry) {
        localStorage.removeItem(key);
        return initialValue;
      }
      return parsed.value !== undefined ? parsed.value : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    const now = new Date();
    const expiryDate = now.getTime() + expiryDays * 24 * 60 * 60 * 1000;
    const item = {
      value: value,
      expiry: expiryDate,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }, [key, value, expiryDays]);

  return [value, setValue];
};
