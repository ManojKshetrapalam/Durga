/**
 * Panchanga View — Daily Panchanga & Temple Darshan Timings
 * Matches Stitch Screen: panchanga-daily.html
 */

import { PanchangaService } from '../services/panchangaService.js';
import { TEMPLE_TIMINGS } from '../data/timings.js';

export function renderPanchangaView(currentDate = new Date()) {
  const panchanga = PanchangaService.getPanchanga(currentDate);
  const dayOfWeek = new Date(currentDate).getDay();
  const schedule = TEMPLE_TIMINGS.schedules[dayOfWeek];

  return `
    <div class="view-panchanga">
      <div>
        <h2 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--color-primary); font-weight: 700;">
          Daily Vedic Panchanga
        </h2>
        <p style="font-size: 0.85rem; color: var(--color-text-soft);">
          Bengaluru Horizon (${panchanga.coordinates})
        </p>
      </div>

      <!-- Date Stepper Controller -->
      <div class="card" style="padding: 10px 14px; margin-top: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <button class="btn btn-secondary btn-sm" onclick="window.app.stepPanchangaDate(-1)">
            ‹ Prev Day
          </button>
          <div style="text-align: center;">
            <div class="num-tabular" style="font-weight: 700; color: var(--color-primary); font-size: 0.95rem;">
              ${panchanga.formattedDate}
            </div>
            <div style="font-size: 0.72rem; color: var(--color-gold-hover); font-weight: 600;">
              ${panchanga.samvatsara} • ${panchanga.ayana}
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.app.stepPanchangaDate(1)">
            Next Day ›
          </button>
        </div>
      </div>

      <!-- Sacred Panchanga (The 5 Limbs) -->
      <section class="card card-gold-accent">
        <div class="card-header-row">
          <h3 class="card-title">
            <span>🪔</span> Pancha-Anga (The 5 Limbs)
          </h3>
          <span class="badge badge-gold">${panchanga.ritu}</span>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px;">
          <!-- Tithi -->
          <div style="padding: 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
            <div style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">1. Tithi</div>
            <div style="font-weight: 800; color: var(--color-primary); font-size: 1rem;">${panchanga.tithi.name}</div>
            <div class="num-tabular" style="font-size: 0.72rem; color: var(--color-text-soft);">Till ${panchanga.tithi.endTime}</div>
          </div>

          <!-- Nakshatra -->
          <div style="padding: 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
            <div style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">2. Nakshatra</div>
            <div style="font-weight: 800; color: var(--color-primary); font-size: 1rem;">${panchanga.nakshatra.name}</div>
            <div class="num-tabular" style="font-size: 0.72rem; color: var(--color-text-soft);">Till ${panchanga.nakshatra.endTime}</div>
          </div>

          <!-- Yoga -->
          <div style="padding: 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
            <div style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">3. Yoga</div>
            <div style="font-weight: 700; color: var(--color-text-main); font-size: 0.95rem;">${panchanga.yoga}</div>
            <div style="font-size: 0.72rem; color: var(--color-success); font-weight: 600;">Auspicious</div>
          </div>

          <!-- Karana -->
          <div style="padding: 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
            <div style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">4. Karana</div>
            <div style="font-weight: 700; color: var(--color-text-main); font-size: 0.95rem;">${panchanga.karana.split(' ')[0]}</div>
            <div style="font-size: 0.72rem; color: var(--color-text-soft);">Bava / Balava</div>
          </div>
        </div>

        <!-- Moon Rashi Row -->
        <div style="margin-top: 10px; padding: 8px 12px; background: var(--color-gold-light); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
          <span style="font-weight: 700; color: var(--color-gold-hover);">5. Chandra Rashi (Moon Sign):</span>
          <span style="font-weight: 800; color: var(--color-primary);">${panchanga.rashi}</span>
        </div>
      </section>

      <!-- Important Timings & Kaala Safeguards -->
      <section class="card">
        <h3 class="card-title">
          <span>⏳</span> Kaala & Muhurtha Timings
        </h3>
        <p class="card-subtitle">Devotee guidance for sankalpa and rituals</p>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
          <!-- Abhijit Muhurtha -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #EBF8EE; border-radius: var(--radius-md); border: 1px solid #B7E4C7;">
            <div>
              <div style="font-weight: 700; color: var(--color-success); font-size: 0.9rem;">🟢 Abhijit Muhurtha</div>
              <div style="font-size: 0.72rem; color: #166534;">Supreme window for initiating sacred works</div>
            </div>
            <span class="num-tabular" style="font-weight: 800; color: var(--color-success); font-size: 0.95rem;">${panchanga.abhijitMuhurtha}</span>
          </div>

          <!-- Rahu Kala (Warning) -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #FEF3EB; border-radius: var(--radius-md); border: 1px solid #FCD5BD;">
            <div>
              <div style="font-weight: 700; color: var(--color-warning); font-size: 0.9rem;">⚠️ Rahu Kala (Inauspicious)</div>
              <div style="font-size: 0.72rem; color: var(--color-text-soft);">Avoid initiating new general activities</div>
            </div>
            <span class="num-tabular" style="font-weight: 800; color: var(--color-warning); font-size: 0.95rem;">${panchanga.rahuKala}</span>
          </div>

          <!-- Yamaganda & Gulika -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="padding: 8px 10px; background: var(--color-canvas); border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 600;">Yamaganda</span>
              <div class="num-tabular" style="font-size: 0.85rem; font-weight: 700;">${panchanga.yamaganda}</div>
            </div>
            <div style="padding: 8px 10px; background: var(--color-canvas); border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 600;">Gulika Kala</span>
              <div class="num-tabular" style="font-size: 0.85rem; font-weight: 700;">${panchanga.gulikaKala}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Astronomical Sun Arc Card -->
      <section class="card" style="text-align: center;">
        <h3 class="card-title" style="justify-content: center;">
          <span>☀️</span> Solar Horizon Arc
        </h3>
        
        <!-- SVG Arc Visualization -->
        <div style="margin: 12px 0 6px;">
          <svg viewBox="0 0 240 70" width="100%" height="70">
            <path d="M 20 60 A 100 50 0 0 1 220 60" fill="none" stroke="#EADFCD" stroke-width="2" stroke-dasharray="4 4"/>
            <path d="M 20 60 A 100 50 0 0 1 120 10" fill="none" stroke="#D95D0F" stroke-width="3"/>
            <!-- Sun circle -->
            <circle cx="120" cy="10" r="8" fill="#D95D0F"/>
            <circle cx="120" cy="10" r="12" fill="none" stroke="rgba(217, 93, 15, 0.25)" stroke-width="2"/>
            <text x="20" y="68" font-size="10" fill="#78716C" text-anchor="middle">06:12</text>
            <text x="220" y="68" font-size="10" fill="#78716C" text-anchor="middle">18:18</text>
            <text x="120" y="32" font-size="10" fill="#721C2B" font-weight="bold" text-anchor="middle">Midday 12:15</text>
          </svg>
        </div>

        <div style="display: flex; justify-content: space-around; font-size: 0.85rem; border-top: 1px solid var(--color-border-subtle); padding-top: 8px;">
          <div>🌅 <strong>Sunrise:</strong> ${panchanga.sunrise}</div>
          <div>🌇 <strong>Sunset:</strong> ${panchanga.sunset}</div>
          <div>⏳ <strong>Day:</strong> ${panchanga.daylightDuration}</div>
        </div>
      </section>

      <!-- Darshan & Aarti Timeline Card -->
      <section class="card">
        <div class="card-header-row">
          <h3 class="card-title">
            <span>🏛️</span> Temple Schedule for Today
          </h3>
          <span class="badge badge-maroon">${schedule.dayName.split(' ')[0]}</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 8px;">
          <div style="padding: 10px; background: var(--color-canvas); border-left: 3px solid var(--color-gold); border-radius: 0 var(--radius-md) var(--radius-md) 0;">
            <div class="num-tabular" style="font-weight: 700; color: var(--color-primary); font-size: 0.9rem;">
              ${schedule.morning.open} – ${schedule.morning.close}
            </div>
            <div style="font-weight: 600; font-size: 0.85rem;">Morning Darshan & Abhisheka</div>
            <div style="font-size: 0.75rem; color: var(--color-text-soft);">Pratah Kaala Pooja & Maha Naivedya at 9:30 AM</div>
          </div>

          <div style="padding: 10px; background: var(--color-canvas); border-left: 3px solid var(--color-primary); border-radius: 0 var(--radius-md) var(--radius-md) 0;">
            <div class="num-tabular" style="font-weight: 700; color: var(--color-primary); font-size: 0.9rem;">
              ${schedule.evening.open} – ${schedule.evening.close}
            </div>
            <div style="font-weight: 600; font-size: 0.85rem;">Evening Deepotsava & Maha Mangalarathi</div>
            <div style="font-size: 0.75rem; color: var(--color-text-soft);">Grand Camphor Aarti at 7:30 PM sharp</div>
          </div>

          <!-- Vehicle Pooja Box -->
          <div style="padding: 8px 12px; background: #FFFBF0; border: 1px solid #FDE68A; border-radius: var(--radius-md); font-size: 0.8rem;">
            🚗 <strong>Vehicle Pooja Timings:</strong> 9:00 AM – 11:00 AM & 6:00 PM – 8:00 PM (North Gate Prakaara)
          </div>
        </div>
      </section>

      <!-- WhatsApp Help -->
      <section class="card" style="text-align: center;">
        <h4 style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--color-primary); margin-bottom: 6px;">
          Have questions about today's Muhurtha?
        </h4>
        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 12px;">
          Temple Archakas are available on WhatsApp for sankalpa guidance.
        </p>
        <button class="btn btn-whatsapp" onclick="window.app.openWhatsAppGeneral('Namaskara 🙏 Inquiring about today\'s Panchanga and Darshan timings.')">
          Ask Priest on WhatsApp 🙏
        </button>
      </section>
    </div>
  `;
}
