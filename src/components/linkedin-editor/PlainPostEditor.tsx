"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  MentionSuggestions,
  type MentionAnchor,
} from "@/components/linkedin-editor/MentionSuggestions";
import { filterMentions } from "@/components/linkedin-editor/mockMentions";
import type { MockMention } from "@/components/linkedin-editor/mockMentions";
import { getActiveMentionQuery } from "@/components/linkedin-editor/mentionUtils";
import { EditorFooterBar } from "@/components/linkedin-editor/EditorFooterBar";
import { UnicodeFormatToolbar } from "@/components/linkedin-editor/UnicodeFormatToolbar";
import { EDITOR_EMPTY_PLACEHOLDER } from "@/lib/editor/demoPlaceholder";
import { applyEnterList } from "@/lib/editor/lineOps";
import { getTextareaCaretClientPoint } from "@/lib/editor/textareaCaret";
import { readTextareaScroll, writeTextareaScroll } from "@/lib/editor/textareaScroll";
import { U_STRIKE, U_UNDER, toggleCombiningStyle } from "@/lib/unicode/combining";
import { normalizeNoEmDash } from "@/lib/unicode/normalize";
import { convertMarkdownPatternsToUnicode } from "@/lib/unicode/pasteConvert";
import { getToolbarFormatState } from "@/lib/unicode/selectionFormat";
import { applyUnicodeStyle, type StyleKind } from "@/lib/unicode/style";
import { cn } from "@/lib/utils/cn";

const MAX = 3000;
const WARN = 2500;

type PlainPostEditorProps = {
  value: string;
  onEdit: (next: string) => void;
  commitFromToolbar: (next: string) => void;
  onEmoji: () => void;
  onImage: () => void;
  onCopyText: () => void;
  onResetDraft: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  toolbarRef?: React.RefObject<HTMLDivElement | null>;
};

function mergeRefs<T>(
  ...refs: (React.Ref<T> | null | undefined)[]
): React.RefCallback<T> {
  return (node) => {
    for (const r of refs) {
      if (!r) continue;
      if (typeof r === "function") r(node);
      else (r as React.MutableRefObject<T | null>).current = node;
    }
  };
}

