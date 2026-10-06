# Testing & Quality Assurance Plan: Sri Durga Devi Temple

## 1. Testing Philosophy & Standards
In accordance with Manoj Global Engineering Brain and Ponytail Senior Dev rules:
- **Zero Generic AI Slop:** No unverified mock libraries or brittle test scaffolding.
- **Evidence-Driven Verification:** Direct runnable node/browser test scripts validating core business rules and edge cases.
- **Mobile-First Viewport QA:** Explicit verification across all primary mobile widths: 360px, 375px, 390px, 412px, 430px.

---

## 2. Test Suites & Verification Coverage

### Suite 1: Date Availability & Rule Precedence Engine
- **Test 1.1 (Admin Block Priority):** Verifies that an administrative block on a date (e.g. 15 Oct 2026) immediately flags `isAvailable: false`, returns the admin reason, and provides the 3 recommended alternative dates, overriding any general auspiciousness.
- **Test 1.2 (Seva Day Constraint):** Verifies that attempting to book a Friday-only seva (Durga Homa) on non-Fridays triggers `DAY_MISMATCH` with recommended upcoming Fridays.
- **Test 1.3 (Alternative Date Search Heuristic):** Verifies that when a date is blocked, the engine finds the nearest valid, non-blocked dates adhering to seva constraints.

### Suite 2: Panchanga & Kaala Timings Verification
- **Test 2.1 (Kaala Calculation):** Verifies that Tuesday Rahu Kala is calculated at `03:00 PM – 04:30 PM`, matching real temple schedule for Rahukala Deepada Seva.
- **Test 2.2 (Solar Arc & Horizon):** Verifies correct sunrise (06:12 AM), sunset (06:18 PM), and day length computation for Bengaluru coordinates (`12.97° N, 77.59° E`).

### Suite 3: WhatsApp Deep-Link & Token Generator
- **Test 3.1 (Token Format):** Verifies that generated token conforms to regex `^SDD-\d{4}-\d{4}-\d{3}$`.
- **Test 3.2 (Message URL Encoding):** Verifies that all special characters, emojis, line breaks, and Sanskrit transliterations are properly percent-encoded without truncation.

### Suite 4: Mobile Viewport & PWA Accessibility QA
- **Test 4.1 (Touch Target Size):** Verifies all interactive buttons, cards, and input fields maintain $\ge 48\text{px} \times 48\text{px}$ touch surface.
- **Test 4.2 (Contrast & Typography):** Verifies text contrast ratio $\ge 4.5:1$ on Warm Ivory canvas (`#FAF7F2`) and Pure Cream cards (`#FFFDF8`).
- **Test 4.3 (Horizontal Overflow):** Verifies `document.documentElement.scrollWidth <= window.innerWidth` across 360px, 375px, 390px, 412px, 430px viewports (zero horizontal scrolling).
