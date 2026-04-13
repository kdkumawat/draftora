/** Canonical site URL (Cloudflare Pages). Override with NEXT_PUBLIC_SITE_URL in env. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://draftora.pages.dev";

/**
 * Shared social / OG description (≥100 characters).
 * LinkedIn Post Inspector warns if og:description is shorter than 100 characters.
 */
export const siteDescriptionSocial =
  "Draftora is a free browser app for drafting LinkedIn posts in plain text: Unicode bold, italic, underline, mentions, hashtags, and links, with a live feed preview before you paste into LinkedIn. Paste markdown-style markers, copy your text, and publish. Works offline after the first visit.";

/** ISO 8601 — `article:published_time` / `article:modified_time` for OG (LinkedIn Post Inspector). Override with NEXT_PUBLIC_OG_PUBLISHED_TIME. */
export const sitePublishedTime =
  process.env.NEXT_PUBLIC_OG_PUBLISHED_TIME ?? "2026-04-11T00:00:00.000Z";

/**
 * Primary author URL for `article:author` (LinkedIn prefers a profile URL).
 * Override with NEXT_PUBLIC_OG_AUTHOR_URL.
 */
export const ogAuthorUrl =
  process.env.NEXT_PUBLIC_OG_AUTHOR_URL ??
  "https://www.linkedin.com/in/kdkumawat/";

export function absoluteUrl(path: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
