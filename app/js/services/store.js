/**
 * Client Reactive State & LocalStorage Store
 * Manages administrative overrides, seva rates, booking tokens, and announcements.
 */

import { SEVAS_DATA } from '../data/sevas.js';

const STORAGE_KEYS = {
  BLOCKED_DATES: 'sdd_blocked_dates_v1',
  SEVAS: 'sdd_sevas_catalog_v1',
  BOOKINGS: 'sdd_devotee_bookings_v1',
  ANNOUNCEMENTS: 'sdd_announcements_v1',
  EVENTS: 'sdd_events_cms_v1',
  PREFERENCES: 'sdd_preferences_v1'
};

// Initial Seed Data
const DEFAULT_BLOCKED_DATES = [
  {
    id: "block-20261015",
    date: "2026-10-15",
    reasonType: "FESTIVAL_UTSAVAM",
    reasonTitle: "Navaratri Chandi Homa",
    publicNotice: "Sanctum fully reserved for community Chandi Parayana. Individual family homas paused.",
    suggestedAlternatives: ["2026-10-16", "2026-10-18", "2026-10-23"],
    createdBy: "Sri S. Ramesh (Chief Trustee)",
    createdAt: "2026-10-01T10:00:00Z"
  }
];

const DEFAULT_ANNOUNCEMENT = {
  id: "ann-navaratri-2026",
  title: "Extended Navaratri Darshan Hours",
  message: "Navaratri Darshan hours extended by 1 hour (open till 9:30 PM) from 12 Oct to 22 Oct.",
  isPublished: true,
  priority: "HIGH"
};

