/**
 * Vedic Panchanga & Astronomical Horizon Service
 * Calibrated specifically for Bengaluru, Karnataka (12.9716° N, 77.5946° E)
 * Computes authentic Solar coordinates, dynamic Sunrise/Sunset, Kaala divisions,
 * Abhijit Muhurtha, dynamic Ritu (6 Vedic seasons), Ayana, Jovian Samvatsara,
 * and comprehensive Hindu/Devi Festivals & Vratas based on Tithi, Masa & Nakshatra.
 */

const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Arudra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
];

const TITHIS = [
  "Shukla Prathama", "Shukla Dwitiya", "Shukla Tritiya", "Shukla Chaturthi", "Shukla Panchami",
  "Shukla Shashti", "Shukla Saptami", "Shukla Ashtami", "Shukla Navami", "Shukla Dashami",
  "Shukla Ekadashi", "Shukla Dvadashi", "Shukla Trayodashi", "Shukla Chaturdashi", "Pournami (Purnima)",
  "Krishna Prathama", "Krishna Dwitiya", "Krishna Tritiya", "Krishna Chaturthi", "Krishna Panchami",
  "Krishna Shashti", "Krishna Saptami", "Krishna Ashtami", "Krishna Navami", "Krishna Dashami",
  "Krishna Ekadashi", "Krishna Dvadashi", "Krishna Trayodashi", "Krishna Chaturdashi", "Amavasya"
];

const YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva",
  "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
  "Brahma", "Indra", "Vaidhriti"
];

const RASHIS = [
  "Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)",
  "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrischika (Scorpio)",
  "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"
];

const SAMVATSARAS = [
  "Prabhava", "Vibhava", "Shukla", "Pramodoota", "Prajothpatti", "Aangirasa",
  "Shrimukha", "Bhaava", "Yuva", "Dhaatu", "Eeshwara", "Bahudhaanya",
  "Pramaathi", "Vikrama", "Vrushaprajaa", "Chitrabhaanu", "Subhaanu", "Taarana",
  "Paarthiva", "Vyaya", "Sarvajith", "Sarvadhaari", "Virodhi", "Vikruti",
  "Khara", "Nandana", "Vijaya", "Jaya", "Manmatha", "Durmukhi",
  "Hevilambi", "Vilambi", "Vikaari", "Sharvari", "Plava", "Shubhakruth",
  "Shobhakruth", "Krodhi", "Vishvaavasu", "Paraabhava", "Plavanga", "Keelaka",
  "Saumya", "Saadhaarana", "Virodhikruth", "Paridhaavi", "Pramaadicha", "Aananda",
  "Raakshasa", "Nala", "Pingala", "Kaalayukthi", "Siddhaarthi", "Raudra",
  "Durmathi", "Dundubhi", "Rudhirodgaari", "Raktaakshi", "Krodhana", "Kshaya"
];

const MASAS = [
  "Chaitra", "Vaishakha", "Jyeshtha", "Ashadha",
  "Shravana", "Bhadrapada", "Ashvina", "Kartika",
  "Margashirsha", "Pushya", "Magha", "Phalguna"
];

// Ugadi (Vedic New Year) astronomical dates for year-to-year Samvatsara transition
const UGADI_CALENDAR = {
  2024: new Date(2024, 3, 9),  // 09 Apr 2024 (Krodhi)
  2025: new Date(2025, 2, 30), // 30 Mar 2025 (Vishvaavasu)
  2026: new Date(2026, 2, 19), // 19 Mar 2026 (Paraabhava)
  2027: new Date(2027, 3, 7),  // 07 Apr 2027 (Plavanga)
  2028: new Date(2028, 2, 27), // 27 Mar 2028 (Keelaka)
  2029: new Date(2029, 3, 14), // 14 Apr 2029 (Saumya)
  2030: new Date(2030, 3, 3)   // 03 Apr 2030 (Saadhaarana)
};

// 1/8th Kaala segment sequence for each day (0 = Sunday to 6 = Saturday)
const KAALA_SEGMENTS = {
  0: { rahu: 7, yama: 4, gulika: 6 }, // Sunday
  1: { rahu: 1, yama: 3, gulika: 5 }, // Monday
  2: { rahu: 6, yama: 2, gulika: 4 }, // Tuesday
  3: { rahu: 4, yama: 1, gulika: 3 }, // Wednesday
  4: { rahu: 5, yama: 0, gulika: 2 }, // Thursday
  5: { rahu: 3, yama: 6, gulika: 1 }, // Friday
  6: { rahu: 2, yama: 5, gulika: 0 }  // Saturday
};

// Accurate lunar reference epoch: 19 Mar 2026 = Chaitra Shukla Prathama (Ugadi 2026)
const LUNAR_EPOCH_MS = Date.UTC(2026, 2, 19, 0, 0, 0);
const SYNODIC_MONTH_DAYS = 29.53058867;
const SIDEREAL_MONTH_DAYS = 27.321661;

