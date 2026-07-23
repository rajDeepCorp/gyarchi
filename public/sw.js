// public/sw.js

const CACHE_NAME = "gyarchi-v4";
const STATIC_ASSETS = [
  "/",
  "/Logo.png",
  "/favicon.ico",
];

const NAV_TIMEOUT_MS = 3000;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // ===========================
  // Never cache third-party requests
  // ===========================
  if (url.origin !== self.location.origin) {
    return;
  }

  // ===========================
  // Never cache APIs
  // ===========================
  if (request.url.includes("/api/")) {
    return;
  }

  // ===========================
  // Never cache ANY media
  // ===========================
  const mediaExtensions = [
    ".mp4", ".webm", ".mov", ".mkv", ".avi", ".m4v",
    ".mp3", ".wav", ".ogg", ".aac", ".flac", ".m4a",
    ".jpg", ".jpeg", ".png", ".gif", ".webp",
    ".svg", ".avif", ".bmp", ".ico",
  ];

  if (
    request.destination === "video" ||
    request.destination === "audio" ||
    request.destination === "image" ||
    request.headers.has("range") ||
    mediaExtensions.some((ext) => url.pathname.toLowerCase().endsWith(ext))
  ) {
    return;
  }

  // ===========================
  // Next.js hashed static assets — content-addressed, immutable
  // Cache-first, no revalidation needed (filename changes if content changes)
  // ===========================
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((response) => {
          if (!response.ok) return response;

          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));

          return response;
        });
      })
    );

    return;
  }

  // ===========================
  // HTML — Network First, fast fallback to cache
  // ===========================
  if (request.mode === "navigate") {
    event.respondWith(
      Promise.race([
        fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        }),
        new Promise((resolve) => {
          setTimeout(async () => {
            const cached = await caches.match(request);
            if (cached) resolve(cached);
            // agar cache mein bhi nahi mila, race ka doosra promise
            // (fetch) jeetega jab wo resolve/reject hoga
          }, NAV_TIMEOUT_MS);
        }),
      ]).catch(async () => {
        return (await caches.match(request)) || caches.match("/");
      })
    );

    return;
  }

  // ===========================
  // CSS, JS & Fonts (non-hashed) — Stale While Revalidate
  // ===========================
  if (
    request.destination !== "style" &&
    request.destination !== "script" &&
    request.destination !== "font"
  ) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);

      const networkFetch = fetch(request)
        .then((response) => {
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => cached);

      // Cache mile to turant wahi do, background mein update ho jaayega
      return cached || networkFetch;
    })
  );
});