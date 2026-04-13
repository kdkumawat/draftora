"use client";

import { Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function LandingHero() {
  return (
    <div className="mb-2 sm:mb-3 lg:mb-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0 text-left">
          <h1 className="text-balance text-xl font-semibold tracking-tight text-[var(--foreground)] sm:text-2xl lg:text-[1.65rem] lg:leading-snug">
            Draft{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-fuchsia-400 dark:to-violet-400">
              formatted LinkedIn posts
            </span>
          </h1>
          <p className="mt-1 hidden max-w-xl text-[13px] leading-snug text-[var(--app-chrome-muted)] sm:block sm:text-[14px]">
            Paste **markdown** markers - Unicode styling, mentions, and hashtags.
          </p>
        </div>
        <p
          className={cn(
            "hidden shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium leading-none shadow-sm lg:inline-flex",
            "border-violet-200/90 bg-[color-mix(in_oklab,#f5f3ff_92%,white)] text-violet-950",
            "dark:border-violet-500/28 dark:bg-violet-950/55 dark:text-violet-50",
          )}
          role="status"
        >
          <Zap
            className="h-3 w-3 shrink-0 text-violet-600 dark:text-violet-300"
            strokeWidth={2.25}
            aria-hidden
          />
          <span>Unicode · Markdown · Live preview · Offline</span>
        </p>
      </div>
    </div>
  );
}
