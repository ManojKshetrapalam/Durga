# AGENTS.md — Sri Durga Devi Temple (Digital Mandapa)

## Project Invariants & AI Operating Guardrails

### 1. Architectural Invariants
- **Mobile-First Devotee Front Desk:** The product is a Progressive Web App (PWA) designed primarily for 360px–430px smartphone viewports. Desktop is an expansive shell, never the primary baseline.
- **Offline Shell Capability:** The app shell, today's Panchanga, and seva guidelines MUST load from cache if the devotee has no cellular connectivity inside the temple sanctum.
- **Admin Supremacy in Date Availability:** Administrative date blocks and temple festival overrides ALWAYS take precedence over automated astrological calculations. If an admin blocks a date, the engine MUST flag it as blocked and provide alternative dates.
- **WhatsApp-First Reservation:** Never replace WhatsApp deep-linking with a mandatory online payment gateway. Seva contributions are payable at the physical temple counter (Cash/UPI) where official printed receipts are issued.

### 2. Design Token Integrity
- **Palette Strictness:** Canvas Warm Ivory (`#FAF7F2`), Pure Cream (`#FFFDF8`), Deep Maroon (`#721C2B`), Antique Gold (`#C59B27`), Auspicious Saffron (`#D95D0F`), Sandstone Border (`#EADFCD`), Deep Charcoal text (`#1C1917`).
- **No Generic AI Slop:** Prohibited: cold neon blues, purple gradients, generic SaaS dashboards, unstyled bootstrap cards, tiny illegible fonts (<14px), horizontal scrollbars.
- **Accessibility Minimum:** Touch targets must be $\ge 48\text{px} \times 48\text{px}$ to accommodate elderly devotees.

### 3. Real Temple Data Fidelity
- **Authentic Temple Identity:** Sri Durga Parameshwari Temple, Chandra Layout 1st Phase, Bengaluru - 560 072. Phone: `080-23394447`.
- **Preserve Real Sevas & Timings:** Never invent fake Hindu rituals or prices. Always draw from the 21 authentic sevas (₹10 Kumkuma Archana to ₹1,501 Durga Homa) and real temple schedules (e.g. Tuesday 3:30 PM Rahukala Deepada Seva, Friday 10:00 AM Durga Homa).

### 4. Verification Mandate
- Non-trivial logic in the Date Availability Engine, Panchanga Calculator, and WhatsApp token generator must be backed by runnable self-checks.
