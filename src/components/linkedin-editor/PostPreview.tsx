"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { renderDocument } from "@/lib/parser/renderNodes";
import { parseDocument } from "@/lib/parser/tokenize";
import { cn } from "@/lib/utils/cn";

export type PostPreviewProps = {
  text: string;
  className?: string;
  /** Local preview images (e.g. object URLs); shown under the post body */
  attachmentUrls?: string[];
};

/**
 * LinkedIn-style body: visual line clamp + DOM overflow detection (no string slicing).
 * Mobile: 2 lines; md+: 3 lines; expand / see less with optional fade.
 */
export function PostPreview({
  text,
  className,
  attachmentUrls = [],
}: PostPreviewProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  /** After user opens “…more”, keep “see less” until they collapse or text clears */
  const [openedFromClamp, setOpenedFromClamp] = useState(false);

  const doc = useMemo(() => parseDocument(text), [text]);

  const measure = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;

    if (expanded) {
      setIsOverflowing(false);
      return;
    }

    const overflow = el.scrollHeight > el.clientHeight + 1;
    setIsOverflowing(overflow);
  }, [expanded]);

  useLayoutEffect(() => {
    measure();
  }, [measure, text, expanded]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const ro = new ResizeObserver(() => {
      requestAnimationFrame(measure);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure]);

  useEffect(() => {
    const onResize = () => requestAnimationFrame(measure);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [measure]);

  useEffect(() => {
    if (!text.trim()) {
      setExpanded(false);
      setOpenedFromClamp(false);
    }
  }, [text]);

  const showMore = !expanded && isOverflowing;
  const showSeeLess = expanded && openedFromClamp;

  return (
    <div className={className}>
      {/* Clamp + …more are scoped to the text block only so they never overlap attachments */}
      <div className="relative">
        <div
          ref={contentRef}
          className={cn(
            "preview-li-body text-[14px] leading-normal",
            "text-[rgba(0,0,0,0.72)] dark:text-[#c4c4c4]",
            "whitespace-pre-wrap break-words [overflow-wrap:anywhere]",
            !expanded && "line-clamp-2 md:line-clamp-3 overflow-hidden",
            expanded && "transition-[opacity] duration-200 ease-out",
          )}
          style={{
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          }}
        >
          {renderDocument(doc)}
        </div>

        {showMore ? (
          <div className="pointer-events-none absolute bottom-0 right-0 z-10 flex max-w-[100%] items-end justify-end">
            <div
              className="pointer-events-none absolute bottom-0 right-0 h-[1.35em] w-[4.5rem] bg-gradient-to-l from-white from-40% to-transparent dark:from-[#1d2226]"
              aria-hidden
            />
            <button
              type="button"
              onClick={() => {
                setExpanded(true);
                setOpenedFromClamp(true);
              }}
              className={cn(
                "pointer-events-auto relative inline cursor-pointer border-0 bg-transparent p-0 pl-1 text-right text-[14px]",
                "text-[rgba(0,0,0,0.55)] transition-colors hover:text-[#0a66c2] hover:underline",
                "dark:text-[#a8a8a8] dark:hover:text-[#70b5f9]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2]/35 focus-visible:ring-offset-1",
              )}
              aria-label="See more"
            >
              <span aria-hidden className="text-[rgba(0,0,0,0.6)] dark:text-[#b7b7b7]">
                …
              </span>
              <span className="font-normal">more</span>
            </button>
          </div>
        ) : null}
      </div>

      {showSeeLess ? (
        <button
          type="button"
          onClick={() => {
            setExpanded(false);
            setOpenedFromClamp(false);
            requestAnimationFrame(() => measure());
          }}
          className={cn(
            "mt-1 inline-block border-0 bg-transparent p-0 text-left text-[14px] font-normal",
            "text-[#666666] transition-colors hover:text-[#191919] hover:underline",
            "dark:text-[#a4a4a4] dark:hover:text-[#f3f3f3]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2]/35",
          )}
        >
          …see less
        </button>
      ) : null}

      {attachmentUrls.length > 0 ? (
        <div className="mt-2 flex flex-col gap-2">
          {attachmentUrls.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative aspect-[1.91/1] w-full overflow-hidden border border-black/[0.08] bg-black/[0.04] dark:border-white/[0.12] dark:bg-white/[0.04]"
            >
              <Image
                src={src}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 555px) 100vw, 555px"
                unoptimized
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
