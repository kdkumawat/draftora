"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  Globe,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Send,
  ThumbsUp,
  X,
} from "lucide-react";
import { useMemo } from "react";
import { renderDocument } from "@/lib/parser/renderNodes";
import { parseDocument } from "@/lib/parser/tokenize";
import { getLinkedInFold, getSeeMoreFold } from "@/lib/linkedin/parse";
import { cn } from "@/lib/utils/cn";

/** Feed preview avatar - place `public/IMG_1165_small.PNG` in the project */
const PREVIEW_AVATAR = "/IMG_1165_small.png";

type PreviewCardProps = {
  fullPlain: string;
  isEmpty: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  authorName?: string;
  authorTitle?: string;
  /** Visual width hint for the card shell */
  frame?: "mobile" | "desktop";
};

export function PreviewCard({
  fullPlain,
  isEmpty,
  expanded,
  onToggleExpand,
  authorName = "Kuldeep Kumawat",
  authorTitle = "Designing distributed systems that don’t fail at scale",
  frame = "desktop",
}: PreviewCardProps) {
  const hookFold = useMemo(() => getLinkedInFold(fullPlain), [fullPlain]);
  const seeFold = useMemo(() => getSeeMoreFold(fullPlain), [fullPlain]);

  const hookDoc = useMemo(
    () => parseDocument(hookFold.visible),
    [hookFold.visible],
  );
  const mainPlain = expanded ? fullPlain : seeFold.visible;
  const mainDoc = useMemo(() => parseDocument(mainPlain), [mainPlain]);

  const showHookStrip = !isEmpty && hookFold.restHidden;
  const showSeeMore = !isEmpty && seeFold.restHidden;

  return (
    <div
      className={cn(
        "mx-auto w-full overflow-hidden rounded-2xl border bg-[var(--card)]",
        "border-[var(--app-chrome-border)] shadow-[0_0_0_1px_rgba(0,0,0,0.03)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.06)]",
        "transition-[max-width] duration-300 ease-out",
        frame === "mobile" ? "max-w-[390px]" : "max-w-[555px]",
      )}
    >
      <a href="https://www.linkedin.com/in/kdkumawat" target="_blank">
      <div className="relative px-4 pt-3">
        <div className="flex gap-2">
          <div
            className={cn(
              "relative h-12 w-12 shrink-0 overflow-hidden rounded-full shadow-sm ring-2",
              "ring-white dark:ring-zinc-800",
            )}
            aria-hidden
          >
            <Image
              src={PREVIEW_AVATAR}
              alt=""
              fill
              className="object-cover"
              sizes="48px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-1 gap-y-0.5">
              <span className="text-[14px] font-semibold leading-tight text-[#191919] dark:text-zinc-100">
                {authorName}
              </span>
              <LinkedInBadge />
              <span className="text-[12px] text-[#666666] dark:text-zinc-400">• 1st</span>
            </div>
            <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-[#666666] dark:text-zinc-400">
              {authorTitle}
            </p>
            <div className="mt-0.5 flex items-center gap-1 text-[12px] text-[#666666] dark:text-zinc-400">
              <span>now</span>
              <span>•</span>
              <Globe className="h-3 w-3" aria-hidden />
            </div>
          </div>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              className="rounded-full p-2 text-[#666666] transition-colors hover:bg-black/[0.04] dark:text-zinc-400 dark:hover:bg-white/[0.06]"
              aria-label="More"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="rounded-full p-2 text-[#666666] transition-colors hover:bg-black/[0.04] dark:text-zinc-400 dark:hover:bg-white/[0.06]"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
      </a>

      <div className="px-4 pb-2 pt-1">
        {showHookStrip && (
          <div className="mb-3 rounded-md border border-[#f3f2ef] bg-[#fafaf9] px-3 py-2 dark:border-zinc-700/80 dark:bg-zinc-800/60">
            <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[#999] dark:text-zinc-500">
              Hook preview (feed teaser)
            </p>
            <div className="whitespace-pre-wrap break-words text-[13px] leading-snug text-[#191919] dark:text-zinc-100">
              {renderDocument(hookDoc)}
            </div>
          </div>
        )}

        <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-[#999] dark:text-zinc-500">
          Post body
        </p>
        {isEmpty ? (
          <p className="text-[14px] leading-relaxed text-[#666666] dark:text-zinc-400">
            Start writing and your post will appear here. Mentions, hashtags, links, and
            Unicode bold/italic copy as plain text into LinkedIn.
          </p>
        ) : (
          <div className="space-y-1">
            <div
              className={cn(
                "relative min-h-0 text-[14px] leading-[1.45] text-[#191919] dark:text-zinc-100",
                !expanded && showSeeMore && "max-h-[5.75rem] overflow-hidden",
              )}
            >
              <div className="whitespace-pre-wrap break-words pr-1">
                {renderDocument(mainDoc)}
              </div>
              {!expanded && showSeeMore && (
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[4.25rem] bg-gradient-to-t from-[var(--card)] from-[15%] via-[color-mix(in_oklab,var(--card)_92%,transparent)] to-transparent"
                  aria-hidden
                />
              )}
              {!expanded && showSeeMore && (
                <button
                  type="button"
                  onClick={onToggleExpand}
                  className={cn(
                    "absolute bottom-0 left-0 z-10 inline-flex items-baseline gap-0 pb-0.5 pt-6 text-left",
                    "text-[14px] font-normal leading-snug tracking-tight text-[var(--li-see-more)]",
                    "transition-colors hover:text-[var(--li-see-more-hover)] hover:underline",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/20 focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--card)]",
                  )}
                  aria-label="See more"
                >
                  <span aria-hidden className="select-none">
                    …
                  </span>
                  <span>see more</span>
                </button>
              )}
            </div>
            {expanded && showSeeMore && (
              <button
                type="button"
                onClick={onToggleExpand}
                className={cn(
                  "inline-block text-left text-[14px] font-normal text-[var(--li-see-more)]",
                  "transition-colors hover:text-[var(--li-see-more-hover)] hover:underline",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2]/35",
                )}
              >
                see less
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-4 pb-1 pt-1">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="flex -space-x-1" aria-hidden>
            <ReactionDot className="z-30 border border-white bg-[#378fe9] dark:border-zinc-900" />
            <ReactionDot className="z-20 border border-white bg-[#df704d] dark:border-zinc-900" />
            <ReactionDot className="z-10 border border-white bg-[#6dae4f] dark:border-zinc-900" />
          </span>
          <span className="truncate text-[12px] text-[#666666] dark:text-zinc-400">
            You and 1124 others
          </span>
        </div>
        <span className="shrink-0 text-[12px] text-[#666666] dark:text-zinc-400">
          150 comments
        </span>
      </div>

      <div className="mx-4 h-px bg-[#f3f2ef] dark:bg-zinc-700/80" />

      <div className="grid grid-cols-4 gap-0 px-1 pb-2 pt-0.5">
        <FooterAction icon={ThumbsUp} label="Like" />
        <FooterAction icon={MessageCircle} label="Comment" />
        <FooterAction icon={Repeat2} label="Repost" />
        <FooterAction icon={Send} label="Send" />
      </div>
    </div>
  );
}

function ReactionDot({ className }: { className?: string }) {
  return (
    <span
      className={cn("inline-flex h-4 w-4 items-center justify-center rounded-full", className)}
    />
  );
}

function LinkedInBadge() {
  return (
    <span
      className="inline-flex h-4 w-4 items-center justify-center rounded-[2px] bg-[#0a66c2]"
      title="LinkedIn"
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-white" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    </span>
  );
}

function FooterAction({
  icon: Icon,
  label,
}: {
  icon: LucideIcon;
  label: string;
}) {
  return (
    <button
      type="button"
      className="flex flex-col items-center gap-1 rounded py-2 text-[#666666] transition-colors hover:bg-black/[0.04] dark:text-zinc-400 dark:hover:bg-white/[0.05]"
    >
      <Icon className="h-[22px] w-[22px]" strokeWidth={1.75} />
      <span className="text-[12px] font-semibold">{label}</span>
    </button>
  );
}
