# Fast Mart — Creswell, Oregon

A static **Progressive Web App** storefront for Fast Mart, a family-owned craft
beer boutique and convenience store in Creswell, OR. Built as plain
HTML/CSS/JavaScript (no build step) with a Three.js 3D hero, GSAP scroll
animations, an inventory checker, a loyalty dashboard, a daily-deals carousel,
and a geolocation "concierge" with a built-in FAQ chatbot.

This repo restructures the original single-file design into an organized,
maintainable layout. The look, feel, and behavior are unchanged.

## Project structure

```
.
├── index.html                  # Page markup; links the CSS + JS modules below
├── manifest.webmanifest        # PWA manifest
├── service-worker.js           # Offline caching (network-first + fallback)
├── robots.txt                  # SEO crawl directives
├── sitemap.xml                 # SEO sitemap
├── _headers                    # Cloudflare Pages caching / SW scope headers
├── favicon.ico                 # Multi-size favicon (16/32/48)
├── assets/
│   └── fast-mart-logo.png      # Official brand logo (transparent)
├── icons/                      # PWA / device icons generated from the logo
│   ├── favicon-32.png
│   ├── icon-192.png            # App icon (any)
│   ├── icon-512.png            # App icon (any)
│   ├── icon-maskable-512.png   # App icon (maskable safe-zone)
│   └── apple-touch-icon.png    # iOS home-screen icon (180)
└── src/
    ├── css/
    │   ├── tokens.css          # Design tokens (:root brand variables)
    │   ├── base.css            # Reset, body, loading screen, utilities
    │   ├── layout.css          # Nav, hero, section chrome, footer
    │   ├── modules.css         # The 4 feature modules (cellar/loyalty/deals/concierge)
    │   └── responsive.css      # Breakpoints + reduced-motion (loaded LAST)
    └── js/
        ├── data/
        │   ├── config.js       # Business NAP + chatbot answers (source of truth)
        │   ├── inventory.js    # Craft beer catalog (BEER_INVENTORY)
        │   └── deals.js        # Weekly deals (DAILY_DEALS)
        ├── modules/
        │   ├── loading.js      # Loading screen + kicks off entrance animations
        │   ├── three-scene.js  # 3D hero bottle + particles (needs global THREE)
        │   ├── animations.js   # GSAP scroll reveals + counter (needs gsap)
        │   ├── inventory.js    # Module 2: search/render + waitlist notifications
        │   ├── loyalty.js      # Module 3: referral link copy
        │   ├── carousel.js     # Module 4: deals carousel (dots/arrows/swipe/autoplay)
        │   ├── concierge.js    # Module 5: geolocation distance + directions
        │   ├── chat.js         # FAQ chatbot
        │   ├── nav.js          # Smooth scroll + mobile menu
        │   └── pwa.js          # Service worker registration
        └── main.js             # Entry point (init 3D scene, console branding)
```

### How the scripts load

The JS files are **classic (non-module) scripts** loaded in a deliberate order
at the bottom of `index.html`: data → modules → `main.js`. They share global
scope on purpose, so the inline `onclick` handlers in the markup keep working.
Third-party libraries (Three.js, GSAP, Font Awesome) load first from CDN. If
you move to a bundler later, those globals and the inline handlers are the
things to refactor.

## Running locally

No dependencies or build step. Serve the folder over HTTP (a service worker and
the geolocation/notification APIs need a real origin — opening the file
directly with `file://` will not work):

```bash
npm run dev        # python3 -m http.server 8000
# then open http://localhost:8000
```

Any static server works (`npx serve`, `php -S`, VS Code Live Server, etc.).

## Deploying to Cloudflare Pages

This is a static site, so it deploys as-is:

```bash
npx wrangler pages deploy . --project-name fast-mart
# or: npm run deploy
```

Or connect the GitHub repo in the Cloudflare dashboard with **no build command**
and the output directory set to the repo root (`.`). The `_headers` file
configures caching and the service-worker scope automatically.

## Editing content

Most day-to-day content lives in `src/js/data/`:

- **Inventory** — edit `data/inventory.js` (`BEER_INVENTORY`).
- **Weekly deals** — edit `data/deals.js` (`DAILY_DEALS`).
- **Business info & chatbot answers** — edit `data/config.js`.

> **NAP consistency note.** Because this is a static page, the business name /
> address / phone / hours also appear in three non-JS places that must be kept
> in sync by hand: the JSON-LD block and visible address in `index.html`, and
> the `<title>`/meta tags. `data/config.js` documents this.
>
> The supplied design uses phone **(541) 895-3000** and hours **Mon–Fri 6 AM–10
> PM / Sat–Sun 7 AM–11 PM**, which differ from the business analysis report
> (**(541) 895-5511**, daily **6 AM–11 PM**). Reconcile these before launch —
> consistent NAP across the site and listings is a core SEO/AEO requirement.

## Roadmap (from the business analysis report)

The structure is ready for the report's next phases: real inventory/POS
integration behind the cellar search, a persistent loyalty backend, online
ordering, push notifications for the waitlist, and a richer chatbot. The
Cloudflare platform (D1 / KV / R2 / Workers) is a natural fit for these.
