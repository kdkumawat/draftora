import { normalizeNoEmDash } from "@/lib/unicode/normalize";

/** Light spacing cleanup for readability; paste-safe plain text. */
export function beautifyPost(text: string): string {
  let t = text.replace(/\r\n/g, "\n").trim();
  t = t.replace(/[ \t]+\n/g, "\n");
  t = t.replace(/\n{3,}/g, "\n\n");
  t = t.replace(/[ \t]{2,}/g, " ");
  return normalizeNoEmDash(t);
}
