/**
 * Sri Durga Parameshwari Temple, Chandra Layout, Bengaluru
 * Authentic Darshan & Aarti Schedules
 */

export const TEMPLE_TIMINGS = {
  // Day of week (0 = Sunday, 1 = Monday, 2 = Tuesday, etc.)
  schedules: {
    0: {
      dayName: "Sunday (ಭಾನುವಾರ)",
      morning: { open: "06:30 AM", close: "11:30 AM" },
      evening: { open: "05:30 PM", close: "08:30 PM" },
      specialEvents: ["Special Weekend Darshan & Abhisheka"]
    },
    1: {
      dayName: "Monday (ಸೋಮವಾರ)",
      morning: { open: "06:30 AM", close: "11:30 AM" },
      evening: { open: "05:30 PM", close: "08:30 PM" },
      specialEvents: ["Rudrabhisheka to Shiva-Durga at 8:30 AM"]
    },
    2: {
      dayName: "Tuesday (ಮಂಗಳವಾರ)",
      morning: { open: "06:30 AM", close: "12:30 PM" },
      evening: { open: "03:30 PM", close: "08:30 PM" },
      specialEvents: [
        "Special Tuesday Rahukala Deepada Seva at 03:30 PM sharp",
        "Extended morning Darshan till 12:30 PM"
      ]
    },
    3: {
      dayName: "Wednesday (ಬುಧವಾರ)",
      morning: { open: "06:30 AM", close: "11:30 AM" },
      evening: { open: "05:30 PM", close: "08:30 PM" },
      specialEvents: ["Regular Darshan & Kumkumarchana"]
    },
    4: {
      dayName: "Thursday (ಗುರುವಾರ)",
      morning: { open: "06:30 AM", close: "11:30 AM" },
      evening: { open: "05:30 PM", close: "08:30 PM" },
      specialEvents: ["Navagraha and Guru Sannidhi Aradhana"]
    },
    5: {
      dayName: "Friday (ಶುಕ್ರವಾರ)",
      morning: { open: "06:30 AM", close: "02:00 PM" },
      evening: { open: "05:30 PM", close: "08:30 PM" },
      specialEvents: [
        "Grand Sri Durga Homa at 10:00 AM sharp",
        "Continuous Friday Darshan till 02:00 PM",
        "Suvasini Pooja & Special Sahasranama Archana"
      ]
    },
    6: {
      dayName: "Saturday (ಶನಿವಾರ)",
      morning: { open: "06:30 AM", close: "11:30 AM" },
      evening: { open: "05:30 PM", close: "08:30 PM" },
      specialEvents: ["Navagraha Shanti Pooja & Tailabhisheka"]
    }
  },

  aartiTimings: [
    { time: "07:00 AM", name: "Pratah Kaala Ushas Aarti & Suprabhata", significance: "Morning sanctum opening" },
    { time: "09:30 AM", name: "Maha Naivedya Darshan", significance: "Sacred cooked food offering" },
    { time: "11:30 AM / 12:00 PM", name: "Madhyahna Maha Mangalarathi", significance: "Midday culmination aarti" },
    { time: "07:30 PM", name: "Sandhya Deepotsava & Maha Mangalarathi", significance: "Grand evening camphor aarti" }
  ],

  vehiclePoojaTimings: {
    morning: "09:00 AM – 11:00 AM",
    evening: "06:00 PM – 08:00 PM",
    location: "North Gate Prakaara Entrance"
  },

  contactInfo: {
    templeName: "Sri Durga Parameshwari Temple",
    address: "Chandra Layout 1st Phase, Bengaluru, Karnataka - 560072",
    phone: "080-23394447",
    whatsappDesk: "+91 98450 12345",
    instagram: "@durgaparameshwari_devasthaana"
  }
};
