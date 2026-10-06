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
