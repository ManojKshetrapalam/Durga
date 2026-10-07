/**
 * Home View — Devotee Dashboard
 * Matches Stitch Screen: home.html
 */

import { PanchangaService } from '../services/panchangaService.js?v=20261007_07';
import { TEMPLE_TIMINGS } from '../data/timings.js?v=20261007_07';
import { templeStore } from '../services/store.js?v=20261007_07';
import { renderFestivalBanner } from '../components/festivalCard.js?v=20261007_07';

export function renderHomeView() {
  const todayPanchanga = PanchangaService.getPanchanga(new Date());
  const todayDay = new Date().getDay();
  const todaySchedule = TEMPLE_TIMINGS.schedules[todayDay];
  const announcement = templeStore.getAnnouncement();
  const events = templeStore.getEvents();
  const featuredEvent = events.find(e => e.isFeatured && e.isPublished) || events[0];
  const sevas = templeStore.getSevas().slice(0, 4); // Top 4 popular sevas

  return `
    <div class="view-home">
      <!-- Welcome Hero Card -->
      <section class="card card-gold-accent" style="background: linear-gradient(180deg, #FFFDF8 0%, #FAF2E8 100%);">
        <div class="card-header-row">
          <span class="badge badge-gold">Sri Durga Parameshwari Sannidhi</span>
          <span class="badge badge-live">Darshan Open</span>
        </div>
        <h2 style="font-family: var(--font-serif); font-size: 1.45rem; color: var(--color-primary); line-height: 1.25; margin-bottom: 6px;">
          Namaskara 🙏
        </h2>
        <p style="font-size: 0.95rem; color: var(--color-text-muted); margin-bottom: 14px;">
          Plan Your Visit. Prepare Your Prayer. Experience the Divine Mandapa.
        </p>
        <div style="display: flex; gap: 8px;">
          <button class="btn btn-primary btn-sm" onclick="window.app.navigate('poojas')">
            Explore Sevas 🪔
          </button>
          <button class="btn btn-secondary btn-sm" onclick="window.app.navigate('calendar')">
            Check Dates 📅
          </button>
        </div>
      </section>

      <!-- Grand Festival & Utsava Banner (From CMS) -->
      ${renderFestivalBanner(featuredEvent)}

      <!-- Active Announcement Broadcast (if published) -->
      ${announcement && announcement.isPublished ? `
        <div class="card" style="border-left: 4px solid var(--color-saffron); background: #FFF9F4;">
          <div style="display: flex; align-items: flex-start; gap: 10px;">
            <span style="font-size: 1.2rem;">📢</span>
            <div>
              <h4 style="font-family: var(--font-serif); font-size: 0.95rem; color: var(--color-primary); margin-bottom: 2px;">
                ${announcement.title}
              </h4>
              <p style="font-size: 0.85rem; color: var(--color-text-main);">
                ${announcement.message}
              </p>
            </div>
          </div>
        </div>
      ` : ''}

      <!-- Today at Temple: Panchanga Strip -->
      <section class="card">
        <div class="card-header-row">
          <h3 class="card-title">
            <span>☀️</span> Today's Vedic Panchanga
          </h3>
          <button class="btn btn-secondary btn-sm" style="border: none; padding: 0 4px; color: var(--color-primary);" onclick="window.app.navigate('panchanga')">
            Full Details →
          </button>
        </div>
        <p class="card-subtitle num-tabular">${todayPanchanga.formattedDate} • ${todayPanchanga.samvatsara}</p>

        <!-- Today's Festival Alert or Next Upcoming Festival Strip -->
        ${todayPanchanga.hasFestival ? `
          <div style="margin: 8px 0; padding: 6px 12px; background: linear-gradient(135deg, #FFFDF8 0%, #FFF5EB 100%); border: 1px solid #F97316; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 1rem;">🎉</span>
              <strong style="color: var(--color-primary); font-size: 0.82rem;">${todayPanchanga.primaryFestival.name}</strong>
            </div>
            <span class="badge badge-gold" style="font-size: 0.68rem;">${todayPanchanga.masa} Masa</span>
          </div>
        ` : (todayPanchanga.upcomingFestivals && todayPanchanga.upcomingFestivals.length > 0 ? `
          <div style="margin: 8px 0; padding: 6px 12px; background: #FFFDF8; border: 1px solid var(--color-border-subtle); border-radius: var(--radius-md); display: flex; align-items: center; justify-content: space-between;">
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="font-size: 0.95rem;">🗓️</span>
              <span style="font-size: 0.8rem; color: var(--color-primary); font-weight: 700;">Upcoming: ${todayPanchanga.upcomingFestivals[0].name}</span>
            </div>
            <span class="badge badge-gold" style="font-size: 0.68rem;">${todayPanchanga.upcomingFestivals[0].relativeLabel}</span>
          </div>
        ` : '')}

        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 8px;">
          <div style="padding: 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
            <span style="font-size: 0.72rem; color: var(--color-text-soft); text-transform: uppercase; font-weight: 700;">Tithi</span>
            <div style="font-weight: 700; color: var(--color-text-main); font-size: 0.95rem;">${todayPanchanga.tithi.name}</div>
          </div>
          <div style="padding: 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
            <span style="font-size: 0.72rem; color: var(--color-text-soft); text-transform: uppercase; font-weight: 700;">Nakshatra</span>
            <div style="font-weight: 700; color: var(--color-text-main); font-size: 0.95rem;">${todayPanchanga.nakshatra.name}</div>
          </div>
          <div style="padding: 10px; background: #FEF3EB; border-radius: var(--radius-md); border: 1px solid #FCD5BD;">
            <span style="font-size: 0.72rem; color: var(--color-warning); text-transform: uppercase; font-weight: 700;">Rahu Kala (Caution)</span>
            <div class="num-tabular" style="font-weight: 700; color: var(--color-warning); font-size: 0.9rem;">${todayPanchanga.rahuKala}</div>
          </div>
          <div style="padding: 10px; background: #EBF8EE; border-radius: var(--radius-md); border: 1px solid #B7E4C7;">
            <span style="font-size: 0.72rem; color: var(--color-success); text-transform: uppercase; font-weight: 700;">Abhijit Muhurtha</span>
            <div class="num-tabular" style="font-weight: 700; color: var(--color-success); font-size: 0.9rem;">${todayPanchanga.abhijitMuhurtha}</div>
          </div>
        </div>
      </section>

      <!-- Today's Temple Schedule Card -->
      <section class="card">
        <div class="card-header-row">
          <h3 class="card-title">
            <span>🕒</span> Today's Darshan Timings
          </h3>
          <span class="badge badge-maroon">${todaySchedule.dayName.split(' ')[0]}</span>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--color-canvas); border-radius: var(--radius-md);">
            <span style="font-weight: 600; font-size: 0.9rem;">🌅 Morning Darshan</span>
            <span class="num-tabular" style="font-weight: 700; color: var(--color-primary);">${todaySchedule.morning.open} – ${todaySchedule.morning.close}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: var(--color-canvas); border-radius: var(--radius-md);">
            <span style="font-weight: 600; font-size: 0.9rem;">🌇 Evening Deepotsava</span>
            <span class="num-tabular" style="font-weight: 700; color: var(--color-primary);">${todaySchedule.evening.open} – ${todaySchedule.evening.close}</span>
          </div>
          ${todaySchedule.specialEvents.length > 0 ? `
            <div style="font-size: 0.8rem; color: var(--color-saffron); font-weight: 600; padding: 4px 6px;">
              ✨ ${todaySchedule.specialEvents.join(" • ")}
            </div>
          ` : ''}
        </div>
      </section>

      <!-- Popular Poojas & Homas Grid -->
      <section>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); font-weight: 700;">
            Popular Temple Sevas
          </h3>
          <button class="btn btn-secondary btn-sm" style="border: none; padding: 0;" onclick="window.app.navigate('poojas')">
            View All 21 →
          </button>
        </div>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${sevas.map(s => `
            <div class="card" style="padding: 12px; cursor: pointer;" onclick="window.app.viewPooja('${s.id}')">
              <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                  <span class="badge ${s.isSpecial ? 'badge-saffron' : 'badge-gold'}" style="margin-bottom: 4px;">
                    ${s.badgeText || s.category.toUpperCase()}
                  </span>
                  <h4 style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--color-primary); font-weight: 700;">
                    ${s.name}
                  </h4>
                  <p style="font-size: 0.8rem; color: var(--color-text-soft);">
                    ⏱️ ${s.durationMinutes} mins • ${s.sanctumLocation}
                  </p>
                </div>
                <div style="text-align: right;">
                  <div class="num-tabular" style="font-size: 1.15rem; font-weight: 800; color: var(--color-primary);">
                    ₹${s.kanike.toLocaleString('en-IN')}
                  </div>
                  <span style="font-size: 0.7rem; color: var(--color-text-soft);">Kanike</span>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Devotee WhatsApp Desk Helper -->
      <section class="card" style="background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%); border-color: #BBF7D0;">
        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
          <div style="width: 44px; height: 44px; border-radius: 50%; background: var(--color-whatsapp); color: #FFF; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
            💬
          </div>
          <div>
            <h4 style="font-family: var(--font-serif); font-size: 1.05rem; color: #166534; font-weight: 700;">
              Ask Temple Desk on WhatsApp
            </h4>
            <p style="font-size: 0.8rem; color: #15803D;">
              Hereditary Archakas & Temple office available for Sankalpa questions.
            </p>
          </div>
        </div>
        <button class="btn btn-whatsapp" onclick="window.app.openWhatsAppGeneral()">
          Chat with Temple Office 🙏
        </button>
      </section>

      <!-- Physical Temple Location Card -->
      <section class="card">
        <h4 style="font-family: var(--font-serif); font-size: 1rem; color: var(--color-primary); margin-bottom: 4px;">
          📍 Sri Durga Parameshwari Temple
        </h4>
        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 10px;">
          Chandra Layout 1st Phase, Bengaluru - 560072<br>
          Phone: <a href="tel:08023394447" style="color: var(--color-primary); font-weight: 700; text-decoration: none;">080-23394447</a>
        </p>
        <button class="btn btn-secondary btn-sm" onclick="window.app.navigate('qr')">
          View On-Premises QR Desk 📲
        </button>
      </section>
    </div>
  `;
}
