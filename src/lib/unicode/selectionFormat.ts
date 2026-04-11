import { U_STRIKE, U_UNDER, isSelectionFullyMarked } from "@/lib/unicode/combining";
import {
  REVERSE_BOLD_ITALIC_MAP,
  REVERSE_BOLD_MAP,
  REVERSE_ITALIC_MAP,
} from "@/lib/unicode/maps";

export type ToolbarFormatState = {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strike: boolean;
};

function isNeutral(cp: string): boolean {
  return cp === " " || cp === "\n" || cp === "\r" || cp === "\t";
}

function isCombiningMark(cp: string): boolean {
  return cp === "\u0332" || cp === "\u0336";
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

/** Whether toolbar buttons should show “on” for the current selection (non-empty). */
export function getToolbarFormatState(
  value: string,
  start: number,
  end: number,
): ToolbarFormatState {
  const off: ToolbarFormatState = {
    bold: false,
    italic: false,
    underline: false,
    strike: false,
  };
  if (start === end) return off;

  const a = Math.min(start, end);
  const b = Math.max(start, end);
  const sel = value.slice(a, b);
  const cps = [...sel];

  const meaningful = cps.filter((cp) => !isNeutral(cp) && !isCombiningMark(cp));
  if (meaningful.length === 0) return off;

  const bold = meaningful.every(
    (cp) => isBoldOnlyCp(cp) || isBoldItalicCp(cp),
  );
  const italic = meaningful.every(
    (cp) => isItalicOnlyCp(cp) || isBoldItalicCp(cp),
  );

  const underline = isSelectionFullyMarked(sel, U_UNDER);
  const strike = isSelectionFullyMarked(sel, U_STRIKE);

  return { bold, italic, underline, strike };
}
