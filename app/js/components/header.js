/**
 * Temple Top Sanctum Header Component
 */

export function renderHeader() {
  return `
    <header class="top-header" role="banner">
      <div class="top-header-left">
        <div class="temple-logo-mark" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L3 9v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9l-9-7z"/>
            <path d="M9 22V12h6v10"/>
            <path d="M12 2v4"/>
          </svg>
        </div>
        <div class="temple-title-group">
          <h1>Sri Durga Devi Temple</h1>
          <p>Chandra Layout 1st Phase, Bengaluru</p>
        </div>
      </div>
      <div class="top-header-actions">
        <button id="btn-live-darshan" class="icon-btn" title="Live Darshan 🪔" aria-label="Live Darshan" style="position: relative; color: var(--color-primary);">
          <span style="position: absolute; top: 4px; right: 4px; width: 8px; height: 8px; background: #E53935; border-radius: 50%; box-shadow: 0 0 6px #E53935;"></span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
          </svg>
        </button>
        <button id="btn-admin-desk" class="icon-btn" title="Temple Management Desk" aria-label="Admin Desk">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </button>
        <button id="btn-sound-toggle" class="icon-btn" title="Temple Bell Chime" aria-label="Play Bell Chime">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </button>
      </div>
    </header>
  `;
}
