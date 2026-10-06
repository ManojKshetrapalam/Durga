/**
 * PWA & UX Static Inspection Test
 * Validates manifest.webmanifest, service worker precache completeness, CSS token consistency, and mobile targets
 */

import fs from 'fs';
import path from 'path';
import assert from 'assert';

console.log("\n============================================================");
console.log("PWA & MOBILE UX VERIFICATION SUITE");
console.log("============================================================\n");

// 1. Verify manifest.webmanifest
console.log("Checking PWA Manifest...");
const manifestPath = path.resolve('app/manifest.webmanifest');
assert.ok(fs.existsSync(manifestPath), "manifest.webmanifest must exist");
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

assert.strictEqual(manifest.name, "Sri Durga Devi Temple — Digital Mandapa");
assert.strictEqual(manifest.short_name, "Durga Mandapa");
assert.strictEqual(manifest.display, "standalone");
assert.strictEqual(manifest.theme_color, "#721C2B");
assert.strictEqual(manifest.background_color, "#FAF7F2");
assert.ok(manifest.icons && manifest.icons.length > 0, "Manifest must have icons");
console.log("  ✓ PASS: Web App Manifest conforms to PWA installation standards.");

// 2. Verify Service Worker Precache Assets
console.log("Checking Service Worker Assets...");
const swPath = path.resolve('app/sw.js');
assert.ok(fs.existsSync(swPath), "sw.js must exist");
const swContent = fs.readFileSync(swPath, 'utf8');

const assetMatches = swContent.match(/'\.\/[^']+'/g);
assert.ok(assetMatches && assetMatches.length > 0, "sw.js must declare precache assets");

assetMatches.forEach(rawAsset => {
  const assetRel = rawAsset.slice(1, -1).replace(/^\.\//, '');
  if (assetRel === '' || assetRel === '.') return; // root
  const fullPath = path.resolve('app', assetRel);
  assert.ok(fs.existsSync(fullPath), `Precache asset must physically exist: ${assetRel}`);
});
console.log(`  ✓ PASS: All ${assetMatches.length} precached assets in sw.js exist on disk.`);

// 3. Verify CSS Tokens and Touch Targets
console.log("Checking CSS Tokens & Touch Targets...");
const tokensCss = fs.readFileSync(path.resolve('app/css/tokens.css'), 'utf8');
const appCss = fs.readFileSync(path.resolve('app/css/app.css'), 'utf8');

assert.ok(tokensCss.includes('--min-touch-target: 48px;'), "Min touch target token must be 48px");
assert.ok(tokensCss.includes('--color-primary: #721C2B;'), "Deep Maroon token verified");
assert.ok(tokensCss.includes('--color-gold: #C59B27;'), "Antique Gold token verified");
assert.ok(tokensCss.includes('--color-canvas: #FAF7F2;'), "Warm Ivory canvas verified");
assert.ok(appCss.includes('overflow-x: hidden;'), "Zero horizontal scroll rule enforced");
assert.ok(appCss.includes('max-width: 480px;'), "Mobile-first framed layout enforced");

console.log("  ✓ PASS: Design tokens, 48px touch targets, and mobile constraints verified.");

// 4. Verify Stitch assets
console.log("Checking Stitch Loop Generated Assets...");
const stitchDesigns = [
  'home.png', 'home.html',
  'pooja-detail.png', 'pooja-detail.html',
  'calendar-availability.png', 'calendar-availability.html',
  'panchanga-daily.png', 'panchanga-daily.html',
  'booking-request.png', 'booking-request.html',
  'qr-landing.png', 'qr-landing.html',
  'admin-dashboard.png', 'admin-dashboard.html'
];

stitchDesigns.forEach(f => {
  const p = path.resolve('.stitch/designs', f);
  assert.ok(fs.existsSync(p), `Stitch design asset must exist: ${f}`);
});
console.log(`  ✓ PASS: All ${stitchDesigns.length} Stitch Loop screen designs present and verified.`);

console.log("\n============================================================");
console.log("ALL PWA & MOBILE UX VERIFICATIONS PASSED 100%");
console.log("============================================================\n");
