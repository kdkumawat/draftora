import {
  REVERSE_BOLD_ITALIC_MAP,
  REVERSE_BOLD_MAP,
  REVERSE_ITALIC_MAP,
} from "@/lib/unicode/maps";

const U_COMB_UNDER = "\u0332";
const U_COMB_STRIKE = "\u0336";

export type UnicodePreviewStyle = "bold" | "italic" | "boldItalic" | null;

export type StyledRun = { style: UnicodePreviewStyle; text: string };

function detectStyle(cp: string): UnicodePreviewStyle {
  if (REVERSE_BOLD_ITALIC_MAP[cp]) return "boldItalic";
  if (REVERSE_BOLD_MAP[cp]) return "bold";
  if (REVERSE_ITALIC_MAP[cp]) return "italic";
  return null;
}

/** Split plain text into runs for preview styling (combining underline/strike stay on the previous run). */
export function splitStyledPlainText(text: string): StyledRun[] {
  if (text === "") return [];

  const runs: StyledRun[] = [];
  let i = 0;
  while (i < text.length) {
    const cp = text.codePointAt(i)!;
    const ch = String.fromCodePoint(cp);
    const len = cp > 0xffff ? 2 : 1;

    if (ch === U_COMB_UNDER || ch === U_COMB_STRIKE) {
      const last = runs[runs.length - 1];
      if (last) {
        last.text += ch;
      } else {
        runs.push({ style: null, text: ch });
      }
      i += len;
      continue;
    }

    const style = detectStyle(ch);
    const last = runs[runs.length - 1];
    if (last && last.style === style) {
      last.text += ch;
    } else {
      runs.push({ style, text: ch });
    }
    i += len;
  }
  return runs;
}
