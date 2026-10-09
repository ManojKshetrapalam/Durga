# Sri Durga Devi Temple — Digital Mandapa

> **"The Temple in Your Pocket"**  
> *Devotee First. Simple. Useful Every Day. WhatsApp Enabled. Temple Controlled.*

A complete mobile-first Progressive Web App (PWA) devotee digital front desk for **Sri Durga Parameshwari Temple**, Chandra Layout 1st Phase, Bengaluru - 560 072 (Tel: 080-23394447).

---

## 1. Project Overview
Sri Durga Devi Temple Digital Mandapa bridges centuries of temple sacred tradition with effortless modern mobile access. Devotees can discover authentic poojas and homas, check real-time date availability, read daily Vedic Panchanga with Rahu Kala and auspicious muhurthas, generate counter booking tokens, and communicate directly with temple Archakas over WhatsApp — all without app store downloads.

---

## 2. Current Status
- **Phase 0–6 (Discovery, UX & Stitch Loop Screen System):** ✅ COMPLETE
- **Phases 7–18 (Production PWA Implementation & Verification):** ✅ COMPLETE
- **Surendra Jat Panchang Engine & Interactive Monthly Calendar (Cache v11):** ✅ IMPLEMENTED
  - Integrated Surendra Jat Panchang ephemeris algorithm powered by `astronomy-engine` for exact Bengaluru coordinates.
  - Dynamically calculates 11 Karanas (7 Chara cycling & 4 Sthira), 6 Ritus, 60 Jovian Samvatsaras, 12 Masas, Solar Horizon (Sunrise, Sunset, Midday Solar Noon), and Hindu/temple festivals across any future/past year.
  - Interactive Monthly View Calendar Modal (`panchangaMonthModal.js`): Devotees can tap any date in the Panchanga date stepper to inspect the complete monthly calendar with Tithi, Paksha, Nakshatra, moon phases, and sacred festivals/vratas (Ekadashi, Pournami, Amavasya, Sankashti, etc.), selecting any day to immediately load its complete Vedic Panchanga view.
  - Upgraded Service Worker cache strategy to Network-First (`durga-mandapa-v11`) to ensure immediate live updates without stale browser caching.
- **Complete Temple CMS Suite (`adminApp.js`, `store.js`, `tokens.css`):** ✅ FULLY IMPLEMENTED
  - **WhatsApp & Contact Settings:** Admin can configure and update the temple WhatsApp phone number, display formatting, and default greeting. All booking deep-links, alternative inquiry links, and public buttons immediately use the updated number.
  - **Archakas & Priests Management:** Add, edit, toggle duty status (Active/On Leave), and remove temple Archakas, with image upload, designation, Vedic linage, experience, and specialization tags. Dynamic priest assignment in the booking desk.
  - **Darshan & Prakaara Photo Gallery CMS:** Add, edit, re-order, and delete photos with instant file upload preview or image URLs. Dynamic category filtering (Garbha Gudi, Architecture, Deepotsava, Alankara, Utsava) immediately reflected on the public landing page.
  - **Devotee Notices & Special Alerts CMS:** Multi-tier broadcasting featuring top notice board marquee plus priority-tagged (Urgent, Auspicious, Seva, General) in-app cards with interactive CTA action buttons for devotee app and web.
  - **Festival & Events CMS:** Create, publish, and schedule grand temple celebrations with 10-day Alankara schedules, Homas, and poster invitations.

---

## 3. Technology Stack
- **Frontend / PWA Shell:** Vanilla Modern ES2022 / HTML5 / CSS3 Variables / PWA Service Worker.
- **Astronomical Ephemeris:** `astronomy-engine` (ESM vendored) with IAU-2006 Lahiri Ayanamsa.
- **Visual Design Tokens:** Devotional Temple Mandapa (`.stitch/DESIGN.md`): Warm Ivory (`#FAF7F2`), Pure Cream (`#FFFDF8`), Deep Maroon (`#721C2B`), Antique Gold (`#C59B27`), Auspicious Saffron (`#D95D0F`).
- **Typography:** Playfair Display (Devotional Serif) & Plus Jakarta Sans (Elderly-accessible Humanist Sans, min 15px).
- **Storage:** Client `localStorage` / `IndexedDB` with Service Worker offline caching.
- **Integrations:** Direct WhatsApp protocol (`https://wa.me/919845012345`), QR code on-ramp parameters.

---

## 4. AI Quick Start
- **Entry Points:**
  - Grand Devotional Landing Page: `app/index.html` (Responsive desktop & mobile with audio chant, live Panchanga strip, 21 sevas showcase, phone preview)
  - Mobile Devotee PWA Front Desk: `app/app.html` (Standalone PWA with bottom nav, touch targets, offline cache)
  - Standalone Trustee & Archaka Webpage: `app/admin.html` (Full-width responsive desktop portal with PIN 1008 / password login)
  - Physical QR On-Ramp: `app/app.html?spot=entrance`
- **Design Specifications & Tokens:** `.stitch/DESIGN.md`, `app/css/tokens.css`
- **Generated Stitch Screens:** `.stitch/designs/` (`home.png`, `pooja-detail.png`, `calendar-availability.png`, `panchanga-daily.png`, `booking-request.png`, `qr-landing.png`, `admin-dashboard.png`)
- **Core Business Logic:**
  - Date Availability Precedence Engine: `app/js/services/availabilityEngine.js`
  - Surendra Jat Astronomical Panchanga Engine: `app/js/services/panchangaService.js` & `app/js/lib/astronomy.js`
  - WhatsApp Deep-Link & Token Generator: `app/js/services/whatsappService.js`
  - Unified State Store: `app/js/services/store.js`

