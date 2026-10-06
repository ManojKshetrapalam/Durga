# Design System & Token Specifications

## Project: Sri Durga Devi Temple — Digital Mandapa
**Design Personality:** Devotional Sanctuary. Warm Ivory, Deep Sacred Maroon, Antique Gold, Saffron Flame. High contrast, large touch targets, senior-friendly, zero AI clichés.

---

## 1. Design Tokens

### Color Palette (CSS Variables)
```css
:root {
  /* Canvas & Surfaces */
  --temple-bg-ivory: #FAF7F2;          /* Primary PWA unbleached parchment background */
  --temple-surface-cream: #FFFDF9;     /* Elevated card container background */
  --temple-surface-subtle: #F4EFE6;    /* Secondary card insets & pill backgrounds */
  
  /* Sacred Primary & Accents */
  --temple-maroon: #721C2B;            /* Primary brand, header serif, primary CTAs */
  --temple-maroon-dark: #55121E;       /* Button hover/active state */
  --temple-gold: #C59B27;              /* Sacred border accents, diya aura, icons */
  --temple-gold-light: #F7F1E1;        /* Light golden highlight badge surface */
  --temple-saffron: #D95D0F;           /* Auspicious indicator, festival highlights */
  --temple-saffron-light: #FFF0E5;     /* Light saffron tag pill surface */

  /* Devotee Readability Typography */
  --temple-text-charcoal: #1C1917;     /* Stone-900 primary text (high contrast AA/AAA) */
  --temple-text-muted: #6B655E;        /* Stone-600 secondary text, metadata, timings */
  --temple-text-caption: #8A8279;      /* Stone-500 captions, helper hints */

  /* Hairlines & Borders */
  --temple-border-gold: #EADFCD;       /* Subtle golden card perimeter border */
  --temple-border-focus: #C59B27;      /* Active input focus ring */

  /* Operational Status Colors */
  --temple-available: #15803D;         /* Available dates & slots */
  --temple-available-bg: #ECFDF5;      /* Available tag background */
  --temple-blocked: #B91C1C;           /* Blocked dates & festival closed slots */
  --temple-blocked-bg: #FEF2F2;        /* Blocked tag background */
  --temple-warning: #B45309;           /* Limited slots warning */
  --temple-warning-bg: #FFFBEB;        /* Limited tag background */

  /* Integration Accents */
  --temple-whatsapp: #25D366;          /* WhatsApp direct assist brand color */
  --temple-whatsapp-dark: #1EBE5D;     /* WhatsApp active tap state */

  /* Elevations */
  --temple-shadow-card: 0 4px 20px -2px rgba(114, 28, 43, 0.05), 0 2px 6px -1px rgba(197, 155, 39, 0.04);
  --temple-shadow-float: 0 10px 25px -3px rgba(114, 28, 43, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05);
}
```

### Typography Scale
- **Display Serif (Temple Title):** `Cinzel`, `Playfair Display`, serif. `24px - 28px`, font-weight 700, line-height 1.25.
- **Section Heading:** `Plus Jakarta Sans`, sans-serif. `19px - 21px`, font-weight 700, line-height 1.3.
- **Card Title / Subheading:** `Plus Jakarta Sans`, sans-serif. `16px - 18px`, font-weight 600, line-height 1.35.
- **Body Devotee Text:** `Plus Jakarta Sans` / `Source Sans 3`, sans-serif. `15px - 16px`, font-weight 400/500, line-height 1.5. Minimum 15px to guarantee readability for elderly devotees.
- **Captions & Metadata:** `Plus Jakarta Sans`, sans-serif. `13px - 14px`, font-weight 500, line-height 1.4.
- **Tabular Figures:** Numbers, rupees (`₹`), hours, and Rahu Kala timings use `font-variant-numeric: tabular-nums`.

### Spacing & Grid System
- Mobile PWA container max-width: `480px` centered on desktop displays.
- Outer page margin: `16px` (`p-4`).
- Section vertical gap: `20px` - `24px`.
- Card internal padding: `16px` - `20px`.
- Touch target minimum: `48px` x `48px` on all buttons, links, calendar dates, and icon buttons.
- Corner radii:
  - Cards: `16px` (`rounded-2xl`).
  - Buttons & Chips: `9999px` (`rounded-full`).
  - Inputs & Date cells: `12px` (`rounded-xl`).
  - Bottom navigation & Bottom sheets: `24px` top radius (`rounded-t-3xl`).

---

## 2. Reusable Component Standards

### Component A: Devotee Dashboard Header (`TempleHeader`)
- Shows gold arched border motif with sacred diya icon.
- Displays temple name: **Sri Durga Devi Temple**, Chandra Layout, Bangalore.
- Greeting: *"Namaskara 🙏 Plan Your Visit. Prepare Your Prayer."*
- Quick action pills: [Explore Poojas] [Explore Homas] [WhatsApp the Temple].

### Component B: Panchanga & Timings Strip (`PanchangaCard`)
- High-contrast horizontal card displaying:
  - Today's date & Tithi (e.g. *Shukla Ashtami*)
  - Nakshatra (e.g. *Rohini*)
  - Rahu Kala (e.g. *10:30 AM – 12:00 PM*)
  - Sunrise & Sunset (e.g. *6:10 AM | 6:15 PM*)
- 1-tap deep dive opening full Panchanga details.

### Component C: Pooja & Homa Card (`SevaCard`)
- Cream elevated card with warm gold border.
- Seva title in deep maroon.
- Quick facts row: Duration pill (`3 hours`), Contribution pill (`₹XXXX`), Days pill (`Every Friday`).
- Short description (max 2 lines).
- Primary pill button: `[View Details]` in deep maroon.

### Component D: Split Checklist (`SplitChecklist`)
- Used on Pooja/Homa detail screens to solve the #1 devotee confusion:
  - **Temple Provides:** Clean list with green checkmark circles (`✓ Homa Samagri`, `✓ Pooja Articles`, `✓ Flowers`, `✓ Prasada`).
  - **Devotee Should Bring:** Warm highlighted golden card (`✓ Coconuts`, `✓ 5 Fruits`, `✓ Vastra / Dhoti`, `✓ Ghee`).

### Component E: Smart Spiritual Calendar Grid (`AvailabilityCalendar`)
- Month switcher.
- Day cells with clear color dots:
  - 🟢 Green dot: Open & Available.
  - 🔴 Red dot: Blocked by Temple Event / Reserved.
  - 🟡 Amber dot: Limited slots remaining.
- If selected date is blocked, automatically renders:
  - Blocked notice: *"🔴 Selected Date Unavailable — [Reason]"*
  - Smart alternatives: 3 pill buttons showing next available dates.

### Component F: Contextual Sticky WhatsApp Assistant (`WhatsAppButton`)
- Sticky floating button or persistent bottom bar action.
- Green pill with WhatsApp icon and white text: *"Need Help? Ask on WhatsApp"*.
- Automatically constructs pre-filled message URL based on current screen context.

### Component G: Persistent Bottom Navigation (`BottomNavigation`)
- Fixed bottom bar (height 64px + mobile safe-area inset).
- 5 sacred tabs:
  1. 🏠 **Home**
  2. 🪔 **Poojas**
  3. 📅 **Calendar**
  4. ☀️ **Panchanga**
  5. ℹ️ **More**
- Active tab highlighted in deep maroon with gold under-dot.