export const DEFAULT_EVENTS = [
  {
    id: "navaratri-utsava-2026",
    title: "Sri Sharannavaratri Mahotsava 2026",
    kannadaTitle: "ಶ್ರೀ ಶರನ್ನವರಾತ್ರಿ ಮಹೋತ್ಸವ - ೨೦೨೬",
    shloka: "ಯಾ ದೇವೀ ಸರ್ವಭೂತೇಷು ಛಾಯಾರೂಪೇಣ ಸಂಸ್ಥಿತಾ । ನಮಸ್ತಸ್ಯೈ ನಮಸ್ತಸ್ಯೈ ನಮಸ್ತಸ್ಯೈ ನಮೋ ನಮಃ ॥",
    vedicContext: "ಸ್ವಸ್ತಿಶ್ರೀ ಪರಾಭವ ನಾಮ ಸಂವತ್ಸರದ ದಕ್ಷಿಣಾಯನ ಆಶ್ವಯುಜ ಮಾಸ ಶುಕ್ಲಪಕ್ಷ ಶರದ್ವೃತು",
    startDate: "2026-10-11",
    endDate: "2026-10-20",
    isPublished: true,
    isFeatured: true,
    primaryImage: "assets/images/navaratri-invitation.jpg",
    scheduleImage: "assets/images/navaratri-schedule.jpg",
    highlights: "10 Days of Grand Alankaras, Daily Sacred Homas, Bannichheda, Prakarotsava, and Grand Rathotsava on Main Road.",
    grandFinale: "ದಿನಾಂಕ : 20-10-2026 ಮಂಗಳವಾರ ವಿಜಯದಶಮಿಯಂದು ಸಂಜೆಯ ಹೊತ್ತಿನಲ್ಲಿ 'ಬನ್ನಿಚ್ಛೇದ', 'ಪ್ರಾಕಾರೋತ್ಸವ', ತದನಂತರ ಬಡಾವಣೆಯ ಮುಖ್ಯರಸ್ತೆಯಲ್ಲಿ 'ರಥೋತ್ಸವ'ವನ್ನು ಹಮ್ಮಿಕೊಳ್ಳಲಾಗಿದೆ.",
    leadership: {
      archaka: "ಶ್ರೀಯುತ ಕೆ. ರಾಘವೇಂದ್ರ ಒಕುಡ (ಪ್ರಧಾನ ಅರ್ಚಕರು)",
      president: "ಕೆ. ಉಮೇಶ್ ಶೆಟ್ಟಿ ಮತ್ತು ಪದಾಧಿಕಾರಿಗಳು",
      trust: "ಶ್ರೀ ದುರ್ಗಾ ಪರಮೇಶ್ವರಿ ಅಮ್ಮನವರ ದೇವಸ್ಥಾನ ಟ್ರಸ್ಟ್(ರಿ)"
    },
    dailySchedule: [
      {
        dayNumber: 1,
        date: "2026-10-11",
        vara: "ಭಾನುವಾರ",
        tithi: "ಶುಕ್ಲ ಪಾಡ್ಯ",
        alankara: "ಶೈಲಪುತ್ರಿ ಅಲಂಕಾರ",
        homa: "ರಣಹೋಮ ಮತ್ತು ಪವಮಾನ ಹೋಮ",
        purpose: "ಸಕಲಕಾರ್ಯ ಸಿದ್ಧಿ ಹಾಗೂ ನಾರಾಯಣನ ಅನುಗ್ರಹಕ್ಕಾಗಿ"
      },
      {
        dayNumber: 2,
        date: "2026-10-12",
        vara: "ಸೋಮವಾರ",
        tithi: "ಶುಕ್ಲ ಬಿದಿಗೆ",
        alankara: "ಬ್ರಹ್ಮಚಾರಿಣಿ ಅಲಂಕಾರ",
        homa: "ಪುರುಷಸೂಕ್ತ ನವಗ್ರಹ ಸಹಿತ ಹೋಮ",
        purpose: "ನವಗ್ರಹಗಳ ಅನುಗ್ರಹ + ಸಾಂಸಾರಿಕ ತೊಂದರೆಗಳ ನಿವಾರಣೆಗಾಗಿ"
      },
      {
        dayNumber: 3,
        date: "2026-10-13",
        vara: "ಮಂಗಳವಾರ",
        tithi: "ಶುಕ್ಲ ತದಿಗೆ",
        alankara: "ಚಂದ್ರಘಂಟಾ ಅಲಂಕಾರ",
        homa: "ಭಾಗ್ಯಸೂಕ್ತ ಹೋಮ",
        purpose: "ದೀರ್ಘ ಸೌಮಾಂಗಲ್ಯ ಪ್ರಾಪ್ತಿಗಾಗಿ"
      },
      {
        dayNumber: 4,
        date: "2026-10-14",
        vara: "ಬುಧವಾರ",
        tithi: "ಶುಕ್ಲ ಚೌತಿ",
        alankara: "ಕೂಷ್ಮಾಂಡಿನಿ ಅಲಂಕಾರ",
        homa: "ರಣಹೋಮ ಮತ್ತು ಐಕಮತ್ಯ ಹೋಮ",
        purpose: "ಸಾಮಾಜಿಕ / ಧಾರ್ಮಿಕ / ವ್ಯವಹಾರಿಕ ಒಗ್ಗಟ್ಟಿಗಾಗಿ"
      },
      {
        dayNumber: 5,
        date: "2026-10-15",
        vara: "ಗುರುವಾರ",
        tithi: "ಶುಕ್ಲ ಪಂಚಮಿ",
        alankara: "ಸ್ಕಂದಮಾತಾ ಅಲಂಕಾರ",
        homa: "ಸರ್ಪಸೂಕ್ತ ಹೋಮ",
        purpose: "ಸರ್ಪದೋಷ ನಿವಾರಣೆಗಾಗಿ"
      },
      {
        dayNumber: 6,
        date: "2026-10-16",
        vara: "ಶುಕ್ರವಾರ",
        tithi: "ಶುಕ್ಲ ಷಷ್ಠಿ",
        alankara: "ಮಹಾಲಕ್ಷ್ಮಿ ಅಲಂಕಾರ",
        homa: "ಶ್ರೀ ಸೂಕ್ತ ಹೋಮ",
        purpose: "ಉತ್ತಮ ದಾಂಪತ್ಯ ಜೀವನಕ್ಕಾಗಿ"
      },
      {
        dayNumber: 7,
        date: "2026-10-17",
        vara: "ಶನಿವಾರ",
        tithi: "ಶುಕ್ಲ ಸಪ್ತಮಿ",
        alankara: "ಸರಸ್ವತಿ ಅಲಂಕಾರ",
        homa: "ಸರಸ್ವತಿ ಹೋಮ",
        purpose: "ಜ್ಞಾನಶಕ್ತಿ / ವಿದ್ಯೆಗಾಗಿ"
      },
      {
        dayNumber: 8,
        date: "2026-10-18",
        vara: "ಭಾನುವಾರ",
        tithi: "ಶುಕ್ಲ ಸಪ್ತಮಿ/ಅಷ್ಟಮಿ",
        alankara: "ವನದುರ್ಗಾ ಅಲಂಕಾರ",
        homa: "ಸ್ವಯಂವರಪಾರ್ವತಿ ಹೋಮ",
        purpose: "ವಿವಾಹಕ್ಕಾಗಿ"
      },
      {
        dayNumber: 9,
        date: "2026-10-19",
        vara: "ಸೋಮವಾರ",
        tithi: "ಶುಕ್ಲ ಅಷ್ಟಮಿ",
        alankara: "ಮಹಿಷಮರ್ದಿನಿ ಅಲಂಕಾರ",
        homa: "ದುರ್ಗಾ ಹೋಮ",
        purpose: "ಸಕಲ ದುರಿತ ಪರಿಹಾರಕ್ಕಾಗಿ"
      },
      {
        dayNumber: 10,
        date: "2026-10-20",
        vara: "ಮಂಗಳವಾರ",
        tithi: "ಶುಕ್ಲ ನವಮಿ / ವಿಜಯದಶಮಿ",
        alankara: "ರಜತ ಕವಚ ಅಲಂಕಾರ",
        homa: "ಚಂಡಿಕಾ ಹೋಮ",
        purpose: "ಸಕಲ ದುರಿತನಿವಾರಣೆ / ಸಂಪತ್ತು / ಐಶ್ವರ್ಯ ಪ್ರಾಪ್ತಿಗಾಗಿ"
      }
    ],
    specialSevas: [
      { name: "ವಿಜಯ ದಶಮಿಯಂದು ಚಂಡಿಕಾಯಾಗ ಸೇವೆ", price: 50000, description: "Grand Vijayadashami Chandika Yaga" },
      { name: "ನವರಾತ್ರಿಯ ಒಂದು ದಿನದ ಸರ್ವ ಸೇವೆ", price: 30000, description: "Full Day All-Rituals Sarva Seva" },
      { name: "ನವರಾತ್ರಿಯ ಒಂದು ದಿನದ ಅನ್ನದಾನ ಸೇವೆ", price: 25000, description: "Full Day Mahaprasada Annadana Seva" },
      { name: "ಪುಷ್ಪಾಲಂಕಾರ ಸೇವೆ (ಎಲ್ಲ ದೇವರುಗಳಿಗೆ)", price: 10001, description: "Sanctum Floral Garland Pushpalankara" },
      { name: "ಪ್ರತಿ ನಿತ್ಯ ನಡೆಯುವ ಹೋಮ ಸೇವೆಗಳಿಗೆ ಪ್ರಧಾನ ಸೇವೆ", price: 10001, description: "Principal Yajamana for Daily Homa" },
      { name: "ನವರಾತ್ರಿ ಉತ್ಸವದಲ್ಲಿ ರಥೋತ್ಸವ ಸೇವೆ", price: 5001, description: "Grand Evening Chariot Rathotsava Seva" },
      { name: "ಸಂಜೆ ಪ್ರಸಾದ ಸೇವೆ", price: 5001, description: "Evening Special Prasada Seva" },
      { name: "ಅನ್ನದಾನ ಸೇವೆ (ಶಕ್ತ್ಯಾನುಸಾರ)", price: 2001, description: "Devotee Annadana Seva" },
      { name: "ಪ್ರಸಾದ ಸೇವೆ (ಶಕ್ತ್ಯಾನುಸಾರ)", price: 2001, description: "Sacred Prasada Seva" },
      { name: "ವಿಜಯ ದಶಮಿಯಂದು ಚಂಡಿಕಾಯಾಗ ಸಾಮೂಹಿಕ ಸಂಕಲ್ಪ ಸೇವೆ", price: 1001, description: "Samuhika Sankalpa in Chandika Yaga" },
      { name: "ಶ್ರೀ ದುರ್ಗಾ ಪರಮೇಶ್ವರಿ ಅಮ್ಮನವರಿಗೆ ವಿಶೇಷ ಅಭಿಷೇಕ ಸೇವೆ", price: 501, description: "Special Sanctum Abhisheka" },
      { name: "ಪ್ರತಿ ನಿತ್ಯ ನಡೆಯುವ ಹೋಮ ಸೇವೆಗಳಿಗೆ ಸಾಮೂಹಿಕ ಸಂಕಲ್ಪ ಸೇವೆ", price: 501, description: "Daily Homa Samuhika Sankalpa" },
      { name: "ಎಲ್ಲಾ ದೇವರುಗಳಿಗೆ ಪಂಚಾಮೃತ ಅಭಿಷೇಕ ಸೇವೆ", price: 1001, description: "Panchamrutha Abhisheka for All Deities" }
    ]
  }
];