export const PlainPostEditor = forwardRef<HTMLTextAreaElement, PlainPostEditorProps>(
  function PlainPostEditor(
    {
      value,
      onEdit,
      commitFromToolbar,
      onEmoji,
      onImage,
      onCopyText,
      onResetDraft,
      canUndo,
      canRedo,
      onUndo,
      onRedo,
      toolbarRef,
    },
    ref,
  ) {
    const innerRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef = innerRef;
    const fallbackBar = useRef<HTMLDivElement>(null);
    const barRef = toolbarRef ?? fallbackBar;

    const [cursor, setCursor] = useState(0);
    const [sel, setSel] = useState({ start: 0, end: 0 });
    const [mentionIndex, setMentionIndex] = useState(0);
    const [suppressMentionAt, setSuppressMentionAt] = useState<number | null>(
      null,
    );

    const mentionCtx = useMemo(
      () => getActiveMentionQuery(value, cursor),
      [value, cursor],
    );

    const mentionItems = useMemo(() => {
      if (!mentionCtx) return [];
      return filterMentions(mentionCtx.query);
    }, [mentionCtx]);

    const formatActive = useMemo(
      () => getToolbarFormatState(value, sel.start, sel.end),
      [value, sel.start, sel.end],
    );

    const commitWithScroll = useCallback(
      (
        next: string,
        selectionRange?: { start: number; end: number },
      ) => {
        const ta = textareaRef.current;
        const scroll = readTextareaScroll(ta);
        commitFromToolbar(next);
        requestAnimationFrame(() => {
          const el = textareaRef.current;
          if (!el) return;
          el.focus();
          if (selectionRange) {
            el.setSelectionRange(selectionRange.start, selectionRange.end);
          }
          writeTextareaScroll(el, scroll.top, scroll.left);
          const end = selectionRange?.end ?? el.selectionEnd;
          const start = selectionRange?.start ?? el.selectionStart;
          setCursor(end);
          setSel({ start, end });
        });
      },
      [commitFromToolbar],
    );

    const [mentionAnchor, setMentionAnchor] = useState<MentionAnchor>({
      top: 0,
      left: 0,
      height: 20,
    });

    const mentionListOpen =
      Boolean(mentionCtx && mentionItems.length > 0) &&
      mentionCtx!.start !== suppressMentionAt;

    useLayoutEffect(() => {
      if (!mentionListOpen) return;
      const ta = textareaRef.current;
      if (!ta) return;
      setMentionAnchor(getTextareaCaretClientPoint(ta, ta.selectionStart));
    }, [mentionListOpen, value, cursor, sel.start, sel.end]);

    useEffect(() => {
      if (!mentionListOpen) return;
      const onResize = () => {
        const ta = textareaRef.current;
        if (!ta) return;
        setMentionAnchor(getTextareaCaretClientPoint(ta, ta.selectionStart));
      };
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, [mentionListOpen]);

    const safeMentionIndex = Math.min(
      mentionIndex,
      Math.max(0, mentionItems.length - 1),
    );

    const insertMention = useCallback(
      (item: MockMention) => {
        const ta = textareaRef.current;
        if (!ta || !mentionCtx) return;
        const insert = `@${item.name} `;
        const end = ta.selectionEnd;
        const next =
          value.slice(0, mentionCtx.start) + insert + value.slice(end);
        if (next.length > MAX) return;
        const pos = mentionCtx.start + insert.length;
        setSuppressMentionAt(null);
        commitWithScroll(next, { start: pos, end: pos });
      },
      [mentionCtx, commitWithScroll, value, textareaRef],
    );

    const applyShortcut = useCallback(
      (kind: StyleKind) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const { next, selStart, selEnd } = applyUnicodeStyle(
          value,
          ta.selectionStart,
          ta.selectionEnd,
          kind,
        );
        if (next.length > MAX) return;
        commitWithScroll(next, { start: selStart, end: selEnd });
      },
      [commitWithScroll, value, textareaRef],
    );

    const applyCombiningShortcut = useCallback(
      (mark: typeof U_UNDER | typeof U_STRIKE) => {
        const ta = textareaRef.current;
        if (!ta) return;
        const { next, selStart, selEnd } = toggleCombiningStyle(
          value,
          ta.selectionStart,
          ta.selectionEnd,
          mark,
        );
        if (next.length > MAX) return;
        commitWithScroll(next, { start: selStart, end: selEnd });
      },
      [commitWithScroll, value, textareaRef],
    );

    const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) {
          if (canRedo) onRedo();
        } else {
          if (canUndo) onUndo();
        }
        return;
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        if (canRedo) onRedo();
        return;
      }

      if (mentionListOpen && mentionItems.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setMentionIndex((i) => (i + 1) % mentionItems.length);
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setMentionIndex(
            (i) => (i - 1 + mentionItems.length) % mentionItems.length,
          );
          return;
        }
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          insertMention(mentionItems[safeMentionIndex]!);
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          if (mentionCtx) setSuppressMentionAt(mentionCtx.start);
          return;
        }
      }

      if (e.key === "Enter" && !e.shiftKey) {
        const ta = textareaRef.current;
        if (ta) {
          const res = applyEnterList(value, ta.selectionStart, ta.selectionEnd);
          if (res) {
            if (res.next.length <= MAX) {
              e.preventDefault();
              commitWithScroll(res.next, {
                start: res.cursor,
                end: res.cursor,
              });
            }
            return;
          }
        }
      }

      if (e.key === "b" && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
        e.preventDefault();
        applyShortcut("bold");
        return;
      }
      if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        applyShortcut("italic");
        return;
      }
      if (e.key === "u" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        applyCombiningShortcut(U_UNDER);
        return;
      }
      if (
        e.key === "x" &&
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey
      ) {
        e.preventDefault();
        applyCombiningShortcut(U_STRIKE);
        return;
      }
    };

    const onChangeArea = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const t = e.target;
      const next = normalizeNoEmDash(t.value);
      setSel({ start: t.selectionStart, end: t.selectionEnd });
      setCursor(t.selectionStart);
      if (!getActiveMentionQuery(next, t.selectionStart)) {
        setSuppressMentionAt(null);
      }
      if (next.length <= MAX) onEdit(next);
    };

    const onPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const raw = normalizeNoEmDash(e.clipboardData.getData("text/plain"));
      const converted = convertMarkdownPatternsToUnicode(raw);
      const ta = textareaRef.current;
      if (!ta) return;
      e.preventDefault();
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const merged = normalizeNoEmDash(
        value.slice(0, start) + converted + value.slice(end),
      );
      const cut = merged.slice(0, MAX);
      const pos = Math.min(start + converted.length, MAX);
      commitWithScroll(cut, { start: pos, end: pos });
    };

    const syncCursor = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
      const t = e.currentTarget;
      setSel({ start: t.selectionStart, end: t.selectionEnd });
      setCursor(t.selectionStart);
      if (mentionListOpen) {
        setMentionAnchor(getTextareaCaretClientPoint(t, t.selectionStart));
      }
      if (!getActiveMentionQuery(t.value, t.selectionStart)) {
        setSuppressMentionAt(null);
      }
    };

    const syncSelFromTextarea = useCallback(() => {
      const el = textareaRef.current;
      if (!el) return;
      setSel({ start: el.selectionStart, end: el.selectionEnd });
    }, []);

    return (
      <div
        className={cn(
          "flex min-h-[min(52vh,560px)] flex-col overflow-hidden rounded-2xl border bg-[var(--card)]",
          "sm:min-h-[min(68vh,640px)] md:min-h-[min(72vh,680px)]",
          "border-[var(--app-chrome-border)] shadow-[0_8px_40px_-12px_color-mix(in_oklab,var(--accent)_18%,transparent)]",
          "ring-1 ring-violet-500/[0.08] dark:ring-violet-400/10",
        )}
      >
        <UnicodeFormatToolbar
          ref={barRef}
          textareaRef={textareaRef}
          value={value}
          formatActive={formatActive}
          onCommit={commitFromToolbar}
          onAfterCommit={syncSelFromTextarea}
          onEmoji={onEmoji}
          onImage={onImage}
          canUndo={canUndo}
          canRedo={canRedo}
          onUndo={onUndo}
          onRedo={onRedo}
        />

        <div className="mx-auto flex min-h-0 w-full max-w-[min(100%,720px)] flex-1 flex-col px-2.5 pt-1 sm:px-5">
          <div
            className={cn(
              "relative flex min-h-[min(34vh,300px)] flex-1 flex-col overflow-hidden rounded-xl border sm:min-h-[min(40vh,360px)]",
              "border-[var(--app-chrome-border)] bg-[var(--background)]",
            )}
          >
            {value.length === 0 && (
              <div
                className="pointer-events-none absolute left-6 top-5 z-0 max-h-[min(48vh,380px)] max-w-[calc(100%-3rem)] overflow-hidden text-[16px] leading-[1.65] text-[var(--app-chrome-muted)] sm:text-[17px]"
                aria-hidden
              >
                <p className="whitespace-pre-wrap">{EDITOR_EMPTY_PLACEHOLDER}</p>
              </div>
            )}
            <textarea
              ref={mergeRefs(innerRef, ref)}
              value={value}
              onChange={onChangeArea}
              onKeyDown={onKeyDown}
              onKeyUp={syncCursor}
              onClick={syncCursor}
              onSelect={syncCursor}
              onMouseUp={syncCursor}
              onScroll={syncCursor}
              onPaste={onPaste}
              spellCheck
              className={cn(
                "relative z-10 min-h-[min(30vh,260px)] w-full flex-1 resize-none bg-transparent px-4 py-4 sm:min-h-[min(36vh,320px)] sm:px-6 sm:py-5",
                "text-[16px] leading-[1.65] tracking-[-0.015em] text-[var(--foreground)] outline-none placeholder:text-[var(--app-chrome-muted)] sm:text-[17px]",
                "selection:bg-black/12 selection:text-[var(--foreground)] dark:selection:bg-white/18",
              )}
              aria-label="LinkedIn post draft"
            />
            {mentionListOpen && mentionCtx && mentionItems.length > 0 && (
              <MentionSuggestions
                items={mentionItems}
                highlightedIndex={safeMentionIndex}
                onHighlight={setMentionIndex}
                onPick={insertMention}
                anchor={mentionAnchor}
              />
            )}
          </div>
        </div>

        <EditorFooterBar
          charCount={value.length}
          max={MAX}
          warnAt={WARN}
          onReset={onResetDraft}
          canReset={value.length > 0}
          onCopy={onCopyText}
        />
      </div>
    );
  },
);
