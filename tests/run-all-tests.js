/**
 * Sri Durga Devi Temple — Automated Verification & Business Rule Tests
 * Tests Date Availability Precedence, Vedic Panchanga, and WhatsApp Generator
 */

import assert from 'assert';

// Mock localStorage and browser globals for Node.js test environment
const mockStorage = new Map();
global.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear()
};

global.sessionStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear()
};

global.window = {
  location: { hash: '#home', pathname: '/durga/', href: 'https://localhost/durga/', origin: 'https://localhost' },
  matchMedia: () => ({ matches: false }),
  addEventListener: () => {}
};
try {
  Object.defineProperty(global, 'navigator', {
    value: { userAgent: 'NodeTestRunner', mediaDevices: null, standalone: false },
    configurable: true,
    writable: true
  });
} catch (e) {
  // Ignore if existing
}
global.document = { referrer: '', getElementById: () => null, querySelectorAll: () => [] };

// Import modules under test
const { SEVAS_DATA } = await import('../app/js/data/sevas.js');
const { TEMPLE_TIMINGS } = await import('../app/js/data/timings.js');
const { templeStore } = await import('../app/js/services/store.js');
const { PanchangaService } = await import('../app/js/services/panchangaService.js');
const { AvailabilityEngine } = await import('../app/js/services/availabilityEngine.js');
const { WhatsAppService } = await import('../app/js/services/whatsappService.js');
const { streamingService, STREAM_STATUS, SOURCE_TYPE } = await import('../app/js/services/streamingService.js');
const { analyticsService, ANALYTICS_EVENT, PLATFORM_TYPE } = await import('../app/js/services/analyticsService.js');
const { pushNotificationService, NOTIFICATION_CATEGORY } = await import('../app/js/services/pushNotificationService.js');

let passCount = 0;
let failCount = 0;
let testQueue = Promise.resolve();

function test(description, fn) {
  testQueue = testQueue.then(async () => {
    try {
      await fn();
      console.log(`  ✓ PASS: ${description}`);
      passCount++;
    } catch (err) {
      console.error(`  ✕ FAIL: ${description}`);
      console.error(`    ${err.message}`);
      failCount++;
    }
  });
}

console.log("\n============================================================");
console.log("SRI DURGA DEVI TEMPLE — DIGITAL MANDAPA TEST SUITE");
console.log("============================================================\n");

// --- SUITE 1: AUTHENTIC TEMPLE DATA FIDELITY ---
console.log("Suite 1: Authentic Temple Data Fidelity");

test("Sevas catalog contains exactly 21 authentic sevas", () => {
  assert.strictEqual(SEVAS_DATA.length, 21);
});

test("Durga Homa is ₹1,501 and restricted strictly to Friday (day 5)", () => {
  const homa = SEVAS_DATA.find(s => s.id === 'durga-homa');
  assert.ok(homa, "Durga Homa exists");
  assert.strictEqual(homa.kanike, 1501);
  assert.deepStrictEqual(homa.allowedDays, [5]);
});

test("Tuesday Rahukala Deepada Seva is ₹101 and restricted strictly to Tuesday (day 2)", () => {
  const deepa = SEVAS_DATA.find(s => s.id === 'rahukala-deepa');
  assert.ok(deepa, "Rahukala Deepada Seva exists");
  assert.strictEqual(deepa.kanike, 101);
  assert.deepStrictEqual(deepa.allowedDays, [2]);
});

test("Temple phone is 080-23394447 in Chandra Layout", () => {
  assert.strictEqual(TEMPLE_TIMINGS.contactInfo.phone, "080-23394447");
  assert.ok(TEMPLE_TIMINGS.contactInfo.address.includes("Chandra Layout 1st Phase"));
});

// --- SUITE 2: DATE AVAILABILITY & ADMIN PRECEDENCE ENGINE ---
console.log("\nSuite 2: Date Availability & Rule Precedence Engine");

test("Rule 1 Precedence: Admin Block on 15 Oct 2026 overrides everything", () => {
  // Ensure default admin block exists
  const res = AvailabilityEngine.checkAvailability('2026-10-15', 'durga-homa');
  assert.strictEqual(res.isAvailable, false);
  assert.strictEqual(res.status, 'BLOCKED');
  assert.strictEqual(res.reasonTitle, 'Navaratri Chandi Homa');
  assert.ok(res.publicNotice.includes('Sanctum fully reserved'));
  assert.ok(res.recommendedAlternatives.length > 0, "Provides alternative recommendations");
});

test("Rule 2 Precedence: Seva Day Constraint fails Durga Homa on a non-Friday", () => {
  // 2026-10-14 is a Wednesday
  const res = AvailabilityEngine.checkAvailability('2026-10-14', 'durga-homa');
  assert.strictEqual(res.isAvailable, false);
  assert.strictEqual(res.status, 'DAY_MISMATCH');
  assert.ok(res.publicNotice.includes('Friday'));
  // Alternatives should all be Fridays
  res.recommendedAlternatives.forEach(alt => {
    const d = new Date(alt.date + "T00:00:00");
    assert.strictEqual(d.getDay(), 5, `Alternative ${alt.date} must be a Friday`);
  });
});

