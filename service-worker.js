/* ============================================ */
/* FAST MART — SERVICE WORKER */
/* ============================================ */
/* Network-first with an offline fallback. Static assets are cached on */
/* install so the shell still loads without a connection. Bump CACHE   */
/* whenever you ship asset changes to force clients to refresh. */

const CACHE = 'fast-mart-v2';

const PRECACHE = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/icons/icon.svg',
    '/assets/fast-mart-logo.png',
    '/src/css/tokens.css',
    '/src/css/base.css',
    '/src/css/layout.css',
    '/src/css/modules.css',
    '/src/css/responsive.css',
    '/src/js/data/config.js',
    '/src/js/data/inventory.js',
    '/src/js/data/deals.js',
    '/src/js/modules/loading.js',
    '/src/js/modules/three-scene.js',
    '/src/js/modules/animations.js',
    '/src/js/modules/inventory.js',
    '/src/js/modules/loyalty.js',
    '/src/js/modules/carousel.js',
    '/src/js/modules/concierge.js',
    '/src/js/modules/chat.js',
    '/src/js/modules/nav.js',
    '/src/js/modules/pwa.js',
    '/src/js/main.js'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).catch(() => {})
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    // Only handle same-origin GET requests; let the CDN libs hit the network.
    if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                const copy = response.clone();
                caches.open(CACHE).then((cache) => cache.put(event.request, copy)).catch(() => {});
                return response;
            })
            .catch(() => caches.match(event.request).then((cached) => cached || caches.match('/index.html')))
    );
});
