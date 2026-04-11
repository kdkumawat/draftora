import { useCallback, useLayoutEffect, useRef, useState } from "react";

const MAX_UNDO = 80;

/**
 * Debounced undo for typing; `commitFromToolbar` records one step for toolbar-driven edits.
 */
export function useUndoHistory(
  value: string,
  setValue: (v: string) => void,
) {
  const past = useRef<string[]>([]);
  const future = useRef<string[]>([]);
  const applying = useRef(false);
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const burstBase = useRef<string | null>(null);
  const valueRef = useRef(value);

  useLayoutEffect(() => {
    valueRef.current = value;
  }, [value]);

  const [flags, setFlags] = useState({ canUndo: false, canRedo: false });

  const resetHistory = useCallback(() => {
    past.current = [];
    future.current = [];
    burstBase.current = null;
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
    setFlags({ canUndo: false, canRedo: false });
  }, []);

  const commitFromToolbar = useCallback(
    (next: string) => {
      if (idleTimer.current) {
        clearTimeout(idleTimer.current);
        idleTimer.current = null;
      }
      burstBase.current = null;
      past.current.push(valueRef.current);
      if (past.current.length > MAX_UNDO) past.current.shift();
      future.current = [];
      applying.current = true;
      setValue(next);
      setFlags({
        canUndo: past.current.length > 0,
        canRedo: future.current.length > 0,
      });
      requestAnimationFrame(() => {
        applying.current = false;
      });
    },
    [setValue],
  );

  const onEdit = useCallback(
    (next: string) => {
      if (applying.current) {
        setValue(next);
        return;
      }
      if (burstBase.current === null) {
        burstBase.current = valueRef.current;
      }
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (
          burstBase.current !== null &&
          burstBase.current !== valueRef.current
        ) {
          past.current.push(burstBase.current);
          if (past.current.length > MAX_UNDO) past.current.shift();
          future.current = [];
          setFlags({
            canUndo: past.current.length > 0,
            canRedo: future.current.length > 0,
          });
        }
        burstBase.current = null;
        idleTimer.current = null;
      }, 450);
      setValue(next);
    },
    [setValue],
  );

  const undo = useCallback(() => {
    if (past.current.length === 0) return;
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
    burstBase.current = null;
    const prev = past.current.pop()!;
    future.current.push(valueRef.current);
    applying.current = true;
    setValue(prev);
    setFlags({
      canUndo: past.current.length > 0,
      canRedo: future.current.length > 0,
    });
    requestAnimationFrame(() => {
      applying.current = false;
    });
  }, [setValue]);

  const redo = useCallback(() => {
    if (future.current.length === 0) return;
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
    burstBase.current = null;
    const nxt = future.current.pop()!;
    past.current.push(valueRef.current);
    applying.current = true;
    setValue(nxt);
    setFlags({
      canUndo: past.current.length > 0,
      canRedo: future.current.length > 0,
    });
    requestAnimationFrame(() => {
      applying.current = false;
    });
  }, [setValue]);

  return {
    onEdit,
    commitFromToolbar,
    undo,
    redo,
    resetHistory,
    canUndo: flags.canUndo,
    canRedo: flags.canRedo,
  };
}
