const CACHE_NAME = "lbpl-cricket-cache-v11";
const ASSETS_TO_CACHE = ["/", "/index.html", "/styles.css", "/app.js", "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return (
        cached ||
        fetch(event.request).catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
        })
      );
    }),
  );
});

// Push notification handler
self.addEventListener("push", (event) => {
  const options = {
    body: "Check out the latest updates!",
    icon: "/android-icon-192.png",
    badge: "/android-icon-192.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      { action: "explore", title: "View Details" },
      { action: "close", title: "Close" },
    ],
  };

  let title = "LBPL Update";
  let body = "You have a new notification";

  if (event.data) {
    try {
      const data = event.data.json();
      title = data.title || title;
      body = data.body || body;
      if (data.icon) options.icon = data.icon;
    } catch (e) {
      body = event.data.text() || body;
    }
  }

  options.body = body;

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/"));
  } else if (event.action === "close") {
    // Just close the notification
  } else {
    event.waitUntil(clients.openWindow("/"));
  }
});