---

## 5. Important Project Structure

```
Durga/
├── AGENTS.md                    # Project-specific AI operating guardrails
├── README.md                    # Project onboarding and navigation index
├── .stitch/                     # Stitch Loop design system and generated screens
│   ├── DESIGN.md                # Semantic design tokens and styling rules
│   ├── SITE.md                  # Project constitution and screen inventory
│   ├── metadata.json            # Stitch project tracking
│   └── designs/                 # Generated HTML and PNG screen previews
├── docs/                        # Comprehensive technical documentation
│   ├── product-requirements.md  # Detailed PRD
│   ├── ux-flows.md              # Devotee and Admin sequence journeys
│   ├── screen-inventory.md      # 79 touchpoints mapped to 7 templates
│   ├── design-system.md         # CSS tokens and component specs
│   ├── architecture.md          # System architecture and data flow
│   ├── pwa.md                   # PWA manifest, service worker, safe-areas
│   ├── availability-engine.md   # Hierarchy of availability rules & algorithms
│   ├── whatsapp.md              # WhatsApp deep-link contracts & token spec
│   ├── database.md              # Data models & schemas
│   ├── admin-panel.md           # Temple desk operations
│   └── testing.md               # QA and verification plan
├── app/                         # Production Mobile PWA Application
│   ├── index.html               # Mobile-first PWA HTML entrypoint
│   ├── manifest.webmanifest     # Web App Manifest
│   ├── sw.js                    # Offline Service Worker
│   ├── src/                     # Modular client source code
│   │   ├── styles/              # Design system tokens and styles
│   │   ├── components/          # Reusable devotional UI components
│   │   ├── data/                # Authentic temple data (21 sevas, timings)
│   │   └── utils/               # Availability, Panchanga, WhatsApp utilities
│   └── icons/                   # PWA touch icons
└── tests/                       # Automated unit and integration tests
```

---

## 6. Where To Change What

| Concern / Feature | Primary Location | Related Locations |
|---|---|---|
| **Design Tokens & Theme** | `app/css/tokens.css` | `app/css/admin.css`, `.stitch/DESIGN.md` |
| **Seva Catalog & Kanike Rates** | `app/js/data/sevas.js` | `app/js/adminApp.js`, `app/js/services/store.js` |
| **Temple Darshan & Aarti Timings**| `app/js/data/timings.js` | `app/js/views/homeView.js`, `app/index.html` |
| **Panchanga & Kaala Timings** | `app/js/services/panchangaService.js` | `app/js/views/panchangaView.js`, `app/js/components/panchangaMonthModal.js` |
| **Date Availability & Blocking** | `app/js/services/availabilityEngine.js` | `app/js/adminApp.js`, `app/js/views/calendarView.js` |
| **WhatsApp Settings & Integration**| `app/js/services/whatsappService.js` | `app/js/adminApp.js`, `app/js/services/store.js` |
| **Archakas & Priests CMS** | `app/js/adminApp.js` | `app/js/services/store.js`, `app/css/admin.css` |
| **Darshan & Photo Gallery CMS** | `app/js/adminApp.js` | `app/js/landingApp.js`, `app/index.html`, `app/js/services/store.js` |
| **Notices & Devotee Alerts CMS** | `app/js/adminApp.js` | `app/js/views/homeView.js`, `app/js/services/store.js` |
| **Festival & Events CMS** | `app/js/adminApp.js` | `app/js/components/festivalCard.js`, `app/js/views/homeView.js` |
| **PWA Offline & App Shell** | `app/sw.js`, `app/manifest.json` | `app/js/app.js`, `app/app.html` |

---

## 7. Business Rules & Logic Hierarchy
1. **Administrative Block Priority:** If temple trustees or archakas block a date (e.g., 15 Oct 2026 for Navaratri Chandi Homa), it immediately overrides all calendar availability, displays the public reason, and presents 3 recommended alternative dates.
2. **Seva Day Constraints:** Specific sevas can only occur on designated days (Durga Homa on Fridays at 10 AM; Tuesday Rahukala Deepada Seva at 3:30 PM; Vahana Pooja morning/evening).
3. **Counter Kanike Principle:** Seva contributions are payable at the physical temple billing counter via Cash or UPI/GPay/PhonePe upon arrival, where official printed receipts and prasadam are issued.

---

## 8. Local Development & Verification
1. Open the project in any static server or live server:
   ```powershell
   npx serve app -p 3000
   ```
2. Run automated logic tests:
   ```powershell
   node tests/run-all-tests.js
   ```

---

## 9. Deployment Details
- **Production Server:** Hostinger VPS (`myworks.sbs`)
- **Configured Host:** `31.97.225.172` (SSH alias: `myworks`, user: `u996219523`, port: `65002`)
- **Remote Webroot:** `domains/myworks.sbs/public_html/durga`
- **Live Production URL:** **[https://myworks.sbs/durga/](https://myworks.sbs/durga/)**
  - Devotee Front Desk: `https://myworks.sbs/durga/`
  - Temple Management Desk: `https://myworks.sbs/durga/#admin`
  - On-Premises QR Desk: `https://myworks.sbs/durga/?spot=entrance`
