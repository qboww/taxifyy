// utils/useLocalStorageWithExpiry.js
import { useState, useEffect } from "react";

export const useLocalStorageWithExpiry = (key, initialValue, expiryDays = 30) => {
  const [value, setValue] = useState(() => {
    if (typeof window === "undefined") return initialValue;
    const item = localStorage.getItem(key);
    if (!item) return initialValue;
    try {
      const parsed = JSON.parse(item);
      if (expiryDays !== null && parsed.expiry && new Date().getTime() > parsed.expiry) {
        localStorage.removeItem(key);
        return initialValue;
      }
      return parsed.value !== undefined ? parsed.value : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const item = { value: value };
    if (expiryDays !== null) {
      const now = new Date();
      item.expiry = now.getTime() + expiryDays * 24 * 60 * 60 * 1000;
    }
    localStorage.setItem(key, JSON.stringify(item));
  }, [key, value, expiryDays]);

  return [value, setValue];
};
