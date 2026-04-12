"use client";

import { useTheme } from "next-themes";
import { CircleCheck, CircleX, Info, Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/utils/cn";

const toastShell = cn(
  "group flex w-full items-start gap-3 rounded-xl border p-3.5 pr-10 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.12)] sm:p-4",
  "border-[var(--app-chrome-border)] bg-[var(--card)] text-[var(--foreground)]",
  "dark:shadow-[0_12px_40px_-10px_rgba(0,0,0,0.55)]",
);

const toastClassNames = {
  toast: toastShell,
  title: "text-[15px] font-semibold leading-snug tracking-tight text-[var(--foreground)]",
  description:
    "text-[13px] leading-relaxed text-[var(--app-chrome-muted)] [&:not(:empty)]:mt-0.5",
  closeButton: cn(
    "left-auto right-2 top-2 border border-[var(--app-chrome-border)] bg-[var(--app-chrome-elevated)]",
    "text-[var(--foreground)] hover:bg-black/[0.06] dark:hover:bg-white/[0.08]",
    "rounded-lg [&_svg]:opacity-70",
  ),
  success: "border-l-[3px] border-l-[var(--accent)] pl-3.5 sm:pl-4",
  error: "border-l-[3px] border-l-red-500 pl-3.5 sm:pl-4",
  info: "border-l-[3px] border-l-[var(--accent)] pl-3.5 sm:pl-4",
  warning: "border-l-[3px] border-l-amber-500 pl-3.5 sm:pl-4",
  loading: "border-l-[3px] border-l-[var(--accent)] pl-3.5 sm:pl-4",
  icon: "mt-0.5 shrink-0 [&_svg]:size-[18px]",
};

const toasterIcons = {
  success: (
    <CircleCheck className="text-[var(--accent)]" strokeWidth={2.25} aria-hidden />
  ),
  info: <Info className="text-[var(--accent)]" strokeWidth={2.25} aria-hidden />,
  warning: (
    <Info className="text-amber-600 dark:text-amber-400" strokeWidth={2.25} aria-hidden />
  ),
  error: <CircleX className="text-red-500" strokeWidth={2.25} aria-hidden />,
  loading: (
    <Loader2 className="animate-spin text-[var(--accent)]" strokeWidth={2.25} aria-hidden />
  ),
};

export function ToasterClient() {
  const { resolvedTheme } = useTheme();
  const mounted = useIsClient();

  const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <Toaster
      position="top-center"
      closeButton
      richColors={false}
      theme={theme}
      offset="1rem"
      toastOptions={{
        duration: 4200,
        classNames: toastClassNames,
      }}
      className="toaster-draftora"
      icons={toasterIcons}
    />
  );
}
