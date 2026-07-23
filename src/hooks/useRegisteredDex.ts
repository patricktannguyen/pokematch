import { useCallback, useRef } from "react";

const STORAGE_KEY = "pokematch-registered";

function loadRegistered(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

export function useRegisteredDex() {
  const registeredRef = useRef<Set<number> | null>(null);
  if (registeredRef.current === null) {
    registeredRef.current = loadRegistered();
  }

  const isRegistered = useCallback((id: number) => {
    return registeredRef.current!.has(id);
  }, []);

  const register = useCallback((id: number) => {
    const set = registeredRef.current!;
    if (set.has(id)) return;
    set.add(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  }, []);

  return { isRegistered, register };
}
