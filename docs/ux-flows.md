# Sri Durga Devi Temple — Devotee UX Journeys & Screen Flows

## Journey 1: Devotee Pooja & Homa Booking
**Goal:** Devotee discovers a seva, checks what is required, verifies date availability, and submits a booking request.

```mermaid
sequenceDiagram
    autonumber
    actor Devotee
    participant App as Mobile PWA
    participant Engine as Availability Engine
    participant WhatsApp as Temple WhatsApp
    participant Admin as Temple Admin

    Devotee->>App: Opens App / Home Dashboard
    App-->>Devotee: Shows "Namaskara 🙏", Today's Panchanga & Popular Sevas
    Devotee->>App: Taps "Durga Homa"
    App-->>Devotee: Displays Pooja Detail (Duration, ₹XXXX, Split Checklist)
    Devotee->>App: Reviews "What Devotee Should Bring" & "Temple Provides"
    Devotee->>App: Taps "Check Available Dates"
    App->>Engine: Check dates for Durga Homa
    Engine-->>App: Returns available & blocked dates
    Devotee->>App: Selects Preferred Date & Time Slot
    Devotee->>App: Enters Name, Gothra, Nakshatra, Phone Number
    Devotee->>App: Reviews Booking Summary & Taps "Submit Request"
    App->>Admin: Persists booking request with status "PENDING"
    App-->>Devotee: Displays Success Screen with Booking Token
    Devotee->>WhatsApp: Taps "Send Details via WhatsApp" (pre-filled message)
    WhatsApp-->>Devotee: Instant connection with Temple Desk
```

---

## Journey 2: Daily Panchanga & Temple Timings Check
**Goal:** Devotee checks whether today is auspicious, finds Rahu Kala, and confirms temple darshan hours.

```mermaid
sequenceDiagram
    autonumber
    actor Devotee
    participant App as Mobile PWA

    Devotee->>App: Opens App -> Taps "Panchanga" tab
    App-->>Devotee: Shows Today's Panchanga Card (Tithi, Nakshatra, Yoga, Karana)
    App-->>Devotee: Highlights Today's Inauspicious Periods (Rahu Kala, Yamaganda, Gulika)
    App-->>Devotee: Shows Sunrise / Sunset & Bangalore coordinates
    App-->>Devotee: Shows Today's Temple Schedule (Morning Darshan, Afternoon Deepotsava, Evening Aarti)
    Devotee->>App: Swipes or taps "Tomorrow" to plan next day's visit
```

---

## Journey 3: On-Premises QR Scan at Temple Physical Grounds
**Goal:** Physical temple visitor scans a QR standee at the pooja counter or entrance to avoid waiting in long enquiry lines.

```mermaid
sequenceDiagram
    autonumber
    actor Visitor
    participant QR as Physical Standee
    participant App as Mobile PWA
    participant WhatsApp as Temple Desk

    Visitor->>QR: Scans QR code (?source=pooja-counter)
    QR->>App: Launches instant mobile web app directly to QR Landing
    App-->>Visitor: Displays contextual welcome: "Explore Poojas & Sevas"
    Visitor->>App: Browses Seva list with real contributions & items required
    Visitor->>WhatsApp: Taps "Ask Counter on WhatsApp" for urgent seva booking
```

---

## Journey 4: Date Conflict & Smart Alternative Recommendation
**Goal:** Devotee picks a date that is blocked by a temple festival; system intelligently guides them to next available auspicious dates.

```mermaid
sequenceDiagram
    autonumber
    actor Devotee
    participant App as Mobile PWA
    participant Engine as Availability Engine

    Devotee->>App: Selects 15 October for Durga Homa
    App->>Engine: Validate date 2026-10-15
    Engine-->>App: Status: BLOCKED ("Navaratri Brahmotsava Temple Event")
    App-->>Devotee: Displays Red Banner: "🔴 15 October Unavailable - Temple Event"
    App-->>Devotee: Suggests Smart Alternatives: [17 October (Shukravara)] [20 October (Tuesday)] [23 October]
    Devotee->>App: Taps "17 October" pill button
    App-->>Devotee: Updates selection, confirms 🟢 Available, and unlocks "Continue Booking"
```

---

## Journey 5: Temple Staff Administrative Control
**Goal:** Temple priest or manager logs into Admin Panel to block a date due to an unannounced temple ritual.

```mermaid
sequenceDiagram
    autonumber
    actor AdminUser as Temple Manager
    participant Admin as Admin Panel
    participant DB as System Database
    participant App as Devotee PWA

    AdminUser->>Admin: Accesses /admin -> Authenticates
    Admin-->>AdminUser: Displays Admin Dashboard & Operational Metrics
    AdminUser->>Admin: Navigates to "Calendar & Availability"
    AdminUser->>Admin: Selects Date (e.g., 2026-10-25) -> Clicks "Block Date"
    AdminUser->>Admin: Enters Reason: "Special Temple Maha Abhisheka"
    AdminUser->>Admin: Clicks "Save & Publish"
    Admin->>DB: Updates blocked_dates table
    Devotee->>App: Checks 2026-10-25
    App-->>Devotee: Instantly displays date as BLOCKED with reason note
```
