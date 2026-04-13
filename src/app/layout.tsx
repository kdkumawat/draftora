import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { JsonLd } from "@/components/seo/JsonLd";
import { AppProviders } from "@/components/providers/AppProviders";
import { ToasterClient } from "@/components/providers/ToasterClient";
import {
  absoluteUrl,
  ogAuthorUrl,
  siteDescriptionSocial,
  sitePublishedTime,
  siteUrl,
} from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Draftora - LinkedIn Post Editor & Unicode Formatter",
    template: "%s | Draftora",
  },
  description: siteDescriptionSocial,
  keywords: [
    "LinkedIn post editor",
    "LinkedIn post formatter",
    "Unicode bold",
    "LinkedIn preview",
    "plain text editor",
    "LinkedIn character limit",
    "offline LinkedIn editor",
    "Cloudflare Pages",
  ],
  authors: [{ name: "Kuldeep Kumawat", url: ogAuthorUrl }],
  creator: "Kuldeep Kumawat",
  publisher: "Draftora",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "article",
    locale: "en_US",
    url: absoluteUrl("/"),
    siteName: "Draftora",
    title: "Draftora - LinkedIn Post Editor & Unicode Formatter",
    description: siteDescriptionSocial,
    publishedTime: sitePublishedTime,
    modifiedTime: sitePublishedTime,
    authors: [ogAuthorUrl],
  },
  twitter: {
    card: "summary_large_image",
    title: "Draftora - LinkedIn Post Editor & Unicode Formatter",
    description: siteDescriptionSocial,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: absoluteUrl("/"),
  },
  category: "technology",
  applicationName: "Draftora",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[var(--background)] text-[var(--foreground)] antialiased transition-colors">
        <JsonLd />
        <GoogleAnalytics />
        <ServiceWorkerRegister />
        <AppProviders>
          {children}
          <ToasterClient />
        </AppProviders>
      </body>
    </html>
  );
}
