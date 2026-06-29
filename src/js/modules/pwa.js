/* ============================================ */
/* SERVICE WORKER REGISTRATION (PWA) */
/* ============================================ */
/* Registers /service-worker.js at the site root so the app is        */
/* installable and can serve an offline fallback. The worker itself   */
/* lives in /service-worker.js (network-first with an offline catch). */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js', { scope: '/' })
            .catch(err => console.log('SW registration failed:', err));
    });
}
