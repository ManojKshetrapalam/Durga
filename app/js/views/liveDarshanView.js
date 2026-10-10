/**
 * Sri Durga Devi Temple — Digital Mandapa: Live Darshan View
 * Devotee-facing unified live streaming player for PWA and Mobile viewports.
 * Reuses authentic temple design tokens and provides real-time viewer concurrency,
 * location switcher, sanctum schedules, and Web Push opt-in.
 */

import { streamingService, STREAM_STATUS } from '../services/streamingService.js';
import { analyticsService, ANALYTICS_EVENT } from '../services/analyticsService.js';
import { pushNotificationService } from '../services/pushNotificationService.js';
import { TEMPLE_TIMINGS } from '../data/timings.js';

export function renderLiveDarshanView(preferredLocationId = null) {
  const liveState = streamingService.getPublicLiveDarshanState(preferredLocationId);
  const isLive = liveState.isLive;
  const session = liveState.session;
  const selectedLocation = liveState.selectedLocation;
  const locations = liveState.availableLocations;
  const isPushEnabled = pushNotificationService.hasOptedIn();

  return `
    <div class="view-live-darshan" style="padding-bottom: 32px;">
      <!-- Top Title & Badge -->
      <section class="live-header" style="margin-bottom: 12px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px;">
          <div>
            <h2 style="font-family: var(--font-serif); font-size: 1.35rem; color: var(--color-primary); margin: 0; line-height: 1.2;">
              ನೇರ ದರ್ಶನ • Live Darshan
            </h2>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 2px 0 0;">
              Sri Durga Parameshwari Sannidhi, Chandra Layout
            </p>
          </div>
          <div>
            ${isLive ? `
              <span class="badge" style="background: #E53935; color: #FFF; font-weight: 700; display: inline-flex; align-items: center; gap: 5px; animation: pulseGlow 1.5s infinite; border-radius: 999px; padding: 4px 10px; font-size: 0.75rem; box-shadow: 0 0 10px rgba(229, 57, 53, 0.4);">
                <span style="width: 7px; height: 7px; background: #FFF; border-radius: 50%; display: inline-block;"></span>
                LIVE
              </span>
            ` : `
              <span class="badge" style="background: #EADFCD; color: #721C2B; font-weight: 600; border-radius: 999px; padding: 4px 10px; font-size: 0.75rem;">
                SANCTUM OPEN
              </span>
            `}
          </div>
        </div>
      </section>

      <!-- Dynamic Location Switcher Tabs -->
      <section class="location-switcher-bar" style="margin-bottom: 14px; overflow-x: auto; white-space: nowrap; -webkit-overflow-scrolling: touch; padding-bottom: 4px;">
        <div style="display: inline-flex; gap: 8px;">
          ${locations.map(loc => {
            const isSelected = selectedLocation && selectedLocation.id === loc.id;
            return `
              <button 
                class="location-pill-btn ${isSelected ? 'active' : ''}" 
                data-location-id="${loc.id}"
                style="
                  display: inline-flex;
                  align-items: center;
                  gap: 6px;
                  background: ${isSelected ? 'var(--color-primary)' : 'var(--color-bg-card)'};
                  color: ${isSelected ? '#FFFDF8' : 'var(--color-text-main)'};
                  border: 1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'};
                  border-radius: 20px;
                  padding: 6px 14px;
                  font-size: 0.82rem;
                  font-weight: 500;
                  cursor: pointer;
                  transition: all 0.2s ease;
                "
              >
                ${loc.isCurrentlyLive ? `
                  <span style="width: 6px; height: 6px; background: #E53935; border-radius: 50%; display: inline-block;"></span>
                ` : ''}
                <span>${loc.name}</span>
                ${loc.kannadaName ? `<span style="font-size: 0.75rem; opacity: 0.8;">(${loc.kannadaName.split(' ')[0]})</span>` : ''}
              </button>
            `;
          }).join('')}
        </div>
      </section>

      <!-- Main Live Player Card -->
      <div class="card" style="padding: 0; overflow: hidden; border: 1px solid var(--color-border); box-shadow: 0 4px 16px rgba(0,0,0,0.06); background: #000; border-radius: 14px;">
        <div class="live-player-container" style="position: relative; width: 100%; aspect-ratio: 16/9; background: #1C1917; display: flex; align-items: center; justify-content: center;">
          ${isLive ? `
            <!-- Live Active Stream View -->
            <video 
              id="liveSanctumVideoPlayer" 
              autoplay 
              playsinline 
              muted 
              style="width: 100%; height: 100%; object-fit: cover; background: #000;"
              poster="./assets/images/navaratri-invitation.jpg"
            ></video>

            <!-- Video Simulation Fallback Canvas (Sanctum Ambient Feed) -->
            <canvas 
              id="liveSanctumVideoCanvas" 
              style="display: none; position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;"
            ></canvas>

            <!-- Live Player Controls Overlay -->
            <div style="position: absolute; top: 10px; left: 10px; display: flex; align-items: center; gap: 8px; z-index: 5;">
              <span style="background: rgba(229, 57, 53, 0.9); color: #FFF; font-size: 0.72rem; font-weight: 700; padding: 2px 8px; border-radius: 4px; letter-spacing: 0.5px;">
                ● LIVE
              </span>
              <span id="liveViewerBadge" style="background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); color: #FFF; font-size: 0.75rem; padding: 2px 8px; border-radius: 4px; display: flex; align-items: center; gap: 4px;">
                👁️ <span id="liveViewerCountNumber">${session ? session.viewerCount : 1}</span> Devotees
              </span>
            </div>

            <!-- Controls (Bottom Right) -->
            <div style="position: absolute; bottom: 10px; right: 10px; display: flex; gap: 8px; z-index: 5;">
              <button id="btnPlayerMute" class="player-ctrl-btn" title="Toggle Audio" style="background: rgba(0,0,0,0.65); color: #FFF; border: none; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                🔊
              </button>
              <button id="btnPlayerFullscreen" class="player-ctrl-btn" title="Fullscreen" style="background: rgba(0,0,0,0.65); color: #FFF; border: none; border-radius: 50%; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                ⛶
              </button>
            </div>
          ` : `
            <!-- Offline / Sanctum Quiet State -->
            <div style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 20px; background: linear-gradient(180deg, #2A1719 0%, #150A0B 100%);">
              <div style="font-size: 2.4rem; margin-bottom: 8px; filter: drop-shadow(0 2px 8px rgba(197, 155, 39, 0.5));">
                🪔
              </div>
              <h3 style="font-family: var(--font-serif); color: #FAF7F2; font-size: 1.15rem; margin-bottom: 4px;">
                ${selectedLocation ? selectedLocation.name : 'Sanctum'} Broadcast Offline
              </h3>
              <p style="color: #EADFCD; font-size: 0.85rem; max-width: 320px; margin: 0 auto 12px; line-height: 1.35; opacity: 0.9;">
                The sanctum is currently open for in-person devotees. Next live telecast will begin during temple aarti.
              </p>
              <button id="btnEnableLiveAlerts" class="btn btn-sm" style="background: #C59B27; color: #1C1917; font-weight: 600; border: none; padding: 6px 14px; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <span>🔔</span>
                <span>Notify Me When Live</span>
              </button>
            </div>
          `}
        </div>

        <!-- Player Info Sub-Card -->
        <div style="padding: 14px 16px; background: #FFFDF8; border-top: 1px solid var(--color-border);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 10px;">
            <div>
              <h4 style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--color-primary); margin: 0 0 2px;">
                ${selectedLocation ? selectedLocation.name : 'Sri Durga Devi Garbha Gudi'}
              </h4>
              <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0;">
                ${selectedLocation && selectedLocation.description ? selectedLocation.description : 'Main sanctum of Goddess Durga Parameshwari.'}
              </p>
            </div>
            ${isLive ? `
              <div style="text-align: right; flex-shrink: 0;">
                <span style="font-size: 0.72rem; color: var(--color-text-muted); display: block;">Broadcasting</span>
                <span style="font-size: 0.82rem; font-weight: 600; color: #E53935;">Real-Time HD</span>
              </div>
            ` : ''}
          </div>
        </div>
      </div>

      <!-- Live Broadcast Schedule & Aarti Timings -->
      <section class="card" style="margin-top: 16px; background: #FFFDF8;">
        <h3 style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--color-primary); margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
          <span>🗓️</span>
          <span>Daily Live Aarti & Darshan Schedule</span>
        </h3>
        
        <div style="display: flex; flex-direction: column; gap: 10px;">
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px dashed var(--color-border);">
            <div>
              <strong style="display: block; font-size: 0.9rem; color: var(--color-text-main);">Nitya Ushakala Pooja</strong>
              <span style="font-size: 0.78rem; color: var(--color-text-muted);">Daily Morning Abhishek & Alankara</span>
            </div>
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-primary);">07:00 AM</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px dashed var(--color-border);">
            <div>
              <strong style="display: block; font-size: 0.9rem; color: var(--color-text-main);">Madhyahna Mahamangalarathi</strong>
              <span style="font-size: 0.78rem; color: var(--color-text-muted);">Afternoon Maha Aarti</span>
            </div>
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-primary);">12:30 PM</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px dashed var(--color-border); background: #FFF9F2; margin: -2px -6px; padding: 8px 6px; border-radius: 6px;">
            <div>
              <strong style="display: block; font-size: 0.9rem; color: #D95D0F;">Tuesday Rahukala Deepada Seva</strong>
              <span style="font-size: 0.78rem; color: var(--color-text-muted);">Lemon Lamp Seva with Archana</span>
            </div>
            <span style="font-size: 0.85rem; font-weight: 700; color: #D95D0F;">03:30 PM</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px dashed var(--color-border); background: #FFF9F2; margin: -2px -6px; padding: 8px 6px; border-radius: 6px;">
            <div>
              <strong style="display: block; font-size: 0.9rem; color: #721C2B;">Friday Durga Homa Live Darshan</strong>
              <span style="font-size: 0.78rem; color: var(--color-text-muted);">Weekly Sacred Sanctum Homa</span>
            </div>
            <span style="font-size: 0.85rem; font-weight: 700; color: #721C2B;">10:00 AM</span>
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 2px;">
            <div>
              <strong style="display: block; font-size: 0.9rem; color: var(--color-text-main);">Ratri Mahamangalarathi</strong>
              <span style="font-size: 0.78rem; color: var(--color-text-muted);">Night Sanctum Aarti & Shayanotsava</span>
            </div>
            <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-primary);">08:30 PM</span>
          </div>
        </div>
      </section>

      <!-- Web Push Notifications Card -->
      <section class="card" style="margin-top: 14px; background: linear-gradient(180deg, #FAF2E8 0%, #FFFDF8 100%); border-left: 4px solid var(--color-primary);">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 10px;">
          <div>
            <h4 style="font-family: var(--font-serif); font-size: 0.95rem; color: var(--color-primary); margin: 0 0 4px;">
              Live Darshan Alerts & Reminders 🪔
            </h4>
            <p style="font-size: 0.82rem; color: var(--color-text-muted); margin: 0 0 10px; line-height: 1.3;">
              Never miss auspicious Deepada Seva, Friday Durga Homa, or special festival Alankaras.
            </p>
          </div>
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button id="btnTogglePushSubscription" class="btn btn-sm btn-primary" style="flex: 1;">
            ${isPushEnabled ? 'Manage Notification Preferences ⚙️' : 'Subscribe to Darshan Alerts 🔔'}
          </button>
        </div>
      </section>

      <!-- Sacred Seva CTAs -->
      <section style="display: flex; gap: 10px; margin-top: 16px;">
        <button class="btn btn-primary" style="flex: 1;" onclick="window.app.navigate('poojas')">
          Book Sankalpa Seva 🪔
        </button>
        <button class="btn btn-secondary" style="flex: 1;" onclick="window.app.navigate('calendar')">
          Check Dates 📅
        </button>
      </section>
    </div>
  `;
}

/**
 * Initializes interactive live player video canvas, listeners, and analytics heartbeats.
 */
export function initLiveDarshanView(preferredLocationId = null) {
  const liveState = streamingService.getPublicLiveDarshanState(preferredLocationId);
  const locationId = liveState.selectedLocation ? liveState.selectedLocation.id : null;
  const session = liveState.session;

  // Log page open event
  analyticsService.logEvent(ANALYTICS_EVENT.LIVE_PAGE_OPENED, {
    locationId,
    locationName: liveState.selectedLocation ? liveState.selectedLocation.name : ''
  });

  // Attach location pills listeners
  document.querySelectorAll('.location-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetLocId = btn.getAttribute('data-location-id');
      if (window.app) {
        window.app.navigate('live', { selectedLiveLocationId: targetLocId });
      }
    });
  });

  // Start viewer heartbeat if stream is live
  if (liveState.isLive && session) {
    analyticsService.startViewerHeartbeat(
      session.id,
      session.locationId,
      session.locationName
    );

    // Initialize player audio / canvas
    const video = document.getElementById('liveSanctumVideoPlayer');
    const muteBtn = document.getElementById('btnPlayerMute');
    const fsBtn = document.getElementById('btnPlayerFullscreen');

    if (muteBtn && video) {
      muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? '🔇' : '🔊';
      });
    }

    if (fsBtn && video) {
      fsBtn.addEventListener('click', () => {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        } else if (video.webkitRequestFullscreen) {
          video.webkitRequestFullscreen();
        }
      });
    }

    // If local publisher stream is running in this browser window, feed directly
    const publisherStream = streamingService.getActivePublisherStream();
    if (publisherStream && video) {
      video.srcObject = publisherStream;
      video.play().catch(() => {});
    } else if (video) {
      initViewerLiveFeed(video, liveState.selectedLocation);
    }
  }

  // Push subscription trigger
  const pushBtn = document.getElementById('btnTogglePushSubscription');
  const alertBtn = document.getElementById('btnEnableLiveAlerts');

  const handleSubscribe = async () => {
    try {
      const res = await pushNotificationService.requestSubscription();
      if (res.success) {
        if (window.app && window.app.showToast) {
          window.app.showToast("Subscribed! You will receive Live Darshan notifications. 🙏");
        }
        if (pushBtn) pushBtn.textContent = 'Notification Alerts Active ✓';
      } else {
        alert("Notification permission was denied. Please allow notifications in your browser settings.");
      }
    } catch (e) {
      alert("Failed to subscribe to notifications: " + e.message);
    }
  };

  if (pushBtn) pushBtn.addEventListener('click', handleSubscribe);
  if (alertBtn) alertBtn.addEventListener('click', handleSubscribe);
}

