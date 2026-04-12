"use client";

import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import { EmojiPickerPopover } from "@/components/linkedin-editor/EmojiPickerPopover";
import { EditorSupportSections } from "@/components/linkedin-editor/EditorSupportSections";
import { LandingHero } from "@/components/linkedin-editor/LandingHero";
import { Header } from "@/components/linkedin-editor/Header";
import { PlainPostEditor } from "@/components/linkedin-editor/PlainPostEditor";
import {
  PreviewModeToggle,
  type PreviewFrame,
} from "@/components/linkedin-editor/PreviewModeToggle";
import { PreviewCard } from "@/components/linkedin-editor/PreviewCard";
import { TemplatesDialog } from "@/components/linkedin-editor/TemplatesDialog";
import { useUndoHistory } from "@/hooks/useUndoHistory";
import { normalizeNoEmDash } from "@/lib/unicode/normalize";
import { cn } from "@/lib/utils/cn";

const MAX = 3000;

export function EditorPageClient() {
  const [value, setValueRaw] = useState("");
  const setValue = useCallback((v: string) => {
    setValueRaw(normalizeNoEmDash(v));
  }, []);

  const {
    onEdit,
    commitFromToolbar,
    undo,
    redo,
    resetHistory,
    canUndo,
    canRedo,
  } = useUndoHistory(value, setValue);

  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [emojiAnchor, setEmojiAnchor] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [mobileTab, setMobileTab] = useState<"write" | "preview">("write");
  const [previewFrame, setPreviewFrame] = useState<PreviewFrame>("desktop");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const resetDraft = useCallback(() => {
    if (value.length === 0) return;
    const ok = window.confirm(
      "Clear the entire draft? This removes all text and formatting.",
    );
    if (!ok) return;
    resetHistory();
    setValue("");
    requestAnimationFrame(() => textareaRef.current?.focus());
    toast.success("Draft cleared.");
  }, [value.length, resetHistory, setValue]);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied. Paste into LinkedIn's post box.");
    } catch {
      toast.error("Could not copy to clipboard.");
    }
  }, [value]);

  const openEmojiAtToolbar = useCallback(() => {
    const bar = toolbarRef.current;
    if (bar) {
      const r = bar.getBoundingClientRect();
      setEmojiAnchor({ top: r.bottom + 8, left: r.left + r.width / 2 });
    } else {
      setEmojiAnchor(null);
    }
    setEmojiOpen(true);
  }, []);

  const onImage = useCallback(() => {
    toast.message("Images and media", {
      description:
        "Add photos, videos, or documents when you create the post on LinkedIn after pasting your text.",
    });
  }, []);

  const handleEdit = useCallback(
    (v: string) => {
      onEdit(v);
    },
    [onEdit],
  );

  const handleCommit = useCallback(
    (v: string) => {
      commitFromToolbar(v);
    },
    [commitFromToolbar],
  );

  const insertEmoji = useCallback(
    (emoji: string) => {
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const merged = value.slice(0, start) + emoji + value.slice(end);
      if (merged.length > MAX) {
        toast.error(`Post is limited to ${MAX} characters.`);
        return;
      }
      handleCommit(merged);
      const pos = start + emoji.length;
      requestAnimationFrame(() => {
        ta.focus();
        ta.setSelectionRange(pos, pos);
      });
    },
    [value, handleCommit],
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      <div className="pointer-events-none fixed inset-0 vercel-page-bg" aria-hidden />

      <Header
        onTemplates={() => setTemplatesOpen(true)}
        activePage="editor"
      />

      <div className="relative mx-auto max-w-7xl px-3 py-2 sm:px-5 sm:py-3 lg:px-6">
        <LandingHero />

        <div className="mb-3 flex gap-2 md:hidden">
          <button
            type="button"
            onClick={() => setMobileTab("write")}
            className={cn(
              "flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200",
              mobileTab === "write"
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-on-accent)] shadow-[0_4px_20px_-4px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
                : "border-[var(--app-chrome-border)] bg-[var(--app-chrome-elevated)] text-[var(--app-chrome-muted)] hover:bg-black/[0.03] dark:hover:bg-white/[0.06]",
            )}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setMobileTab("preview")}
            className={cn(
              "flex-1 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200",
              mobileTab === "preview"
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-on-accent)] shadow-[0_4px_20px_-4px_color-mix(in_oklab,var(--accent)_45%,transparent)]"
                : "border-[var(--app-chrome-border)] bg-[var(--app-chrome-elevated)] text-[var(--app-chrome-muted)] hover:bg-black/[0.03] dark:hover:bg-white/[0.06]",
            )}
          >
            Preview
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1.22fr)_minmax(0,0.78fr)] md:items-start md:gap-6 lg:gap-8 xl:gap-10">
          <section
            className={cn(
              "min-w-0",
              mobileTab === "write" ? "block" : "hidden md:block",
            )}
          >
            <PlainPostEditor
              ref={textareaRef}
              toolbarRef={toolbarRef}
              value={value}
              onEdit={handleEdit}
              commitFromToolbar={handleCommit}
              onEmoji={openEmojiAtToolbar}
              onImage={onImage}
              onCopyText={copyToClipboard}
              onResetDraft={resetDraft}
              canUndo={canUndo}
              canRedo={canRedo}
              onUndo={undo}
              onRedo={redo}
            />
          </section>

          <aside
            className={cn(
              "min-w-0 md:sticky md:top-[4.25rem] lg:top-16",
              mobileTab === "preview" ? "block" : "hidden md:block",
            )}
          >
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--app-chrome-muted)]">
                  Feed preview
                </p>
                <p className="mt-0.5 hidden text-sm text-[var(--app-chrome-muted)] sm:block">
                  Hook teaser and post body
                </p>
              </div>
              <div className="shrink-0 self-start sm:self-center">
                <PreviewModeToggle value={previewFrame} onChange={setPreviewFrame} />
              </div>
            </div>
            <PreviewCard
              fullPlain={value}
              isEmpty={value.trim().length === 0}
              frame={previewFrame}
            />
          </aside>
        </div>

        <EditorSupportSections className="mt-5 sm:mt-8" />
      </div>

      <TemplatesDialog
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        onPick={(body) => {
          resetHistory();
          setValue(normalizeNoEmDash(body));
          requestAnimationFrame(() => textareaRef.current?.focus());
        }}
      />

      <EmojiPickerPopover
        open={emojiOpen}
        anchor={emojiAnchor}
        onClose={() => {
          setEmojiOpen(false);
          setEmojiAnchor(null);
        }}
        onEmoji={insertEmoji}
      />
    </div>
  );
}