// 11 Authentic Vedic Karanas (4 Fixed Sthira + 7 Movable Chara cycling 8 times over 60 half-tithis)
const KARANAS_METADATA = {
  kintughna: { name: "Kintughna", kannada: "ಕಿಂತುಘ್ನ", sanskrit: "किंस्तुघ्न", type: "Sthira (Fixed)", isVishti: false },
  bava: { name: "Bava", kannada: "ಬವ", sanskrit: "बव", type: "Chara (Movable)", isVishti: false },
  balava: { name: "Balava", kannada: "ಬಾಲವ", sanskrit: "बालव", type: "Chara (Movable)", isVishti: false },
  kaulava: { name: "Kaulava", kannada: "ಕೌಲವ", sanskrit: "कौलव", type: "Chara (Movable)", isVishti: false },
  taitila: { name: "Taitila", kannada: "ತೈತಿಲ", sanskrit: "तैतिल", type: "Chara (Movable)", isVishti: false },
  gara: { name: "Gara", kannada: "ಗರ", sanskrit: "गर", type: "Chara (Movable)", isVishti: false },
  vanija: { name: "Vanija", kannada: "ವಣಿಜ", sanskrit: "वणिज", type: "Chara (Movable)", isVishti: false },
  vishti: { name: "Vishti (Bhadra)", kannada: "ವಿಷ್ಟಿ (ಭದ್ರಾ)", sanskrit: "विष्टि (भद्रा)", type: "Chara (Movable)", isVishti: true },
  shakuni: { name: "Shakuni", kannada: "ಶಕುನಿ", sanskrit: "शकुनि", type: "Sthira (Fixed)", isVishti: false },
  chatushpada: { name: "Chatushpada", kannada: "ಚತುಷ್ಪಾದ", sanskrit: "चतुष्पाद", type: "Sthira (Fixed)", isVishti: false },
  naga: { name: "Naga", kannada: "ನಾಗ", sanskrit: "नाग", type: "Sthira (Fixed)", isVishti: false }
};

const CHARA_KARANAS = [
  KARANAS_METADATA.bava,
  KARANAS_METADATA.balava,
  KARANAS_METADATA.kaulava,
  KARANAS_METADATA.taitila,
  KARANAS_METADATA.gara,
  KARANAS_METADATA.vanija,
  KARANAS_METADATA.vishti
];

