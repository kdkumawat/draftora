"use client";

import { Wifi, Zap } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export function LandingHero() {
  return (
    <div className="mb-4 sm:mb-5 lg:mb-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
        <div className="min-w-0 text-center lg:flex-1 lg:text-left">
          <h1 className="text-balance text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl lg:text-[1.75rem] lg:leading-tight">
            Draft{" "}
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-violet-600 bg-clip-text text-transparent dark:from-violet-400 dark:via-fuchsia-400 dark:to-violet-400">
              {" "}
              Formatted LinkedIn posts
            </span>
          </h1>
          <p className="mx-auto mt-2 max-w-2xl text-pretty text-[14px] leading-snug text-[var(--app-chrome-muted)] sm:text-[15px] lg:mx-0 lg:max-w-xl">
            Paste **markdown** markers - we convert to Unicode. Mentions, hashtags, one
            workspace.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 lg:items-end lg:pt-0.5">
          <div className="flex max-w-full flex-wrap justify-center gap-2 lg:justify-end">
            <p
              className={cn(
                "inline-flex max-w-full items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12px] font-medium leading-tight shadow-sm",
                "border-violet-200/90 bg-[color-mix(in_oklab,#f5f3ff_92%,white)] text-violet-950",
                "dark:border-violet-500/28 dark:bg-violet-950/55 dark:text-violet-50",
              )}
              role="status"
            >
              <Zap
                className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-300"
                strokeWidth={2.25}
                aria-hidden
              />
              <span className="text-left">
                Unicode formatting · Paste markdown · Live preview
              </span>
            </p>
            <p
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[12px] font-medium leading-tight shadow-sm",
                "border-violet-200/90 bg-[color-mix(in_oklab,#f5f3ff_92%,white)] text-violet-950",
                "dark:border-violet-500/28 dark:bg-violet-950/55 dark:text-violet-50",
              )}
              role="status"
            >
              <Wifi
                className="h-3.5 w-3.5 shrink-0 text-violet-600 dark:text-violet-300"
                strokeWidth={2.25}
                aria-hidden
              />
              Works offline
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
