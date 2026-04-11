"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Header } from "@/components/linkedin-editor/Header";
import { DOC_SECTIONS } from "@/lib/docs/content";
import { cn } from "@/lib/utils/cn";

function normalize(q: string): string {
  return q.trim().toLowerCase();
}

function sectionMatches(section: (typeof DOC_SECTIONS)[0], q: string): boolean {
  if (!q) return true;
  const hay = [
    section.title,
    section.summary,
    ...section.keywords,
    ...section.body,
  ]
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

function DocsSearchInput({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (v: string) => void;
  id?: string;
}) {
  return (
    <div className="relative">
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--app-chrome-muted)]"
        aria-hidden
      />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search docs…"
        autoComplete="off"
        className={cn(
          "w-full min-h-[44px] rounded-xl border border-[var(--app-chrome-border)] bg-[var(--background)] py-2.5 pl-10 pr-3",
          "text-[16px] text-[var(--foreground)] outline-none placeholder:text-[var(--app-chrome-muted)] sm:text-[15px]",
          "ring-1 ring-transparent transition-shadow focus:border-[var(--accent)]/40 focus:ring-[var(--accent)]/20",
        )}
        aria-label="Search documentation"
      />
    </div>
  );
}

export function DocsPageClient() {
  const [query, setQuery] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return DOC_SECTIONS.filter((s) => sectionMatches(s, q));
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileNavOpen]);

  const navLinkClass = cn(
    "flex min-h-[44px] items-center rounded-lg px-3 py-2.5 text-left text-[14px] leading-snug transition-colors",
    "text-[var(--foreground)]/85 hover:bg-black/[0.05] dark:hover:bg-white/[0.06]",
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="pointer-events-none fixed inset-0 vercel-page-bg" aria-hidden />

      <Header onTemplates={() => {}} activePage="docs" />

      <div className="relative mx-auto flex max-w-7xl flex-col lg:flex-row lg:items-start">
        {/* Mobile: open menu + title */}
        <div className="sticky top-12 z-30 flex items-center gap-3 border-b border-[var(--app-chrome-border)] bg-[var(--background)]/90 px-4 py-3 backdrop-blur-md sm:top-14 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[var(--app-chrome-border)] bg-[var(--card)] text-[var(--foreground)] active:scale-[0.98]"
            aria-expanded={mobileNavOpen}
            aria-controls="docs-sidebar"
            aria-label="Open documentation navigation"
          >
            <Menu className="h-5 w-5" strokeWidth={2} />
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold text-[var(--foreground)]">
              Documentation
            </p>
            <p className="truncate text-[12px] text-[var(--app-chrome-muted)]">
              On this page
            </p>
          </div>
          <Link
            href="/"
            className="shrink-0 rounded-lg px-3 py-2 text-[13px] font-medium text-[var(--accent)] hover:underline"
          >
            Editor
          </Link>
        </div>

        {/* Overlay (mobile drawer) */}
        {mobileNavOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          />
        ) : null}

        {/* Sidebar */}
        <aside
          id="docs-sidebar"
          className={cn(
            "flex max-h-[calc(100dvh-1px)] w-[min(100%,20rem)] flex-col border-[var(--app-chrome-border)] bg-[var(--card)]",
            "fixed inset-y-0 left-0 z-50 border-r shadow-2xl transition-transform duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
            "lg:sticky lg:top-14 lg:z-0 lg:max-h-[calc(100dvh-3.5rem)] lg:w-72 lg:shrink-0 lg:translate-x-0 lg:self-start lg:border-r lg:shadow-none",
            mobileNavOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
          )}
        >
          <div className="flex items-center justify-between border-b border-[var(--app-chrome-border)] p-3 lg:hidden">
            <span className="text-[13px] font-semibold uppercase tracking-wide text-[var(--app-chrome-muted)]">
              Contents
            </span>
            <button
              type="button"
              onClick={() => setMobileNavOpen(false)}
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-[var(--foreground)] hover:bg-black/[0.06] dark:hover:bg-white/[0.08]"
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" strokeWidth={2} />
            </button>
          </div>

          <div className="border-b border-[var(--app-chrome-border)] p-3">
            <DocsSearchInput
              id="docs-search-sidebar"
              value={query}
              onChange={setQuery}
            />
          </div>

          <nav
            className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-2 pb-4 [scrollbar-width:thin]"
            aria-label="Documentation sections"
          >
            {filtered.length === 0 ? (
              <p className="px-3 py-2 text-[13px] text-[var(--app-chrome-muted)]">
                No matches. Clear search to see all sections.
              </p>
            ) : (
              <ul className="space-y-0.5">
                {filtered.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className={navLinkClass}
                      onClick={() => setMobileNavOpen(false)}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </nav>

          <div className="mt-auto border-t border-[var(--app-chrome-border)] p-3">
            <Link
              href="/"
              className="flex min-h-[44px] items-center gap-2 rounded-lg px-3 text-[14px] font-medium text-[var(--accent)] hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
              onClick={() => setMobileNavOpen(false)}
            >
              ← Back to editor
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-5 lg:px-8 lg:py-10">
          <header className="mb-6 lg:mb-8">
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-[var(--foreground)] sm:text-3xl">
              Documentation
            </h1>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--app-chrome-muted)] sm:text-[16px]">
              How Draftora formats posts, previews the feed, and works in your
              browser. Use the sidebar to jump to a topic-on small screens, open
              the menu to browse.
            </p>
          </header>

          {/* Duplicate search on mobile/tablet for convenience */}
          <div className="mb-8 lg:hidden">
            <DocsSearchInput value={query} onChange={setQuery} />
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-xl border border-[var(--app-chrome-border)] bg-[var(--card)] p-6 text-[15px] text-[var(--app-chrome-muted)]">
              No sections match “{query}”. Try another keyword or clear the
              search.
            </p>
          ) : (
            <ul className="space-y-8 sm:space-y-10">
              {filtered.map((section) => (
                <li key={section.id}>
                  <article
                    id={section.id}
                    className="scroll-mt-28 rounded-2xl border border-[var(--app-chrome-border)] bg-[var(--card)] p-5 shadow-sm sm:p-7"
                  >
                    <h2 className="text-balance text-lg font-semibold text-[var(--foreground)] sm:text-xl">
                      {section.title}
                    </h2>
                    <p className="mt-3 text-[15px] leading-relaxed text-[var(--app-chrome-muted)] sm:text-[16px]">
                      {section.summary}
                    </p>
                    {section.body.length > 0 && (
                      <ul className="mt-4 list-disc space-y-2.5 pl-5 text-[15px] leading-relaxed text-[var(--foreground)]/92 sm:text-[16px]">
                        {section.body.map((p, i) => (
                          <li key={i} className="pl-0.5">
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}
