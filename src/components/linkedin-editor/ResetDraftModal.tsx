"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils/cn";

type ResetDraftModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ResetDraftModal({
  open,
  onClose,
  onConfirm,
}: ResetDraftModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) panelRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-draft-title"
        className={cn(
          "relative z-[1] w-full max-w-md rounded-2xl border border-[var(--app-chrome-border)] bg-[var(--card)] p-6 shadow-xl",
        )}
      >
        <h2
          id="reset-draft-title"
          className="text-lg font-semibold text-[var(--foreground)]"
        >
          Clear draft?
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--app-chrome-muted)]">
          This removes all text, formatting, and preview images. This cannot be undone.
        </p>
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[var(--app-chrome-border)] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-lg border border-transparent bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/40"
          >
            Clear draft
          </button>
        </div>
      </div>
    </div>
  );
}
