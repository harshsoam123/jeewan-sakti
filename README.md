# Jeevan Shakti Herbs — Website

A premium, fully responsive landing website for **Jeevan Shakti Herbs**,
built around the flagship product **Magic Fat Cutter**. Pure HTML, CSS and
JavaScript — no frameworks, no build step. Upload as-is to GitHub Pages,
Netlify, Vercel, or any static host.

## What's inside

```
jeevan-shakti/
├── index.html          → all page content, SEO meta, schema markup
├── style.css            → design system + every section's styling
├── script.js             → all interactivity (nav, theme, animations, forms)
├── assets/images/        → empty by default (see its own README.md)
└── README.md             → this file
```

## Design language

The site uses an "herbarium ledger" direction rather than a generic
wellness template: a deep forest palette, a warm turmeric-gold accent
(the brand's greens stay primary, gold is used sparingly for CTAs and
highlights), a serif display face (Fraunces) paired with Poppins for
body text, and specimen-label styling (thin rule + small-caps eyebrow)
used throughout for product and ingredient callouts.

All product, packaging, and lifestyle visuals are the client's real
product photography (bottle shots, box shots, and lifestyle scenes),
stored in `assets/images/`. Small UI icons (FAQ accordion, gallery zoom
icon, benefit icons, etc.) remain inline SVG, since those are decorative
UI elements rather than product imagery. See `assets/images/README.md`
for a full map of which photo is used where, and how to swap any of them
out later.

## Features included

- Glassmorphism sticky navbar with smooth scroll, active-link highlighting, and a mobile hamburger menu
- Animated hero with floating leaves, a typing-effect headline, and a scroll indicator
- Light/dark mode toggle (persisted in `localStorage`)
- Custom cursor on desktop pointer devices (auto-disabled on touch)
- Scroll-reveal animations on every section (IntersectionObserver-based)
- Animated counters in the hero and About section
- Product showcase with feature chips, suggested-usage and storage-info specimen labels
- **Order Now section** with pack/quantity selection (1, 2, or 3 bottles), live price + delivery total calculation, Cash on Delivery / Pay Online toggle (with an auto-generated UPI QR code that updates its embedded amount as the pack or total changes), and one-click order submission straight to WhatsApp
- Benefits grid, "Why Choose Us" grid
- Gallery with hover zoom, lightbox viewer (click, arrow keys, swipe-friendly)
- Auto-playing testimonial slider with manual dot navigation
- FAQ accordion (single-open behavior)
- Contact form with inline client-side validation (name, phone, email, message)
- Embedded Google Map for the Moradabad office
- Floating WhatsApp, Call, and Back-to-Top buttons
- SEO: meta description/keywords, Open Graph, Twitter Card, canonical tag, and JSON-LD schema (Organization, Product, FAQPage)
- Accessibility basics: skip link, visible focus states, aria-labels on icon buttons, `prefers-reduced-motion` support

## Before you publish — required edits

1. **Social links** — In both the Contact section and the Footer of
   `index.html`, search for `REPLACE_WITH_INSTAGRAM_HANDLE` and
   `REPLACE_WITH_FACEBOOK_PAGE` and replace them with your real profile
   URLs. They're commented in the HTML so they're easy to find.

2. **Domain** — The `<link rel="canonical">` tag and all Open
   Graph/Twitter `og:url` / `og:image` tags in the `<head>` currently use
   a placeholder domain (`https://www.jeevanshaktiherbs.com/`). Update
   these to your real domain once you have one.

3. **Contact form → WhatsApp** — The form validates input in the
   browser, then opens WhatsApp (web or app) in a new tab with the
   name, phone, email, and message pre-filled as a draft message to
   **+91 93684 43747**. The visitor still has to tap Send on their end
   — there's no way for a pure static site to send WhatsApp messages
   automatically without their confirmation, since WhatsApp's API
   requires server-side authentication. If their browser blocks the new
   tab (some browsers block popups not triggered by a direct click), a
   "tap here to send it manually" fallback link appears in the success
   message, pointing at the same pre-filled WhatsApp link. To change
   the destination number, edit the `whatsappNumber` variable inside
   the contact form handler in `script.js`.

