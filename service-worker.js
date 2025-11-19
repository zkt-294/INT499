// StreamList service worker (runtime + app-shell caching)
const CACHE_VERSION = 'v1';
const APP_SHELL_CACHE = `app-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `runtime-${CACHE_VERSION}`;
const MAX_IMAGE_CACHE = 60;

const APP_SHELL_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/vite.svg',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE)
      .then(cache => cache.addAll(APP_SHELL_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => ![APP_SHELL_CACHE, RUNTIME_CACHE].includes(k)).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Enable navigation preload if supported (helps when offline fallback)
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    if (self.registration.navigationPreload) {
      try { await self.registration.navigationPreload.enable(); } catch (e) { /* ignore */ }
    }
  })());
});

async function limitCacheEntries(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    await cache.delete(keys[0]);
    return limitCacheEntries(cacheName, maxItems);
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET') return;

  // Navigation requests -> serve index.html (App shell)
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      // Try navigation preload response first
      const preloadResp = await event.preloadResponse;
      if (preloadResp) {
        // update runtime cache with preload response
        const copy = preloadResp.clone();
        caches.open(RUNTIME_CACHE).then(cache => cache.put(req, copy));
        return preloadResp;
      }

      const cached = await caches.match('/index.html');
      if (cached) return cached;

      try {
        const networkResp = await fetch(req);
        if (networkResp && networkResp.status === 200) {
          caches.open(RUNTIME_CACHE).then(cache => cache.put(req, networkResp.clone()));
        }
        return networkResp;
      } catch (err) {
        return caches.match('/index.html');
      }
    })());
    return;
  }

  // API requests: network first, fallback to cache
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(req).then(networkResp => {
        caches.open(RUNTIME_CACHE).then(cache => cache.put(req, networkResp.clone()));
        return networkResp;
      }).catch(() => caches.match(req))
    );
    return;
  }

  // Images: cache-first with size limit
  if (req.destination === 'image' || /\.(png|jpg|jpeg|gif|webp|svg)$/.test(url.pathname)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async cache => {
        const cached = await cache.match(req);
        if (cached) return cached;
        const networkResp = await fetch(req);
        if (networkResp && networkResp.status === 200) {
          cache.put(req, networkResp.clone());
          limitCacheEntries(RUNTIME_CACHE, MAX_IMAGE_CACHE);
        }
        return networkResp;
      })
    );
    return;
  }

  // Static assets: stale-while-revalidate
  if (/\.(js|css|woff2?|ttf|json)$/.test(url.pathname)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then(async cache => {
        const cached = await cache.match(req);
        const network = fetch(req).then(resp => { if (resp && resp.status === 200) cache.put(req, resp.clone()); return resp; }).catch(() => null);
        return cached || network;
      })
    );
    return;
  }

  // Default: try cache, then network, else fall back to index
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).catch(() => caches.match('/index.html')))
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});