/**
 * Panchanga Month Modal View — Responsive Monthly Vedic Panchanga Calendar Grid
 * Automatically adapts between Desktop and Mobile viewports.
 * Desktop: Expansive 920px canvas, full 7 columns, complete Tithi & Nakshatra, full festival badges.
 * Mobile: Zero-overflow responsive grid, compact Vedic notation, clean indicator dots, swipeable festivals.
 * Tapping any date closes the modal and returns to the Daily Panchanga view for that date.
 */

import { PanchangaService } from '../services/panchangaService.js?v=20261007_11';

export function renderPanchangaMonthModal(year, month, selectedDateStr) {
  const data = PanchangaService.getMonthDays(year, month);
  const todayStr = new Date().toISOString().split('T')[0];

  return `
    <!-- Modal Header -->
    <div class="modal-header">
      <div class="modal-title">
        <span>🗓️</span> Monthly Vedic Panchanga
      </div>
      <button class="icon-btn" onclick="window.app.closeModal()" aria-label="Close">✕</button>
    </div>

    <div class="modal-body">
      <!-- Month Navigation Bar -->
      <div class="month-modal-nav">
        <div class="month-nav-left">
          <button class="btn btn-secondary btn-sm month-nav-btn" onclick="window.app.navPanchangaMonth(-1)" title="Previous Month">
            <span class="nav-btn-desktop">‹ Prev Month</span>
            <span class="nav-btn-mobile">‹ Prev</span>
          </button>
        </div>

        <div class="month-modal-title">
          <h3>${data.monthName}</h3>
          <div class="month-modal-subtitle">
            <span class="subtitle-desktop">${data.summary.masa} Masa • ${data.summary.ritu} • ${data.summary.ayana}</span>
            <span class="subtitle-mobile">${data.summary.masa} • ${data.summary.ayanaKannada || 'ದಕ್ಷಿಣಾಯನ'}</span>
          </div>
          <div class="month-modal-samvatsara">
            ${data.summary.samvatsara} (${data.summary.ayanaKannada || 'ದಕ್ಷಿಣಾಯನ'})
          </div>
        </div>

        <div class="month-nav-right">
          <button class="btn btn-secondary btn-sm month-nav-btn" onclick="window.app.navPanchangaMonth('today')" title="Jump to Current Month">
            <span class="nav-btn-desktop">Today ⏱️</span>
            <span class="nav-btn-mobile">Today</span>
          </button>
          <button class="btn btn-secondary btn-sm month-nav-btn" onclick="window.app.navPanchangaMonth(1)" title="Next Month">
            <span class="nav-btn-desktop">Next Month ›</span>
            <span class="nav-btn-mobile">Next ›</span>
          </button>
        </div>
      </div>

      <!-- Month Festival Highlights Strip (if festivals exist) -->
      ${data.festivalsInMonth && data.festivalsInMonth.length > 0 ? `
        <div class="month-highlights-strip">
          <div class="month-highlights-title">
            <span>🌺</span> Sacred Festivals & Vratas in ${data.monthName}:
          </div>
          <div class="month-highlights-list">
            ${data.festivalsInMonth.map(fest => `
              <button class="month-fest-chip" onclick="window.app.selectPanchangaDate('${fest.dateStr}')" title="Click to view ${fest.name}">
                ${fest.badge} (${fest.dayNum})
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- 7-column Weekday Headers (Responsive Full / Compact) -->
      <div class="month-cal-weekdays">
        <div style="color: var(--color-danger);"><span class="weekday-desktop">Sunday ಭಾನುವಾರ</span><span class="weekday-mobile">Sun ಭಾ</span></div>
        <div><span class="weekday-desktop">Monday ಸೋಮವಾರ</span><span class="weekday-mobile">Mon ಸೋ</span></div>
        <div style="color: var(--color-saffron);"><span class="weekday-desktop">Tuesday ಮಂಗಳವಾರ</span><span class="weekday-mobile">Tue ಮಂ</span></div>
        <div><span class="weekday-desktop">Wednesday ಬುಧವಾರ</span><span class="weekday-mobile">Wed ಬು</span></div>
        <div style="color: var(--color-gold-hover);"><span class="weekday-desktop">Thursday ಗುರುವಾರ</span><span class="weekday-mobile">Thu ಗು</span></div>
        <div style="color: var(--color-primary);"><span class="weekday-desktop">Friday ಶುಕ್ರವಾರ</span><span class="weekday-mobile">Fri ಶು</span></div>
        <div><span class="weekday-desktop">Saturday ಶನಿವಾರ</span><span class="weekday-mobile">Sat ಶ</span></div>
      </div>

      <!-- Calendar Grid (Strict 7 equal columns, Zero Horizontal Overflow) -->
      <div class="month-cal-grid">
        <!-- Leading empty days -->
        ${Array(data.firstDayOfWeek).fill('').map(() => `
          <div class="month-cal-empty"></div>
        `).join('')}

        <!-- Month days -->
        ${data.days.map(day => {
          const isSelected = day.dateStr === selectedDateStr;
          const isToday = day.dateStr === todayStr;
          const isShukla = day.pakshaShort === 'Shukla';

          let moonIcon = isShukla ? '🌓' : '🌘';
          if (day.isPournami) moonIcon = '🌕';
          if (day.isAmavasya) moonIcon = '🌑';

          const displayTithi = day.isPournami 
            ? 'Pournami' 
            : (day.isAmavasya ? 'Amavasya' : day.tithiName.replace('Shukla ', 'Sh. ').replace('Krishna ', 'Kr. '));

          const tNum = day.tithiNumber || 1;
          const num = (tNum > 15) ? (tNum - 15) : tNum;
          const shortTithi = day.isPournami 
            ? 'Pourn' 
            : (day.isAmavasya ? 'Amav' : `${isShukla ? 'Sh' : 'Kr'}.${num}`);

          return `
            <div class="month-cal-day ${isSelected ? 'is-selected' : ''} ${isToday ? 'is-today' : ''} ${day.hasFestival ? 'is-festival' : ''}"
                 onclick="window.app.selectPanchangaDate('${day.dateStr}')"
                 tabindex="0"
                 role="button"
                 title="${day.formattedDate}: ${day.tithiName}, ${day.nakshatra}${day.primaryFestival ? ' • ' + day.primaryFestival : ''}">
              
              <div class="day-header-row">
                <span class="day-num num-tabular">${day.dayNum}</span>
                <span class="day-moon-icon" title="${day.paksha}">${moonIcon}</span>
              </div>

              <div class="day-tithi" title="${day.tithiName}">
                <span class="tithi-desktop">${displayTithi}</span>
                <span class="tithi-mobile">${shortTithi}</span>
              </div>

              <div class="day-nakshatra" title="Nakshatra: ${day.nakshatra}">
                ${day.nakshatra}
              </div>

              <!-- Desktop Badges -->
              <div class="day-badges-desktop">
                ${day.isPournami ? '<span class="month-badge month-badge-pournami">🌕 Pournami</span>' : ''}
                ${day.isAmavasya ? '<span class="month-badge month-badge-amavasya">🌑 Amavasya</span>' : ''}
                ${day.isEkadashi ? '<span class="month-badge month-badge-ekadashi">🌾 Ekadashi</span>' : ''}
                ${day.isMajorFestival ? `<span class="month-badge month-badge-festival" title="${day.primaryFestival}">🎉 ${day.primaryFestival}</span>` : ''}
                ${day.isTuesdayDeepa && !day.isMajorFestival ? '<span class="month-badge" style="background:#FFF3E0;color:#C2410C;">🪔 Deepa</span>' : ''}
                ${day.isFridayHoma && !day.isMajorFestival ? '<span class="month-badge" style="background:#FDF2F8;color:#9D174D;">🔥 Homa</span>' : ''}
              </div>

              <!-- Mobile Indicator Dots -->
              <div class="day-indicators-mobile">
                ${day.isPournami ? '<span class="indicator-icon" title="Pournami">🌕</span>' : ''}
                ${day.isAmavasya ? '<span class="indicator-icon" title="Amavasya">🌑</span>' : ''}
                ${day.isEkadashi ? '<span class="indicator-icon" title="Ekadashi">🌾</span>' : ''}
                ${day.isMajorFestival ? `<span class="indicator-icon" title="${day.primaryFestival}">🎉</span>` : ''}
                ${day.isTuesdayDeepa && !day.isMajorFestival ? '<span class="indicator-icon" title="Tuesday Deepa">🪔</span>' : ''}
                ${day.isFridayHoma && !day.isMajorFestival ? '<span class="indicator-icon" title="Friday Homa">🔥</span>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Responsive Legend bar at bottom -->
      <div class="month-cal-legend">
        <span>🌕 Full Moon (Pournami)</span>
        <span>🌑 New Moon (Amavasya)</span>
        <span>🌾 Ekadashi Vrata</span>
        <span>🎉 Sacred Festival</span>
        <span>🪔 Temple Special Pooja</span>
      </div>
      <div style="text-align: center; font-size: 0.74rem; color: var(--color-primary); font-weight: 700; margin-top: 6px;">
        👆 Tap any date to view its full Daily Panchanga & Temple Schedule
      </div>
    </div>
  `;
}
