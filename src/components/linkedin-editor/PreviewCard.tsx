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
import { InstantTooltip } from "@/components/linkedin-editor/InstantTooltip";
import { PostPreview } from "@/components/linkedin-editor/PostPreview";
import { LI_REACTION_STACK } from "@/lib/linkedin/reactionAssets";
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
  /** Feed preview images (e.g. object URLs from the editor) */
  attachmentUrls?: string[];
};

export function PreviewCard({
  fullPlain,
  isEmpty,
  authorName = "Kuldeep Kumawat",
  authorTitle = "Designing distributed systems that don't fail at scale | Node.js · Go · Kafka · AWS · K8s",
  frame = "desktop",
  attachmentUrls = [],
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
        {isEmpty && attachmentUrls.length === 0 ? (
          <p
            className="text-[14px] leading-[1.35]"
            style={{ color: LI_MUTED }}
          >
            Start writing and your post will appear here. Mentions, hashtags, links, and
            Unicode bold/italic copy as plain text into LinkedIn.
          </p>
        ) : (
          <PostPreview text={fullPlain} attachmentUrls={attachmentUrls} />
        )}
      </div>

      <div className="flex items-center justify-between gap-2 px-3 pb-1 pt-0.5 sm:px-4">
        
          <div className="flex min-w-0 flex-1 cursor-default items-center gap-1.5 overflow-hidden">
            <span className="flex shrink-0 -space-x-1.5" aria-hidden>
              {LI_REACTION_STACK.map(({ src, alt }) => (
                <span
                  key={src}
                  className="relative inline-block h-4 w-4 shrink-0 overflow-hidden rounded-full ring-2 ring-white dark:ring-[#1d2226]"
                >
                  {/* Native img: LinkedIn CDN + reliable preview outside Image optimizer */}
                  <img
                    src={src}
                    alt={alt}
                    width={16}
                    height={16}
                    className="block h-4 w-4 object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
              ))}
            </span>
            <span
              className="min-w-0 truncate text-[12px] leading-tight"
              style={{ color: LI_MUTED }}
            >
              Alex Chen and 1,124 others
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

      <div className="flex w-full px-0 pb-1.5 pt-0.5 sm:pb-2">
        <FooterAction
          icon={ThumbsUp}
          label="Like"
          variant="like"
          active
        />
        <FooterAction icon={MessageCircle} label="Comment" />
        <FooterAction icon={Repeat2} label="Repost" />
        <FooterAction icon={Send} label="Send" />
      </div>
    </div>
  );
}

function FooterAction({
  icon: Icon,
  label,
  active,
  variant = "default",
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  variant?: "default" | "like";
}) {
  const isLike = variant === "like";
  const likeOn = isLike && active;

  return (
    <button
      type="button"
      className={cn(
        "flex min-h-[44px] flex-1 flex-row items-center justify-center gap-2 px-1 py-2 transition-colors",
        "hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
        likeOn
          ? "text-[#0a66c2] dark:text-[#70b5f9]"
          : "text-[#666666] dark:text-[#a4a4a4]",
      )}
    >
      {likeOn ? (
        <>
          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#378fe9]">
            <ThumbsUp className="h-2.5 w-2.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-[13px] font-semibold leading-none">{label}</span>
        </>
      ) : (
        <>
          <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.65} />
          <span className="text-[13px] font-semibold leading-none">{label}</span>
        </>
      )}
    </button>
  );
}
