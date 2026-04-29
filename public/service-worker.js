const CACHE_NAME = "lbpl-cricket-cache-v14";
const STATIC_CACHE = "lbpl-static-v14";
const DYNAMIC_CACHE = "lbpl-dynamic-v14";
const IMAGE_CACHE = "lbpl-images-v14";

// Critical assets to precache immediately
const PRECACHE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/android-icon-192.png",
  "/android-icon-512.png",
  "/apple-touch-icon.png"
];

// Cache durations (in seconds)
const CACHE_DURATIONS = {
  static: 60 * 60 * 24 * 30, // 30 days for static assets
  images: 60 * 60 * 24 * 7,  // 7 days for images
  dynamic: 60 * 60 * 24,     // 1 day for dynamic content
  api: 60 * 5                // 5 minutes for API responses
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches not in current list
          if (!currentCaches.includes(cacheName) && 
              (cacheName.startsWith('lbpl-') || cacheName.includes('cricket'))) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Determine cache strategy based on request type
const getCacheStrategy = (request) => {
  const url = new URL(request.url);
  
  // Images - cache first with network fallback
  if (request.destination === 'image' || 
      url.pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/i)) {
    return 'cache-first';
  }
  
  // Static assets (JS, CSS) - stale-while-revalidate
  if (request.destination === 'script' || 
      request.destination === 'style' ||
      url.pathname.match(/\.(js|css|woff2?|ttf|eot)$/i)) {
    return 'stale-while-revalidate';
  }
  
  // API calls - network first with cache fallback
  if (url.pathname.includes('/rest/') || 
      url.pathname.includes('/functions/') ||
      url.hostname.includes('supabase')) {
    return 'network-first';
  }
  
  // Navigation requests - network first
  if (request.mode === 'navigate') {
    return 'network-first';
  }
  
  return 'network-first';
};

// Cache-first strategy (for images)
const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    return cached || new Response('', { status: 404 });
  }
};

// Stale-while-revalidate strategy (for static assets)
const staleWhileRevalidate = async (request) => {
  const cache = await caches.open(STATIC_CACHE);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
};

// Network-first strategy (for API and navigation)
const networkFirst = async (request) => {
  try {
    const response = await fetch(request);
    if (response.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) return cached;
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
      return caches.match('/');
    }
    throw error;
  }
};

self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests except for CDN assets
  const url = new URL(event.request.url);
  if (url.origin !== location.origin && 
      !url.hostname.includes('supabase') &&
      !url.hostname.includes('googleapis') &&
      !url.hostname.includes('gstatic')) {
    return;
  }
  
  const strategy = getCacheStrategy(event.request);
  
  switch (strategy) {
    case 'cache-first':
      event.respondWith(cacheFirst(event.request));
      break;
    case 'stale-while-revalidate':
      event.respondWith(staleWhileRevalidate(event.request));
      break;
    case 'network-first':
    default:
      event.respondWith(networkFirst(event.request));
      break;
  }
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

// Background sync for offline actions
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-ratings") {
    event.waitUntil(syncRatings());
  }
});

async function syncRatings() {
  // Handle offline rating submissions when back online
  console.log("Background sync: ratings");
}