test("Rule 3: Non-blocked valid Friday (24 Oct 2026) is AVAILABLE for Durga Homa", () => {
  // 2026-10-24 is a Friday or Saturday depending on year, let's verify Friday
  const fri = '2026-10-23'; // 23 Oct 2026 is a Friday
  const d = new Date(fri + "T00:00:00");
  assert.strictEqual(d.getDay(), 5, "23 Oct 2026 is Friday");
  const res = AvailabilityEngine.checkAvailability(fri, 'durga-homa');
  assert.strictEqual(res.isAvailable, true);
  assert.strictEqual(res.status, 'AVAILABLE');
});

// --- SUITE 3: VEDIC PANCHANGA & HORIZON ENGINE ---
console.log("\nSuite 3: Vedic Panchanga & Astronomical Horizon Engine");

test("Panchanga returns complete 5 limbs for Bengaluru coordinates", () => {
  const p = PanchangaService.getPanchanga(new Date(2026, 9, 6)); // Tuesday 06 Oct 2026
  assert.ok(p.tithi && p.tithi.name, "Tithi exists");
  assert.ok(p.nakshatra && p.nakshatra.name, "Nakshatra exists");
  assert.ok(p.yoga, "Yoga exists");
  assert.ok(p.karana, "Karana exists");
  assert.ok(p.rashi, "Rashi exists");
  assert.strictEqual(p.coordinates, "12.97° N, 77.59° E (Bengaluru)");
});

test("Paksha & Masa Engine: Accurately displays both Masa and Paksha with Kannada equivalents", () => {
  const p = PanchangaService.getPanchanga(new Date(2026, 9, 6)); // 06 Oct 2026 (Krishna Ekadashi)
  assert.strictEqual(p.masa, "Bhadrapada");
  assert.strictEqual(p.paksha, "Krishna Paksha");
  assert.strictEqual(p.pakshaKannada, "ಕೃಷ್ಣ ಪಕ್ಷ");
  assert.strictEqual(p.masaPaksha, "Bhadrapada Masa • Krishna Paksha");
  assert.ok(p.masaPakshaKannada.includes("ಕೃಷ್ಣ ಪಕ್ಷ"));

  // Check Shukla Paksha date (e.g. 15 Oct 2026)
  const pShukla = PanchangaService.getPanchanga(new Date(2026, 9, 15));
  assert.strictEqual(pShukla.paksha, "Shukla Paksha");
  assert.strictEqual(pShukla.pakshaKannada, "ಶುಕ್ಲ ಪಕ್ಷ");
});

test("Fix Underline 1: 28 Dec 2026 dynamically calculates Hemanta Ritu & Dakshinayana", () => {
  const dec28 = new Date(2026, 11, 28); // 28 Dec 2026
  const p = PanchangaService.getPanchanga(dec28);
  assert.strictEqual(p.ritu, "Hemanta Ritu", "December 28 is Hemanta Ritu");
  assert.strictEqual(p.ayana, "Dakshinayana", "December 28 is Dakshinayana");
});

test("Fix Underline 2: Abhijit Muhurtha and Rahu Kala are dynamically derived from Solar coordinates", () => {
  const tuesday = new Date(2026, 9, 6); // Tuesday
  const p = PanchangaService.getPanchanga(tuesday);
  assert.strictEqual(p.isTuesdaySpecialRahu, true, "Flags Tuesday special Rahu Pooja");
  // Rahu Kala on Tuesday afternoon covers the temple's 3:30 PM Nimbe Deepa window
  assert.ok(p.rahuKala.includes("PM"), "Tuesday Rahu Kala is in the afternoon");
  assert.ok(p.abhijitMuhurtha.includes("11:") || p.abhijitMuhurtha.includes("12:"), "Abhijit Muhurtha is centered at Solar Noon");
});

test("Fix Underline 3: Solar horizon computes dynamic Bengaluru winter sunrise (06:40 AM) & sunset (06:01 PM) on Dec 28", () => {
  const dec28 = new Date(2026, 11, 28);
  const p = PanchangaService.getPanchanga(dec28);
  assert.ok(p.sunrise === "06:39 AM" || p.sunrise === "06:40 AM", "Bengaluru sunrise on Dec 28 is ~06:40 AM");
  assert.ok(p.sunset === "06:01 PM" || p.sunset === "06:02 PM", "Bengaluru sunset on Dec 28 is ~06:01 PM");
  assert.ok(p.daylightDuration.includes("11 hrs"), "Bengaluru daylight on Dec 28 is ~11 hrs 21 mins");
});

test("Saturday, 13 Mar 2027: Dynamically calculates Paraabhava Samvatsara & Uttarayana", () => {
  const mar13 = new Date(2027, 2, 13); // 13 Mar 2027
  const p = PanchangaService.getPanchanga(mar13);
  assert.strictEqual(p.samvatsara, "Paraabhava Samvatsara", "March 13, 2027 is Paraabhava Samvatsara prior to Ugadi");
  assert.strictEqual(p.ayana, "Uttarayana", "March 13, 2027 is in Uttarayana");
  // After Ugadi in April 2027, it transitions to Plavanga
  const apr15 = new Date(2027, 3, 15);
  const pApr = PanchangaService.getPanchanga(apr15);
  assert.strictEqual(pApr.samvatsara, "Plavanga Samvatsara", "After Ugadi 2027 it becomes Plavanga Samvatsara");
});

