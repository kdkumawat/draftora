/** Feed "hook" fold - matches ~3-4 lines / ~140 chars so hooks are visible in preview */
export const PREVIEW_MAX_LINES = 4;
export const PREVIEW_FOLD_CHARS = 140;

/** LinkedIn-style "see more" - ~220 chars for plaintext posts */
export const SEE_MORE_MAX_CHARS = 220;

export function getLinkedInFold(content: string): {
  visible: string;
  restHidden: boolean;
} {
  if (!content) return { visible: "", restHidden: false };

  const lines = content.split("\n");
  let out = "";
  let usedLines = 0;

  for (let i = 0; i < lines.length; i++) {
    if (usedLines >= PREVIEW_MAX_LINES) {
      return { visible: out, restHidden: true };
    }
    const line = lines[i];
    const next = out === "" ? line : `${out}\n${line}`;

    if (next.length > PREVIEW_FOLD_CHARS) {
      const prefixLen = out.length + (out === "" ? 0 : 1);
      const allowed = PREVIEW_FOLD_CHARS - prefixLen;
      const slice = line.slice(0, Math.max(0, allowed));
      const vis = out === "" ? slice : `${out}\n${slice}`;
      return { visible: vis, restHidden: true };
    }
    out = next;
    usedLines++;
  }

  const fullJoined = lines.join("\n");
  return { visible: out, restHidden: fullJoined.length > out.length };
}

/** Simple character fold for “see more” (Unicode-safe). */
export function getSeeMoreFold(content: string): {
  visible: string;
  restHidden: boolean;
} {
  if (!content) return { visible: "", restHidden: false };
  if (content.length <= SEE_MORE_MAX_CHARS) {
    return { visible: content, restHidden: false };
  }
  return {
    visible: content.slice(0, SEE_MORE_MAX_CHARS),
    restHidden: true,
  };
}
