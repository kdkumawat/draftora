"use client";

import { forwardRef, type ReactNode, useState } from "react";
import {
  Bold,
  Eraser,
  ImageIcon,
  IndentDecrease,
  IndentIncrease,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Smile,
  Strikethrough,
  Underline,
  Undo2,
  Wand2,
} from "lucide-react";
import {
  shiftIndent,
  toggleBulletBlock,
  toggleBulletLine,
  toggleNumberedBlock,
  toggleNumberedLine,
} from "@/lib/editor/lineOps";
import { beautifyPost } from "@/lib/post/beautify";
import { U_STRIKE, U_UNDER, toggleCombiningStyle } from "@/lib/unicode/combining";
import { stripAllUnicodeFormatting } from "@/lib/unicode/stripFormatting";
import { tt, ttRedo, ttShift } from "@/lib/editor/shortcutLabel";
import { readTextareaScroll, writeTextareaScroll } from "@/lib/editor/textareaScroll";
import { applyUnicodeStyle } from "@/lib/unicode/style";
import type { StyleKind } from "@/lib/unicode/style";
import type { ToolbarFormatState } from "@/lib/unicode/selectionFormat";
import { InstantTooltip } from "@/components/linkedin-editor/InstantTooltip";
import { useRipple } from "@/hooks/useRipple";
import { cn } from "@/lib/utils/cn";

const MAX = 3000;

export type UnicodeFormatToolbarProps = {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  formatActive?: ToolbarFormatState;
  onCommit: (next: string) => void;
  /** Fires after selection + scroll are restored (for syncing toolbar “pressed” state). */
  onAfterCommit?: () => void;
  onEmoji: () => void;
  onImage: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  /** When set, Beautify runs this (e.g. POST /api/beautify); otherwise local whitespace cleanup */
  onBeautifyAI?: (text: string) => Promise<string>;
};

export const UnicodeFormatToolbar = forwardRef<
  HTMLDivElement,
  UnicodeFormatToolbarProps
