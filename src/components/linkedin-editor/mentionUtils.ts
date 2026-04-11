/** Active @mention query from cursor (plain text). */
export function getActiveMentionQuery(
  value: string,
  cursor: number,
): { start: number; query: string } | null {
  const before = value.slice(0, cursor);
  const at = before.lastIndexOf("@");
  if (at === -1) return null;
  if (at > 0 && /[\w]/.test(before[at - 1]!)) return null;
  const after = before.slice(at + 1);
  if (after.includes("\n")) return null;
  return { start: at, query: after };
}
