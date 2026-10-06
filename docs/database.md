# Data Models & Storage Architecture: Sri Durga Devi Temple

## 1. Local & Remote Data Models

The system operates on clean, normalized data structures designed to work seamlessly both within the client-side offline storage (`localStorage` / `IndexedDB`) and an optional backend API layer (`server/`).

### 1.1 Seva Catalog Model (`sevas`)
```json
{
  "id": "durga-homa",
  "name": "Durga Homa",
  "kannadaName": "ದುರ್ಗಾ ಹೋಮ",
  "category": "homa",
  "kanike": 1501,
  "durationMinutes": 150,
  "sanctumLocation": "Sri Durga Parameshwari Yagashala",
  "allowedDays": [5], // 5 = Friday
  "timeSlots": ["10:00 AM – 12:30 PM"],
  "description": "Sacred fire oblation dedicated to Goddess Durga Parameshwari for overcoming planetary doshas, family harmony, and health.",
  "templeProvides": [
    "Complete Homa Samagri & sacred herbs",
    "Dried cow dung & sacred mango wood",
    "Ghee and havis offerings",
    "Senior Purohit & Veda chanting archakas",
    "Kalasha theertha & Kumkuma prasadam"
  ],
  "devoteeBrings": [
    "5 Fresh dry coconuts",
    "2 Flower garlands (Sevanti or Rose)",
    "5 Varieties of fresh seasonal fruits",
    "Betel leaves & supari (1 bundle)",
    "Modest pure cotton traditional attire"
  ],
  "isActive": true,
  "maxDailyCapacity": 3
}
```

### 1.2 Administrative Blocked Date Model (`blocked_dates`)
```json
{
  "id": "block-20261015",
  "date": "2026-10-15",
  "reasonType": "FESTIVAL_UTSAVAM",
  "reasonTitle": "Navaratri Chandi Homa",
  "publicNotice": "Sanctum reserved for community Chandi Parayana. Individual family homas paused.",
  "suggestedAlternatives": ["2026-10-16", "2026-10-18", "2026-10-23"],
  "createdBy": "Sri S. Ramesh (Chief Trustee)",
  "createdAt": "2026-10-01T10:00:00Z"
}
```

### 1.3 Devotee Booking Request Model (`bookings`)
```json
{
  "tokenId": "SDD-2026-1024-042",
  "sevaId": "durga-homa",
  "sevaName": "Durga Homa",
  "date": "2026-10-24",
  "timeSlot": "10:00 AM – 12:30 PM",
  "devoteeName": "Suresh Kumar",
  "mobile": "+919845012345",
  "gothra": "Kashyapa",
  "rashi": "Vrishabha",
  "nakshatra": "Rohini",
  "sankalpa": ["Ayushya & Good Health"],
  "additionalNames": "Radhika Suresh (Mrigashira), Aditya (Krittika)",
  "contribution": 1501,
  "paymentStatus": "COUNTER_PAYABLE",
  "bookingStatus": "NEEDS_ARCHAKA",
  "assignedArchaka": null,
  "createdAt": "2026-10-06T12:00:00Z"
}
```

### 1.4 Daily Panchanga & Astronomical Model (`panchanga_days`)
```json
{
  "date": "2026-10-06",
  "samvatsara": "Shubhakruth",
  "ayana": "Dakshinayana",
  "ritu": "Sharad",
  "tithi": {
    "name": "Shukla Ashtami",
    "endTime": "11:42 PM"
  },
  "nakshatra": {
    "name": "Rohini",
    "endTime": "04:15 PM"
  },
  "yoga": "Sukarma",
  "karana": "Bava (upto 12:30 PM, then Balava)",
  "rashi": "Vrishabha (Moon in Taurus)",
  "rahuKala": "10:30 AM – 12:00 PM",
  "yamaganda": "03:00 PM – 04:30 PM",
  "gulikaKala": "07:30 AM – 09:00 AM",
  "abhijitMuhurtha": "11:45 AM – 12:35 PM",
  "brahmaMuhurtha": "04:36 AM – 05:24 AM",
  "sunrise": "06:12 AM",
  "sunset": "06:18 PM",
  "daylightDuration": "12 hrs 06 mins"
}
```

### 1.5 Public Notice Broadcast Model (`announcements`)
```json
{
  "id": "ann-navaratri-2026",
  "title": "Extended Navaratri Darshan Hours",
  "message": "Navaratri Darshan hours extended by 1 hour (open till 9:30 PM) from 12 Oct to 22 Oct.",
  "isPublished": true,
  "priority": "HIGH",
  "validUntil": "2026-10-23"
}
```

---

## 2. Client-Side Offline Storage Scheme

| Storage Key | Type | Description |
|---|---|---|
| `sdd_sevas_catalog` | `Array<Seva>` | Local cached list of 21 temple sevas |
| `sdd_admin_blocks` | `Array<BlockedDate>` | Active administrative blocks and reasons |
| `sdd_devotee_bookings` | `Array<Booking>` | Devotee's recent generated booking tokens |
| `sdd_admin_announcements` | `Array<Announcement>` | Active broadcast alerts |
| `sdd_user_preferences` | `Object` | Language toggle (`en` / `kn`), installed PWA flag |
