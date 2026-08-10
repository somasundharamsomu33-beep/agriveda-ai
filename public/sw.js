const CACHE_NAME = 'agriveda-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event - Cache core static app shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline app shell');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[Service Worker] Pre-cache partial warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - Network first with cache fallback strategy for maximum freshness when online and full functional reliance on cache when in rural offline areas
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin or non-http requests
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.includes('unsplash.com')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // If valid response, clone and save to cache
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        console.log('[Service Worker] Network request failed. Serving from cache:', event.request.url);
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // Return offline HTML fallback for navigation requests if unavailable
        if (event.request.mode === 'navigate') {
          const appShell = await caches.match('/index.html');
          if (appShell) return appShell;
        }

        return new Response('Offline - No cached data available for this resource.', {
          status: 533,
          statusText: 'Service Unavailable Offline'
        });
      })
  );
});

// Background Sync Event Listener - Automatically push pending crop reports to Firestore once connectivity is restored
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background Sync event triggered:', event.tag);
  if (event.tag === 'sync-crop-reports' || event.tag === 'sync-pending-reports') {
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
        console.log('[Service Worker] Notifying active clients to push pending crop reports to Firestore');
        clients.forEach((client) => {
          client.postMessage({ type: 'SYNC_PENDING_REPORTS', tag: event.tag });
        });
      })
    );
  }
});

// Message listener from active window clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'REGISTER_BACKGROUND_SYNC') {
    if ('sync' in self.registration) {
      self.registration.sync.register('sync-crop-reports')
        .then(() => console.log('[Service Worker] Registered background sync tag: sync-crop-reports'))
        .catch((err) => console.warn('[Service Worker] Background sync registration error:', err));
    }
  }
});