>(function UnicodeFormatToolbar(
  {
    textareaRef,
    value,
    formatActive,
    onCommit,
    onAfterCommit,
    onEmoji,
    onImage,
    canUndo,
    canRedo,
    onUndo,
    onRedo,
    onBeautifyAI,
  },
  ref,
) {
  const [beautifyBusy, setBeautifyBusy] = useState(false);
  const ta = () => textareaRef.current;

  const commit = (next: string, selStart?: number, selEnd?: number) => {
    if (next.length > MAX) return;
    const el0 = ta();
    const scroll = readTextareaScroll(el0);
    onCommit(next);
    requestAnimationFrame(() => {
      const el = ta();
      if (!el) return;
      el.focus();
      if (selStart !== undefined && selEnd !== undefined) {
        el.setSelectionRange(selStart, selEnd);
      }
      writeTextareaScroll(el, scroll.top, scroll.left);
      onAfterCommit?.();
    });
  };

  const apply = (kind: StyleKind) => {
    const el = ta();
    if (!el) return;
    const { next, selStart, selEnd } = applyUnicodeStyle(
      value,
      el.selectionStart,
      el.selectionEnd,
      kind,
    );
    commit(next, selStart, selEnd);
  };

  const applyCombining = (mark: typeof U_UNDER | typeof U_STRIKE) => {
    const el = ta();
    if (!el) return;
    const { next, selStart, selEnd } = toggleCombiningStyle(
      value,
      el.selectionStart,
      el.selectionEnd,
      mark,
    );
    commit(next, selStart, selEnd);
  };

  const onClearFormatting = () => {
    const el = ta();
    if (!el) return;
    const a = el.selectionStart;
    const b = el.selectionEnd;
    if (a === b) return;
    const sel = value.slice(a, b);
    const stripped = stripAllUnicodeFormatting(sel);
    const next = value.slice(0, a) + stripped + value.slice(b);
    commit(next, a, a + stripped.length);
  };

  const onBeautify = async () => {
    const el = ta();
    if (!el || beautifyBusy) return;
    setBeautifyBusy(true);
    try {
      let next: string;
      if (onBeautifyAI) {
        next = await onBeautifyAI(value);
      } else {
        next = beautifyPost(value);
      }
      if (next.length > MAX) return;
      const pos = Math.min(next.length, el.selectionStart);
      commit(next, pos, pos);
    } finally {
      setBeautifyBusy(false);
    }
  };

  const onLink = () => {
    const el = ta();
    if (!el) return;
    const raw = window.prompt("Paste URL (include https://)");
    if (raw == null || raw.trim() === "") return;
    let u = raw.trim();
    if (!/^https?:\/\//i.test(u)) u = `https://${u}`;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = value.slice(0, start) + u + value.slice(end);
    const pos = start + u.length;
    commit(next, pos, pos);
  };

  const onBullet = () => {
    const el = ta();
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const next =
      s === e ? toggleBulletLine(value, s) : toggleBulletBlock(value, s, e);
    if (next.length > MAX) return;
    const a = Math.min(s, e);
    const b = Math.max(s, e);
    const delta = next.length - value.length;
    commit(next, a, b + delta);
  };

  const onNumbered = () => {
    const el = ta();
    if (!el) return;
    const s = el.selectionStart;
    const e = el.selectionEnd;
    const next =
      s === e ? toggleNumberedLine(value, s) : toggleNumberedBlock(value, s, e);
    if (next.length > MAX) return;
    const a = Math.min(s, e);
    const b = Math.max(s, e);
    const delta = next.length - value.length;
    commit(next, a, b + delta);
  };

  const onIndent = (dir: "in" | "out") => {
    const el = ta();
    if (!el) return;
    const { next, selStart, selEnd } = shiftIndent(
      value,
      el.selectionStart,
      el.selectionEnd,
      dir,
    );
    if (next.length > MAX) return;
    commit(next, selStart, selEnd);
  };

  return (
    <div
      ref={ref}
      className="flex min-h-10 items-center border-b border-[var(--app-chrome-border)] bg-[var(--app-chrome)] sm:min-h-11"
      role="toolbar"
      aria-label="Formatting"
    >
      <div
        className={cn(
          "flex w-full min-w-0 flex-wrap items-center gap-x-0.5 gap-y-1 px-1.5 py-1.5 sm:px-2 sm:py-1.5",
          /* Phones: one scrollable row so the sheet stays short */
          "max-sm:flex-nowrap max-sm:overflow-x-auto max-sm:overflow-y-hidden max-sm:scrollbar-hide",
        )}
      >
        <ToolGroup>
          <ToolbarButton
            tooltip={tt("Bold", "B")}
            pressed={formatActive?.bold}
            onClick={() => apply("bold")}
          >
            <Bold className="h-[15px] w-[15px]" strokeWidth={2.5} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={tt("Italic", "I")}
            pressed={formatActive?.italic}
            onClick={() => apply("italic")}
          >
            <Italic className="h-[15px] w-[15px]" strokeWidth={2.5} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={tt("Underline", "U")}
            pressed={formatActive?.underline}
            onClick={() => applyCombining(U_UNDER)}
          >
            <Underline className="h-[15px] w-[15px]" strokeWidth={2.25} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={ttShift("Strikethrough", "X")}
            pressed={formatActive?.strike}
            onClick={() => applyCombining(U_STRIKE)}
          >
            <Strikethrough className="h-[15px] w-[15px]" strokeWidth={2.25} />
          </ToolbarButton>
        </ToolGroup>

        <Divider />

        <ToolGroup>
          <ToolbarButton tooltip="Emoji" onClick={onEmoji}>
            <Smile className="h-[15px] w-[15px]" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton tooltip="Image" onClick={onImage}>
            <ImageIcon className="h-[15px] w-[15px]" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton tooltip="Link" onClick={onLink}>
            <Link2 className="h-[15px] w-[15px]" strokeWidth={2} />
          </ToolbarButton>
        </ToolGroup>

        <Divider />

        <ToolGroup>
          <ToolbarButton
            tooltip={tt("Undo", "Z")}
            onClick={onUndo}
            disabled={!canUndo}
          >
            <Undo2 className="h-[15px] w-[15px]" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton
            tooltip={ttRedo()}
            onClick={onRedo}
            disabled={!canRedo}
          >
            <Redo2 className="h-[15px] w-[15px]" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton tooltip="Clear formatting" onClick={onClearFormatting}>
            <Eraser className="h-[15px] w-[15px]" strokeWidth={2} />
          </ToolbarButton>
        </ToolGroup>

        <Divider />

        <ToolGroup>
          <ToolbarButton tooltip="Bullet list" onClick={onBullet}>
            <List className="h-[15px] w-[15px]" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton tooltip="Numbered list" onClick={onNumbered}>
            <ListOrdered className="h-[15px] w-[15px]" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton tooltip="Indent" onClick={() => onIndent("in")}>
            <IndentIncrease className="h-[15px] w-[15px]" strokeWidth={2} />
          </ToolbarButton>
          <ToolbarButton tooltip="Outdent" onClick={() => onIndent("out")}>
            <IndentDecrease className="h-[15px] w-[15px]" strokeWidth={2} />
          </ToolbarButton>
        </ToolGroup>

        <Divider />

        <ToolGroup>
          <ToolbarButton
            tooltip="Beautify - spacing & line breaks"
            onClick={() => void onBeautify()}
            disabled={beautifyBusy}
            aiAccent
          >
            <Wand2
              className={cn(
                "h-[15px] w-[15px] text-violet-600 dark:text-violet-300",
                beautifyBusy && "opacity-50",
              )}
              strokeWidth={2.25}
            />
          </ToolbarButton>
        </ToolGroup>
      </div>
    </div>
  );
});

function ToolGroup({ children }: { children: ReactNode }) {
  return (
    <div className="flex shrink-0 flex-nowrap items-center gap-px rounded-md border border-[var(--app-chrome-border)] bg-[var(--app-chrome-elevated)] p-px">
      {children}
    </div>
  );
}

function Divider() {
  return (
    <span
      className="h-5 w-px shrink-0 self-center bg-[var(--app-chrome-border)]"
      aria-hidden
    />
  );
}

function ToolbarButton({
  tooltip,
  pressed,
  onClick,
  disabled,
  aiAccent,
  children,
}: {
  tooltip: string;
  pressed?: boolean;
  onClick: () => void;
  disabled?: boolean;
  /** Distinct styling for the Beautify / AI action */
  aiAccent?: boolean;
  children: ReactNode;
}) {
  const { ripples, onPointerDown, removeRipple } = useRipple();

  return (
    <InstantTooltip label={tooltip}>
      <button
        type="button"
        aria-label={tooltip}
        aria-pressed={pressed ?? false}
        disabled={disabled}
        onClick={onClick}
        onPointerDown={onPointerDown}
        className={cn(
          "relative z-0 inline-flex h-8 min-w-8 shrink-0 touch-manipulation items-center justify-center overflow-hidden rounded-md text-[var(--foreground)]/75",
          "transition-[transform,background-color,color,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform",
          "hover:bg-black/[0.07] hover:text-[var(--foreground)] hover:shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:hover:bg-white/[0.09] dark:hover:shadow-[0_1px_3px_rgba(0,0,0,0.25)]",
          "active:scale-[0.94] active:duration-100",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/20",
          pressed &&
            "bg-violet-500/28 text-violet-800 shadow-[inset_0_0_0_1px_rgba(109,40,217,0.35)] hover:bg-violet-500/34 hover:text-violet-900 dark:bg-violet-500/32 dark:text-violet-100 dark:shadow-[inset_0_0_0_1px_rgba(167,139,250,0.45)] dark:hover:bg-violet-500/40",
          aiAccent &&
            !pressed &&
            "bg-gradient-to-br from-violet-500/12 via-fuchsia-500/10 to-violet-600/12 text-violet-700 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.25)] hover:from-violet-500/18 hover:via-fuchsia-500/14 hover:to-violet-600/18 dark:from-violet-400/14 dark:via-fuchsia-400/10 dark:to-violet-500/14 dark:text-violet-100 dark:shadow-[inset_0_0_0_1px_rgba(167,139,250,0.35)]",
          disabled && "cursor-not-allowed opacity-40 hover:bg-transparent hover:shadow-none active:scale-100",
        )}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className="pointer-events-none absolute rounded-full bg-violet-600/25 dark:bg-violet-300/22"
            style={{
              left: r.x,
              top: r.y,
              width: 36,
              height: 36,
              transform: "translate(-50%, -50%)",
              animation:
                "press-ripple 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards",
            }}
            onAnimationEnd={() => removeRipple(r.id)}
          />
        ))}
        <span className="relative z-[1] inline-flex">{children}</span>
      </button>
    </InstantTooltip>
  );
}
