/* ============================================ */
/* REVIEWS (demo) */
/* ============================================ */
/* Lists seeded reviews + lets visitors submit one (persisted via            */
/* FastMartAPI). Mirrors the report's "verified review system" idea.          */

function starsHTML(rating) {
    let s = '';
    for (let i = 1; i <= 5; i++) {
        s += `<i class="fa-star ${i <= rating ? 'fas' : 'far'}"></i>`;
    }
    return `<span class="stars">${s}</span>`;
}

async function renderReviews() {
    const grid = document.getElementById('reviewsGrid');
    const summaryEl = document.getElementById('reviewsSummary');
    if (!grid) return;
    const [list, summary] = await Promise.all([
        FastMartAPI.reviews.list(),
        FastMartAPI.reviews.summary(),
    ]);
    summaryEl.innerHTML = `
        <div class="rev-avg">${summary.avg.toFixed(1)}</div>
        <div class="rev-avg-meta">
            ${starsHTML(Math.round(summary.avg))}
            <span>${summary.count} review${summary.count === 1 ? '' : 's'}</span>
        </div>`;
    grid.innerHTML = list.map(r => `
        <div class="review-card">
            <div class="review-top">
                <span class="review-name">${escapeHtml(r.name)}</span>
                ${starsHTML(r.rating)}
            </div>
            <p class="review-text">${escapeHtml(r.text)}</p>
            <div class="review-date">${formatDate(r.date)}</div>
        </div>`).join('');
}

function initStarInput() {
    const box = document.getElementById('starInput');
    if (!box) return;
    box.innerHTML = [1, 2, 3, 4, 5].map(i =>
        `<button type="button" class="star-btn" data-val="${i}" aria-label="${i} star${i > 1 ? 's' : ''}"><i class="fas fa-star"></i></button>`
    ).join('');
    const paint = (val) => box.querySelectorAll('.star-btn').forEach(b =>
        b.classList.toggle('on', +b.dataset.val <= val));
    box.dataset.rating = '5'; paint(5);
    box.querySelectorAll('.star-btn').forEach(btn => {
        btn.addEventListener('mouseenter', () => paint(+btn.dataset.val));
        btn.addEventListener('mouseleave', () => paint(+box.dataset.rating));
        btn.addEventListener('click', () => { box.dataset.rating = btn.dataset.val; paint(+btn.dataset.val); });
    });
}

async function submitReview(e) {
    e.preventDefault();
    const text = document.getElementById('revText').value.trim();
    if (!text) { fmToast('Please write a short review', 'error'); return false; }
    const rating = +document.getElementById('starInput').dataset.rating || 5;
    await FastMartAPI.reviews.add({
        name: document.getElementById('revName').value.trim(),
        rating, text,
    });
    e.target.reset();
    document.getElementById('starInput').dataset.rating = '5';
    initStarInput();
    renderReviews();
    fmToast('Thanks for your review!', 'success');
    return false;
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function formatDate(d) {
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
}

initStarInput();
renderReviews();
const _revForm = document.getElementById('reviewForm');
if (_revForm) _revForm.addEventListener('submit', submitReview);
