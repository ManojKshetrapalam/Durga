/**
 * Sri Durga Parameshwari Temple, Chandra Layout 1st Phase, Bengaluru - 560072
 * 21 Authentic Sevas and Kanike Rates
 */

export const SEVAS_DATA = [
  {
    id: "durga-homa",
    name: "Durga Homa (Special Friday Homa)",
    kannadaName: "ಶ್ರೀ ದುರ್ಗಾ ಹೋಮ (ಶುಕ್ರವಾರ ವಿಶೇಷ)",
    category: "homa",
    kanike: 1501,
    durationMinutes: 150,
    sanctumLocation: "Sri Durga Parameshwari Yagashala",
    allowedDays: [5], // Friday only
    timeSlots: ["10:00 AM – 12:30 PM"],
    isSpecial: true,
    badgeText: "Most Auspicious",
    description: "Sacred fire oblation to Goddess Durga Parameshwari for removing planetary afflictions, health, and family prosperity.",
    templeProvides: [
      "Complete Homa Samagri, Dry Coconut Havis & Sacred Herbs",
      "Sacred Mango Wood & Pure Cow Ghee",
      "Senior Archakas for Vedic Mantra Chanting",
      "Purnahuti Silk Cloth & Kalasha Theertha Prasadam",
      "Special Kumkuma & Prasada Basket"
    ],
    devoteeBrings: [
      "5 Fresh Dry Coconuts (Kobbari)",
      "2 Floral Garlands (Sevanti / Jasmine)",
      "5 Varieties of fresh fruits",
      "1 Bundle Betel Leaves & Supari",
      "Traditional pure cotton attire"
    ]
  },
  {
    id: "rahukala-deepa",
    name: "Rahukala Deepada Seva (Tuesday Special)",
    kannadaName: "ರಾಹುಕಾಲ ನಿಂಬೆಹಣ್ಣಿನ ದೀಪದ ಸೇವೆ",
    category: "special",
    kanike: 101,
    durationMinutes: 45,
    sanctumLocation: "Durga Sanctum Prakaara",
    allowedDays: [2], // Tuesday only
    timeSlots: ["03:30 PM – 05:00 PM"],
    isSpecial: true,
    badgeText: "Tuesday Special",
    description: "Sacred Lemon Lamp lighting ceremony during Rahukala to alleviate Rahu/Ketu doshas and bestow obstacle removal.",
    templeProvides: [
      "Sanctum space and holy match flame",
      "Kumkum & Akshate blessings from Archaka",
      "Rahu Kala Mangalarathi Darshan",
      "Kumkuma prasadam"
    ],
    devoteeBrings: [
      "2 Clean yellow lemons (cut and inverted into lamps)",
      "Pure Cow Ghee or Sesame (Til) oil",
      "Cotton wicks (Baathi)",
      "Red flowers (Hibiscus or Sevanti)"
    ]
  },
  {
    id: "panchamrutha-abhisheka",
    name: "Panchamrutha Abhisheka",
    kannadaName: "ಪಂಚಾಮೃತ ಅಭಿಷೇಕ",
    category: "abhisheka",
    kanike: 101,
    durationMinutes: 45,
    sanctumLocation: "Main Sanctum Sanctorum",
    allowedDays: [0, 1, 2, 3, 4, 5, 6], // Daily
    timeSlots: ["07:30 AM – 09:00 AM"],
    isSpecial: false,
    badgeText: "Daily Morning",
    description: "Sacred five-nectar bath (Milk, Curd, Ghee, Honey, Sugar) performed to Goddess Durga Parameshwari.",
    templeProvides: [
      "Archaka assistance and sanctum recitation",
      "Akshate, Gandha and flower ornamentation",
      "Theertha and Kumkuma prasadam"
    ],
    devoteeBrings: [
      "1/2 Litre pure cow milk",
      "1 Small bottle pure honey",
      "Ghee and fruits for naivedya",
      "Fresh flowers"
    ]
  },
  {
    id: "rudrabhisheka",
    name: "Rudrabhisheka",
    kannadaName: "ರುದ್ರಾಭಿಷೇಕ",
    category: "abhisheka",
    kanike: 201,
    durationMinutes: 60,
    sanctumLocation: "Shiva / Durga Sannidhi",
    allowedDays: [1, 4, 6], // Mon, Thu, Sat
    timeSlots: ["08:00 AM – 09:30 AM"],
    isSpecial: false,
    badgeText: "Auspicious",
    description: "Chanting of Sri Rudram with continuous sacred abhisheka for peace, health, and liberation.",
    templeProvides: [
      "Sacred Ganga theertha & Bilva leaves",
      "Veda Archakas for Sri Rudra Namaka-Chamaka chanting",
      "Vibhuti, Theertha & Prasadam"
    ],
    devoteeBrings: [
      "1 Litre fresh milk & tender coconut",
      "Bilvapatra (1 bunch)",
      "White flowers & fruits"
    ]
  },
  {
    id: "panchamrutha-rudrabhisheka",
    name: "Panchamrutha + Rudrabhisheka",
    kannadaName: "ಪಂಚಾಮೃತ + ರುದ್ರಾಭಿಷೇಕ",
    category: "abhisheka",
    kanike: 250,
    durationMinutes: 75,
    sanctumLocation: "Main Sanctum",
    allowedDays: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["07:30 AM – 09:30 AM"],
    isSpecial: false,
    badgeText: "Popular",
    description: "Combined Panchamrutha oblation and Vedic Rudra chanting for comprehensive spiritual purification.",
    templeProvides: [
      "All Vedic sacred items & archaka chanting",
      "Mangalarathi, Theertha, and Prasadam"
    ],
    devoteeBrings: [
      "Milk, curd, honey, ghee, bananas",
      "Bilvapatra and Sevanti flowers"
    ]
  },
  {
    id: "ksheera-abhisheka",
    name: "Ksheera Abhisheka (Pure Milk Bath)",
    kannadaName: "ಕ್ಷೀರಾಭಿಷೇಕ",
    category: "abhisheka",
    kanike: 150,
    durationMinutes: 30,
    sanctumLocation: "Main Sanctum",
    allowedDays: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["08:00 AM – 09:00 AM"],
    isSpecial: false,
    badgeText: "Daily",
    description: "Devotional sacred milk abhisheka to Goddess Durga.",
    templeProvides: ["Sanctum puja vessels, camphor, mangalarathi"],
    devoteeBrings: ["1 Litre pure fresh milk, red flowers"]
  },
  {
    id: "kumkuma-archana",
    name: "Kumkuma Archana",
    kannadaName: "ಕುಂಕುಮ ಅರ್ಚನೆ",
    category: "archana",
    kanike: 10,
    durationMinutes: 15,
    sanctumLocation: "Main Sanctum",
    allowedDays: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["07:00 AM – 11:30 AM", "05:30 PM – 08:30 PM"],
    isSpecial: false,
    badgeText: "Traditional",
    description: "Sacred Kumkum offerings with recital of Goddess Durga's sacred names.",
    templeProvides: ["Sanctified red vermilion (Kumkuma) & Mangalarathi"],
    devoteeBrings: ["Devotee name, Gothra & Nakshatra for Sankalpa"]
  },
  {
    id: "sahasranama-archana",
    name: "Sahasranama Archana (1,000 Names)",
    kannadaName: "ಸಹಸ್ರನಾಮ ಅರ್ಚನೆ",
    category: "archana",
    kanike: 25,
    durationMinutes: 30,
    sanctumLocation: "Main Sanctum",
    allowedDays: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["08:30 AM – 10:30 AM", "06:00 PM – 07:30 PM"],
    isSpecial: false,
    badgeText: "Daily",
    description: "Recitation of Sri Lalitha Sahasranama or Sri Durga Sahasranama with sacred flowers.",
    templeProvides: ["Archana flowers, Kumkuma, Akshate & Aarti"],
    devoteeBrings: ["Devotee Gothra & Family names for Sankalpa"]
  },
  {
    id: "trisathi-archana",
    name: "Trisathi Archana (300 Names)",
    kannadaName: "ತ್ರಿಶತಿ ಅರ್ಚನೆ",
    category: "archana",
    kanike: 30,
    durationMinutes: 25,
    sanctumLocation: "Main Sanctum",
    allowedDays: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["09:00 AM – 11:00 AM", "06:30 PM – 08:00 PM"],
    isSpecial: false,
    badgeText: "Devotional",
    description: "Recitation of Lalitha Trishati by Temple Archaka.",
    templeProvides: ["Sanctified Kumkuma, Akshate and flowers"],
    devoteeBrings: ["Flowers and fruits (optional)"]
  },
  {
    id: "ashtothara-bilvarchana",
    name: "Ashtothara Bilvarchana",
    kannadaName: "ಅಷ್ಟೋತ್ತರ ಬಿಲ್ವಾರ್ಚನೆ",
    category: "archana",
    kanike: 301,
    durationMinutes: 40,
    sanctumLocation: "Main Sanctum",
    allowedDays: [1, 4, 6],
    timeSlots: ["09:00 AM – 10:30 AM"],
    isSpecial: false,
    badgeText: "Shiva-Durga",
    description: "Sacred archana using 108 auspicious holy Bilva leaves.",
    templeProvides: ["108 Bilva leaves, Kumkuma, Aarti"],
    devoteeBrings: ["Fruits and betel leaves"]
  },
  {
    id: "mahamangalarathi",
    name: "Special Mahamangalarathi",
    kannadaName: "ಮಹಾ ಮಂಗಳಾರತಿ",
    category: "special",
    kanike: 50,
    durationMinutes: 15,
    sanctumLocation: "Main Sanctum",
    allowedDays: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["12:00 PM", "07:30 PM"],
    isSpecial: false,
    badgeText: "Daily Peak",
    description: "Grand camphor flame mangalarathi offered in devotee's name.",
    templeProvides: ["Camphor, ghee lamp, theertha and kumkuma"],
    devoteeBrings: ["Family Sankalpa details"]
  },
  {
    id: "ganapathi-homa",
    name: "Sri Ganapathi Homa",
    kannadaName: "ಶ್ರೀ ಗಣಪತಿ ಹೋಮ",
    category: "homa",
    kanike: 501,
    durationMinutes: 90,
    sanctumLocation: "Sri Durga Devi Yagashala",
    allowedDays: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["08:30 AM – 10:30 AM"],
    isSpecial: false,
    badgeText: "Obstacle Removal",
    description: "Sacred fire ritual to Lord Ganesha for auspicious beginnings and Karya Siddhi.",
    templeProvides: ["Modaka havis, homa kunda wood, ghee, purohit"],
    devoteeBrings: ["3 Coconuts, jaggery, bananas, flowers, durva grass"]
  },
  {
    id: "navagraha-shanti",
    name: "Navagraha Shanti Pooja",
    kannadaName: "ನವಗ್ರಹ ಶಾಂತಿ ಪೂಜೆ",
    category: "special",
    kanike: 501,
    durationMinutes: 60,
    sanctumLocation: "Navagraha Sannidhi",
    allowedDays: [6, 0], // Sat, Sun
    timeSlots: ["09:00 AM – 10:30 AM"],
    isSpecial: false,
    badgeText: "Planetary Harmony",
    description: "Propitiation of nine planetary deities with sacred grains and deepa.",
    templeProvides: ["Navadhanya grains, nine deepas, archana"],
    devoteeBrings: ["Sesame seeds, jaggery, flowers"]
  },
  {
    id: "navagraha-homa",
    name: "Navagraha Homa",
    kannadaName: "ನವಗ್ರಹ ಹೋಮ",
    category: "homa",
    kanike: 1001,
    durationMinutes: 120,
    sanctumLocation: "Yagashala",
    allowedDays: [6, 0],
    timeSlots: ["09:00 AM – 11:30 AM"],
    isSpecial: false,
    badgeText: "Planetary Shanti",
    description: "Comprehensive fire oblation for nine planetary deities to mitigate negative Dasha/Bhukti periods.",
    templeProvides: ["Navadhanya, samith, ghee, dry coconuts, purohit"],
    devoteeBrings: ["5 Coconuts, flowers, fruits, vastra dakshina"]
  },
  {
    id: "mrityunjaya-homa",
    name: "Maha Mrityunjaya Homa",
    kannadaName: "ಮಹಾ ಮೃತ್ಯುಂಜಯ ಹೋಮ",
    category: "homa",
    kanike: 750,
    durationMinutes: 90,
    sanctumLocation: "Yagashala",
    allowedDays: [1, 4],
    timeSlots: ["09:00 AM – 11:00 AM"],
    isSpecial: false,
    badgeText: "Ayushya & Health",
    description: "Potent healing fire oblation with Maha Mrityunjaya mantra chanting for longevity and recovery.",
    templeProvides: ["Amrutha valli, samidha, ghee, purohit"],
    devoteeBrings: ["Durva, milk, 3 coconuts, flowers, fruits"]
  },
  {
    id: "chandi-parayana",
    name: "Sri Chandi Parayana Seva",
    kannadaName: "ಶ್ರೀ ಚಂಡೀ ಪಾರಾಯಣ ಸೇವೆ",
    category: "special",
    kanike: 2501,
    durationMinutes: 180,
    sanctumLocation: "Inner Temple Hall",
    allowedDays: [2, 5], // Tue, Fri
    timeSlots: ["09:00 AM – 12:30 PM"],
    isSpecial: true,
    badgeText: "Sacred Recitation",
    description: "Complete recital of Sri Devi Mahatmyam (700 verses) by scholarly archakas.",
    templeProvides: ["Scholarly Archakas, Puja, Naivedya, Mangalarathi"],
    devoteeBrings: ["Sankalpa names, 5 fruits, dry fruits, flower garlands"]
  },
  {
    id: "maha-chandi-homa",
    name: "Maha Chandi Homa",
    kannadaName: "ಮಹಾ ಚಂಡೀ ಹೋಮ",
    category: "homa",
    kanike: 5001,
    durationMinutes: 240,
    sanctumLocation: "Grand Yagashala",
    allowedDays: [5], // Friday
    timeSlots: ["08:30 AM – 01:00 PM"],
    isSpecial: true,
    badgeText: "Supreme Devi Homa",
    description: "The supreme fire oblation of Tantroka and Vedokta Chandi ritual with extensive offerings.",
    templeProvides: [
      "All Vedic Purohits, complete Homa dravyas",
      "Silk saree offering to Goddess, Kalasha puja",
      "Mahamangalarathi, Mahaprasadam"
    ],
    devoteeBrings: [
      "Silk cloth, 10 dry coconuts, garlands, assorted dry fruits, 1 tin pure cow ghee"
    ]
  },
  {
    id: "vahana-2wheeler",
    name: "Two-Wheeler Vehicle Pooja",
    kannadaName: "ದ್ವಿಚಕ್ರ ವಾಹನ ಪೂಜೆ (ಸ್ಕೂಟರ್ / ಬೈಕ್)",
    category: "vahana",
    kanike: 101,
    durationMinutes: 20,
    sanctumLocation: "North Gate Prakaara",
    allowedDays: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["09:00 AM – 11:00 AM", "06:00 PM – 08:00 PM"],
    isSpecial: false,
    badgeText: "Safety Blessing",
    description: "Consecration of scooters and motorcycles with coconut breaking, lemon placement and archana.",
    templeProvides: ["Archaka on duty, Kumkum, Turmeric, Arathi flame"],
    devoteeBrings: ["1 Coconut, 4 Lemons, 1 Garland, Camphor"]
  },
  {
    id: "vahana-auto",
    name: "Auto / Three-Wheeler Vehicle Pooja",
    kannadaName: "ಆಟೋ / ತ್ರಿಚಕ್ರ ವಾಹನ ಪೂಜೆ",
    category: "vahana",
    kanike: 251,
    durationMinutes: 25,
    sanctumLocation: "North Gate Prakaara",
    allowedDays: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["09:00 AM – 11:00 AM", "06:00 PM – 08:00 PM"],
    isSpecial: false,
    badgeText: "Livelihood Blessing",
    description: "Consecration of commercial three-wheelers and autos.",
    templeProvides: ["Archaka, vermilion paste, consecrated thread"],
    devoteeBrings: ["2 Coconuts, 4 Lemons, Garland, Camphor"]
  },
  {
    id: "vahana-car",
    name: "Car / Four-Wheeler Vehicle Pooja",
    kannadaName: "ಕಾರು / ನಾಲ್ಕು ಚಕ್ರಗಳ ವಾಹನ ಪೂಜೆ",
    category: "vahana",
    kanike: 501,
    durationMinutes: 30,
    sanctumLocation: "North Gate Prakaara",
    allowedDays: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["09:00 AM – 11:00 AM", "06:00 PM – 08:00 PM"],
    isSpecial: false,
    badgeText: "Vehicle Suraksha",
    description: "Complete vehicle consecration for new and existing cars with tire lemon crushing, kalasha theertha, and engine blessing.",
    templeProvides: ["Archaka, Consecrated kalasha theertha, Kumkuma swastika, sacred thread"],
    devoteeBrings: ["2 Fresh coconuts, 4 Lemons, 1 Full front grill garland, Camphor box"]
  },
  {
    id: "ashtothara-shatanamavali",
    name: "Ashtothara Shatanamavali Archana (108 Names)",
    kannadaName: "ಅಷ್ಟೋತ್ತರ ಶತನಾಮಾವಳಿ ಅರ್ಚನೆ",
    category: "archana",
    kanike: 30,
    durationMinutes: 20,
    sanctumLocation: "Main Sanctum",
    allowedDays: [0, 1, 2, 3, 4, 5, 6],
    timeSlots: ["07:30 AM – 11:00 AM", "05:30 PM – 08:00 PM"],
    isSpecial: false,
    badgeText: "Daily Regular",
    description: "Recitation of 108 names of Sri Durga Parameshwari with kumkuma.",
    templeProvides: ["Kumkuma, flowers, Aarti"],
    devoteeBrings: ["Family Sankalpa details"]
  }
];
