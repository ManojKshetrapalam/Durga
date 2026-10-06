# Product Requirements Document (PRD)

## Project: Sri Durga Devi Temple — Digital Mandapa
**Tagline:** "The Temple in Your Pocket"  
**Philosophy:** Devotee First. Simple. Useful Every Day. WhatsApp Enabled. Temple Controlled.  
**Target Platform:** Mobile-First Progressive Web App (PWA) + Responsive Web + Dedicated Admin Control Panel.  
**Temple Location:** Chandra Layout 1st Phase, Bangalore - 560 072  
**Temple Contact:** 080-23394447 | Instagram: @durgaparameshwari_devasthaana  

---

## 1. Executive Summary & Vision
Traditional temple websites are static digital brochures that list history, blurry photo galleries, and generic phone numbers that often go unanswered. Devotees face persistent friction: they don't know pooja timings, they don't know what items to bring, they don't know if a specific date is auspicious or blocked for a temple festival, and they don't know how to reach the priests directly.

The **Digital Mandapa** transforms the temple's physical front desk into an effortless mobile companion. Devotees can answer their most pressing questions in two taps:
1. *What poojas and homas are offered, how long do they take, and what is the contribution?*
2. *What does the temple provide, and what exactly must I bring from home?*
3. *What is today's Panchanga, Rahu Kala, Yamaganda, and darshan timings?*
4. *Is my chosen date available or blocked by a temple festival? If blocked, what are alternative dates?*
5. *Can I get immediate help or book via WhatsApp with pre-filled context?*
6. *Can physical visitors scan QR codes around the temple to get instant answers?*

---

## 2. Devotee Personas & Target Users

### Persona 1: Elderly Devotee (e.g., Smt. Parvathamma, 68)
- **Profile:** Visits the temple weekly, uses WhatsApp, finds complex apps overwhelming, struggles with small fonts and low contrast.
- **Needs:** Check today's Rahu Kala and evening aarti timings, know when Friday Durga Homa starts, find out what fruits/flowers to bring.
- **Design Requirement:** High contrast, large touch targets (≥48px), minimum 15px-16px text, zero confusing tech jargon, one-tap WhatsApp.

### Persona 2: Working Family (e.g., Ramesh & Sudha, 38)
- **Profile:** Busy professionals planning a special anniversary pooja or child's Ayushya homa.
- **Needs:** Check date availability weeks in advance, compare homas, know exact seva contributions and durations, book online or via WhatsApp.
- **Design Requirement:** Clean calendar availability, transparent checklists (Temple Provides vs Devotee Brings), date suggestions if primary date is blocked.

### Persona 3: Physical Walk-in Visitor (e.g., Sneha, 24)
- **Profile:** Visiting temple for the first time, scans QR code at entrance or pooja counter.
- **Needs:** Instant overview of sevas and timings without waiting in a long queue or downloading a heavy app store app.
- **Design Requirement:** Instant PWA launch under 1.5s, no forced signups, location-aware landing (`?source=entrance`, `?source=pooja-counter`).

### Persona 4: Temple Priest / Administrative Staff (e.g., Sri Shastriji)
- **Profile:** Manages temple rituals, festivals, and seva queues.
- **Needs:** Easily block dates for temple festivals, adjust pooja timings, review incoming seva requests, update emergency notices.
- **Design Requirement:** Fast, protected admin panel with clear calendar controls and WhatsApp broadcast capability.

---

## 3. Core Functional Pillars

### Pillar A: Devotee-First Discovery (Poojas & Homas)
- Categorized seva catalog (Daily Sevas, Special Abhishekas, Homas, Alankaras, Festivals).
- Real pricing and duration transparency based on Chandra Layout Sri Durga Parameshwari Temple banner data.
- Split Checklist pattern:
  - **Temple Provides:** Homa samagri, pooja articles, flowers, prasada.
  - **Devotee Should Bring:** Coconuts, specific fruits, vastra, ghee.
- Smart Search with auto-suggest for keywords (Durga, Homa, Kumkum, Archana, Rahukala).

