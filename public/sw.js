// public/sw.js

const CACHE_NAME = "gyarchi-v3";

const STATIC_ASSETS = [
  "/",
  "/Logo.png",
  "/favicon.ico",
];

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
    ".mp4",
    ".webm",
    ".mov",
    ".mkv",
    ".avi",
    ".m4v",
    ".mp3",
    ".wav",
    ".ogg",
    ".aac",
    ".flac",
    ".m4a",
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".avif",
    ".bmp",
    ".ico",
  ];

  if (
    request.destination === "video" ||
    request.destination === "audio" ||
    request.destination === "image" ||
    request.headers.has("range") ||
    mediaExtensions.some((ext) =>
      url.pathname.toLowerCase().endsWith(ext)
    )
  ) {
    return;
  }

  // ===========================
  // HTML
  // Network First
  // ===========================
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copy);
            });
          }

          return response;
        })
        .catch(async () => {
          return (await caches.match(request)) || caches.match("/");
        })
    );

    return;
  }

  // ===========================
  // Only cache CSS, JS & Fonts
  // ===========================
  if (
    request.destination !== "style" &&
    request.destination !== "script" &&
    request.destination !== "font"
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request).then((response) => {
        if (!response.ok) return response;

        const copy = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, copy);
        });

        return response;
      });
    })
  );
});