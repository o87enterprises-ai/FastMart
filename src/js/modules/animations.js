/* ============================================ */
/* GSAP SCROLL ANIMATIONS */
/* ============================================ */
/* Staggered scroll reveals guide the user through each module like */
/* chapters. Called from modules/loading.js once the loader hides.   */
/* Requires the global gsap + ScrollTrigger (CDN, see index.html).   */
function initEntranceAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero content entrance
    gsap.from('.hero-content > *', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3
    });

    // Section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header.children, {
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            y: 40,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out'
        });
    });

    // Beer cards stagger
    gsap.from('.beer-card', {
        scrollTrigger: {
            trigger: '#inventoryGrid',
            start: 'top 80%'
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out'
    });

    // Loyalty card
    gsap.from('.loyalty-card', {
        scrollTrigger: {
            trigger: '.loyalty-card',
            start: 'top 80%'
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // Loyalty ring animation
    setTimeout(() => {
        const ring = document.getElementById('progressRing');
        if (ring) {
            ring.style.strokeDashoffset = '169.64'; // 70% progress
        }
        // Animate points counter
        animateCounter('pointsDisplay', 0, 850, 1500);
    }, 1000);

    // Location card
    gsap.from('.location-card', {
        scrollTrigger: {
            trigger: '.location-card',
            start: 'top 80%'
        },
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Chat preview
    gsap.from('.chat-preview', {
        scrollTrigger: {
            trigger: '.chat-preview',
            start: 'top 80%'
        },
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Nav scroll effect
    ScrollTrigger.create({
        start: 'top -80',
        onUpdate: (self) => {
            const nav = document.getElementById('mainNav');
            if (self.direction === 1 && self.scroll() > 80) {
                nav.classList.add('scrolled');
            } else if (self.scroll() < 80) {
                nav.classList.remove('scrolled');
            }
        }
    });
}

/* ============================================ */
/* UTILITY: NUMBER COUNTER ANIMATION */
/* ============================================ */
function animateCounter(elementId, start, end, duration) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        const current = Math.floor(start + (end - start) * easeProgress);
        el.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    requestAnimationFrame(update);
}
