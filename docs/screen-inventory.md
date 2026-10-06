# Screen Inventory & Component Hierarchy Matrix

This document provides the exhaustive mapping of the **79 Devotee Touchpoints** specified in the product requirements, grouped into our **7 Core Master Reusable Screen Templates**.

---

## The 7 Core Master Templates

1. **T1: Devotee Dashboard Template (`home.html` / `HomeScreen`)**  
   Header, temple identity, daily blessings, live Panchanga strip, temple timings card, horizontal carousel of popular poojas/homas, upcoming events teaser, ask temple WhatsApp banner, persistent bottom navigation.

2. **T2: Seva Catalog & Search Template (`poojas.html` / `CatalogScreen`)**  
   Filter chips (All, Daily Sevas, Homas, Special Abhishekas, Alankaras), smart instant search bar, high-contrast cards answering duration, contribution, availability, and direct action.

3. **T3: Seva Detail & Checklist Template (`pooja-detail.html` / `DetailScreen`)**  
   Devotional banner header, quick facts row (Duration, Contribution, Days, Eligibility), About section with progressive disclosure ("Read more"), split checklist (`Temple Provides` vs `Devotee Should Bring`), FAQs, sticky bottom CTA bar ("Check Available Dates" + "Ask on WhatsApp").

4. **T4: Smart Spiritual Calendar & Availability Template (`calendar.html` / `CalendarScreen`)**  
   Interactive monthly calendar grid, visual day indicators (🟢 Available, 🔴 Blocked/Festival, 🟡 Limited Slots), date detail summary card, smart alternative date recommendations, quick filters (Fridays, Tuesdays, Amavasya, Hunnime).

5. **T5: Daily Panchanga & Timings Utility Template (`panchanga.html` / `PanchangaScreen`)**  
   Daily date switcher (Previous / Today / Tomorrow), sacred astrology card (Tithi, Nakshatra, Yoga, Karana), important timings matrix (Rahu Kala, Yamaganda, Gulika Kala), astronomical solar card (Sunrise / Sunset / Abhijit Muhurtha), complete temple daily schedule.

6. **T6: Devotee Booking & Request Stepper Template (`booking.html` / `BookingScreen`)**  
   Progressive 4-step wizard:
   - Step 1: Seva & Date confirmation
   - Step 2: Time slot selection (Morning / Special Seva / Evening)
   - Step 3: Devotee particulars (Primary Name, Phone, Gothra, Nakshatra, Sankalpa intention, Additional family members)
   - Step 4: Review, Submit, Instant Confirmation Card with WhatsApp sharing link.

7. **T7: Physical QR On-Ramp & Temple Info Template (`qr-landing.html` / `qrScreen` & `about.html`)**  
   Zero-friction lightweight on-ramp customized by URL parameter (`?source=entrance`, `?source=pooja-counter`, `?source=reception`, `?source=donation-counter`), temple directions, map, etiquette, contact directory.

---

## Complete 79-Screen Inventory Mapping