test("Festival Detection Engine identifies authentic festivals based on Tithi & Masa", () => {
  // Durgashtami
  const ashtami = PanchangaService.getPanchanga(new Date(2026, 9, 19));
  assert.ok(ashtami.festivals.some(f => f.name.includes("Durgashtami")), "Detects Durgashtami");

  // Ayudha Pooja
  const navami = PanchangaService.getPanchanga(new Date(2026, 9, 20));
  assert.ok(navami.festivals.some(f => f.name.includes("Ayudha Pooja")), "Detects Ayudha Pooja");

  // Sankashta Hara Chaturthi (Krishna Chaturthi)
  const chaturthi = PanchangaService.getPanchanga(new Date(2026, 9, 29));
  assert.ok(chaturthi.festivals.some(f => f.name.includes("Sankashta Hara Chaturthi")), "Detects Sankashta Hara Chaturthi");

  // Naraka Chaturdashi (Krishna Chaturdashi on Nov 8, 2026)
  const deepavali = PanchangaService.getPanchanga(new Date(2026, 10, 8));
  assert.ok(deepavali.festivals.some(f => f.name.includes("Naraka Chaturdashi")), "Detects Naraka Chaturdashi");

  // Swarna Gowri Vratha (Sept 14, 2026 - Bhadrapada Shukla Tritiya)
  const gowriDay = PanchangaService.getPanchanga(new Date(2026, 8, 14)); // Month 8 = September
  assert.strictEqual(gowriDay.masa, "Bhadrapada", "Sept 14, 2026 is Bhadrapada Masa");
  assert.strictEqual(gowriDay.paksha, "Shukla Paksha", "Sept 14, 2026 is Shukla Paksha");
  assert.ok(gowriDay.festivals.some(f => f.name.includes("Swarna Gowri Vratha")), "Detects Swarna Gowri Vratha on Sept 14, 2026");

  // Ganesha Chaturthi (Sept 15, 2026 - Bhadrapada Shukla Chaturthi)
  const ganeshaDay = PanchangaService.getPanchanga(new Date(2026, 8, 15));
  assert.strictEqual(ganeshaDay.masa, "Bhadrapada", "Sept 15, 2026 is Bhadrapada Masa");
  assert.ok(ganeshaDay.festivals.some(f => f.name.includes("Ganesha Chaturthi")), "Detects Ganesha Chaturthi on Sept 15, 2026");
});

test("Dynamic 11 Vedic Karanas: Advances across days and cycles through half-tithis", () => {
  const p1 = PanchangaService.getPanchanga(new Date(2026, 9, 6)); // Tuesday
  const p2 = PanchangaService.getPanchanga(new Date(2026, 9, 7)); // Wednesday
  const p3 = PanchangaService.getPanchanga(new Date(2026, 9, 8)); // Thursday

  assert.ok(p1.karanaDetails, "KaranaDetails exists for Day 1");
  assert.ok(p2.karanaDetails, "KaranaDetails exists for Day 2");
  assert.ok(p3.karanaDetails, "KaranaDetails exists for Day 3");

  // Karana changes from day to day
  assert.notStrictEqual(p1.karanaDetails.current, p2.karanaDetails.current, "Karana changes between Day 1 and Day 2");
  assert.notStrictEqual(p2.karanaDetails.current, p3.karanaDetails.current, "Karana changes between Day 2 and Day 3");

  // Verify transition format
  assert.ok(p1.karana.includes("till"), "Karana string includes half-tithi transition");
  assert.ok(p1.karanaDetails.next, "KaranaDetails includes next Karana");
});

test("Authentic Sthira & Chara Karana mapping: Kintughna, Shakuni, Naga & Vishti (Bhadra)", () => {
  // Slot 0 (Shukla Prathama 1st half) must be Kintughna
  const k0 = PanchangaService.getKaranaDetails(0);
  assert.strictEqual(k0.current, "Kintughna", "Slot 0 is Kintughna (Sthira)");
  assert.strictEqual(k0.next, "Bava", "Slot 1 is Bava (Chara)");

  // Krishna Chaturdashi (tithi index 28: slots 56, 57)
  const k28 = PanchangaService.getKaranaDetails(28);
  assert.strictEqual(k28.current, "Vishti (Bhadra)", "Slot 56 is Vishti (Bhadra)");
  assert.strictEqual(k28.isVishti, true, "Vishti flags isVishti as true");
  assert.strictEqual(k28.next, "Shakuni", "Slot 57 is Shakuni (Sthira)");

  // Amavasya (tithi index 29: slots 58, 59)
  const k29 = PanchangaService.getKaranaDetails(29);
  assert.strictEqual(k29.current, "Chatushpada", "Slot 58 is Chatushpada (Sthira)");
  assert.strictEqual(k29.next, "Naga", "Slot 59 is Naga (Sthira)");
});

