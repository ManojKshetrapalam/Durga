/**
 * QR Landing View — Physical On-Premises Devotee Front Desk
 * Matches Stitch Screen: qr-landing.html
 */

import { PanchangaService } from '../services/panchangaService.js';
import { TEMPLE_TIMINGS } from '../data/timings.js';

export function renderQrLandingView(spotId = 'entrance') {
  const spotNames = {
    'entrance': 'Main Temple Entrance & Navagraha Sanctum',
    'pooja-counter': 'Pooja Booking Desk & Kanike Counter',
    'yagashala': 'Durga Parameshwari Yagashala & Homa Kunda',
    'reception': 'Temple Office & Hereditary Archaka Desk',
    'deepotsava': 'North Prakaara Lamp Offering Area'
  };

  const spotLabel = spotNames[spotId] || spotNames['entrance'];
  const panchanga = PanchangaService.getPanchanga(new Date());
  const todayDay = new Date().getDay();
  const schedule = TEMPLE_TIMINGS.schedules[todayDay];

  return `
    <div class="view-qr-landing">
      <!-- Physical Location Badge -->
      <div style="background: #FFFDF5; border: 1.5px solid var(--color-gold); border-radius: var(--radius-lg); padding: 10px 14px; margin-bottom: 12px; display: flex; align-items: center; gap: 10px;">
        <span style="font-size: 1.3rem;">📍</span>
        <div>
          <div style="font-size: 0.72rem; color: var(--color-gold-hover); font-weight: 700; text-transform: uppercase;">
            On-Premises Physical Verified Scan
          </div>
          <div style="font-size: 0.95rem; font-weight: 800; color: var(--color-primary); line-height: 1.2;">
            ${spotLabel}
          </div>
        </div>
      </div>

      <!-- Welcome Banner -->
      <section class="card card-gold-accent">
        <div class="card-header-row">
          <span class="badge badge-gold">Digital Mandapa Front Desk</span>
          <span class="badge badge-live">Sanctum Open</span>
        </div>
        <h2 style="font-family: var(--font-serif); font-size: 1.4rem; color: var(--color-primary); font-weight: 700; line-height: 1.25; margin-bottom: 4px;">
          Namaskara 🙏 Welcome to the Divine Sanctum
        </h2>
        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 8px;">
          Your instant digital assistant while visiting the holy shrine in person.
        </p>
        <div style="padding: 6px 10px; background: #EBF8EE; border-radius: var(--radius-sm); font-size: 0.8rem; color: var(--color-success); font-weight: 600;">
          🟢 Darshan open currently until ${schedule.morning.close} (Evening: ${schedule.evening.open} – ${schedule.evening.close})
        </div>
      </section>

      <!-- In-Temple Quick Actions (4 Big Tiles) -->
      <section>
        <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); font-weight: 700; margin-bottom: 10px;">
          In-Temple Quick Actions
        </h3>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          <!-- 1. Aarti Timing -->
          <div class="card" style="padding: 12px; cursor: pointer;" onclick="window.app.navigate('panchanga')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="display: flex; gap: 10px;">
                <span style="font-size: 1.3rem;">🕒</span>
                <div>
                  <h4 style="font-family: var(--font-serif); font-size: 1rem; color: var(--color-primary); font-weight: 700;">
                    Today's Aarti & Darshan Timings
                  </h4>
                  <p style="font-size: 0.8rem; color: var(--color-text-soft);">
                    Next Aarti: <strong>Maha Mangalarathi at 12:00 PM</strong>
                  </p>
                </div>
              </div>
              <span class="badge badge-saffron">15 mins away</span>
            </div>
          </div>

          <!-- 2. Offer Seva -->
          <div class="card" style="padding: 12px; cursor: pointer;" onclick="window.app.navigate('poojas')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div style="display: flex; gap: 10px;">
                <span style="font-size: 1.3rem;">🪔</span>
                <div>
                  <h4 style="font-family: var(--font-serif); font-size: 1rem; color: var(--color-primary); font-weight: 700;">
                    Offer Seva / Book Archana
                  </h4>
                  <p style="font-size: 0.8rem; color: var(--color-text-soft);">
                    View 21 authentic offerings & get instant counter token
                  </p>
                </div>
              </div>
              <span class="badge badge-gold">Counter Token</span>
            </div>
            <button class="btn btn-primary btn-sm" style="margin-top: 8px;">
              View Available Sevas & Rates →
            </button>
          </div>

          <!-- 3. Panchanga Snapshot -->
          <div class="card" style="padding: 12px; cursor: pointer;" onclick="window.app.navigate('panchanga')">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div>
                <span style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">PANCHANGAM SNAPSHOT</span>
                <div style="font-weight: 700; color: var(--color-primary); font-size: 0.95rem;">
                  ${panchanga.tithi.name} • ${panchanga.nakshatra.name}
                </div>
                <div class="num-tabular" style="font-size: 0.78rem; color: var(--color-warning); font-weight: 600;">
                  Rahu Kala: ${panchanga.rahuKala}
                </div>
              </div>
              <span style="color: var(--color-primary); font-size: 1.1rem;">›</span>
            </div>
          </div>

          <!-- 4. Ask Office Desk -->
          <div class="card" style="padding: 12px; cursor: pointer;" onclick="window.app.openWhatsAppCounter('${spotLabel}')">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; gap: 10px; align-items: center;">
                <span style="font-size: 1.3rem;">💬</span>
                <div>
                  <h4 style="font-family: var(--font-serif); font-size: 1rem; color: var(--color-primary); font-weight: 700;">
                    Priest & Office WhatsApp Desk
                  </h4>
                  <p style="font-size: 0.78rem; color: var(--color-text-soft);">
                    Direct channel for special queries & guidance
                  </p>
                </div>
              </div>
              <span class="badge badge-live">Live</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Counter & Desk Guidelines -->
      <section class="card">
        <h3 class="card-title" style="font-size: 1.05rem;">
          <span>🏛️</span> Counter & Temple Desk Guidelines
        </h3>
        <ul style="font-size: 0.8rem; color: var(--color-text-main); margin-left: 16px; margin-top: 6px; display: flex; flex-direction: column; gap: 6px;">
          <li><strong>Pooja Booking Counter Hours:</strong> Morning 6:30 AM – 12:00 PM | Evening 5:30 PM – 8:30 PM.</li>
          <li><strong>Kanike & Seva Receipts:</strong> Official computer-printed receipts provided at counter (Cash, UPI, GPay, PhonePe accepted).</li>
          <li><strong>Vehicle Pooja (Vahana Pooja):</strong> Conducted at North Prakaara 9:00 AM – 11:00 AM & 6:00 PM – 8:00 PM daily.</li>
          <li><strong>Devotee Dress Code:</strong> Traditional attire encouraged inside inner pradakshina and sanctum.</li>
        </ul>
      </section>

      <!-- Add to Home Screen PWA On-Ramp -->
      <section class="pwa-banner">
        <div style="display: flex; align-items: flex-start; gap: 10px;">
          <span style="font-size: 1.4rem;">📲</span>
          <div>
            <h4 style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--color-primary); font-weight: 700;">
              Keep Sri Durga Devi Temple in your pocket
            </h4>
            <p style="font-size: 0.8rem; color: var(--color-text-muted); margin-top: 2px;">
              Install this Progressive App for instant offline daily Panchanga, festival alerts, and fast seva counter access without app store downloads.
            </p>
          </div>
        </div>
        <button id="btn-install-pwa-qr" class="btn btn-primary" style="margin-top: 6px;" onclick="window.app.promptPwaInstall()">
          Install Digital Mandapa App 📲
        </button>
      </section>

      <!-- Temple Contact & Directions -->
      <div style="text-align: center; font-size: 0.8rem; color: var(--color-text-soft); padding: 8px 0;">
        Temple Office: <a href="tel:08023394447" style="color: var(--color-primary); font-weight: 700;">080-23394447</a> • WhatsApp: <a href="https://wa.me/919845012345" style="color: var(--color-whatsapp-dark); font-weight: 700;">+91 98450 12345</a>
      </div>
    </div>
  `;
}
