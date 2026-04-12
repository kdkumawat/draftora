"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const steps = [
  {
    n: "1",
    title: "Write or paste",
    body: "Draft in the editor. Line breaks stay exactly as you type.",
  },
  {
    n: "2",
    title: "Style and enrich",
    body: "Use Unicode bold or italic, @mentions, #hashtags, and links.",
  },
  {
    n: "3",
    title: "Preview modes",
    body: "Switch mobile or desktop to see how the hook and see more behave.",
  },
  {
    n: "4",
    title: "Copy and publish",
    body: "Copy plain text and paste into LinkedIn. Formatting travels with the characters.",
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "How long can a LinkedIn post be?",
    a: "LinkedIn allows up to about 3,000 characters for typical feed posts. Draftora uses the same cap so your draft matches what you can paste.",
  },
  {
    q: "Is there a fee to use Draftora?",
    a: "No. It runs in your browser as a writing and preview helper. You still publish on LinkedIn itself.",
  },
  {
    q: "Why use the feed preview before posting?",
    a: "You can check line breaks, link detection, hashtags, and where the feed will cut off with see more before you switch tabs to LinkedIn.",
  },
  {
    q: "Will photos or carousels show in the preview?",
    a: "No. The preview focuses on text, mentions, hashtags, and links. Add media when you compose the real post on LinkedIn.",
  },
  {
    q: "Does the preview work on a phone browser?",
    a: "Yes. Use any modern phone, tablet, or desktop browser. The mobile and desktop toggles approximate different feed widths.",
  },
  {
    q: "How does Unicode bold or italic work?",
    a: "Formatting is stored as Unicode characters, not HTML. Copy and paste into LinkedIn keeps the look without a rich text editor.",
  },
  {
    q: "How do undo and redo work?",
    a: "Use the toolbar buttons or keyboard shortcuts. Typing is grouped into undo steps when you pause briefly.",
  },
];

type EditorSupportSectionsProps = {
  className?: string;
};

export function EditorSupportSections({ className }: EditorSupportSectionsProps) {
  const [openId, setOpenId] = useState<number | null>(0);

  return (
    <div
      className={cn(
        "mx-auto mt-6 max-w-6xl px-3 pb-12 sm:mt-8 sm:px-5 sm:pb-14 lg:px-6",
        className,
      )}
    >
      <div className="grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10 xl:gap-12">
        <section
          className={cn(
            "rounded-2xl border border-[var(--app-chrome-border)] bg-[var(--card)] p-6 sm:p-8",
          )}
          aria-labelledby="how-to-heading"
        >
          <h2
            id="how-to-heading"
            className="text-lg font-medium tracking-tight text-[var(--foreground)] sm:text-xl"
          >
            How to use Draftora
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--app-chrome-muted)]">
            A quick path from idea to LinkedIn-ready text. No rich HTML markup in your draft.
          </p>
          <ol className="mt-8 grid gap-5 sm:gap-6">
            {steps.map((s) => (
              <li key={s.n} className="flex gap-4">
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--app-chrome-border)]",
                    "bg-[var(--background)] text-sm font-medium text-[var(--foreground)]",
                  )}
                >
                  {s.n}
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-[var(--foreground)]">{s.title}</p>
                  <p className="mt-1 text-[15px] leading-relaxed text-[var(--app-chrome-muted)]">
                    {s.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="faq-heading">
          <h2
            id="faq-heading"
            className="text-lg font-medium tracking-tight text-[var(--foreground)] sm:text-xl"
          >
            Frequently asked questions
          </h2>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--app-chrome-muted)]">
            Short answers about limits, preview, and formatting.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            {faqs.map((item, i) => {
              const open = openId === i;
              return (
                <div
                  key={i}
                  className={cn(
                    "overflow-hidden rounded-xl border border-[var(--app-chrome-border)] bg-[var(--card)]",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : i)}
                    className={cn(
                      "flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-[15px] transition-colors sm:px-5 sm:py-4",
                      "hover:bg-black/[0.02] dark:hover:bg-white/[0.04]",
                    )}
                    aria-expanded={open}
                  >
                    <span className="font-medium leading-snug text-[var(--foreground)]">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 shrink-0 text-[var(--app-chrome-muted)] transition-transform duration-200",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                  {open && (
                    <div className="border-t border-[var(--app-chrome-border)] bg-[var(--background)] px-4 pb-4 pt-0 sm:px-5 sm:pb-5">
                      <p className="pt-3 text-[15px] leading-relaxed text-[var(--app-chrome-muted)] sm:pt-4">
                        {item.a}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
