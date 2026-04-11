"use client";

import Link from "next/link";
import { LayoutTemplate } from "lucide-react";
import { LogoMark } from "@/components/brand/LogoMark";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useRipple } from "@/hooks/useRipple";
import { cn } from "@/lib/utils/cn";

const TAGLINE =
  "Plain-text LinkedIn posts - Unicode styling, mentions, and live feed preview.";

function LinkedInGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const navLinkClass = cn(
  "inline-flex items-center rounded-lg border border-[var(--app-chrome-border)] bg-[var(--app-chrome-elevated)] px-3 py-2 text-sm font-medium",
  "text-[var(--foreground)] transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
  "hover:bg-black/[0.05] hover:shadow-sm dark:hover:bg-white/[0.07]",
  "active:scale-[0.98] active:duration-100",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--foreground)]/15",
);

type HeaderProps = {
  onTemplates: () => void;
  activePage?: "editor" | "docs";
};

function TemplatesButton({ onTemplates }: { onTemplates: () => void }) {
  const { ripples, onPointerDown, removeRipple } = useRipple();
  return (
    <button
      type="button"
      onClick={onTemplates}
      onPointerDown={onPointerDown}
      className={cn(
        "relative inline-flex items-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-sm font-medium",
        "bg-[var(--accent)] text-[var(--accent-on-accent)]",
        "shadow-[0_4px_20px_-4px_color-mix(in_oklab,var(--accent)_45%,transparent)]",
        "transition-[transform,box-shadow,filter] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:brightness-105 hover:shadow-[0_6px_24px_-4px_color-mix(in_oklab,var(--accent)_50%,transparent)]",
        "active:scale-[0.97] active:duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40",
      )}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/35"
          style={{
            left: r.x,
            top: r.y,
            width: 48,
            height: 48,
            transform: "translate(-50%, -50%)",
            animation:
              "press-ripple 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
          onAnimationEnd={() => removeRipple(r.id)}
        />
      ))}
      <span className="relative z-[1] inline-flex items-center gap-2">
        <LayoutTemplate className="h-4 w-4 opacity-95" strokeWidth={2} />
        Templates
      </span>
    </button>
  );
}

function FollowLinkedInLink() {
  const { ripples, onPointerDown, removeRipple } = useRipple();
  return (
    <a
      href="https://www.linkedin.com/in/kdkumawat/"
      target="_blank"
      rel="noopener noreferrer"
      onPointerDown={onPointerDown}
      className={cn(
        "relative inline-flex items-center gap-2 overflow-hidden rounded-lg px-3 py-2 text-sm font-semibold text-white",
        "bg-[#0a66c2]",
        "transition-[transform,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:bg-[#004182] hover:shadow-md",
        "active:scale-[0.97] active:duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0a66c2]/45",
      )}
      aria-label="Follow on LinkedIn (opens in a new tab)"
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="pointer-events-none absolute rounded-full bg-white/25"
          style={{
            left: r.x,
            top: r.y,
            width: 48,
            height: 48,
            transform: "translate(-50%, -50%)",
            animation:
              "press-ripple 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
          onAnimationEnd={() => removeRipple(r.id)}
        />
      ))}
      <span className="relative z-[1] inline-flex items-center gap-2">
        <LinkedInGlyph className="h-4 w-4 shrink-0" />
        Follow
      </span>
    </a>
  );
}

export function Header({ onTemplates, activePage = "editor" }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-[var(--app-chrome-border)]",
        "bg-[var(--app-chrome)]/80 backdrop-blur-xl backdrop-saturate-150",
        "supports-[backdrop-filter]:bg-[var(--app-chrome)]/70",
      )}
    >
      <div className="mx-auto flex min-h-12 max-w-7xl flex-wrap items-center justify-between gap-x-3 gap-y-2 px-4 py-2 sm:min-h-14 sm:px-6 sm:py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-2.5">
          <Link href="/" className="text-[var(--accent)]" aria-label="Draftora home">
            <LogoMark className="h-8 w-8 sm:h-9 sm:w-9" />
          </Link>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
              <Link
                href="/"
                className="text-[15px] font-medium tracking-tight text-[var(--foreground)] hover:underline"
              >
                Draftora
              </Link>
              <span className="hidden text-[13px] leading-snug text-[var(--app-chrome-muted)] sm:inline">
                {TAGLINE}
              </span>
            </div>
            <p className="mt-0.5 text-[12px] leading-snug text-[var(--app-chrome-muted)] sm:hidden">
              Unicode styling &amp; live preview for LinkedIn.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {activePage === "docs" ? (
            <Link href="/" className={navLinkClass}>
              Editor
            </Link>
          ) : (
            <Link href="/docs" className={navLinkClass}>
              Docs
            </Link>
          )}
          <ThemeToggle />
          {activePage === "editor" && (
            <>
              <TemplatesButton onTemplates={onTemplates} />
              <FollowLinkedInLink />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
