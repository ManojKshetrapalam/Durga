/**
 * Sri Durga Devi Temple — Grand Devotional Landing Page Controller
 * Powers live Bengaluru Panchanga, audio chant player, seva category filters, and WhatsApp booking triggers
 */

import { SEVAS_DATA } from './data/sevas.js';
import { PanchangaService } from './services/panchangaService.js';
import { TEMPLE_TIMINGS } from './data/timings.js';
import { WhatsAppService } from './services/whatsappService.js';

class TempleLandingController {
  constructor() {
    this.currentCategory = 'all';
    this.audioElement = null;
    this.isPlayingAudio = false;
  }

  init() {
    this._initAudioPlayer();
    this._renderLivePanchangaStrip();
    this._renderSevasGrid();
  }

  // Audio Chant Player
  _initAudioPlayer() {
    this.audioElement = new Audio('assets/audio/Om-Slogan-Final.mp3');
    this.audioElement.loop = true;
    this.audioElement.volume = 0.65;

    const toggleBtn = document.getElementById('btn-play-chant');
    const statusText = document.getElementById('chant-status-text');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (this.isPlayingAudio) {
          this.audioElement.pause();
          this.isPlayingAudio = false;
          toggleBtn.innerHTML = '▶';
          if (statusText) statusText.textContent = 'Tap to play sacred chant';
        } else {
          this.audioElement.play().then(() => {
            this.isPlayingAudio = true;
            toggleBtn.innerHTML = '❚❚';
            if (statusText) statusText.textContent = 'Playing Om Sri Durgayai Namaha 🪔';
          }).catch(e => {
            console.log('Audio autoplay prevented:', e);
          });
        }
      });
    }
  }

  // Live Panchanga Strip computed dynamically
  _renderLivePanchangaStrip() {
    const stripEl = document.getElementById('panchanga-strip-container');
    if (!stripEl) return;
    const p = PanchangaService.getPanchanga(new Date());
    const festivalBanner = p.hasFestival ? `
      <div style="grid-column: 1 / -1; background: rgba(234, 88, 12, 0.25); border: 1.5px solid #F97316; border-radius: var(--radius-lg); padding: 12px 18px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.4rem;">🎉</span>
          <div>
            <div style="font-weight: 800; font-size: 1.05rem; color: #FFFDF8;">${p.primaryFestival.name} (${p.primaryFestival.kannada})</div>
            <div style="font-size: 0.8rem; color: #FED7AA;">${p.primaryFestival.description}</div>
          </div>
        </div>
        <span class="badge" style="background: #EA580C; color: #FFF; font-weight: 800; font-size: 0.75rem;">${p.masa} Masa Vrata</span>
      </div>
    ` : (p.upcomingFestivals && p.upcomingFestivals.length > 0 ? `
      <div style="grid-column: 1 / -1; background: rgba(255, 253, 248, 0.08); border: 1px solid rgba(197, 155, 39, 0.4); border-radius: var(--radius-lg); padding: 10px 18px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.2rem;">🗓️</span>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; color: #FFFDF8;">Upcoming Festival: ${p.upcomingFestivals[0].name} (${p.upcomingFestivals[0].kannada})</div>
            <div style="font-size: 0.78rem; color: #E7E5E4;">${p.upcomingFestivals[0].formattedDate} • ${p.upcomingFestivals[0].description}</div>
          </div>
        </div>
        <span class="badge badge-gold" style="font-size: 0.75rem; font-weight: 800;">${p.upcomingFestivals[0].relativeLabel}</span>
      </div>
    ` : '');

    stripEl.innerHTML = `
      ${festivalBanner}
      <div class="panchanga-strip-card">
        <div class="label">Tithi Today</div>
        <div class="val">${p.tithi.name}</div>
        <div class="sub">${p.tithi.isShukla ? 'Shukla' : 'Krishna'} • Karana: ${p.karanaDetails ? p.karanaDetails.current : 'Bava'}</div>
      </div>

      <div class="panchanga-strip-card">
        <div class="label">Nakshatra & Moon</div>
        <div class="val">${p.nakshatra.name}</div>
        <div class="sub">${p.rashi} • Till ${p.nakshatra.endTime}</div>
      </div>

      <div class="panchanga-strip-card">
        <div class="label">Ritu & Ayana</div>
        <div class="val">${p.ritu}</div>
        <div class="sub">${p.samvatsara} • ${p.ayana}</div>
      </div>

      <div class="panchanga-strip-card" style="border-color: #FCD5BD;">
        <div class="label" style="color: #FED7AA;">Rahu Kala (Bengaluru)</div>
        <div class="val num-tabular" style="color: #FFEDD5;">${p.rahuKala}</div>
        <div class="sub">${p.isTuesdaySpecialRahu ? '🔥 Special 3:30 PM Deepada Seva' : 'Inauspicious for secular starts'}</div>
      </div>

      <div class="panchanga-strip-card" style="border-color: #B7E4C7;">
        <div class="label" style="color: #BBF7D0;">Abhijit Muhurtha</div>
        <div class="val num-tabular" style="color: #DCFCE7;">${p.abhijitMuhurtha}</div>
        <div class="sub">Solar Noon apex window</div>
      </div>

      <div class="panchanga-strip-card">
        <div class="label">Solar Horizon</div>
        <div class="val num-tabular">🌅 ${p.sunrise}</div>
        <div class="sub">🌇 Sunset: ${p.sunset} (${p.daylightDuration})</div>
      </div>
    `;
  }

  // Render Sevas Grid
  _renderSevasGrid() {
    const gridEl = document.getElementById('landing-sevas-grid');
    if (!gridEl) return;

    const filtered = this.currentCategory === 'all'
      ? SEVAS_DATA
      : SEVAS_DATA.filter(s => s.category === this.currentCategory);

    gridEl.innerHTML = filtered.map(s => `
      <div class="seva-card-landing">
        <div>
          <div class="seva-card-landing-header">
            <div>
              <h3 class="seva-title-h3">${s.name}</h3>
              <div class="seva-kannada">${s.kannadaName}</div>
            </div>
            <div class="seva-price-tag num-tabular">₹${s.kanike}</div>
          </div>
          <p class="seva-desc-p">${s.description}</p>
          <div class="seva-meta-tags">
            <span class="seva-meta-tag">⏱️ ${s.durationMins} mins</span>
            <span class="seva-meta-tag">🪔 ${s.category.toUpperCase()}</span>
            ${s.allowedDays ? `<span class="seva-meta-tag" style="color: var(--color-warning);">📅 ${s.allowedDays.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')} only</span>` : '<span class="seva-meta-tag" style="color: var(--color-success);">📅 Daily</span>'}
          </div>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 14px;">
          <a href="app.html#booking" onclick="sessionStorage.setItem('sdd_preselect_seva', '${s.id}')" class="btn btn-primary btn-sm" style="flex: 1; text-align: center; text-decoration: none;">
            Book on PWA 📱
          </a>
          <button onclick="window.landing.bookSevaWhatsApp('${s.id}')" class="btn btn-whatsapp btn-sm" style="display: flex; align-items: center; justify-content: center; gap: 4px;" title="Book via WhatsApp">
            💬 WhatsApp
          </button>
        </div>
      </div>
    `).join('');
  }

  filterCategory(cat) {
    this.currentCategory = cat;
    document.querySelectorAll('.filter-pill-btn').forEach(btn => {
      if (btn.getAttribute('data-cat') === cat) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this._renderSevasGrid();
  }

  bookSevaWhatsApp(sevaId) {
    const seva = SEVAS_DATA.find(s => s.id === sevaId) || SEVAS_DATA[0];
    const text = `Namaskara Sri Durga Parameshwari Temple 🙏\nI would like to enquire and request availability for:\n• Seva: ${seva.name} (${seva.kannadaName})\n• Contribution: ₹${seva.kanike}\n• Temple: Chandra Layout, Bengaluru\n\nPlease let me know available dates and sankalpa guidelines.`;
    window.open(`https://wa.me/919845012345?text=${encodeURIComponent(text)}`, '_blank');
  }
}

// Global instance
window.landing = new TempleLandingController();
document.addEventListener('DOMContentLoaded', () => {
  window.landing.init();
});
