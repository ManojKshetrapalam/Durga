/**
 * Calendar View — Smart Spiritual Calendar & Date Availability
 * Matches Stitch Screen: calendar-availability.html
 */

import { templeStore } from '../services/store.js?v=20261007_11';
import { AvailabilityEngine } from '../services/availabilityEngine.js?v=20261007_11';
import { PanchangaService } from '../services/panchangaService.js?v=20261007_11';
import { WhatsAppService } from '../services/whatsappService.js?v=20261007_11';

export function renderCalendarView(selectedDateStr = '2026-10-15', selectedSevaId = 'durga-homa') {
  const sevas = templeStore.getSevas();
  const currentSeva = templeStore.getSevaById(selectedSevaId) || sevas[0];
  
  // Parse year & month
  const selDate = new Date(selectedDateStr + "T00:00:00");
  const year = selDate.getFullYear();
  const month = selDate.getMonth(); // 0-indexed (9 = Oct)

  // Calendar days generation
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = selDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  // Evaluate current selected date
  const check = AvailabilityEngine.checkAvailability(selectedDateStr, currentSeva.id);
  const panchanga = PanchangaService.getPanchanga(selDate);

  const blockedDatesMap = new Map();
  templeStore.getBlockedDates().forEach(b => blockedDatesMap.set(b.date, b));

  return `
    <div class="view-calendar">
      <div>
        <h2 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--color-primary); font-weight: 700;">
          Spiritual Date Availability
        </h2>
        <p style="font-size: 0.85rem; color: var(--color-text-soft);">
          Temple-controlled availability with smart Vedic recommendations
        </p>
      </div>

      <!-- Responsive Device Grid (Desktop 2-Col / Mobile 1-Col) -->
      <div class="calendar-device-grid">
        <div class="calendar-col-left">
          <!-- Seva Selector Dropdown -->
      <div class="card" style="padding: 12px; margin-top: 10px;">
        <label class="form-label" for="cal-seva-select" style="font-size: 0.8rem;">Filter Availability for Seva:</label>
        <select 
          id="cal-seva-select" 
          class="form-control" 
          style="min-height: 44px; font-weight: 600; padding: 6px 12px;"
          onchange="window.app.changeCalendarSeva(this.value)"
        >
          ${sevas.map(s => `
            <option value="${s.id}" ${s.id === currentSeva.id ? 'selected' : ''}>
              ${s.name} (₹${s.kanike.toLocaleString('en-IN')})
            </option>
          `).join('')}
        </select>
      </div>

      <!-- Month Navigation Header -->
      <div class="card" style="padding: 14px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
          <button class="btn btn-secondary btn-sm" onclick="window.app.prevMonth()">‹ Prev</button>
          <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); font-weight: 700;">
            ${monthName}
          </h3>
          <button class="btn btn-secondary btn-sm" onclick="window.app.nextMonth()">Next ›</button>
        </div>

        <!-- Weekdays Header -->
        <div class="calendar-grid" style="margin-bottom: 6px;">
          <div class="cal-weekday" style="color: var(--color-danger);">Sun</div>
          <div class="cal-weekday">Mon</div>
          <div class="cal-weekday" style="color: var(--color-saffron);">Tue</div>
          <div class="cal-weekday">Wed</div>
          <div class="cal-weekday">Thu</div>
          <div class="cal-weekday" style="color: var(--color-primary);">Fri</div>
          <div class="cal-weekday">Sat</div>
        </div>

        <!-- Days Grid -->
        <div class="calendar-grid">
          ${Array(firstDay).fill('').map(() => `<div></div>`).join('')}
          ${Array(daysInMonth).fill(0).map((_, i) => {
            const dayNum = i + 1;
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = dayStr === selectedDateStr;
            const isBlocked = blockedDatesMap.has(dayStr);
            const dObj = new Date(dayStr + "T00:00:00");
            const dayOfWeek = dObj.getDay();
            const isValidSevaDay = !currentSeva.allowedDays || currentSeva.allowedDays.includes(dayOfWeek);

            let dotClass = 'cal-dot-green';
            if (isBlocked) {
              dotClass = 'cal-dot-red';
            } else if (!isValidSevaDay) {
              dotClass = 'cal-dot-gold';
            }

            return `
              <div 
                class="cal-day-cell ${isSelected ? 'selected' : ''} ${isBlocked ? 'blocked' : ''}"
                onclick="window.app.selectCalendarDate('${dayStr}')"
              >
                <span class="cal-day-num num-tabular">${dayNum}</span>
                <span class="cal-dot ${dotClass}"></span>
              </div>
            `;
          }).join('')}
        </div>

        <!-- Legend Bar -->
        <div style="display: flex; justify-content: space-around; border-top: 1px solid var(--color-border-subtle); padding-top: 10px; margin-top: 12px; font-size: 0.72rem; color: var(--color-text-soft);">
          <span style="display: flex; align-items: center; gap: 4px;">
            <span class="cal-dot cal-dot-green"></span> Available
          </span>
          <span style="display: flex; align-items: center; gap: 4px;">
            <span class="cal-dot cal-dot-red"></span> Sanctum Blocked
          </span>
          <span style="display: flex; align-items: center; gap: 4px;">
            <span class="cal-dot cal-dot-gold"></span> Special/Restricted
          </span>
        </div>
      </div>
        </div>

        <div class="calendar-col-right">
          <!-- Selected Date Detail & Resolution Card -->
          <section class="card ${check.isAvailable ? 'card-gold-accent' : ''}" style="${!check.isAvailable ? 'border-color: #FCA5A5; background: #FFFBFB;' : ''}">
        <div class="card-header-row">
          <span class="badge ${check.isAvailable ? 'badge-live' : 'badge-blocked'}">
            ${check.badgeText}
          </span>
          <span class="num-tabular" style="font-size: 0.8rem; color: var(--color-text-soft); font-weight: 600;">
            ${panchanga.formattedDate}
          </span>
        </div>

        <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); font-weight: 700; margin-bottom: 4px;">
          ${panchanga.tithi.name} • ${panchanga.nakshatra.name}
        </h3>
        <p style="font-size: 0.85rem; color: var(--color-text-muted); margin-bottom: 12px;">
          ${check.publicNotice}
        </p>

        ${!check.isAvailable ? `
          <!-- Blocked Case: Smart Alternative Recommendations -->
          <div style="padding: 12px; background: #FFF4F2; border-radius: var(--radius-md); border: 1px solid #FECACA; margin-bottom: 14px;">
            <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-danger); margin-bottom: 6px;">
              💡 Recommended Auspicious Alternative Dates:
            </div>
            <div style="display: flex; flex-direction: column; gap: 6px;">
              ${check.recommendedAlternatives.map(alt => `
                <div 
                  style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: #FFFFFF; border-radius: var(--radius-sm); border: 1px solid #FCA5A5; cursor: pointer;"
                  onclick="window.app.selectCalendarDate('${alt.date}')"
                >
                  <div>
                    <strong style="color: var(--color-primary); font-size: 0.85rem;">${alt.formattedDate}</strong>
                    <div style="font-size: 0.72rem; color: var(--color-text-soft);">${alt.tithi} • ${alt.nakshatra}</div>
                  </div>
                  <span class="badge badge-gold" style="font-size: 0.7rem;">Select Date →</span>
                </div>
              `).join('')}
            </div>
          </div>

          <button class="btn btn-whatsapp" onclick="window.app.enquireBlockedDate('${selectedDateStr}', '${check.reasonTitle || 'Sanctum Block'}', '${currentSeva.name}')">
            Enquire Priest on WhatsApp 🙏
          </button>
        ` : `
          <!-- Available Case: Instant Booking CTA -->
          <div style="padding: 10px 12px; background: var(--color-canvas); border-radius: var(--radius-md); margin-bottom: 14px; font-size: 0.85rem;">
            <strong>Auspicious Slot:</strong> ${check.muhurthaSlot}<br>
            <span style="font-size: 0.78rem; color: var(--color-text-soft);">Contribution: ₹${currentSeva.kanike.toLocaleString('en-IN')} (Payable at Counter)</span>
          </div>

          <button class="btn btn-primary" onclick="window.app.startBooking('${currentSeva.id}', '${selectedDateStr}')">
            Book Seva for this Date 🪔
          </button>
        `}
      </section>
        </div>
      </div>
    </div>
  `;
}
