/**
 * Sri Durga Devi Temple — Digital Mandapa: Offline Service Worker
 * Network-First strategy for HTML/JS/CSS ensures devotees and admins always receive
 * the latest Vedic Panchanga, Sevas, and date overrides without stale browser caching.
 * Offline shell fallback ensures temple sanctum resilience when connectivity drops.
 */

const CACHE_NAME = 'durga-mandapa-v9';
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
  './js/components/header.js',
  './js/components/bottomNav.js',
  './js/components/toast.js',
  './js/components/festivalCard.js',
  './js/views/homeView.js',
  './js/views/poojasView.js',
  './js/views/poojaDetailView.js',
  './js/views/calendarView.js',
  './js/views/panchangaView.js',
  './js/views/bookingView.js',
  './js/views/qrLandingView.js',
  './js/views/adminView.js',
  './assets/images/navaratri-invitation.jpg',
  './assets/images/navaratri-schedule.jpg',
  './icons/icon.svg'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW v5] Precaching app shell assets');
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('[SW v5] Some assets failed to precache during install:', err);
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
            console.log('[SW v5] Deleting legacy cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => {
      console.log('[SW v5] Claiming clients');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Administrative portal MUST always fetch directly from network without SW interference
  if (url.pathname.includes('admin')) {
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
