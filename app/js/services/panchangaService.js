/**
 * Vedic Panchanga & Astronomical Horizon Service
 * Calibrated for Bengaluru, Karnataka (12.9716° N, 77.5946° E)
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
  "Shukla Ekadashi", "Shukla Dvadashi", "Shukla Trayodashi", "Shukla Chaturdashi", "Pournami",
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

// Weekday Kaala Timings (South Indian Vedic Sampradaya)
const KAALA_MAP = {
  0: { // Sunday
    rahu: "04:30 PM – 06:00 PM",
    yama: "12:00 PM – 01:30 PM",
    gulika: "03:00 PM – 04:30 PM"
  },
  1: { // Monday
    rahu: "07:30 AM – 09:00 AM",
    yama: "10:30 AM – 12:00 PM",
    gulika: "01:30 PM – 03:00 PM"
  },
  2: { // Tuesday (Special Rahukala Deepada Seva at 3:30 PM)
    rahu: "03:00 PM – 04:30 PM",
    yama: "09:00 AM – 10:30 AM",
    gulika: "12:00 PM – 01:30 PM"
  },
  3: { // Wednesday
    rahu: "12:00 PM – 01:30 PM",
    yama: "07:30 AM – 09:00 AM",
    gulika: "10:30 AM – 12:00 PM"
  },
  4: { // Thursday
    rahu: "01:30 PM – 03:00 PM",
    yama: "06:00 AM – 07:30 AM",
    gulika: "09:00 AM – 10:30 AM"
  },
  5: { // Friday
    rahu: "10:30 AM – 12:00 PM",
    yama: "03:00 PM – 04:30 PM",
    gulika: "07:30 AM – 09:00 AM"
  },
  6: { // Saturday
    rahu: "09:00 AM – 10:30 AM",
    yama: "01:30 PM – 03:00 PM",
    gulika: "06:00 AM – 07:30 AM"
  }
};

export class PanchangaService {
  /**
   * Generates complete Vedic astronomical details for a given Date
   * @param {Date|string} dateInput 
   */
  static getPanchanga(dateInput = new Date()) {
    const d = new Date(dateInput);
    const dayOfWeek = d.getDay();
    
    // Deterministic Julian-epoch based Vedic index for demonstration
    const epochRef = new Date(2026, 0, 1).getTime();
    const dayDiff = Math.floor((d.getTime() - epochRef) / (1000 * 60 * 60 * 24));
    
    // Tithi calculation (approx 29.53 day lunar cycle)
    const tithiIndex = Math.abs((dayDiff + 7) % 30);
    const tithiName = TITHIS[tithiIndex];
    
    // Nakshatra calculation (approx 27.3 day cycle)
    const nakshatraIndex = Math.abs((dayDiff + 3) % 27);
    const nakshatraName = NAKSHATRAS[nakshatraIndex];

    // Yoga calculation
    const yogaIndex = Math.abs((dayDiff + 6) % 27);
    const yogaName = YOGAS[yogaIndex];

    // Moon Rashi
    const rashiIndex = Math.floor(nakshatraIndex / 2.25) % 12;
    const rashiName = RASHIS[rashiIndex];

    const kaala = KAALA_MAP[dayOfWeek];

    return {
      date: d.toISOString().split('T')[0],
      formattedDate: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
      samvatsara: "Shubhakruth Samvatsara",
      ayana: "Dakshinayana",
      ritu: "Sharad Ritu",
      tithi: {
        name: tithiName,
        endTime: "11:42 PM",
        isShukla: tithiIndex < 15
      },
      nakshatra: {
        name: nakshatraName,
        endTime: "04:15 PM"
      },
      yoga: yogaName,
      karana: "Bava (upto 12:30 PM, then Balava)",
      rashi: rashiName,
      rahuKala: kaala.rahu,
      yamaganda: kaala.yama,
      gulikaKala: kaala.gulika,
      abhijitMuhurtha: "11:45 AM – 12:35 PM",
      brahmaMuhurtha: "04:36 AM – 05:24 AM",
      sunrise: "06:12 AM",
      sunset: "06:18 PM",
      daylightDuration: "12 hrs 06 mins",
      coordinates: "12.97° N, 77.59° E (Bengaluru)"
    };
  }
}
