"use client";

import { Copy, RotateCcw } from "lucide-react";
import { useRipple } from "@/hooks/useRipple";
import { cn } from "@/lib/utils/cn";

function FooterResetButton({
  canReset,
  onReset,
}: {
  canReset: boolean;
  onReset: () => void;
}) {
  const { ripples, onPointerDown, removeRipple } = useRipple();
  return (
    <button
      type="button"
      onClick={onReset}
      disabled={!canReset}
      onPointerDown={onPointerDown}
      title={canReset ? "Clear the draft" : "Nothing to clear"}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg border border-[var(--app-chrome-border)] bg-transparent px-4 py-2.5 text-sm font-medium",
        "text-[var(--foreground)] transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:bg-black/[0.05] hover:shadow-sm dark:hover:bg-white/[0.07]",
        "active:scale-[0.97] active:duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/15",
        "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:active:scale-100",
      )}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-[var(--foreground)]/12 dark:bg-white/15"
          style={{
            left: r.x,
            top: r.y,
            width: 48,
            height: 48,
            transform: "translate(-50%, -50%)",
            animation:
              "press-ripple 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
          onAnimationEnd={() => removeRipple(r.id)}
        />
      ))}
      <span className="relative z-[1] inline-flex items-center gap-2">
        <RotateCcw className="h-4 w-4 opacity-80" strokeWidth={2.25} />
        Reset
      </span>
    </button>
  );
}

function FooterCopyButton({ onCopy }: { onCopy: () => void }) {
  const { ripples, onPointerDown, removeRipple } = useRipple();
  return (
    <button
      type="button"
      onClick={onCopy}
      onPointerDown={onPointerDown}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg border border-transparent px-5 py-2.5 text-sm font-medium",
        "bg-[var(--accent)] text-[var(--accent-on-accent)] shadow-[0_4px_22px_-6px_color-mix(in_oklab,var(--accent)_50%,transparent)]",
        "transition-[transform,box-shadow,filter] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:brightness-105 hover:shadow-[0_6px_26px_-6px_color-mix(in_oklab,var(--accent)_55%,transparent)]",
        "active:scale-[0.97] active:duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35",
      )}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/30"
          style={{
            left: r.x,
            top: r.y,
            width: 52,
            height: 52,
            transform: "translate(-50%, -50%)",
            animation:
              "press-ripple 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
          onAnimationEnd={() => removeRipple(r.id)}
        />
      ))}
      <span className="relative z-[1] inline-flex items-center gap-2">
        <Copy className="h-4 w-4 opacity-95" strokeWidth={2.25} />
        Copy text
      </span>
    </button>
  );
}

type EditorFooterBarProps = {
  charCount: number;
  max: number;
  warnAt: number;
  onReset: () => void;
  canReset: boolean;
  onCopy: () => void;
};

export function EditorFooterBar({
  charCount,
  max,
  warnAt,
  onReset,
  canReset,
  onCopy,
}: EditorFooterBarProps) {
  const tone =
    charCount >= max
      ? "text-red-600 dark:text-red-400"
      : charCount >= warnAt
        ? "text-amber-600 dark:text-amber-400"
        : "text-[var(--app-chrome-muted)]";

  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-[var(--app-chrome-border)] bg-[var(--app-chrome)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5",
      )}
    >
      <p className={cn("text-sm tabular-nums", tone)}>
        <span className="font-medium text-[var(--foreground)]">{charCount}</span>
        <span className="text-[var(--app-chrome-muted)]"> / {max}</span>
        {charCount >= warnAt && charCount < max && (
          <span className="ml-2 text-xs font-normal text-amber-600/90 dark:text-amber-400/90">
            Approaching limit
          </span>
        )}
        {charCount >= max && (
          <span className="ml-2 text-xs font-normal">Character limit reached</span>
        )}
      </p>
      <div className="flex flex-wrap items-center justify-end gap-2">
        <FooterResetButton canReset={canReset} onReset={onReset} />
        <FooterCopyButton onCopy={onCopy} />
      </div>
    </div>
  );
}