test("Upcoming Festivals Engine: Returns next scheduled festivals with relative countdown labels", () => {
  const upcoming = PanchangaService.getUpcomingFestivals(new Date(2026, 9, 6), 4);
  assert.ok(Array.isArray(upcoming), "Returns array of upcoming festivals");
  assert.strictEqual(upcoming.length, 4, "Returns 4 upcoming festivals");
  assert.ok(upcoming[0].daysAway >= 1, "Days away is in future");
  assert.ok(upcoming[0].relativeLabel.includes("days") || upcoming[0].relativeLabel.includes("Tomorrow"), "Has relative label");
});

test("Monthly View Calendar Engine: Generates full 30 days of November 2026 with Tithi, Paksha, and Festivals", () => {
  const novData = PanchangaService.getMonthDays(2026, 10); // Nov 2026 (month 10)
  assert.strictEqual(novData.daysInMonth, 30, "November has 30 days");
  assert.strictEqual(novData.firstDayOfWeek, 0, "1 Nov 2026 is Sunday (day 0)");
  assert.strictEqual(novData.days.length, 30, "Returns exactly 30 day objects");

  // Day 16 (Monday, 16 Nov 2026 - from user's screenshot)
  const day16 = novData.days[15];
  assert.strictEqual(day16.dayNum, 16);
  assert.strictEqual(day16.tithiName, "Shukla Saptami");
  assert.strictEqual(day16.pakshaShort, "Shukla");
  assert.strictEqual(day16.dateStr, "2026-11-16");

  // Day 24 (Kartika Pournami)
  const day24 = novData.days[23];
  assert.strictEqual(day24.isPournami, true, "Nov 24 is Pournami");

  // Month summary
  assert.strictEqual(novData.summary.masa, "Kartika", "November is Kartika Masa");
  assert.strictEqual(novData.summary.ayana, "Dakshinayana", "November is Dakshinayana");
  assert.ok(novData.festivalsInMonth.length > 0, "Finds festivals in November");
});

// --- SUITE 4: WHATSAPP DEEP-LINK & TOKEN GENERATOR ---
console.log("\nSuite 4: WhatsApp Deep-Link & Token Generator");

test("Devotee booking token matches SDD-YYYY-MMDD-XXX format", () => {
  const token = WhatsAppService.generateToken("2026-10-24");
  const regex = /^SDD-2026-1024-\d{3}$/;
  assert.ok(regex.test(token), `Token ${token} matches SDD format`);
});

test("WhatsApp booking deep link produces valid URL with encoded params", () => {
  const booking = {
    tokenId: "SDD-2026-1024-042",
    sevaName: "Durga Homa",
    date: "2026-10-24",
    timeSlot: "10:00 AM – 12:30 PM",
    devoteeName: "Suresh Kumar",
    mobile: "+91 98450 12345",
    gothra: "Kashyapa",
    rashi: "Vrishabha",
    nakshatra: "Rohini",
    sankalpa: ["Ayushya & Health"],
    contribution: 1501
  };

  const { messageText, url } = WhatsAppService.createBookingLink(booking);
  assert.ok(url.startsWith("https://wa.me/919845012345?text="));
  assert.ok(url.includes("SDD-2026-1024-042"));
  assert.ok(url.includes(encodeURIComponent("Suresh Kumar")));
  assert.ok(messageText.includes("Durga Homa (₹1501)"));
});

// --- SUITE 5: ADMINISTRATIVE DESK SYNCHRONIZATION ---
console.log("\nSuite 5: Administrative Desk Synchronization");

test("Adding an admin block immediately blocks the date in Availability Engine", () => {
  const newDate = "2026-11-12";
  templeStore.addBlockedDate({
    id: "block-test-1",
    date: newDate,
    reasonType: "MANUAL",
    reasonTitle: "Temple Brahmotsava Utsavam",
    publicNotice: "Sanctum closed for special annual utsavam.",
    suggestedAlternatives: ["2026-11-13"]
  });

  const check = AvailabilityEngine.checkAvailability(newDate, 'panchamrutha-abhisheka');
  assert.strictEqual(check.isAvailable, false);
  assert.strictEqual(check.status, 'BLOCKED');
  assert.strictEqual(check.reasonTitle, 'Temple Brahmotsava Utsavam');

  // Clean up
  templeStore.removeBlockedDate("block-test-1");
  const checkAfter = AvailabilityEngine.checkAvailability(newDate, 'panchamrutha-abhisheka');
  assert.strictEqual(checkAfter.isAvailable, true, "Date is unblocked after deletion");
});

// --- SUITE 6: FESTIVAL & EVENTS CMS & SHARANNAVARATRI DATA FIDELITY ---
console.log("\nSuite 6: Festival & Events CMS & Sharannavaratri Mahotsava Fidelity");

