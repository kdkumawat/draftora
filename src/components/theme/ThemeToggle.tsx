"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/utils/cn";

const btn =
  "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/20";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useIsClient();

  if (!mounted) {
    return (
      <div className="flex h-8 shrink-0 gap-0.5 rounded-full border border-transparent p-0.5" aria-hidden />
    );
  }

  return (
    <div
      className="flex shrink-0 gap-0.5 rounded-full border border-[var(--app-chrome-border)] bg-[var(--app-chrome-elevated)] p-0.5"
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => setTheme("system")}
        title="System"
        aria-pressed={theme === "system"}
        className={cn(
          btn,
          theme === "system"
            ? "bg-[var(--accent)] text-[var(--accent-on-accent)]"
            : "text-[var(--app-chrome-muted)] hover:text-[var(--foreground)]",
        )}
      >
        <Monitor className="h-4 w-4" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => setTheme("light")}
        title="Light"
        aria-pressed={theme === "light"}
        className={cn(
          btn,
          theme === "light"
            ? "bg-[var(--accent)] text-[var(--accent-on-accent)]"
            : "text-[var(--app-chrome-muted)] hover:text-[var(--foreground)]",
        )}
      >
        <Sun className="h-4 w-4" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        title="Dark"
        aria-pressed={theme === "dark"}
        className={cn(
          btn,
          theme === "dark"
            ? "bg-[var(--accent)] text-[var(--accent-on-accent)]"
            : "text-[var(--app-chrome-muted)] hover:text-[var(--foreground)]",
        )}
      >
        <Moon className="h-4 w-4" strokeWidth={2} />
      </button>
    </div>
  );
}
