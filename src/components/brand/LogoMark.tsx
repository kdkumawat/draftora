import { cn } from "@/lib/utils/cn";

/** Inline SVG mark: document + pen, uses `currentColor` for light and dark themes. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      fill="none"
      className={cn("h-9 w-9 shrink-0", className)}
      aria-hidden
    >
      <path
        d="M8 3h11l7 7v19a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
        fill="currentColor"
        fillOpacity={0.12}
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <path
        d="M19 3v6h6"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M11 14h10M11 18h7"
        stroke="currentColor"
        strokeWidth={1.25}
        strokeLinecap="round"
        opacity={0.85}
      />
      <path
        d="M22 2l4 4-9 9-4 1 1-4 9-9z"
        fill="currentColor"
        fillOpacity={0.95}
        stroke="currentColor"
        strokeWidth={0.75}
        strokeLinejoin="round"
      />
      <path
        d="M17 15l2 2"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        opacity={0.5}
      />
    </svg>
  );
}
