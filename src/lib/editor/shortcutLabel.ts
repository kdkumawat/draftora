/** macOS vs Windows/Linux modifier prefix for tooltips. */
export function modKey(): "⌘" | "Ctrl+" {
  if (typeof navigator === "undefined") return "Ctrl+";
  return /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘" : "Ctrl+";
}

/** e.g. Bold (⌘B) / Bold (Ctrl+B) */
export function tt(action: string, key: string): string {
  return modKey() === "⌘"
    ? `${action} (⌘${key})`
    : `${action} (Ctrl+${key})`;
}

/** e.g. Strikethrough (⌘⇧X) / Strikethrough (Ctrl+Shift+X) */
export function ttShift(action: string, key: string): string {
  return modKey() === "⌘"
    ? `${action} (⌘⇧${key})`
    : `${action} (Ctrl+Shift+${key})`;
}

/** Redo: ⌘⇧Z on Mac, Ctrl+Y on Windows (matches editor shortcuts). */
export function ttRedo(): string {
  return modKey() === "⌘" ? "Redo (⌘⇧Z)" : "Redo (Ctrl+Y)";
}
