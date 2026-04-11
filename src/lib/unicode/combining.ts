/** Combining marks for plain-text underline / strikethrough (paste-safe Unicode). */
export const U_UNDER = "\u0332";
export const U_STRIKE = "\u0336";

function stripMark(s: string, mark: string): string {
  if (!s.includes(mark)) return s;
  return s.split(mark).join("");
}

export function addCombiningMarkPerChar(s: string, mark: string): string {
  let out = "";
  for (const c of s) {
    if (c === "\n" || c === "\r") out += c;
    else out += c + mark;
  }
  return out;
}

function isFullyMarked(s: string, mark: string): boolean {
  const stripped = stripMark(s, mark);
  return stripped.length > 0 && addCombiningMarkPerChar(stripped, mark) === s;
}

/** True when the slice is entirely covered by this combining mark (same rules as toggle). */
export function isSelectionFullyMarked(
  selected: string,
  mark: typeof U_UNDER | typeof U_STRIKE,
): boolean {
  return isFullyMarked(selected, mark);
}

export function toggleCombiningStyle(
  value: string,
  start: number,
  end: number,
  mark: typeof U_UNDER | typeof U_STRIKE,
): { next: string; selStart: number; selEnd: number } {
  if (start === end) {
    return { next: value, selStart: start, selEnd: end };
  }
  const selected = value.slice(start, end);
  const base = stripMark(selected, mark);
  if (isFullyMarked(selected, mark)) {
    const next = value.slice(0, start) + base + value.slice(end);
    return { next, selStart: start, selEnd: start + base.length };
  }
  const applied = addCombiningMarkPerChar(base, mark);
  const next = value.slice(0, start) + applied + value.slice(end);
  return { next, selStart: start, selEnd: start + applied.length };
}
