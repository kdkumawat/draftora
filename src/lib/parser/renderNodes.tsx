import type { ReactNode } from "react";
import type { Node as PostNode, ParsedDocument } from "@/lib/post/model";
import {
  splitStyledPlainText,
  type UnicodePreviewStyle,
} from "@/lib/parser/styleRuns";

function previewStyleClass(style: UnicodePreviewStyle): string | undefined {
  if (style === "bold") return "ln-uni-bold";
  if (style === "italic") return "ln-uni-italic";
  if (style === "boldItalic") return "ln-uni-bold-italic";
  return undefined;
}

function renderNode(node: PostNode, key: string): ReactNode {
  switch (node.type) {
    case "text": {
      const runs = splitStyledPlainText(node.value);
      if (runs.length === 0) {
        return <span key={key} />;
      }
      return (
        <span key={key}>
          {runs.map((run, i) => (
            <span key={`${key}-${i}`} className={previewStyleClass(run.style)}>
              {run.text}
            </span>
          ))}
        </span>
      );
    }
    case "mention":
      return (
        <span
          key={key}
          className="font-semibold text-[#0a66c2] hover:underline"
        >
          @{node.name}
        </span>
      );
    case "hashtag":
      return (
        <span key={key} className="font-medium text-[#0a66c2]">
          {node.value}
        </span>
      );
    case "link":
      return (
        <a
          key={key}
          href={node.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-[#0a66c2] hover:underline"
        >
          {node.url}
        </a>
      );
    default:
      return null;
  }
}

export function renderDocument(doc: ParsedDocument): ReactNode[] {
  const out: ReactNode[] = [];
  doc.lines.forEach((line, i) => {
    if (i > 0) out.push("\n");
    line.forEach((node, j) => {
      out.push(renderNode(node, `${i}-${j}`));
    });
  });
  return out;
}
