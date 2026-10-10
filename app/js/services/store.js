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
  PREFERENCES: 'sdd_preferences_v1',
  CONTACT_CONFIG: 'sdd_contact_config_v1',
  PRIESTS: 'sdd_priests_v1',
  GALLERY: 'sdd_gallery_v1',
  NOTIFICATIONS: 'sdd_special_notifications_v1',
  STREAMING_LOCATIONS: 'sdd_streaming_locations_v1',
  LIVE_SESSIONS: 'sdd_live_sessions_v1',
  VIEWER_SESSIONS: 'sdd_viewer_sessions_v1',
  ANALYTICS_EVENTS: 'sdd_analytics_events_v1',
  ANALYTICS_SESSIONS: 'sdd_analytics_sessions_v1',
  PUSH_SUBSCRIPTIONS: 'sdd_push_subscriptions_v1',
  NOTIFICATION_HISTORY: 'sdd_notification_history_v1',
  STREAM_SETTINGS: 'sdd_stream_settings_v1'
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

export const DEFAULT_CONTACT_CONFIG = {
  whatsappPhone: "919845012345",
  whatsappNumber: "919845012345",
  whatsappDisplay: "+91 98450 12345",
  whatsappNumberDisplay: "+91 98450 12345",
  officePhone: "080-23394447",
  alternatePhone: "080-23394447",
  emergencyContact: "+91 94480 54321",
  email: "sridurgadevi.blr@gmail.com",
  address: "Sri Durga Parameshwari Temple, Chandra Layout 1st Phase, Bengaluru - 560 072",
  upiId: "sridurgatemple@sbi",
  trustRegistration: "Registered Hindu Religious & Charitable Institutions Trust",
  whatsappGreeting: "Namaskara Sri Durga Parameshwari Temple Desk 🙏"
};

export const DEFAULT_PRIESTS = [
  {
    id: "priest-1",
    name: "Sri K. Raghavendra Okuda",
    kannadaName: "ಶ್ರೀ ಕೆ. ರಾಘವೇಂದ್ರ ಒಕುಡ",
    role: "Chief Pradhana Archaka",
    kannadaRole: "ಪ್ರಧಾನ ಅರ್ಚಕರು",
    phone: "+91 98450 12345",
    experience: "28 Years of Temple Seva",
    specialization: ["Durga Homa", "Chandi Parayana", "Maha Alankara", "Brahma Kalashotsava"],
    status: "ACTIVE",
    joinedYear: 1998,
    bio: "Hereditary chief priest presiding over all daily abhishekams, Friday Durga Homa, and Sharannavaratri Alankara utsavas."
  },
  {
    id: "priest-2",
    name: "Pandit Narayana Bhat",
    kannadaName: "ಪಂಡಿತ್ ನಾರಾಯಣ ಭಟ್",
    role: "Senior Homa Archaka",
    kannadaRole: "ಹೋಮ ಅರ್ಚಕರು",
    phone: "+91 98451 67890",
    experience: "20 Years in Agamic Rites",
    specialization: ["Durga Homa", "Navagraha Shanti", "Mrityunjaya Homa", "Ganapathi Homa"],
    status: "ACTIVE",
    joinedYear: 2006,
    bio: "Expert in Rigvedic and Shukla Yajurvedic homas, responsible for Yagashala maintenance and individual family homa sankalpas."
  },
  {
    id: "priest-3",
    name: "Sri Venugopal Sharma",
    kannadaName: "ಶ್ರೀ ವೇಣುಗೋಪಾಲ್ ಶರ್ಮಾ",
    role: "Vedamurthy & Alankara Archaka",
    kannadaRole: "ಅಲಂಕಾರ ಅರ್ಚಕರು",
    phone: "+91 98452 34567",
    experience: "15 Years of Veda Adhyayana",
    specialization: ["Swarna Alankara", "Kumkuma Archana", "Tuesday Deepotsava", "Sahasranama Archana"],
    status: "ACTIVE",
    joinedYear: 2011,
    bio: "Master of traditional deity alankara with gold ornaments, silks, and flowers. Conducts Tuesday evening Rahukala deepotsava."
  },
  {
    id: "priest-4",
    name: "Sri Subrahmanya Shastri",
    kannadaName: "ಶ್ರೀ ಸುಬ್ರಹ್ಮಣ್ಯ ಶಾಸ್ತ್ರಿ",
    role: "Sahayaka Archaka & Parayanika",
    kannadaRole: "ಸಹಾಯಕ ಅರ್ಚಕರು",
    phone: "+91 98453 89012",
    experience: "10 Years of Temple Service",
    specialization: ["Devi Mahatmyam Parayana", "Panchamrutha Abhisheka", "Vahana Pooja", "Archana Counter"],
    status: "ACTIVE",
    joinedYear: 2016,
    bio: "Specializes in Devi Mahatmyam recitation, vehicle poojas at North gate, and archana counter services."
  }
];

