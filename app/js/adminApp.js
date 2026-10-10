/**
 * Sri Durga Devi Temple — Administrative Control Mandapa Webpage Controller
 * Full Desktop & Responsive Webpage Experience for Trustees and Archakas
 */

import { templeStore } from './services/store.js?v=20261007_12';
import { PanchangaService } from './services/panchangaService.js?v=20261007_12';
import { AvailabilityEngine } from './services/availabilityEngine.js?v=20261007_12';
import { WhatsAppService } from './services/whatsappService.js?v=20261007_12';
import { showToast } from './components/toast.js?v=20261007_12';
import { streamingService, STREAM_STATUS, SOURCE_TYPE } from './services/streamingService.js?v=20261010_16';
import { analyticsService, ANALYTICS_EVENT, PLATFORM_TYPE } from './services/analyticsService.js';
import { pushNotificationService, NOTIFICATION_CATEGORY } from './services/pushNotificationService.js';

class TempleAdminController {
  constructor() {
    this.isAuthenticated = false;
    this.currentAdminUser = null;
    this.currentTab = 'overview';
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.galleryFilter = 'all';
    this.currentFacingMode = 'environment';
    this.isMicMuted = false;
    this.editingLocation = null;
    this.activeBroadcastTimer = null;
  }

  init() {
    // Check saved session
    const savedSession = localStorage.getItem('sdd_admin_session');
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession);
        if (sessionData && sessionData.name) {
          this.isAuthenticated = true;
          this.currentAdminUser = sessionData;
        }
      } catch (e) {
        localStorage.removeItem('sdd_admin_session');
      }
    }

    this.render();
    this._startLiveClock();

    // Server-side live state synchronization
    const localActive = streamingService.getActiveBroadcasts();
    if (localActive.length > 0) {
      streamingService._syncSessionToServer('START', { session: localActive[0] }).then(() => {
        this.render();
      }).catch(() => {});
    } else {
      streamingService.syncLiveStateFromServer().then(() => {
        this.render();
      }).catch(() => {});
    }

    streamingService.subscribe((msg) => {
      if (['STREAM_STARTED', 'STREAM_ENDED', 'LOCATION_UPDATED'].includes(msg.type)) {
        this.render();
      }
    });
  }

  // ==================== AUTHENTICATION ====================
  loginWithPin(pinInput) {
    const validPins = ['1008', '2026', '7777'];
    if (validPins.includes(pinInput.trim())) {
      const user = {
        name: "Sri S. Ramesh",
        role: "Chief Managing Trustee",
        id: "TRUSTEE-01",
        loginTime: new Date().toLocaleTimeString('en-IN')
      };
      this._setAuthenticated(user);
      return true;
    }
    return false;
  }

  loginWithPassword(username, password) {
    if (username.trim().toLowerCase() === 'trustee' && password.trim() === 'durga2026') {
      const user = {
        name: "Sri S. Ramesh",
        role: "Chief Managing Trustee",
        id: "TRUSTEE-01",
        loginTime: new Date().toLocaleTimeString('en-IN')
      };
      this._setAuthenticated(user);
      return true;
    }
    return false;
  }

  loginDemo() {
    const user = {
      name: "Sri S. Ramesh",
      role: "Chief Managing Trustee",
      id: "TRUSTEE-01",
      loginTime: new Date().toLocaleTimeString('en-IN')
    };
    this._setAuthenticated(user);
  }

  logout() {
    this.isAuthenticated = false;
    this.currentAdminUser = null;
    localStorage.removeItem('sdd_admin_session');
    this.render();
  }

  _setAuthenticated(user) {
    this.isAuthenticated = true;
    this.currentAdminUser = user;
    localStorage.setItem('sdd_admin_session', JSON.stringify(user));
    this.render();
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    this.render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==================== RENDERING ====================
  render() {
    const root = document.getElementById('admin-root');
    if (!root) return;

    try {
      if (!this.isAuthenticated) {
        root.innerHTML = this._renderLoginScreen();
        this._bindLoginEvents();
        return;
      }

      root.innerHTML = `
        <div class="admin-app-layout">
          ${this._renderSidebar()}
          <main class="admin-main">
            ${this._renderTopBar()}
            <div class="admin-content">
              ${this._renderActiveContent()}
            </div>
          </main>
        </div>
      `;

      this._bindDashboardEvents();
    } catch (err) {
      console.error('[Admin Mandapa] Render error:', err);
      root.innerHTML = `
        <div style="min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; padding: 24px; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif;">
          <div style="font-size: 3rem;">⚠️</div>
          <h2 style="color: #721C2B; margin: 0;">Administrative Desk Notice</h2>
          <p style="color: #666; max-width: 440px; font-size: 0.9rem; line-height: 1.5;">${err.message || 'An issue occurred while loading administrative desk views.'}</p>
          <div style="display: flex; gap: 12px; margin-top: 8px;">
            <button onclick="localStorage.removeItem('sdd_admin_session'); window.location.reload();" style="padding: 10px 20px; background: #721C2B; color: #FFF; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
              Reset Session & Re-Login
            </button>
            <button onclick="window.location.reload();" style="padding: 10px 20px; background: #C59B27; color: #1C1917; border: none; border-radius: 8px; font-weight: 700; cursor: pointer;">
              Reload Desk
            </button>
          </div>
        </div>
      `;
    }
  }

  _renderLoginScreen() {
    return `
      <div class="admin-login-wrapper">
        <div class="login-card">
          <div class="login-header">
            <div class="login-crest">🪔</div>
            <h1 class="login-title">Sri Durga Devi Temple</h1>
            <p class="login-subtitle">Trustee & Archaka Administrative Desk</p>
          </div>
          <div class="login-body">
            <div class="login-tabs">
              <button class="login-tab-btn active" id="tab-pin-btn" onclick="window.admin.toggleLoginMethod('pin')">
                🔑 Trustee PIN
              </button>
              <button class="login-tab-btn" id="tab-pwd-btn" onclick="window.admin.toggleLoginMethod('pwd')">
                🛡️ Password
              </button>
            </div>

            <!-- PIN Form -->
            <form id="login-pin-form" onsubmit="event.preventDefault(); window.admin.handlePinSubmit();">
              <div class="form-group" style="text-align: center;">
                <label class="form-label" for="admin-pin-input">Enter 4-Digit Sanctum Trustee PIN</label>
                <input type="password" id="admin-pin-input" class="form-input pin-display" maxlength="4" placeholder="••••" autofocus required>
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; font-weight: 700;">
                Access Temple Desk →
              </button>
            </form>

            <!-- Password Form (Hidden initially) -->
            <form id="login-pwd-form" style="display: none;" onsubmit="event.preventDefault(); window.admin.handlePwdSubmit();">
              <div class="form-group">
                <label class="form-label" for="admin-user-input">Trustee Username</label>
                <input type="text" id="admin-user-input" class="form-input" placeholder="e.g. trustee" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="admin-pass-input">Password</label>
                <input type="password" id="admin-pass-input" class="form-input" placeholder="••••••••" required>
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%; padding: 12px; font-weight: 700;">
                Login to Desk →
              </button>
            </form>

            <div class="demo-credentials-box">
              <div style="font-weight: 700;">Quick Access for Verification:</div>
              <div>• Default PIN: <strong>1008</strong></div>
              <div>• Username: <strong>trustee</strong> | Password: <strong>durga2026</strong></div>
              <button type="button" onclick="window.admin.loginDemo()" style="margin-top: 4px;">
                ⚡ One-Click Instant Trustee Login
              </button>
            </div>

            <div style="text-align: center; margin-top: 18px;">
              <a href="index.html" style="font-size: 0.85rem; color: var(--color-primary); text-decoration: none; font-weight: 600;">
                ← Return to Devotee Landing Page
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _renderSidebar() {
    return `
      <aside class="admin-sidebar">
        <div class="sidebar-brand">
          <div class="sidebar-crest">🪔</div>
          <div class="sidebar-brand-text">
            <h2>Sri Durga Mandapa</h2>
            <span>Administrative Desk</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <button class="sidebar-nav-item ${this.currentTab === 'overview' ? 'active' : ''}" onclick="window.admin.switchTab('overview')">
            <span>📊</span> Dashboard Overview
          </button>

          <div style="padding: 8px 16px 2px; font-size: 0.72rem; text-transform: uppercase; color: var(--color-gold); font-weight: 800; letter-spacing: 0.5px;">Live Darshan & Media</div>
          <button class="sidebar-nav-item ${this.currentTab === 'live' ? 'active' : ''}" onclick="window.admin.switchTab('live')">
            <span>🎥</span> Live Broadcast Console
          </button>
          <button class="sidebar-nav-item ${this.currentTab === 'locations' ? 'active' : ''}" onclick="window.admin.switchTab('locations')">
            <span>📍</span> Streaming Locations
          </button>
          <button class="sidebar-nav-item ${this.currentTab === 'live-analytics' ? 'active' : ''}" onclick="window.admin.switchTab('live-analytics')">
            <span>📡</span> Live Darshan Analytics
          </button>

          <div style="padding: 8px 16px 2px; font-size: 0.72rem; text-transform: uppercase; color: var(--color-gold); font-weight: 800; letter-spacing: 0.5px;">Sanctum & Services</div>
          <button class="sidebar-nav-item ${this.currentTab === 'calendar' ? 'active' : ''}" onclick="window.admin.switchTab('calendar')">
            <span>📅</span> Date Blocks & Festivals
          </button>
          <button class="sidebar-nav-item ${this.currentTab === 'sevas' ? 'active' : ''}" onclick="window.admin.switchTab('sevas')">
            <span>🪔</span> Seva Catalog & Rates
          </button>
          <button class="sidebar-nav-item ${this.currentTab === 'bookings' ? 'active' : ''}" onclick="window.admin.switchTab('bookings')">
            <span>📱</span> WhatsApp Bookings Queue
          </button>
          <button class="sidebar-nav-item ${this.currentTab === 'events' ? 'active' : ''}" onclick="window.admin.switchTab('events')">
            <span>🎪</span> Festival & Events CMS
          </button>
          <button class="sidebar-nav-item ${this.currentTab === 'priests' ? 'active' : ''}" onclick="window.admin.switchTab('priests')">
            <span>🧘</span> Archakas & Priests
          </button>
          <button class="sidebar-nav-item ${this.currentTab === 'gallery' ? 'active' : ''}" onclick="window.admin.switchTab('gallery')">
            <span>🖼️</span> Photo Gallery CMS
          </button>

          <div style="padding: 8px 16px 2px; font-size: 0.72rem; text-transform: uppercase; color: var(--color-gold); font-weight: 800; letter-spacing: 0.5px;">Analytics & Alerts</div>
          <button class="sidebar-nav-item ${this.currentTab === 'analytics' ? 'active' : ''}" onclick="window.admin.switchTab('analytics')">
            <span>📈</span> Devotee Platform Analytics
          </button>
          <button class="sidebar-nav-item ${this.currentTab === 'notifications' ? 'active' : ''}" onclick="window.admin.switchTab('notifications')">
            <span>🔔</span> Web Push Notifications
          </button>
          <button class="sidebar-nav-item ${this.currentTab === 'broadcast' ? 'active' : ''}" onclick="window.admin.switchTab('broadcast')">
            <span>📢</span> Notices & Special Alerts
          </button>
          <button class="sidebar-nav-item ${this.currentTab === 'settings' ? 'active' : ''}" onclick="window.admin.switchTab('settings')">
            <span>⚙️</span> WhatsApp & Settings
          </button>
        </nav>

        <div class="sidebar-footer">
          <div class="trustee-badge">
            <div class="trustee-avatar">SR</div>
            <div>
              <div style="font-size: 0.82rem; font-weight: 700;">${this.currentAdminUser.name}</div>
              <div style="font-size: 0.7rem; color: var(--color-gold);">${this.currentAdminUser.role}</div>
            </div>
          </div>
          <button class="icon-btn" onclick="window.admin.logout()" style="color: #FFF; background: rgba(255,255,255,0.1);" title="Logout">
            🚪
          </button>
        </div>
      </aside>
    `;
  }

  _renderTopBar() {
    const todayPanchanga = PanchangaService.getPanchanga(new Date());
    return `
      <header class="admin-topbar">
        <div class="topbar-title">
          <h1>${this._getTabTitle()}</h1>
        </div>
        <div class="topbar-actions">
          <div style="text-align: right; margin-right: 12px; font-size: 0.82rem;">
            <div id="live-ist-clock" class="num-tabular" style="font-weight: 800; color: var(--color-primary); font-size: 0.95rem;">
              ${new Date().toLocaleTimeString('en-IN')} IST
            </div>
            <div style="color: var(--color-text-soft); font-size: 0.75rem;">
              🌅 ${todayPanchanga.sunrise} | 🌇 ${todayPanchanga.sunset}
            </div>
          </div>
          <a href="index.html" class="btn btn-secondary btn-sm" target="_blank" title="Preview Public Landing Page">
            🌐 Landing Page
          </a>
          <a href="app.html" class="btn btn-secondary btn-sm" target="_blank" title="Preview Devotee App">
            📱 Devotee App
          </a>
        </div>
      </header>
    `;
  }

  _getTabTitle() {
    switch (this.currentTab) {
      case 'overview': return '📊 Real-Time Operations Desk';
      case 'live': return '🎥 Live Broadcast Console & Mobile Camera';
      case 'locations': return '📍 Dynamic Streaming Locations Manager';
      case 'live-analytics': return '📡 Live Darshan Viewer Concurrency & Telemetry';
      case 'calendar': return '📅 Date Availability & Sanctum Overrides';
      case 'sevas': return '🪔 21 Authentic Sevas & Pricing Manager';
      case 'bookings': return '📱 WhatsApp Booking Requests & Priest Assignment';
      case 'events': return '🎪 Festival & Events CMS';
      case 'priests': return '🧘 Archakas & Priests Management';
      case 'gallery': return '🖼️ Temple Darshan & Prakaara Gallery CMS';
      case 'analytics': return '📈 Devotee Engagement & Platform Attribution Analytics';
      case 'notifications': return '🔔 Web Push Alerts & Broadcast Center';
      case 'broadcast': return '📢 Devotee Announcements & Special Alerts';
      case 'settings': return '⚙️ Temple WhatsApp & Contact Settings';
      default: return 'Administrative Desk';
    }
  }

  _renderActiveContent() {
    switch (this.currentTab) {
      case 'overview': return this._renderOverviewTab();
      case 'live': return this._renderLiveTab();
      case 'locations': return this._renderLocationsTab();
      case 'live-analytics': return this._renderLiveAnalyticsTab();
      case 'calendar': return this._renderCalendarTab();
      case 'sevas': return this._renderSevasTab();
      case 'bookings': return this._renderBookingsTab();
      case 'events': return this._renderEventsTab();
      case 'priests': return this._renderPriestsTab();
      case 'gallery': return this._renderGalleryTab();
      case 'analytics': return this._renderAnalyticsTab();
      case 'notifications': return this._renderNotificationsTab();
      case 'broadcast': return this._renderBroadcastTab();
      case 'settings': return this._renderSettingsTab();
      default: return this._renderOverviewTab();
    }
  }

  // ==================== TAB 1: OVERVIEW ====================
  _renderOverviewTab() {
    const sevas = templeStore.getSevas();
    const blockedDates = templeStore.getBlockedDates();
    const bookings = templeStore.getBookings();
    const priests = templeStore.getPriests();
    const gallery = templeStore.getGallery();
    const activePriestsCount = priests.filter(p => p.status === 'ACTIVE').length;
    const pendingCount = bookings.filter(b => b.bookingStatus === 'NEEDS_ARCHAKA').length;
    const panchanga = PanchangaService.getPanchanga(new Date());

    return `
      <!-- Metrics Row -->
      <div class="metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
        <div class="metric-card">
          <div class="metric-info">
            <h4>Temple Status</h4>
            <div class="metric-num" style="color: var(--color-success); font-size: 1.45rem;">OPEN 🟢</div>
            <div class="metric-sub">${panchanga.formattedDate}</div>
          </div>
          <div class="metric-icon">🏛️</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>Active Archakas</h4>
            <div class="metric-num">${priests.length}</div>
            <div class="metric-sub" style="color: var(--color-success); font-weight: 700;">${activePriestsCount} on active duty</div>
          </div>
          <div class="metric-icon">🧘</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>WhatsApp Requests</h4>
            <div class="metric-num">${bookings.length}</div>
            <div class="metric-sub" style="color: ${pendingCount > 0 ? 'var(--color-warning)' : 'var(--color-success)'}; font-weight: 700;">
              ${pendingCount} pending priest assignment
            </div>
          </div>
          <div class="metric-icon">📱</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>Active Sevas</h4>
            <div class="metric-num">${sevas.length}</div>
            <div class="metric-sub">₹10 Kumkuma to ₹1,501 Homa</div>
          </div>
          <div class="metric-icon">🪔</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>Gallery Photos</h4>
            <div class="metric-num">${gallery.length}</div>
            <div class="metric-sub">Darshan & Prakaara Photos</div>
          </div>
          <div class="metric-icon">🖼️</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>Date Overrides</h4>
            <div class="metric-num">${blockedDates.length}</div>
            <div class="metric-sub">Admin blocks in effect</div>
          </div>
          <div class="metric-icon">🛡️</div>
        </div>
      </div>

      <!-- Quick Action Shortcuts Strip -->
      <div style="display: flex; gap: 10px; margin-bottom: 24px; flex-wrap: wrap; background: #FFFDF8; padding: 14px 18px; border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); align-items: center;">
        <span style="font-weight: 700; font-size: 0.85rem; color: var(--color-primary); margin-right: 6px;">
          ⚡ Quick Actions:
        </span>
        <button class="btn btn-primary btn-sm" onclick="window.admin.openPriestEditor()">
          ➕ Add Archaka / Priest
        </button>
        <button class="btn btn-secondary btn-sm" onclick="window.admin.openGalleryEditor()">
          🖼️ Add Gallery Photo
        </button>
        <button class="btn btn-secondary btn-sm" onclick="window.admin.openNotificationEditor()">
          📢 Post Devotee Alert
        </button>
        <button class="btn btn-secondary btn-sm" onclick="window.admin.switchTab('settings')">
          ⚙️ Update WhatsApp Number
        </button>
        <button class="btn btn-secondary btn-sm" onclick="window.admin.switchTab('calendar')">
          📅 Block Temple Date
        </button>
      </div>

      <!-- Quick Action Grid -->
      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-bottom: 28px;">
        <!-- Recent WhatsApp Requests -->
        <div class="admin-table-card" style="margin-bottom: 0;">
          <div class="table-header-bar">
            <h3><span>📱</span> Recent Devotee Booking Requests</h3>
            <button class="btn btn-secondary btn-sm" onclick="window.admin.switchTab('bookings')">View All</button>
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Token ID</th>
                  <th>Devotee Name</th>
                  <th>Seva</th>
                  <th>Date & Slot</th>
                  <th>Assigned Priest</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${bookings.slice(0, 5).map(b => `
                  <tr>
                    <td><strong class="num-tabular" style="color: var(--color-primary);">${b.tokenId}</strong></td>
                    <td>${b.devoteeName}<br><span style="font-size: 0.75rem; color: var(--color-text-soft);">${b.mobile}</span></td>
                    <td><strong>${b.sevaName}</strong> (₹${b.contribution})</td>
                    <td>${b.date}<br><span style="font-size: 0.75rem; color: var(--color-text-soft);">${b.timeSlot}</span></td>
                    <td>
                      ${b.assignedArchaka 
                        ? `<span class="status-pill status-green">✓ ${b.assignedArchaka}</span>` 
                        : `<span class="status-pill status-amber">⏳ Pending</span>`}
                    </td>
                    <td>
                      ${!b.assignedArchaka 
                        ? `<button class="btn btn-primary btn-sm" onclick="window.admin.quickAssignPriest('${b.tokenId}')">Assign Priest</button>` 
                        : `<button class="btn btn-secondary btn-sm" onclick="window.admin.printTokenReceipt('${b.tokenId}')">🖨️ Receipt</button>`}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

        <!-- Quick Panchanga & Horizon Today -->
        <div class="card" style="margin: 0; background: var(--color-surface); border: 1px solid var(--color-border);">
          <div class="card-header-row">
            <h3 class="card-title"><span>☀️</span> Today's Vedic Horizon</h3>
            <span class="badge badge-gold">${panchanga.masa} Masa • ${panchanga.paksha}</span>
          </div>
          <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 10px; margin-top: 12px;">
            <div style="padding: 8px 12px; background: var(--color-canvas); border-radius: var(--radius-md);">
              <span style="color: var(--color-text-soft); font-size: 0.75rem; font-weight: 700;">TITHI & NAKSHATRA (${panchanga.paksha})</span>
              <div style="font-weight: 800; color: var(--color-primary);">${panchanga.tithi.name} • ${panchanga.nakshatra.name}</div>
            </div>
            <div style="padding: 8px 12px; background: #FEF3EB; border-radius: var(--radius-md); border: 1px solid #FCD5BD;">
              <span style="color: #9A3412; font-size: 0.75rem; font-weight: 700;">RAHU KALA TODAY</span>
              <div class="num-tabular" style="font-weight: 800; color: #9A3412;">${panchanga.rahuKala}</div>
            </div>
            <div style="padding: 8px 12px; background: #EBF8EE; border-radius: var(--radius-md); border: 1px solid #B7E4C7;">
              <span style="color: #166534; font-size: 0.75rem; font-weight: 700;">ABHIJIT MUHURTHA</span>
              <div class="num-tabular" style="font-weight: 800; color: #166534;">${panchanga.abhijitMuhurtha}</div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; padding-top: 6px; border-top: 1px solid var(--color-border-subtle);">
              <span>🌅 Sunrise: <strong>${panchanga.sunrise}</strong></span>
              <span>🌇 Sunset: <strong>${panchanga.sunset}</strong></span>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ==================== TAB 2: CALENDAR & DATE BLOCKS ====================
  _renderCalendarTab() {
    const blockedDates = templeStore.getBlockedDates();

    return `
      <!-- Block Date Form -->
      <div class="card" style="margin-bottom: 24px; background: var(--color-surface); border: 1px solid var(--color-border);">
        <h3 class="card-title" style="margin-bottom: 12px;">
          <span>🛡️</span> Create Sanctum Festival Override / Block Date
        </h3>
        <p style="font-size: 0.85rem; color: var(--color-text-soft); margin-bottom: 16px;">
          Admin supremacy rule: Any blocked date automatically overrides astrological availability across the devotee app.
        </p>

        <form onsubmit="event.preventDefault(); window.admin.submitBlockRule();">
          <div class="grid-form-row">
            <div class="form-group">
              <label class="form-label">Date to Block</label>
              <input type="date" id="admin-block-date" class="form-input" required value="2026-10-16">
            </div>
            <div class="form-group">
              <label class="form-label">Festival / Reason Title</label>
              <input type="text" id="admin-block-reason" class="form-input" placeholder="e.g. Navaratri Chandi Homa" required>
            </div>
            <div class="form-group">
              <label class="form-label">Suggested Alternative Dates (comma separated)</label>
              <input type="text" id="admin-block-alts" class="form-input" placeholder="2026-10-23, 2026-10-30">
            </div>
          </div>
          <div class="form-group">
            <label class="form-label">Devotee Public Notice Banner</label>
            <textarea id="admin-block-notice" class="form-input" rows="2" placeholder="Sanctum fully reserved for temple Maha Chandi Homa. Regular devotee sevas resume next Friday."></textarea>
          </div>
          <div style="display: flex; justify-content: flex-end; gap: 10px;">
            <button type="submit" class="btn btn-primary">
              🔒 Enforce Sanctum Block Rule
            </button>
          </div>
        </form>
      </div>

      <!-- Active Overrides Table -->
      <div class="admin-table-card">
        <div class="table-header-bar">
          <h3><span>📋</span> Currently Enforced Date Overrides (${blockedDates.length})</h3>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Reason / Festival</th>
                <th>Public Notice to Devotees</th>
                <th>Suggested Alternatives</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${blockedDates.map(b => `
                <tr>
                  <td><strong class="num-tabular" style="color: var(--color-primary); font-size: 0.95rem;">${b.date}</strong></td>
                  <td><span class="status-pill status-red">🔒 ${b.reasonTitle}</span></td>
                  <td style="max-width: 320px; font-size: 0.85rem;">${b.publicNotice}</td>
                  <td>${b.suggestedAlternatives.join(', ') || 'None'}</td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="window.admin.removeBlockRule('${b.id}')" style="color: var(--color-danger); border-color: #FCA5A5;">
                      🔓 Unblock Date
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==================== TAB 3: SEVAS & PRICING ====================
  _renderSevasTab() {
    const sevas = templeStore.getSevas();

    return `
      <div class="admin-table-card">
        <div class="table-header-bar">
          <h3><span>🪔</span> Temple Seva Catalog (21 Authentic Sevas)</h3>
          <span style="font-size: 0.85rem; color: var(--color-text-soft);">Click rate to update price instantly</span>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Seva Name (Kannada & English)</th>
                <th>Category</th>
                <th>Kanike (₹)</th>
                <th>Duration</th>
                <th>Day Constraint</th>
                <th>Max / Day</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${sevas.map(s => `
                <tr>
                  <td>
                    <div style="font-weight: 700; color: var(--color-primary);">${s.name}</div>
                    <div style="font-size: 0.78rem; color: var(--color-text-soft); font-family: var(--font-serif);">${s.kannadaName}</div>
                  </td>
                  <td><span class="status-pill status-gold">${s.category.toUpperCase()}</span></td>
                  <td>
                    <button class="btn btn-secondary btn-sm num-tabular" onclick="window.admin.editSevaPrice('${s.id}')" title="Click to edit" style="font-weight: 800; font-size: 0.95rem; color: var(--color-primary);">
                      ₹${s.kanike} ✏️
                    </button>
                  </td>
                  <td>${s.durationMins} mins</td>
                  <td>
                    ${s.allowedDays ? `<span class="status-pill status-amber">${s.allowedDays.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')} Only</span>` : '<span class="status-pill status-green">All Days</span>'}
                  </td>
                  <td>${s.maxPerDay || 'Unlimited'}</td>
                  <td>
                    <button class="btn btn-secondary btn-sm" onclick="window.admin.editSevaPrice('${s.id}')">
                      Edit
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==================== TAB 4: WHATSAPP BOOKING QUEUE ====================
  _renderBookingsTab() {
    const bookings = templeStore.getBookings();
    const priests = templeStore.getPriests();

    return `
      <div class="admin-table-card">
        <div class="table-header-bar">
          <h3><span>📱</span> WhatsApp Booking Desk & Priest Assignment</h3>
          <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary btn-sm" onclick="window.admin.printSevaDaySheet()">🖨️ Print Day Sheet</button>
            <button class="btn btn-secondary btn-sm" onclick="window.admin.exportBookingsCSV()">📥 Export CSV</button>
          </div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Token ID</th>
                <th>Devotee Details</th>
                <th>Seva & Kanike</th>
                <th>Date & Slot</th>
                <th>Gothra & Nakshatra</th>
                <th>Assigned Archaka</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.map(b => `
                <tr>
                  <td><strong class="num-tabular" style="color: var(--color-primary);">${b.tokenId}</strong></td>
                  <td>
                    <div style="font-weight: 700;">${b.devoteeName}</div>
                    <div class="num-tabular" style="font-size: 0.78rem; color: var(--color-text-soft);">${b.mobile}</div>
                  </td>
                  <td><strong>${b.sevaName}</strong><br><span class="num-tabular" style="color: var(--color-gold-hover); font-weight: 700;">₹${b.contribution}</span></td>
                  <td><span class="num-tabular">${b.date}</span><br><span style="font-size: 0.75rem; color: var(--color-text-soft);">${b.timeSlot}</span></td>
                  <td>${b.gothra || 'Kashyapa'}<br><span style="font-size: 0.75rem; color: var(--color-text-soft);">${b.rashi || 'Vrishabha'} / ${b.nakshatra || 'Rohini'}</span></td>
                  <td>
                    <select class="form-input" style="padding: 6px; font-size: 0.8rem;" onchange="window.admin.updateArchakaAssignment('${b.tokenId}', this.value)">
                      <option value="">-- Unassigned --</option>
                      ${priests.map(p => `
                        <option value="${p.name}" ${b.assignedArchaka === p.name ? 'selected' : ''}>
                          ${p.name} (${p.designation})
                        </option>
                      `).join('')}
                    </select>
                  </td>
                  <td>
                    ${b.bookingStatus === 'CONFIRMED' 
                      ? '<span class="status-pill status-green">Confirmed 🟢</span>' 
                      : '<span class="status-pill status-amber">Needs Priest ⏳</span>'}
                  </td>
                  <td>
                    <div style="display: flex; gap: 4px;">
                      <button class="btn btn-secondary btn-sm" onclick="window.admin.sendWhatsAppConfirmation('${b.tokenId}')" title="Send WhatsApp confirmation">
                        💬 WA
                      </button>
                      <button class="btn btn-secondary btn-sm" onclick="window.admin.printTokenReceipt('${b.tokenId}')" title="Print physical counter receipt">
                        🖨️
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==================== TAB 6: FESTIVAL & EVENTS CMS ====================
  _renderEventsTab() {
    const events = templeStore.getEvents();

    return `
      <div class="admin-table-card">
        <div class="table-header-bar" style="flex-wrap: wrap; gap: 12px;">
          <div>
            <h3><span>🎪</span> Festival & Events CMS</h3>
            <p style="font-size: 0.85rem; color: var(--color-text-soft); margin-top: 2px;">
              Publish authentic temple celebrations, 10-day Alankara schedules, special sevas, and deity photographs.
            </p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary btn-sm" onclick="window.admin.openEventEditor()">
              ➕ Create New Festival / Event
            </button>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 16px; padding: 20px;">
          ${events.map(ev => `
            <div style="border: 1.5px solid var(--color-border-subtle); border-radius: var(--radius-lg); padding: 18px; background: #FFFDF8; display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap;">
              <!-- Thumbnail preview -->
              <div style="width: 120px; height: 160px; border-radius: var(--radius-md); overflow: hidden; border: 2px solid var(--color-gold); flex-shrink: 0; background: #F5EFE6; display: flex; align-items: center; justify-content: center;">
                ${ev.primaryImage ? `
                  <img src="${ev.primaryImage}" alt="${ev.title}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='icons/icon.svg'">
                ` : `
                  <span style="font-size: 2rem;">🪔</span>
                `}
              </div>

              <!-- Content details -->
              <div style="flex: 1; min-width: 280px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; flex-wrap: wrap; gap: 8px;">
                  <div>
                    <h3 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--color-primary); margin-bottom: 2px;">
                      ${ev.kannadaTitle || ev.title}
                    </h3>
                    <div style="font-size: 0.95rem; font-weight: 700; color: var(--color-gold-hover);">
                      ${ev.title}
                    </div>
                  </div>
                  <div style="display: flex; gap: 6px;">
                    ${ev.isFeatured ? '<span class="badge badge-gold" style="font-weight: 800;">🌟 Featured</span>' : ''}
                    <span class="badge ${ev.isPublished ? 'badge-live' : 'badge-maroon'}">
                      ${ev.isPublished ? 'Published Live 🟢' : 'Draft ⚪'}
                    </span>
                  </div>
                </div>

                <p style="font-size: 0.85rem; color: var(--color-text-soft); font-style: italic; margin-bottom: 8px;">
                  "${ev.shloka || ''}"
                </p>

                <div style="display: flex; gap: 16px; margin-bottom: 12px; font-size: 0.85rem; flex-wrap: wrap;">
                  <span>📅 <strong>Dates:</strong> ${ev.startDate} to ${ev.endDate}</span>
                  <span>🌸 <strong>Alankara Days:</strong> ${ev.dailySchedule ? ev.dailySchedule.length : 0} days</span>
                  <span>🪔 <strong>Special Sevas:</strong> ${ev.specialSevas ? ev.specialSevas.length : 0} sevas</span>
                </div>

                <div style="font-size: 0.82rem; color: var(--color-text-main); margin-bottom: 12px; line-height: 1.4;">
                  ${ev.highlights}
                </div>

                <!-- Admin Action Buttons -->
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <button class="btn btn-secondary btn-sm" onclick="window.admin.openEventEditor('${ev.id}')">
                    ✏️ Edit Event & Images
                  </button>
                  <button class="btn btn-secondary btn-sm" onclick="window.admin.toggleEventPublish('${ev.id}')">
                    ${ev.isPublished ? 'Hide from Devotees ⚪' : 'Publish to Live App 🟢'}
                  </button>
                  <a href="app.html" target="_blank" class="btn btn-secondary btn-sm" style="text-decoration: none;">
                    📱 View in Devotee App ↗
                  </a>
                  ${events.length > 1 ? `
                    <button class="btn btn-secondary btn-sm" style="color: #DC2626;" onclick="window.admin.deleteEvent('${ev.id}')">
                      🗑️ Delete
                    </button>
                  ` : ''}
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==================== TAB 6: PRIESTS & ARCHAKAS ====================
  _renderPriestsTab() {
    const priests = templeStore.getPriests();
    const activeCount = priests.filter(p => p.status === 'ACTIVE').length;

    return `
      <div class="admin-table-card">
        <div class="table-header-bar" style="flex-wrap: wrap; gap: 12px;">
          <div>
            <h3><span>🧘</span> Sanctum Archakas & Priests (${priests.length})</h3>
            <p style="font-size: 0.85rem; color: var(--color-text-soft); margin-top: 2px;">
              Manage temple priests, assign daily sevas, sankalpas, homas, and display official credentials.
            </p>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <span class="badge badge-gold">${activeCount} On Active Duty</span>
            <button class="btn btn-primary btn-sm" onclick="window.admin.openPriestEditor()">
              ➕ Add New Archaka
            </button>
          </div>
        </div>

        <div style="padding: 20px;">
          <div class="priests-grid">
            ${priests.map(p => {
              const initials = p.name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
              return `
                <div class="priest-card">
                  <div class="priest-header">
                    ${p.photo ? `
                      <img src="${p.photo}" alt="${p.name}" class="priest-avatar" onerror="this.outerHTML='<div class=\\'priest-avatar\\'>${initials}</div>'">
                    ` : `
                      <div class="priest-avatar">${initials}</div>
                    `}
                    <div style="flex: 1; min-width: 0;">
                      <h4 class="priest-name">${p.name}</h4>
                      ${p.kannadaName ? `<div class="priest-kannada">${p.kannadaName}</div>` : ''}
                      <span class="priest-role-tag">${p.designation}</span>
                    </div>
                  </div>

                  <div class="priest-details">
                    <div class="priest-meta-row">
                      <span>Experience</span>
                      <strong>${p.experience}</strong>
                    </div>
                    <div class="priest-meta-row">
                      <span>Phone / WA</span>
                      <a href="https://wa.me/${p.phone.replace(/\\D/g, '')}" target="_blank" style="color: #15803D; text-decoration: none; font-weight: 700;">
                        ${p.phone} 💬
                      </a>
                    </div>
                    <div class="priest-meta-row">
                      <span>Duty Status</span>
                      <span class="badge ${p.status === 'ACTIVE' ? 'badge-live' : 'badge-maroon'}">
                        ${p.status === 'ACTIVE' ? 'Active 🟢' : 'On Leave ⚪'}
                      </span>
                    </div>
                    <div class="priest-meta-row" style="flex-direction: column; align-items: flex-start; gap: 6px;">
                      <span>Vedic Specializations</span>
                      <div class="priest-specs">
                        ${(p.specializations || []).map(s => `<span class="spec-chip">🪔 ${s}</span>`).join('')}
                      </div>
                    </div>
                  </div>

                  <div class="priest-actions">
                    <button class="btn btn-secondary btn-sm" onclick="window.admin.openPriestEditor('${p.id}')">
                      ✏️ Edit
                    </button>
                    <button class="btn btn-secondary btn-sm" onclick="window.admin.togglePriestStatus('${p.id}')">
                      ${p.status === 'ACTIVE' ? 'Mark On Leave' : 'Mark Active'}
                    </button>
                    ${priests.length > 1 ? `
                      <button class="btn btn-secondary btn-sm" style="color: #DC2626;" onclick="window.admin.deletePriest('${p.id}')">
                        🗑️ Remove
                      </button>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ==================== TAB 7: PHOTO GALLERY CMS ====================
  _renderGalleryTab() {
    const allGallery = templeStore.getGallery();
    const filter = this.galleryFilter || 'all';
    const photos = filter === 'all' 
      ? allGallery 
      : allGallery.filter(item => item.category === filter);

    const categories = [
      { id: 'all', label: 'All Photos' },
      { id: 'garbha_gudi', label: 'Garbha Gudi / Deity' },
      { id: 'architecture', label: 'Architecture & Gopuram' },
      { id: 'deepotsava', label: 'Deepotsava & Lights' },
      { id: 'alankara', label: 'Alankara & Flowers' },
      { id: 'utsava', label: 'Rathotsava & Utsav' }
    ];

    return `
      <div class="admin-table-card">
        <div class="table-header-bar" style="flex-wrap: wrap; gap: 12px;">
          <div>
            <h3><span>🖼️</span> Temple Darshan & Prakaara Gallery CMS (${allGallery.length})</h3>
            <p style="font-size: 0.85rem; color: var(--color-text-soft); margin-top: 2px;">
              Upload sacred photographs, darshan glimpses, and festival celebrations for devotee landing page and app.
            </p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary btn-sm" onclick="window.admin.openGalleryEditor()">
              ➕ Add Gallery Photo
            </button>
          </div>
        </div>

        <!-- Filter tabs -->
        <div style="padding: 14px 20px 0; display: flex; gap: 8px; flex-wrap: wrap; border-bottom: 1px solid var(--color-border-subtle);">
          ${categories.map(cat => `
            <button 
              class="btn btn-sm ${filter === cat.id ? 'btn-primary' : 'btn-secondary'}" 
              style="border-radius: 20px; font-size: 0.8rem;" 
              onclick="window.admin.filterGalleryCategory('${cat.id}')">
              ${cat.label}
            </button>
          `).join('')}
        </div>

        <div style="padding: 20px;">
          <div class="admin-gallery-grid">
            ${photos.map(item => `
              <div class="admin-gallery-card">
                <div class="admin-gallery-thumb-wrap">
                  <img src="${item.url}" alt="${item.title}" class="admin-gallery-thumb" onerror="this.src='icons/icon.svg'">
                  <span class="admin-gallery-cat-badge">${(item.category || 'darshan').toUpperCase()}</span>
                </div>
                <div class="admin-gallery-body">
                  <h4 class="admin-gallery-title">${item.title}</h4>
                  ${item.kannadaTitle ? `<div style="font-size: 0.78rem; color: var(--color-gold-hover); margin-bottom: 4px;">${item.kannadaTitle}</div>` : ''}
                  <p class="admin-gallery-caption">${item.caption || ''}</p>
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; font-size: 0.75rem; color: var(--color-text-soft);">
                    <span>📅 ${item.dateAdded || 'Temple Archive'}</span>
                    <span>Order: #${item.order || 1}</span>
                  </div>
                  <div class="admin-gallery-actions">
                    <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="window.admin.openGalleryEditor('${item.id}')">
                      ✏️ Edit
                    </button>
                    <button class="btn btn-secondary btn-sm" style="color: #DC2626;" onclick="window.admin.deleteGalleryItem('${item.id}')">
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ==================== TAB 8: NOTICES & SPECIAL ALERTS ====================
  _renderBroadcastTab() {
    const ann = templeStore.getAnnouncement();
    const notifications = templeStore.getSpecialNotifications();

    return `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <!-- Card 1: Top Devotee Notice Banner -->
        <div class="card" style="background: var(--color-surface); border: 1px solid var(--color-border); margin: 0;">
          <div class="card-header-row">
            <h3 class="card-title"><span>📢</span> Devotee Top Notice Board & Marquee</h3>
            <span class="badge ${ann.isPublished ? 'badge-live' : 'badge-maroon'}">
              ${ann.isPublished ? 'Live on App & Web 🟢' : 'Notice Hidden ⚪'}
            </span>
          </div>
          <p style="font-size: 0.85rem; color: var(--color-text-soft); margin-bottom: 16px;">
            This high-priority banner appears prominently at the very top of the Devotee App and Web Landing Page.
          </p>

          <form onsubmit="event.preventDefault(); window.admin.updateAnnouncement();">
            <div class="form-group">
              <label class="form-label">Broadcast Announcement Text</label>
              <textarea id="broadcast-input-msg" class="form-input" rows="3" required>${ann.message || ''}</textarea>
            </div>

            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 14px;">
              <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
                <input type="checkbox" id="broadcast-input-publish" ${ann.isPublished ? 'checked' : ''} style="width: 18px; height: 18px;">
                <span style="font-weight: 700; color: var(--color-primary);">Publish Banner Live 🟢</span>
              </label>
              <button type="submit" class="btn btn-primary">
                💾 Save & Broadcast Banner
              </button>
            </div>
          </form>
        </div>

        <!-- Card 2: Special Devotee In-App Alerts & Push Streams -->
        <div class="admin-table-card" style="margin: 0;">
          <div class="table-header-bar" style="flex-wrap: wrap; gap: 12px;">
            <div>
              <h3><span>🔔</span> Special In-App Notifications & Event Alerts (${notifications.length})</h3>
              <p style="font-size: 0.85rem; color: var(--color-text-soft); margin-top: 2px;">
                Broadcast time-sensitive notices (Navaratri timings, Friday Durga Homa slots, Solar Eclipse alerts) with interactive action buttons.
              </p>
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.admin.openNotificationEditor()">
              ➕ Create Special Alert
            </button>
          </div>

          <div style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
            ${notifications.map(n => `
              <div class="notif-card ${n.type || 'general'}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap;">
                  <div style="flex: 1; min-width: 260px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                      <span class="badge ${n.type === 'urgent' ? 'badge-maroon' : (n.type === 'auspicious' ? 'badge-gold' : 'badge-saffron')}">
                        ${(n.type || 'GENERAL').toUpperCase()}
                      </span>
                      <strong style="color: var(--color-primary); font-size: 1.05rem;">${n.title}</strong>
                      ${n.kannadaTitle ? `<span style="font-size: 0.85rem; color: var(--color-gold-hover);">(${n.kannadaTitle})</span>` : ''}
                    </div>
                    <p style="font-size: 0.88rem; color: var(--color-text-main); margin-bottom: 8px; line-height: 1.45;">
                      ${n.message}
                    </p>
                    ${n.actionText ? `
                      <div style="display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; color: var(--color-primary); background: rgba(114,28,43,0.06); padding: 4px 10px; border-radius: var(--radius-sm);">
                        🔗 CTA: ${n.actionText} → <span style="color: var(--color-text-soft);">${n.actionUrl || ''}</span>
                      </div>
                    ` : ''}
                  </div>

                  <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
                    <span class="badge ${n.isActive ? 'badge-live' : 'badge-maroon'}">
                      ${n.isActive ? 'Active Devotee Alert 🟢' : 'Muted / Draft ⚪'}
                    </span>
                    <div style="display: flex; gap: 6px;">
                      <button class="btn btn-secondary btn-sm" onclick="window.admin.openNotificationEditor('${n.id}')">
                        ✏️ Edit
                      </button>
                      <button class="btn btn-secondary btn-sm" onclick="window.admin.toggleNotificationStatus('${n.id}')">
                        ${n.isActive ? 'Mute' : 'Activate'}
                      </button>
                      <button class="btn btn-secondary btn-sm" style="color: #DC2626;" onclick="window.admin.deleteNotification('${n.id}')">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  // ==================== TAB 9: SETTINGS & WHATSAPP ====================
  _renderSettingsTab() {
    const config = templeStore.getContactConfig();

    return `
      <div style="max-width: 860px; display: flex; flex-direction: column; gap: 24px;">
        <!-- WhatsApp Configuration Card -->
        <div class="settings-card">
          <h3 class="settings-section-title">
            <span>💬</span> Official Temple WhatsApp Number & Configuration
          </h3>
          <p class="settings-help">
            All devotee seva bookings, counter receipts, inquiry deep-links, and alternative date suggestions connect to this WhatsApp account.
          </p>

          <form onsubmit="event.preventDefault(); window.admin.saveContactSettings();">
            <div class="grid-form-row">
              <div class="form-group">
                <label class="form-label" for="setting-wa-phone">
                  WhatsApp Mobile Number (with country code, no spaces)
                </label>
                <input 
                  type="text" 
                  id="setting-wa-phone" 
                  class="form-input" 
                  value="${config.whatsappPhone || '919845012345'}" 
                  placeholder="e.g. 919845012345" 
                  required
                >
                <span class="settings-help">Format: 91 followed by 10 digits (e.g. 919845012345)</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="setting-wa-display">
                  Devotee Display Format
                </label>
                <input 
                  type="text" 
                  id="setting-wa-display" 
                  class="form-input" 
                  value="${config.whatsappDisplay || '+91 98450 12345'}" 
                  placeholder="e.g. +91 98450 12345" 
                  required
                >
                <span class="settings-help">Shown on website headers, contact cards, and devotee app</span>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="setting-wa-greeting">
                Default WhatsApp Greeting / Intro Header
              </label>
              <input 
                type="text" 
                id="setting-wa-greeting" 
                class="form-input" 
                value="${config.whatsappGreeting || 'Namaskara Sri Durga Parameshwari Temple Desk 🙏'}" 
                required
              >
            </div>

            <div style="display: flex; gap: 10px; align-items: center; margin-top: 12px; padding: 12px; background: rgba(21, 128, 61, 0.08); border-radius: var(--radius-md); border: 1px solid rgba(21, 128, 61, 0.2);">
              <span style="font-size: 1.3rem;">📲</span>
              <div style="flex: 1;">
                <div style="font-weight: 700; font-size: 0.88rem; color: #15803D;">Test WhatsApp Integration Link</div>
                <div style="font-size: 0.78rem; color: var(--color-text-soft);">Opens WhatsApp Web or mobile app targeting this phone number</div>
              </div>
              <button type="button" class="btn btn-whatsapp btn-sm" onclick="window.admin.testWhatsApp()">
                💬 Test wa.me Link ↗
              </button>
            </div>

            <hr style="border: none; border-top: 1px solid var(--color-border-subtle); margin: 24px 0;">

            <!-- Temple Office & Financials -->
            <h3 class="settings-section-title" style="margin-top: 0;">
              <span>🏛️</span> Temple Office & Sanctum Information
            </h3>

            <div class="grid-form-row">
              <div class="form-group">
                <label class="form-label" for="setting-office-phone">Temple Landline Office Phone</label>
                <input 
                  type="text" 
                  id="setting-office-phone" 
                  class="form-input" 
                  value="${config.officePhone || '080-23394447'}" 
                  required
                >
              </div>

              <div class="form-group">
                <label class="form-label" for="setting-email">Official Temple Email</label>
                <input 
                  type="email" 
                  id="setting-email" 
                  class="form-input" 
                  value="${config.email || 'info@sridurgatemple.org'}" 
                  required
                >
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="setting-address">Official Temple Sanctum Address</label>
              <textarea id="setting-address" class="form-input" rows="2" required>${config.address || 'Sri Durga Parameshwari Temple, Chandra Layout 1st Phase, Bengaluru - 560 072'}</textarea>
            </div>

            <div class="grid-form-row">
              <div class="form-group">
                <label class="form-label" for="setting-upi">Physical Counter Temple UPI VPA / ID</label>
                <input 
                  type="text" 
                  id="setting-upi" 
                  class="form-input" 
                  value="${config.upiId || 'sridurgatemple@sbi'}" 
                  required
                >
                <span class="settings-help">Official temple account for offline devotee sevas</span>
              </div>

              <div class="form-group">
                <label class="form-label" for="setting-trust-reg">Trust Registration / Authority</label>
                <input 
                  type="text" 
                  id="setting-trust-reg" 
                  class="form-input" 
                  value="${config.trustRegistration || 'Registered Hindu Religious & Charitable Institutions Trust'}" 
                  required
                >
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px;">
              <button type="submit" class="btn btn-primary" style="padding: 10px 24px; font-weight: 700;">
                💾 Save All Temple Settings
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ==================== INTERACTIVE ACTIONS ====================
  toggleLoginMethod(method) {
    const pinForm = document.getElementById('login-pin-form');
    const pwdForm = document.getElementById('login-pwd-form');
    const pinBtn = document.getElementById('tab-pin-btn');
    const pwdBtn = document.getElementById('tab-pwd-btn');

    if (method === 'pin') {
      pinForm.style.display = 'block';
      pwdForm.style.display = 'none';
      pinBtn.classList.add('active');
      pwdBtn.classList.remove('active');
    } else {
      pinForm.style.display = 'none';
      pwdForm.style.display = 'block';
      pinBtn.classList.remove('active');
      pwdBtn.classList.add('active');
    }
  }

  handlePinSubmit() {
    const pin = document.getElementById('admin-pin-input').value;
    if (!this.loginWithPin(pin)) {
      alert("Invalid Trustee PIN. Try 1008 or use Demo Login.");
    }
  }

  handlePwdSubmit() {
    const u = document.getElementById('admin-user-input').value;
    const p = document.getElementById('admin-pass-input').value;
    if (!this.loginWithPassword(u, p)) {
      alert("Invalid credentials. Try trustee / durga2026 or Demo Login.");
    }
  }

  submitBlockRule() {
    const date = document.getElementById('admin-block-date').value;
    const reasonTitle = document.getElementById('admin-block-reason').value;
    const publicNotice = document.getElementById('admin-block-notice').value || 'Sanctum reserved for temple ritual.';
    const altsRaw = document.getElementById('admin-block-alts').value;
    const alts = altsRaw ? altsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

    const rule = {
      id: `block-${Date.now()}`,
      date,
      reasonType: 'MANUAL',
      reasonTitle,
      publicNotice,
      suggestedAlternatives: alts,
      createdBy: this.currentAdminUser.name,
      createdAt: new Date().toISOString()
    };

    templeStore.addBlockedDate(rule);
    alert(`Success: Date ${date} blocked and synchronized!`);
    this.render();
  }

  removeBlockRule(id) {
    if (confirm("Are you sure you want to unblock this date?")) {
      templeStore.removeBlockedDate(id);
      this.render();
    }
  }

  editSevaPrice(sevaId) {
    const seva = templeStore.getSevaById(sevaId);
    if (!seva) return;
    const newPrice = prompt(`Enter new kanike amount for ${seva.name}:`, seva.kanike);
    if (newPrice !== null && !isNaN(Number(newPrice)) && Number(newPrice) > 0) {
      templeStore.updateSeva(sevaId, { kanike: Number(newPrice) });
      this.render();
    }
  }

  quickAssignPriest(tokenId) {
    const activePriests = templeStore.getPriests().filter(p => p.status === 'ACTIVE');
    const chosen = activePriests.length > 0 ? activePriests[0].name : "Pandit Narayana Bhat";
    templeStore.updateBookingStatus(tokenId, 'CONFIRMED', chosen);
    this.render();
  }

  updateArchakaAssignment(tokenId, priestName) {
    if (priestName) {
      templeStore.updateBookingStatus(tokenId, 'CONFIRMED', priestName);
    } else {
      templeStore.updateBookingStatus(tokenId, 'NEEDS_ARCHAKA', null);
    }
    this.render();
  }

  sendWhatsAppConfirmation(tokenId) {
    const booking = templeStore.getBookings().find(b => b.tokenId === tokenId);
    if (!booking) return;
    const phone = booking.mobile.replace(/\D/g, '') || "919845012345";
    const msg = `Namaskara ${booking.devoteeName} 🙏\nSri Durga Parameshwari Temple confirms your seva:\n• Token: ${booking.tokenId}\n• Seva: ${booking.sevaName}\n• Date: ${booking.date} (${booking.timeSlot})\n• Assigned Archaka: ${booking.assignedArchaka || 'Pandit Narayana Bhat'}\n• Kanike: ₹${booking.contribution} (Payable at sanctum counter)\n\nPlease present this message at the counter 15 mins prior. Blessings of Sri Durga Devi!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }

  printTokenReceipt(tokenId) {
    const booking = templeStore.getBookings().find(b => b.tokenId === tokenId);
    if (!booking) return;

    const printWin = window.open('', '_blank', 'width=600,height=700');
    printWin.document.write(`
      <html>
        <head>
          <title>Receipt — ${booking.tokenId}</title>
          <style>
            body { font-family: sans-serif; padding: 24px; color: #1C1917; }
            .header { text-align: center; border-bottom: 2px dashed #721C2B; padding-bottom: 12px; margin-bottom: 16px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; }
            .total { font-size: 18px; font-weight: bold; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 8px 0; margin: 16px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0; color: #721C2B;">SRI DURGA PARAMESHWARI TEMPLE</h2>
            <p style="margin: 4px 0; font-size: 12px;">Chandra Layout 1st Phase, Bengaluru - 560072 | Ph: 080-23394447</p>
            <h3 style="margin: 8px 0 0;">OFFICIAL SEVA TOKEN RECEIPT</h3>
          </div>
          <div class="row"><span><strong>Token ID:</strong></span><span>${booking.tokenId}</span></div>
          <div class="row"><span><strong>Date:</strong></span><span>${booking.date} (${booking.timeSlot})</span></div>
          <div class="row"><span><strong>Devotee:</strong></span><span>${booking.devoteeName} (${booking.mobile})</span></div>
          <div class="row"><span><strong>Gothra / Nakshatra:</strong></span><span>${booking.gothra || 'Kashyapa'} / ${booking.nakshatra || 'Rohini'}</span></div>
          <div class="row"><span><strong>Seva:</strong></span><span>${booking.sevaName}</span></div>
          <div class="row"><span><strong>Assigned Priest:</strong></span><span>${booking.assignedArchaka || 'Pandit Narayana Bhat'}</span></div>
          <div class="total row"><span>Total Kanike:</span><span>₹${booking.contribution}</span></div>
          <p style="font-size: 11px; text-align: center; margin-top: 24px;">Please present this token at the temple counter for prasada and sankalpa. Om Sri Durgayai Namaha 🙏</p>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.print();
  }

  printSevaDaySheet() {
    const bookings = templeStore.getBookings();
    const printWin = window.open('', '_blank', 'width=800,height=900');
    printWin.document.write(`
      <html>
        <head>
          <title>Archaka Seva Day Sheet</title>
          <style>
            body { font-family: sans-serif; padding: 24px; color: #1C1917; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
            th, td { border: 1px solid #999; padding: 8px; text-align: left; }
            th { background: #EADFCD; }
          </style>
        </head>
        <body>
          <h2>Sri Durga Parameshwari Temple — Daily Archaka Seva Sheet</h2>
          <p>Generated: ${new Date().toLocaleDateString('en-IN')} | Chandra Layout, Bengaluru</p>
          <table>
            <thead>
              <tr>
                <th>Token</th><th>Devotee Name</th><th>Gothra & Nakshatra</th><th>Seva</th><th>Slot</th><th>Archaka</th><th>Kanike</th>
              </tr>
            </thead>
            <tbody>
              ${bookings.map(b => `
                <tr>
                  <td>${b.tokenId}</td>
                  <td>${b.devoteeName}<br>${b.mobile}</td>
                  <td>${b.gothra} / ${b.nakshatra}</td>
                  <td>${b.sevaName}</td>
                  <td>${b.timeSlot}</td>
                  <td>${b.assignedArchaka || 'Unassigned'}</td>
                  <td>₹${b.contribution}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.print();
  }

  exportBookingsCSV() {
    const bookings = templeStore.getBookings();
    const headers = ["Token ID", "Devotee Name", "Mobile", "Seva Name", "Date", "Slot", "Gothra", "Nakshatra", "Kanike", "Priest", "Status"];
    const rows = bookings.map(b => [
      b.tokenId,
      `"${b.devoteeName}"`,
      b.mobile,
      `"${b.sevaName}"`,
      b.date,
      `"${b.timeSlot}"`,
      b.gothra,
      b.nakshatra,
      b.contribution,
      `"${b.assignedArchaka || 'Pending'}"`,
      b.bookingStatus
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Durga_Temple_Bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  updateAnnouncement() {
    const msg = document.getElementById('broadcast-input-msg').value;
    const isPub = document.getElementById('broadcast-input-publish').checked;
    templeStore.updateAnnouncement({
      message: msg,
      isPublished: isPub,
      updatedAt: new Date().toISOString()
    });
    alert("Notice board updated and broadcast live!");
    this.render();
  }

  // ==================== FESTIVAL & EVENTS CMS CONTROLLERS ====================
  openEventEditor(eventId = null) {
    const isEdit = !!eventId;
    const event = isEdit ? (templeStore.getEventById(eventId) || {}) : {
      id: 'event-' + Date.now(),
      title: '',
      kannadaTitle: '',
      shloka: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      isPublished: true,
      isFeatured: false,
      primaryImage: 'assets/images/navaratri-invitation.jpg',
      scheduleImage: 'assets/images/navaratri-schedule.jpg',
      highlights: '',
      grandFinale: ''
    };

    this.editingEvent = JSON.parse(JSON.stringify(event));

    let overlay = document.getElementById('admin-modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'admin-modal-overlay';
      overlay.className = 'modal-overlay';
      overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.65);z-index:9999;display:flex;align-items:center;justify-content:center;padding:16px;';
      document.body.appendChild(overlay);
    }

    overlay.innerHTML = `
      <div style="background:#FFFDF8;border-radius:var(--radius-lg);max-width:750px;width:100%;max-height:90vh;overflow-y:auto;padding:24px;border:2px solid var(--color-gold);box-shadow:0 12px 32px rgba(0,0,0,0.3);">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1.5px solid var(--color-border-subtle);padding-bottom:12px;margin-bottom:16px;">
          <h3 style="font-family:var(--font-serif);color:var(--color-primary);margin:0;font-size:1.3rem;">
            <span>🎪</span> ${isEdit ? 'Edit Temple Festival Event' : 'Create New Festival Event'}
          </h3>
          <button class="icon-btn" onclick="window.admin.closeEventEditorModal()" style="font-size:1.2rem;cursor:pointer;border:none;background:none;">✕</button>
        </div>

        <form onsubmit="event.preventDefault(); window.admin.saveEventFromForm();" style="display:flex;flex-direction:column;gap:14px;">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
              <label style="font-weight:700;font-size:0.85rem;color:var(--color-primary);display:block;margin-bottom:4px;">Festival Title (Kannada) *</label>
              <input type="text" id="event-input-kannada-title" required value="${event.kannadaTitle || ''}" placeholder="e.g. ಶ್ರೀ ಶರನ್ನವರಾತ್ರಿ ಮಹೋತ್ಸವ - ೨೦೨೬" style="width:100%;padding:8px 12px;border:1px solid #D6D3D1;border-radius:6px;">
            </div>
            <div>
              <label style="font-weight:700;font-size:0.85rem;color:var(--color-primary);display:block;margin-bottom:4px;">Festival Title (English) *</label>
              <input type="text" id="event-input-title" required value="${event.title || ''}" placeholder="e.g. Sri Sharannavaratri Mahotsava 2026" style="width:100%;padding:8px 12px;border:1px solid #D6D3D1;border-radius:6px;">
            </div>
          </div>

          <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
            <div>
              <label style="font-weight:700;font-size:0.85rem;color:var(--color-primary);display:block;margin-bottom:4px;">Start Date *</label>
              <input type="date" id="event-input-start-date" required value="${event.startDate || ''}" style="width:100%;padding:8px 12px;border:1px solid #D6D3D1;border-radius:6px;">
            </div>
            <div>
              <label style="font-weight:700;font-size:0.85rem;color:var(--color-primary);display:block;margin-bottom:4px;">End Date *</label>
              <input type="date" id="event-input-end-date" required value="${event.endDate || ''}" style="width:100%;padding:8px 12px;border:1px solid #D6D3D1;border-radius:6px;">
            </div>
          </div>

          <div>
            <label style="font-weight:700;font-size:0.85rem;color:var(--color-primary);display:block;margin-bottom:4px;">Sacred Shloka / Mantra</label>
            <input type="text" id="event-input-shloka" value="${event.shloka || ''}" placeholder="ಯಾ ದೇವೀ ಸರ್ವಭೂತೇಷು ಛಾಯಾರೂಪೇಣ ಸಂಸ್ಥಿತಾ..." style="width:100%;padding:8px 12px;border:1px solid #D6D3D1;border-radius:6px;">
          </div>

          <!-- IMAGE UPLOAD SECTION -->
          <div style="border:1.5px dashed var(--color-gold);background:#FFF9F0;border-radius:8px;padding:16px;">
            <h4 style="color:var(--color-primary);font-size:0.95rem;margin:0 0 10px 0;">
              <span>🖼️</span> Festival Poster & Photographs (CMS Uploader)
            </h4>

            <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
              <!-- Primary Image -->
              <div>
                <label style="font-weight:700;font-size:0.8rem;color:var(--color-text-main);display:block;margin-bottom:4px;">
                  1. Deity Poster / Invitation Image
                </label>
                <input type="file" accept="image/*" onchange="window.admin.handleImageUpload(event, 'primaryImage')" style="font-size:0.8rem;margin-bottom:6px;width:100%;">
                <div style="font-size:0.75rem;color:var(--color-text-soft);margin-bottom:6px;">Or paste URL / asset path:</div>
                <input type="text" id="event-input-primary-image" value="${event.primaryImage || ''}" placeholder="assets/images/..." onchange="window.admin.updateImagePreview('primaryImage', this.value)" style="width:100%;padding:6px 10px;font-size:0.8rem;border:1px solid #D6D3D1;border-radius:4px;margin-bottom:8px;">
                <div style="width:100%;height:120px;border:1px solid #E5D8C3;border-radius:6px;background:#FFF;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                  <img id="cms-preview-primaryImage" src="${event.primaryImage || ''}" alt="Preview" style="max-height:100%;max-width:100%;object-fit:contain;" onerror="this.src='icons/icon.svg'">
                </div>
              </div>

              <!-- Schedule Sheet Image -->
              <div>
                <label style="font-weight:700;font-size:0.8rem;color:var(--color-text-main);display:block;margin-bottom:4px;">
                  2. Schedule / Seva Rate Card Image
                </label>
                <input type="file" accept="image/*" onchange="window.admin.handleImageUpload(event, 'scheduleImage')" style="font-size:0.8rem;margin-bottom:6px;width:100%;">
                <div style="font-size:0.75rem;color:var(--color-text-soft);margin-bottom:6px;">Or paste URL / asset path:</div>
                <input type="text" id="event-input-schedule-image" value="${event.scheduleImage || ''}" placeholder="assets/images/..." onchange="window.admin.updateImagePreview('scheduleImage', this.value)" style="width:100%;padding:6px 10px;font-size:0.8rem;border:1px solid #D6D3D1;border-radius:4px;margin-bottom:8px;">
                <div style="width:100%;height:120px;border:1px solid #E5D8C3;border-radius:6px;background:#FFF;display:flex;align-items:center;justify-content:center;overflow:hidden;">
                  <img id="cms-preview-scheduleImage" src="${event.scheduleImage || ''}" alt="Preview" style="max-height:100%;max-width:100%;object-fit:contain;" onerror="this.src='icons/icon.svg'">
                </div>
              </div>
            </div>
          </div>

          <div>
            <label style="font-weight:700;font-size:0.85rem;color:var(--color-primary);display:block;margin-bottom:4px;">Highlights & Summary</label>
            <textarea id="event-input-highlights" rows="2" style="width:100%;padding:8px 12px;border:1px solid #D6D3D1;border-radius:6px;">${event.highlights || ''}</textarea>
          </div>

          <div>
            <label style="font-weight:700;font-size:0.85rem;color:var(--color-primary);display:block;margin-bottom:4px;">Grand Finale / Rathotsava Announcement</label>
            <input type="text" id="event-input-finale" value="${event.grandFinale || ''}" placeholder="e.g. ದಿನಾಂಕ : 20-10-2026 ಮಂಗಳವಾರ ವಿಜಯದಶಮಿಯಂದು ರಥೋತ್ಸವ..." style="width:100%;padding:8px 12px;border:1px solid #D6D3D1;border-radius:6px;">
          </div>

          <div style="display:flex;gap:20px;margin-top:6px;">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:700;font-size:0.85rem;color:var(--color-primary);">
              <input type="checkbox" id="event-input-published" ${event.isPublished ? 'checked' : ''} style="width:18px;height:18px;">
              Publish to Live Devotee App 🟢
            </label>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-weight:700;font-size:0.85rem;color:var(--color-gold-hover);">
              <input type="checkbox" id="event-input-featured" ${event.isFeatured ? 'checked' : ''} style="width:18px;height:18px;">
              Featured Top Hero Banner 🌟
            </label>
          </div>

          <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:14px;border-top:1.5px solid var(--color-border-subtle);padding-top:14px;">
            <button type="button" class="btn btn-secondary" onclick="window.admin.closeEventEditorModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">💾 Save Festival Event</button>
          </div>
        </form>
      </div>
    `;
    overlay.style.display = 'flex';
  }

  handleImageUpload(event, targetField) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (!this.editingEvent) this.editingEvent = {};
      this.editingEvent[targetField] = dataUrl;

      // Update text input and preview image
      const inputEl = document.getElementById(targetField === 'primaryImage' ? 'event-input-primary-image' : 'event-input-schedule-image');
      if (inputEl) inputEl.value = `[Uploaded File: ${file.name}]`;

      const previewEl = document.getElementById(`cms-preview-${targetField}`);
      if (previewEl) previewEl.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }

  updateImagePreview(targetField, url) {
    if (!this.editingEvent) this.editingEvent = {};
    this.editingEvent[targetField] = url;
    const previewEl = document.getElementById(`cms-preview-${targetField}`);
    if (previewEl) previewEl.src = url;
  }

  saveEventFromForm() {
    const kTitle = document.getElementById('event-input-kannada-title').value.trim();
    const title = document.getElementById('event-input-title').value.trim();
    const sDate = document.getElementById('event-input-start-date').value;
    const eDate = document.getElementById('event-input-end-date').value;
    const shloka = document.getElementById('event-input-shloka').value.trim();
    const highlights = document.getElementById('event-input-highlights').value.trim();
    const finale = document.getElementById('event-input-finale').value.trim();
    const isPub = document.getElementById('event-input-published').checked;
    const isFeat = document.getElementById('event-input-featured').checked;

    const primaryUrl = document.getElementById('event-input-primary-image').value.trim();
    const scheduleUrl = document.getElementById('event-input-schedule-image').value.trim();

    if (!this.editingEvent) this.editingEvent = {};

    const updated = {
      ...this.editingEvent,
      title,
      kannadaTitle: kTitle,
      startDate: sDate,
      endDate: eDate,
      shloka,
      highlights,
      grandFinale: finale,
      isPublished: isPub,
      isFeatured: isFeat,
      primaryImage: this.editingEvent.primaryImage || primaryUrl || 'assets/images/navaratri-invitation.jpg',
      scheduleImage: this.editingEvent.scheduleImage || scheduleUrl || 'assets/images/navaratri-schedule.jpg'
    };

    templeStore.saveEvent(updated);
    alert(`Success: "${kTitle || title}" has been saved and published to the temple portal!`);
    this.closeEventEditorModal();
    this.render();
  }

  deleteEvent(id) {
    if (confirm("Are you sure you want to delete this festival event?")) {
      templeStore.deleteEvent(id);
      this.render();
    }
  }

  toggleEventPublish(id) {
    const ev = templeStore.getEventById(id);
    if (!ev) return;
    ev.isPublished = !ev.isPublished;
    templeStore.saveEvent(ev);
    this.render();
  }

  closeEventEditorModal() {
    const overlay = document.getElementById('admin-modal-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
    }
  }

  // ==================== PRIESTS CMS CONTROLLERS ====================
  openPriestEditor(priestId = null) {
    const isEdit = !!priestId;
    const priest = isEdit 
      ? (templeStore.getPriestById(priestId) || {})
      : {
        id: 'archaka-' + Date.now(),
        name: '',
        kannadaName: '',
        designation: 'Archaka',
        photo: '',
        phone: '919845012345',
        experience: '10+ Years',
        specializations: ['Pooja', 'Archana'],
        status: 'ACTIVE'
      };

    this.editingPriest = { ...priest };

    const overlay = document.getElementById('admin-modal-overlay');
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="admin-modal-card" style="max-width: 620px;">
        <div class="admin-modal-header">
          <h3 style="font-family: var(--font-serif); color: var(--color-primary); margin: 0;">
            ${isEdit ? '✏️ Edit Archaka / Priest Details' : '➕ Register New Archaka / Priest'}
          </h3>
          <button class="btn btn-secondary btn-sm" onclick="window.admin.closePriestModal()" style="border:none; font-size:1.2rem; cursor:pointer;">✕</button>
        </div>

        <form onsubmit="event.preventDefault(); window.admin.savePriestFromForm();" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
          <div class="grid-form-row">
            <div class="form-group">
              <label class="form-label">Archaka Name (English)</label>
              <input type="text" id="priest-input-name" class="form-input" value="${priest.name || ''}" placeholder="e.g. Pandit Narayana Bhat" required>
            </div>
            <div class="form-group">
              <label class="form-label">Archaka Name (Kannada)</label>
              <input type="text" id="priest-input-kannada" class="form-input" value="${priest.kannadaName || ''}" placeholder="e.g. ಪಂಡಿತ್ ನಾರಾಯಣ ಭಟ್">
            </div>
          </div>

          <div class="grid-form-row">
            <div class="form-group">
              <label class="form-label">Designation / Role</label>
              <input type="text" id="priest-input-role" class="form-input" value="${priest.designation || 'Archaka'}" placeholder="e.g. Chief Pradhana Archaka, Veda Brahma" required>
            </div>
            <div class="form-group">
              <label class="form-label">Experience</label>
              <input type="text" id="priest-input-exp" class="form-input" value="${priest.experience || '15+ Years'}" placeholder="e.g. 25+ Years in Rigveda & Durga Homa" required>
            </div>
          </div>

          <div class="grid-form-row">
            <div class="form-group">
              <label class="form-label">Contact / WhatsApp Number</label>
              <input type="text" id="priest-input-phone" class="form-input" value="${priest.phone || ''}" placeholder="e.g. 919845012345" required>
            </div>
            <div class="form-group">
              <label class="form-label">Duty Status</label>
              <select id="priest-input-status" class="form-input">
                <option value="ACTIVE" ${priest.status === 'ACTIVE' ? 'selected' : ''}>Active on Duty 🟢</option>
                <option value="ON_LEAVE" ${priest.status === 'ON_LEAVE' ? 'selected' : ''}>On Leave / Inactive ⚪</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Specializations (comma separated)</label>
            <input type="text" id="priest-input-specs" class="form-input" value="${(priest.specializations || []).join(', ')}" placeholder="e.g. Maha Chandi Homa, Durga Deepa Pooja, Alankara" required>
          </div>

          <!-- Photo Upload & URL -->
          <div class="form-group">
            <label class="form-label">Archaka Photo (Upload File or Image URL)</label>
            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 6px;">
              <input type="file" id="priest-file-upload" accept="image/*" class="form-input" style="padding: 6px;" onchange="window.admin.handlePriestImageUpload(event)">
              <span style="font-size: 0.8rem; color: var(--color-text-soft);">OR</span>
              <input type="text" id="priest-input-photo-url" class="form-input" value="${priest.photo || ''}" placeholder="Image URL (e.g. assets/images/priest1.jpg)" oninput="window.admin.updatePriestPhotoPreview(this.value)">
            </div>
            <div style="display: flex; align-items: center; gap: 14px; margin-top: 8px;">
              <div style="width: 64px; height: 64px; border-radius: 50%; overflow: hidden; border: 2px solid var(--color-gold); background: #FAF7F2; display: flex; align-items: center; justify-content: center;">
                <img id="priest-photo-preview" src="${priest.photo || 'icons/icon.svg'}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='icons/icon.svg'">
              </div>
              <span style="font-size: 0.78rem; color: var(--color-text-soft);">Image preview updates immediately on file select.</span>
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:14px; border-top:1.5px solid var(--color-border-subtle); padding-top:14px;">
            <button type="button" class="btn btn-secondary" onclick="window.admin.closePriestModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">💾 Save Archaka</button>
          </div>
        </form>
      </div>
    `;
    overlay.style.display = 'flex';
  }

  handlePriestImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (!this.editingPriest) this.editingPriest = {};
      this.editingPriest.photo = dataUrl;
      const preview = document.getElementById('priest-photo-preview');
      if (preview) preview.src = dataUrl;
      const urlInput = document.getElementById('priest-input-photo-url');
      if (urlInput) urlInput.value = `[Uploaded: ${file.name}]`;
    };
    reader.readAsDataURL(file);
  }

  updatePriestPhotoPreview(url) {
    if (!this.editingPriest) this.editingPriest = {};
    this.editingPriest.photo = url;
    const preview = document.getElementById('priest-photo-preview');
    if (preview) preview.src = url || 'icons/icon.svg';
  }

  savePriestFromForm() {
    const name = document.getElementById('priest-input-name').value.trim();
    const kannadaName = document.getElementById('priest-input-kannada').value.trim();
    const designation = document.getElementById('priest-input-role').value.trim();
    const experience = document.getElementById('priest-input-exp').value.trim();
    const phone = document.getElementById('priest-input-phone').value.trim();
    const status = document.getElementById('priest-input-status').value;
    const specsRaw = document.getElementById('priest-input-specs').value.trim();
    const specializations = specsRaw ? specsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];
    const photoUrl = document.getElementById('priest-input-photo-url').value.trim();

    if (!this.editingPriest) this.editingPriest = {};

    const updated = {
      ...this.editingPriest,
      name,
      kannadaName,
      designation,
      experience,
      phone,
      status,
      specializations,
      photo: this.editingPriest.photo || (photoUrl.startsWith('[Uploaded') ? '' : photoUrl) || ''
    };

    templeStore.savePriest(updated);
    alert(`Success: Archaka "${name}" saved!`);
    this.closePriestModal();
    this.render();
  }

  deletePriest(id) {
    const priest = templeStore.getPriestById(id);
    if (!priest) return;
    if (confirm(`Are you sure you want to remove ${priest.name} from the active priests list?`)) {
      templeStore.deletePriest(id);
      this.render();
    }
  }

  togglePriestStatus(id) {
    templeStore.togglePriestStatus(id);
    this.render();
  }

  closePriestModal() {
    const overlay = document.getElementById('admin-modal-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
    }
    this.editingPriest = null;
  }

  // ==================== GALLERY CMS CONTROLLERS ====================
  openGalleryEditor(photoId = null) {
    const isEdit = !!photoId;
    const item = isEdit 
      ? (templeStore.getGalleryItemById(photoId) || {})
      : {
        id: 'gal-' + Date.now(),
        title: '',
        kannadaTitle: '',
        category: 'garbha_gudi',
        url: '',
        caption: '',
        order: 1,
        dateAdded: new Date().toISOString().split('T')[0]
      };

    this.editingGalleryItem = { ...item };

    const overlay = document.getElementById('admin-modal-overlay');
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="admin-modal-card" style="max-width: 600px;">
        <div class="admin-modal-header">
          <h3 style="font-family: var(--font-serif); color: var(--color-primary); margin: 0;">
            ${isEdit ? '✏️ Edit Temple Gallery Photo' : '➕ Add Photo to Temple Gallery'}
          </h3>
          <button class="btn btn-secondary btn-sm" onclick="window.admin.closeGalleryModal()" style="border:none; font-size:1.2rem; cursor:pointer;">✕</button>
        </div>

        <form onsubmit="event.preventDefault(); window.admin.saveGalleryItemFromForm();" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
          <div class="grid-form-row">
            <div class="form-group">
              <label class="form-label">Photo Title (English)</label>
              <input type="text" id="gal-input-title" class="form-input" value="${item.title || ''}" placeholder="e.g. Grand Deepotsava Evening" required>
            </div>
            <div class="form-group">
              <label class="form-label">Photo Title (Kannada)</label>
              <input type="text" id="gal-input-kannada" class="form-input" value="${item.kannadaTitle || ''}" placeholder="e.g. ಭವ್ಯ ದೀಪೋತ್ಸವ">
            </div>
          </div>

          <div class="grid-form-row">
            <div class="form-group">
              <label class="form-label">Category</label>
              <select id="gal-input-category" class="form-input">
                <option value="garbha_gudi" ${item.category === 'garbha_gudi' ? 'selected' : ''}>Garbha Gudi / Sanctum</option>
                <option value="architecture" ${item.category === 'architecture' ? 'selected' : ''}>Architecture & Raja Gopuram</option>
                <option value="deepotsava" ${item.category === 'deepotsava' ? 'selected' : ''}>Deepotsava & Lights</option>
                <option value="alankara" ${item.category === 'alankara' ? 'selected' : ''}>Alankara & Flowers</option>
                <option value="utsava" ${item.category === 'utsava' ? 'selected' : ''}>Rathotsava & Utsav</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Display Order</label>
              <input type="number" id="gal-input-order" class="form-input" value="${item.order || 1}" min="1">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Caption / Significance</label>
            <textarea id="gal-input-caption" class="form-input" rows="2" placeholder="e.g. Sanctum sanctorum illuminated with thousands of sacred ghee lamps during Karthika Masa">${item.caption || ''}</textarea>
          </div>

          <!-- Photo Upload & URL -->
          <div class="form-group">
            <label class="form-label">Photo Image (Upload File or URL)</label>
            <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 6px;">
              <input type="file" id="gal-file-upload" accept="image/*" class="form-input" style="padding: 6px;" onchange="window.admin.handleGalleryImageUpload(event)">
              <span style="font-size: 0.8rem; color: var(--color-text-soft);">OR</span>
              <input type="text" id="gal-input-url" class="form-input" value="${item.url || ''}" placeholder="Image URL (e.g. assets/images/2.jpg)" oninput="window.admin.updateGalleryPreview(this.value)">
            </div>
            <div style="width: 100%; height: 180px; border-radius: var(--radius-md); overflow: hidden; border: 2px solid var(--color-gold); background: #FAF7F2; margin-top: 8px; display: flex; align-items: center; justify-content: center;">
              <img id="gal-photo-preview" src="${item.url || 'icons/icon.svg'}" alt="Preview" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='icons/icon.svg'">
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:14px; border-top:1.5px solid var(--color-border-subtle); padding-top:14px;">
            <button type="button" class="btn btn-secondary" onclick="window.admin.closeGalleryModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">💾 Save Gallery Photo</button>
          </div>
        </form>
      </div>
    `;
    overlay.style.display = 'flex';
  }

  handleGalleryImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      if (!this.editingGalleryItem) this.editingGalleryItem = {};
      this.editingGalleryItem.url = dataUrl;
      const preview = document.getElementById('gal-photo-preview');
      if (preview) preview.src = dataUrl;
      const urlInput = document.getElementById('gal-input-url');
      if (urlInput) urlInput.value = `[Uploaded: ${file.name}]`;
    };
    reader.readAsDataURL(file);
  }

  updateGalleryPreview(url) {
    if (!this.editingGalleryItem) this.editingGalleryItem = {};
    this.editingGalleryItem.url = url;
    const preview = document.getElementById('gal-photo-preview');
    if (preview) preview.src = url || 'icons/icon.svg';
  }

  saveGalleryItemFromForm() {
    const title = document.getElementById('gal-input-title').value.trim();
    const kannadaTitle = document.getElementById('gal-input-kannada').value.trim();
    const category = document.getElementById('gal-input-category').value;
    const order = Number(document.getElementById('gal-input-order').value) || 1;
    const caption = document.getElementById('gal-input-caption').value.trim();
    const urlInput = document.getElementById('gal-input-url').value.trim();

    if (!this.editingGalleryItem) this.editingGalleryItem = {};

    const updated = {
      ...this.editingGalleryItem,
      title,
      kannadaTitle,
      category,
      order,
      caption,
      url: this.editingGalleryItem.url || (urlInput.startsWith('[Uploaded') ? '' : urlInput) || 'assets/images/1.jpg',
      dateAdded: this.editingGalleryItem.dateAdded || new Date().toISOString().split('T')[0]
    };

    templeStore.saveGalleryItem(updated);
    alert(`Success: Gallery photo "${title}" saved!`);
    this.closeGalleryModal();
    this.render();
  }

  deleteGalleryItem(id) {
    const item = templeStore.getGalleryItemById(id);
    if (!item) return;
    if (confirm(`Are you sure you want to delete "${item.title}" from the gallery?`)) {
      templeStore.deleteGalleryItem(id);
      this.render();
    }
  }

  filterGalleryCategory(cat) {
    this.galleryFilter = cat;
    this.render();
  }

  closeGalleryModal() {
    const overlay = document.getElementById('admin-modal-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
    }
    this.editingGalleryItem = null;
  }

  // ==================== SPECIAL NOTIFICATIONS CMS CONTROLLERS ====================
  openNotificationEditor(notifId = null) {
    const isEdit = !!notifId;
    const notif = isEdit 
      ? (templeStore.getSpecialNotificationById(notifId) || {})
      : {
        id: 'notif-' + Date.now(),
        title: '',
        kannadaTitle: '',
        message: '',
        type: 'auspicious',
        actionText: '',
        actionUrl: '',
        isActive: true,
        priority: 1
      };

    this.editingNotification = { ...notif };

    const overlay = document.getElementById('admin-modal-overlay');
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="admin-modal-card" style="max-width: 600px;">
        <div class="admin-modal-header">
          <h3 style="font-family: var(--font-serif); color: var(--color-primary); margin: 0;">
            ${isEdit ? '✏️ Edit Devotee Special Alert' : '➕ Create Special Devotee Alert'}
          </h3>
          <button class="btn btn-secondary btn-sm" onclick="window.admin.closeNotificationModal()" style="border:none; font-size:1.2rem; cursor:pointer;">✕</button>
        </div>

        <form onsubmit="event.preventDefault(); window.admin.saveNotificationFromForm();" style="padding: 20px; display: flex; flex-direction: column; gap: 14px;">
          <div class="grid-form-row">
            <div class="form-group">
              <label class="form-label">Alert Title (English)</label>
              <input type="text" id="notif-input-title" class="form-input" value="${notif.title || ''}" placeholder="e.g. Navaratri Extended Darshan Hours" required>
            </div>
            <div class="form-group">
              <label class="form-label">Alert Title (Kannada)</label>
              <input type="text" id="notif-input-kannada" class="form-input" value="${notif.kannadaTitle || ''}" placeholder="e.g. ನವರಾತ್ರಿ ವಿಶೇಷ ದರ್ಶನ ಸಮಯ">
            </div>
          </div>

          <div class="grid-form-row">
            <div class="form-group">
              <label class="form-label">Alert Priority / Type</label>
              <select id="notif-input-type" class="form-input">
                <option value="auspicious" ${notif.type === 'auspicious' ? 'selected' : ''}>🌟 Auspicious Festival / Celebration</option>
                <option value="urgent" ${notif.type === 'urgent' ? 'selected' : ''}>⚠️ Urgent / Sanctum Closure Notice</option>
                <option value="seva" ${notif.type === 'seva' ? 'selected' : ''}>🪔 Seva / Booking Availability</option>
                <option value="general" ${notif.type === 'general' ? 'selected' : ''}>📢 General Devotee Notice</option>
              </select>
            </div>
            <div class="form-group" style="display: flex; align-items: flex-end; padding-bottom: 6px;">
              <label style="display: flex; align-items: center; gap: 8px; cursor: pointer; font-weight: 700; color: var(--color-primary);">
                <input type="checkbox" id="notif-input-active" ${notif.isActive ? 'checked' : ''} style="width: 18px; height: 18px;">
                Broadcast Live to Devotees 🟢
              </label>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Notice Message Text</label>
            <textarea id="notif-input-message" class="form-input" rows="3" required placeholder="Detailed message displayed on devotee home screen and alerts">${notif.message || ''}</textarea>
          </div>

          <div class="grid-form-row">
            <div class="form-group">
              <label class="form-label">Action Button Text (Optional)</label>
              <input type="text" id="notif-input-cta-text" class="form-input" value="${notif.actionText || ''}" placeholder="e.g. View Alankara Schedule, Book Homa">
            </div>
            <div class="form-group">
              <label class="form-label">Action URL / Screen (Optional)</label>
              <input type="text" id="notif-input-cta-url" class="form-input" value="${notif.actionUrl || ''}" placeholder="e.g. #events, #poojas, tel:080-23394447">
            </div>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:14px; border-top:1.5px solid var(--color-border-subtle); padding-top:14px;">
            <button type="button" class="btn btn-secondary" onclick="window.admin.closeNotificationModal()">Cancel</button>
            <button type="submit" class="btn btn-primary">💾 Save & Publish Alert</button>
          </div>
        </form>
      </div>
    `;
    overlay.style.display = 'flex';
  }

  saveNotificationFromForm() {
    const title = document.getElementById('notif-input-title').value.trim();
    const kannadaTitle = document.getElementById('notif-input-kannada').value.trim();
    const type = document.getElementById('notif-input-type').value;
    const isActive = document.getElementById('notif-input-active').checked;
    const message = document.getElementById('notif-input-message').value.trim();
    const actionText = document.getElementById('notif-input-cta-text').value.trim();
    const actionUrl = document.getElementById('notif-input-cta-url').value.trim();

    if (!this.editingNotification) this.editingNotification = {};

    const updated = {
      ...this.editingNotification,
      title,
      kannadaTitle,
      type,
      isActive,
      message,
      actionText,
      actionUrl,
      updatedAt: new Date().toISOString()
    };

    templeStore.saveSpecialNotification(updated);
    alert(`Success: Devotee alert "${title}" saved and broadcast!`);
    this.closeNotificationModal();
    this.render();
  }

  deleteNotification(id) {
    if (confirm("Are you sure you want to delete this special notification?")) {
      templeStore.deleteSpecialNotification(id);
      this.render();
    }
  }

  toggleNotificationStatus(id) {
    templeStore.toggleNotificationStatus(id);
    this.render();
  }

  closeNotificationModal() {
    const overlay = document.getElementById('admin-modal-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
    }
    this.editingNotification = null;
  }

  // ==================== SETTINGS CONTROLLERS ====================
  saveContactSettings() {
    const waPhone = document.getElementById('setting-wa-phone').value.trim().replace(/\D/g, '');
    const waDisplay = document.getElementById('setting-wa-display').value.trim();
    const waGreeting = document.getElementById('setting-wa-greeting').value.trim();
    const officePhone = document.getElementById('setting-office-phone').value.trim();
    const email = document.getElementById('setting-email').value.trim();
    const address = document.getElementById('setting-address').value.trim();
    const upiId = document.getElementById('setting-upi').value.trim();
    const trustReg = document.getElementById('setting-trust-reg').value.trim();

    if (!waPhone || waPhone.length < 10) {
      alert("Please enter a valid WhatsApp mobile number (at least 10 digits).");
      return;
    }

    templeStore.updateContactConfig({
      whatsappPhone: waPhone,
      whatsappDisplay: waDisplay,
      whatsappGreeting: waGreeting,
      officePhone: officePhone,
      email: email,
      address: address,
      upiId: upiId,
      trustRegistration: trustReg
    });

    alert("✅ Temple WhatsApp and contact details successfully saved and updated across all devotee portals!");
    this.render();
  }

  testWhatsApp() {
    const phoneInput = document.getElementById('setting-wa-phone');
    const phone = phoneInput ? phoneInput.value.replace(/\D/g, '') : '919845012345';
    const text = encodeURIComponent("Namaskara Sri Durga Devi Temple Desk 🙏 This is a test message from the Admin Portal.");
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  }

  // ==================== TAB: LIVE BROADCAST CONSOLE ====================
  _renderLiveTab() {
    const locations = streamingService.getActiveLocations();
    const activeBroadcasts = streamingService.getActiveBroadcasts();
    const allSessions = templeStore.getLiveSessions().slice(0, 10);
    const activeSession = activeBroadcasts.length > 0 ? activeBroadcasts[0] : null;

    return `
      <!-- Active Live Status Banner -->
      ${activeSession ? `
        <div class="card" style="border: 2px solid #E53935; background: #FFF5F5; margin-bottom: 24px; padding: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div style="display: flex; align-items: center; gap: 14px;">
              <span style="font-size: 2rem; animation: pulseGlow 1.5s infinite;">🔴</span>
              <div>
                <div style="display: flex; align-items: center; gap: 8px;">
                  <span class="badge" style="background: #E53935; color: #FFF; font-weight: 800; font-size: 0.75rem;">LIVE NOW</span>
                  <span style="font-weight: 800; font-size: 1.15rem; color: #721C2B;">${activeSession.locationName}</span>
                </div>
                <div style="font-size: 0.85rem; color: #666; margin-top: 4px;">
                  Source: <strong>${activeSession.sourceType}</strong> • Started by <strong>${activeSession.startedBy}</strong> at ${new Date(activeSession.startedAt).toLocaleTimeString('en-IN')}
                </div>
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 14px;">
              <div style="text-align: right;">
                <div style="font-size: 1.3rem; font-weight: 800; color: #E53935;">
                  👁️ ${templeStore.getActiveViewerCount(activeSession.id)}
                </div>
                <div style="font-size: 0.75rem; color: #666;">Current Viewers</div>
              </div>
              <button class="btn btn-sm" onclick="window.admin.stopActiveBroadcast('${activeSession.id}')" style="background: #721C2B; color: #FFF; font-weight: 700; padding: 10px 18px; border: none; border-radius: 8px; cursor: pointer;">
                ⏹️ Stop Broadcast
              </button>
            </div>
          </div>
        </div>
      ` : `
        <div class="card" style="background: #FFFDF8; border-left: 4px solid var(--color-gold); margin-bottom: 24px; padding: 16px 20px;">
          <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; align-items: center; gap: 10px;">
              <span style="font-size: 1.4rem;">🪔</span>
              <div>
                <strong style="color: var(--color-primary); font-size: 0.95rem;">No Active Live Broadcast</strong>
                <p style="margin: 2px 0 0; font-size: 0.82rem; color: var(--color-text-soft);">Select a temple location below to start broadcasting directly from your mobile camera or sanctum IP camera.</p>
              </div>
            </div>
          </div>
        </div>
      `}

      <!-- Broadcast Setup Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 24px; margin-bottom: 28px;">
        <!-- Left: Configuration & Controls -->
        <div class="card" style="padding: 24px;">
          <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); margin: 0 0 16px;">
            1. Broadcast Destination & Source
          </h3>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" for="live-loc-select">Temple Streaming Location</label>
            <select id="live-loc-select" class="form-input" style="font-weight: 600;">
              ${locations.map(l => `
                <option value="${l.id}">${l.name} (${l.kannadaName || ''})</option>
              `).join('')}
            </select>
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label">Broadcasting Source</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <label style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1.5px solid var(--color-border); border-radius: 8px; cursor: pointer; background: #FFFDF8;">
                <input type="radio" name="broadcast-source-type" value="MOBILE" checked onchange="window.admin.toggleSourceTypeView('MOBILE')">
                <span style="font-size: 0.88rem; font-weight: 600;">📱 Mobile Camera</span>
              </label>
              <label style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; border: 1.5px solid var(--color-border); border-radius: 8px; cursor: pointer; background: #FFFDF8;">
                <input type="radio" name="broadcast-source-type" value="IP_CAMERA" onchange="window.admin.toggleSourceTypeView('IP_CAMERA')">
                <span style="font-size: 0.88rem; font-weight: 600;">📹 Sanctum IP Cam</span>
              </label>
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 18px;">
            <label class="form-label" for="live-session-title">Broadcast Title & Aarti Occasion</label>
            <input type="text" id="live-session-title" class="form-input" placeholder="e.g. Madhyahna Mahamangalarathi & Alankara Darshan" value="Garbha Gudi — Live Sanctum Darshan">
          </div>

          <!-- Mobile Camera Console Box -->
          <div id="mobile-camera-controls-box" style="display: block; background: #FAF7F2; padding: 16px; border-radius: 10px; border: 1px solid var(--color-border); margin-bottom: 18px;">
            <h4 style="font-size: 0.92rem; color: var(--color-primary); margin: 0 0 10px; display: flex; align-items: center; gap: 6px;">
              <span>📱</span> Mobile Browser Camera Controls
            </h4>
            <p style="font-size: 0.78rem; color: var(--color-text-soft); margin: 0 0 12px; line-height: 1.35;">
              Broadcasting runs natively inside this mobile browser tab without installing any app. Switch between back and front camera as needed.
            </p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.admin.requestCameraPreview()">
                📹 Test Camera Preview
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.admin.toggleFacingMode()">
                🔄 Flip (${this.currentFacingMode === 'environment' ? 'Rear Cam' : 'Front Cam'})
              </button>
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.admin.toggleMic()">
                ${this.isMicMuted ? '🔇 Mic Muted' : '🎤 Mic Active'}
              </button>
            </div>
          </div>

          <!-- IP Camera Console Box (Hidden by default) -->
          <div id="ip-camera-controls-box" style="display: none; background: #FAF7F2; padding: 16px; border-radius: 10px; border: 1px solid var(--color-border); margin-bottom: 18px;">
            <h4 style="font-size: 0.92rem; color: var(--color-primary); margin: 0 0 10px; display: flex; align-items: center; gap: 6px;">
              <span>📹</span> IP Camera / RTSP / HLS Gateway
            </h4>
            <div class="form-group" style="margin-bottom: 10px;">
              <label class="form-label" for="ip-stream-url">Camera Stream Endpoint URL</label>
              <input type="text" id="ip-stream-url" class="form-input" placeholder="rtsp://admin:pass@192.168.1.100:554/live/ch0 or https://..." value="rtsp://sanctum-cam1.temple.lan:554/live/ch0">
              <span style="font-size: 0.72rem; color: var(--color-text-soft); display: block; margin-top: 4px;">Credentials are masked and never exposed to public devotees.</span>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              <button type="button" class="btn btn-secondary btn-sm" onclick="window.admin.testIpCameraStream()">
                🔍 Diagnostic Ping & SSRF Test
              </button>
              <span id="ip-test-status" style="font-size: 0.8rem; font-weight: 600;"></span>
            </div>
          </div>

          <!-- Big Action Button -->
          <button class="btn btn-primary" onclick="window.admin.startBroadcastFromConsole()" style="width: 100%; padding: 14px; font-weight: 800; font-size: 1rem; background: #E53935; border: none; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <span>🔴</span> START LIVE BROADCAST
          </button>
        </div>

        <!-- Right: Camera / Feed Live Preview -->
        <div class="card" style="padding: 24px; display: flex; flex-direction: column;">
          <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); margin: 0 0 16px;">
            2. Real-Time Monitor Preview
          </h3>
          <div style="position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 10px; overflow: hidden; display: flex; align-items: center; justify-content: center; border: 1px solid var(--color-border);">
            <video id="adminCameraPreview" autoplay playsinline muted style="width: 100%; height: 100%; object-fit: cover;"></video>
            <div id="admin-preview-placeholder" style="position: absolute; text-align: center; color: #AAA; padding: 20px;">
              <span style="font-size: 2.2rem; display: block; margin-bottom: 6px;">📷</span>
              <span style="font-size: 0.85rem;">Camera preview inactive.<br>Tap "Test Camera Preview" or Start Broadcast.</span>
            </div>
          </div>

          <div style="margin-top: 16px; background: #FFFDF8; padding: 14px; border-radius: 8px; border: 1px solid var(--color-border); font-size: 0.82rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: var(--color-text-soft);">Resolution / Codec:</span>
              <strong>720p HD @ 30fps (H.264 / AAC)</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span style="color: var(--color-text-soft);">Push Notification Trigger:</span>
              <strong style="color: #059669;">Auto-Dispatches to Opted-in Devotees ✓</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-text-soft);">Location Mutex:</span>
              <strong style="color: var(--color-primary);">Active Safeguard Protected ✓</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Broadcast Sessions Table -->
      <div class="card" style="padding: 24px;">
        <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); margin: 0 0 14px;">
          📜 Recent Sanctum Broadcast Sessions
        </h3>
        <div style="overflow-x: auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Session ID</th>
                <th>Location</th>
                <th>Source</th>
                <th>Started</th>
                <th>Duration</th>
                <th>Peak Devotees</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${allSessions.length === 0 ? `
                <tr><td colspan="7" style="text-align: center; color: #888;">No broadcast sessions recorded yet.</td></tr>
              ` : allSessions.map(s => `
                <tr>
                  <td><code>${s.id}</code></td>
                  <td><strong>${s.locationName || s.locationId}</strong></td>
                  <td><span class="badge">${s.sourceType}</span></td>
                  <td>${new Date(s.startedAt).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td>${s.durationSeconds ? Math.round(s.durationSeconds / 60) + ' min' : 'Active'}</td>
                  <td><strong>${s.peakViewers || 0}</strong></td>
                  <td>
                    <span class="badge ${s.status === 'LIVE' ? 'badge-live' : ''}" style="${s.status === 'LIVE' ? 'background: #E53935; color: #FFF;' : ''}">
                      ${s.status}
                    </span>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  toggleSourceTypeView(sourceType) {
    const mobileBox = document.getElementById('mobile-camera-controls-box');
    const ipBox = document.getElementById('ip-camera-controls-box');
    if (mobileBox && ipBox) {
      if (sourceType === 'MOBILE') {
        mobileBox.style.display = 'block';
        ipBox.style.display = 'none';
      } else {
        mobileBox.style.display = 'none';
        ipBox.style.display = 'block';
      }
    }
  }

  async requestCameraPreview() {
    try {
      const stream = await streamingService.requestCameraStream(this.currentFacingMode);
      const video = document.getElementById('adminCameraPreview');
      const placeholder = document.getElementById('admin-preview-placeholder');
      if (video) {
        video.srcObject = stream;
        video.play();
      }
      if (placeholder) placeholder.style.display = 'none';
      showToast("Camera preview connected successfully. 📹", "success");
    } catch (e) {
      alert("Camera Error: " + e.message);
    }
  }

  async toggleFacingMode() {
    this.currentFacingMode = this.currentFacingMode === 'environment' ? 'user' : 'environment';
    if (streamingService.getActivePublisherStream()) {
      await this.requestCameraPreview();
    } else {
      this.render();
    }
  }

  toggleMic() {
    this.isMicMuted = !this.isMicMuted;
    streamingService.toggleMicrophone(this.isMicMuted);
    this.render();
  }

  async testIpCameraStream() {
    const urlInput = document.getElementById('ip-stream-url');
    const statusEl = document.getElementById('ip-test-status');
    if (!urlInput || !urlInput.value) return;

    if (statusEl) {
      statusEl.style.color = 'var(--color-primary)';
      statusEl.textContent = 'Probing camera gateway...';
    }

    const res = await streamingService.testIpCameraConnection({ streamUrl: urlInput.value });
    if (statusEl) {
      if (res.success) {
        statusEl.style.color = '#059669';
        statusEl.textContent = `✓ Reachable (${res.pingMs}ms latency) - SSRF Clean`;
      } else {
        statusEl.style.color = '#E53935';
        statusEl.textContent = `✕ Failed: ${res.details}`;
      }
    }
  }

  async startBroadcastFromConsole() {
    const locSelect = document.getElementById('live-loc-select');
    const titleInput = document.getElementById('live-session-title');
    const sourceRadio = document.querySelector('input[name="broadcast-source-type"]:checked');
    const ipUrlInput = document.getElementById('ip-stream-url');

    const locationId = locSelect ? locSelect.value : null;
    const title = titleInput ? titleInput.value : '';
    const sourceType = sourceRadio ? sourceRadio.value : 'MOBILE';

    if (!locationId) {
      alert("Please select a streaming location.");
      return;
    }

    try {
      if (sourceType === 'MOBILE') {
        // Ensure camera stream is initiated if browser allows
        if (!streamingService.getActivePublisherStream()) {
          try {
            await streamingService.requestCameraStream(this.currentFacingMode);
          } catch (camErr) {
            console.warn("[AdminApp] Camera access notice:", camErr.message);
          }
        }
      }

      await streamingService.startLiveSession({
        locationId,
        sourceType,
        title,
        adminUser: this.currentAdminUser,
        ipCameraConfig: sourceType === 'IP_CAMERA' ? { streamUrl: ipUrlInput ? ipUrlInput.value : '' } : null
      });

      showToast("Live broadcast successfully launched! Devotee screens updated. 🪔", "success");
      this.render();
    } catch (e) {
      alert("Failed to start broadcast: " + e.message);
    }
  }

  async stopActiveBroadcast(sessionId) {
    if (!confirm("Are you sure you want to stop the live sanctum broadcast? Devotee players will transition to offline schedule.")) return;

    try {
      await streamingService.stopLiveSession(sessionId, 'ADMIN_MANUAL_STOP');
      showToast("Broadcast safely stopped. Finalized viewer analytics.", "info");
      this.render();
    } catch (e) {
      alert("Failed to stop broadcast: " + e.message);
    }
  }

  // ==================== TAB: STREAMING LOCATIONS ====================
  _renderLocationsTab() {
    const locations = streamingService.getLocations();
    const activeBroadcasts = streamingService.getActiveBroadcasts();

    return `
      <div class="card" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 1.25rem; color: var(--color-primary); margin: 0 0 4px;">
              📍 Dynamic Sanctum Locations Manager
            </h3>
            <p style="font-size: 0.85rem; color: var(--color-text-soft); margin: 0;">
              Add, configure, reorder, or deactivate temple streaming vantage points.
            </p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="window.admin.openLocationModal()">
            ➕ Add New Streaming Location
          </button>
        </div>

        <div style="overflow-x: auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Location Name</th>
                <th>Kannada Name</th>
                <th>Supported Sources</th>
                <th>Current Status</th>
                <th>Live Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              ${locations.map((loc, idx) => {
                const isLive = activeBroadcasts.some(b => b.locationId === loc.id && b.status === 'LIVE');
                return `
                  <tr>
                    <td>
                      <div style="display: flex; align-items: center; gap: 4px;">
                        <button class="icon-btn" onclick="window.admin.moveLocation('${loc.id}', -1)" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''} title="Move Up">▲</button>
                        <span style="font-weight: 700;">${loc.displayOrder || (idx + 1)}</span>
                        <button class="icon-btn" onclick="window.admin.moveLocation('${loc.id}', 1)" ${idx === locations.length - 1 ? 'disabled style="opacity:0.3;"' : ''} title="Move Down">▼</button>
                      </div>
                    </td>
                    <td>
                      <strong>${loc.name}</strong>
                      <div style="font-size: 0.75rem; color: #666;">${loc.description || ''}</div>
                    </td>
                    <td><span style="font-family: var(--font-sans);">${loc.kannadaName || '—'}</span></td>
                    <td><span class="badge">${loc.supportedSources || 'BOTH'}</span></td>
                    <td>
                      <button class="badge ${loc.status === 'ACTIVE' ? 'badge-success' : 'badge-danger'}" onclick="window.admin.toggleLocationStatus('${loc.id}')" style="cursor: pointer; border: none;">
                        ${loc.status}
                      </button>
                    </td>
                    <td>
                      ${isLive ? `
                        <span class="badge" style="background: #E53935; color: #FFF; font-weight: 800; animation: pulseGlow 1.5s infinite;">
                          ● BROADCASTING
                        </span>
                      ` : `
                        <span class="badge" style="background: #EADFCD; color: #555;">OFFLINE</span>
                      `}
                    </td>
                    <td>
                      <div style="display: flex; gap: 6px;">
                        <button class="btn btn-secondary btn-sm" onclick="window.admin.openLocationModal('${loc.id}')" title="Edit">
                          ✏️
                        </button>
                        <button class="btn btn-secondary btn-sm" onclick="window.admin.deleteLocation('${loc.id}')" style="color: #E53935;" title="Delete">
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  openLocationModal(locationId = null) {
    const loc = locationId ? streamingService.getLocationById(locationId) : null;
    this.editingLocation = loc;

    const overlay = document.getElementById('admin-modal-overlay');
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="admin-modal" style="max-width: 520px;">
        <div class="modal-header">
          <h3>${loc ? '✏️ Edit Streaming Location' : '➕ Add New Streaming Location'}</h3>
          <button class="modal-close-btn" onclick="window.admin.closeLocationModal()">✕</button>
        </div>
        <div class="modal-body">
          <form onsubmit="event.preventDefault(); window.admin.saveLocationForm();">
            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" for="modal-loc-name">Location Name (English) *</label>
              <input type="text" id="modal-loc-name" class="form-input" required value="${loc ? loc.name : ''}" placeholder="e.g. Utsava Mantapa">
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" for="modal-loc-kannada">Location Name (Kannada)</label>
              <input type="text" id="modal-loc-kannada" class="form-input" value="${loc ? (loc.kannadaName || '') : ''}" placeholder="e.g. ಉತ್ಸವ ಮಂಟಪ">
            </div>

            <div class="form-group" style="margin-bottom: 12px;">
              <label class="form-label" for="modal-loc-desc">Description</label>
              <textarea id="modal-loc-desc" class="form-input" rows="2" placeholder="Brief description of this temple area">${loc ? (loc.description || '') : ''}</textarea>
            </div>

            <div class="form-group" style="margin-bottom: 16px;">
              <label class="form-label" for="modal-loc-sources">Supported Broadcasting Sources</label>
              <select id="modal-loc-sources" class="form-input">
                <option value="BOTH" ${loc && loc.supportedSources === 'BOTH' ? 'selected' : ''}>Both Mobile Camera & IP Camera</option>
                <option value="MOBILE" ${loc && loc.supportedSources === 'MOBILE' ? 'selected' : ''}>Mobile Browser Camera Only</option>
                <option value="IP_CAMERA" ${loc && loc.supportedSources === 'IP_CAMERA' ? 'selected' : ''}>Sanctum IP Camera Only</option>
              </select>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
              <button type="button" class="btn btn-secondary" onclick="window.admin.closeLocationModal()">Cancel</button>
              <button type="submit" class="btn btn-primary">${loc ? 'Save Changes' : 'Create Location'}</button>
            </div>
          </form>
        </div>
      </div>
    `;
    overlay.style.display = 'flex';
  }

  saveLocationForm() {
    const name = document.getElementById('modal-loc-name').value.trim();
    const kannada = document.getElementById('modal-loc-kannada').value.trim();
    const desc = document.getElementById('modal-loc-desc').value.trim();
    const sources = document.getElementById('modal-loc-sources').value;

    if (!name) {
      alert("Location name is required.");
      return;
    }

    const payload = {
      id: this.editingLocation ? this.editingLocation.id : null,
      name,
      kannadaName: kannada,
      description: desc,
      supportedSources: sources,
      status: this.editingLocation ? this.editingLocation.status : 'ACTIVE'
    };

    streamingService.saveLocation(payload);
    showToast("Streaming location saved successfully.", "success");
    this.closeLocationModal();
    this.render();
  }

  toggleLocationStatus(id) {
    streamingService.toggleLocationStatus(id);
    this.render();
  }

  moveLocation(id, direction) {
    const locs = streamingService.getLocations();
    const idx = locs.findIndex(l => l.id === id);
    if (idx < 0) return;

    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= locs.length) return;

    // Swap order
    const orderedIds = locs.map(l => l.id);
    const temp = orderedIds[idx];
    orderedIds[idx] = orderedIds[targetIdx];
    orderedIds[targetIdx] = temp;

    streamingService.reorderLocations(orderedIds);
    this.render();
  }

  deleteLocation(id) {
    if (!confirm("Are you sure you want to delete this streaming location? Historical session analytics will remain safely preserved.")) return;

    try {
      streamingService.deleteLocation(id);
      showToast("Location deleted.", "info");
      this.render();
    } catch (e) {
      alert(e.message);
    }
  }

  closeLocationModal() {
    const overlay = document.getElementById('admin-modal-overlay');
    if (overlay) {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
    }
    this.editingLocation = null;
  }

  // ==================== TAB: LIVE DARSHAN ANALYTICS ====================
  _renderLiveAnalyticsTab() {
    const summary = analyticsService.getMetricsSummary();
    const activeBroadcasts = streamingService.getActiveBroadcasts();
    const viewerSessions = templeStore.getViewerSessions().slice(-15).reverse();

    return `
      <!-- Top Live KPI Row -->
      <div class="metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-bottom: 24px;">
        <div class="metric-card">
          <div class="metric-info">
            <h4>Live Viewers Right Now</h4>
            <div class="metric-num" style="color: #E53935; font-size: 1.8rem;">${summary.currentLiveViewers}</div>
            <div class="metric-sub">Verified real-time heartbeats</div>
          </div>
          <div class="metric-icon">👁️</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>Peak Concurrent Viewers</h4>
            <div class="metric-num" style="color: var(--color-primary);">${summary.peakConcurrency}</div>
            <div class="metric-sub">Highest simultaneous audience</div>
          </div>
          <div class="metric-icon">📈</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>Total Watch Minutes</h4>
            <div class="metric-num" style="color: #D95D0F;">${summary.totalWatchMinutes} m</div>
            <div class="metric-sub">Total sanctum prayer time</div>
          </div>
          <div class="metric-icon">⏱️</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>Active Streams</h4>
            <div class="metric-num">${activeBroadcasts.length}</div>
            <div class="metric-sub">Broadcasting right now</div>
          </div>
          <div class="metric-icon">📡</div>
        </div>
      </div>

      <!-- Active Viewers Table -->
      <div class="card" style="padding: 24px;">
        <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); margin: 0 0 14px;">
          👥 Recent Devotee Viewer Heartbeats (Real-Time Telemetry)
        </h3>
        <div style="overflow-x: auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Viewer Session</th>
                <th>Location</th>
                <th>Platform</th>
                <th>Watch Duration</th>
                <th>Status</th>
                <th>Last Heartbeat</th>
              </tr>
            </thead>
            <tbody>
              ${viewerSessions.length === 0 ? `
                <tr><td colspan="6" style="text-align: center; color: #888;">No viewer sessions recorded yet. Start a broadcast and view on PWA to see live telemetry.</td></tr>
              ` : viewerSessions.map(vs => `
                <tr>
                  <td><code>${vs.id}</code></td>
                  <td><strong>${vs.locationName || vs.locationId}</strong></td>
                  <td><span class="badge ${vs.platform === 'PWA' ? 'badge-gold' : ''}">${vs.platform}</span></td>
                  <td>${Math.round((vs.durationSeconds || 0) / 60)} min (${vs.durationSeconds || 0}s)</td>
                  <td>
                    <span class="badge ${vs.isActive ? 'badge-success' : ''}">
                      ${vs.isActive ? 'WATCHING NOW' : 'ENDED'}
                    </span>
                  </td>
                  <td>${new Date(vs.lastHeartbeatAt || vs.startedAt).toLocaleTimeString('en-IN')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  // ==================== TAB: PLATFORM ANALYTICS ====================
  _renderAnalyticsTab() {
    const summary = analyticsService.getMetricsSummary();

    return `
      <!-- Analytics KPI Row -->
      <div class="metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-bottom: 24px;">
        <div class="metric-card">
          <div class="metric-info">
            <h4>Total Page Views</h4>
            <div class="metric-num" style="color: var(--color-primary);">${summary.totalPageViews}</div>
            <div class="metric-sub">Unique content impressions</div>
          </div>
          <div class="metric-icon">📄</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>Devotee Sessions</h4>
            <div class="metric-num">${summary.totalSessions}</div>
            <div class="metric-sub">PWA: ${summary.pwaRatio}% | Browser: ${summary.browserRatio}%</div>
          </div>
          <div class="metric-icon">👥</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>Seva Inquiries</h4>
            <div class="metric-num" style="color: #D95D0F;">${summary.totalPoojaViews}</div>
            <div class="metric-sub">${summary.totalReservations} Sankalpa Reservations</div>
          </div>
          <div class="metric-icon">🪔</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>Push Subscribers</h4>
            <div class="metric-num" style="color: #059669;">${summary.activePushSubscribers}</div>
            <div class="metric-sub">Registered notification tokens</div>
          </div>
          <div class="metric-icon">🔔</div>
        </div>
      </div>

      <!-- Platform Attribution Visual Card -->
      <div class="card" style="padding: 24px; margin-bottom: 24px;">
        <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); margin: 0 0 14px;">
          📱 Platform Attribution: Installed Devotee PWA vs Standard Browser
        </h3>
        
        <div style="background: #F5F1EA; border-radius: 12px; height: 32px; overflow: hidden; display: flex; margin-bottom: 12px;">
          <div style="width: ${summary.pwaRatio}%; background: #721C2B; color: #FFF; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; justify-content: center;">
            ${summary.pwaRatio > 10 ? `PWA (${summary.pwaRatio}%)` : ''}
          </div>
          <div style="width: ${summary.browserRatio}%; background: #C59B27; color: #1C1917; font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; justify-content: center;">
            ${summary.browserRatio > 10 ? `Web Browser (${summary.browserRatio}%)` : ''}
          </div>
        </div>

        <div style="display: flex; gap: 24px; font-size: 0.88rem;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="width: 12px; height: 12px; background: #721C2B; border-radius: 3px; display: inline-block;"></span>
            <span><strong>Installed PWA Devotees:</strong> ${summary.pwaSessionsCount} sessions (${summary.pwaRatio}%)</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="width: 12px; height: 12px; background: #C59B27; border-radius: 3px; display: inline-block;"></span>
            <span><strong>Web Browser Devotees:</strong> ${summary.browserSessionsCount} sessions (${summary.browserRatio}%)</span>
          </div>
        </div>
      </div>

      <!-- Export & Raw Telemetry -->
      <div class="card" style="padding: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); margin: 0 0 4px;">
              📊 Export Analytics & Telemetry Log
            </h3>
            <p style="font-size: 0.82rem; color: var(--color-text-soft); margin: 0;">
              Download authentic temple analytics records for audit, trustee review, and monthly reports.
            </p>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-secondary btn-sm" onclick="window.admin.exportAnalyticsJson()">
              📥 Export JSON
            </button>
            <button class="btn btn-primary btn-sm" onclick="window.admin.exportAnalyticsCsv()">
              📊 Export CSV
            </button>
          </div>
        </div>
      </div>
    `;
  }

  exportAnalyticsJson() {
    const data = {
      summary: analyticsService.getMetricsSummary(),
      events: templeStore.getAnalyticsEvents(),
      viewerSessions: templeStore.getViewerSessions(),
      exportedAt: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `temple-analytics-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast("Analytics JSON exported successfully.", "success");
  }

  exportAnalyticsCsv() {
    const events = templeStore.getAnalyticsEvents();
    if (events.length === 0) {
      alert("No events recorded yet to export.");
      return;
    }

    const headers = ['id', 'timestamp', 'event', 'platform', 'sessionId'];
    const rows = events.map(e => [
      e.id,
      e.timestamp,
      e.event,
      e.platform || 'UNKNOWN',
      e.sessionId || ''
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `temple-events-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast("Analytics CSV exported successfully.", "success");
  }

  // ==================== TAB: WEB PUSH NOTIFICATIONS ====================
  _renderNotificationsTab() {
    const subs = templeStore.getPushSubscriptions();
    const history = templeStore.getNotificationHistory();
    const activeCount = subs.filter(s => s.status === 'ACTIVE').length;

    return `
      <!-- Push Subscribers Overview -->
      <div class="metrics-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-bottom: 24px;">
        <div class="metric-card">
          <div class="metric-info">
            <h4>Total Push Tokens</h4>
            <div class="metric-num" style="color: #059669;">${subs.length}</div>
            <div class="metric-sub">${activeCount} active devotees</div>
          </div>
          <div class="metric-icon">🔔</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>Live Darshan Alerts</h4>
            <div class="metric-num">${subs.filter(s => s.preferences && s.preferences.liveDarshan).length}</div>
            <div class="metric-sub">Opted-in for live notifications</div>
          </div>
          <div class="metric-icon">🪔</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>Total Dispatched</h4>
            <div class="metric-num" style="color: var(--color-primary);">${history.length}</div>
            <div class="metric-sub">Alerts broadcasted to date</div>
          </div>
          <div class="metric-icon">📢</div>
        </div>
      </div>

      <!-- Broadcast Composer Form -->
      <div class="card" style="padding: 24px; margin-bottom: 24px;">
        <h3 style="font-family: var(--font-serif); font-size: 1.2rem; color: var(--color-primary); margin: 0 0 16px;">
          🚀 Broadcast Web Push Notification to Devotees
        </h3>

        <form onsubmit="event.preventDefault(); window.admin.sendPushBroadcast();">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px;">
            <div class="form-group">
              <label class="form-label" for="push-title">Notification Title (English) *</label>
              <input type="text" id="push-title" class="form-input" required placeholder="e.g. Mahamangalarathi Live Darshan Starting 🪔" value="Live Darshan Starting at Garbha Gudi 🪔">
            </div>

            <div class="form-group">
              <label class="form-label" for="push-kannada-title">Kannada Title</label>
              <input type="text" id="push-kannada-title" class="form-input" placeholder="e.g. ಗರ್ಭಗುಡಿಯಲ್ಲಿ ಮಹಾಮಂಗಳಾರತಿ ನೇರ ಪ್ರಸಾರ" value="ಮುಖ್ಯ ಗರ್ಭಗುಡಿಯಲ್ಲಿ ನೇರ ದರ್ಶನ ಪ್ರಾರಂಭವಾಗಿದೆ">
            </div>
          </div>

          <div class="form-group" style="margin-bottom: 14px;">
            <label class="form-label" for="push-body">Message Body *</label>
            <textarea id="push-body" class="form-input" rows="2" required placeholder="Auspicious message sent directly to devotee mobile lock screens">Join the sacred live telecast from Sri Durga Devi Temple, Chandra Layout, Bengaluru.</textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px;">
            <div class="form-group">
              <label class="form-label" for="push-category">Target Category</label>
              <select id="push-category" class="form-input">
                <option value="ALL">All Devotees</option>
                <option value="LIVE_DARSHAN" selected>Live Darshan Subscribers Only</option>
                <option value="FESTIVALS_EVENTS">Festivals & Special Utsavas</option>
                <option value="SPECIAL_POOJAS">Special Poojas & Homas</option>
                <option value="DAILY_PANCHAANGA">Daily Vedic Panchanga</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="push-url">Target Destination URL</label>
              <input type="text" id="push-url" class="form-input" value="app.html#live">
            </div>
          </div>

          <button type="submit" class="btn btn-primary" style="padding: 12px 24px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px;">
            <span>🚀</span> Send Web Push Notification Now
          </button>
        </form>
      </div>

      <!-- Dispatch History Log Table -->
      <div class="card" style="padding: 24px;">
        <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); margin: 0 0 14px;">
          📜 Notification Broadcast History
        </h3>
        <div style="overflow-x: auto;">
          <table class="admin-table">
            <thead>
              <tr>
                <th>Dispatched At</th>
                <th>Title</th>
                <th>Category</th>
                <th>Recipients</th>
                <th>Triggered By</th>
              </tr>
            </thead>
            <tbody>
              ${history.length === 0 ? `
                <tr><td colspan="5" style="text-align: center; color: #888;">No notification dispatches recorded yet.</td></tr>
              ` : history.map(h => `
                <tr>
                  <td>${new Date(h.timestamp).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</td>
                  <td><strong>${h.title}</strong></td>
                  <td><span class="badge">${h.category || h.type || 'ALL'}</span></td>
                  <td><strong>${h.sentCount || 1}</strong> devotees</td>
                  <td><span style="font-size: 0.8rem; color: #555;">${h.sentBy || h.triggeredBy || 'System'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  async sendPushBroadcast() {
    const title = document.getElementById('push-title').value.trim();
    const kannadaTitle = document.getElementById('push-kannada-title').value.trim();
    const body = document.getElementById('push-body').value.trim();
    const category = document.getElementById('push-category').value;
    const targetUrl = document.getElementById('push-url').value.trim();

    if (!title || !body) {
      alert("Notification title and body are required.");
      return;
    }

    try {
      const record = await pushNotificationService.dispatchNotification({
        title,
        kannadaTitle,
        body,
        category,
        targetUrl,
        adminUser: this.currentAdminUser ? this.currentAdminUser.name : 'Trustee Desk'
      });

      showToast(`Notification sent to ${record.sentCount} devotees! 🪔`, "success");
      this.render();
    } catch (e) {
      alert("Failed to dispatch notification: " + e.message);
    }
  }

  _bindLoginEvents() {
    // Autolistener for PIN digits
    const pinInput = document.getElementById('admin-pin-input');
    if (pinInput) {
      pinInput.addEventListener('input', (e) => {
        if (e.target.value.length === 4) {
          this.handlePinSubmit();
        }
      });
    }
  }

  _bindDashboardEvents() {
    // any interactive events
  }

  _startLiveClock() {
    setInterval(() => {
      const clockEl = document.getElementById('live-ist-clock');
      if (clockEl) {
        clockEl.textContent = `${new Date().toLocaleTimeString('en-IN')} IST`;
      }
    }, 1000);
  }
}

// Instantiate and expose globally
const initAdmin = () => {
  if (!window.admin) {
    window.admin = new TempleAdminController();
  }
  window.admin.init();
};

window.admin = new TempleAdminController();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdmin);
} else {
  initAdmin();
}
