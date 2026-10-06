/**
 * Pooja Detail View — Full Details & Split Checklist
 * Matches Stitch Screen: pooja-detail.html
 */

import { templeStore } from '../services/store.js';

export function renderPoojaDetailView(sevaId) {
  const seva = templeStore.getSevaById(sevaId) || templeStore.getSevas()[0];

  const allowedDayNames = (seva.allowedDays && seva.allowedDays.length > 0 && seva.allowedDays.length < 7)
    ? seva.allowedDays.map(d => ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"][d]).join(", ")
    : "Conducted Daily";

  return `
    <div class="view-pooja-detail">
      <!-- Back Navigation Header -->
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <button class="icon-btn" onclick="window.app.navigate('poojas')" aria-label="Back">
          ‹
        </button>
        <span style="font-size: 0.85rem; color: var(--color-text-soft); font-weight: 600;">Back to Seva Catalog</span>
      </div>

      <!-- Hero Title Card -->
      <section class="card card-gold-accent">
        <div class="card-header-row">
          <span class="badge ${seva.isSpecial ? 'badge-saffron' : 'badge-gold'}">
            ${seva.badgeText || seva.category.toUpperCase()}
          </span>
          <span class="badge badge-maroon">Counter Kanike</span>
        </div>
        <h2 style="font-family: var(--font-serif); font-size: 1.45rem; color: var(--color-primary); font-weight: 700; line-height: 1.25; margin-bottom: 2px;">
          ${seva.name}
        </h2>
        <p style="font-size: 0.95rem; color: var(--color-gold-hover); font-weight: 600; margin-bottom: 12px;">
          ${seva.kannadaName || ''}
        </p>

        <!-- Quick Facts Matrix -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; padding-top: 8px; border-top: 1px solid var(--color-border-subtle);">
          <div style="padding: 8px; background: var(--color-canvas); border-radius: var(--radius-md);">
            <div style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">Devotee Contribution</div>
            <div class="num-tabular" style="font-size: 1.25rem; font-weight: 800; color: var(--color-primary);">₹${seva.kanike.toLocaleString('en-IN')}</div>
          </div>
          <div style="padding: 8px; background: var(--color-canvas); border-radius: var(--radius-md);">
            <div style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">Estimated Duration</div>
            <div class="num-tabular" style="font-size: 1.1rem; font-weight: 700; color: var(--color-text-main);">${seva.durationMinutes} Minutes</div>
          </div>
          <div style="padding: 8px; background: var(--color-canvas); border-radius: var(--radius-md);">
            <div style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">Sanctum Location</div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-text-main);">${seva.sanctumLocation}</div>
          </div>
          <div style="padding: 8px; background: var(--color-canvas); border-radius: var(--radius-md);">
            <div style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">Schedule / Frequency</div>
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-primary);">${allowedDayNames}</div>
          </div>
        </div>
      </section>

      <!-- Spiritual Significance -->
      <section class="card">
        <h3 class="card-title">
          <span>📜</span> Spiritual Significance
        </h3>
        <p style="font-size: 0.9rem; color: var(--color-text-main); line-height: 1.5; margin-top: 6px;">
          ${seva.description}
        </p>
        ${seva.timeSlots ? `
          <div style="margin-top: 10px; padding: 8px 12px; background: var(--color-gold-light); border-radius: var(--radius-md); font-size: 0.85rem; color: var(--color-gold-hover); font-weight: 600;">
            ⏰ Auspicious Time Slots: ${seva.timeSlots.join(' & ')}
          </div>
        ` : ''}
      </section>

      <!-- Split Checklist (Slide 5 Requirement) -->
      <section>
        <div style="margin-bottom: 8px;">
          <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); font-weight: 700;">
            Preparation & Requirements
          </h3>
          <p style="font-size: 0.8rem; color: var(--color-text-soft);">
            Clarity so devotees arrive prepared without confusion
          </p>
        </div>

        <div class="checklist-grid">
          <!-- What Temple Provides -->
          <div class="checklist-card temple">
            <h4 class="checklist-title">
              <span>🏛️</span> What the Temple Provides
            </h4>
            <ul class="checklist-list">
              ${(seva.templeProvides || []).map(item => `
                <li class="checklist-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C59B27" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>${item}</span>
                </li>
              `).join('')}
            </ul>
          </div>

          <!-- What Devotee Should Bring -->
          <div class="checklist-card devotee">
            <h4 class="checklist-title">
              <span>🌺</span> What Devotee Should Bring
            </h4>
            <ul class="checklist-list">
              ${(seva.devoteeBrings || []).map(item => `
                <li class="checklist-item">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#721C2B" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  <span>${item}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        </div>
      </section>

      <!-- Protocol & Conduct Card -->
      <section class="card" style="background: #FAF7F2; border: 1px dashed var(--color-border-gold);">
        <h4 style="font-family: var(--font-serif); font-size: 0.95rem; color: var(--color-primary); margin-bottom: 6px;">
          Sanctum Sampradaya Guidelines
        </h4>
        <ul style="font-size: 0.8rem; color: var(--color-text-muted); list-style: disc; margin-left: 18px; display: flex; flex-direction: column; gap: 4px;">
          <li>Traditional attire is requested for Yagashala & Inner Sanctum offerings (Dhoti/Kurta for gents, Saree/Salwar for ladies).</li>
          <li>Devotee family is requested to arrive 15 minutes prior to the scheduled slot for Sankalpa setup.</li>
          <li>Seva Kanike is payable at the temple billing counter upon arrival (Cash / UPI accepted).</li>
        </ul>
      </section>

      <!-- Action Buttons Row -->
      <section style="display: flex; flex-direction: column; gap: 10px; margin-top: 4px;">
        <button class="btn btn-primary" onclick="window.app.startBooking('${seva.id}')">
          Request Date & Book Seva 🪔
        </button>
        <button class="btn btn-secondary" onclick="window.app.checkSevaCalendar('${seva.id}')">
          View Date Availability Calendar 📅
        </button>
      </section>
    </div>
  `;
}