/**
 * Tears down view listeners and stops live viewer heartbeats when leaving view.
 */
export function cleanupLiveDarshanView() {
  analyticsService.stopViewerHeartbeat('VIEW_NAVIGATED_AWAY');
}

/**
 * Renders ambient sanctum darshan canvas stream for devotee viewers
 */
function initViewerLiveFeed(video, selectedLocation) {
  if (!video) return;
  try {
    let canvas = document.getElementById('liveSanctumVideoCanvas');
    if (!canvas) return;
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = './assets/images/navaratri-invitation.jpg';

    let animId = null;
    let phase = 0;

    const render = () => {
      if (!document.getElementById('liveSanctumVideoPlayer')) {
        if (animId) cancelAnimationFrame(animId);
        return;
      }
      phase += 0.08;

      if (img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      } else {
        ctx.fillStyle = '#1C1917';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Golden Sanctum Vignette
      const vig = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 200, canvas.width / 2, canvas.height / 2, canvas.width / 1.3);
      vig.addColorStop(0, 'rgba(0,0,0,0.1)');
      vig.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = vig;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Sanctum Diya Flame Flicker
      const flicker = Math.sin(phase) * 5 + Math.cos(phase * 2.1) * 3;
      const diya = ctx.createRadialGradient(canvas.width / 2, canvas.height - 110, 10, canvas.width / 2, canvas.height - 110, 190 + flicker);
      diya.addColorStop(0, 'rgba(255, 200, 50, 0.4)');
      diya.addColorStop(0.5, 'rgba(217, 93, 15, 0.2)');
      diya.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = diya;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Top Banner
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(0, 0, canvas.width, 60);

      ctx.font = 'bold 22px Cinzel, Georgia, serif';
      ctx.fillStyle = '#FFFDF8';
      ctx.fillText('SRI DURGA PARAMESHWARI TEMPLE • SANCTUM LIVE DARSHAN', 30, 38);

      // Live Clock
      const now = new Date();
      const ist = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
      ctx.font = '600 20px "JetBrains Mono", monospace';
      ctx.fillStyle = '#F59E0B';
      ctx.textAlign = 'right';
      ctx.fillText('● ' + ist, canvas.width - 30, 38);
      ctx.textAlign = 'left';

      // Bottom Location & Mantra
      ctx.fillStyle = 'rgba(114, 28, 43, 0.88)';
      ctx.fillRect(0, canvas.height - 52, canvas.width, 52);

      ctx.font = 'bold 18px Cinzel, Georgia, serif';
      ctx.fillStyle = '#FAF7F2';
      const loc = (selectedLocation && selectedLocation.name) ? selectedLocation.name : 'Main Garbha Gudi';
      ctx.fillText(`📍 ${loc.toUpperCase()} — ॐ ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರ್ಯೈ ನಮಃ`, 30, canvas.height - 19);

      animId = requestAnimationFrame(render);
    };

    if (typeof canvas.captureStream === 'function') {
      const stream = canvas.captureStream(25);
      video.srcObject = stream;
      video.play().catch(() => {});
      render();
    }
  } catch (e) {
    console.warn('Live viewer feed init:', e);
  }
}