4. **Order Now pricing — update before publishing** — The Order section
   (`id="order"` in `index.html`) ships with placeholder prices: ₹999
   for 1 bottle, ₹1,849 for 2 (marked "Most Popular"), and ₹2,599 for 3
   (marked "Best Value"), all with free delivery. To set your real
   prices, edit the `data-price` and `data-label` attributes on the
   three `<input type="radio" name="pack">` elements, and update the
   visible price text (`<span class="pack-price">`) next to each one to
   match. If you want to charge delivery instead of offering it free,
   open `script.js`, find the `Order Now: Pricing + UPI QR + WhatsApp
   Order Submission` section near the bottom, and set
   `DELIVERY_CHARGE` to a number (e.g. `49`) — optionally also set
   `FREE_DELIVERY_ABOVE` to a rupee amount if you want delivery to
   become free only above a certain order value. The order form works
   like the contact form: it opens WhatsApp with the full order summary
   (pack, price, delivery, total, payment method, and the customer's
   name/phone/address) pre-filled as a draft message — the customer
   still taps Send themselves.

5. **UPI ID — set this before going live** — When a customer selects
   "Pay Online," a UPI QR code appears with the order total already
   embedded in it (so the customer doesn't have to type the amount —
   it's pulled in automatically when they scan with any UPI app like
   GPay, PhonePe, or Paytm). The QR currently points at a **placeholder
   UPI ID**, `jeevanshaktiherbs@upi`, which is not a real account. To
   fix this: open `script.js`, find the `Order Now: Pricing + UPI QR +
   WhatsApp Order Submission` section, and change the `UPI_ID` constant
   to your real UPI ID (the same one you'd give someone to receive a
   GPay/PhonePe/Paytm transfer, e.g. `9368443747@ybl` or
   `yourname@oksbi`). The QR is generated using a free public QR-image
   API (`api.qrserver.com`) — no account, backend, or payment gateway
   needed, since it's just encoding a standard UPI payment link as an
   image. If that API is ever unreachable (e.g. blocked by a strict
   network or ad-blocker), the QR image automatically falls back to a
   text message showing the UPI ID so customers can still pay manually.
   Since this is a QR-and-self-confirm flow rather than a connected
   payment gateway, the WhatsApp message asks the customer to share a
   payment screenshot so you can manually verify it arrived.

6. **Open Graph image (optional polish)** — Social share previews
   currently reuse `lifestyle-flatlay-marble.jpeg`, which works fine but
   isn't cropped to the ideal 1200×630px social-preview ratio. If you
   want a tighter-looking preview on WhatsApp/Facebook/Twitter, add a
   dedicated 1200×630px image to `assets/images/` and point the
   `og:image` / `twitter:image` tags at it. See `assets/images/README.md`.

## Customizing colors

Every color in the site is a CSS variable at the top of `style.css`:

```css
:root {
  --primary-green: #2E7D32;
  --light-green: #66BB6A;
  --accent-green: #8BC34A;
  --turmeric: #C98A2C;     /* the one warm accent — CTAs, highlights */
  --forest-deep: #14301A;  /* dark sections, footer, navbar text in dark mode */
  --parchment: #F6F3EA;    /* main background */
  ...
}
```

Change a value once here and it updates everywhere the color is used —
buttons, icons, cards, dark mode, all of it.

## Local preview

No build tools needed. From inside the project folder, run any static
server, for example:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080` in your browser. Opening `index.html`
directly by double-clicking also works for most features, though some
browsers restrict certain behaviors (like the Google Map iframe) when
loaded via `file://` — a local server avoids that.

## Deploying

This is a static site — there is no build step. Drag-and-drop or push
the whole folder to any of the following and you're live:

- **GitHub Pages**: push to a repo, enable Pages on the `main` branch, root folder.
- **Netlify**: drag the folder into the Netlify dashboard, or connect the repo.
- **Vercel**: import the repo, framework preset "Other," no build command needed.

## Browser support

Built with modern CSS (Grid, Flexbox, `backdrop-filter`, CSS custom
properties) and vanilla ES6+ JavaScript. Tested against current
Chrome, Edge, Firefox, and Safari. `backdrop-filter` (the glass navbar
effect) gracefully degrades to a solid background on the rare browser
that doesn't support it.

---

**Disclaimer copy reminder:** This site presents Magic Fat Cutter as an
Ayurvedic wellness supplement and avoids making medical claims, per the
brief. If you add new copy later, keep this in mind — avoid words like
"cure," "treat," or guaranteed results, and keep the suggested-usage
section pointing people to the product label and a healthcare
professional rather than giving dosage instructions yourself.
