/**
 * Sri Durga Devi Temple — Digital Mandapa: Core App Controller & Router
 */

import { renderHeader } from './components/header.js?v=20261007_07';
import { renderBottomNav } from './components/bottomNav.js?v=20261007_07';
import { showToast } from './components/toast.js?v=20261007_07';
import { renderHomeView } from './views/homeView.js?v=20261007_07';
import { renderPoojasView } from './views/poojasView.js?v=20261007_07';
import { renderPoojaDetailView } from './views/poojaDetailView.js?v=20261007_07';
import { renderCalendarView } from './views/calendarView.js?v=20261007_07';
import { renderPanchangaView } from './views/panchangaView.js?v=20261007_07';
import { renderBookingView } from './views/bookingView.js?v=20261007_07';
import { renderQrLandingView } from './views/qrLandingView.js?v=20261007_07';
import { renderAdminView } from './views/adminView.js?v=20261007_07';

import { templeStore } from './services/store.js?v=20261007_07';
import { WhatsAppService } from './services/whatsappService.js?v=20261007_07';
import { PanchangaService } from './services/panchangaService.js?v=20261007_07';

class DigitalMandapaApp {
  constructor() {
    this.currentView = 'home';
    this.viewState = {
      activeTab: 'home',
      selectedSevaId: 'durga-homa',
      selectedCategory: 'all',
      searchQuery: '',
      calendarDate: '2026-10-15',
      panchangaDate: new Date(2026, 9, 6), // 06 Oct 2026
      qrSpot: 'entrance'
    };

    this.deferredPrompt = null;
  }

  init() {
    // Check URL parameters (e.g. ?spot=entrance or hash navigation)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('spot')) {
      this.viewState.qrSpot = urlParams.get('spot');
      this.navigate('qr');
    } else {
      const hash = window.location.hash.replace('#', '');
      if (['home', 'poojas', 'calendar', 'panchanga', 'admin', 'qr'].includes(hash)) {
        this.navigate(hash);
      } else {
        this.navigate('home');
      }
    }

