"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

function applyWaitingWorker(registration: ServiceWorkerRegistration) {
  const waiting = registration.waiting;
  if (!waiting) {
    window.location.reload();
    return;
  }

  const reload = () => {
    window.location.reload();
  };

  navigator.serviceWorker.addEventListener("controllerchange", reload, {
    once: true,
  });
  waiting.postMessage({ type: "SKIP_WAITING" });
}

function promptRefresh(registration: ServiceWorkerRegistration) {
  toast.message("Update ready", {
    description: "A new version of Draftora is available. Refresh to get the latest fixes and features.",
    duration: 120_000,
    action: {
      label: "Refresh",
      onClick: () => applyWaitingWorker(registration),
    },
  });
}

export function ServiceWorkerRegister() {
  const promptedRef = useRef(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let registration: ServiceWorkerRegistration | undefined;

    const maybePrompt = (reg: ServiceWorkerRegistration) => {
      if (promptedRef.current) return;
      if (!reg.waiting || !navigator.serviceWorker.controller) return;
      promptedRef.current = true;
      promptRefresh(reg);
    };

    const register = async () => {
      try {
        registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        });
      } catch {
        return;
      }

      if (registration.waiting) {
        maybePrompt(registration);
      }

      registration.addEventListener("updatefound", () => {
        const installing = registration?.installing;
        if (!installing) return;
        installing.addEventListener("statechange", () => {
          if (
            installing.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            if (registration) maybePrompt(registration);
          }
        });
      });
    };

    void register();

    const onFocus = () => {
      void registration?.update();
    };
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  return null;
}
