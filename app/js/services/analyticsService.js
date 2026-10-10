/**
 * Sri Durga Devi Temple — Digital Mandapa: Centralized Analytics Service
 * Provides standardized event logging, platform attribution (PWA vs Browser),
 * anonymous session tracking, and live viewer concurrency heartbeats.
 */

import { templeStore } from './store.js';

export const ANALYTICS_EVENT = {
  PAGE_VIEW: 'PAGE_VIEW',
  POOJA_VIEW: 'POOJA_VIEW',
  CALENDAR_DATE_SELECTED: 'CALENDAR_DATE_SELECTED',
  MONTHLY_CALENDAR_OPENED: 'MONTHLY_CALENDAR_OPENED',
  PANCHAANGA_VIEWED: 'PANCHAANGA_VIEWED',
  SEVA_RESERVATION_INITIATED: 'SEVA_RESERVATION_INITIATED',
  WHATSAPP_CLICK: 'WHATSAPP_CLICK',
  LIVE_PAGE_OPENED: 'LIVE_PAGE_OPENED',
  PLAYBACK_STARTED: 'PLAYBACK_STARTED',
  PLAYBACK_ENDED: 'PLAYBACK_ENDED',
  WATCH_DURATION_HEARTBEAT: 'WATCH_DURATION_HEARTBEAT',
  PWA_INSTALL_PROMPT_SHOWN: 'PWA_INSTALL_PROMPT_SHOWN',
  PWA_INSTALLED: 'PWA_INSTALLED',
  PUSH_NOTIFICATION_PROMPT_SHOWN: 'PUSH_NOTIFICATION_PROMPT_SHOWN',
  PUSH_NOTIFICATION_OPT_IN: 'PUSH_NOTIFICATION_OPT_IN',
  PUSH_NOTIFICATION_OPT_OUT: 'PUSH_NOTIFICATION_OPT_OUT',
  PUSH_NOTIFICATION_CLICKED: 'PUSH_NOTIFICATION_CLICKED'
};

export const PLATFORM_TYPE = {
  PWA: 'PWA',
  BROWSER: 'BROWSER',
  UNKNOWN: 'UNKNOWN'
};

class AnalyticsService {
  constructor() {
    this.sessionId = null;
    this.platform = this._detectPlatform();
    this.activeViewerSession = null;
    this.heartbeatTimer = null;
    this.HEARTBEAT_INTERVAL_MS = 20000; // 20s heartbeat window
    this._initSession();
    this._attachUnloadListeners();
  }

  // ==================== 1. PLATFORM DETECTION & SESSION INIT ====================
  _detectPlatform() {
    if (typeof window === 'undefined') return PLATFORM_TYPE.UNKNOWN;

    // Detect standalone PWA mode across Chrome/Android, iOS Safari, and Desktop PWA
    const isStandaloneMedia = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isIosStandalone = window.navigator && window.navigator.standalone === true;
    const isDocumentReferrerPwa = document.referrer && document.referrer.includes('android-app://');

    if (isStandaloneMedia || isIosStandalone || isDocumentReferrerPwa) {
      return PLATFORM_TYPE.PWA;
    }
    return PLATFORM_TYPE.BROWSER;
  }

  getPlatform() {
    return this.platform;
  }

  _initSession() {
    if (typeof window === 'undefined') return;

    try {
      const storedSess = sessionStorage.getItem('sdd_analytics_sess_id');
      if (storedSess) {
        this.sessionId = storedSess;
      } else {
        this.sessionId = 'sess-' + Date.now() + '-' + Math.floor(1000 + Math.random() * 9000);
        sessionStorage.setItem('sdd_analytics_sess_id', this.sessionId);
      }

      // Record / update session in store
      templeStore.recordAnalyticsSession({
        id: this.sessionId,
        platform: this.platform,
        userAgent: typeof navigator !== 'undefined' ? (navigator.userAgent || '') : '',
        screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
        screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0
      });
    } catch (e) {
      this.sessionId = 'sess-' + Date.now();
    }
  }

  _attachUnloadListeners() {
    if (typeof window === 'undefined') return;

    const finalize = () => {
      if (this.activeViewerSession) {
        this.stopViewerHeartbeat('PAGE_UNLOAD');
      }
    };

    window.addEventListener('beforeunload', finalize);
    window.addEventListener('pagehide', finalize);
  }

  // ==================== 2. EVENT LOGGING ====================
  logEvent(eventName, properties = {}) {
    if (!eventName) return null;

    const eventRecord = {
      event: eventName,
      sessionId: this.sessionId,
      platform: this.platform,
      properties: properties,
      timestamp: new Date().toISOString()
    };

    try {
      return templeStore.logAnalyticsEvent(eventRecord);
    } catch (e) {
      console.warn('[AnalyticsService] Failed to record event:', e);
      return { id: 'evt-' + Date.now(), ...eventRecord };
    }
  }

