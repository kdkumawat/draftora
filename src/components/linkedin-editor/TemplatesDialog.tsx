"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type TemplateItem = {
  id: string;
  title: string;
  body: string;
};

const DEFAULT_TEMPLATES: TemplateItem[] = [
  {
    id: "hook",
    title: "Bold hook",
    body: "I almost gave up on this - then one shift changed everything:\n\n",
  },
  {
    id: "story",
    title: "Short story arc",
    body: "Here’s what happened (and what I’d do differently next time):\n\n1. \n2. \n3. \n\nThe lesson:\n",
  },
  {
    id: "cta",
    title: "Engagement CTA",
    body: "What would you add? Drop a comment - I read every one.\n\n#Leadership #Growth",
  },
  {
    id: "list",
    title: "List post",
    body: "3 things I wish I knew earlier:\n\n• \n• \n• \n\nWhich resonates most?",
  },
  {
    id: "thread",
    title: "Line break spacer",
    body: "Big idea in one line.\n\nSupporting detail that earns the scroll.\n\nTry it on your next post.",
  },
];

type TemplatesDialogProps = {
  open: boolean;
  onClose: () => void;
  onPick: (body: string) => void;
};

export function TemplatesDialog({
  open,
  onClose,
  onPick,
}: TemplatesDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close templates"
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity duration-200"
        onClick={onClose}
      />
      <div
        className={cn(
          "relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-[var(--app-chrome-border)] bg-[var(--card)]",
          "shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)] dark:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.6)]",
          "transition-opacity duration-200",
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="templates-title"
      >
        <div className="flex items-center justify-between border-b border-[var(--app-chrome-border)] px-5 py-4">
          <h2 id="templates-title" className="text-base font-medium text-[var(--foreground)]">
            Templates
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "rounded-lg p-2 text-[var(--app-chrome-muted)] transition-colors",
              "hover:bg-black/[0.05] hover:text-[var(--foreground)] dark:hover:bg-white/[0.08]",
            )}
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="max-h-[min(60vh,420px)] divide-y divide-[var(--app-chrome-border)] overflow-auto p-2">
          {DEFAULT_TEMPLATES.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => {
                  onPick(t.body);
                  onClose();
                }}
                className={cn(
                  "w-full rounded-xl px-3 py-3 text-left transition-colors duration-150",
                  "hover:bg-black/[0.03] dark:hover:bg-white/[0.05]",
                )}
              >
                <p className="font-medium text-[var(--foreground)]">{t.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-[var(--app-chrome-muted)]">
                  {t.body}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
