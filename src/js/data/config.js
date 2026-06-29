/* ============================================ */
/* BUSINESS CONFIG — SINGLE SOURCE OF TRUTH (NAP) */
/* ============================================ */
/* Name, Address, Phone and hours live here so they stay consistent */
/* across the chatbot, schema.org markup and any future feature. */
/* If you change a value here, also update the JSON-LD block and the */
/* visible address in index.html (a static page can't inject these). */
/*                                                                    */
/* NOTE: these values mirror the supplied design. They differ from   */
/* the business analysis report (report lists phone (541) 895-5511   */
/* and daily 6 AM–11 PM). Reconcile before launch — NAP consistency  */
/* is called out in the report as a critical SEO/AEO requirement.    */
const BUSINESS = {
    name: "Fast Mart",
    tagline: "Premium Craft Beer Boutique",
    street: "5 South Front St",
    city: "Creswell",
    region: "OR",
    postalCode: "97426",
    phone: "(541) 895-3000",
    phoneE164: "+1-541-895-3000",
    url: "https://fastmartcreswell.com",
    hours: {
        weekday: "6:00 AM – 10:00 PM",
        weekend: "7:00 AM – 11:00 PM"
    }
};

/* Store coordinates, used by the concierge distance calculator. */
const STORE_COORDS = { lat: 43.9179, lng: -123.0201 };

/* ============================================ */
/* CHATBOT KNOWLEDGE BASE */
/* Auto-reply answers for the concierge chat. Keyword matching lives */
/* in modules/chat.js. The auto-replies handle the bulk of FAQ volume */
/* so the team isn't interrupted for routine questions. */
const CHAT_RESPONSES = {
    "hours": "We're open Monday–Friday 6 AM–10 PM, and Saturday–Sunday 7 AM–11 PM. Come by anytime!",
    "ipa": "Yes! We carry a rotating selection of IPAs including Pliny the Elder, Heady Topper, Two Hearted Ale, and Hazy Little Thing. Check The Cellar for current stock.",
    "deals": "Today is " + ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][new Date().getDay()] + "! Check our Daily Ritual section for today's special offer.",
    "delivery": "We offer local delivery within 10 miles of Creswell for orders over $25. Call us at (541) 895-3000 to arrange delivery.",
    "location": "We're at 5 South Front St, Creswell, OR 97426 — right in the heart of downtown.",
    "phone": "You can reach us at (541) 895-3000. We're happy to hold items for you!",
    "payment": "We accept cash, all major credit cards, Apple Pay, and Google Pay.",
    "age": "You must be 21+ with valid ID to purchase alcohol. We card everyone — no exceptions.",
    "default": "That's a great question! For the most accurate answer, please call us at (541) 895-3000 or visit us at 5 South Front St. Our team is always happy to help!"
};