  // Shortcut helpers for common events
  trackPageView(pageTitle, path = window.location.hash || window.location.pathname) {
    return this.logEvent(ANALYTICS_EVENT.PAGE_VIEW, { title: pageTitle, path });
  }

  trackPoojaView(poojaId, poojaName, kanike) {
    return this.logEvent(ANALYTICS_EVENT.POOJA_VIEW, { poojaId, poojaName, kanike });
  }

  trackCalendarDate(date, sevaId = null) {
    return this.logEvent(ANALYTICS_EVENT.CALENDAR_DATE_SELECTED, { date, sevaId });
  }

  trackMonthlyCalendar(year, month) {
    return this.logEvent(ANALYTICS_EVENT.MONTHLY_CALENDAR_OPENED, { year, month });
  }

  trackPanchanga() {
    return this.logEvent(ANALYTICS_EVENT.PANCHAANGA_VIEWED, { date: new Date().toISOString().slice(0, 10) });
  }

  trackReservationInitiated(sevaId, sevaName, kanike, date, token) {
    return this.logEvent(ANALYTICS_EVENT.SEVA_RESERVATION_INITIATED, { sevaId, sevaName, kanike, date, token });
  }

  trackWhatsAppClick(context, details = {}) {
    return this.logEvent(ANALYTICS_EVENT.WHATSAPP_CLICK, { context, ...details });
  }