const DEFAULT_BOOKINGS = [
  {
    tokenId: "SDD-2026-1024-042",
    sevaId: "durga-homa",
    sevaName: "Durga Homa (Special Friday Homa)",
    date: "2026-10-24",
    timeSlot: "10:00 AM – 12:30 PM",
    devoteeName: "Suresh Kumar",
    mobile: "+91 98450 12345",
    gothra: "Kashyapa",
    rashi: "Vrishabha (Taurus)",
    nakshatra: "Rohini",
    sankalpa: ["Ayushya & Good Health"],
    additionalNames: "Radhika Suresh (Mrigashira), Aditya (Krittika)",
    contribution: 1501,
    bookingStatus: "NEEDS_ARCHAKA",
    assignedArchaka: null,
    createdAt: "2026-10-06T11:00:00Z"
  },
  {
    tokenId: "SDD-2026-1007-018",
    sevaId: "rahukala-deepa",
    sevaName: "Rahukala Deepada Seva",
    date: "2026-10-07",
    timeSlot: "03:30 PM – 05:00 PM",
    devoteeName: "Ananya Rao",
    mobile: "+91 94481 55620",
    gothra: "Bharadwaja",
    rashi: "Kanya",
    nakshatra: "Hasta",
    sankalpa: ["Karya Siddhi"],
    additionalNames: "",
    contribution: 101,
    bookingStatus: "CONFIRMED",
    assignedArchaka: "Pandit Narayana Bhat",
    createdAt: "2026-10-06T09:30:00Z"
  }
];

