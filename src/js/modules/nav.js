/* ============================================ */
/* NAVIGATION UTILITIES */
/* ============================================ */
/* Smooth-scroll to a section and the mobile menu toggle. Both are     */
/* global so the inline handlers in index.html can call them. */
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function toggleMobileMenu() {
    // Simple mobile menu toggle - in production, expand to full overlay
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    navLinks.style.position = 'absolute';
    navLinks.style.top = '100%';
    navLinks.style.left = '0';
    navLinks.style.right = '0';
    navLinks.style.flexDirection = 'column';
    navLinks.style.background = 'rgba(8, 33, 27, 0.95)';
    navLinks.style.padding = '20px';
    navLinks.style.backdropFilter = 'blur(20px)';
    navLinks.style.borderBottom = '1px solid var(--glass-border)';
}
