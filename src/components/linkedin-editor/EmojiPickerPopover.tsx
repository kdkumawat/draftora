"use client";

import dynamic from "next/dynamic";
import { useTheme } from "next-themes";
import { Theme } from "emoji-picker-react";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/utils/cn";

const EmojiPicker = dynamic(
  () => import("emoji-picker-react").then((m) => m.default),
  { ssr: false, loading: () => null },
);

export type EmojiAnchor = {
  top: number;
  left: number;
};

type EmojiPickerPopoverProps = {
  open: boolean;
  anchor: EmojiAnchor | null;
  onClose: () => void;
  onEmoji: (emoji: string) => void;
};

export function EmojiPickerPopover({
  open,
  anchor,
  onClose,
  onEmoji,
}: EmojiPickerPopoverProps) {
  const { resolvedTheme } = useTheme();
  const mounted = useIsClient();

  if (!open) return null;

  const style =
    anchor != null
      ? {
          top: anchor.top,
          left: anchor.left,
          transform: "translateX(-50%)",
        }
      : {
          bottom: 24,
          right: 24,
        };

  const pickerTheme =
    mounted && resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT;

  return (
    <>
      <button
        type="button"
        aria-label="Close emoji picker"
        className="fixed inset-0 z-40 cursor-default bg-transparent"
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed z-50 overflow-hidden rounded-2xl border border-stone-200/90 shadow-2xl shadow-stone-900/15",
          "dark:border-slate-600 dark:shadow-black/40",
          anchor == null && "bottom-6 right-6",
        )}
        style={style}
      >
        <EmojiPicker
          theme={pickerTheme}
          onEmojiClick={(e) => {
            onEmoji(e.emoji);
            onClose();
          }}
          width={320}
          height={400}
          previewConfig={{ showPreview: false }}
          skinTonesDisabled
        />
      </div>
    </>
  );
}