| # | Screen Description | Screen Category | Reusable Master Template | Component / State Implementation |
|---|-------------------|-----------------|--------------------------|----------------------------------|
| 1 | Splash Screen | A. Onboarding | T1 Shell | Logo, Brass Diya Glow, Sanskrit Sloka, CSS fade-out |
| 2 | Welcome Screen | A. Onboarding | T1 Shell | "Namaskara 🙏", Temple Welcome, Core Action Cards |
| 3 | Install PWA Prompt | A. Onboarding | Reusable Banner / Modal | `InstallPromptBanner` (custom lightweight standalone prompt) |
| 4 | Notification Permission | A. Onboarding | Reusable Modal | `PermissionNotice` explaining Panchanga & festival alerts |
| 5 | Home / Devotee Dashboard | B. Home | T1: Dashboard | `DevoteeDashboard` container with modular card widgets |
| 6 | Today's Panchanga Card | B. Home | T1: Dashboard | `PanchangaStripWidget` with 1-tap deep dive |
| 7 | Today's Temple Schedule | B. Home | T1: Dashboard | `ScheduleCardWidget` showing open hours & next aarti |
| 8 | Upcoming Events Banner | B. Home | T1: Dashboard | `EventTeaserCard` with festival dates |
| 9 | Popular Poojas Carousel | B. Home | T1: Dashboard | `SevaCarousel` (Kumkum Archana, Durga Sahasranama) |
| 10 | Popular Homas Carousel | B. Home | T1: Dashboard | `SevaCarousel` (Durga Homa, Navagraha Homa) |
| 11 | WhatsApp Help Widget | B. Home | Reusable Global | `StickyWhatsAppAssistant` |
| 12 | Pooja Listing | C. Poojas | T2: Catalog | `SevaListingGrid` with tab filters |
| 13 | Pooja Search | C. Poojas | T2: Catalog | `LiveSearchBar` with query matching |
| 14 | Pooja Categories | C. Poojas | T2: Catalog | `CategoryFilterChips` |
| 15 | Pooja Detail Screen | C. Poojas | T3: Detail | `SevaDetailView` |
| 16 | Pooja Requirements | C. Poojas | T3: Detail | `RequirementsSection` |
| 17 | What Temple Provides | C. Poojas | T3: Detail | `TempleProvidesList` (Green checkmarks) |
| 18 | What Devotee Should Bring | C. Poojas | T3: Detail | `DevoteeBringsCard` (Warm highlighted container) |
| 19 | Pooja Availability Badge | C. Poojas | T3: Detail | `AvailabilityStatusPill` |
| 20 | Pooja Date Selection | C. Poojas | T4: Calendar | `EmbeddedDatePickerModal` |
| 21 | Homa Listing | D. Homas | T2: Catalog | `SevaListingGrid` filtered for homas |
| 22 | Homa Detail | D. Homas | T3: Detail | `SevaDetailView` for homas (Durga Homa, etc.) |
| 23 | Homa Requirements | D. Homas | T3: Detail | Split checklist configured for homa samagri |
| 24 | Homa Availability | D. Homas | T4: Calendar | Date selector with Homa-specific day constraints |
| 25 | Homa Date Selection | D. Homas | T4: Calendar | Slot selector for morning Homa hours |
| 26 | Temple Calendar | E. Calendar | T4: Calendar | Full-page interactive month calendar |
| 27 | Date Detail Card | E. Calendar | T4: Calendar | Day view showing active rituals and slots |
| 28 | Available Date State | E. Calendar | T4: Calendar | Green state with "Book Seva" action |
| 29 | Blocked Date State | E. Calendar | T4: Calendar | Red state with reason notice |
| 30 | Temple Event Date State | E. Calendar | T4: Calendar | Gold festival badge & public darshan advisory |
| 31 | Suggested Alternative Dates | E. Calendar | T4: Calendar | Pill button row offering next 3 auspicious dates |
| 32 | Today's Panchanga | F. Panchanga | T5: Panchanga | Full day astrology dashboard |
| 33 | Panchanga Detail | F. Panchanga | T5: Panchanga | Detailed breakdown of Nakshatra & Pada |
| 34 | Important Timings | F. Panchanga | T5: Panchanga | Rahu Kala, Yamaganda, Gulika Kala card |
| 35 | Sunrise / Sunset | F. Panchanga | T5: Panchanga | Solar dawn/dusk card with daylight gauge |
| 36 | Previous / Next Date Panchanga | F. Panchanga | T5: Panchanga | Day stepper controller |
| 37 | Events Listing | G. Events | T2: Catalog | Temple Brahmotsava & Navaratri event cards |
| 38 | Event Detail | G. Events | T3: Detail | Festival schedule, special darshan & prasada timings |
| 39 | Event Calendar | G. Events | T4: Calendar | Calendar with event highlights |
| 40 | Select Pooja/Homa | H. Booking | T6: Stepper | Step 1: Pre-selected or chosen seva card |
| 41 | Select Date | H. Booking | T6: Stepper | Step 2: Integrated calendar date picker |
| 42 | Select Time Slot | H. Booking | T6: Stepper | Step 2: Morning / Afternoon / Evening slots |
| 43 | Devotee Details Form | H. Booking | T6: Stepper | Step 3: Name, Mobile, Gothra, Nakshatra |
| 44 | Participant Details Form | H. Booking | T6: Stepper | Step 3: Additional family member sankalpa |
| 45 | Review Request | H. Booking | T6: Stepper | Step 4: Summary card with seva contributions |
| 46 | Request Submitted | H. Booking | T6: Stepper | Step 4: Success confirmation card with ref # |
| 47 | Request Status | H. Booking | T6: Stepper | Live tracking card (Pending / Confirmed / Completed) |
| 48 | Ask the Temple | I. WhatsApp | Reusable Sheet | WhatsApp trigger bottom sheet |
| 49 | WhatsApp Pooja Enquiry | I. WhatsApp | Reusable Modal | Contextual pre-filled query for specific pooja |
| 50 | WhatsApp Date Enquiry | I. WhatsApp | Reusable Modal | Contextual query for blocked or specific date |
| 51 | WhatsApp Booking Enquiry | I. WhatsApp | Reusable Modal | Sends booking reference for swift priest follow-up |
| 52 | Suggested WhatsApp Questions | I. WhatsApp | Reusable Sheet | Quick chips ("What are pooja timings?", etc.) |
| 53 | QR Landing Page | J. QR Exp | T7: QR Landing | Dynamic welcome based on `?source=` |
| 54 | QR Pooja Info (Counter) | J. QR Exp | T7: QR Landing | `source=pooja-counter` optimized catalog |
| 55 | QR Reception Info | J. QR Exp | T7: QR Landing | `source=reception` priest consultation guide |
| 56 | QR Entrance Info | J. QR Exp | T7: QR Landing | `source=entrance` day schedule & prasada timings |
| 57 | QR Donation Counter Info | J. QR Exp | T7: QR Landing | `source=donation-counter` Annadana Seva details |
| 58 | About Temple | K. Temple | T7: QR / Info | Temple history, deity lore, sanctum details |
| 59 | Temple Timings | K. Temple | T7: QR / Info | Complete breakdown across all weekdays |
| 60 | Temple Location & Map | K. Temple | T7: QR / Info | Chandra Layout Bangalore map & landmarks |
| 61 | Directions | K. Temple | T7: QR / Info | Metro (Attiguppe / Deepanjali Nagar) & bus info |
| 62 | Contact Directory | K. Temple | T7: QR / Info | Phone 080-23394447, WhatsApp, Instagram |
| 63 | FAQs | K. Temple | T7: QR / Info | Accordion of 10+ commonly asked devotee questions |
| 64 | What to Know Before Visiting | K. Temple | T7: QR / Info | Dress code, photography rules, vehicle pooja rules |
| 65 | My Requests | L. User | Reusable Sheet | LocalStorage-backed history of submitted requests |
| 66 | Request Detail | L. User | Reusable Sheet | Detailed view of previous request |
| 67 | Notification Centre | L. User | Reusable Sheet | Temple notices & festival broadcast alerts |
| 68 | Settings | L. User | Reusable Sheet | App preferences, clear cache, font size toggle |
| 69 | Language Selection | L. User | Reusable Sheet | English / Kannada / Hindi switcher |
| 70 | Install App / PWA Guide | L. User | Reusable Sheet | Step-by-step instructions for iOS & Android |
| 71 | Loading State | M. System | Reusable Component | Shimmer skeleton loader matching layout |
| 72 | Empty State | M. System | Reusable Component | Devotional illustrated empty state ("No poojas found") |
| 73 | Error State | M. System | Reusable Component | Respectful retry banner with contact phone |
| 74 | Offline State | M. System | Reusable Component | Persistent amber offline banner with cached data |
| 75 | No Availability State | M. System | Reusable Component | Blocked state with 3 smart alternative date pills |
| 76 | Request Failed State | M. System | Reusable Component | Graceful failure notice with WhatsApp fallback |
| 77 | Request Success State | M. System | Reusable Component | Sacred green success badge with booking token |
| 78 | WhatsApp Unavailable | M. System | Reusable Component | Fallback direct dial button (`080-23394447`) |
| 79 | Network Reconnected | M. System | Reusable Component | Green toast: "Back Online — Latest Timings Refreshed" |
