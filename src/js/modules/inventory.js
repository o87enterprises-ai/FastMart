/* ============================================ */
/* MODULE 2: INVENTORY SEARCH & RENDER */
/* ============================================ */
/* Client-side filtering gives instant feedback for a small catalog. */
/* Reads BEER_INVENTORY (data/inventory.js); the initial render is    */
/* kicked off at the bottom of this file. */
function renderInventory(items) {
    const grid = document.getElementById('inventoryGrid');

    if (items.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1 / -1;">
                <i class="fas fa-search"></i>
                <h3>No beers found</h3>
                <p>Try a different search term</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = items.map(beer => `
        <div class="beer-card">
            <div class="beer-header">
                <div>
                    <div class="beer-name">${beer.name}</div>
                    <div class="beer-brewery">${beer.brewery}</div>
                </div>
                <span class="beer-badge badge-${beer.status}">${beer.statusLabel}</span>
            </div>
            <div class="beer-details">
                <div class="beer-detail">
                    <span class="beer-detail-label">Style</span>
                    <span class="beer-detail-value">${beer.style}</span>
                </div>
                <div class="beer-detail">
                    <span class="beer-detail-label">ABV</span>
                    <span class="beer-detail-value">${beer.abv}</span>
                </div>
            </div>
            <div class="beer-price">$${beer.price.toFixed(2)} <span>/ bottle</span></div>
            ${beer.status === 'out-stock'
                ? `<button class="btn-notify" onclick="requestNotification(${beer.id}, '${beer.name.replace(/'/g, "\\'")}')">
                       <i class="fas fa-bell"></i> Notify Me When Available
                   </button>`
                : `<button class="btn-add" onclick="addToCart(${beer.id})">
                       <i class="fas fa-plus"></i> Add to Cart
                   </button>`}
        </div>
    `).join('');

    // Re-trigger GSAP animations for new cards
    gsap.from('.beer-card', {
        y: 30,
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power3.out'
    });
}

// Search functionality
document.getElementById('beerSearch').addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const filtered = BEER_INVENTORY.filter(beer =>
        beer.name.toLowerCase().includes(query) ||
        beer.brewery.toLowerCase().includes(query) ||
        beer.style.toLowerCase().includes(query)
    );
    renderInventory(filtered);
});

/* ============================================ */
/* NOTIFICATION API — WAITLIST */
/* ============================================ */
/* Captures intent even when an item is out of stock, turning a lost */
/* sale into a future one. Falls back to an alert if permission is    */
/* denied or the Notifications API is unavailable. */
function requestNotification(beerId, beerName) {
    // Record the waitlist intent in the demo backend.
    if (typeof FastMartAPI !== 'undefined') FastMartAPI.inventory.waitlist(beerId);
    const confirm = () => (typeof fmToast === 'function'
        ? fmToast(`You're on the waitlist for ${beerName}`, 'success')
        : alert(`You're on the waitlist for ${beerName}!`));
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                new Notification('Fast Mart — Waitlist', {
                    body: `We'll notify you when ${beerName} is back in stock!`,
                    icon: 'icons/icon-192.png'
                });
            } else {
                confirm();
            }
        });
    } else {
        confirm();
    }
}

// Initial render
renderInventory(BEER_INVENTORY);
