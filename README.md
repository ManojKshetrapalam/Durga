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
  - All 7 core reusable screen templates generated via Stitch Loop, downloaded (`.stitch/designs/*.html` & `*.png`), visually verified, and aligned with `Devotional Temple Mandapa` design tokens.
  - Comprehensive documentation created in `/docs/` (PRD, UX flows, screen inventory, design tokens, architecture, PWA spec, database schemas, availability engine, WhatsApp integration, admin panel, testing plan).
- **Phases 7–18 (Production PWA Implementation & Verification):** 🚀 READY FOR IMPLEMENTATION

---

## 3. Technology Stack
- **Frontend / PWA Shell:** Vanilla Modern ES2022 / HTML5 / CSS3 Variables / PWA Service Worker.
- **Visual Design Tokens:** Devotional Temple Mandapa (`.stitch/DESIGN.md`): Warm Ivory (`#FAF7F2`), Pure Cream (`#FFFDF8`), Deep Maroon (`#721C2B`), Antique Gold (`#C59B27`), Auspicious Saffron (`#D95D0F`).
- **Typography:** Playfair Display (Devotional Serif) & Plus Jakarta Sans (Elderly-accessible Humanist Sans, min 15px).
- **Storage:** Client `localStorage` / `IndexedDB` with Service Worker offline caching.
- **Integrations:** Direct WhatsApp protocol (`https://wa.me/919845012345`), QR code on-ramp parameters.

---

## 4. AI Quick Start
- **Entry Points:**
  - Devotee App: `app/index.html`
  - Admin Desk: `app/index.html#admin`
  - Physical QR On-Ramp: `app/index.html?spot=entrance`
- **Design Specifications & Tokens:** `.stitch/DESIGN.md`, `docs/design-system.md`
- **Generated Stitch Screens:** `.stitch/designs/` (`home.png`, `pooja-detail.png`, `calendar-availability.png`, `panchanga-daily.png`, `booking-request.png`, `qr-landing.png`, `admin-dashboard.png`)
- **Core Business Logic:**
  - Date Availability Engine: `app/src/utils/availability.js`
  - Panchanga Engine: `app/src/utils/panchangaCalc.js`
  - WhatsApp Deep-Link Engine: `app/src/utils/whatsappLink.js`

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
| **Design Tokens & Theme** | `.stitch/DESIGN.md` | `app/src/styles/tokens.css`, `docs/design-system.md` |
| **Seva Catalog & Kanike Rates** | `app/src/data/sevas.js` | `app/src/components/pooja/`, `app/src/components/admin/` |
| **Temple Darshan & Aarti Timings**| `app/src/data/timings.js` | `app/src/components/home/`, `app/src/utils/panchangaCalc.js` |
| **Panchanga & Kaala Timings** | `app/src/utils/panchangaCalc.js` | `app/src/components/panchanga/`, `docs/database.md` |
| **Date Availability & Blocking** | `app/src/utils/availability.js` | `app/src/components/calendar/`, `docs/availability-engine.md` |
| **WhatsApp Messages & Token Gen** | `app/src/utils/whatsappLink.js` | `app/src/components/booking/`, `docs/whatsapp.md` |
| **Admin Controls (Blocks & Sevas)**| `app/src/components/admin/` | `app/src/data/mockAdminStore.js`, `docs/admin-panel.md` |
| **PWA Offline & Install Prompt** | `app/sw.js`, `manifest.webmanifest`| `app/src/components/common/PwaBanner.jsx`, `docs/pwa.md` |

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
- **Target Subdirectory:** `public_html/durga` -> `https://myworks.sbs/durga`
