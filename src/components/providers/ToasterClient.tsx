"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";
import { useIsClient } from "@/hooks/useIsClient";

export function ToasterClient() {
  const { resolvedTheme } = useTheme();
  const mounted = useIsClient();

  if (!mounted) {
    return (
      <Toaster position="top-center" richColors closeButton theme="light" />
    );
  }

  return (
    <Toaster
      position="top-center"
      richColors
      closeButton
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  );
}
