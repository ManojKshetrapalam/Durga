/**
 * Panchanga Month Modal View — Monthly Vedic Panchanga Calendar Grid
 * Displays complete 30-day lunar calendar with Tithi, Paksha, Nakshatra, Festivals, and Moon phases.
 * Tapping any date closes the modal and returns to the Daily Panchanga view for that date.
 */

import { PanchangaService } from '../services/panchangaService.js?v=20261007_10';

export function renderPanchangaMonthModal(year, month, selectedDateStr) {
  const data = PanchangaService.getMonthDays(year, month);
  const todayStr = new Date().toISOString().split('T')[0];

  return `
    <div class="modal-dialog-calendar">
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
          <button class="btn btn-secondary btn-sm" onclick="window.app.navPanchangaMonth(-1)" title="Previous Month">
            ‹ Prev Month
          </button>
          <div class="month-modal-title">
            <h3>${data.monthName}</h3>
            <div class="month-modal-subtitle">
              ${data.summary.masa} Masa • ${data.summary.ritu} • ${data.summary.ayana}
            </div>
            <div style="font-size: 0.68rem; color: var(--color-primary); font-weight: 700; margin-top: 1px;">
              ${data.summary.samvatsara} (${data.summary.ayanaKannada || 'ದಕ್ಷಿಣಾಯನ'})
            </div>
          </div>
          <div style="display: flex; gap: 4px;">
            <button class="btn btn-secondary btn-sm" onclick="window.app.navPanchangaMonth('today')" title="Jump to Current Month">
              Today ⏱️
            </button>
            <button class="btn btn-secondary btn-sm" onclick="window.app.navPanchangaMonth(1)" title="Next Month">
              Next Month ›
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

        <!-- 7-column Weekday Headers -->
        <div class="month-cal-weekdays">
          <div style="color: var(--color-danger);">Sun ಭಾನು</div>
          <div>Mon ಸೋಮ</div>
          <div style="color: var(--color-saffron);">Tue ಮಂಗಳ</div>
          <div>Wed ಬುಧ</div>
          <div style="color: var(--color-gold-hover);">Thu ಗುರು</div>
          <div style="color: var(--color-primary);">Fri ಶುಕ್ರ</div>
          <div>Sat ಶನಿ</div>
        </div>

        <!-- Calendar Grid -->
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
                  ${displayTithi}
                </div>

                <div class="day-nakshatra" title="Nakshatra: ${day.nakshatra}">
                  ${day.nakshatra}
                </div>

                <div class="day-badges-row">
                  ${day.isPournami ? '<span class="month-badge month-badge-pournami">🌕 Pournami</span>' : ''}
                  ${day.isAmavasya ? '<span class="month-badge month-badge-amavasya">🌑 Amavasya</span>' : ''}
                  ${day.isEkadashi ? '<span class="month-badge month-badge-ekadashi">🌾 Ekadashi</span>' : ''}
                  ${day.isMajorFestival ? `<span class="month-badge month-badge-festival" title="${day.primaryFestival}">🎉 ${day.primaryFestival}</span>` : ''}
                  ${day.isTuesdayDeepa && !day.isMajorFestival ? '<span class="month-badge" style="background:#FFF3E0;color:#C2410C;">🪔 Deepa</span>' : ''}
                  ${day.isFridayHoma && !day.isMajorFestival ? '<span class="month-badge" style="background:#FDF2F8;color:#9D174D;">🔥 Homa</span>' : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Legend bar at bottom -->
        <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 8px; border-top: 1px solid var(--color-border-subtle); padding-top: 10px; margin-top: 14px; font-size: 0.72rem; color: var(--color-text-soft);">
          <span>🌕 Full Moon (Pournami)</span>
          <span>🌑 New Moon (Amavasya)</span>
          <span>🌾 Ekadashi Vrata</span>
          <span>🎉 Sacred Festival</span>
          <span>🪔 Temple Special Pooja</span>
        </div>
        <div style="text-align: center; font-size: 0.75rem; color: var(--color-primary); font-weight: 700; margin-top: 6px;">
          👆 Tap any date to view its full Daily Panchanga, Solar Horizon Arc & Temple Schedule
        </div>
      </div>
    </div>
  `;
}
