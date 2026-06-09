"use client";

import { useEffect, useState } from "react";

const PLACED_KEY = "panharmon.placedCards.v1";
export const PLACED_LIMIT = 5;

export function usePlacedCards() {
  const [keys, setKeys] = useState<string[]>([]);

  useEffect(() => {
    try {
      setKeys(JSON.parse(localStorage.getItem(PLACED_KEY) || "[]"));
    } catch {
      setKeys([]);
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key === PLACED_KEY) {
        try {
          setKeys(JSON.parse(event.newValue || "[]"));
        } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const persist = (next: string[]) => {
    setKeys(next);
    try {
      localStorage.setItem(PLACED_KEY, JSON.stringify(next));
    } catch {}
  };

  return {
    keys,
    add: (key: string) => {
      if (keys.includes(key) || keys.length >= PLACED_LIMIT) return false;
      persist([...keys, key]);
      return true;
    },
    remove: (key: string) => persist(keys.filter((item) => item !== key)),
    clear: () => persist([]),
    has: (key: string) => keys.includes(key),
    isFull: keys.length >= PLACED_LIMIT,
    count: keys.length,
    limit: PLACED_LIMIT
  };
}