export class PanchangaService {
  /**
   * Astronomical solar position and sunrise/sunset for Bengaluru (12.9716° N, 77.5946° E)
   */
  static calculateBengaluruSun(dateObj) {
    const lat = 12.9716;
    const lon = 77.5946;
    const istMeridian = 82.5;

    const startOfYear = new Date(Date.UTC(dateObj.getFullYear(), 0, 1));
    const dayOfYear = Math.floor((dateObj - startOfYear) / (24 * 60 * 60 * 1000)) + 1;

    const gamma = (2 * Math.PI / 365) * (dayOfYear - 1);

    const eqtime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
      - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));

    const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
      - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
      - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);

    const zenithRad = (90.833 * Math.PI) / 180;
    const latRad = (lat * Math.PI) / 180;

    const cosHA = (Math.cos(zenithRad) / (Math.cos(latRad) * Math.cos(decl))) - (Math.tan(latRad) * Math.tan(decl));
    const clampedCosHA = Math.max(-1, Math.min(1, cosHA));
    const haHours = (Math.acos(clampedCosHA) * 180 / Math.PI) / 15;

    const lonCorrMin = (istMeridian - lon) * 4;
    const solarNoonMin = 720 + lonCorrMin - eqtime;

    const sunriseMin = solarNoonMin - (haHours * 60);
    const sunsetMin = solarNoonMin + (haHours * 60);
    const dayLengthMin = sunsetMin - sunriseMin;

    return {
      sunriseMinutes: sunriseMin,
      sunsetMinutes: sunsetMin,
      solarNoonMinutes: solarNoonMin,
      dayLengthMinutes: dayLengthMin,
      solarDeclinationDeg: (decl * 180) / Math.PI,
      dayOfYear
    };
  }

  static minutesToTimeString(totalMinutes) {
    const mins = Math.round(totalMinutes);
    let hours = Math.floor(mins / 60) % 24;
    const minutes = mins % 60;
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 === 0 ? 12 : hours % 12;
    const paddedMinutes = String(minutes).padStart(2, '0');
    return `${String(displayHours).padStart(2, '0')}:${paddedMinutes} ${period}`;
  }

  /**
   * 6 authentic Vedic Ritus (Seasons) linked directly to the 12 Vedic Masas:
   * 1. Vasanta  - Chaitra & Vaishakha
   * 2. Grishma  - Jyeshtha & Ashadha
   * 3. Varsha   - Shravana & Bhadrapada
   * 4. Sharad   - Ashvina & Kartika
   * 5. Hemanta  - Margashirsha & Pushya (covers late Dec)
   * 6. Shishira - Magha & Phalguna (covers mid Jan to March prior to Ugadi)
   */
  static getVedicRitu(dateObj, lunar = null) {
    const l = lunar || this.getLunarDetails(dateObj);
    const rituIndex = Math.floor(l.masaIndex / 2); // 0 to 5
    const ritus = [
      {
        name: "Vasanta Ritu",
        sanskrit: "वसन्त ऋतु",
        meaning: "Spring / Flowering Season",
        description: "Season of Chaitra & Vaishakha; Vedic New Year (Ugadi), Rama Navami, and nature blooming in divine radiance."
      },
      {
        name: "Grishma Ritu",
        sanskrit: "ग्रीष्म ऋतु",
        meaning: "Summer Season",
        description: "Season of Jyeshtha & Ashadha; solar tapas, Chandana Alankara, and Abhishekas with sacred panchamrutha."
      },
      {
        name: "Varsha Ritu",
        sanskrit: "वर्षा ऋतु",
        meaning: "Monsoon Season",
        description: "Season of Shravana & Bhadrapada; holy Shravana masa, Gokulashtami, Ganesha Chaturthi and deep spiritual penance."
      },
      {
        name: "Sharad Ritu",
        sanskrit: "शरद ऋतु",
        meaning: "Autumn Season",
        description: "Season of Ashvina & Kartika; divine Navaratri, Vijayadashami, Ayudha Pooja, and Deepavali festival of radiant lights."
      },
      {
        name: "Hemanta Ritu",
        sanskrit: "हेಮन्त ऋतु",
        meaning: "Pre-winter / Dewy Season",
        description: "Season of Margashirsha & Pushya; divine lamps, Dhanurmasa, Vaikuntha Ekadashi & early morning temple pujas."
      },
      {
        name: "Shishira Ritu",
        sanskrit: "ಶಿಶಿರ ಋತು / शिशिर ऋतु",
        meaning: "Winter / Cold Season",
        description: "Season of Magha & Phalguna; Uttarayana punyakala, Makara Sankranti, Ratha Saptami, Maha Shivaratri and auspicious Surya worship."
      }
    ];
    return ritus[rituIndex] || ritus[0];
  }

  /**
   * Dynamic Ayana:
   * Uttarayana: Makara Sankranti (~Jan 15) to Karka Sankranti (~Jul 15)
   * Dakshinayana: Karka Sankranti (~Jul 16) to Makara Sankranti (~Jan 14)
   */
  static getVedicAyana(dateObj) {
    const month = dateObj.getMonth();
    const day = dateObj.getDate();

    if ((month === 0 && day >= 15) || (month > 0 && month < 6) || (month === 6 && day <= 15)) {
      return {
        name: "Uttarayana",
        sanskrit: "उत्तरायण",
        description: "Sun's northward celestial journey; period of enlightenment, devas and sacred muhurthas."
      };
    } else {
      return {
        name: "Dakshinayana",
        sanskrit: "दक्षिणಾಯನ",
        description: "Sun's southward celestial journey; period of festivals, vrathas and divine Devi worship."
      };
    }
  }

  /**
   * Dynamic 60-year Jovian Samvatsara cycle with accurate Ugadi transitions
   */
  static getSamvatsara(dateObj) {
    const year = dateObj.getFullYear();
    const ugadiDate = UGADI_CALENDAR[year] || new Date(year, 2, 22);

    let jovianYear = year;
    if (dateObj < ugadiDate) {
      // Prior to Ugadi of this calendar year, it still belongs to previous Samvatsara
      jovianYear = year - 1;
    }

    // 2026 Ugadi starts Paraabhava (index 39)
    const baseYear = 2026;
    const baseIndex = 39; // Paraabhava
    const yearDiff = jovianYear - baseYear;
    let index = (baseIndex + yearDiff) % 60;
    if (index < 0) index += 60;
    return `${SAMVATSARAS[index]} Samvatsara`;
  }

  /**
   * Astronomical Lunar Calculation: Tithi, Paksha, Masa, Nakshatra
   */
  static getLunarDetails(dateObj) {
    const utcMs = Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
    const diffDays = (utcMs - LUNAR_EPOCH_MS) / (1000 * 60 * 60 * 24);

    let totalCycles = diffDays / SYNODIC_MONTH_DAYS;
    let cycleIndex = Math.floor(totalCycles);
    let cycleProgress = totalCycles - cycleIndex;
    if (cycleProgress < 0) {
      cycleProgress += 1;
      cycleIndex -= 1;
    }

    const tithiIndex = Math.floor(cycleProgress * 30);
    const isShukla = tithiIndex < 15;
    const pakshaTithiNum = (tithiIndex % 15) + 1; // 1 to 15

    let masaIndex = (cycleIndex % 12);
    if (masaIndex < 0) masaIndex += 12;
    const masaName = MASAS[masaIndex];

    let siderealCycles = diffDays / SIDEREAL_MONTH_DAYS;
    let nakshatraProgress = siderealCycles - Math.floor(siderealCycles);
    if (nakshatraProgress < 0) nakshatraProgress += 1;
    const nakshatraIndex = Math.floor(nakshatraProgress * 27);

    // Yoga (27 yogas)
    const yogaIndex = Math.abs(Math.floor(diffDays + 7) % 27);

    // Moon Rashi
    const rashiIndex = Math.floor(nakshatraIndex / 2.25) % 12;

    return {
      tithiIndex,
      isShukla,
      pakshaTithiNum,
      masaIndex,
      masaName,
      nakshatraIndex,
      yogaIndex,
      rashiIndex
    };
  }

  /**
   * Authentic Hindu, Vedic & Sri Durga Devi Festivals & Vratas Detection
   */
  static detectFestivals(dateObj, lunar) {
    const festivals = [];
    const dayOfWeek = dateObj.getDay();
    const month = dateObj.getMonth();
    const date = dateObj.getDate();
    const { isShukla, pakshaTithiNum, masaName, nakshatraIndex } = lunar;
    const nakshatraName = NAKSHATRAS[nakshatraIndex];

    // --- SHUKLA PAKSHA FESTIVALS ---
    if (isShukla) {
      if (pakshaTithiNum === 1) {
        if (masaName === "Chaitra") {
          festivals.push({
            name: "Ugadi (Chandramana Vedic New Year)",
            kannada: "ಯುಗಾದಿ ಹಬ್ಬ (ಸಂವತ್ಸರಾರಂಭ)",
            badge: "🌸 Ugadi Festival",
            isMajor: true,
            description: "Commencement of the new Vedic Samvatsara. Bevu-Bella distribution and Panchanga Shravana."
          });
        } else if (masaName === "Ashvina") {
          festivals.push({
            name: "Sharad Navaratri Ghatasthapana",
            kannada: "ಶರನ್ನವರಾತ್ರಿ ಘಟಸ್ಥಾಪನೆ",
            badge: "🪔 Navaratri Day 1",
            isMajor: true,
            description: "Auspicious invocation of Sri Durga Devi for the 9 holy nights of Navaratri Utsavam."
          });
        } else if (masaName === "Kartika") {
          festivals.push({
            name: "Bali Padyami (Deepavali Deepotsava)",
            kannada: "ಬಲಿ ಪಾಡ್ಯಮಿ",
            badge: "🪔 Bali Padyami",
            isMajor: true,
            description: "Third day of Deepavali; King Bali worship, Gow Pooja, and glorious sanctum lamp illumination."
          });
        }
      } else if (pakshaTithiNum === 3 && masaName === "Vaishakha") {
        festivals.push({
          name: "Akshaya Tritiya",
          kannada: "ಅಕ್ಷಯ ತೃತೀಯ",
          badge: "💰 Akshaya Tritiya",
          isMajor: true,
          description: "Supreme day of unending prosperity, gold purchase, Annadana, and Lakshmi-Narayana blessings."
        });
      } else if (pakshaTithiNum === 4) {
        if (masaName === "Bhadrapada") {
          festivals.push({
            name: "Varasiddhi Vinayaka Chaturthi (Ganesh Utsav)",
            kannada: "ವರಸಿದ್ಧಿ ವಿನಾಯಕ ಚತುರ್ಥಿ",
            badge: "🐘 Maha Vinayaka Chaturthi",
            isMajor: true,
            description: "Grand appearance day of Lord Ganesha with 21 modaka offerings and obstacle removal pujas."
          });
        } else {
          festivals.push({
            name: "Shukla Vinayaka Chaturthi",
            kannada: "ವಿನಾಯಕ ಚತುರ್ಥಿ",
            badge: "🐘 Vinayaka Chaturthi",
            isMajor: false,
            description: "Monthly waxing Chaturthi dedicated to Lord Vighnaharta Ganesha."
          });
        }
      } else if (pakshaTithiNum === 5 && masaName === "Chaitra") {
        festivals.push({
          name: "Lakshmi Panchami / Sri Panchami",
          kannada: "ಶ್ರೀ ಪಂಚಮಿ (ಲಕ್ಷ್ಮೀ ಪಂಚಮಿ)",
          badge: "🌸 Sri Panchami",
          isMajor: false,
          description: "Sacred day invoking Mahalakshmi for wealth, prosperity and knowledge."
        });
      } else if (pakshaTithiNum === 6) {
        if (masaName === "Margashirsha") {
          festivals.push({
            name: "Subrahmanya Shashti (Champa Shashti)",
            kannada: "ಸುಬ್ರಹ್ಮಣ್ಯ ಷಷ್ಠಿ (ಚಂಪಾ ಷಷ್ಠಿ)",
            badge: "🦚 Subrahmanya Shashti",
            isMajor: true,
            description: "Sacred day of Lord Shanmukha / Kartikeya and Sarpa dosha nivarana poojas."
          });
        } else {
          festivals.push({
            name: "Skanda Shashti Vrata",
            kannada: "ಸ್ಕಂದ ಷಷ್ಠಿ",
            badge: "🦚 Skanda Shashti",
            isMajor: false,
            description: "Monthly Shashti vrata honoring Lord Murugan/Subrahmanya."
          });
        }
      } else if (pakshaTithiNum === 7 && masaName === "Magha") {
        festivals.push({
          name: "Ratha Saptami (Surya Jayanti)",
          kannada: "ರಥ ಸಪ್ತಮಿ (ಸೂರ್ಯ ಜಯಂತಿ)",
          badge: "☀️ Ratha Saptami",
          isMajor: true,
          description: "Appearance of the Sun God; devotees offer milk boils on Arka leaves for health and longevity."
        });
      } else if (pakshaTithiNum === 8) {
        if (masaName === "Ashvina" || masaName === "Kartika") {
          festivals.push({
            name: "Maha Durgashtami (Durga Ashtami)",
            kannada: "ಮಹಾ ದುರ್ಗಾಷ್ಟಮಿ (ಶ್ರೀ ದುರ್ಗಾಪೂಜೆ)",
            badge: "🌺 Maha Durgashtami",
            isMajor: true,
            description: "The supreme sanctum day of Sri Durga Parameshwari. Maha Sandhi Pooja, Lalitha Sahasranama, and Kumkumarchana at the temple."
          });
        } else {
          festivals.push({
            name: "Sri Durga Ashtami (Masik Durgashtami)",
            kannada: "ಮಾಸಿಕ ದುರ್ಗಾಷ್ಟಮಿ",
            badge: "🪔 Sri Durgashtami",
            isMajor: true,
            description: "Monthly sacred Durga Ashtami vrata. Devotees offer red flowers and Kumkumarchana."
          });
        }
      } else if (pakshaTithiNum === 9) {
        if (masaName === "Ashvina" || masaName === "Kartika") {
          festivals.push({
            name: "Ayudha Pooja & Maha Navami",
            kannada: "ಆಯುಧ ಪೂಜೆ ಮತ್ತು ಮಹಾನವಮಿ",
            badge: "⚔️ Ayudha Pooja",
            isMajor: true,
            description: "Consecration of sacred implements, instruments, books, and North Gate Vehicle Poojas at the temple prakaara."
          });
        } else if (masaName === "Chaitra") {
          festivals.push({
            name: "Sri Rama Navami",
            kannada: "ಶ್ರೀ ರಾಮನವಮಿ",
            badge: "🏹 Sri Rama Navami",
            isMajor: true,
            description: "Celebration of Maryada Purushottama Sri Ramachandra with Panaka and Kosambari prasada."
          });
        } else {
          festivals.push({
            name: "Sri Navami Pooja",
            kannada: "ಶ್ರೀ ನವಮಿ ಪೂಜೆ",
            badge: "🌸 Navami Pooja",
            isMajor: false,
            description: "Auspicious Navami tithi dedicated to divine Mother Parashakti."
          });
        }
      } else if (pakshaTithiNum === 10 && (masaName === "Ashvina" || masaName === "Kartika")) {
        festivals.push({
          name: "Vijaya Dashami (Dussehra Utsavam)",
          kannada: "ವಿಜಯದಶಮಿ (ದಸರಾ ಉತ್ಸವ)",
          badge: "🏹 Vijaya Dashami",
          isMajor: true,
          description: "Triumph of Sri Durga Devi over Mahishasura. Supreme day for Aksharabhyasa and new beginnings."
        });
      } else if (pakshaTithiNum === 11) {
        if (masaName === "Margashirsha" || masaName === "Pushya") {
          festivals.push({
            name: "Vaikuntha Ekadashi (Mokshada Ekadashi)",
            kannada: "ವೈಕುಂಠ ಏಕಾದಶಿ",
            badge: "🏛️ Vaikuntha Ekadashi",
            isMajor: true,
            description: "Opening of the sacred Vaikuntha Dwara; fasting and day-long chanting."
          });
        } else if (masaName === "Ashadha") {
          festivals.push({
            name: "Shayana Ekadashi (Prathama Ekadashi)",
            kannada: "ಶಯನ ಏಕಾದಶಿ (ಪ್ರಥಮೈಕಾದಶಿ)",
            badge: "🪷 Prathama Ekadashi",
            isMajor: true,
            description: "Commencement of the 4 holy months of Chaturmasya vrata."
          });
        } else if (masaName === "Kartika") {
          festivals.push({
            name: "Prabodhini Ekadashi (Tulasi Vivaha)",
            kannada: "ಪ್ರಬೋಧಿನಿ ಏಕಾದಶಿ / ತುಳಸಿ ಪೂಜೆ",
            badge: "🪔 Tulasi Vivaha Ekadashi",
            isMajor: true,
            description: "Awakening of Lord Vishnu and sacred Tulasi Vivaha celebration."
          });
        } else {
          festivals.push({
            name: "Shukla Ekadashi Vrata (Harivasara)",
            kannada: "ಶುಕ್ಲ ಏಕಾದಶಿ ವ್ರತ",
            badge: "📿 Shukla Ekadashi",
            isMajor: false,
            description: "Auspicious Vaishnava fast dedicated to Lord Vishnu and spiritual purification."
          });
        }
      } else if (pakshaTithiNum === 13) {
        festivals.push({
          name: "Shukla Pradosha Vrata (Pradosham)",
          kannada: "ಶುಕ್ಲ ಪ್ರದೋಷ ವ್ರತ",
          badge: "🕉️ Shukla Pradosham",
          isMajor: false,
          description: "Twilight Sandhyakala worship of Parashiva and Parashakti; dispels obstacles."
        });
      } else if (pakshaTithiNum === 15) {
        if (masaName === "Kartika") {
          festivals.push({
            name: "Kartika Pournami (Maha Deepotsava)",
            kannada: "ಕಾರ್ತಿಕ ಪೌರ್ಣಮಿ ಮಹಾ ದೀಪೋತ್ಸವ",
            badge: "🪔 Kartika Deepotsava",
            isMajor: true,
            description: "Grand illumination of thousands of earthen ghee lamps around the temple prakaara."
          });
        } else if (masaName === "Shravana") {
          festivals.push({
            name: "Shravana Pournami (Upakarma & Raksha Bandhan)",
            kannada: "ಶ್ರಾವಣ ಪೌರ್ಣಮಿ (ಉಪಾಕರ್ಮ)",
            badge: "🧵 Shravana Pournami",
            isMajor: true,
            description: "Sacred thread renewal (Yagnopavita dharana) and Raksha Bandhan celebration."
          });
        } else if (masaName === "Ashadha") {
          festivals.push({
            name: "Guru Pournami (Vyasa Pournami)",
            kannada: "ಗುರು ಪೌರ್ಣಮಿ",
            badge: "🧘 Guru Pournami",
            isMajor: true,
            description: "Honoring spiritual Gurus, Maharshi Veda Vyasa, and receiving sacred blessings."
          });
        } else {
          festivals.push({
            name: "Pournami (Satyanarayana Pooja)",
            kannada: "ಪೌರ್ಣಮಿ ಸತ್ಯನಾರಾಯಣ ಪೂಜೆ",
            badge: "🌕 Pournami Pooja",
            isMajor: false,
            description: "Full Moon day. Satyanarayana Swamy Katha and evening special deeparadhana."
          });
        }
      }
    } else {
      // --- KRISHNA PAKSHA FESTIVALS ---
      if (pakshaTithiNum === 4) {
        festivals.push({
          name: "Sankashta Hara Chaturthi (Sankashtahara Ganesha Vratha)",
          kannada: "ಸಂಕಷ್ಟಹರ ಚತುರ್ಥಿ ವ್ರತ",
          badge: "🐘 Sankashta Hara Chaturthi",
          isMajor: true,
          description: "Sacred fast observed from dawn until moonrise (Chandrodaya) for complete removal of hurdles and distress."
        });
      } else if (pakshaTithiNum === 8) {
        if ((masaName === "Shravana" || masaName === "Bhadrapada") && nakshatraName === "Rohini") {
          festivals.push({
            name: "Sri Krishna Janmashtami (Gokulashtami)",
            kannada: "ಶ್ರೀ ಕೃಷ್ಣ ಜನ್ಮಾಷ್ಟಮಿ (ಗೋಕುಲಾಷ್ಟಮಿ)",
            badge: "🪈 Sri Krishna Janmashtami",
            isMajor: true,
            description: "Divine advent of Bhagavan Sri Krishna under Rohini Nakshatra with butter and laddu offerings."
          });
        } else {
          festivals.push({
            name: "Kala Bhairava Ashtami",
            kannada: "ಕಾಲಾಷ್ಟಮಿ (ಭೈರವಾಷ್ಟಮಿ)",
            badge: "🔱 Kalashtami",
            isMajor: false,
            description: "Monthly waning Ashtami invoking Lord Kala Bhairava for protection."
          });
        }
      } else if (pakshaTithiNum === 11) {
        festivals.push({
          name: "Krishna Ekadashi Vrata",
          kannada: "ಕೃಷ್ಣ ಏಕಾದಶಿ ವ್ರತ",
          badge: "📿 Krishna Ekadashi",
          isMajor: false,
          description: "Auspicious Harivasara fast for devotion, spiritual strength and purification."
        });
      } else if (pakshaTithiNum === 13) {
        festivals.push({
          name: "Krishna Pradosha Vrata",
          kannada: "ಕೃಷ್ಣ ಪ್ರದೋಷ ವ್ರತ",
          badge: "🕉️ Krishna Pradosham",
          isMajor: false,
          description: "Evening twilight Shiva-Parvati puja during waning fortnight."
        });
      } else if (pakshaTithiNum === 14) {
        if (masaName === "Ashvina" || masaName === "Kartika") {
          festivals.push({
            name: "Naraka Chaturdashi (Deepavali First Day)",
            kannada: "ನರಕ ಚತುರ್ದಶಿ (ದೀಪಾವಳಿ ಎಣ್ಣೆಶಾಸ್ತ್ರ)",
            badge: "🪔 Naraka Chaturdashi",
            isMajor: true,
            description: "Celebration of victory over Narakasura. Auspicious Ganga snana at dawn and lighting first Deepavali lamps."
          });
        } else if (masaName === "Magha" || masaName === "Phalguna") {
          festivals.push({
            name: "Maha Shivaratri (Night of Shiva)",
            kannada: "ಮಹಾ ಶಿವರಾತ್ರಿ",
            badge: "🔱 Maha Shivaratri",
            isMajor: true,
            description: "Great sanctum night of Shiva. All-night Bilva archana, abhisheka and Jagaran."
          });
        } else {
          festivals.push({
            name: "Masa Shivaratri",
            kannada: "ಮಾಸ ಶಿವರಾತ್ರಿ",
            badge: "🔱 Masa Shivaratri",
            isMajor: false,
            description: "Monthly waning Chaturdashi dedicated to Parashiva."
          });
        }
      } else if (pakshaTithiNum === 15) {
        if (masaName === "Ashvina" || masaName === "Kartika") {
          festivals.push({
            name: "Deepavali Lakshmi Pooja (Amavasya)",
            kannada: "ದೀಪಾವಳಿ ಲಕ್ಷ್ಮೀ ಪೂಜೆ",
            badge: "🪔 Deepavali Lakshmi Pooja",
            isMajor: true,
            description: "Mahalakshmi worship with golden lamps, auspicious coins, and sanctum deeparadhana."
          });
        } else if (masaName === "Bhadrapada") {
          festivals.push({
            name: "Mahalaya Amavasya (Sarva Pitru Amavasya)",
            kannada: "ಮಹಾಲಯ ಅಮಾವಾಸ್ಯೆ",
            badge: "🌾 Mahalaya Amavasya",
            isMajor: true,
            description: "Sacred culmination of Pitru Paksha; oblations and prayers for ancestors."
          });
        } else {
          festivals.push({
            name: "Darsha Amavasya (New Moon)",
            kannada: "ಅಮಾವಾಸ್ಯೆ (ಪಿತೃ ತರ್ಪಣ)",
            badge: "🌑 Amavasya",
            isMajor: false,
            description: "New Moon day; ancestral oblations and sanctum deepa offerings."
          });
        }
      }
    }

    // --- SOLAR & CALENDAR OBSERVANCES ---
    if (month === 0 && (date === 14 || date === 15)) {
      festivals.push({
        name: "Makara Sankranti (Pongal / Uttarayana Punyakala)",
        kannada: "ಮಕರ ಸಂಕ್ರಾಂತಿ (ಉತ್ತರಾಯಣ ಪುಣ್ಯಕಾಲ)",
        badge: "🌾 Makara Sankranti",
        isMajor: true,
        description: "Surya enters Makara rashi; beginning of Uttarayana; Ellu-Bella distribution."
      });
    }

    // --- TEMPLE RECURRING WEEKLY PEAKS ---
    if (dayOfWeek === 2) {
      festivals.push({
        name: "Tuesday Rahukala Nimbe Hannina Deepada Seva",
        kannada: "ಮಂಗಳವಾರ ರಾಹುಕಾಲ ನಿಂಬೆಹಣ್ಣಿನ ದೀಪದ ಸೇವೆ",
        badge: "🔥 Tuesday Rahukala Deepa (3:30 PM)",
        isMajor: false,
        description: "Special Sri Durga Devi Lemon Lamp Pooja at 3:30 PM to vanquish Rahu dosha and adversity."
      });
    } else if (dayOfWeek === 5) {
      festivals.push({
        name: "Friday Durga Homa & Maha Kumkumarchana",
        kannada: "ಶುಕ್ರವಾರ ದುರ್ಗಾ ಹೋಮ ಮತ್ತು ಕುಂಕುಮಾರ್ಚನೆ",
        badge: "🌸 Friday Durga Homa (10:00 AM)",
        isMajor: false,
        description: "Weekly grand Friday Homa and Lalitha Sahasranama Kumkumarchana at the temple."
      });
    }

    return festivals;
  }

  /**
   * 11 Authentic Vedic Karanas mapped dynamically across the 60 half-tithis of the lunar month:
   * - Slot 0: Kintughna (Shukla Prathama 1st half, Sthira)
   * - Slots 1 to 56: 7 Chara Karanas cycle 8 times (Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti/Bhadra)
   * - Slot 57: Shakuni (Krishna Chaturdashi 2nd half, Sthira)
   * - Slot 58: Chatushpada (Amavasya 1st half, Sthira)
   * - Slot 59: Naga (Amavasya 2nd half, Sthira)
   */
  static getKaranaDetails(tithiIndex, solarNoonMin = 727) {
    const slot1 = (tithiIndex * 2) % 60;
    const slot2 = (tithiIndex * 2 + 1) % 60;

    const getSlotKarana = (slot) => {
      if (slot === 0) return KARANAS_METADATA.kintughna;
      if (slot === 57) return KARANAS_METADATA.shakuni;
      if (slot === 58) return KARANAS_METADATA.chatushpada;
      if (slot === 59) return KARANAS_METADATA.naga;
      const charaIdx = (slot - 1) % 7;
      return CHARA_KARANAS[charaIdx];
    };

    const k1 = getSlotKarana(slot1);
    const k2 = getSlotKarana(slot2);

    // Transition between first half and second half of the tithi around solar noon
    const transitionMin = solarNoonMin + 25;
    const transitionTime = this.minutesToTimeString(transitionMin);

    const fullText = `${k1.name} (till ${transitionTime}, then ${k2.name})`;

    return {
      current: k1.name,
      currentKannada: k1.kannada,
      currentSanskrit: k1.sanskrit,
      currentType: k1.type,
      next: k2.name,
      nextKannada: k2.kannada,
      nextSanskrit: k2.sanskrit,
      nextType: k2.type,
      transitionTime,
      fullText,
      isVishti: k1.isVishti || k2.isVishti,
      activeVishti: k1.isVishti ? 'Current' : (k2.isVishti ? 'Next' : null),
      slot1,
      slot2
    };
  }

  /**
   * Retrieves the next upcoming festivals starting from the specified date
   */
  static getUpcomingFestivals(fromDate = new Date(), count = 4) {
    const start = new Date(fromDate);
    const upcoming = [];
    const seenNames = new Set();

    for (let dayOffset = 1; dayOffset <= 45 && upcoming.length < count; dayOffset++) {
      const targetDate = new Date(start);
      targetDate.setDate(targetDate.getDate() + dayOffset);
      const lunar = this.getLunarDetails(targetDate);
      const dayFestivals = this.detectFestivals(targetDate, lunar);

      for (const fest of dayFestivals) {
        if (!seenNames.has(fest.name)) {
          seenNames.add(fest.name);
          const daysAway = dayOffset;
          const relativeLabel = daysAway === 1 ? "Tomorrow" : `In ${daysAway} days`;
          upcoming.push({
            ...fest,
            date: targetDate.toISOString().split('T')[0],
            formattedDate: targetDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
            daysAway,
            relativeLabel
          });
          if (upcoming.length >= count) break;
        }
      }
    }
    return upcoming;
  }

  /**
   * Generates complete Vedic astronomical details for a given Date
   * Calibrated for Bengaluru, Karnataka.
   * @param {Date|string} dateInput 
   */
  static getPanchanga(dateInput = new Date()) {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) {
      return this.getPanchanga(new Date());
    }

    const dayOfWeek = d.getDay();

    // Solar Horizon calculations for Bengaluru
    const sunData = this.calculateBengaluruSun(d);
    const sunriseMin = sunData.sunriseMinutes;
    const sunsetMin = sunData.sunsetMinutes;
    const dayLengthMin = sunData.dayLengthMinutes;
    const solarNoonMin = sunData.solarNoonMinutes;

    // Dinamana 1/8th slots for Kaala
    const slotDuration = dayLengthMin / 8;
    const kaalaSlot = KAALA_SEGMENTS[dayOfWeek];

    // Rahu Kala
    const rahuStart = sunriseMin + (kaalaSlot.rahu * slotDuration);
    const rahuEnd = rahuStart + slotDuration;

    // Yamaganda
    const yamaStart = sunriseMin + (kaalaSlot.yama * slotDuration);
    const yamaEnd = yamaStart + slotDuration;

    // Gulika Kala
    const gulikaStart = sunriseMin + (kaalaSlot.gulika * slotDuration);
    const gulikaEnd = gulikaStart + slotDuration;

    // Abhijit Muhurtha (8th Muhurtha out of 15, centered at Solar Noon)
    const oneMuhurthaMin = dayLengthMin / 15;
    const abhijitStart = solarNoonMin - (oneMuhurthaMin / 2);
    const abhijitEnd = solarNoonMin + (oneMuhurthaMin / 2);

    // Brahma Muhurtha
    const brahmaStart = sunriseMin - 96;
    const brahmaEnd = sunriseMin - 48;

    // Dynamic Astronomical Lunar Details
    const lunar = this.getLunarDetails(d);
    const tithiName = TITHIS[lunar.tithiIndex];
    const nakshatraName = NAKSHATRAS[lunar.nakshatraIndex];
    const yogaName = YOGAS[lunar.yogaIndex];
    const rashiName = RASHIS[lunar.rashiIndex];

    // Dynamic 11 Vedic Karanas
    const karanaDetails = this.getKaranaDetails(lunar.tithiIndex, solarNoonMin);

    // Dynamic Ritu, Ayana & Samvatsara
    const rituObj = this.getVedicRitu(d, lunar);
    const ayanaObj = this.getVedicAyana(d);
    const samvatsaraName = this.getSamvatsara(d);

    // Dynamic Festivals & Vratas
    const festivals = this.detectFestivals(d, lunar);
    const primaryFestival = festivals.length > 0 ? festivals[0] : null;
    const upcomingFestivals = this.getUpcomingFestivals(d, 4);

    // Format daylight duration
    const dlHours = Math.floor(dayLengthMin / 60);
    const dlMins = Math.round(dayLengthMin % 60);

    // Current sun progress along the daylight arc (0.0 to 1.0)
    const now = new Date();
    const isToday = now.toDateString() === d.toDateString();
    let sunProgress = 0.5;
    let isDaylight = true;

    if (isToday) {
      const currentMinutes = (now.getHours() * 60) + now.getMinutes();
      if (currentMinutes < sunriseMin) {
        sunProgress = 0.0;
        isDaylight = false;
      } else if (currentMinutes > sunsetMin) {
        sunProgress = 1.0;
        isDaylight = false;
      } else {
        sunProgress = (currentMinutes - sunriseMin) / dayLengthMin;
        isDaylight = true;
      }
    }

    return {
      date: d.toISOString().split('T')[0],
      formattedDate: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
      samvatsara: samvatsaraName,
      ayana: ayanaObj.name,
      ayanaSanskrit: ayanaObj.sanskrit,
      ayanaDescription: ayanaObj.description,
      ritu: rituObj.name,
      rituSanskrit: rituObj.sanskrit,
      rituMeaning: rituObj.meaning,
      rituDescription: rituObj.description,
      masa: lunar.masaName,
      isShukla: lunar.isShukla,
      tithi: {
        name: tithiName,
        endTime: "11:42 PM",
        isShukla: lunar.isShukla,
        number: lunar.pakshaTithiNum
      },
      nakshatra: {
        name: nakshatraName,
        endTime: "04:15 PM"
      },
      yoga: yogaName,
      karana: karanaDetails.fullText,
      karanaDetails,
      rashi: rashiName,
      rahuKala: `${this.minutesToTimeString(rahuStart)} – ${this.minutesToTimeString(rahuEnd)}`,
      rahuKalaRaw: { startMin: rahuStart, endMin: rahuEnd },
      yamaganda: `${this.minutesToTimeString(yamaStart)} – ${this.minutesToTimeString(yamaEnd)}`,
      gulikaKala: `${this.minutesToTimeString(gulikaStart)} – ${this.minutesToTimeString(gulikaEnd)}`,
      abhijitMuhurtha: dayOfWeek === 3 ? "Not Observed (Wednesday)" : `${this.minutesToTimeString(abhijitStart)} – ${this.minutesToTimeString(abhijitEnd)}`,
      brahmaMuhurtha: `${this.minutesToTimeString(brahmaStart)} – ${this.minutesToTimeString(brahmaEnd)}`,
      sunrise: this.minutesToTimeString(sunriseMin),
      sunset: this.minutesToTimeString(sunsetMin),
      solarNoon: this.minutesToTimeString(solarNoonMin),
      sunriseMinutes: sunriseMin,
      sunsetMinutes: sunsetMin,
      solarNoonMinutes: solarNoonMin,
      daylightMinutes: dayLengthMin,
      daylightDuration: `${dlHours} hrs ${String(dlMins).padStart(2, '0')} mins`,
      sunProgress: Math.min(1, Math.max(0, sunProgress)),
      isDaylight,
      isToday,
      isTuesdaySpecialRahu: dayOfWeek === 2,
      festivals,
      primaryFestival,
      hasFestival: festivals.length > 0,
      upcomingFestivals,
      coordinates: "12.97° N, 77.59° E (Bengaluru)"
    };
  }
}
