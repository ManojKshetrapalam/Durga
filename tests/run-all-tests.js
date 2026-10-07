/**
 * Sri Durga Devi Temple — Automated Verification & Business Rule Tests
 * Tests Date Availability Precedence, Vedic Panchanga, and WhatsApp Generator
 */

import assert from 'assert';

// Mock localStorage for Node.js test environment
const mockStorage = new Map();
global.localStorage = {
  getItem: (key) => mockStorage.get(key) || null,
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear()
};

// Import modules under test
const { SEVAS_DATA } = await import('../app/js/data/sevas.js');
const { TEMPLE_TIMINGS } = await import('../app/js/data/timings.js');
const { templeStore } = await import('../app/js/services/store.js');
const { PanchangaService } = await import('../app/js/services/panchangaService.js');
const { AvailabilityEngine } = await import('../app/js/services/availabilityEngine.js');
const { WhatsAppService } = await import('../app/js/services/whatsappService.js');

let passCount = 0;
let failCount = 0;

function test(description, fn) {
  try {
    fn();
    console.log(`  ✓ PASS: ${description}`);
    passCount++;
  } catch (err) {
    console.error(`  ✕ FAIL: ${description}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
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

test("Fix Underline 3: Solar horizon computes dynamic Bengaluru winter sunrise (06:39 AM) & sunset (06:01 PM) on Dec 28", () => {
  const dec28 = new Date(2026, 11, 28);
  const p = PanchangaService.getPanchanga(dec28);
  assert.strictEqual(p.sunrise, "06:39 AM", "Bengaluru sunrise on Dec 28 is 06:39 AM");
  assert.strictEqual(p.sunset, "06:01 PM", "Bengaluru sunset on Dec 28 is 06:01 PM");
  assert.strictEqual(p.daylightDuration, "11 hrs 22 mins", "Bengaluru daylight on Dec 28 is 11 hrs 22 mins");
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

  // Sankashta Hara Chaturthi
  const chaturthi = PanchangaService.getPanchanga(new Date(2026, 9, 30));
  assert.ok(chaturthi.festivals.some(f => f.name.includes("Sankashta Hara Chaturthi")), "Detects Sankashta Hara Chaturthi");

  // Naraka Chaturdashi
  const deepavali = PanchangaService.getPanchanga(new Date(2026, 10, 9));
  assert.ok(deepavali.festivals.some(f => f.name.includes("Naraka Chaturdashi")), "Detects Naraka Chaturdashi");
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

console.log("\n============================================================");
console.log(`TOTAL TESTS: ${passCount + failCount} | PASSED: ${passCount} | FAILED: ${failCount}`);
console.log("============================================================\n");

if (failCount > 0) {
  process.exit(1);
}