export const DEFAULT_GALLERY = [
  {
    id: "gal-1",
    title: "Towering Raja Gopuram • Front Prakaara",
    kannadaTitle: "ಭವ್ಯ ರಾಜಗೋಪುರ • ಮುಂಭಾಗದ ಪ್ರಾಕಾರ",
    category: "architecture",
    image: "assets/images/1.jpg",
    date: "2026-09-15",
    caption: "Main entrance of Sri Durga Devi Temple showing the majestic multi-tiered Raja Gopuram.",
    isFeatured: true
  },
  {
    id: "gal-2",
    title: "Grand Deepotsava • Illuminated Prakaara",
    kannadaTitle: "ಭವ್ಯ ದೀಪೋತ್ಸವ • ಜ್ಯೋತಿರ್ಮಯ ಪ್ರಾಕಾರ",
    category: "festival",
    image: "assets/images/2.jpg",
    date: "2026-09-22",
    caption: "Thousands of sacred clay and brass lamps illuminating the temple prakaara during special Deepotsava.",
    isFeatured: true
  },
  {
    id: "gal-3",
    title: "Divine Idol with Sacred Gold & Kumkuma Alankara",
    kannadaTitle: "ಶ್ರೀ ದುರ್ಗಾ ಪರಮೇಶ್ವರಿ ಸ್ವರ್ಣಾಲಂಕಾರ",
    category: "alankara",
    image: "assets/images/3.jpg",
    date: "2026-10-01",
    caption: "Devi in majestic golden crown and red silk saree adorned for Friday special pooja.",
    isFeatured: true
  },
  {
    id: "gal-4",
    title: "Garbha Gudi Sanctum Sanctorum",
    kannadaTitle: "ಪವಿತ್ರ ಗರ್ಭಗುಡಿ ಸನ್ನಿಧಿ",
    category: "sanctum",
    image: "assets/images/4.jpg",
    date: "2026-10-02",
    caption: "Sacred sanctum sanctorum where continuous ghee lamps (Nanda Deepa) remain lit.",
    isFeatured: true
  },
  {
    id: "gal-5",
    title: "Deepastambha Sacred Ghee Lamps",
    kannadaTitle: "ದೀಪಸ್ತಂಭ ಹಾಗೂ ಮಂಗಳಾರತಿ ದೀಪಗಳು",
    category: "festival",
    image: "assets/images/5.jpg",
    date: "2026-10-05",
    caption: "Sacred Deepastambha offering peace and prosperity to visiting devotees.",
    isFeatured: true
  }
];

export const DEFAULT_SPECIAL_NOTIFICATIONS = [
  {
    id: "notif-1",
    title: "Navaratri Extended Darshan Timings",
    kannadaTitle: "ನವರಾತ್ರಿ ವಿಸ್ತೃತ ದರ್ಶನ ಸಮಯ",
    priority: "AUSPICIOUS",
    message: "During Sharannavaratri (11–20 Oct 2026), temple sanctum will remain open till 9:30 PM daily with continuous camphor mangalarathi and prasadam.",
    schedule: "11 Oct – 20 Oct 2026",
    actionLink: "#events",
    actionText: "View Navaratri Schedule 🎪",
    isActive: true,
    createdAt: "2026-10-01T08:00:00Z"
  },
  {
    id: "notif-2",
    title: "Friday Durga Homa Slot Booking Advisory",
    kannadaTitle: "ಶುಕ್ರವಾರ ದುರ್ಗಾ ಹೋಮ ಮುಂಗಡ ಬುಕಿಂಗ್",
    priority: "SEVA",
    message: "Friday Durga Homa is limited to 12 devotee families per session. Please reserve your sankalpa token in advance via WhatsApp desk.",
    schedule: "Every Friday 10:00 AM",
    actionLink: "#calendar",
    actionText: "Check Date Availability 🗓️",
    isActive: true,
    createdAt: "2026-10-03T10:00:00Z"
  },
  {
    id: "notif-3",
    title: "Chandra Grahanam Temple Closure Notice",
    kannadaTitle: "ಚಂದ್ರ ಗ್ರಹಣ ದೇವಸ್ಥಾನ ಮುಚ್ಚುವ ಸಮಯ",
    priority: "URGENT",
    message: "Sanctum gates will close 3 hours prior to lunar eclipse for purification and reopen after Shanti Abhisheka.",
    schedule: "Upcoming Eclipse Schedule",
    actionLink: "#panchanga",
    actionText: "Check Vedic Panchanga 📅",
    isActive: false,
    createdAt: "2026-09-28T12:00:00Z"
  }
];

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

