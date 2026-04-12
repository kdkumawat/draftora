"use client";

import type { ReactNode } from "react";
import { Monitor, Smartphone } from "lucide-react";
import { useRipple } from "@/hooks/useRipple";
import { cn } from "@/lib/utils/cn";

export type PreviewFrame = "mobile" | "desktop";

type PreviewModeToggleProps = {
  value: PreviewFrame;
  onChange: (v: PreviewFrame) => void;
};

function Segment({
  active,
  onClick,
  children,
  "aria-label": ariaLabel,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  "aria-label": string;
}) {
  const { ripples, onPointerDown, removeRipple } = useRipple();
  return (
    <button
      type="button"
      onClick={onClick}
      onPointerDown={onPointerDown}
      aria-label={ariaLabel}
      className={cn(
        "relative inline-flex items-center gap-1.5 overflow-hidden rounded-full px-3 py-1.5 text-xs font-medium",
        "transition-[transform,background-color,color] duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
        "active:scale-[0.96] active:duration-100",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/35",
        active
          ? "bg-[var(--accent)] text-[var(--accent-on-accent)] shadow-sm"
          : "text-[var(--app-chrome-muted)] hover:text-[var(--foreground)] hover:bg-black/[0.04] dark:hover:bg-white/[0.06]",
      )}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className={cn(
            "pointer-events-none absolute rounded-full",
            active ? "bg-white/30" : "bg-violet-600/20 dark:bg-violet-300/18",
          )}
          style={{
            left: r.x,
            top: r.y,
            width: 40,
            height: 40,
            transform: "translate(-50%, -50%)",
            animation:
              "press-ripple 0.55s cubic-bezier(0.4, 0, 0.2, 1) forwards",
          }}
          onAnimationEnd={() => removeRipple(r.id)}
        />
      ))}
      <span className="relative z-[1] inline-flex items-center gap-1.5">
        {children}
      </span>
    </button>
  );
}

export function PreviewModeToggle({ value, onChange }: PreviewModeToggleProps) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full border border-[var(--app-chrome-border)] bg-[var(--app-chrome-elevated)] p-0.5",
      )}
      role="group"
      aria-label="Preview width"
    >
      <Segment
        active={value === "mobile"}
        onClick={() => onChange("mobile")}
        aria-label="Mobile preview width"
      >
        <Smartphone className="h-3.5 w-3.5" strokeWidth={2.25} />
        <span className="hidden sm:inline">Mobile</span>
      </Segment>
      <Segment
        active={value === "desktop"}
        onClick={() => onChange("desktop")}
        aria-label="Desktop preview width"
      >
        <Monitor className="h-3.5 w-3.5" strokeWidth={2.25} />
        <span className="hidden sm:inline">Desktop</span>
      </Segment>
    </div>
  );
}
