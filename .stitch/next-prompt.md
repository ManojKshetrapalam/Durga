---
page: admin-dashboard
---
A mobile-first Progressive Web App (PWA) Administrative Control & Temple Desk Screen for Sri Durga Devi Temple — Digital Mandapa.

VISUAL DESIGN SYSTEM (SRI DURGA DEVI TEMPLE - DIGITAL MANDAPA):
- Canvas Background: Warm Ivory (#FAF7F2), sacred temple texture feel.
- Card Surfaces: Pure Cream (#FFFFFF / #FFFDF8) with 16px rounded corners (rounded-2xl) and 1px border (#EADFCD).
- Primary Color: Deep Maroon (#721C2B) for headers, active tabs, action buttons.
- Accent Color: Antique Gold (#C59B27) for admin badges, metric cards, and diya borders.
- Auspicious Saffron (#D95D0F) for pending approvals and festival notifications.
- Typography: Elegant Devotional Serif (Playfair Display) for temple titles; Ultra-readable Sans-serif (Plus Jakarta Sans, min 14px-15px) in Deep Charcoal (#1C1917) for tabular data and controls.
- Touch Targets: Large minimum 48px buttons and form controls.
- Persistent UI: Administrative quick action bar.

Page Structure (Concept Slide 13 - Temple Controlled Admin):
1. Admin Top Header:
   - Temple Logo & Name: "Sri Durga Devi Temple"
   - Admin Badge: "🛡️ Temple Management Desk (Trustee & Archaka Access)"
   - Logged-in profile: "Sri S. Ramesh (Chief Trustee)" with quick logout/switch icon.
2. Quick Metrics Row (3 cards with gold/maroon subtle accents):
   - "Today's Sevas": 18 Confirmed
   - "Pending Requests": 3 WhatsApp Inquiries
   - "Next Special Event": Navaratri Day 4 (15 Oct)
3. Date Blocking & Calendar Control Panel (Slide 13 core requirement):
   - Header: "Spiritual Calendar & Date Availability Controller"
   - Active Blocked Dates List:
     * Card 1: 📅 "15 Oct 2026 — Navaratri Chandi Homa" [Status: BLOCKED]
       - Devotee Display Note: "Sanctum reserved for community Chandi Homa. Individual homas paused."
       - Recommended Alternatives: "16 Oct, 18 Oct, 23 Oct"
       - Action: [Edit Reason] [Unblock Date]
   - Quick "Block a Date" Form:
     * Select Date picker, Reason dropdown (Festival / Temple Renovation / Eclipse / Archaka Leave), Alternative dates picker, [Save Block Rule] button.
4. Seva & Kanike Catalog Management:
   - Header: "Seva Offerings & Contribution Rates"
   - Seva Row 1: "Durga Homa" • ₹1,501 • 150 mins • [Active / Accepting Bookings toggle: ON] • [Edit Details]
   - Seva Row 2: "Rahukala Deepada Seva (Tuesday)" • ₹101 • 45 mins • [Toggle: ON]
   - Seva Row 3: "Maha Navaratri Special Chandi Homa" • ₹5,001 • [Limited Slots: 5 remaining]
   - Button: [+ Add New Seva / Special Festival Ritual]
5. Devotee Booking & Request Inbox:
   - Header: "Devotee WhatsApp Seva Requests"
   - Request 1: Suresh Kumar • Durga Homa (24 Oct) • Token: SDD-2026-1024-042 • [Status: 🟡 Needs Archaka Assignment] • [Open WhatsApp Chat]
   - Request 2: Ananya Rao • Rahukala Deepa Seva (Tomorrow) • [Status: 🟢 Confirmed]
6. Temple Timings & Notice Board Broadcast:
   - Broadcast Banner: "Navaratri Darshan hours extended by 1 hour (till 9:30 PM) from 12 Oct to 22 Oct."
   - Quick toggle: [Publish to Devotee App 📢]
7. Bottom Nav / Admin Footer:
   - Admin navigation tabs: Overview, Calendar Blocks, Seva Catalog, Booking Inbox.
