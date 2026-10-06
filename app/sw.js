/**
 * Sri Durga Devi Temple — Digital Mandapa: Offline Service Worker
 */

const CACHE_NAME = 'durga-mandapa-v1';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/tokens.css',
  './css/app.css',
  './js/app.js',
  './js/data/sevas.js',
  './js/data/timings.js',
  './js/services/store.js',
  './js/services/panchangaService.js',
  './js/services/availabilityEngine.js',
  './js/services/whatsappService.js',
  './js/components/header.js',
  './js/components/bottomNav.js',
  './js/components/toast.js',
  './js/views/homeView.js',
  './js/views/poojasView.js',
  './js/views/poojaDetailView.js',
  './js/views/calendarView.js',
  './js/views/panchangaView.js',
  './js/views/bookingView.js',
  './js/views/qrLandingView.js',
  './js/views/adminView.js',
  './icons/icon.svg'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching app shell assets');
      return cache.addAll(PRECACHE_ASSETS).catch(err => {
        console.warn('[SW] Some assets failed to precache during install:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Cache dynamic resources
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Offline fallback for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
