"use client";

import type { ParsedDocument } from "@/lib/post/model";
import { renderDocument } from "@/lib/parser/renderNodes";
import { cn } from "@/lib/utils/cn";

type TokenPreviewProps = {
  doc: ParsedDocument;
  className?: string;
  label?: string;
};

export function TokenPreview({ doc, className, label }: TokenPreviewProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white to-slate-50/50 p-4 shadow-sm",
        className,
      )}
    >
      {label ? (
        <div className="mb-3 flex items-center gap-2">
          <span className="h-1 w-8 rounded-full bg-gradient-to-r from-[#0a66c2] to-cyan-500" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            {label}
          </p>
        </div>
      ) : null}
      <div
        className={cn(
          "whitespace-pre-wrap break-words text-[15px] leading-relaxed text-slate-800",
        )}
      >
        {renderDocument(doc)}
      </div>
    </div>
  );
}
