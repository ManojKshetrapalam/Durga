# Stitch Site Constitution: Sri Durga Devi Temple — Digital Mandapa

## 1. Core Identity
- **Project Name:** Sri Durga Devi Temple — Digital Mandapa
- **Stitch Project ID:** `2845673280044936200`
- **Product Type:** Mobile-first Progressive Web App (PWA) & Devotee Digital Front Desk
- **Philosophy:** Devotee First. Simple. Useful Every Day. WhatsApp Enabled. Temple Controlled.
- **Physical Temple Location:** Chandra Layout 1st Phase, Bangalore - 560 072 (Tel: 080-23394447)
- **Target Audience:** Multi-generational devotees, elderly citizens, families, first-time temple visitors, temple administration staff.
- **Voice & Tone:** Dignified, welcoming, sacred, crystal-clear, supportive, hassle-free.

## 2. Visual Language
- **Primary Aesthetic:** Warm Sacred Ivory & Handmade Paper
- **Secondary Aesthetic:** Royal Temple Maroon & Antique Gold
- **Tertiary Accent:** Saffron Flame & Devotional Brass
- **Design Tokens Source:** `.stitch/DESIGN.md`

## 3. Architecture & Screen Flow Architecture
- **Staging Directory:** `.stitch/designs/` (HTML + PNG screen captures)
- **Production Mobile App:** `app/` (Mobile PWA & responsive web shell)
- **Admin Dashboard:** `app/admin/` (Administrative control panel)
- **API & Engine:** `server/` (Date availability engine, Panchanga calculator, booking queue, WhatsApp deep link generator)
- **Navigation Architecture:**
  - Devotee PWA: 5-Tab Persistent Bottom Navigation (Home | Poojas | Calendar | Panchanga | More)
  - Persistent Floating Action: Contextual WhatsApp Assistant with pre-filled temple queries
  - Physical On-Ramp: QR Code Smart Entrypoints (`?source=entrance`, `?source=pooja-counter`, `?source=reception`, `?source=donation-counter`)

## 4. Live Sitemap & Screen Inventory Matrix
The product decomposes into 7 Core Reusable Screen Templates covering all 79 devotee touchpoints:

- [x] `home.html` — Devotee Dashboard (Namaskara banner, Today at Temple, Panchanga strip, Temple timings, Explore Poojas & Homas, WhatsApp Help, Events)
- [x] `pooja-detail.html` — Pooja & Homa Detail Screen (Quick facts, About, Split checklist: Temple Provides vs Devotee Should Bring, Check Dates CTA, WhatsApp CTA)
- [x] `calendar-availability.html` — Smart Spiritual Calendar & Date Availability (Month grid, green/red status badges, event overlays, smart alternative date recommendations)
- [x] `panchanga-daily.html` — Daily Panchanga & Temple Timings Utility (Tithi, Nakshatra, Yoga, Karana, Rahu Kala, Yamaganda, Gulika, Sunrise/Sunset, Seva schedule)
- [x] `booking-request.html` — Devotee Request & Booking Flow (Step-by-step: Pooja -> Date -> Time Slot -> Devotee Details -> Review -> WhatsApp / Instant Confirmation)
- [x] `qr-landing.html` — Fast QR On-Premises Landing Experience (Instant contextual helper for physical temple visitors: Entrance, Pooja counter, Reception, Notice board)
- [x] `admin-dashboard.html` — Temple Staff Control Desk (Calendar date blocking, Pooja/Homa management, Timings adjustment, WhatsApp config, Devotee request inbox)

## 5. The Roadmap (Build Backlog)

### High Priority (Sprint 1 — Core Devotee Utility)
- Generate Home Devotee Dashboard screen via Stitch Loop (`home.html`)
- Generate Pooja/Homa Detail with Split Checklist (`pooja-detail.html`)
- Generate Smart Calendar & Availability Engine view (`calendar-availability.html`)
- Generate Panchanga & Temple Timings Daily Utility (`panchanga-daily.html`)
- Generate Mobile Booking Request Stepper (`booking-request.html`)

### Medium Priority (Sprint 2 — Physical & Administrative Interactivity)
- Generate QR Contextual Physical On-Ramp (`qr-landing.html`)
- Generate Admin Control Dashboard (`admin-dashboard.html`)
- Implement WhatsApp dynamic message link generation engine
- Implement offline PWA Service Worker caching (Shell + Panchanga + Poojas)

### Low Priority (Sprint 3 — System Polish & Extras)
- Multi-language localization scaffold (English, Kannada, Hindi)
- Audio chant integration (`Om-Slogan-Final.mp3` devotional ambience)
- Comprehensive PWA installation prompt and iOS home screen banners

## 6. Creative Freedom Guidelines
- Devotee cards must prioritize large touch targets (min 48px) and large, easily readable text for elderly devotees.
- Never use complicated astrology jargon without plain-language explanations.
- Temple administrative control always overrides automated rules for date availability.
