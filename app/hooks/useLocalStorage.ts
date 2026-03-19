import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  // localStorageから読み込み
  useEffect(() => {
    const item = localStorage.getItem(key);
    if (item) {
      try {
        setValue(JSON.parse(item) as T);
      } catch {
        setValue(item as T);
      }
    }
  }, [key]);

  // 値が変更されたらlocalStorageに保存
  useEffect(() => {
    if (value !== initialValue || value !== "") {
      if (value === "" || value === null || value === undefined) {
        localStorage.removeItem(key);
      } else {
        const valueToStore =
          typeof value === "string" ? value : JSON.stringify(value);
        localStorage.setItem(key, valueToStore);
      }
    }
  }, [key, value, initialValue]);

  return [value, setValue] as const;
}
