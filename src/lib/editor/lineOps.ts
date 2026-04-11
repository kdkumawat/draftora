export function getLineBounds(
  text: string,
  cursor: number,
): { lineStart: number; lineEnd: number } {
  const before = text.slice(0, cursor);
  const after = text.slice(cursor);
  const lineStart = before.lastIndexOf("\n") + 1;
  const nextNl = after.indexOf("\n");
  const lineEnd = nextNl === -1 ? text.length : cursor + nextNl;
  return { lineStart, lineEnd };
}

/** Toggle `• ` on the line under the cursor. */
export function toggleBulletLine(text: string, cursor: number): string {
  const { lineStart, lineEnd } = getLineBounds(text, cursor);
  const line = text.slice(lineStart, lineEnd);
  if (line.startsWith("• ")) {
    return text.slice(0, lineStart) + line.slice(2) + text.slice(lineEnd);
  }
  return text.slice(0, lineStart) + "• " + line + text.slice(lineEnd);
}

/** Toggle `1. ` on the line under the cursor. */
export function toggleNumberedLine(text: string, cursor: number): string {
  const { lineStart, lineEnd } = getLineBounds(text, cursor);
  const line = text.slice(lineStart, lineEnd);
  const num = /^(\d+)\.\s/.exec(line);
  if (num) {
    return text.slice(0, lineStart) + line.slice(num[0].length) + text.slice(lineEnd);
  }
  return text.slice(0, lineStart) + "1. " + line + text.slice(lineEnd);
}

/**
 * Toggle bullets on every non-empty line in the selection (multi-line aware).
 */
export function toggleBulletBlock(text: string, start: number, end: number): string {
  const a = Math.min(start, end);
  const b = Math.max(start, end);
  const block = text.slice(a, b);
  const lines = block.split("\n");
  const nonEmpty = lines.filter((l) => l.length > 0);
  const allBullet =
    nonEmpty.length > 0 && nonEmpty.every((l) => l.startsWith("• "));
  if (allBullet) {
    return (
      text.slice(0, a) +
      lines.map((l) => (l.startsWith("• ") ? l.slice(2) : l)).join("\n") +
      text.slice(b)
    );
  }
  return (
    text.slice(0, a) +
    lines.map((l) => (l === "" ? l : l.startsWith("• ") ? l : `• ${l}`)).join("\n") +
    text.slice(b)
  );
}

/**
 * Toggle numbering on each line in the selection (1. 2. 3. ...).
 */
export function toggleNumberedBlock(text: string, start: number, end: number): string {
  const a = Math.min(start, end);
  const b = Math.max(start, end);
  const block = text.slice(a, b);
  const lines = block.split("\n");
  const contentLines = lines.filter((l) => l.trim() !== "");
  const allNumbered =
    contentLines.length > 0 &&
    contentLines.every((l) => /^\d+\.\s/.test(l));
  if (allNumbered) {
    return (
      text.slice(0, a) +
      lines.map((l) => (l.trim() === "" ? l : l.replace(/^\d+\.\s/, ""))).join("\n") +
      text.slice(b)
    );
  }
  let n = 1;
  return (
    text.slice(0, a) +
    lines
      .map((l) => {
        if (l.trim() === "") return l;
        const body = l.replace(/^\d+\.\s/, "").replace(/^•\s/, "");
        return `${n++}. ${body}`;
      })
      .join("\n") +
    text.slice(b)
  );
}

/** Add or remove 2 spaces at the start of each line in [start, end). */
export function shiftIndent(
  text: string,
  start: number,
  end: number,
  dir: "in" | "out",
): { next: string; selStart: number; selEnd: number } {
  const a = Math.min(start, end);
  const b = Math.max(start, end);
  const block = text.slice(a, b);
  const lines = block.split("\n");
  const nextLines = lines.map((line) => {
    if (dir === "in") return `  ${line}`;
    if (line.startsWith("  ")) return line.slice(2);
    if (line.startsWith(" ")) return line.slice(1);
    return line;
  });
  const nextBlock = nextLines.join("\n");
  const next = text.slice(0, a) + nextBlock + text.slice(b);
  const delta = nextBlock.length - block.length;
  return { next, selStart: a, selEnd: b + delta };
}

/**
 * Enter on a numbered or bulleted line: continue list, or exit on empty item.
 * Only when the caret is at the end of the line and nothing is selected.
 */
export function applyEnterList(
  text: string,
  selStart: number,
  selEnd: number,
): { next: string; cursor: number } | null {
  if (selStart !== selEnd) return null;
  const cursor = selStart;
  const { lineStart, lineEnd } = getLineBounds(text, cursor);
  if (cursor !== lineEnd) return null;

  const line = text.slice(lineStart, lineEnd);
  const num = /^(\d+)\.\s([\s\S]*)$/.exec(line);
  if (num) {
    const n = parseInt(num[1], 10);
    const rest = num[2] ?? "";
    if (rest.trim() === "") {
      const next = text.slice(0, lineStart) + text.slice(lineEnd);
      return { next, cursor: lineStart };
    }
    const insert = `\n${n + 1}. `;
    const next = text.slice(0, cursor) + insert + text.slice(cursor);
    return { next, cursor: cursor + insert.length };
  }

  const bullet = /^•\s([\s\S]*)$/.exec(line);
  if (bullet) {
    const rest = bullet[1] ?? "";
    if (rest.trim() === "") {
      const next = text.slice(0, lineStart) + text.slice(lineEnd);
      return { next, cursor: lineStart };
    }
    const insert = `\n• `;
    const next = text.slice(0, cursor) + insert + text.slice(cursor);
    return { next, cursor: cursor + insert.length };
  }

  return null;
}