  // ==================== 3. LIVE STREAM VIEWER HEARTBEATS ====================
  startViewerHeartbeat(liveSessionId, locationId, locationName = '') {
    if (!liveSessionId) return null;

    // End prior viewer session if switching streams
    if (this.activeViewerSession && this.activeViewerSession.liveSessionId !== liveSessionId) {
      this.stopViewerHeartbeat('STREAM_SWITCHED');
    }

    if (this.activeViewerSession && this.activeViewerSession.liveSessionId === liveSessionId) {
      return this.activeViewerSession;
    }

    const viewerSessionId = 'vwr-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900);
    const viewerRecord = {
      id: viewerSessionId,
      liveSessionId: liveSessionId,
      locationId: locationId,
      locationName: locationName,
      platform: this.platform,
      clientSessionId: this.sessionId,
      startedAt: new Date().toISOString(),
      durationSeconds: 0,
      isActive: true
    };

    templeStore.saveViewerSession(viewerRecord);
    this.activeViewerSession = viewerRecord;

    this.logEvent(ANALYTICS_EVENT.PLAYBACK_STARTED, {
      liveSessionId,
      locationId,
      locationName,
      viewerSessionId
    });

    // Send immediate initial ping to server
    this._sendHeartbeat();

    // Start recurring heartbeat every 10 seconds
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      this._sendHeartbeat();
    }, 10000);

    return viewerRecord;
  }

  async _sendHeartbeat() {
    if (!this.activeViewerSession || !this.activeViewerSession.isActive) return;

    try {
      const updated = templeStore.updateViewerHeartbeat(this.activeViewerSession.id);
      if (updated) {
        this.activeViewerSession = updated;
      }

      this.logEvent(ANALYTICS_EVENT.WATCH_DURATION_HEARTBEAT, {
        liveSessionId: this.activeViewerSession.liveSessionId,
        locationId: this.activeViewerSession.locationId,
        viewerSessionId: this.activeViewerSession.id,
        durationSeconds: this.activeViewerSession.durationSeconds
      });

      // Send cross-device viewer ping to server
      if (typeof window !== 'undefined' && typeof fetch === 'undefined') return;
      if (typeof streamingService !== 'undefined' && streamingService.getApiUrl) {
        const url = streamingService.getApiUrl('api/live-status.php');
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'VIEWER_PING',
            sessionId: this.activeViewerSession.liveSessionId,
            viewerId: this.activeViewerSession.id
          })
        });
        if (res && res.ok) {
          const data = await res.json();
          if (data && data.success && typeof data.viewerCount === 'number') {
            templeStore.updateSessionViewerStats(
              this.activeViewerSession.liveSessionId,
              data.viewerCount,
              data.peakViewers || data.viewerCount
            );
            if (streamingService._broadcastEvent) {
              streamingService._broadcastEvent('VIEWER_COUNT_UPDATED', {
                count: data.viewerCount,
                peak: data.peakViewers || data.viewerCount,
                sessionId: this.activeViewerSession.liveSessionId
              });
            }
          }
        }
      }
    } catch (e) {
      // Non-blocking telemetry
    }
  }

  stopViewerHeartbeat(reason = 'PLAYBACK_ENDED') {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (!this.activeViewerSession) return;

    const oldSession = this.activeViewerSession;
    this.activeViewerSession = null;

    try {
      const finalSession = templeStore.endViewerSession(oldSession.id);
      this.logEvent(ANALYTICS_EVENT.PLAYBACK_ENDED, {
        liveSessionId: oldSession.liveSessionId,
        locationId: oldSession.locationId,
        viewerSessionId: oldSession.id,
        durationSeconds: finalSession ? finalSession.durationSeconds : (oldSession.durationSeconds || 0),
        reason
      });

      // Notify server of departure
      if (typeof streamingService !== 'undefined' && streamingService.getApiUrl) {
        const url = streamingService.getApiUrl('api/live-status.php');
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'VIEWER_LEAVE',
            sessionId: oldSession.liveSessionId,
            viewerId: oldSession.id
          }),
          keepalive: true
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('[AnalyticsService] End viewer session error:', e);
    }
  }

  getCurrentViewerSession() {
    return this.activeViewerSession;
  }

  // ==================== 4. AGGREGATED METRICS & REPORTING ====================
  getMetricsSummary() {
    const events = templeStore.getAnalyticsEvents();
    const sessions = templeStore.getAnalyticsSessions();
    const viewerSessions = templeStore.getViewerSessions();
    const liveSessions = templeStore.getLiveSessions();
    const pushSubs = templeStore.getPushSubscriptions();

    const totalEvents = events.length;
    const totalSessions = sessions.length;

    // Platform breakdown
    let pwaSessionsCount = 0;
    let browserSessionsCount = 0;
    sessions.forEach(s => {
      if (s.platform === PLATFORM_TYPE.PWA) pwaSessionsCount++;
      else browserSessionsCount++;
    });

    const pwaRatio = totalSessions > 0 ? Math.round((pwaSessionsCount / totalSessions) * 100) : 0;
    const browserRatio = totalSessions > 0 ? Math.round((browserSessionsCount / totalSessions) * 100) : 0;

    // Page views
    const pageViewEvents = events.filter(e => e.event === ANALYTICS_EVENT.PAGE_VIEW);
    const totalPageViews = pageViewEvents.length;

    // Seva interest
    const poojaViews = events.filter(e => e.event === ANALYTICS_EVENT.POOJA_VIEW);
    const reservations = events.filter(e => e.event === ANALYTICS_EVENT.SEVA_RESERVATION_INITIATED);
    const whatsappClicks = events.filter(e => e.event === ANALYTICS_EVENT.WHATSAPP_CLICK);

    // Live Streaming Metrics
    const playbackStarted = events.filter(e => e.event === ANALYTICS_EVENT.PLAYBACK_STARTED);
    let totalWatchSeconds = 0;
    viewerSessions.forEach(vs => {
      totalWatchSeconds += (vs.durationSeconds || 0);
    });

    // Peak concurrent viewers calculation across all live sessions
    let peakConcurrency = 0;
    liveSessions.forEach(ls => {
      if ((ls.peakViewers || 0) > peakConcurrency) peakConcurrency = ls.peakViewers;
    });

    // Current active viewers
    let currentLiveViewers = 0;
    const activeBroadcasts = templeStore.getActiveLiveSessions();
    activeBroadcasts.forEach(ab => {
      currentLiveViewers += templeStore.getActiveViewerCount(ab.id);
    });

    return {
      totalPageViews,
      totalSessions,
      pwaSessionsCount,
      browserSessionsCount,
      pwaRatio,
      browserRatio,
      currentLiveViewers,
      peakConcurrency,
      totalPlaybackStarts: playbackStarted.length,
      totalWatchMinutes: Math.round(totalWatchSeconds / 60),
      totalPoojaViews: poojaViews.length,
      totalReservations: reservations.length,
      totalWhatsAppClicks: whatsappClicks.length,
      totalPushSubscribers: pushSubs.length,
      activePushSubscribers: pushSubs.filter(s => s.status !== 'INACTIVE').length
    };
  }

  getLiveSessionReport(sessionId) {
    const session = templeStore.getLiveSessionById(sessionId);
    if (!session) return null;

    const allViewerSessions = templeStore.getViewerSessions().filter(vs => vs.liveSessionId === sessionId);
    const totalWatchSeconds = allViewerSessions.reduce((acc, curr) => acc + (curr.durationSeconds || 0), 0);
    const avgWatchSeconds = allViewerSessions.length > 0 ? Math.round(totalWatchSeconds / allViewerSessions.length) : 0;
    const currentViewers = templeStore.getActiveViewerCount(sessionId);

    return {
      session,
      currentViewers,
      totalViewers: allViewerSessions.length,
      peakViewers: Math.max(session.peakViewers || 0, currentViewers),
      totalWatchMinutes: Math.round(totalWatchSeconds / 60),
      averageWatchSeconds: avgWatchSeconds
    };
  }
}

export const analyticsService = new AnalyticsService();
