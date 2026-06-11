/* ============================================================
   CALKOTHA — Service Worker
   sw.js — Offline caching & PWA support
   ============================================================ */

const CACHE_NAME = 'calkotha-v2.0';
const CACHE_VERSION = '2026-06-10';

// Files to cache for offline use
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/assets/logo.png',
  // Fonts & external CDN are cached on first load
];

// External CDN assets to cache
const CDN_ASSETS = [
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
];

// ─── INSTALL ──────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  console.log('[CalKotha SW] Installing v' + CACHE_VERSION);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache static assets — don't fail install if CDN is unavailable
      return cache.addAll(STATIC_ASSETS).then(() => {
        return Promise.allSettled(
          CDN_ASSETS.map(url => cache.add(url).catch(() => {}))
        );
      });
    }).then(() => {
      console.log('[CalKotha SW] All assets cached');
      return self.skipWaiting();
    })
  );
});

// ─── ACTIVATE ─────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  console.log('[CalKotha SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[CalKotha SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// ─── FETCH STRATEGY ───────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Anthropic API calls — never cache AI responses
  if (url.hostname === 'api.anthropic.com') return;

  // Skip OpenStreetMap tiles — too many, cache would explode
  if (url.hostname.includes('tile.openstreetmap.org')) return;

  // Strategy: Cache First for static assets, Network First for HTML
  if (request.destination === 'document') {
    // Network first for HTML pages
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/index.html')))
    );
  } else {
    // Cache first for CSS, JS, images, fonts
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              // Only cache same-origin and trusted CDN assets
              if (
                url.origin === self.location.origin ||
                url.hostname.includes('unpkg.com') ||
                url.hostname.includes('cdnjs.cloudflare.com') ||
                url.hostname.includes('fonts.googleapis.com') ||
                url.hostname.includes('fonts.gstatic.com')
              ) {
                cache.put(request, clone);
              }
            });
          }
          return networkResponse;
        }).catch(() => {
          // Fallback for images
          if (request.destination === 'image') {
            return new Response(
              `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
                <rect width="100" height="100" fill="#2C1810"/>
                <text x="50" y="55" text-anchor="middle" fill="#C9A227" font-size="32">🏛️</text>
              </svg>`,
              { headers: { 'Content-Type': 'image/svg+xml' } }
            );
          }
          return new Response('Offline — CalKotha requires a connection for this content.', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' }
          });
        });
      })
    );
  }
});

// ─── BACKGROUND SYNC (for landmark submissions) ───────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'landmark-submission') {
    event.waitUntil(syncPendingSubmissions());
  }
});

async function syncPendingSubmissions() {
  // In production: read from IndexedDB and POST to Supabase
  console.log('[CalKotha SW] Syncing pending landmark submissions...');
}

// ─── PUSH NOTIFICATIONS ───────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json().catch(() => ({
    title: 'CalKotha',
    body: 'New heritage discovery nearby!',
    icon: '/assets/logo.png'
  }));

  event.waitUntil(
    data.then(({ title, body, icon, badge, tag, url }) => {
      return self.registration.showNotification(title || 'CalKotha', {
        body: body || 'Explore Kolkata\'s heritage.',
        icon: icon || '/assets/logo.png',
        badge: badge || '/assets/logo.png',
        tag: tag || 'calkotha-notification',
        data: { url: url || '/index.html' },
        vibrate: [200, 100, 200],
        actions: [
          { action: 'explore', title: '🗺️ Explore', icon: '/assets/logo.png' },
          { action: 'dismiss', title: '✕ Dismiss' }
        ]
      });
    })
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const urlToOpen = event.notification.data?.url || '/index.html';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      return clients.openWindow(urlToOpen);
    })
  );
});

console.log('%c🏛️ CalKotha Service Worker v2.0 loaded', 'color:#C9A227;font-weight:bold;');