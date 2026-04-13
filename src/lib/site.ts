/** Canonical site URL (Cloudflare Pages). Override with NEXT_PUBLIC_SITE_URL in env. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://draftora.pages.dev";

/**
 * Shared social / OG description (≥100 characters).
 * LinkedIn Post Inspector warns if og:description is shorter than 100 characters.
 */
export const siteDescriptionSocial =
  "Draftora is a free browser app for drafting LinkedIn posts in plain text: Unicode bold, italic, underline, mentions, hashtags, and links, with a live feed preview before you paste into LinkedIn. Paste markdown-style markers, copy your text, and publish. Works offline after the first visit.";

export function absoluteUrl(path: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
