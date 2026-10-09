/**
 * Panchanga View — Daily Vedic Panchanga, Astronomical Solar Arc & Temple Darshan Timings
 * Features dynamic Bengaluru solar positioning, dynamic Ritu / Ayana, and interactive Kaala guidance modals.
 */

import { PanchangaService } from '../services/panchangaService.js?v=20261007_10';
import { TEMPLE_TIMINGS } from '../data/timings.js?v=20261007_10';

export function renderPanchangaView(currentDate = new Date()) {
  const panchanga = PanchangaService.getPanchanga(currentDate);
  const dayOfWeek = new Date(currentDate).getDay();
  const schedule = TEMPLE_TIMINGS.schedules[dayOfWeek];

  // Calculate sun position on arc (viewBox 0 0 240 70)
  // Arc spans from (20, 60) to (220, 60) with apex at (120, 12)
  const progress = panchanga.sunProgress; // 0.0 to 1.0
  const sunX = 20 + (200 * progress);
  const sunY = 60 - (48 * Math.sin(Math.PI * progress));

  // Traversed SVG arc path up to current sun position
  // Parametric arc points
  let traversedPathD = `M 20 60`;
  const steps = Math.max(2, Math.floor(progress * 20));
  for (let i = 1; i <= steps; i++) {
    const t = (progress * i) / steps;
    const px = 20 + (200 * t);
    const py = 60 - (48 * Math.sin(Math.PI * t));
    traversedPathD += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
  }

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
          <button class="btn btn-secondary btn-sm" onclick="window.app.stepPanchangaDate(-1)" aria-label="Previous Day">
            ‹ Prev Day
          </button>
          <div style="text-align: center;">
            <div class="num-tabular" style="font-weight: 700; color: var(--color-primary); font-size: 0.95rem;">
              ${panchanga.formattedDate}
            </div>
            <div style="font-size: 0.72rem; color: var(--color-gold-hover); font-weight: 600;">
              ${panchanga.samvatsara} • ${panchanga.ayana} (${panchanga.ayanaSanskrit})
            </div>
            <div style="font-size: 0.74rem; color: var(--color-primary); font-weight: 700; margin-top: 2px;">
              ${panchanga.masa} Masa • ${panchanga.paksha}
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.app.stepPanchangaDate(1)" aria-label="Next Day">
            Next Day ›
          </button>
        </div>
      </div>

      <!-- Responsive Device Grid (Desktop 2-Col / Mobile 1-Col) -->
      <div class="panchanga-device-grid">
        <div class="panchanga-col-left">
          <!-- Sacred Festival & Vrata Alert (if active on this day) -->
          ${panchanga.hasFestival ? `
        <section class="card" style="background: linear-gradient(135deg, #FFFDF8 0%, #FFF5EB 100%); border: 1.5px solid #F97316; box-shadow: 0 4px 14px rgba(217, 93, 15, 0.12);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; flex-wrap: wrap; gap: 4px;">
            <span class="badge" style="background: #EA580C; color: #FFF; font-weight: 800; font-size: 0.72rem; padding: 3px 8px;">
              🎉 SACRED FESTIVAL / VRATA TODAY
            </span>
            <span style="font-size: 0.75rem; color: var(--color-gold-hover); font-weight: 700;">
              ${panchanga.masa} Masa • ${panchanga.paksha}
            </span>
          </div>
          ${panchanga.festivals.map(fest => `
            <div style="margin-top: 6px; padding-top: 4px; ${panchanga.festivals.indexOf(fest) > 0 ? 'border-top: 1px dashed #FDBA74;' : ''}">
              <div style="display: flex; align-items: baseline; justify-content: space-between; flex-wrap: wrap;">
                <h3 style="font-family: var(--font-serif); font-size: 1.12rem; color: var(--color-primary); font-weight: 700; margin-bottom: 2px;">
                  ${fest.name}
                </h3>
                <span style="font-family: var(--font-serif); font-size: 0.82rem; color: var(--color-gold-hover); font-weight: 600;">
                  ${fest.kannada}
                </span>
              </div>
              <p style="font-size: 0.82rem; color: var(--color-text-main); margin-top: 2px; line-height: 1.45;">
                ${fest.description}
              </p>
            </div>
          `).join('')}
        </section>
      ` : `
        <div class="card" style="padding: 10px 14px; background: #FFFDF8; border-left: 3px solid var(--color-gold); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 6px;">
          <div>
            <div style="font-size: 0.7rem; color: var(--color-gold-hover); font-weight: 700; text-transform: uppercase;">Today's Sanctum Observance</div>
            <div style="font-size: 0.88rem; font-weight: 700; color: var(--color-primary); margin-top: 2px;">
              🪔 Nitya Mahamangalarathi & ${panchanga.tithi.name} Archana
            </div>
          </div>
          <span class="badge badge-gold" style="font-size: 0.72rem;">${panchanga.masa} Masa • ${panchanga.paksha}</span>
        </div>
      `}

      <!-- Sacred Panchanga (The 5 Limbs) -->
      <section class="card card-gold-accent">
        <div class="card-header-row">
          <h3 class="card-title">
            <span>🪔</span> Pancha-Anga (The 5 Limbs)
          </h3>
          <button class="badge badge-gold" onclick="window.app.showRituGuidance()" style="cursor: pointer; border: none;" title="Click for Season Details">
            ${panchanga.ritu} ℹ️
          </button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px;">
          <!-- Tithi -->
          <div style="padding: 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
            <div style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">1. Tithi</div>
            <div style="font-weight: 800; color: var(--color-primary); font-size: 1rem;">${panchanga.tithi.name}</div>
            <div class="num-tabular" style="font-size: 0.72rem; color: var(--color-text-soft);"><strong>${panchanga.paksha}</strong> (${panchanga.pakshaKannada})</div>
          </div>

          <!-- Nakshatra -->
          <div style="padding: 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
            <div style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">2. Nakshatra</div>
            <div style="font-weight: 800; color: var(--color-primary); font-size: 1rem;">${panchanga.nakshatra.name}</div>
            <div class="num-tabular" style="font-size: 0.72rem; color: var(--color-text-soft);">Vedic Lunar Star</div>
          </div>

          <!-- Yoga -->
          <div style="padding: 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
            <div style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">3. Yoga</div>
            <div style="font-weight: 700; color: var(--color-text-main); font-size: 0.95rem;">${panchanga.yoga}</div>
            <div style="font-size: 0.72rem; color: var(--color-success); font-weight: 600;">Auspicious Union</div>
          </div>

          <!-- Karana -->
          <div style="padding: 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
            <div style="display: flex; justify-content: space-between; align-items: baseline;">
              <div style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">4. Karana</div>
              ${panchanga.karanaDetails && panchanga.karanaDetails.isVishti ? '<span class="badge" style="background:#DC2626;color:#FFF;font-size:0.62rem;padding:1px 5px;font-weight:800;border-radius:4px;">⚠️ Bhadra</span>' : ''}
            </div>
            <div style="font-weight: 800; color: var(--color-primary); font-size: 1rem;">
              ${panchanga.karanaDetails ? panchanga.karanaDetails.current : panchanga.karana.split(' ')[0]}
              <span style="font-size: 0.75rem; color: var(--color-gold-hover); font-weight: 600;">(${panchanga.karanaDetails ? panchanga.karanaDetails.currentKannada : ''})</span>
            </div>
            <div class="num-tabular" style="font-size: 0.72rem; color: var(--color-text-soft); line-height: 1.25; margin-top: 2px;">
              Till ${panchanga.karanaDetails ? panchanga.karanaDetails.transitionTime : '12:30 PM'}, then ${panchanga.karanaDetails ? panchanga.karanaDetails.next : ''}
            </div>
          </div>
        </div>

        <!-- Moon Rashi Row -->
        <div style="margin-top: 10px; padding: 8px 12px; background: var(--color-gold-light); border-radius: var(--radius-md); display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem;">
          <span style="font-weight: 700; color: var(--color-gold-hover);">5. Chandra Rashi (Moon Sign):</span>
          <span style="font-weight: 800; color: var(--color-primary);">${panchanga.rashi}</span>
        </div>
      </section>

      <!-- Upcoming Sacred Festivals & Temple Utsavas -->
      ${panchanga.upcomingFestivals && panchanga.upcomingFestivals.length > 0 ? `
        <section class="card" style="padding: 12px 14px;">
          <div class="card-header-row" style="margin-bottom: 8px;">
            <h3 class="card-title" style="font-size: 0.95rem;">
              <span>🗓️</span> Upcoming Festivals & Vratas
            </h3>
            <span style="font-size: 0.72rem; color: var(--color-gold-hover); font-weight: 600;">${panchanga.masa} Masa • ${panchanga.paksha}</span>
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${panchanga.upcomingFestivals.map(uf => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
                <div>
                  <div style="font-weight: 700; color: var(--color-primary); font-size: 0.85rem;">
                    ${uf.name}
                  </div>
                  <div style="font-size: 0.72rem; color: var(--color-text-soft);">
                    ${uf.kannada} • ${uf.formattedDate}
                  </div>
                </div>
                <span class="badge badge-gold" style="font-size: 0.7rem; font-weight: 700; white-space: nowrap;">
                  ${uf.relativeLabel}
                </span>
              </div>
            `).join('')}
          </div>
        </section>
      ` : ''}
        </div>

        <div class="panchanga-col-right">
          <!-- Important Timings & Kaala Safeguards (Interactive) -->
          <section class="card">
        <div class="card-header-row">
          <div>
            <h3 class="card-title">
              <span>⏳</span> Kaala & Muhurtha Timings
            </h3>
            <p class="card-subtitle">Devotee guidance for sankalpa and sacred rituals</p>
          </div>
          <span style="font-size: 0.7rem; color: var(--color-text-soft); font-style: italic;">Tap any for guidance</span>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
          <!-- Abhijit Muhurtha (Interactive) -->
          <div onclick="window.app.showMuhurthaGuidance('abhijit')" 
               style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #EBF8EE; border-radius: var(--radius-md); border: 1px solid #B7E4C7; transition: transform 0.15s ease;"
               role="button" tabindex="0">
            <div>
              <div style="font-weight: 700; color: var(--color-success); font-size: 0.9rem;">
                🟢 Abhijit Muhurtha ℹ️
              </div>
              <div style="font-size: 0.72rem; color: #166534;">
                Supreme window for initiating sacred works (Noon apex)
              </div>
            </div>
            <span class="num-tabular" style="font-weight: 800; color: var(--color-success); font-size: 0.95rem;">
              ${panchanga.abhijitMuhurtha}
            </span>
          </div>

          <!-- Rahu Kala (Interactive) -->
          <div onclick="window.app.showMuhurthaGuidance('rahu')" 
               style="cursor: pointer; display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: #FEF3EB; border-radius: var(--radius-md); border: 1px solid #FCD5BD; transition: transform 0.15s ease;"
               role="button" tabindex="0">
            <div>
              <div style="font-weight: 700; color: var(--color-warning); font-size: 0.9rem;">
                ⚠️ Rahu Kala ${panchanga.isTuesdaySpecialRahu ? '🔥 (Special Pooja)' : '(Inauspicious)'} ℹ️
              </div>
              <div style="font-size: 0.72rem; color: var(--color-text-soft);">
                ${panchanga.isTuesdaySpecialRahu ? 'Tuesday 3:30 PM Durga Deepada Seva at Temple' : 'Avoid initiating general secular tasks'}
              </div>
            </div>
            <span class="num-tabular" style="font-weight: 800; color: var(--color-warning); font-size: 0.95rem;">
              ${panchanga.rahuKala}
            </span>
          </div>

          <!-- Yamaganda & Gulika -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div onclick="window.app.showMuhurthaGuidance('yamaganda')" 
                 style="cursor: pointer; padding: 8px 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);"
                 role="button" tabindex="0">
              <span style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 600;">Yamaganda ℹ️</span>
              <div class="num-tabular" style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-main);">${panchanga.yamaganda}</div>
            </div>
            <div onclick="window.app.showMuhurthaGuidance('gulika')" 
                 style="cursor: pointer; padding: 8px 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);"
                 role="button" tabindex="0">
              <span style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 600;">Gulika Kala ℹ️</span>
              <div class="num-tabular" style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-main);">${panchanga.gulikaKala}</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Astronomical Sun Arc Card (Dynamic Solar Horizon) -->
      <section class="card" style="text-align: center;">
        <div class="card-header-row" style="justify-content: space-between;">
          <h3 class="card-title" style="margin: 0;">
            <span>☀️</span> Solar Horizon Arc
          </h3>
          <span class="badge badge-gold" style="font-size: 0.72rem;">Bengaluru Solar Engine</span>
        </div>
        <p style="font-size: 0.75rem; color: var(--color-text-soft); text-align: left; margin: 4px 0 8px;">
          Calculated from real solar declination & equation of time for Bengaluru coordinates.
        </p>
        
        <!-- SVG Arc Visualization -->
        <div style="margin: 8px 0 4px; position: relative; background: linear-gradient(180deg, #FFFDF8 0%, #F5EFE6 100%); border-radius: var(--radius-md); padding: 8px 6px;">
          <svg viewBox="0 0 240 75" width="100%" height="75" style="overflow: visible;">
            <!-- Ground baseline -->
            <line x1="10" y1="62" x2="230" y2="62" stroke="#D7CCC8" stroke-width="1.5" stroke-dasharray="2 2" />

            <!-- Background Full Celestial Arc -->
            <path d="M 20 60 A 100 50 0 0 1 220 60" fill="none" stroke="#E5D8C3" stroke-width="2.5" stroke-dasharray="3 3"/>
            
            <!-- Traversed Daylight Arc Path -->
            <path d="${traversedPathD}" fill="none" stroke="#D95D0F" stroke-width="3" stroke-linecap="round"/>
            
            <!-- Dynamic Glowing Sun Disc -->
            <g transform="translate(${sunX.toFixed(1)}, ${sunY.toFixed(1)})">
              <!-- Outer Pulse Aura -->
              <circle cx="0" cy="0" r="14" fill="rgba(217, 93, 15, 0.18)">
                <animate attributeName="r" values="12;16;12" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite" />
              </circle>
              <!-- Middle Halo -->
              <circle cx="0" cy="0" r="10" fill="rgba(217, 93, 15, 0.35)"/>
              <!-- Sun Core -->
              <circle cx="0" cy="0" r="7" fill="#D95D0F"/>
              <!-- Sacred Center Dot -->
              <circle cx="0" cy="0" r="3" fill="#FFFDF8"/>
            </g>

            <!-- Marker Labels -->
            <!-- Sunrise -->
            <text x="22" y="72" font-size="9" fill="#78716C" font-weight="600" text-anchor="middle">
              🌅 ${panchanga.sunrise}
            </text>
            <!-- Sunset -->
            <text x="218" y="72" font-size="9" fill="#78716C" font-weight="600" text-anchor="middle">
              🌇 ${panchanga.sunset}
            </text>
            <!-- Solar Noon Apex -->
            <text x="120" y="24" font-size="9.5" fill="#721C2B" font-weight="700" text-anchor="middle">
              Midday Solar Noon: ${panchanga.solarNoon}
            </text>
          </svg>

          <!-- Interactive Sun Trajectory Controls -->
          <div style="display: flex; justify-content: center; gap: 8px; margin-top: 6px;">
            <button class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 3px 8px;" onclick="window.app.previewSunPosition(0.05)" title="Sunrise Horizon">
              🌅 Dawn
            </button>
            <button class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 3px 8px;" onclick="window.app.previewSunPosition(0.5)" title="Midday Peak">
              ☀️ Noon (${panchanga.solarNoon})
            </button>
            <button class="btn btn-secondary btn-sm" style="font-size: 0.7rem; padding: 3px 8px;" onclick="window.app.previewSunPosition(0.95)" title="Sunset Horizon">
              🌇 Dusk
            </button>
            ${panchanga.isToday ? `
              <button class="btn btn-primary btn-sm" style="font-size: 0.7rem; padding: 3px 8px;" onclick="window.app.previewSunPosition('live')" title="Live Position">
                ⏱️ Current Time
              </button>
            ` : ''}
          </div>
        </div>

        <div style="display: flex; justify-content: space-around; font-size: 0.82rem; border-top: 1px solid var(--color-border-subtle); padding-top: 8px; margin-top: 6px;">
          <div>🌅 <strong>Sunrise:</strong> <span class="num-tabular">${panchanga.sunrise}</span></div>
          <div>🌇 <strong>Sunset:</strong> <span class="num-tabular">${panchanga.sunset}</span></div>
          <div>⏳ <strong>Day:</strong> <span class="num-tabular">${panchanga.daylightDuration}</span></div>
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
      </div>
    </div>
  `;
}
