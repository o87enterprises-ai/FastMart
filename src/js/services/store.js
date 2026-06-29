/* ============================================ */
/* MOCK BACKEND — DEMO SERVICES LAYER */
/* ============================================ */
/* A stand-in "API" so the client can click through real flows (ordering,    */
/* loyalty, reviews) without a server. Everything persists to localStorage    */
/* and every call returns a Promise with simulated latency, so swapping in a  */
/* real backend later is a drop-in change (same method signatures).           */
/*                                                                            */
/* Reads seed catalog/deals from the globals in src/js/data/*.js.             */

const FastMartAPI = (() => {
    const KEY = {
        member: 'fm:member',
        cart: 'fm:cart',
        orders: 'fm:orders',
        reviews: 'fm:reviews',
        waitlist: 'fm:waitlist',
    };

    // localStorage with an in-memory fallback (private mode / blocked storage).
    const mem = {};
    const store = {
        get(k, def) {
            try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : def; }
            catch { return k in mem ? mem[k] : def; }
        },
        set(k, v) {
            try { localStorage.setItem(k, JSON.stringify(v)); }
            catch { mem[k] = v; }
        },
    };

    // Simulate network latency so the UI shows real loading states.
    const delay = (val, ms = 280) => new Promise(res => setTimeout(() => res(val), ms));
    const clone = (x) => JSON.parse(JSON.stringify(x));

    const catalog = () => (typeof BEER_INVENTORY !== 'undefined' ? BEER_INVENTORY : []);
    const deals = () => (typeof DAILY_DEALS !== 'undefined' ? DAILY_DEALS : []);

    /* ---------- Loyalty tiers ---------- */
    const TIERS = [
        { name: 'Bronze', min: 0 },
        { name: 'Silver', min: 250 },
        { name: 'Gold', min: 500 },
        { name: 'Platinum', min: 1000 },
    ];
    function tierFor(points) {
        let current = TIERS[0], next = null;
        for (let i = 0; i < TIERS.length; i++) {
            if (points >= TIERS[i].min) { current = TIERS[i]; next = TIERS[i + 1] || null; }
        }
        return { current, next };
    }

    // Seed a demo member + reviews on first run so the dashboard looks alive.
    function seed() {
        if (!store.get(KEY.member)) {
            store.set(KEY.member, {
                name: 'Alex M.', phone: '', points: 850,
                since: 'March 2023', joined: true,
            });
        }
        if (!store.get(KEY.reviews)) {
            store.set(KEY.reviews, [
                { name: 'Sarah K.', rating: 5, text: 'The family that owns it are awesome — always kind and make you feel welcome.', date: '2026-05-02' },
                { name: 'Marcus T.', rating: 5, text: 'Hidden craft beer spot with a really good selection. Best place in Creswell for cold beer.', date: '2026-04-18' },
                { name: 'Jenna R.', rating: 5, text: 'My go-to stop. Friendly faces and they always have what I need.', date: '2026-03-27' },
                { name: 'Dave P.', rating: 4, text: 'Great craft selection and fair prices. Quick in and out.', date: '2026-02-11' },
                { name: 'Liz M.', rating: 5, text: 'Love supporting a local family business. The beer wall is unmatched.', date: '2026-01-09' },
            ]);
        }
    }
    seed();

    return {
        /* ---------- Inventory ---------- */
        inventory: {
            list: () => delay(clone(catalog())),
            search: (q) => {
                q = (q || '').toLowerCase().trim();
                const r = catalog().filter(b =>
                    b.name.toLowerCase().includes(q) ||
                    b.brewery.toLowerCase().includes(q) ||
                    b.style.toLowerCase().includes(q));
                return delay(clone(r));
            },
            get: (id) => delay(clone(catalog().find(b => b.id === id) || null)),
            waitlist: (id) => {
                const w = store.get(KEY.waitlist, []);
                if (!w.includes(id)) { w.push(id); store.set(KEY.waitlist, w); }
                return delay({ ok: true, id });
            },
        },

        /* ---------- Cart ---------- */
        cart: {
            get() {
                const c = store.get(KEY.cart, []);
                const items = c.map(line => {
                    const b = catalog().find(x => x.id === line.id);
                    return b ? { ...b, qty: line.qty, lineTotal: +(b.price * line.qty).toFixed(2) } : null;
                }).filter(Boolean);
                const subtotal = +items.reduce((s, i) => s + i.lineTotal, 0).toFixed(2);
                const count = items.reduce((s, i) => s + i.qty, 0);
                return delay({ items, subtotal, count });
            },
            add(id, qty = 1) {
                const c = store.get(KEY.cart, []);
                const line = c.find(l => l.id === id);
                if (line) line.qty += qty; else c.push({ id, qty });
                store.set(KEY.cart, c);
                return this.get();
            },
            setQty(id, qty) {
                let c = store.get(KEY.cart, []);
                if (qty <= 0) c = c.filter(l => l.id !== id);
                else { const l = c.find(l => l.id === id); if (l) l.qty = qty; }
                store.set(KEY.cart, c);
                return this.get();
            },
            remove(id) { return this.setQty(id, 0); },
            clear() { store.set(KEY.cart, []); return this.get(); },
        },

        /* ---------- Orders ---------- */
        orders: {
            async place({ name, phone, pickup }) {
                const { items, subtotal, count } = await FastMartAPI.cart.get();
                if (!count) return delay({ ok: false, error: 'Your cart is empty.' });
                const order = {
                    id: 'FM-' + Date.now().toString().slice(-6),
                    name, phone, pickup, items, subtotal,
                    placedAt: new Date().toISOString(),
                    status: 'Received',
                };
                const all = store.get(KEY.orders, []);
                all.unshift(order);
                store.set(KEY.orders, all);
                // Award loyalty points (1 pt per $1) to the current member.
                const earned = Math.floor(subtotal);
                const m = store.get(KEY.member, null);
                if (m && m.joined) { m.points += earned; store.set(KEY.member, m); }
                store.set(KEY.cart, []);
                return delay({ ok: true, order, earned });
            },
            list: () => delay(clone(store.get(KEY.orders, []))),
        },

        /* ---------- Loyalty ---------- */
        loyalty: {
            getMember() {
                const m = store.get(KEY.member, null);
                if (!m) return delay(null);
                return delay({ ...m, ...tierFor(m.points) });
            },
            join({ name, phone }) {
                const m = { name, phone: phone || '', points: 25, since: monthYear(), joined: true };
                store.set(KEY.member, m);
                return delay({ ...m, ...tierFor(m.points), welcomeBonus: 25 });
            },
            addPoints(n) {
                const m = store.get(KEY.member, null);
                if (!m) return delay(null);
                m.points += n; store.set(KEY.member, m);
                return delay({ ...m, ...tierFor(m.points) });
            },
            redeem(points) {
                const m = store.get(KEY.member, null);
                if (!m) return delay({ ok: false, error: 'Join the program first.' });
                if (m.points < points) return delay({ ok: false, error: 'Not enough points.' });
                m.points -= points; store.set(KEY.member, m);
                const reward = '$' + (points / 100 * 5).toFixed(0) + ' off your next visit';
                return delay({ ok: true, reward, member: { ...m, ...tierFor(m.points) } });
            },
            TIERS,
        },

        /* ---------- Reviews ---------- */
        reviews: {
            list: () => delay(clone(store.get(KEY.reviews, []))),
            summary() {
                const r = store.get(KEY.reviews, []);
                const count = r.length;
                const avg = count ? +(r.reduce((s, x) => s + x.rating, 0) / count).toFixed(1) : 0;
                return delay({ avg, count });
            },
            add({ name, rating, text }) {
                const r = store.get(KEY.reviews, []);
                const review = { name: name || 'Anonymous', rating, text, date: new Date().toISOString().slice(0, 10) };
                r.unshift(review);
                store.set(KEY.reviews, r);
                return delay({ ok: true, review });
            },
        },

        /* ---------- Deals ---------- */
        deals: {
            all: () => delay(clone(deals())),
            today() {
                const d = deals();
                const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
                return delay(clone(d.find(x => x.day === day) || d[0] || null));
            },
        },

        /* Demo helper: wipe all stored state. */
        _reset() {
            Object.values(KEY).forEach(k => { try { localStorage.removeItem(k); } catch { delete mem[k]; } });
            seed();
        },
    };

    function monthYear() {
        return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    }
})();

/* Shared toast used across the demo services. */
function fmToast(message, kind = 'info') {
    let el = document.getElementById('fmToast');
    if (!el) {
        el = document.createElement('div');
        el.id = 'fmToast';
        el.className = 'fm-toast';
        document.body.appendChild(el);
    }
    el.textContent = message;
    el.dataset.kind = kind;
    el.classList.add('show');
    clearTimeout(fmToast._t);
    fmToast._t = setTimeout(() => el.classList.remove('show'), 3200);
}
