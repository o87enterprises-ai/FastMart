/* ============================================ */
/* ORDERING — CART & CHECKOUT (demo) */
/* ============================================ */
/* Drives the cart drawer and a mock checkout. Talks to FastMartAPI           */
/* (services/store.js). All entry points are global so inline handlers work.  */

function openCart() {
    document.getElementById('cartDrawer').classList.add('open');
    document.getElementById('cartOverlay').classList.add('open');
    renderCart();
}
function closeCart() {
    document.getElementById('cartDrawer').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('open');
}

async function addToCart(id) {
    const { count } = await FastMartAPI.cart.add(id, 1);
    updateCartBadge(count);
    fmToast('Added to your order', 'success');
}

async function updateCartBadge(count) {
    if (count === undefined) count = (await FastMartAPI.cart.get()).count;
    const badge = document.getElementById('cartCount');
    if (!badge) return;
    badge.textContent = count;
    badge.classList.toggle('has-items', count > 0);
}

async function changeQty(id, delta) {
    const cart = await FastMartAPI.cart.get();
    const line = cart.items.find(i => i.id === id);
    const next = (line ? line.qty : 0) + delta;
    const { count } = await FastMartAPI.cart.setQty(id, next);
    updateCartBadge(count);
    renderCart();
}

const money = (n) => '$' + Number(n).toFixed(2);

async function renderCart() {
    const body = document.getElementById('cartBody');
    const { items, subtotal, count } = await FastMartAPI.cart.get();
    updateCartBadge(count);

    if (!items.length) {
        body.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-basket-shopping"></i>
                <p>Your order is empty.</p>
                <button class="btn-secondary" onclick="closeCart(); scrollToSection('cellar')">Browse The Cellar</button>
            </div>`;
        return;
    }

    body.innerHTML = `
        <div class="cart-items">
            ${items.map(i => `
                <div class="cart-line">
                    <div class="cart-line-info">
                        <div class="cart-line-name">${i.name}</div>
                        <div class="cart-line-meta">${i.brewery} · ${money(i.price)}</div>
                    </div>
                    <div class="qty-stepper">
                        <button onclick="changeQty(${i.id}, -1)" aria-label="Decrease">−</button>
                        <span>${i.qty}</span>
                        <button onclick="changeQty(${i.id}, 1)" aria-label="Increase">+</button>
                    </div>
                    <div class="cart-line-total">${money(i.lineTotal)}</div>
                </div>`).join('')}
        </div>
        <div class="cart-summary">
            <span>Subtotal</span><strong>${money(subtotal)}</strong>
        </div>
        <p class="cart-note">Order ahead &amp; pick up in-store. You earn <strong>${Math.floor(subtotal)} points</strong> on this order.</p>
        <button class="btn-directions" onclick="renderCheckout()">
            <i class="fas fa-bag-shopping"></i> Checkout
        </button>`;
}

function renderCheckout() {
    const body = document.getElementById('cartBody');
    body.innerHTML = `
        <form class="checkout-form" id="checkoutForm" onsubmit="return submitOrder(event)">
            <h4>Pickup details</h4>
            <label>Name <input id="coName" required autocomplete="name"></label>
            <label>Mobile <input id="coPhone" type="tel" required autocomplete="tel"></label>
            <label>Pickup time
                <select id="coPickup">
                    <option>As soon as possible</option>
                    <option>In 30 minutes</option>
                    <option>In 1 hour</option>
                    <option>This evening</option>
                </select>
            </label>
            <button class="btn-directions" type="submit"><i class="fas fa-check"></i> Place Order</button>
            <button class="cart-back" type="button" onclick="renderCart()">← Back to order</button>
            <p class="checkout-demo">Demo only — no payment is taken and no order is sent.</p>
        </form>`;
}

async function submitOrder(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Placing…';
    const res = await FastMartAPI.orders.place({
        name: document.getElementById('coName').value,
        phone: document.getElementById('coPhone').value,
        pickup: document.getElementById('coPickup').value,
    });
    if (!res.ok) { fmToast(res.error || 'Something went wrong', 'error'); btn.disabled = false; return false; }
    updateCartBadge(0);
    if (typeof refreshLoyalty === 'function') refreshLoyalty();
    const body = document.getElementById('cartBody');
    body.innerHTML = `
        <div class="cart-success">
            <div class="cart-success-icon"><i class="fas fa-circle-check"></i></div>
            <h3>Order ${res.order.id} received!</h3>
            <p>Thanks, ${res.order.name}. We'll have it ready for pickup ${res.order.pickup.toLowerCase()}.</p>
            ${res.earned ? `<p class="cart-earned">+${res.earned} loyalty points earned 🎉</p>` : ''}
            <button class="btn-directions" onclick="closeCart()">Done</button>
        </div>`;
    return false;
}

// Initialize badge on load.
updateCartBadge();