class TempleStore {
  constructor() {
    this._initStore();
  }

  _initStore() {
    if (!localStorage.getItem(STORAGE_KEYS.BLOCKED_DATES)) {
      localStorage.setItem(STORAGE_KEYS.BLOCKED_DATES, JSON.stringify(DEFAULT_BLOCKED_DATES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.SEVAS)) {
      localStorage.setItem(STORAGE_KEYS.SEVAS, JSON.stringify(SEVAS_DATA));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BOOKINGS)) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(DEFAULT_BOOKINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
      localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(DEFAULT_ANNOUNCEMENT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(DEFAULT_EVENTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PREFERENCES)) {
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify({ lang: 'en', pwaInstalled: false }));
    }
  }

  // Blocked Dates
  getBlockedDates() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOCKED_DATES) || '[]');
  }

  addBlockedDate(blockRule) {
    const list = this.getBlockedDates();
    list.push(blockRule);
    localStorage.setItem(STORAGE_KEYS.BLOCKED_DATES, JSON.stringify(list));
    return list;
  }

  removeBlockedDate(idOrDate) {
    let list = this.getBlockedDates();
    list = list.filter(b => b.id !== idOrDate && b.date !== idOrDate);
    localStorage.setItem(STORAGE_KEYS.BLOCKED_DATES, JSON.stringify(list));
    return list;
  }

  // Sevas Catalog
  getSevas() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SEVAS) || JSON.stringify(SEVAS_DATA));
  }

  getAllSevas() {
    return this.getSevas();
  }

  getSevaById(id) {
    return this.getSevas().find(s => s.id === id);
  }

  updateSeva(id, updates) {
    const sevas = this.getSevas().map(s => s.id === id ? { ...s, ...updates } : s);
    localStorage.setItem(STORAGE_KEYS.SEVAS, JSON.stringify(sevas));
    return sevas;
  }

  // Devotee Bookings
  getBookings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKINGS) || '[]');
  }

  addBooking(booking) {
    const bookings = this.getBookings();
    bookings.unshift(booking);
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return booking;
  }

  updateBookingStatus(tokenId, status, assignedArchaka = null) {
    const bookings = this.getBookings().map(b => {
      if (b.tokenId === tokenId) {
        return { ...b, bookingStatus: status, assignedArchaka: assignedArchaka || b.assignedArchaka };
      }
      return b;
    });
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    return bookings;
  }

  // Announcement
  getAnnouncement() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS) || '{}');
  }

  updateAnnouncement(announcement) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcement));
  }

  // Festival & Events CMS
  getEvents() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.EVENTS) || JSON.stringify(DEFAULT_EVENTS));
  }

  getEventById(id) {
    return this.getEvents().find(e => e.id === id);
  }

  saveEvent(eventData) {
    const events = this.getEvents();
    const existingIndex = events.findIndex(e => e.id === eventData.id);
    if (existingIndex >= 0) {
      events[existingIndex] = { ...events[existingIndex], ...eventData, updatedAt: new Date().toISOString() };
    } else {
      if (!eventData.id) {
        eventData.id = 'event-' + Date.now();
      }
      eventData.createdAt = new Date().toISOString();
      events.unshift(eventData);
    }
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return events;
  }

  deleteEvent(id) {
    let events = this.getEvents();
    events = events.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    return events;
  }

  // Preferences
  getPreferences() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PREFERENCES) || '{}');
  }

  setPreference(key, value) {
    const prefs = this.getPreferences();
    prefs[key] = value;
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  }
}

export const templeStore = new TempleStore();