test("Authentic Sharannavaratri 2026 event exists with 10 days of Alankaras & 13 special sevas", () => {
  const events = templeStore.getEvents();
  assert.ok(events.length >= 1, "At least one CMS event exists");
  const nav = events.find(e => e.id === "navaratri-utsava-2026");
  assert.ok(nav, "Sharannavaratri Mahotsava event exists");
  assert.strictEqual(nav.startDate, "2026-10-11");
  assert.strictEqual(nav.endDate, "2026-10-20");
  assert.strictEqual(nav.dailySchedule.length, 10, "Has exactly 10 days of Alankara & Homa schedule");
  assert.strictEqual(nav.specialSevas.length, 13, "Has exactly 13 special Navaratri sevas");
  assert.ok(nav.primaryImage.includes("navaratri-invitation.jpg"), "References authentic invitation card");
  assert.ok(nav.grandFinale.includes("ರಥೋತ್ಸವ"), "Includes Vijayadashami Rathotsava notice");
});

test("CMS allows creating, saving with image and deleting new events", () => {
  const newEvent = {
    id: "deepavali-2026",
    title: "Deepavali Lakshmi Pooja 2026",
    kannadaTitle: "ದೀಪಾವಳಿ ಲಕ್ಷ್ಮೀ ಪೂಜೆ - ೨೦೨೬",
    startDate: "2026-11-08",
    endDate: "2026-11-10",
    isPublished: true,
    primaryImage: "data:image/jpeg;base64,TESTIMAGE",
    highlights: "Special Ksheera Abhisheka & Sahasra Deepotsava"
  };

  templeStore.saveEvent(newEvent);
  const found = templeStore.getEventById("deepavali-2026");
  assert.ok(found, "Newly created event found in store");
  assert.strictEqual(found.primaryImage, "data:image/jpeg;base64,TESTIMAGE", "Preserves image base64 data");

  // Clean up
  templeStore.deleteEvent("deepavali-2026");
  assert.strictEqual(templeStore.getEventById("deepavali-2026"), undefined, "Event deleted successfully");
});

// --- SUITE 7: COMPLETE TEMPLE CMS (WHATSAPP, PRIESTS, GALLERY, NOTIFICATIONS) ---
console.log("\nSuite 7: Complete Temple CMS (WhatsApp, Archakas, Gallery, Notifications)");

test("CMS Contact Config updates temple WhatsApp number and dynamically affects WhatsAppService", () => {
  const origConfig = templeStore.getContactConfig();
  assert.strictEqual(origConfig.whatsappPhone, "919845012345");
  assert.strictEqual(WhatsAppService.getWhatsAppPhone(), "919845012345");

  // Admin updates WhatsApp number
  templeStore.updateContactConfig({
    whatsappPhone: "919888877777",
    whatsappDisplay: "+91 98888 77777"
  });

  assert.strictEqual(templeStore.getContactConfig().whatsappPhone, "919888877777");
  assert.strictEqual(WhatsAppService.getWhatsAppPhone(), "919888877777", "WhatsAppService dynamically reads updated number");

  // Deep links must now target new number
  const inquiryUrl = WhatsAppService.generateSevaInquiryUrl({ name: "Durga Homa", kanike: 1501 });
  assert.ok(inquiryUrl.includes("wa.me/919888877777"), "Inquiry URL uses updated WhatsApp number");

  // Restore original
  templeStore.updateContactConfig({
    whatsappPhone: "919845012345",
    whatsappDisplay: "+91 98450 12345"
  });
  assert.strictEqual(WhatsAppService.getWhatsAppPhone(), "919845012345");
});

test("CMS Priests & Archakas allows adding, toggling status, and removing priests", () => {
  const initialPriests = templeStore.getPriests();
  assert.ok(initialPriests.length >= 4, "Default authentic archakas seeded");

  const newPriest = {
    id: "archaka-test-1",
    name: "Pandit Srinivas Somayaji",
    kannadaName: "ಪಂಡಿತ್ ಶ್ರೀನಿವಾಸ ಸೋಮಯಾಜಿ",
    designation: "Sahayaka Archaka",
    phone: "919845099999",
    experience: "12+ Years",
    specializations: ["Durga Homa", "Navagraha Shanti"],
    status: "ACTIVE"
  };

  templeStore.savePriest(newPriest);
  const fetched = templeStore.getPriestById("archaka-test-1");
  assert.ok(fetched, "Priest saved in store");
  assert.strictEqual(fetched.name, "Pandit Srinivas Somayaji");
  assert.strictEqual(fetched.status, "ACTIVE");

  // Toggle status to ON_LEAVE
  templeStore.togglePriestStatus("archaka-test-1");
  assert.strictEqual(templeStore.getPriestById("archaka-test-1").status, "ON_LEAVE");

  // Delete priest
  templeStore.deletePriest("archaka-test-1");
  assert.strictEqual(templeStore.getPriestById("archaka-test-1"), undefined, "Priest deleted");
});