export const DEFAULT_STREAMING_LOCATIONS = [
  {
    id: "loc-garbha-gudi",
    name: "Main Garbha Gudi (Sanctum)",
    kannadaName: "ಮುಖ್ಯ ಗರ್ಭಗುಡಿ (ಶ್ರೀ ದುರ್ಗಾ ಸನ್ನಿಧಿ)",
    description: "Sacred inner sanctum darshan of Goddess Sri Durga Parameshwari, Suprabhata and Maha Mangalarathi.",
    thumbnail: "assets/images/3.jpg",
    displayOrder: 1,
    status: "ACTIVE",
    supportedSources: ["MOBILE", "IP_CAMERA"],
    selectedSource: "MOBILE",
    currentSessionId: null,
    ipCameraConfig: {
      name: "Sanctum High-Def Fixed PTZ",
      streamUrl: "rtsp://camera-sanctum.temple.internal:554/live/stream1",
      protocol: "RTSP",
      status: "CONFIGURED",
      lastTestedAt: null
    }
  },
  {
    id: "loc-yagashala",
    name: "Durga Yagashala & Homa Kunda",
    kannadaName: "ಶ್ರೀ ದುರ್ಗಾ ಯಾಗಶಾಲೆ & ಹೋಮಕುಂಡ",
    description: "Sacred fire oblations, Friday Durga Homa, Chandi Parayana, and Navagraha Homas.",
    thumbnail: "assets/images/5.jpg",
    displayOrder: 2,
    status: "ACTIVE",
    supportedSources: ["MOBILE", "IP_CAMERA"],
    selectedSource: "MOBILE",
    currentSessionId: null,
    ipCameraConfig: {
      name: "Yagashala Wide Lens",
      streamUrl: "rtsp://camera-yagashala.temple.internal:554/live/stream1",
      protocol: "RTSP",
      status: "CONFIGURED",
      lastTestedAt: null
    }
  },
  {
    id: "loc-prakaara",
    name: "Raja Gopuram & North Prakaara",
    kannadaName: "ರಾಜಗೋಪುರ & ಉತ್ತರ ಪ್ರಾಕಾರ",
    description: "Towering Raja Gopuram entrance, pradakshina prakaara, and vehicle blessings.",
    thumbnail: "assets/images/1.jpg",
    displayOrder: 3,
    status: "ACTIVE",
    supportedSources: ["MOBILE", "IP_CAMERA"],
    selectedSource: "MOBILE",
    currentSessionId: null,
    ipCameraConfig: {
      name: "Prakaara Entrance Cam",
      streamUrl: "rtsp://camera-prakaara.temple.internal:554/live/stream1",
      protocol: "RTSP",
      status: "CONFIGURED",
      lastTestedAt: null
    }
  },
  {
    id: "loc-utsava-mantapa",
    name: "Utsava Mantapa & Rathotsava",
    kannadaName: "ಉತ್ಸವ ಮಂಟಪ & ರಥೋತ್ಸವ ಬೀದಿ",
    description: "Chariot procession, Bannichheda, Deepotsava evening lights, and special festival celebrations.",
    thumbnail: "assets/images/2.jpg",
    displayOrder: 4,
    status: "ACTIVE",
    supportedSources: ["MOBILE"],
    selectedSource: "MOBILE",
    currentSessionId: null,
    ipCameraConfig: null
  },
  {
    id: "loc-auditorium",
    name: "Temple Cultural Auditorium",
    kannadaName: "ದೇವಾಲಯದ ಸಾಂಸ್ಕೃತಿಕ ಸಭಾಂಗಣ",
    description: "Devotional concerts, Yakshagana, Harikathe, and Pravachana spiritual discourses.",
    thumbnail: "assets/images/4.jpg",
    displayOrder: 5,
    status: "ACTIVE",
    supportedSources: ["MOBILE", "IP_CAMERA"],
    selectedSource: "MOBILE",
    currentSessionId: null,
    ipCameraConfig: {
      name: "Auditorium Stage Camera",
      streamUrl: "rtsp://camera-auditorium.temple.internal:554/live/stream1",
      protocol: "RTSP",
      status: "CONFIGURED",
      lastTestedAt: null
    }
  }
];

