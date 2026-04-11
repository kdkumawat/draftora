import type { LineTokens, Node, ParsedDocument } from "@/lib/post/model";

function trimUrlTrailingPunct(raw: string): string {
  return raw.replace(/[),.;:!?]+$/g, "");
}

const URL_RE = /^https?:\/\/[^\s<>"']+/i;
const HASHTAG_RE = /^#([\w\u00c0-\u024f]+)/;
/** @Name or @First Last - words after @ until line end or double-space */
const MENTION_RE = /^@([^\s@]+(?:\s+[^\s@]+)*)/;

function pushText(nodes: Node[], chunk: string) {
  if (!chunk) return;
  const last = nodes[nodes.length - 1];
  if (last?.type === "text") {
    last.value += chunk;
  } else {
    nodes.push({ type: "text", value: chunk });
  }
}

export function tokenizeLine(line: string): LineTokens {
  const nodes: Node[] = [];
  let i = 0;

  while (i < line.length) {
    const rest = line.slice(i);

    const url = rest.match(URL_RE);
    if (url && url.index === 0) {
      const href = trimUrlTrailingPunct(url[0]);
      nodes.push({ type: "link", url: href });
      i += href.length;
      continue;
    }

    if (rest[0] === "@") {
      const m = rest.match(MENTION_RE);
      if (m?.[1]) {
        const name = m[1].trim();
        nodes.push({
          type: "mention",
          id: name.replace(/\s+/g, "_").toLowerCase(),
          name,
        });
        i += m[0].length;
        continue;
      }
    }

    const tag = rest.match(HASHTAG_RE);
    if (tag && tag.index === 0) {
      nodes.push({ type: "hashtag", value: tag[0] });
      i += tag[0].length;
      continue;
    }

    pushText(nodes, rest[0]!);
    i += 1;
  }

  return nodes;
}

export function parseDocument(value: string): ParsedDocument {
  return { lines: value.split("\n").map((line) => tokenizeLine(line)) };
}
