/**
 * Sri Durga Devi Temple — Digital Mandapa: Offline Service Worker
 * Network-First strategy for HTML/JS/CSS ensures devotees and admins always receive
 * the latest Vedic Panchanga, Sevas, and date overrides without stale browser caching.
 * Offline shell fallback ensures temple sanctum resilience when connectivity drops.
 *
 * NOTE: Live video streams, live session endpoints, and video chunks are strictly
 * excluded from offline caching to ensure zero stale live broadcast playback.
 */

const CACHE_NAME = 'durga-mandapa-v15';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './app.html',
  './manifest.webmanifest',
  './css/tokens.css',
  './css/app.css',
  './css/landing.css',
  './js/lib/astronomy.js',
  './js/app.js',
  './js/landingApp.js',
  './js/data/sevas.js',
  './js/data/timings.js',
  './js/services/store.js',
  './js/services/panchangaService.js',
  './js/services/availabilityEngine.js',
  './js/services/whatsappService.js',
  './js/services/streamingService.js',
  './js/services/analyticsService.js',
  './js/services/pushNotificationService.js',
  './js/components/header.js',
  './js/components/bottomNav.js',
  './js/components/toast.js',
  './js/components/festivalCard.js',
  './js/views/homeView.js',
  './js/views/poojasView.js',
  './js/views/poojaDetailView.js',
  './js/views/calendarView.js',
  './js/views/panchangaView.js',
  './js/views/panchangaMonthModal.js',
  './js/views/bookingView.js',
  './js/views/qrLandingView.js',
  './js/views/adminView.js',
  './js/views/liveDarshanView.js',
  './assets/images/navaratri-invitation.jpg',
  './assets/images/navaratri-schedule.jpg',
  './icons/icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW v13] Precaching app shell assets');
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('[SW v13] Some assets failed to precache during install:', err);
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW v13] Deleting legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      console.log('[SW v13] Claiming clients');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // CRITICAL: Live streaming API and PHP endpoints must ALWAYS fetch directly from network without SW interference
  if (url.pathname.includes('/api/') || url.pathname.endsWith('.php')) {
    return;
  }

  // Administrative portal MUST always fetch directly from network without SW interference
  if (url.pathname.includes('admin')) {
    return;
  }

  // CRITICAL: Live video streams and media chunks must NEVER be cached as offline content
  const isVideoStream = event.request.destination === 'video' ||
    url.pathname.endsWith('.m3u8') ||
    url.pathname.endsWith('.ts') ||
    url.pathname.endsWith('.mpd') ||
    url.pathname.includes('/live-stream/') ||
    url.searchParams.has('live_stream');

  if (isVideoStream) {
    // Pure network pass-through, never cache
    event.respondWith(fetch(event.request));
    return;
  }

  // Network-First for HTML pages, scripts, styles, manifests, and configs
  const isCodeOrDoc = event.request.mode === 'navigate' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.webmanifest');

  if (isCodeOrDoc) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return caches.match(event.request, { ignoreSearch: true }).then((cached) => {
            if (cached) return cached;
            if (event.request.mode === 'navigate') {
              return caches.match('./index.html', { ignoreSearch: true });
            }
          });
        })
    );
    return;
  }

  // Cache-First with Network update for static assets (images, audio, icons)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});

// ==================== WEB PUSH NOTIFICATION LISTENERS ====================
self.addEventListener('push', (event) => {
  let data = {
    title: 'Sri Durga Devi Temple 🪔',
    body: 'Sacred blessings from the temple sanctum.',
    icon: './icons/icon-192.png',
    badge: './icons/icon-72.png',
    data: { url: './app.html#live' }
  };

  if (event.data) {
    try {
      const payload = event.data.json();
      data = { ...data, ...payload };
    } catch (e) {
      data.body = event.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon || './icons/icon-192.png',
    badge: data.badge || './icons/icon-72.png',
    vibrate: [200, 100, 200],
    data: data.data || { url: './app.html#live' },
    actions: [
      { action: 'open_live', title: 'Watch Darshan 🪔' },
      { action: 'dismiss', title: 'Dismiss' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const targetUrl = (event.notification.data && event.notification.data.url) ? event.notification.data.url : './app.html#live';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes('app.html') && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