export const DEFAULT_STREAM_SETTINGS = {
  autoNotifyLive: true,
  webrtcGatewayUrl: "",
  hlsFallbackUrl: "",
  lowLatencyMode: true,
  maxConcurrentViewersEstimate: 5000,
  heartbeatIntervalSeconds: 15,
  viewerSessionTimeoutSeconds: 45
};

export const DEFAULT_LIVE_SESSIONS = [
  {
    id: "sess-archived-1",
    locationId: "loc-garbha-gudi",
    locationName: "Main Garbha Gudi (Sanctum)",
    sourceType: "MOBILE",
    title: "Friday Special Maha Mangalarathi & Kumkumarchana",
    description: "Sacred darshan of Sri Durga Parameshwari Ammanavaru with golden crown alankara.",
    status: "ENDED",
    startedBy: "Sri S. Ramesh (Chief Trustee)",
    startedAt: "2026-10-09T09:30:00.000Z",
    endedAt: "2026-10-09T10:45:00.000Z",
    durationSeconds: 4500,
    playbackUrl: "",
    currentViewers: 0,
    peakViewers: 428,
    totalSessions: 1820,
    totalWatchTimeSeconds: 412500,
    errors: []
  }
];

export const DEFAULT_PUSH_SUBSCRIPTIONS = [
  {
    endpoint: "https://fcm.googleapis.com/fcm/send/demo-sub-1",
    keys: { p256dh: "BMc_demo_key_1", auth: "auth_demo_1" },
    platform: "PWA",
    preferences: { liveDarshan: true, events: true, announcements: true },
    createdAt: "2026-10-01T12:00:00.000Z",
    lastActiveAt: "2026-10-10T08:00:00.000Z"
  },
  {
    endpoint: "https://fcm.googleapis.com/fcm/send/demo-sub-2",
    keys: { p256dh: "BMc_demo_key_2", auth: "auth_demo_2" },
    platform: "BROWSER",
    preferences: { liveDarshan: true, events: false, announcements: true },
    createdAt: "2026-10-05T14:30:00.000Z",
    lastActiveAt: "2026-10-09T18:00:00.000Z"
  }
];