    this._setupGlobalListeners();
    this._registerServiceWorker();
  }

  navigate(viewName, params = {}) {
    this.currentView = viewName;
    Object.assign(this.viewState, params);

    // Map view to bottom navigation tab
    const tabMap = {
      'home': 'home',
      'poojas': 'poojas',
      'pooja-detail': 'poojas',
      'calendar': 'calendar',
      'panchanga': 'panchanga',
      'booking': 'poojas',
      'qr': 'home',
      'admin': 'more'
    };
    this.viewState.activeTab = tabMap[viewName] || 'home';

    window.location.hash = viewName;
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  render() {
    const root = document.getElementById('app-shell');
    if (!root) return;

    let contentHtml = '';
    switch (this.currentView) {
      case 'home':
        contentHtml = renderHomeView();
        break;
      case 'poojas':
        contentHtml = renderPoojasView(this.viewState.selectedCategory, this.viewState.searchQuery);
        break;
      case 'pooja-detail':
        contentHtml = renderPoojaDetailView(this.viewState.selectedSevaId);
        break;
      case 'calendar':
        contentHtml = renderCalendarView(this.viewState.calendarDate, this.viewState.selectedSevaId);
        break;
      case 'panchanga':
        contentHtml = renderPanchangaView(this.viewState.panchangaDate);
        break;
      case 'booking':
        contentHtml = renderBookingView(this.viewState.selectedSevaId, this.viewState.calendarDate);
        break;
      case 'qr':
        contentHtml = renderQrLandingView(this.viewState.qrSpot);
        break;
      case 'admin':
        contentHtml = renderAdminView();
        break;
      default:
        contentHtml = renderHomeView();
    }

    root.innerHTML = `
      ${renderHeader()}
      <main id="main-content" role="main">
        ${contentHtml}
      </main>
      ${renderBottomNav(this.viewState.activeTab)}
    `;

    this._bindInteractiveEvents();
  }

  _bindInteractiveEvents() {
    // Bottom nav clicks
    document.querySelectorAll('.bottom-nav .nav-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');
        if (tab === 'more') {
          this.navigate('admin');
        } else {
          this.navigate(tab);
        }
      });
    });

    // Admin button in header
    const adminBtn = document.getElementById('btn-admin-desk');
    if (adminBtn) {
      adminBtn.addEventListener('click', () => this.navigate('admin'));
    }

    // Bell sound button
    const bellBtn = document.getElementById('btn-sound-toggle');
    if (bellBtn) {
      bellBtn.addEventListener('click', () => {
        showToast('Om Sri Durgayai Namaha 🙏 Bell chime offered.', 'success');
      });
    }

    // Search input in poojas view
    const searchInput = document.getElementById('seva-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.viewState.searchQuery = e.target.value;
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.innerHTML = renderPoojasView(this.viewState.selectedCategory, this.viewState.searchQuery);
          // Restore focus
          const newSearch = document.getElementById('seva-search-input');
          if (newSearch) {
            newSearch.focus();
            newSearch.setSelectionRange(newSearch.value.length, newSearch.value.length);
          }
        }
      });
    }
  }

  // Pooja Actions
  viewPooja(sevaId) {
    this.navigate('pooja-detail', { selectedSevaId: sevaId });
  }

  filterSevaCategory(catId) {
    this.viewState.selectedCategory = catId;
    this.navigate('poojas');
  }

  checkSevaCalendar(sevaId) {
    this.navigate('calendar', { selectedSevaId: sevaId });
  }

  startBooking(sevaId, dateStr = null) {
    const d = dateStr || this.viewState.calendarDate || '2026-10-24';
    this.navigate('booking', { selectedSevaId: sevaId, calendarDate: d });
  }

  // Calendar Actions
  changeCalendarSeva(sevaId) {
    this.viewState.selectedSevaId = sevaId;
    this.render();
  }

  selectCalendarDate(dateStr) {
    this.viewState.calendarDate = dateStr;
    this.render();
  }

  prevMonth() {
    const cur = new Date(this.viewState.calendarDate + "T00:00:00");
    cur.setMonth(cur.getMonth() - 1);
    this.viewState.calendarDate = cur.toISOString().split('T')[0];
    this.render();
  }

  nextMonth() {
    const cur = new Date(this.viewState.calendarDate + "T00:00:00");
    cur.setMonth(cur.getMonth() + 1);
    this.viewState.calendarDate = cur.toISOString().split('T')[0];
    this.render();
  }

  // Panchanga Actions & Interactive Guidance
  stepPanchangaDate(daysOffset) {
    if (daysOffset === 'today') {
      this.viewState.panchangaDate = new Date();
    } else {
      const cur = new Date(this.viewState.panchangaDate);
      cur.setDate(cur.getDate() + Number(daysOffset));
      this.viewState.panchangaDate = cur;
    }
    this.render();
  }

  showRituGuidance() {
    const p = PanchangaService.getPanchanga(this.viewState.panchangaDate);
    const html = `
      <div class="modal-header">
        <div class="modal-title">
          <span>🌿</span> ${p.ritu} (${p.rituSanskrit})
        </div>
        <button class="icon-btn" onclick="window.app.closeModal()" aria-label="Close">✕</button>
      </div>
      <div class="modal-body">
        <div style="padding: 10px 14px; background: var(--color-gold-light); border-radius: var(--radius-md); margin-bottom: 14px;">
          <strong style="color: var(--color-gold-hover);">Meaning:</strong> ${p.rituMeaning}
        </div>
        <p style="margin-bottom: 12px; color: var(--color-text-main); font-size: 0.92rem;">
          ${p.rituDescription}
        </p>
        <div style="border-top: 1px solid var(--color-border-subtle); padding-top: 10px; font-size: 0.85rem; color: var(--color-text-soft);">
          <strong>Solar Ayana:</strong> ${p.ayana} (${p.ayanaSanskrit})<br>
          <em>${p.ayanaDescription}</em>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary btn-sm" onclick="window.app.closeModal()">Understood 🙏</button>
      </div>
    `;
    this.showModal(html);
  }

  showMuhurthaGuidance(type) {
    const p = PanchangaService.getPanchanga(this.viewState.panchangaDate);
    let title = '';
    let content = '';

    if (type === 'abhijit') {
      title = '🟢 Abhijit Muhurtha Guidance';
      content = `
        <div style="padding: 10px 14px; background: #EBF8EE; border-radius: var(--radius-md); border: 1px solid #B7E4C7; margin-bottom: 14px;">
          <strong style="color: #166534;">Window for ${p.formattedDate}:</strong><br>
          <span style="font-size: 1.1rem; font-weight: 800; color: #166534;" class="num-tabular">${p.abhijitMuhurtha}</span>
        </div>
        <h4 style="font-size: 0.95rem; color: var(--color-primary); margin-bottom: 6px;">Vedic Significance:</h4>
        <p style="margin-bottom: 10px; font-size: 0.88rem;">
          Abhijit is the 8th Muhurtha of daytime, centered squarely around the Sun's apex (Solar Noon). According to Vedic Shastras, this window is blessed by Lord Vishnu and Surya Bhagavan, dispelling planetary afflictions (doshas).
        </p>
        <h4 style="font-size: 0.95rem; color: var(--color-primary); margin-bottom: 6px;">Recommended Sacred Actions:</h4>
        <ul style="padding-left: 20px; font-size: 0.85rem; color: var(--color-text-main); margin-bottom: 12px;">
          <li>Initiating new business ventures and investments.</li>
          <li>Performing Sankalpa for Sevas and Homas.</li>
          <li>Grihapravesha, vehicle purchases, and signing documents.</li>
        </ul>
        <div style="font-size: 0.8rem; color: var(--color-text-soft); font-style: italic;">
          *Note: In authentic Vedic tradition, Abhijit Muhurtha is not observed on Wednesdays.
        </div>
      `;
    } else if (type === 'rahu') {
      title = '⚠️ Rahu Kala Guidance & Devi Worship';
      content = `
        <div style="padding: 10px 14px; background: #FEF3EB; border-radius: var(--radius-md); border: 1px solid #FCD5BD; margin-bottom: 14px;">
          <strong style="color: #9A3412;">Window for ${p.formattedDate}:</strong><br>
          <span style="font-size: 1.1rem; font-weight: 800; color: #9A3412;" class="num-tabular">${p.rahuKala}</span>
        </div>
        <h4 style="font-size: 0.95rem; color: var(--color-primary); margin-bottom: 6px;">General Rule:</h4>
        <p style="margin-bottom: 10px; font-size: 0.88rem;">
          Rahu Kala is governed by the shadow planet Rahu. It is traditionally considered inauspicious for initiating general secular activities, travel, journeys, or signing contracts.
        </p>
        <div style="background: #FFFBF0; border-left: 3px solid #D95D0F; padding: 10px 12px; margin-bottom: 12px; border-radius: 0 var(--radius-md) var(--radius-md) 0;">
          <strong style="color: #D95D0F; font-size: 0.9rem;">🔥 Temple Special Exception (Tuesday Rahukala):</strong>
          <p style="font-size: 0.85rem; margin-top: 4px; color: var(--color-text-main);">
            At Sri Durga Parameshwari Temple, Tuesday Rahu Kala (3:30 PM – 5:00 PM) is celebrated as the supreme hour for <strong>Nimbe Hannina Deepada Seva (Lemon Lamp Offering)</strong>. Lighting ghee lamps in inverted lemon halves during Tuesday Rahukala vanquishes Rahu dosha, marriage delays, and adverse planetary transit.
          </p>
        </div>
      `;
    } else if (type === 'yamaganda') {
      title = '⏳ Yamaganda Kala Guidance';
      content = `
        <div style="padding: 10px 14px; background: var(--color-canvas); border-radius: var(--radius-md); margin-bottom: 14px; border: 1px solid var(--color-border-subtle);">
          <strong style="color: var(--color-text-soft);">Window for ${p.formattedDate}:</strong><br>
          <span style="font-size: 1.1rem; font-weight: 800; color: var(--color-primary);" class="num-tabular">${p.yamaganda}</span>
        </div>
        <p style="font-size: 0.88rem; margin-bottom: 10px;">
          Yamaganda is governed by Yama, the deity of righteousness and mortality.
        </p>
        <p style="font-size: 0.85rem; color: var(--color-text-soft);">
          Activities begun during Yamaganda often face uncertainty or delays. Avoid undertaking journeys or important negotiations during this period.
        </p>
      `;
    } else {
      title = '⏳ Gulika Kala Guidance';
      content = `
        <div style="padding: 10px 14px; background: var(--color-canvas); border-radius: var(--radius-md); margin-bottom: 14px; border: 1px solid var(--color-border-subtle);">
          <strong style="color: var(--color-text-soft);">Window for ${p.formattedDate}:</strong><br>
          <span style="font-size: 1.1rem; font-weight: 800; color: var(--color-primary);" class="num-tabular">${p.gulikaKala}</span>
        </div>
        <p style="font-size: 0.88rem; margin-bottom: 10px;">
          Gulika Kala is ruled by Gulika (son of Saturn / Shani). Any action performed during Gulika tends to repeat itself.
        </p>
        <p style="font-size: 0.85rem; color: var(--color-text-soft);">
          Ideal for acquiring auspicious assets, learning, or initiating good habits that you wish to continue indefinitely. Avoid repaying debts or beginning treatments.
        </p>
      `;
    }

    const html = `
      <div class="modal-header">
        <div class="modal-title">${title}</div>
        <button class="icon-btn" onclick="window.app.closeModal()" aria-label="Close">✕</button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      <div class="modal-footer">
        <button class="btn btn-primary btn-sm" onclick="window.app.closeModal()">Close</button>
      </div>
    `;
    this.showModal(html);
  }

  previewSunPosition(pos) {
    const panchanga = PanchangaService.getPanchanga(this.viewState.panchangaDate);
    let progress = pos === 'live' ? panchanga.sunProgress : Number(pos);
    if (isNaN(progress)) progress = 0.5;

    // Direct DOM update of the SVG for smooth 60fps interaction
    const sunGroup = document.querySelector('.view-panchanga svg g');
    const sunPath = document.querySelector('.view-panchanga svg path[stroke="#D95D0F"]');
    if (sunGroup && sunPath) {
      const sunX = 20 + (200 * progress);
      const sunY = 60 - (48 * Math.sin(Math.PI * progress));
      sunGroup.setAttribute('transform', `translate(${sunX.toFixed(1)}, ${sunY.toFixed(1)})`);

      let traversedPathD = `M 20 60`;
      const steps = Math.max(2, Math.floor(progress * 20));
      for (let i = 1; i <= steps; i++) {
        const t = (progress * i) / steps;
        const px = 20 + (200 * t);
        const py = 60 - (48 * Math.sin(Math.PI * t));
        traversedPathD += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
      }
      sunPath.setAttribute('d', traversedPathD);
      showToast(`Solar horizon position set to ${(progress * 100).toFixed(0)}%`, 'info');
    }
  }

  showModal(html) {
    let overlay = document.getElementById('app-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'app-modal-overlay';
      overlay.className = 'modal-overlay';
      document.body.appendChild(overlay);
    }
    overlay.innerHTML = `<div class="modal-dialog">${html}</div>`;
    overlay.style.display = 'flex';
    overlay.onclick = (e) => {
      if (e.target === overlay) this.closeModal();
    };
  }

  closeModal() {
    const overlay = document.getElementById('app-modal-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
    }
  }

  // ==================== FESTIVAL & UTSAVA MODALS ====================
  showFestivalScheduleModal(eventId) {
    const event = templeStore.getEventById(eventId) || templeStore.getEvents()[0];
    if (!event) return;

    const html = `
      <div class="modal-header">
        <div class="modal-title">
          <span>📋</span> ${event.kannadaTitle || event.title}
        </div>
        <button class="icon-btn" onclick="window.app.closeModal()" aria-label="Close">✕</button>
      </div>
      <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
        <div style="padding: 8px 12px; background: var(--color-gold-light); border-radius: var(--radius-md); margin-bottom: 12px; font-size: 0.8rem; color: var(--color-primary);">
          <strong>10 ದಿನಗಳ ಮಹೋತ್ಸವ ಕಾರ್ಯಕ್ರಮ:</strong> ದಿನನಿತ್ಯದ ದೇವಿಯ ವಿಶೇಷ ಅಲಂಕಾರ ಮತ್ತು ಪವಿತ್ರ ಹೋಮಗಳ ವಿವರ.
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${event.dailySchedule.map(s => `
            <div style="padding: 10px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                <span class="badge badge-gold" style="font-weight: 800; font-size: 0.7rem;">ದಿನ ${s.dayNumber} • ${s.date} (${s.vara.split(' ')[0]})</span>
                <span style="font-size: 0.75rem; color: var(--color-gold-hover); font-weight: 700;">${s.tithi}</span>
              </div>
              <div style="font-weight: 800; color: var(--color-primary); font-size: 0.95rem; margin-bottom: 2px;">
                🌸 ${s.alankara}
              </div>
              <div style="font-size: 0.82rem; font-weight: 700; color: var(--color-saffron); margin-bottom: 2px;">
                🔥 ಹೋಮ: ${s.homa}
              </div>
              <div style="font-size: 0.75rem; color: var(--color-text-soft);">
                ಸಂಕಲ್ಪ ಫಲ: ${s.purpose}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="modal-footer" style="display: flex; justify-content: space-between;">
        <button class="btn btn-secondary btn-sm" onclick="window.app.closeModal()">Close</button>
        <button class="btn btn-primary btn-sm" onclick="window.app.showFestivalSevasModal('${event.id}')">View Sevas (13) →</button>
      </div>
    `;
    this.showModal(html);
  }

  showFestivalSevasModal(eventId) {
    const event = templeStore.getEventById(eventId) || templeStore.getEvents()[0];
    if (!event) return;

    const html = `
      <div class="modal-header">
        <div class="modal-title">
          <span>🪔</span> ${event.kannadaTitle || event.title} — ಸೇವಾ ವಿವರ
        </div>
        <button class="icon-btn" onclick="window.app.closeModal()" aria-label="Close">✕</button>
      </div>
      <div class="modal-body" style="max-height: 70vh; overflow-y: auto;">
        <div style="padding: 8px 12px; background: #FFF5EB; border-radius: var(--radius-md); border: 1px solid #FDBA74; margin-bottom: 12px; font-size: 0.8rem; color: var(--color-primary);">
          <strong>ವಿಶೇಷ ನವರಾತ್ರಿ ಸೇವೆಗಳು:</strong> ಸೇವಾ ಕಾಣಿಕೆಯನ್ನು ದೇವಸ್ಥಾನದ ಕೌಂಟರ್‌ನಲ್ಲಿ ಪಾವತಿಸಿ ರಶೀದಿ ಪಡೆಯಬಹುದು. ಅರ್ಚಕರೊಂದಿಗೆ ವಾಟ್ಸಾಪ್ ಮೂಲಕ ಮುಂಗಡ ಸಂಕಲ್ಪ ವಿನಂತಿಸಿ.
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${event.specialSevas.map(s => `
            <div style="padding: 10px 12px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle); display: flex; justify-content: space-between; align-items: center; gap: 8px;">
              <div style="flex: 1;">
                <div style="font-weight: 800; color: var(--color-primary); font-size: 0.92rem;">
                  ${s.name}
                </div>
                <div style="font-size: 0.75rem; color: var(--color-text-soft);">
                  ${s.description}
                </div>
              </div>
              <div style="text-align: right; flex-shrink: 0;">
                <div class="num-tabular" style="font-weight: 800; color: var(--color-primary); font-size: 1.05rem;">
                  ₹${s.price.toLocaleString('en-IN')}
                </div>
                <button class="btn btn-whatsapp" style="padding: 4px 8px; font-size: 0.7rem; margin-top: 4px;" onclick="window.app.requestFestivalSeva('${event.id}', '${s.name.replace(/'/g, "\\'")}', ${s.price})">
                  Request 💬
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary btn-sm" onclick="window.app.closeModal()">Close</button>
      </div>
    `;
    this.showModal(html);
  }

  showFestivalImageModal(imageSrc, title = 'Event Patrika') {
    const html = `
      <div class="modal-header">
        <div class="modal-title">
          <span>🖼️</span> ${title}
        </div>
        <button class="icon-btn" onclick="window.app.closeModal()" aria-label="Close">✕</button>
      </div>
      <div class="modal-body" style="padding: 8px; text-align: center; max-height: 75vh; overflow-y: auto;">
        <img src="${imageSrc}" alt="${title}" style="max-width: 100%; height: auto; border-radius: var(--radius-sm); box-shadow: 0 4px 14px rgba(0,0,0,0.2);">
      </div>
      <div class="modal-footer" style="display: flex; justify-content: space-between;">
        <a href="${imageSrc}" target="_blank" class="btn btn-secondary btn-sm" style="text-decoration: none;">Open Original ↗</a>
        <button class="btn btn-primary btn-sm" onclick="window.app.closeModal()">Close</button>
      </div>
    `;
    this.showModal(html);
  }

  requestFestivalSeva(eventId, sevaName, price) {
    const msg = encodeURIComponent(
      `ನಮಸ್ಕಾರ / Namaskara Sri Durga Parameshwari Temple Desk 🙏\n\n` +
      `I would like to offer Special Navaratri Seva:\n` +
      `🌺 Festival: ಶ್ರೀ ಶರನ್ನವರಾತ್ರಿ ಮಹೋತ್ಸವ - ೨೦೨೬\n` +
      `🪔 Seva: ${sevaName}\n` +
      `💰 Kanike: ₹${Number(price).toLocaleString('en-IN')}\n\n` +
      `Please confirm sankalpa details, day slot, and counter payment procedure. Dhanyavadagalu.`
    );
    window.open(`https://wa.me/919845012345?text=${msg}`, '_blank');
  }

  // Devotee Booking Submission
  submitBooking() {
    const sevaId = document.getElementById('form-seva-id')?.value;
    const dateStr = document.getElementById('form-date')?.value;
    const timeSlot = document.getElementById('form-slot')?.value;
    const tokenId = document.getElementById('form-token-id')?.value;
    const devoteeName = document.getElementById('form-devotee-name')?.value;
    const mobile = document.getElementById('form-mobile')?.value;
    const gothra = document.getElementById('form-gothra')?.value;
    const rashiNakshatra = document.getElementById('form-rashi-nakshatra')?.value;
    const familyMembers = document.getElementById('form-family-members')?.value;

    const selectedChips = Array.from(document.querySelectorAll('#sankalpa-chips .chip.active')).map(c => c.getAttribute('data-val'));

    const seva = templeStore.getSevaById(sevaId);

    const booking = {
      tokenId,
      sevaId,
      sevaName: seva ? seva.name : 'Durga Homa',
      date: dateStr,
      timeSlot,
      devoteeName,
      mobile,
      gothra,
      rashi: rashiNakshatra.split('•')[0]?.trim() || 'Vrishabha',
      nakshatra: rashiNakshatra.split('•')[1]?.trim() || 'Rohini',
      sankalpa: selectedChips,
      additionalNames: familyMembers,
      contribution: seva ? seva.kanike : 1501,
      bookingStatus: 'NEEDS_ARCHAKA',
      assignedArchaka: null,
      createdAt: new Date().toISOString()
    };

    // Save to local temple store
    templeStore.addBooking(booking);

    // Create WhatsApp deep link
    const { messageText, url } = WhatsAppService.createBookingLink(booking);

    showToast(`Token Generated: ${tokenId}. Opening WhatsApp...`, 'success');

    // Open WhatsApp
    setTimeout(() => {
      window.open(url, '_blank');
    }, 400);
  }

  // WhatsApp helpers
  enquireBlockedDate(dateStr, reason, sevaName) {
    const url = WhatsAppService.createAlternativeInquiryLink(dateStr, reason, sevaName);
    window.open(url, '_blank');
  }

  openWhatsAppGeneral(customMsg = null) {
    const phone = "919845012345";
    const text = customMsg || "Namaskara Sri Durga Devi Temple 🙏 Inquiring about darshan and pooja timings.";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  }

  openWhatsAppCounter(spotName) {
    const url = WhatsAppService.createCounterInquiryLink(spotName);
    window.open(url, '_blank');
  }

  // Admin Actions
  submitAdminBlock() {
    const date = document.getElementById('block-input-date').value;
    const reasonType = "MANUAL_BLOCK";
    const reasonTitle = document.getElementById('block-input-reason').value;
    const publicNotice = document.getElementById('block-input-notice').value;
    const altsRaw = document.getElementById('block-input-alts').value;
    const suggestedAlternatives = altsRaw.split(',').map(s => s.trim()).filter(Boolean);

    const blockRule = {
      id: `block-${Date.now()}`,
      date,
      reasonType,
      reasonTitle,
      publicNotice,
      suggestedAlternatives,
      createdBy: "Sri S. Ramesh (Chief Trustee)",
      createdAt: new Date().toISOString()
    };

    templeStore.addBlockedDate(blockRule);
    showToast(`Date ${date} blocked successfully. Synchronized!`, 'success');
    this.render();
  }

  unblockDate(id) {
    templeStore.removeBlockedDate(id);
    showToast(`Date unblocked. Re-opened for devotee bookings!`, 'success');
    this.render();
  }

  assignArchaka(tokenId) {
    const archakas = [
      "Pandit Narayana Bhat",
      "Pandit Subrahmanya Somayaji",
      "Pandit Venkatesh Dixit"
    ];
    const assigned = archakas[Math.floor(Math.random() * archakas.length)];
    templeStore.updateBookingStatus(tokenId, 'CONFIRMED', assigned);
    showToast(`Assigned ${assigned} to Token ${tokenId}!`, 'success');
    this.render();
  }

  promptEditAnnouncement() {
    const current = templeStore.getAnnouncement();
    const newMsg = prompt("Enter announcement text for devotee PWA:", current.message || "");
    if (newMsg !== null) {
      templeStore.updateAnnouncement({
        ...current,
        message: newMsg,
        isPublished: true
      });
      showToast("Broadcast message updated and published!", 'success');
      this.render();
    }
  }

  toggleAnnouncementPublish() {
    const current = templeStore.getAnnouncement();
    const isNowPublished = !current.isPublished;
    templeStore.updateAnnouncement({
      ...current,
      isPublished: isNowPublished
    });
    showToast(isNowPublished ? "Announcement Published 🟢" : "Announcement Hidden ⚪", 'info');
    this.render();
  }

  promptEditSevaPrice(sevaId) {
    const seva = templeStore.getSevaById(sevaId);
    if (!seva) return;
    const newPrice = prompt(`Enter new kanike amount for ${seva.name}:`, seva.kanike);
    if (newPrice !== null && !isNaN(Number(newPrice))) {
      templeStore.updateSeva(sevaId, { kanike: Number(newPrice) });
      showToast(`Updated ${seva.name} rate to ₹${newPrice}!`, 'success');
      this.render();
    }
  }

  // PWA Install Prompt
  promptPwaInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('Thank you for adding Sri Durga Devi Temple to your home screen! 🙏', 'success');
        }
        this.deferredPrompt = null;
      });
    } else {
      // Guide iOS or desktop users
      alert("To Install Sri Durga Devi Temple PWA:\n\n1. On iPhone/Safari: Tap 'Share' [↑] and select 'Add to Home Screen' [+].\n2. On Android/Chrome: Tap menu (⋮) and select 'Install app' or 'Add to Home Screen'.");
    }
  }

  _setupGlobalListeners() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const installBtn = document.getElementById('btn-install-pwa-qr');
      if (installBtn) {
        installBtn.style.display = 'inline-flex';
      }
    });

    window.addEventListener('popstate', () => {
      const hash = window.location.hash.replace('#', '') || 'home';
      if (hash !== this.currentView) {
        this.navigate(hash);
      }
    });
  }

  _registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js?v=20261007_07', { updateViaCache: 'none' })
        .then((reg) => {
          console.log('[PWA v7] Service Worker registered & active');
          // Check for worker updates immediately
          reg.update();
        })
        .catch(err => console.log('[PWA] SW register skipped or offline:', err.message));
    }
  }

  forceRefreshCache() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then(regs => {
        const unregPromises = regs.map(r => r.unregister());
        Promise.all(unregPromises).then(() => {
          if ('caches' in window) {
            caches.keys().then(keys => {
              Promise.all(keys.map(k => caches.delete(k))).then(() => {
                window.location.reload(true);
              });
            });
          } else {
            window.location.reload(true);
          }
        });
      });
    } else {
      window.location.reload(true);
    }
  }
}

// Global instance
window.app = new DigitalMandapaApp();
document.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
