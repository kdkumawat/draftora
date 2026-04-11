import {
  addCombiningMarkPerChar,
  U_STRIKE,
} from "@/lib/unicode/combining";
import { BOLD_MAP, ITALIC_MAP } from "@/lib/unicode/maps";

function mapWithTable(
  text: string,
  map: Record<string, string>,
): string {
  return [...text].map((ch) => map[ch] ?? ch).join("");
}

/**
 * Turn common markdown-style markers in plain text into Unicode (bold / italic / strike).
 * Safe to run on pasted snippets; only replaces explicit patterns.
 */
export function convertMarkdownPatternsToUnicode(input: string): string {
  let s = input;
  // Bold **text** (before single * rules)
  s = s.replace(/\*\*([^*]+)\*\*/g, (_, inner: string) =>
    mapWithTable(inner, BOLD_MAP),
  );
  // Bold __text__
  s = s.replace(/__([^_]+)__/g, (_, inner: string) =>
    mapWithTable(inner, BOLD_MAP),
  );
  // Strikethrough ~~text~~
  s = s.replace(/~~([^~]+)~~/g, (_, inner: string) =>
    addCombiningMarkPerChar(inner, U_STRIKE),
  );
  // Italic *text* (not **)
  s = s.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, (_, inner: string) =>
    mapWithTable(inner, ITALIC_MAP),
  );
  // Italic _word_ (not __)
  s = s.replace(/(?<!_)_([^_\n]+)_(?!_)/g, (_, inner: string) =>
    mapWithTable(inner, ITALIC_MAP),
  );
  return s;
}
