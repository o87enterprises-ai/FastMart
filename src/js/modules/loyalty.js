/* ============================================ */
/* MODULE 3: REFERRAL SYSTEM */
/* ============================================ */
/* Copies the member's referral link to the clipboard and shows a     */
/* toast. Referrals are the lowest-cost acquisition channel, so this  */
/* is a one-tap share. Falls back to execCommand for older browsers.  */
document.getElementById('referralBtn').addEventListener('click', () => {
    const referralLink = 'https://fastmartcreswell.com/join?ref=ALEXM850';

    navigator.clipboard.writeText(referralLink).then(() => {
        const toast = document.getElementById('referralToast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }).catch(() => {
        // Fallback for browsers without clipboard API
        const textarea = document.createElement('textarea');
        textarea.value = referralLink;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        const toast = document.getElementById('referralToast');
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    });
});
