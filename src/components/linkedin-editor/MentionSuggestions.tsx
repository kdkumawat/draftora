"use client";

import { useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";
import type { MockMention } from "@/components/linkedin-editor/mockMentions";
import { cn } from "@/lib/utils/cn";

export type MentionAnchor = {
  top: number;
  left: number;
  height: number;
};

type MentionSuggestionsProps = {
  items: MockMention[];
  highlightedIndex: number;
  onHighlight: (index: number) => void;
  onPick: (item: MockMention) => void;
  anchor: MentionAnchor;
};

const GAP = 6;
const MAX_H = 208;
const DROPDOWN_W = 280;

function clampDropdownPosition(
  belowTop: number,
  left: number,
  width: number,
  height: number,
  caretTop: number,
): { top: number; left: number } {
  const pad = 8;
  const vw = typeof window !== "undefined" ? window.innerWidth : 400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 600;

  let t = belowTop;
  let l = left;

  if (l + width > vw - pad) l = Math.max(pad, vw - width - pad);
  if (l < pad) l = pad;

  if (t + height > vh - pad) {
    t = Math.max(pad, caretTop - height - GAP);
  }
  if (t < pad) t = pad;

  return { top: t, left: l };
}

export function MentionSuggestions({
  items,
  highlightedIndex,
  onHighlight,
  onPick,
  anchor,
}: MentionSuggestionsProps) {
  const listRef = useRef<HTMLUListElement>(null);

  const placed = useMemo(
    () =>
      clampDropdownPosition(
        anchor.top + anchor.height + GAP,
        anchor.left,
        DROPDOWN_W,
        MAX_H,
        anchor.top,
      ),
    [anchor.top, anchor.left, anchor.height],
  );

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLLIElement>(
      `[data-index="${highlightedIndex}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex]);

  if (items.length === 0) return null;

  const node = (
    <ul
      ref={listRef}
      role="listbox"
      style={{
        position: "fixed",
        top: placed.top,
        left: placed.left,
        zIndex: 80,
        width: DROPDOWN_W,
        maxHeight: MAX_H,
      }}
      className={cn(
        "overflow-auto rounded-xl border border-[var(--app-chrome-border)] bg-[var(--card)] py-1 shadow-lg shadow-black/10 dark:shadow-black/40",
      )}
    >
      {items.map((item, i) => (
        <li key={item.id} role="option" aria-selected={i === highlightedIndex}>
          <button
            type="button"
            data-index={i}
            className={cn(
              "flex w-full px-3 py-2 text-left text-sm font-medium text-[var(--foreground)]",
              i === highlightedIndex
                ? "bg-black/[0.05] dark:bg-white/[0.08]"
                : "hover:bg-black/[0.03] dark:hover:bg-white/[0.05]",
            )}
            onMouseEnter={() => onHighlight(i)}
            onMouseDown={(e) => {
              e.preventDefault();
              onPick(item);
            }}
          >
            {item.name}
          </button>
        </li>
      ))}
    </ul>
  );

  if (typeof document === "undefined") return null;
  return createPortal(node, document.body);
}
