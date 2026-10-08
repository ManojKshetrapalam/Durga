/**
 * Sri Durga Devi Temple — Administrative Control Mandapa Webpage Controller
 * Full Desktop & Responsive Webpage Experience for Trustees and Archakas
 */

import { templeStore } from './services/store.js?v=20261007_08';
import { PanchangaService } from './services/panchangaService.js?v=20261007_08';
import { AvailabilityEngine } from './services/availabilityEngine.js?v=20261007_08';
import { WhatsAppService } from './services/whatsappService.js?v=20261007_08';

class TempleAdminController {
  constructor() {
    this.isAuthenticated = false;
    this.currentAdminUser = null;
    this.currentTab = 'overview'; // 'overview', 'calendar', 'sevas', 'bookings', 'broadcast'
    this.selectedDate = new Date().toISOString().split('T')[0];
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
          <button class="sidebar-nav-item ${this.currentTab === 'broadcast' ? 'active' : ''}" onclick="window.admin.switchTab('broadcast')">
            <span>📢</span> Devotee Notice Board
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
          <a href="app.html" class="btn btn-secondary btn-sm" target="_blank" title="Preview Mobile Devotee PWA">
            📱 Devotee PWA
          </a>
        </div>
      </header>
    `;
  }

  _getTabTitle() {
    switch (this.currentTab) {
      case 'overview': return '📊 Real-Time Operations Desk';
      case 'calendar': return '📅 Date Availability & Sanctum Overrides';
      case 'sevas': return '🪔 21 Authentic Sevas & Pricing Manager';
      case 'bookings': return '📱 WhatsApp Booking Requests & Archaka Queue';
      case 'broadcast': return '📢 Devotee Notice Board & Announcements';
      default: return 'Administrative Desk';
    }
  }

  _renderActiveContent() {
    switch (this.currentTab) {
      case 'overview': return this._renderOverviewTab();
      case 'calendar': return this._renderCalendarTab();
      case 'sevas': return this._renderSevasTab();
      case 'bookings': return this._renderBookingsTab();
      case 'events': return this._renderEventsTab();
      case 'broadcast': return this._renderBroadcastTab();
      default: return this._renderOverviewTab();
    }
  }

  // ==================== TAB 1: OVERVIEW ====================
  _renderOverviewTab() {
    const sevas = templeStore.getSevas();
    const blockedDates = templeStore.getBlockedDates();
    const bookings = templeStore.getBookings();
    const pendingCount = bookings.filter(b => b.bookingStatus === 'NEEDS_ARCHAKA').length;
    const panchanga = PanchangaService.getPanchanga(new Date());

    return `
      <!-- Metrics Row -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-info">
            <h4>Temple Status</h4>
            <div class="metric-num" style="color: var(--color-success); font-size: 1.5rem;">OPEN 🟢</div>
            <div class="metric-sub">${panchanga.formattedDate}</div>
          </div>
          <div class="metric-icon">🏛️</div>
        </div>

        <div class="metric-card">
          <div class="metric-info">
            <h4>Active Sevas</h4>
            <div class="metric-num">${sevas.length}</div>
            <div class="metric-sub">₹10 Kumkuma Archana to ₹1,501 Durga Homa</div>
          </div>
          <div class="metric-icon">🪔</div>
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
            <h4>Date Overrides</h4>
            <div class="metric-num">${blockedDates.length}</div>
            <div class="metric-sub">Admin blocks take instant precedence</div>
          </div>
          <div class="metric-icon">🛡️</div>
        </div>
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
            <span class="badge badge-gold">${panchanga.ritu}</span>
          </div>
          <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 10px; margin-top: 12px;">
            <div style="padding: 8px 12px; background: var(--color-canvas); border-radius: var(--radius-md);">
              <span style="color: var(--color-text-soft); font-size: 0.75rem; font-weight: 700;">TITHI & NAKSHATRA</span>
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
          Admin supremacy rule: Any blocked date automatically overrides astrological availability across the devotee PWA.
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
                      <option value="Pandit Narayana Bhat" ${b.assignedArchaka === 'Pandit Narayana Bhat' ? 'selected' : ''}>Pandit Narayana Bhat</option>
                      <option value="Pandit Subrahmanya Somayaji" ${b.assignedArchaka === 'Pandit Subrahmanya Somayaji' ? 'selected' : ''}>Pandit Subrahmanya Somayaji</option>
                      <option value="Pandit Venkatesh Dixit" ${b.assignedArchaka === 'Pandit Venkatesh Dixit' ? 'selected' : ''}>Pandit Venkatesh Dixit</option>
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

  // ==================== TAB 5: BROADCAST NOTICE ====================
  _renderBroadcastTab() {
    const ann = templeStore.getAnnouncement();

    return `
      <div class="card" style="max-width: 720px; background: var(--color-surface); border: 1px solid var(--color-border);">
        <h3 class="card-title"><span>📢</span> Devotee Notice Board & Live Broadcast</h3>
        <p style="font-size: 0.85rem; color: var(--color-text-soft); margin-bottom: 20px;">
          This banner appears prominently at the top of the Devotee Mobile PWA and Web Landing Page.
        </p>

        <form onsubmit="event.preventDefault(); window.admin.updateAnnouncement();">
          <div class="form-group">
            <label class="form-label">Broadcast Announcement Text</label>
            <textarea id="broadcast-input-msg" class="form-input" rows="4" required>${ann.message || ''}</textarea>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 20px;">
            <label style="display: flex; align-items: center; gap: 10px; cursor: pointer;">
              <input type="checkbox" id="broadcast-input-publish" ${ann.isPublished ? 'checked' : ''} style="width: 18px; height: 18px;">
              <span style="font-weight: 700; color: var(--color-primary);">Publish Banner Live 🟢</span>
            </label>
            <button type="submit" class="btn btn-primary">
              💾 Save & Broadcast
            </button>
          </div>
        </form>
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
    const archakas = ["Pandit Narayana Bhat", "Pandit Subrahmanya Somayaji", "Pandit Venkatesh Dixit"];
    const chosen = archakas[0];
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
