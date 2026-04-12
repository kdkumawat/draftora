"use client";

import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Globe,
  MessageCircle,
  MoreHorizontal,
  Repeat2,
  Send,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";
import { PostPreview } from "@/components/linkedin-editor/PostPreview";
import { cn } from "@/lib/utils/cn";

/** Feed preview avatar - place `public/IMG_1165_small.PNG` in the project */
const PREVIEW_AVATAR = "/IMG_1165_small.png";

const LI_MUTED = "#666666";
const PROFILE_URL = "https://www.linkedin.com/in/kdkumawat";

type PreviewCardProps = {
  fullPlain: string;
  isEmpty: boolean;
  authorName?: string;
  authorTitle?: string;
  /** Visual width hint for the card shell */
  frame?: "mobile" | "desktop";
};

export function PreviewCard({
  fullPlain,
  isEmpty,
  authorName = "Kuldeep Kumawat",
  authorTitle = "Designing distributed systems that don't fail at scale | Node.js · Go · Kafka · AWS · K8s",
  frame = "desktop",
}: PreviewCardProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full overflow-hidden rounded-lg border bg-white",
        "border-black/[0.08] shadow-[0_1px_2px_rgba(0,0,0,0.08)]",
        "dark:border-white/[0.12] dark:bg-[#1d2226] dark:shadow-[0_1px_2px_rgba(0,0,0,0.4)]",
        "transition-[max-width] duration-300 ease-out",
        frame === "mobile" ? "max-w-[390px]" : "max-w-[555px]",
      )}
    >
      <div className="relative px-3 pt-3 sm:px-4 sm:pt-3.5">
        <div className="flex gap-2 sm:gap-3">
          <Link
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-1 ring-black/[0.08] dark:ring-white/10"
            aria-label={`${authorName} on LinkedIn`}
          >
            <Image
              src={PREVIEW_AVATAR}
              alt=""
              fill
              className="object-cover"
              sizes="48px"
            />
          </Link>

          <div className="min-w-0 flex-1 pr-1">
            <div className="flex flex-wrap items-center gap-x-1 gap-y-0">
              <Link
                href={PROFILE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] font-semibold leading-tight text-[#191919] hover:text-[#0a66c2] hover:underline dark:text-[#f3f3f3]"
              >
                {authorName}
              </Link>
              <span
                className="inline-flex h-[18px] w-[18px] items-center justify-center text-[#0a66c2]"
                title="Verified"
              >
                <BadgeCheck className="h-[15px] w-[15px]" strokeWidth={2} aria-hidden />
              </span>
              <span className="text-[12px]" style={{ color: LI_MUTED }}>
                •
              </span>
              <span className="text-[12px] font-normal" style={{ color: LI_MUTED }}>
                You
              </span>
            </div>
            <p
              className="mt-0.5 line-clamp-1 text-[12px] leading-snug"
              style={{ color: LI_MUTED }}
              title={authorTitle}
            >
              {authorTitle}
            </p>
            <div
              className="mt-1 flex items-center gap-1 text-[12px]"
              style={{ color: LI_MUTED }}
            >
              <span>now</span>
              <span aria-hidden>•</span>
              <span className="inline-flex items-center gap-0.5" title="Public">
                <Globe className="h-3 w-3 shrink-0 opacity-90" aria-hidden />
              </span>
            </div>
          </div>

          <button
            type="button"
            className="h-8 w-8 shrink-0 self-start rounded-full text-[#666666] transition-colors hover:bg-black/[0.06] dark:text-[#a4a4a4] dark:hover:bg-white/[0.08]"
            aria-label="Open control menu for this post"
          >
            <MoreHorizontal className="mx-auto h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="px-3 pb-2 pt-2 sm:px-4 sm:pb-2.5 sm:pt-2.5">
        {isEmpty ? (
          <p
            className="text-[14px] leading-[1.35]"
            style={{ color: LI_MUTED }}
          >
            Start writing and your post will appear here. Mentions, hashtags, links, and
            Unicode bold/italic copy as plain text into LinkedIn.
          </p>
        ) : (
          <PostPreview text={fullPlain} />
        )}
      </div>

      <div className="flex items-center justify-between px-3 pb-1 pt-0.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-1.5">
          <span className="flex -space-x-1" aria-hidden>
            <ReactionDot className="z-30 border border-white bg-[#378fe9] dark:border-[#1d2226]" />
            <ReactionDot className="z-20 border border-white bg-[#df704d] dark:border-[#1d2226]" />
            <ReactionDot className="z-10 border border-white bg-[#6dae4f] dark:border-[#1d2226]" />
          </span>
          <span
            className="truncate text-[12px] leading-tight"
            style={{ color: LI_MUTED }}
          >
            You and 1,124 others
          </span>
        </div>
        <span
          className="shrink-0 text-[12px] leading-tight"
          style={{ color: LI_MUTED }}
        >
          150 comments
        </span>
      </div>

      <div className="mx-3 h-px bg-black/[0.08] dark:bg-white/10 sm:mx-4" />

      <div className="grid grid-cols-4 gap-0 px-0.5 pb-1.5 pt-0.5 sm:px-1 sm:pb-2">
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
      className="flex flex-col items-center gap-0.5 rounded py-2 text-[#666666] transition-colors hover:bg-black/[0.04] dark:text-[#a4a4a4] dark:hover:bg-white/[0.06]"
    >
      <Icon className="h-[22px] w-[22px]" strokeWidth={1.65} />
      <span className="text-[12px] font-semibold">{label}</span>
    </button>
  );
}
