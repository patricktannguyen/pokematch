import { useCallback, useState } from "react";
import { isInDex } from "../data/dexUniverse";

export function useDiscoveredDex() {
  const [discovered, setDiscovered] = useState<Set<number>>(() => new Set());

  const isDiscovered = useCallback(
    (id: number) => discovered.has(id),
    [discovered],
  );

  const discover = useCallback((id: number) => {
    if (!isInDex(id)) return;
    setDiscovered((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  return { discovered, discoveredCount: discovered.size, isDiscovered, discover };
}
