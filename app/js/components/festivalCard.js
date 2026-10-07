/**
 * Festival & Event Banner Component
 * Devotee-facing festival showcases, 10-Day Alankara schedule, special sevas and image viewer.
 */

export function renderFestivalBanner(event) {
  if (!event || !event.isPublished) return '';

  return `
    <section class="card" style="background: linear-gradient(135deg, #FFFDF8 0%, #FEF5EA 100%); border: 2px solid var(--color-gold); box-shadow: 0 6px 20px rgba(114, 28, 43, 0.12); position: relative; overflow: hidden;">
      <!-- Auspicious Marigold Garland Accent -->
      <div style="position: absolute; top: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, #D95D0F 0%, #C59B27 50%, #D95D0F 100%);"></div>

      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
        <span class="badge badge-saffron" style="font-weight: 800; font-size: 0.75rem; letter-spacing: 0.5px;">
          🌺 ಮಹೋತ್ಸವದ ಆಹ್ವಾನ • TEMPLE FESTIVAL
        </span>
        <span class="badge badge-gold" style="font-size: 0.72rem; font-weight: 700;">
          11-10-2026 to 20-10-2026
        </span>
      </div>

      <div style="display: flex; gap: 14px; align-items: flex-start; margin-bottom: 12px;">
        ${event.primaryImage ? `
          <div style="flex-shrink: 0; width: 88px; height: 115px; border-radius: var(--radius-md); overflow: hidden; border: 1.5px solid var(--color-gold); box-shadow: 0 4px 10px rgba(0,0,0,0.15); cursor: pointer; position: relative;" onclick="window.app.showFestivalImageModal('${event.primaryImage}', '${event.kannadaTitle || event.title}')">
            <img src="${event.primaryImage}" alt="${event.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.style.display='none'">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.6); color: #FFF; font-size: 0.6rem; text-align: center; padding: 2px 0;">🔍 Tap to zoom</div>
          </div>
        ` : ''}

        <div style="flex: 1;">
          <h3 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-primary); font-weight: 800; line-height: 1.25; margin-bottom: 4px;">
            ${event.kannadaTitle || event.title}
          </h3>
          <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-gold-hover); margin-bottom: 4px;">
            ${event.title}
          </div>
          <p style="font-size: 0.75rem; color: var(--color-text-soft); font-style: italic; margin-bottom: 6px; line-height: 1.35;">
            "${event.shloka || 'ಯಾ ದೇವೀ ಸರ್ವಭೂತೇಷು ಛಾಯಾರೂಪೇಣ ಸಂಸ್ಥಿತಾ । ನಮಸ್ತಸ್ಯೈ ನಮೋ ನಮಃ ॥'}"
          </p>
          <div style="font-size: 0.78rem; color: var(--color-text-main); font-weight: 600;">
            ${event.highlights}
          </div>
        </div>
      </div>

      <!-- Grand Finale Highlight Box -->
      ${event.grandFinale ? `
        <div style="background: rgba(217, 93, 15, 0.08); border-left: 3px solid var(--color-saffron); border-radius: var(--radius-sm); padding: 8px 10px; margin-bottom: 12px; font-size: 0.78rem; color: var(--color-primary); line-height: 1.4;">
          <strong>🚩 ವಿಜಯದಶಮಿ ವಿಶೇಷ:</strong> ${event.grandFinale}
        </div>
      ` : ''}

      <!-- Interactive Action Buttons -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px;">
        <button class="btn btn-secondary btn-sm" onclick="window.app.showFestivalScheduleModal('${event.id}')" style="font-size: 0.78rem; padding: 7px 8px; font-weight: 700; text-align: center;">
          📋 10-Day Alankara & Homas
        </button>
        <button class="btn btn-primary btn-sm" onclick="window.app.showFestivalSevasModal('${event.id}')" style="font-size: 0.78rem; padding: 7px 8px; font-weight: 700; text-align: center;">
          🪔 Special Sevas (13)
        </button>
      </div>

      <!-- View Original Patrika Invitation Images Button -->
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-secondary btn-sm" style="flex: 1; font-size: 0.75rem; padding: 5px 8px; color: var(--color-gold-hover); border-color: var(--color-gold);" onclick="window.app.showFestivalImageModal('${event.primaryImage}', 'ಆಹ್ವಾನ ಪತ್ರಿಕೆ (Invitation Patrika)')">
          🖼️ View Invitation Card
        </button>
        <button class="btn btn-secondary btn-sm" style="flex: 1; font-size: 0.75rem; padding: 5px 8px; color: var(--color-gold-hover); border-color: var(--color-gold);" onclick="window.app.showFestivalImageModal('${event.scheduleImage || event.primaryImage}', 'ದಿನನಿತ್ಯದ ಹೋಮ ಹಾಗೂ ಸೇವಾ ಪಟ್ಟಿ (Schedule & Sevas)')">
          📜 View Seva & Rate Sheet
        </button>
      </div>

      ${event.leadership ? `
        <div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed var(--color-border-subtle); display: flex; justify-content: space-between; font-size: 0.7rem; color: var(--color-text-soft);">
          <span>Pradhana Archaka: <strong>${event.leadership.archaka}</strong></span>
          <span><strong>${event.leadership.trust}</strong></span>
        </div>
      ` : ''}
    </section>
  `;
}
