// Sube este número cada vez que cambies index.html, app.js o los iconos.
// Al cambiar, se crea una cache nueva y se borran las antiguas: así los usuarios
// reciben la versión nueva sin tener que borrar datos ni desinstalar nada.
const VERSION = 'v13';
const CACHE_NAME = `hidromiel-${VERSION}`;

const ASSETS = [
  './',
  './index.html',
  './app.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/favicon.svg',
  './images/hero.svg',
  './images/recipes.svg',
  './images/batches.svg',
  './images/measurements.svg',
  './images/tips.svg',
  './images/tasting.svg',
  'https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=1600&q=82',
  'https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&w=1000&q=82',
  'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?auto=format&fit=crop&w=1000&q=82',
  'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=1000&q=82',
  'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1000&q=82',
  'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=1000&q=82',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // No cachear respuestas de error ni de otros orígenes
        if (!response.ok || event.request.method !== 'GET') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => { try { cache.put(event.request, clone); } catch (_) {} });
        return response;
      }).catch(() => cached);
    })
  );
});