### Pillar B: Daily Spiritual Utility (Panchanga & Temple Timings)
- Today's Panchanga at a glance: Tithi, Paksha, Nakshatra, Yoga, Karana.
- Critical inauspicious & auspicious windows: Rahu Kala, Yamaganda, Gulika Kala, Abhijit Muhurtha.
- Solar cycle: Sunrise and Sunset timings for Bangalore coordinates.
- Daily temple schedule:
  - Regular days: Morning 6:30 AM – 11:30 AM, Evening 5:30 PM – 8:30 PM.
  - Tuesdays: Morning 6:30 AM – 12:30 PM, Evening 3:30 PM – 8:30 PM (Rahukala Durga Deepada Pooja at 3:30 PM).
  - Fridays: Morning 6:30 AM – 2:00 PM (Durga Homa at 10:00 AM), Evening 5:30 PM – 8:30 PM.
  - Vehicle Pooja Timings: 9:00 AM – 11:00 AM, 6:00 PM – 8:00 PM.

### Pillar C: Smart Spiritual Calendar & Availability Engine
- Devotees select any date to see real-time availability:
  - 🟢 **Available:** Sevas can be performed.
  - 🔴 **Blocked / Temple Event:** Full or reserved for temple annual festival / Brahmotsava.
  - 🟡 **Limited Slots:** Few seva slots remaining.
- **Hierarchy of Truth:**
  1. Admin Block (Absolute Priority)
  2. Temple Major Event / Festival
  3. Pooja-specific rules (e.g., Rahukala Durga Homa only on Tuesday/Friday)
  4. Special Temple Day (Amavasya, Hunnime, Sankramana)
  5. Panchanga Muhurtha rules
  6. General availability
- **Smart Alternative Date Suggestions:** When a date is blocked, the engine calculates and suggests the next 3 auspicious/available dates.

### Pillar D: WhatsApp-First Conversational Layer
- Deep integration with WhatsApp (`https://wa.me/918023394447?text=...`).
- Context-sensitive pre-filled messages:
  - On Pooja detail: *"Namaskara 🙏 I would like to enquire about Durga Homa."*
  - On Blocked date: *"Namaskara 🙏 15 Oct is unavailable for Durga Homa. Can I enquire about alternative dates?"*
  - On Request submission: Sends formatted booking token directly to temple desk.
- Floating persistent WhatsApp assistance widget on every mobile screen.

### Pillar E: Physical QR On-Ramp
- Fast, streamlined onboarding when scanning QR codes placed physically across the temple:
  - `?source=entrance` → Welcoming visit planner & today's schedule.
  - `?source=pooja-counter` → Fast seva menu & price list with direct request.
  - `?source=reception` → General enquiry & priest consultation.
  - `?source=donation-counter` → Annadana Seva & temple development kanike details.

### Pillar F: Temple Administrative Control Desk
- Intuitive, staff-friendly interface to manage daily operations:
  - Calendar management: 1-click date blocking with custom reason tags.
  - Pooja & Homa master registry: edit descriptions, contribution, required items.
  - Devotee request inbox: view pending requests, approve, mark completed, contact via WhatsApp.
  - Daily banner / notice publisher (e.g., "Navaratri Brahmotsava Special Timings").
  - Analytics: most viewed sevas, most requested dates, QR scan metrics.

---

## 4. Non-Functional Requirements
- **Performance:** First Contentful Paint < 1.2s, Time to Interactive < 2.0s on 3G/4G mobile networks.
- **Offline Resilience:** Service Worker caches application shell, core temple facts, today's Panchanga, and seva catalogs. When offline, clear banner warns devotee that availability updates require internet.
- **PWA Capabilities:** Web App Manifest with icons, standalone display mode, smooth splash screen, zero URL bar in installed mode, iOS touch icon and safe-area support.
- **Accessibility:** WCAG 2.1 AA compliant. Minimum contrast 4.5:1, min touch target 48x48px, ARIA labels for calendar dates and icons, zero auto-playing media without user consent.
- **Security:** CSRF protection, input sanitization, rate-limited booking submissions, hashed admin credentials, zero plain-text secrets in repository.
