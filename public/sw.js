/* Draftora service worker - offline shell + static assets (same-origin). */
const CACHE_VERSION = "draftora-v2";
const CORE = ["/", "/icon.svg", "/logo.svg"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.map((k) => (k === CACHE_VERSION ? null : caches.delete(k))),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((res) => {
          const copy = res.clone();
          if (
            res.ok &&
            (url.pathname.startsWith("/_next/static") ||
              url.pathname === "/" ||
              url.pathname.endsWith(".svg") ||
              url.pathname.endsWith(".ico"))
          ) {
            caches.open(CACHE_VERSION).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match("/"));
    }),
  );
});