test("CMS Photo Gallery allows adding, ordering, and removing photos", () => {
  const gallery = templeStore.getGallery();
  assert.ok(gallery.length >= 5, "Default gallery photos seeded");

  const newPhoto = {
    id: "gal-test-1",
    title: "Maha Rathotsava Chariot",
    kannadaTitle: "ಮಹಾ ರಥೋತ್ಸವ",
    category: "utsava",
    url: "assets/images/rathotsava.jpg",
    caption: "Grand chariot procession along Chandra Layout main road",
    order: 10
  };

  templeStore.saveGalleryItem(newPhoto);
  const fetched = templeStore.getGalleryItemById("gal-test-1");
  assert.ok(fetched, "Gallery photo saved");
  assert.strictEqual(fetched.category, "utsava");

  // Delete photo
  templeStore.deleteGalleryItem("gal-test-1");
  assert.strictEqual(templeStore.getGalleryItemById("gal-test-1"), undefined, "Gallery photo removed");
});

test("CMS Special Notifications allows broadcasting alerts with action CTAs and toggling visibility", () => {
  const notifs = templeStore.getSpecialNotifications();
  assert.ok(notifs.length >= 3, "Default special notifications seeded");

  const newAlert = {
    id: "notif-test-1",
    title: "Surya Grahana Sanctum Closure",
    kannadaTitle: "ಸೂರ್ಯಗ್ರಹಣ ಪ್ರಯುಕ್ತ ದೇವಾಲಯ ಮುಚ್ಚುವಿಕೆ",
    message: "Sanctum will remain closed from 2:00 PM to 7:00 PM during solar eclipse.",
    type: "urgent",
    actionText: "Check Re-opening Time",
    actionUrl: "#timings",
    isActive: true
  };

  templeStore.saveSpecialNotification(newAlert);
  const fetched = templeStore.getSpecialNotificationById("notif-test-1");
  assert.ok(fetched, "Alert created");
  assert.strictEqual(fetched.type, "urgent");
  assert.strictEqual(fetched.isActive, true);

  // Toggle active status
  templeStore.toggleNotificationStatus("notif-test-1");
  assert.strictEqual(templeStore.getSpecialNotificationById("notif-test-1").isActive, false);

  // Delete alert
  templeStore.deleteSpecialNotification("notif-test-1");
  assert.strictEqual(templeStore.getSpecialNotificationById("notif-test-1"), undefined, "Alert deleted");
});

// --- SUITE 8: CENTRALIZED LIVE STREAMING ARCHITECTURE & LOCATION MUTEX ---
console.log("\nSuite 8: Centralized Live Streaming Architecture & Location Mutex");

test("Streaming locations catalog contains default 5 authentic sanctum locations", () => {
  const locs = streamingService.getLocations();
  assert.ok(locs.length >= 5, "Has at least 5 locations");
  const garbha = locs.find(l => l.id === 'loc-garbha-gudi');
  assert.ok(garbha, "Main Garbha Gudi exists");
  assert.strictEqual(garbha.status, 'ACTIVE');
});

test("Location CRUD & Reordering: Can add, reorder, and toggle location status", () => {
  const newLoc = {
    id: "loc-test-navarathri",
    name: "Special Navaratri Mantapa",
    kannadaName: "ವಿಶೇಷ ನವರಾತ್ರಿ ಮಂಟಪ",
    description: "Temporary sanctum dais for Navaratri Alankara",
    supportedSources: "BOTH",
    status: "ACTIVE",
    displayOrder: 99
  };

  streamingService.saveLocation(newLoc);
  const fetched = streamingService.getLocationById("loc-test-navarathri");
  assert.ok(fetched, "Location created");
  assert.strictEqual(fetched.name, "Special Navaratri Mantapa");

  // Reorder
  streamingService.reorderLocations([fetched.id, 'loc-garbha-gudi']);
  assert.strictEqual(streamingService.getLocationById("loc-test-navarathri").displayOrder, 1);

  // Toggle status
  streamingService.toggleLocationStatus("loc-test-navarathri");
  assert.strictEqual(streamingService.getLocationById("loc-test-navarathri").status, "INACTIVE");

  // Cleanup
  streamingService.deleteLocation("loc-test-navarathri");
  assert.strictEqual(streamingService.getLocationById("loc-test-navarathri"), undefined);
});

test("Starting a Live Session transitions state to LIVE and assigns playback URL", async () => {
  const session = await streamingService.startLiveSession({
    locationId: 'loc-garbha-gudi',
    sourceType: SOURCE_TYPE.MOBILE,
    title: 'Garbha Gudi — Ushakala Mangalarathi',
    adminUser: { name: 'Sri S. Ramesh' }
  });

  assert.ok(session, "Session created");
  assert.strictEqual(session.status, STREAM_STATUS.LIVE);
  assert.strictEqual(session.locationId, 'loc-garbha-gudi');
  assert.ok(session.playbackUrl.startsWith('stream://'));

  const active = streamingService.getActiveBroadcastForLocation('loc-garbha-gudi');
  assert.ok(active, "Active broadcast registered");
  assert.strictEqual(active.id, session.id);
});

test("Strict Mutex Safeguard: Second broadcast on same location is strictly rejected", async () => {
  let threw = false;
  try {
    await streamingService.startLiveSession({
      locationId: 'loc-garbha-gudi',
      sourceType: SOURCE_TYPE.MOBILE,
      title: 'Conflicting Duplicate Broadcast'
    });
  } catch (err) {
    threw = true;
    assert.ok(err.message.includes("already broadcasting live") || err.message.includes("mutex violation"));
  }
  assert.strictEqual(threw, true, "Must reject concurrent duplicate session on same location");
});

