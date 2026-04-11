import type { Metadata } from "next";
import { DocsPageClient } from "@/components/docs/DocsPageClient";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Learn how Draftora uses Unicode formatting, mentions, hashtags, feed preview, paste markdown conversion, and offline support for LinkedIn posts.",
  keywords: [
    "Draftora docs",
    "LinkedIn Unicode",
    "LinkedIn post editor help",
    "offline editor",
  ],
  openGraph: {
    title: "Documentation | Draftora",
    description:
      "Feature guide: Unicode bold/italic, mentions, hashtags, preview, paste markdown, shortcuts.",
    url: "/docs",
  },
  alternates: {
    canonical: absoluteUrl("/docs"),
  },
};

export default function DocsPage() {
  return <DocsPageClient />;
}
