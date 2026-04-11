import {
  BOLD_ITALIC_MAP,
  BOLD_MAP,
  ITALIC_MAP,
  REVERSE_BOLD_ITALIC_MAP,
  REVERSE_BOLD_MAP,
  REVERSE_ITALIC_MAP,
} from "@/lib/unicode/maps";

export type StyleKind = "bold" | "italic";

/** Iterate Unicode code points (surrogate-pair safe). */
function codePoints(s: string): string[] {
  return [...s];
}

function isNeutral(cp: string): boolean {
  return cp === " " || cp === "\n" || cp === "\r" || cp === "\t";
}

function isCombiningMark(cp: string): boolean {
  return cp === "\u0332" || cp === "\u0336";
}

/** Single character to ASCII (strip known styled chars). */
export function toAsciiChar(ch: string): string {
  return (
    REVERSE_BOLD_ITALIC_MAP[ch] ??
    REVERSE_BOLD_MAP[ch] ??
    REVERSE_ITALIC_MAP[ch] ??
    ch
  );
}

function isBoldItalicCp(cp: string): boolean {
  return REVERSE_BOLD_ITALIC_MAP[cp] !== undefined;
}

function isBoldOnlyCp(cp: string): boolean {
  return (
    REVERSE_BOLD_MAP[cp] !== undefined && REVERSE_BOLD_ITALIC_MAP[cp] === undefined
  );
}

function isItalicOnlyCp(cp: string): boolean {
  return (
    REVERSE_ITALIC_MAP[cp] !== undefined &&
    REVERSE_BOLD_ITALIC_MAP[cp] === undefined
  );
}

function mapCharBold(cp: string): string {
  if (isBoldItalicCp(cp)) return cp;
  const base = toAsciiChar(cp);
  if (isItalicOnlyCp(cp)) {
    return BOLD_ITALIC_MAP[base] ?? BOLD_MAP[base] ?? cp;
  }
  return BOLD_MAP[base] ?? cp;
}

function mapCharItalic(cp: string): string {
  if (isBoldItalicCp(cp)) return cp;
  const base = toAsciiChar(cp);
  if (isBoldOnlyCp(cp)) {
    return BOLD_ITALIC_MAP[base] ?? ITALIC_MAP[base] ?? cp;
  }
  return ITALIC_MAP[base] ?? cp;
}

function removeBoldLayer(cp: string): string {
  if (isBoldItalicCp(cp)) {
    const base = REVERSE_BOLD_ITALIC_MAP[cp]!;
    return ITALIC_MAP[base] ?? cp;
  }
  if (isBoldOnlyCp(cp)) {
    return REVERSE_BOLD_MAP[cp] ?? cp;
  }
  return cp;
}

function removeItalicLayer(cp: string): string {
  if (isBoldItalicCp(cp)) {
    const base = REVERSE_BOLD_ITALIC_MAP[cp]!;
    return BOLD_MAP[base] ?? cp;
  }
  if (isItalicOnlyCp(cp)) {
    return REVERSE_ITALIC_MAP[cp] ?? cp;
  }
  return cp;
}

function allSelectedHaveBold(cps: string[]): boolean {
  const meaningful = cps.filter((cp) => !isNeutral(cp) && !isCombiningMark(cp));
  if (meaningful.length === 0) return false;
  return meaningful.every((cp) => isBoldOnlyCp(cp) || isBoldItalicCp(cp));
}

function allSelectedHaveItalic(cps: string[]): boolean {
  const meaningful = cps.filter((cp) => !isNeutral(cp) && !isCombiningMark(cp));
  if (meaningful.length === 0) return false;
  return meaningful.every((cp) => isItalicOnlyCp(cp) || isBoldItalicCp(cp));
}

/**
 * Toggle or apply Unicode bold / italic on [start, end).
 * If every stylable character in the selection already has that weight, the layer is removed.
 */
export function applyUnicodeStyle(
  value: string,
  start: number,
  end: number,
  kind: StyleKind,
): { next: string; selStart: number; selEnd: number } {
  if (start === end) {
    return { next: value, selStart: start, selEnd: end };
  }

  const selected = value.slice(start, end);
  const cps = codePoints(selected);

  if (kind === "bold") {
    const strip = allSelectedHaveBold(cps);
    const result = strip
      ? cps.map(removeBoldLayer).join("")
      : cps.map(mapCharBold).join("");
    const next = value.slice(0, start) + result + value.slice(end);
    return {
      next,
      selStart: start,
      selEnd: start + result.length,
    };
  }

  const strip = allSelectedHaveItalic(cps);
  const result = strip
    ? cps.map(removeItalicLayer).join("")
    : cps.map(mapCharItalic).join("");
  const next = value.slice(0, start) + result + value.slice(end);
  return {
    next,
    selStart: start,
    selEnd: start + result.length,
  };
}