test("Safe Deletion Guard: Cannot delete a location while actively broadcasting", () => {
  let threw = false;
  try {
    streamingService.deleteLocation('loc-garbha-gudi');
  } catch (err) {
    threw = true;
    assert.ok(err.message.includes("Cannot delete a location while an active broadcast is in progress"));
  }
  assert.strictEqual(threw, true, "Prevented deleting active live location");
});

test("IP Camera Abstraction: Validates protocol and blocks SSRF cloud metadata targets", async () => {
  // Invalid protocol test
  const badProto = await streamingService.testIpCameraConnection({ streamUrl: 'ftp://bad-url' });
  assert.strictEqual(badProto.success, false);
  assert.ok(badProto.details.includes("Invalid protocol"));

  // SSRF attack test
  const ssrf = await streamingService.testIpCameraConnection({ streamUrl: 'http://169.254.169.254/latest/meta-data/' });
  assert.strictEqual(ssrf.success, false);
  assert.ok(ssrf.details.includes("Security block"));

  // Valid RTSP test
  const valid = await streamingService.testIpCameraConnection({ streamUrl: 'rtsp://sanctum-cam1.temple.lan:554/live/ch0' });
  assert.strictEqual(valid.success, true);
  assert.ok(valid.pingMs > 0);
});

test("Public Live State Sanitizer: Strips private admin fields and provides sanitized playback state", () => {
  const publicState = streamingService.getPublicLiveDarshanState('loc-garbha-gudi');
  assert.strictEqual(publicState.isLive, true);
  assert.ok(publicState.session);
  assert.ok(publicState.session.locationName.includes("Main Garbha Gudi"));
  assert.strictEqual(publicState.session.adminUser, undefined, "Admin details not leaked");
  assert.strictEqual(publicState.session.ipCameraConfig, undefined, "IP camera passwords not leaked");
});

test("Stopping Live Session: Transitions status to ENDED and releases publisher resources", async () => {
  const active = streamingService.getActiveBroadcastForLocation('loc-garbha-gudi');
  assert.ok(active, "Active session exists");

  const ended = await streamingService.stopLiveSession(active.id);
  assert.strictEqual(ended.status, STREAM_STATUS.ENDED);
  assert.ok(ended.endedAt);

  const activeAfter = streamingService.getActiveBroadcastForLocation('loc-garbha-gudi');
  assert.strictEqual(activeAfter, undefined, "No active session remains for location");
});

test("Cross-Device Server Sync: Ingests server live session and broadcasts STREAM_STARTED", async () => {
  const origFetch = global.fetch;
  const mockServerSession = {
    id: 'live-server-synced-123',
    locationId: 'loc-garbha-gudi',
    locationName: 'Main Garbha Gudi (Sanctum)',
    status: STREAM_STATUS.LIVE,
    currentViewers: 18,
    startedAt: new Date().toISOString()
  };

  global.fetch = async (url) => {
    return {
      ok: true,
      json: async () => ({
        success: true,
        isLive: true,
        session: mockServerSession,
        viewerCount: 18
      })
    };
  };

  let eventFired = null;
  const unsubscribe = streamingService.subscribe((msg) => {
    if (msg.type === 'STREAM_STARTED') eventFired = msg.payload.session;
  });

  const synced = await streamingService.syncLiveStateFromServer();
  unsubscribe();
  global.fetch = origFetch;

  assert.ok(synced);
  assert.strictEqual(synced.isLive, true);
  assert.ok(eventFired);
  assert.strictEqual(eventFired.id, 'live-server-synced-123');

  // Verify templeStore now reflects this live session
  const activeSess = streamingService.getActiveBroadcastForLocation('loc-garbha-gudi');
  assert.ok(activeSess);
  assert.strictEqual(activeSess.id, 'live-server-synced-123');

  // Clean up
  templeStore.endLiveSession('live-server-synced-123');
});

test("Real-Time Frame Relay & Endpoint Helper: Formats API URLs and handles frame storage", () => {
  const statusUrl = streamingService.getApiUrl('api/live-status.php');
  assert.ok(statusUrl.includes('api/live-status.php'));
  assert.ok(statusUrl.includes('t='));

  const frameUrl = streamingService.getApiUrl('api/live-frame.php?json=1');
  assert.ok(frameUrl.includes('api/live-frame.php?json=1'));
  assert.ok(frameUrl.includes('&t='));

  // Test frame cache getter & stopBroadcastingFrames cleanup
  streamingService.latestBroadcastFrame = 'data:image/jpeg;base64,sampleFakeFrame';
  assert.strictEqual(streamingService.getLatestBroadcastFrame(), 'data:image/jpeg;base64,sampleFakeFrame');
  streamingService.stopBroadcastingFrames();
  assert.strictEqual(streamingService.getLatestBroadcastFrame(), null);
});

// --- SUITE 9: CENTRALIZED ANALYTICS & PLATFORM ATTRIBUTION ---
console.log("\nSuite 9: Centralized Analytics & Platform Attribution");

