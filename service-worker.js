/* =========================================================
   JEE Daily Tracker — service-worker.js
   Provides offline support by caching the app shell (HTML,
   CSS, JS, manifest, icons) so the app loads with no network.
   All actual data still lives in localStorage on the device,
   this only caches the static files needed to render the app.
   ========================================================= */

// Bumped to v2 for the redesigned app shell — forces browsers to
// fetch and cache the updated files instead of serving stale ones.
const CACHE_NAME = "jee-tracker-cache-v2";

const APP_SHELL_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
];

// ---------- Install: pre-cache the app shell ----------
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_FILES))
  );
  self.skipWaiting();
});

// ---------- Activate: clean up old caches from previous versions ----------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// ---------- Fetch: cache-first, falling back to network ----------
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});
