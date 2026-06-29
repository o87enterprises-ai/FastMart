/* ============================================ */
/* APP ENTRY / INITIALIZATION */
/* ============================================ */
/* Runs last (loaded after every data + module script). Kicks off the */
/* 3D scene and prints the console brand card. Per-module render calls */
/* and event listeners are wired up inside their own module files. */

// Initialize Three.js after a brief delay to ensure the canvas is ready.
setTimeout(initThreeJS, 100);

// Console branding
console.log('%c Fast Mart ', 'background: #C8A26E; color: #0D0A07; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
console.log('%c Premium Craft Beer Boutique | Creswell, Oregon ', 'color: #C8A26E; font-size: 14px;');
console.log('%c Family-owned since 1987 ', 'color: #7A6E63; font-size: 12px;');
