/* ============================================ */
/* SERVICE WORKER REGISTRATION (PWA) */
/* ============================================ */
/* Registers /service-worker.js at the site root so the app is        */
/* installable and can serve an offline fallback. The worker itself   */
/* lives in /service-worker.js (network-first with an offline catch). */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Relative path so it works at the site root and under a sub-path
        // (e.g. GitHub Project Pages at /<repo>/). Scope defaults to the
        // service worker's own directory.
        navigator.serviceWorker.register('service-worker.js')
            .catch(err => console.log('SW registration failed:', err));
    });
}
