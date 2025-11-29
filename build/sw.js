const CACHE_NAME = "starships-cache-v1";
const ASSETS_TO_CACHE = [
  "/", 
  "/index.html",
  "/manifest.json",
  "/icon-192.png",
  "/icon-512.png",
  
  // Auto-cache semua CSS & JS hasil Vite
  // (akan ditangkap otomatis lewat fetch event)
];

// Install service worker = caching file statis
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate = hapus cache lama
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
});

// Fetch = ambil dari cache dulu, kalau tidak ada baru ke network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        // Return dari cache kalau ada
        return cached;
      }
      // Kalau belum ada, ambil dari network lalu cache-kan
      return fetch(event.request)
        .then((response) => {
          if (!response || response.status !== 200) return response;

          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Offline fallback (opsional)
          if (event.request.destination === "document") {
            return caches.match("/index.html");
          }
        });
    })
  );
});
