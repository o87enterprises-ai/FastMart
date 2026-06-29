/* ============================================ */
/* MODULE 3: LOYALTY DASHBOARD (demo) */
/* ============================================ */
/* Renders the member's points/tier from FastMartAPI, animates the gold ring, */
/* and wires referral / redeem / join. refreshLoyalty() is global so the cart */
/* can update points after an order is placed.                                */

const RING_CIRC = 565.48; // 2 * pi * r(90)

async function refreshLoyalty() {
    const m = await FastMartAPI.loyalty.getMember();
    const tierEl = document.getElementById('memberTier');
    const nameEl = document.getElementById('memberName');
    const sinceEl = document.getElementById('memberSince');
    const ring = document.getElementById('progressRing');
    const nextEl = document.getElementById('progressNext');
    const redeemBtn = document.getElementById('redeemBtn');

    if (!m) {
        // Guest state — prompt to join.
        tierEl.textContent = 'Guest';
        nameEl.textContent = 'Welcome';
        sinceEl.textContent = 'Join to start earning points';
        if (ring) ring.style.strokeDashoffset = RING_CIRC;
        document.getElementById('pointsDisplay').textContent = '0';
        nextEl.innerHTML = 'Join the <strong>Founders&rsquo; Table</strong> for rewards';
        if (redeemBtn) redeemBtn.style.display = 'none';
        return;
    }

    tierEl.textContent = m.current.name + ' Member';
    nameEl.textContent = m.name;
    sinceEl.textContent = 'Member since ' + m.since;

    // Ring fill = progress through the current tier toward the next.
    let frac = 1;
    if (m.next) {
        const span = m.next.min - m.current.min;
        frac = Math.max(0, Math.min(1, (m.points - m.current.min) / span));
    }
    if (ring) {
        ring.style.strokeDashoffset = RING_CIRC; // reset, then animate
        requestAnimationFrame(() => { ring.style.strokeDashoffset = RING_CIRC * (1 - frac); });
    }
    animateCounter('pointsDisplay', 0, m.points, 1200);

    if (m.next) {
        nextEl.innerHTML = `<strong>${m.next.min - m.points}</strong> points to <strong>${m.next.name}</strong>`;
    } else {
        nextEl.innerHTML = `<strong>Platinum</strong> — our top tier. Thank you! 🏆`;
    }

    if (redeemBtn) {
        redeemBtn.style.display = '';
        redeemBtn.disabled = m.points < 100;
        redeemBtn.title = m.points < 100 ? 'Earn 100 points to redeem' : '';
    }
}

/* ---------- Referral ---------- */
document.getElementById('referralBtn').addEventListener('click', () => {
    const link = 'https://fastmartcreswell.com/join?ref=FASTMART';
    const done = () => fmToast('Referral link copied to clipboard!', 'success');
    navigator.clipboard.writeText(link).then(done).catch(() => {
        const t = document.createElement('textarea');
        t.value = link; document.body.appendChild(t); t.select();
        try { document.execCommand('copy'); } catch {}
        document.body.removeChild(t); done();
    });
});

/* ---------- Redeem ---------- */
const _redeem = document.getElementById('redeemBtn');
if (_redeem) _redeem.addEventListener('click', async () => {
    const res = await FastMartAPI.loyalty.redeem(100);
    if (!res.ok) { fmToast(res.error, 'error'); return; }
    fmToast('Redeemed! ' + res.reward, 'success');
    refreshLoyalty();
});

/* ---------- Join / switch member ---------- */
const _toggle = document.getElementById('joinToggle');
const _form = document.getElementById('joinForm');
if (_toggle && _form) {
    _toggle.addEventListener('click', () => { _form.hidden = !_form.hidden; });
    _form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('joinName').value.trim();
        if (!name) { fmToast('Enter your name to join', 'error'); return; }
        const m = await FastMartAPI.loyalty.join({
            name, phone: document.getElementById('joinPhone').value.trim(),
        });
        _form.hidden = true; _form.reset();
        fmToast(`Welcome, ${m.name}! +${m.welcomeBonus} points`, 'success');
        refreshLoyalty();
    });
}

refreshLoyalty();
