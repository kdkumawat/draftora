"use client";

import { ThemeProvider } from "next-themes";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="draftora-theme"
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
