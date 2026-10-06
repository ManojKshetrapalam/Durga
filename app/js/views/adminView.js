/**
 * Admin View — Temple Management Desk
 * Matches Stitch Screen: admin-dashboard.html
 */

import { templeStore } from '../services/store.js';

export function renderAdminView() {
  const blockedDates = templeStore.getBlockedDates();
  const sevas = templeStore.getSevas();
  const bookings = templeStore.getBookings();
  const announcement = templeStore.getAnnouncement();

  return `
    <div class="view-admin">
      <!-- Admin Top Header -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div>
          <span class="badge badge-gold" style="margin-bottom: 2px;">
            🛡️ Trustee & Archaka Desk
          </span>
          <h2 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-primary); font-weight: 700;">
            Temple Management Desk
          </h2>
          <p style="font-size: 0.75rem; color: var(--color-text-soft);">
            Sri S. Ramesh (Chief Trustee) • Logged In
          </p>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="window.app.navigate('home')">
          Devotee View 📱
        </button>
      </div>

      <!-- Live Devotee Announcement Broadcast Card -->
      <section class="card" style="border-left: 4px solid var(--color-saffron);">
        <div class="card-header-row">
          <span style="font-weight: 700; font-size: 0.85rem; color: var(--color-primary);">
            📢 Live Announcement on Devotee App
          </span>
          <button 
            class="badge ${announcement.isPublished ? 'badge-live' : 'badge-gold'}" 
            style="border: none; cursor: pointer;"
            onclick="window.app.toggleAnnouncementPublish()"
          >
            ${announcement.isPublished ? 'Published 🟢' : 'Draft ⚪'}
          </button>
        </div>
        <p style="font-size: 0.85rem; color: var(--color-text-main); margin-bottom: 8px;">
          "${announcement.message || 'No active broadcast.'}"
        </p>
        <button class="btn btn-secondary btn-sm" style="font-size: 0.75rem;" onclick="window.app.promptEditAnnouncement()">
          Edit Broadcast Message ✏️
        </button>
      </section>

      <!-- Quick Metrics Row -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
        <div class="card" style="padding: 10px; text-align: center;">
          <span style="font-size: 0.7rem; color: var(--color-text-soft); font-weight: 700;">TODAY'S SEVAS</span>
          <div class="num-tabular" style="font-size: 1.3rem; font-weight: 800; color: var(--color-primary);">18</div>
          <span style="font-size: 0.65rem; color: var(--color-success); font-weight: 600;">Confirmed</span>
        </div>
        <div class="card" style="padding: 10px; text-align: center;">
          <span style="font-size: 0.7rem; color: var(--color-text-soft); font-weight: 700;">PENDING SLIPS</span>
          <div class="num-tabular" style="font-size: 1.3rem; font-weight: 800; color: var(--color-warning);">${bookings.filter(b => b.bookingStatus === 'NEEDS_ARCHAKA').length}</div>
          <span style="font-size: 0.65rem; color: var(--color-warning); font-weight: 600;">Action Needed</span>
        </div>
        <div class="card" style="padding: 10px; text-align: center;">
          <span style="font-size: 0.7rem; color: var(--color-text-soft); font-weight: 700;">NEXT EVENT</span>
          <div style="font-size: 0.85rem; font-weight: 800; color: var(--color-primary); line-height: 1.2; margin-top: 4px;">15 Oct</div>
          <span style="font-size: 0.65rem; color: var(--color-text-soft);">Chandi Homa</span>
        </div>
      </div>

      <!-- Spiritual Calendar & Date Availability Controller -->
      <section class="card card-gold-accent">
        <div class="card-header-row">
          <h3 class="card-title">
            <span>📅</span> Calendar & Date Controller
          </h3>
          <span class="badge badge-maroon">Overrides All Rules</span>
        </div>
        <p class="card-subtitle">
          Administrative blocks take precedence over all general calendar availability.
        </p>

        <!-- Active Blocked Dates List -->
        <div style="margin-bottom: 14px;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--color-primary); margin-bottom: 6px;">
            Active Blocked Dates (${blockedDates.length}):
          </div>
          <div style="display: flex; flex-direction: column; gap: 8px;">
            ${blockedDates.map(b => `
              <div style="padding: 10px; background: #FFF5F5; border-radius: var(--radius-md); border: 1px solid #FECACA;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                  <div>
                    <strong style="color: var(--color-danger); font-size: 0.9rem;">
                      ${b.date} — ${b.reasonTitle}
                    </strong>
                    <p style="font-size: 0.8rem; color: var(--color-text-main); margin: 3px 0;">
                      ${b.publicNotice}
                    </p>
                    <div style="font-size: 0.72rem; color: var(--color-text-soft);">
                      Alternatives shown to devotees: ${b.suggestedAlternatives ? b.suggestedAlternatives.join(', ') : 'None'}
                    </div>
                  </div>
                  <button class="btn btn-secondary btn-sm" style="color: var(--color-danger); border-color: #FECACA; padding: 4px 8px;" onclick="window.app.unblockDate('${b.id}')">
                    Unblock ✕
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Quick Block Form -->
        <div style="padding: 12px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px dashed var(--color-border-gold);">
          <div style="font-weight: 700; font-size: 0.85rem; color: var(--color-primary); margin-bottom: 8px;">
            🔒 Block a Specific Date
          </div>
          <form id="admin-block-form" onsubmit="event.preventDefault(); window.app.submitAdminBlock();">
            <div class="form-group" style="margin-bottom: 8px;">
              <label class="form-label" style="font-size: 0.75rem;">Date to Block:</label>
              <input type="date" id="block-input-date" class="form-control" style="min-height: 42px; font-size: 0.85rem;" value="2026-10-28" required />
            </div>

            <div class="form-group" style="margin-bottom: 8px;">
              <label class="form-label" style="font-size: 0.75rem;">Spiritual Reason:</label>
              <select id="block-input-reason" class="form-control" style="min-height: 42px; font-size: 0.85rem;">
                <option value="Grand Festival / Temple Brahmotsava">Grand Festival / Temple Brahmotsava</option>
                <option value="Sanctum Renovation / Jeernodhara">Sanctum Renovation / Jeernodhara</option>
                <option value="Grahanam (Solar/Lunar Eclipse)">Grahanam (Solar/Lunar Eclipse)</option>
                <option value="Archaka Roster Leave / Sampradaya Closure">Archaka Roster Leave / Sampradaya Closure</option>
              </select>
            </div>

            <div class="form-group" style="margin-bottom: 8px;">
              <label class="form-label" style="font-size: 0.75rem;">Public Message on Devotee App:</label>
              <input type="text" id="block-input-notice" class="form-control" style="min-height: 42px; font-size: 0.85rem;" placeholder="e.g. Sanctum closed for Brahmotsava celebrations." value="Sanctum reserved for special temple utsava. Individual homas paused." required />
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" style="font-size: 0.75rem;">Suggested Alternative Dates (comma separated):</label>
              <input type="text" id="block-input-alts" class="form-control" style="min-height: 42px; font-size: 0.85rem;" placeholder="2026-10-29, 2026-10-31" value="2026-10-29, 2026-10-31" />
            </div>

            <button type="submit" class="btn btn-primary btn-sm" style="width: 100%;">
              Save & Broadcast Block Rule 🔒
            </button>
          </form>
        </div>
      </section>

      <!-- Devotee Booking & Request Inbox -->
      <section class="card">
        <div class="card-header-row">
          <h3 class="card-title">
            <span>📥</span> Devotee WhatsApp Requests
          </h3>
          <span class="badge badge-gold">${bookings.length} Slips</span>
        </div>
        <p class="card-subtitle">Incoming requests awaiting Archaka diary assignment</p>

        <div style="display: flex; flex-direction: column; gap: 10px;">
          ${bookings.map(b => `
            <div style="padding: 12px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                <div>
                  <strong style="color: var(--color-primary); font-size: 0.95rem;">${b.devoteeName}</strong>
                  <div class="num-tabular" style="font-size: 0.75rem; color: var(--color-text-soft);">${b.mobile}</div>
                </div>
                <span class="badge ${b.bookingStatus === 'CONFIRMED' ? 'badge-live' : 'badge-saffron'}">
                  ${b.bookingStatus === 'CONFIRMED' ? 'Confirmed' : 'Needs Archaka'}
                </span>
              </div>

              <div style="font-size: 0.82rem; margin: 4px 0;">
                🪔 <strong>${b.sevaName}</strong> (${b.date})<br>
                🌿 Gothra: ${b.gothra || 'Shiva'} • Rashi: ${b.rashi || 'Not specified'}<br>
                🎟️ Token: <span class="num-tabular" style="font-weight: 700; color: var(--color-primary);">${b.tokenId}</span>
                ${b.assignedArchaka ? `<div style="color: var(--color-success); font-weight: 600; margin-top: 2px;">Assigned: ${b.assignedArchaka}</div>` : ''}
              </div>

              <div style="display: flex; gap: 8px; margin-top: 8px;">
                <button class="btn btn-whatsapp btn-sm" style="flex: 1;" onclick="window.open('https://wa.me/${b.mobile.replace(/[^0-9]/g, '')}', '_blank')">
                  WhatsApp Reply 💬
                </button>
                ${b.bookingStatus !== 'CONFIRMED' ? `
                  <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="window.app.assignArchaka('${b.tokenId}')">
                    Assign Priest ✓
                  </button>
                ` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Seva Offerings & Kanike Catalog Management -->
      <section class="card">
        <h3 class="card-title">
          <span>🪔</span> Seva Offerings Catalog (${sevas.length})
        </h3>
        <p class="card-subtitle">Adjust kanike rates and active booking availability</p>

        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${sevas.slice(0, 5).map(s => `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: var(--color-canvas); border-radius: var(--radius-md);">
              <div>
                <strong style="font-size: 0.85rem; color: var(--color-primary);">${s.name}</strong>
                <div class="num-tabular" style="font-size: 0.78rem; font-weight: 700;">₹${s.kanike.toLocaleString('en-IN')}</div>
              </div>
              <div style="display: flex; gap: 6px;">
                <button class="btn btn-secondary btn-sm" style="font-size: 0.72rem; padding: 4px 8px;" onclick="window.app.promptEditSevaPrice('${s.id}')">
                  Edit Rate ✏️
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Desk Audit Trail -->
      <div style="padding: 10px; font-size: 0.72rem; color: var(--color-text-soft); text-align: center;">
        Desk Audit Log: Sri S. Ramesh updated 15 Oct Chandi Homa rule • Local storage synchronized.
      </div>
    </div>
  `;
}
