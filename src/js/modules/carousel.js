/* ============================================ */
/* MODULE 4: DEALS CAROUSEL */
/* ============================================ */
/* Renders DAILY_DEALS (data/deals.js) into a 3D-flip carousel with   */
/* dots, arrows, autoplay and swipe support. moveCarousel / goToSlide */
/* are global so the inline arrow/dot handlers in index.html work.    */
let currentSlide = 0;
const totalSlides = DAILY_DEALS.length;

function renderCarousel() {
    const track = document.getElementById('carouselTrack');
    const dotsContainer = document.getElementById('carouselDots');

    track.innerHTML = DAILY_DEALS.map((deal, index) => `
        <div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
            <div class="deal-card">
                <div class="deal-day">${deal.day}</div>
                <h3 class="deal-title">${deal.title}</h3>
                <p class="deal-desc">${deal.description}</p>
                <div class="deal-discount">${deal.discount}</div>
                <div class="deal-time"><i class="far fa-clock"></i> ${deal.time}</div>
            </div>
        </div>
    `).join('');

    dotsContainer.innerHTML = DAILY_DEALS.map((_, index) => `
        <button class="carousel-dot ${index === 0 ? 'active' : ''}" onclick="goToSlide(${index})"></button>
    `).join('');
}

function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');

    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });

    // GSAP 3D flip animation
    gsap.to('.carousel-slide', {
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0
    });
}

function moveCarousel(direction) {
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
}

renderCarousel();

// Auto-advance carousel
setInterval(() => moveCarousel(1), 5000);

// Touch/swipe support
let touchStartX = 0;
const carouselContainer = document.querySelector('.carousel-container');

carouselContainer.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
}, { passive: true });

carouselContainer.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
        moveCarousel(diff > 0 ? 1 : -1);
    }
}, { passive: true });
