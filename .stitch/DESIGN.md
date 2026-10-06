# Design System: Sri Durga Devi Temple — Digital Mandapa

## 1. Visual Theme & Atmosphere
A warm, serene, and devotional digital sanctuary designed as "The Temple in Your Pocket". The visual atmosphere balances ancient temple reverence with modern mobile usability: warm ivory handmade parchment tones, deep sacred maroon accents, antique gold highlights, and gentle diya ambient glow. It is dignified, spacious, and immediately clear for devotees of all generations, including elders and first-time temple visitors. It rejects cold SaaS grays, noisy neon gradients, and confusing desktop menus in favor of tactile cards, crystal-clear typography, and persistent WhatsApp and Panchanga utilities.

- **Density:** 5 (Balanced Daily Mobile Devotional Dashboard)
- **Variance:** 4 (Structured, Calm, Trustworthy)
- **Motion:** 5 (Subtle, Respectful micro-interactions, smooth bottom-sheet drawers)
- **Target Form Factor:** Mobile PWA (360px – 430px width priority, scalable to tablet/desktop)

## 2. Color Palette & Functional Roles
- **Canvas Ivory** (`#FAF7F2`) — Primary PWA background, warm unbleached parchment feel, eliminates eye fatigue.
- **Surface Cream** (`#FFFFFF` / `#FFFDF8`) — Card containers, bottom sheets, elevated modals.
- **Deep Maroon** (`#721C2B`) — Primary sacred color, temple identity, primary action buttons, active navigation states.
- **Deep Maroon Dark** (`#55121E`) — Pressed/hover button state.
- **Antique Gold** (`#C59B27`) — Sacred secondary accent, decorative borders, icons, diya aura, special seva badges.
- **Sacred Saffron** (`#D95D0F`) — Auspicious indicator, festival highlights, morning pooja badges.
- **Charcoal Devotee Ink** (`#1C1917`) — High-contrast primary typography for effortless reading by seniors.
- **Warm Stone Muted** (`#6B655E`) — Secondary metadata, durations, timings, instructions.
- **Gold Hairline Border** (`#EADFCD`) — Card borders and subtle section dividers (`rgba(197, 155, 39, 0.2)`).
- **Available Emerald** (`#15803D`) — Open dates, confirmed booking badge, morning pooja slots.
- **Blocked Vermilion** (`#B91C1C`) — Temple event blocked days, full seva slots.
- **WhatsApp Green** (`#25D366`) — Direct temple assistant action button and chat accents.

## 3. Typographic Architecture
- **Devotional Display & Titles:** `Cinzel` or `Playfair Display` (Devotional serif) — Track-tight, dignified, authoritative.
- **Headings & Micro Labels:** `Outfit` / `Plus Jakarta Sans` — Crisp geometric readability for tabs, buttons, chips.
- **Body & Devotee Text:** `Plus Jakarta Sans` / `Source Sans 3` — Relaxed leading (1.5), minimum 15px for body, maximum 65ch width.
- **Timings & Numerals:** High-legibility tabular figures (`font-variant-numeric: tabular-nums`) for Panchanga, Rahu Kala, costs (`₹`), and dates.
- **Accessibility Minimum:** All interactive touch targets ≥ 48px, minimum button text 15px bold, minimum card title 18px bold.

## 4. Component Stylings
- **Devotee Dashboard Header:** Warm ivory base with gold temple arch motif, greeting ("Namaskara 🙏"), today's quick Panchanga banner, and quick action chips.
- **Panchanga & Timings Strip:** Horizontally scrollable or stacked micro-cards showing Tithi, Nakshatra, Rahu Kala, Yamaganda, Sunrise/Sunset with clear iconography.
- **Pooja & Homa Cards:** Cream rounded card (`rounded-2xl`, 16px radius), warm gold hairline border, thumbnail image/icon, seva name, duration pill, contribution pill, and maroon CTA `[View Details]`.
- **Detail Screen Split Checklist:**
  - *Temple Provides* (Clean checklist with green tick badges).
  - *Devotee Should Bring* (Distinctive highlighted golden-ivory card with warm border).
- **Date & Calendar Selector:** Visual month grid with color-coded dot badges (Green = Available, Red = Blocked/Event, Gold = Special Seva day). Alternative date suggestions rendered as high-contrast pill buttons.
- **Persistent Bottom Navigation:** Fixed mobile nav (Home, Poojas, Calendar, Panchanga, More) with 52px height + safe-area padding, maroon active icon and label.
- **Floating WhatsApp Assist:** Sticky rounded floating badge / bar with WhatsApp icon: "Need Help? Ask the Temple on WhatsApp" pre-filling contextual pooja/date questions.
- **Bottom Sheets:** Rounded top corners (`rounded-t-3xl`), drag handle, smooth slide-up for quick actions, booking steps, and Panchanga expansions.

## 5. Layout & Responsive Principles
- **Strict Mobile-First:** Designed natively for 360px–430px viewports (iPhone, Android).
- **No Horizontal Overflow:** All content constrained within safe padding (`px-4` / 16px).
- **Sticky Actions:** Critical CTAs (e.g., "Check Available Dates", "Request Booking", "Ask on WhatsApp") stick to bottom above bottom navigation.
- **Single-Column Collapse:** All complex cards collapse cleanly into single-column vertical flows.

## 6. Design System Notes for Stitch Generation
Use this exact block for all Stitch screen generation prompts:
```
VISUAL DESIGN SYSTEM (SRI DURGA DEVI TEMPLE - DIGITAL MANDAPA):
- Canvas Background: Warm Ivory (#FAF7F2), paper/temple texture.
- Card Surfaces: Pure Cream (#FFFFFF / #FFFDF8) with 16px rounded corners (rounded-2xl) and 1px border (#EADFCD).
- Primary Color: Deep Maroon (#721C2B) for headers, primary pill buttons, and active indicators.
- Accent Color: Antique Gold (#C59B27) for borders, diya icons, and sacred badges.
- Auspicious Saffron (#D95D0F) for special seva flags and festival tags.
- Typography: Elegant Devotional Serif for temple titles; Ultra-readable Sans-serif (minimum 15px) in Deep Charcoal (#1C1917) for devotee readability.
- Touch Targets: Large minimum 48px buttons and cards for elderly devotees.
- Persistent UI: Mobile bottom navigation bar (Home, Poojas, Calendar, Panchanga, More) + Sticky WhatsApp Quick Assist button (#25D366).
- Prohibited: No cold neon blues, no purple gradients, no tiny desktop text, no horizontal scroll bars, no generic corporate SaaS templates.
```
