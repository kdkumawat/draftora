import { useCallback, useRef, useState } from "react";

export type RippleItem = { id: number; x: number; y: number };

export function useRipple() {
  const seq = useRef(0);
  const [ripples, setRipples] = useState<RippleItem[]>([]);

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const el = e.currentTarget;
    if (el instanceof HTMLButtonElement && el.disabled) return;
    const rect = el.getBoundingClientRect();
    seq.current += 1;
    const id = seq.current;
    setRipples((prev) => [
      ...prev,
      { id, x: e.clientX - rect.left, y: e.clientY - rect.top },
    ]);
  }, []);

  const removeRipple = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { ripples, onPointerDown, removeRipple };
}
