/** Structured tokens for parsing & preview (not stored separately - derived from `value`). */
export type Node =
  | { type: "text"; value: string }
  | { type: "mention"; id: string; name: string }
  | { type: "hashtag"; value: string }
  | { type: "link"; url: string };

/** One visual line = one row of tokens (split on `\n`). */
export type LineTokens = Node[];

export type ParsedDocument = {
  lines: LineTokens[];
};
