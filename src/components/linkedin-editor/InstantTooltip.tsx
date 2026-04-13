"use client";

import { createPortal } from "react-dom";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Native `title` tooltips are delayed; this shows immediately above the anchor
 * (fixed to the viewport so parent overflow does not clip).
 */
export function InstantTooltip({
  label,
  children,
  multiline,
}: {
  label: string;
  children: ReactNode;
  /** Wider copy that may wrap (e.g. feed preview). Default: single-line toolbar style */
  multiline?: boolean;
}) {
  const [show, setShow] = useState(false);
  const anchorRef = useRef<HTMLSpanElement>(null);
  const [coords, setCoords] = useState({ top: 0, left: 0 });

  const position = useCallback(() => {
    const el = anchorRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCoords({ top: r.top, left: r.left + r.width / 2 });
  }, []);

  useEffect(() => {
    if (!show) return;
    position();
    const ro = () => position();
    window.addEventListener("scroll", ro, true);
    window.addEventListener("resize", ro);
    return () => {
      window.removeEventListener("scroll", ro, true);
      window.removeEventListener("resize", ro);
    };
  }, [show, position]);

  return (
    <>
      <span
        ref={anchorRef}
        className="inline-flex"
        onMouseEnter={() => {
          position();
          setShow(true);
        }}
        onMouseLeave={() => setShow(false)}
      >
        {children}
      </span>
      {show &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            role="tooltip"
            className={
              multiline
                ? "pointer-events-none fixed z-[9999] max-w-[min(100vw-1rem,280px)] whitespace-normal rounded-md border border-white/10 bg-[var(--foreground)] px-2 py-1 text-center text-[11px] font-medium leading-snug text-[var(--background)] shadow-lg"
                : "pointer-events-none fixed z-[9999] whitespace-nowrap rounded-md border border-white/10 bg-[var(--foreground)] px-2 py-1 text-[11px] font-medium text-[var(--background)] shadow-lg"
            }
            style={{
              left: coords.left,
              top: coords.top,
              transform: "translate(-50%, calc(-100% - 6px))",
            }}
          >
            {label}
          </div>,
          document.body,
        )}
    </>
  );
}