export const DEFAULT_NOTIFICATION_HISTORY = [
  {
    id: "notif-hist-1",
    title: "Live Darshan is Now Live",
    kannadaTitle: "ನೇರ ದರ್ಶನ ಪ್ರಾರಂಭವಾಗಿದೆ",
    body: "Sri Durga Devi Temple is live now. Join the Darshan from Main Garbha Gudi.",
    targetUrl: "#live?loc=loc-garbha-gudi",
    type: "LIVE_DARSHAN",
    triggeredBy: "SYSTEM_BROADCAST",
    sentCount: 142,
    deliveredCount: 139,
    openedCount: 88,
    timestamp: "2026-10-09T09:30:05.000Z"
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
    if (!localStorage.getItem(STORAGE_KEYS.STREAMING_LOCATIONS)) {
      localStorage.setItem(STORAGE_KEYS.STREAMING_LOCATIONS, JSON.stringify(DEFAULT_STREAMING_LOCATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.LIVE_SESSIONS)) {
      localStorage.setItem(STORAGE_KEYS.LIVE_SESSIONS, JSON.stringify(DEFAULT_LIVE_SESSIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.STREAM_SETTINGS)) {
      localStorage.setItem(STORAGE_KEYS.STREAM_SETTINGS, JSON.stringify(DEFAULT_STREAM_SETTINGS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.PUSH_SUBSCRIPTIONS)) {
      localStorage.setItem(STORAGE_KEYS.PUSH_SUBSCRIPTIONS, JSON.stringify(DEFAULT_PUSH_SUBSCRIPTIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATION_HISTORY)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATION_HISTORY, JSON.stringify(DEFAULT_NOTIFICATION_HISTORY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.VIEWER_SESSIONS)) {
      localStorage.setItem(STORAGE_KEYS.VIEWER_SESSIONS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS_EVENTS)) {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS_EVENTS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ANALYTICS_SESSIONS)) {
      localStorage.setItem(STORAGE_KEYS.ANALYTICS_SESSIONS, JSON.stringify([]));
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

  // ==================== TEMPLE CONTACT & WHATSAPP CONFIG ====================
  getContactConfig() {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEYS.CONTACT_CONFIG) || JSON.stringify(DEFAULT_CONTACT_CONFIG));
    const phone = raw.whatsappPhone || raw.whatsappNumber || DEFAULT_CONTACT_CONFIG.whatsappPhone;
    const display = raw.whatsappDisplay || raw.whatsappNumberDisplay || DEFAULT_CONTACT_CONFIG.whatsappDisplay;
    const office = raw.officePhone || raw.alternatePhone || DEFAULT_CONTACT_CONFIG.officePhone;
    return {
      ...DEFAULT_CONTACT_CONFIG,
      ...raw,
      whatsappPhone: phone,
      whatsappNumber: phone,
      whatsappDisplay: display,
      whatsappNumberDisplay: display,
      officePhone: office,
      alternatePhone: office
    };
  }

  updateContactConfig(updates) {
    const current = this.getContactConfig();
    const phone = updates.whatsappPhone || updates.whatsappNumber || current.whatsappPhone;
    const display = updates.whatsappDisplay || updates.whatsappNumberDisplay || current.whatsappDisplay;
    const office = updates.officePhone || updates.alternatePhone || current.officePhone;
    const updated = {
      ...current,
      ...updates,
      whatsappPhone: phone,
      whatsappNumber: phone,
      whatsappDisplay: display,
      whatsappNumberDisplay: display,
      officePhone: office,
      alternatePhone: office,
      updatedAt: new Date().toISOString()
    };
    localStorage.setItem(STORAGE_KEYS.CONTACT_CONFIG, JSON.stringify(updated));
    return updated;
  }

  // ==================== PRIESTS (ARCHAKAS) MANAGEMENT ====================
  getPriests() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRIESTS) || JSON.stringify(DEFAULT_PRIESTS));
  }

  getPriestById(id) {
    return this.getPriests().find(p => p.id === id);
  }

  savePriest(priestData) {
    const priests = this.getPriests();
    const existingIndex = priests.findIndex(p => p.id === priestData.id);
    if (existingIndex >= 0) {
      priests[existingIndex] = { ...priests[existingIndex], ...priestData, updatedAt: new Date().toISOString() };
    } else {
      if (!priestData.id) {
        priestData.id = 'priest-' + Date.now();
      }
      priestData.createdAt = new Date().toISOString();
      priests.push(priestData);
    }
    localStorage.setItem(STORAGE_KEYS.PRIESTS, JSON.stringify(priests));
    return priests;
  }

  deletePriest(id) {
    let priests = this.getPriests();
    priests = priests.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEYS.PRIESTS, JSON.stringify(priests));
    return priests;
  }

  togglePriestStatus(id) {
    const priests = this.getPriests();
    const priest = priests.find(p => p.id === id);
    if (priest) {
      priest.status = priest.status === 'ACTIVE' ? 'ON_LEAVE' : 'ACTIVE';
      priest.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PRIESTS, JSON.stringify(priests));
    }
    return priests;
  }

  // ==================== TEMPLE PHOTO GALLERY CMS ====================
  getGallery() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.GALLERY) || JSON.stringify(DEFAULT_GALLERY));
  }

  getGalleryItemById(id) {
    return this.getGallery().find(g => g.id === id);
  }

  saveGalleryItem(itemData) {
    const gallery = this.getGallery();
    const existingIndex = gallery.findIndex(g => g.id === itemData.id);
    if (existingIndex >= 0) {
      gallery[existingIndex] = { ...gallery[existingIndex], ...itemData, updatedAt: new Date().toISOString() };
    } else {
      if (!itemData.id) {
        itemData.id = 'gal-' + Date.now();
      }
      itemData.createdAt = new Date().toISOString();
      gallery.unshift(itemData);
    }
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    return gallery;
  }

  deleteGalleryItem(id) {
    let gallery = this.getGallery();
    gallery = gallery.filter(g => g.id !== id);
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    return gallery;
  }

  // ==================== SPECIAL NOTIFICATIONS & ALERTS ====================
  getSpecialNotifications() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS) || JSON.stringify(DEFAULT_SPECIAL_NOTIFICATIONS));
  }

  getSpecialNotificationById(id) {
    return this.getSpecialNotifications().find(n => n.id === id);
  }

  saveSpecialNotification(notifData) {
    const notifications = this.getSpecialNotifications();
    const existingIndex = notifications.findIndex(n => n.id === notifData.id);
    if (existingIndex >= 0) {
      notifications[existingIndex] = { ...notifications[existingIndex], ...notifData, updatedAt: new Date().toISOString() };
    } else {
      if (!notifData.id) {
        notifData.id = 'notif-' + Date.now();
      }
      notifData.createdAt = new Date().toISOString();
      notifications.unshift(notifData);
    }
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    return notifications;
  }

  deleteSpecialNotification(id) {
    let notifications = this.getSpecialNotifications();
    notifications = notifications.filter(n => n.id !== id);
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    return notifications;
  }

  toggleNotificationStatus(id) {
    const notifications = this.getSpecialNotifications();
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      notif.isActive = !notif.isActive;
      notif.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    }
    return notifications;
  }

  // ==================== STREAMING LOCATIONS MANAGEMENT ====================
  getStreamingLocations() {
    const locs = JSON.parse(localStorage.getItem(STORAGE_KEYS.STREAMING_LOCATIONS) || JSON.stringify(DEFAULT_STREAMING_LOCATIONS));
    return locs.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  }

  getLocationById(id) {
    return this.getStreamingLocations().find(l => l.id === id);
  }

  saveLocation(locationData) {
    const locs = this.getStreamingLocations();
    const existingIndex = locs.findIndex(l => l.id === locationData.id);
    if (existingIndex >= 0) {
      locs[existingIndex] = { ...locs[existingIndex], ...locationData, updatedAt: new Date().toISOString() };
    } else {
      if (!locationData.id) {
        locationData.id = 'loc-' + Date.now();
      }
      locationData.displayOrder = locationData.displayOrder || (locs.length + 1);
      locationData.status = locationData.status || 'ACTIVE';
      locationData.createdAt = new Date().toISOString();
      locs.push(locationData);
    }
    localStorage.setItem(STORAGE_KEYS.STREAMING_LOCATIONS, JSON.stringify(locs));
    return locs;
  }

  deleteLocation(id) {
    let locs = this.getStreamingLocations();
    locs = locs.filter(l => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.STREAMING_LOCATIONS, JSON.stringify(locs));
    return locs;
  }

  toggleLocationStatus(id) {
    const locs = this.getStreamingLocations();
    const loc = locs.find(l => l.id === id);
    if (loc) {
      loc.status = loc.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      loc.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.STREAMING_LOCATIONS, JSON.stringify(locs));
    }
    return locs;
  }

  reorderLocations(orderedIds) {
    const locs = this.getStreamingLocations();
    orderedIds.forEach((id, index) => {
      const loc = locs.find(l => l.id === id);
      if (loc) loc.displayOrder = index + 1;
    });
    localStorage.setItem(STORAGE_KEYS.STREAMING_LOCATIONS, JSON.stringify(locs));
    return this.getStreamingLocations();
  }

  // ==================== LIVE BROADCAST SESSIONS & LIFECYCLE ====================
  getLiveSessions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.LIVE_SESSIONS) || JSON.stringify(DEFAULT_LIVE_SESSIONS));
  }

  getLiveSessionById(id) {
    return this.getLiveSessions().find(s => s.id === id);
  }

  getActiveLiveSessionByLocation(locationId) {
    return this.getLiveSessions().find(s => 
      s.locationId === locationId && 
      (s.status === 'LIVE' || s.status === 'STARTING' || s.status === 'RECONNECTING')
    );
  }

  getActiveLiveSessions() {
    return this.getLiveSessions().filter(s => 
      s.status === 'LIVE' || s.status === 'STARTING' || s.status === 'RECONNECTING'
    );
  }

  saveLiveSession(sessionData) {
    const sessions = this.getLiveSessions();
    const isActiveStatus = sessionData.status === 'LIVE' || sessionData.status === 'STARTING' || sessionData.status === 'RECONNECTING';

    // Strict Mutex: Prevent duplicate concurrent active sessions for the same location
    if (isActiveStatus && sessionData.locationId) {
      const conflict = sessions.find(s => 
        s.locationId === sessionData.locationId && 
        s.id !== sessionData.id && 
        (s.status === 'LIVE' || s.status === 'STARTING' || s.status === 'RECONNECTING')
      );
      if (conflict) {
        throw new Error(`Location mutex violation: "${conflict.locationName}" already has an active broadcast session (${conflict.id}). Terminate previous session before publishing.`);
      }
    }

    const existingIndex = sessions.findIndex(s => s.id === sessionData.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = { ...sessions[existingIndex], ...sessionData, updatedAt: new Date().toISOString() };
    } else {
      if (!sessionData.id) {
        sessionData.id = 'sess-' + Date.now();
      }
      sessionData.createdAt = new Date().toISOString();
      sessions.unshift(sessionData);
    }

    localStorage.setItem(STORAGE_KEYS.LIVE_SESSIONS, JSON.stringify(sessions));

    // Update location currentSessionId
    if (sessionData.locationId) {
      const locs = this.getStreamingLocations();
      const loc = locs.find(l => l.id === sessionData.locationId);
      if (loc) {
        loc.currentSessionId = isActiveStatus ? sessionData.id : null;
        loc.currentStatus = sessionData.status;
        localStorage.setItem(STORAGE_KEYS.STREAMING_LOCATIONS, JSON.stringify(locs));
      }
    }

    return sessionData;
  }

  endLiveSession(sessionId, finalStats = {}) {
    const sessions = this.getLiveSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      session.status = 'ENDED';
      session.endedAt = session.endedAt || new Date().toISOString();
      if (session.startedAt) {
        const startMs = new Date(session.startedAt).getTime();
        const endMs = new Date(session.endedAt).getTime();
        session.durationSeconds = Math.max(0, Math.round((endMs - startMs) / 1000));
      }
      Object.assign(session, finalStats);
      session.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.LIVE_SESSIONS, JSON.stringify(sessions));

      // Clear location active session
      if (session.locationId) {
        const locs = this.getStreamingLocations();
        const loc = locs.find(l => l.id === session.locationId);
        if (loc && loc.currentSessionId === sessionId) {
          loc.currentSessionId = null;
          loc.currentStatus = 'OFFLINE';
          localStorage.setItem(STORAGE_KEYS.STREAMING_LOCATIONS, JSON.stringify(locs));
        }
      }
    }
    return session;
  }

  updateSessionViewerStats(sessionId, currentViewers, peakViewers) {
    if (!sessionId) return null;
    const sessions = this.getLiveSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      session.currentViewers = Math.max(0, parseInt(currentViewers, 10) || 0);
      const curPeak = session.peakViewers || 0;
      session.peakViewers = Math.max(curPeak, parseInt(peakViewers, 10) || 0, session.currentViewers);
      session.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.LIVE_SESSIONS, JSON.stringify(sessions));
      return session;
    }
    return null;
  }

  // ==================== VIEWER SESSIONS & HEARTBEAT CONCURRENCY ====================
  getViewerSessions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.VIEWER_SESSIONS) || '[]');
  }

  saveViewerSession(session) {
    const sessions = this.getViewerSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = { ...sessions[existingIndex], ...session, lastHeartbeatAt: new Date().toISOString() };
    } else {
      session.startedAt = session.startedAt || new Date().toISOString();
      session.lastHeartbeatAt = new Date().toISOString();
      session.durationSeconds = session.durationSeconds || 0;
      session.isActive = true;
      sessions.push(session);
    }
    // Cap memory footprint to 1,000 recent viewer sessions
    if (sessions.length > 1000) sessions.splice(0, sessions.length - 1000);
    localStorage.setItem(STORAGE_KEYS.VIEWER_SESSIONS, JSON.stringify(sessions));
    return session;
  }

  updateViewerHeartbeat(sessionId) {
    const sessions = this.getViewerSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (session && session.isActive) {
      const now = Date.now();
      const last = new Date(session.lastHeartbeatAt || session.startedAt).getTime();
      const deltaSec = Math.max(0, Math.round((now - last) / 1000));
      session.durationSeconds = (session.durationSeconds || 0) + deltaSec;
      session.lastHeartbeatAt = new Date(now).toISOString();
      localStorage.setItem(STORAGE_KEYS.VIEWER_SESSIONS, JSON.stringify(sessions));
    }
    return session;
  }

  endViewerSession(sessionId) {
    const sessions = this.getViewerSessions();
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      session.isActive = false;
      session.endedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.VIEWER_SESSIONS, JSON.stringify(sessions));
    }
    return session;
  }

  expireInactiveViewerSessions(timeoutSeconds = 45) {
    const sessions = this.getViewerSessions();
    const threshold = Date.now() - (timeoutSeconds * 1000);
    let changed = false;

    sessions.forEach(s => {
      if (s.isActive) {
        const lastHb = new Date(s.lastHeartbeatAt || s.startedAt).getTime();
        if (lastHb < threshold) {
          s.isActive = false;
          s.endedAt = new Date(lastHb + (timeoutSeconds * 1000)).toISOString();
          changed = true;
        }
      }
    });

    if (changed) {
      localStorage.setItem(STORAGE_KEYS.VIEWER_SESSIONS, JSON.stringify(sessions));
    }
    return sessions;
  }

  getActiveViewerCount(liveSessionId) {
    this.expireInactiveViewerSessions(45);
    const sessions = this.getViewerSessions();
    return sessions.filter(s => s.liveSessionId === liveSessionId && s.isActive).length;
  }

  // ==================== CENTRALIZED ANALYTICS STORAGE ====================
  getAnalyticsEvents() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS_EVENTS) || '[]');
  }

  logAnalyticsEvent(eventData) {
    const events = this.getAnalyticsEvents();
    const eventRecord = {
      id: 'evt-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      ...eventData,
      timestamp: eventData.timestamp || new Date().toISOString()
    };
    events.push(eventRecord);
    // ponytail: cap lightweight local queue to last 2,500 events to prevent quota overflow
    if (events.length > 2500) {
      events.splice(0, events.length - 2500);
    }
    localStorage.setItem(STORAGE_KEYS.ANALYTICS_EVENTS, JSON.stringify(events));
    return eventRecord;
  }

  getAnalyticsSessions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ANALYTICS_SESSIONS) || '[]');
  }

  recordAnalyticsSession(session) {
    const sessions = this.getAnalyticsSessions();
    const existingIndex = sessions.findIndex(s => s.id === session.id);
    if (existingIndex >= 0) {
      sessions[existingIndex] = { ...sessions[existingIndex], ...session, lastActiveAt: new Date().toISOString() };
    } else {
      session.startedAt = session.startedAt || new Date().toISOString();
      session.lastActiveAt = new Date().toISOString();
      sessions.push(session);
    }
    if (sessions.length > 1000) sessions.splice(0, sessions.length - 1000);
    localStorage.setItem(STORAGE_KEYS.ANALYTICS_SESSIONS, JSON.stringify(sessions));
    return session;
  }

  // ==================== WEB PUSH SUBSCRIPTIONS & HISTORY ====================
  getPushSubscriptions() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PUSH_SUBSCRIPTIONS) || JSON.stringify(DEFAULT_PUSH_SUBSCRIPTIONS));
  }

  savePushSubscription(subscription) {
    const subs = this.getPushSubscriptions();
    const existingIndex = subs.findIndex(s => s.endpoint === subscription.endpoint);
    if (existingIndex >= 0) {
      subs[existingIndex] = {
        ...subs[existingIndex],
        ...subscription,
        lastActiveAt: new Date().toISOString()
      };
    } else {
      subs.push({
        ...subscription,
        preferences: subscription.preferences || { liveDarshan: true, events: true, announcements: true },
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString()
      });
    }
    localStorage.setItem(STORAGE_KEYS.PUSH_SUBSCRIPTIONS, JSON.stringify(subs));
    return subs;
  }

  deletePushSubscription(endpoint) {
    let subs = this.getPushSubscriptions();
    subs = subs.filter(s => s.endpoint !== endpoint);
    localStorage.setItem(STORAGE_KEYS.PUSH_SUBSCRIPTIONS, JSON.stringify(subs));
    return subs;
  }

  updatePushPreferences(endpoint, preferences) {
    const subs = this.getPushSubscriptions();
    const sub = subs.find(s => s.endpoint === endpoint);
    if (sub) {
      sub.preferences = { ...sub.preferences, ...preferences };
      sub.lastActiveAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.PUSH_SUBSCRIPTIONS, JSON.stringify(subs));
    }
    return sub;
  }

  getNotificationHistory() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.NOTIFICATION_HISTORY) || JSON.stringify(DEFAULT_NOTIFICATION_HISTORY));
  }

  logNotificationDispatch(record) {
    const history = this.getNotificationHistory();
    const item = {
      id: record.id || ('notif-disp-' + Date.now()),
      ...record,
      timestamp: record.timestamp || new Date().toISOString()
    };
    history.unshift(item);
    if (history.length > 200) history.pop();
    localStorage.setItem(STORAGE_KEYS.NOTIFICATION_HISTORY, JSON.stringify(history));
    return item;
  }

  // ==================== STREAM SETTINGS ====================
  getStreamSettings() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.STREAM_SETTINGS) || JSON.stringify(DEFAULT_STREAM_SETTINGS));
  }

  updateStreamSettings(settings) {
    const current = this.getStreamSettings();
    const updated = { ...current, ...settings, updatedAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEYS.STREAM_SETTINGS, JSON.stringify(updated));
    return updated;
  }
}

export const templeStore = new TempleStore();
