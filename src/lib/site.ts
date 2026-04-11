/** Canonical site URL (Cloudflare Pages). Override with NEXT_PUBLIC_SITE_URL in env. */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://draftora.pages.dev";

export function absoluteUrl(path: string): string {
  const base = siteUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
