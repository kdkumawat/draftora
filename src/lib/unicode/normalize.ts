/** Replace em dash and en dash with ASCII hyphen (user preference: no em dashes). */
export function normalizeNoEmDash(text: string): string {
  return text
    .replace(/\u2014/g, "-")
    .replace(/\u2013/g, "-")
    .replace(/\u2015/g, "-");
}
