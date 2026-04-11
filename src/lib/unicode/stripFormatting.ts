import {
  REVERSE_BOLD_ITALIC_MAP,
  REVERSE_BOLD_MAP,
  REVERSE_ITALIC_MAP,
} from "@/lib/unicode/maps";

function toAsciiChar(ch: string): string {
  return (
    REVERSE_BOLD_ITALIC_MAP[ch] ??
    REVERSE_BOLD_MAP[ch] ??
    REVERSE_ITALIC_MAP[ch] ??
    ch
  );
}

/** Remove combining underline/strikethrough, then Unicode bold/italic/bold-italic. */
export function stripAllUnicodeFormatting(text: string): string {
  const noComb = text.replace(/\u0332/g, "").replace(/\u0336/g, "");
  let out = "";
  for (const ch of noComb) {
    out += toAsciiChar(ch);
  }
  return out;
}