test("Standardized Event Catalog: Logs events with timestamps, session, and platform", () => {
  const evt = analyticsService.logEvent(ANALYTICS_EVENT.POOJA_VIEW, {
    poojaId: 'durga-homa',
    poojaName: 'Durga Homa',
    kanike: 1501
  });

  assert.ok(evt.id.startsWith('evt-'));
  assert.strictEqual(evt.event, ANALYTICS_EVENT.POOJA_VIEW);
  assert.ok(evt.timestamp);
  assert.strictEqual(evt.properties.poojaId, 'durga-homa');
});

test("Platform Detection & Session Management: Attributes visitor sessions", () => {
  const platform = analyticsService.getPlatform();
  assert.ok([PLATFORM_TYPE.PWA, PLATFORM_TYPE.BROWSER, PLATFORM_TYPE.UNKNOWN].includes(platform));
});

test("Viewer Concurrency & Heartbeat Loop: Tracks active watch duration and auto-expires inactive viewers", () => {
  const dummyLiveSessionId = 'live-test-analytics';
  const viewerSession = analyticsService.startViewerHeartbeat(dummyLiveSessionId, 'loc-garbha-gudi', 'Main Garbha Gudi');
  assert.ok(viewerSession.id.startsWith('vwr-'));
  assert.strictEqual(viewerSession.isActive, true);

  // Concurrency count should reflect active viewer
  let activeCount = templeStore.getActiveViewerCount(dummyLiveSessionId);
  assert.strictEqual(activeCount, 1);

  // Heartbeat updates duration
  analyticsService._sendHeartbeat();
  const updated = templeStore.getViewerSessions().find(s => s.id === viewerSession.id);
  assert.ok(updated.lastHeartbeatAt);

  // Stop heartbeat
  analyticsService.stopViewerHeartbeat('TEST_FINALIZE');
  assert.strictEqual(analyticsService.getCurrentViewerSession(), null);

  activeCount = templeStore.getActiveViewerCount(dummyLiveSessionId);
  assert.strictEqual(activeCount, 0, "Active viewer count decreases to 0 when finalized");
});

test("Metrics Summary: Accurately calculates page views, platform ratio, and live watch minutes", () => {
  analyticsService.trackPageView('Home');
  analyticsService.trackPageView('Poojas');
  const summary = analyticsService.getMetricsSummary();

  assert.ok(summary.totalPageViews >= 2);
  assert.ok(summary.totalSessions >= 1);
  assert.ok(typeof summary.pwaRatio === 'number');
  assert.ok(typeof summary.browserRatio === 'number');
});

// --- SUITE 10: WEB PUSH NOTIFICATIONS & BROADCAST DISPATCH ---
console.log("\nSuite 10: Web Push Notifications & Broadcast Dispatch");

test("Push Subscription Management: Saves endpoint and authentic categories", () => {
  const testSub = {
    endpoint: "sdd-push-token-test-1",
    keys: { p256dh: "key1", auth: "auth1" },
    status: "ACTIVE",
    preferences: {
      liveDarshan: true,
      events: true,
      specialPoojas: false,
      dailyPanchanga: true
    }
  };

  templeStore.savePushSubscription(testSub);
  const subs = templeStore.getPushSubscriptions();
  const found = subs.find(s => s.endpoint === "sdd-push-token-test-1");
  assert.ok(found, "Subscription saved");
  assert.strictEqual(found.preferences.liveDarshan, true);

  // Update preferences
  templeStore.updatePushPreferences("sdd-push-token-test-1", { specialPoojas: true });
  const updated = templeStore.getPushSubscriptions().find(s => s.endpoint === "sdd-push-token-test-1");
  assert.strictEqual(updated.preferences.specialPoojas, true);

  // Cleanup
  templeStore.deletePushSubscription("sdd-push-token-test-1");
});

test("Admin Notification Dispatch: Sends targeted alerts matching category filters", async () => {
  const record = await pushNotificationService.dispatchNotification({
    title: "Navaratri Chandi Homa Alert 🪔",
    kannadaTitle: "ನವರಾತ್ರಿ ಚಂಡಿಕಾ ಹೋಮ",
    body: "Sanctum Chandi Homa is commencing today.",
    category: NOTIFICATION_CATEGORY.FESTIVALS_EVENTS,
    targetUrl: "app.html#calendar",
    adminUser: "Chief Trustee"
  });

  assert.ok(record.id.startsWith('disp-'));
  assert.strictEqual(record.title, "Navaratri Chandi Homa Alert 🪔");
  assert.strictEqual(record.category, NOTIFICATION_CATEGORY.FESTIVALS_EVENTS);
  assert.ok(record.timestamp);

  // Check history
  const history = templeStore.getNotificationHistory();
  const inHistory = history.find(h => h.id === record.id);
  assert.ok(inHistory, "Dispatch saved in notification history log");
});

// Await full execution of all sequential tests
await testQueue;

console.log("\n============================================================");
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log("============================================================\n");

if (failCount > 0) {
  process.exit(1);
}

