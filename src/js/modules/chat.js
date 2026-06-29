/* ============================================ */
/* CHATBOT INTERFACE */
/* ============================================ */
/* Keyword-matched auto-replies (answers in CHAT_RESPONSES, see       */
/* data/config.js) handle the bulk of FAQ volume in seconds. All the  */
/* entry points (toggleChat / sendQuickReply / sendMessage) are global */
/* so the inline handlers in index.html keep working. */
function toggleChat() {
    const modal = document.getElementById('chatModal');
    modal.classList.toggle('open');
}

function sendQuickReply(text) {
    addMessage(text, 'user');
    processBotReply(text);
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, 'user');
    input.value = '';
    processBotReply(text);
}

function addMessage(text, sender) {
    const messages = document.getElementById('chatMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-message ${sender}`;
    msgDiv.textContent = text;
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
}

function showTypingIndicator() {
    const messages = document.getElementById('chatMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(typingDiv);
    messages.scrollTop = messages.scrollHeight;
}

function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
}

function processBotReply(userText) {
    showTypingIndicator();

    // Simulate thinking time
    const delay = 800 + Math.random() * 600;

    setTimeout(() => {
        hideTypingIndicator();

        const lowerText = userText.toLowerCase();
        let response = CHAT_RESPONSES.default;

        // Keyword matching
        if (lowerText.includes('hour') || lowerText.includes('open') || lowerText.includes('close')) {
            response = CHAT_RESPONSES.hours;
        } else if (lowerText.includes('ipa') || lowerText.includes('beer') || lowerText.includes('ale') || lowerText.includes('stout')) {
            response = CHAT_RESPONSES.ipa;
        } else if (lowerText.includes('deal') || lowerText.includes('special') || lowerText.includes('discount') || lowerText.includes('sale')) {
            response = CHAT_RESPONSES.deals;
        } else if (lowerText.includes('deliver') || lowerText.includes('shipping') || lowerText.includes('ship')) {
            response = CHAT_RESPONSES.delivery;
        } else if (lowerText.includes('location') || lowerText.includes('address') || lowerText.includes('where')) {
            response = CHAT_RESPONSES.location;
        } else if (lowerText.includes('phone') || lowerText.includes('call') || lowerText.includes('contact')) {
            response = CHAT_RESPONSES.phone;
        } else if (lowerText.includes('pay') || lowerText.includes('card') || lowerText.includes('cash')) {
            response = CHAT_RESPONSES.payment;
        } else if (lowerText.includes('age') || lowerText.includes('id') || lowerText.includes('21')) {
            response = CHAT_RESPONSES.age;
        }

        addMessage(response, 'bot');
    }, delay);
}
