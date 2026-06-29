/* ============================================ */
/* LOADING SCREEN */
/* ============================================ */
/* The ~2.5s sequence builds anticipation and gives fonts + the 3D */
/* scene time to initialize before the UI is revealed. */
window.addEventListener('load', () => {
    // Create gold dust particles
    const loader = document.getElementById('loading-screen');
    for (let i = 0; i < 20; i++) {
        const dust = document.createElement('div');
        dust.className = 'gold-dust';
        dust.style.left = Math.random() * 100 + '%';
        dust.style.top = Math.random() * 100 + '%';
        dust.style.animationDelay = Math.random() * 2 + 's';
        dust.style.animationDuration = (2 + Math.random() * 2) + 's';
        loader.appendChild(dust);
    }

    setTimeout(() => {
        loader.classList.add('hidden');
        // Trigger entrance animations after load
        initEntranceAnimations();
    }, 2500);
});
