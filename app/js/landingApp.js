/**
 * Sri Durga Devi Temple — Grand Devotional Landing Page Controller
 * Powers live Bengaluru Panchanga, audio chant player, seva category filters, and WhatsApp booking triggers
 */

import { SEVAS_DATA } from './data/sevas.js?v=20261007_11';
import { PanchangaService } from './services/panchangaService.js?v=20261007_11';
import { TEMPLE_TIMINGS } from './data/timings.js?v=20261007_11';
import { WhatsAppService } from './services/whatsappService.js?v=20261007_11';
import { templeStore } from './services/store.js?v=20261007_11';
import { streamingService } from './services/streamingService.js?v=20261010_16';
import { analyticsService } from './services/analyticsService.js';
import { pushNotificationService } from './services/pushNotificationService.js';

class TempleLandingController {
  constructor() {
    this.currentCategory = 'all';
    this.audioElement = null;
    this.isPlayingAudio = false;
    this.selectedLiveLocationId = null;
    this._initLiveStreamSubscription();
  }

  _initLiveStreamSubscription() {
    streamingService.subscribe((msg) => {
      if (['STREAM_STARTED', 'STREAM_ENDED', 'LOCATION_UPDATED'].includes(msg.type)) {
        this._renderLiveStreamingSection(this.selectedLiveLocationId);
      }
    });
  }

  init() {
    this._initAudioPlayer();
    this._renderLiveStreamingSection();
    this._renderLivePanchangaStrip();
    this._renderSevasGrid();
    this._renderGalleryGrid();
    this._updateContactLinks();

    // Rapid initial server sync to pick up active broadcasts
    streamingService.syncLiveStateFromServer().then(() => {
      this._renderLiveStreamingSection(this.selectedLiveLocationId);
    }).catch(() => {});
  }

  // Audio Chant Player
  _initAudioPlayer() {
    this.audioElement = new Audio('assets/audio/Om-Slogan-Final.mp3');
    this.audioElement.loop = true;
    this.audioElement.volume = 0.65;

    const toggleBtn = document.getElementById('btn-play-chant');
    const statusText = document.getElementById('chant-status-text');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        if (this.isPlayingAudio) {
          this.audioElement.pause();
          this.isPlayingAudio = false;
          toggleBtn.innerHTML = '▶';
          if (statusText) statusText.textContent = 'Tap to play sacred chant';
        } else {
          this.audioElement.play().then(() => {
            this.isPlayingAudio = true;
            toggleBtn.innerHTML = '❚❚';
            if (statusText) statusText.textContent = 'Playing Om Sri Durgayai Namaha 🪔';
          }).catch(e => {
            console.log('Audio autoplay prevented:', e);
          });
        }
      });
    }
  }

  // Unified Live Streaming Section
  _renderLiveStreamingSection(preferredLocId = null) {
    const container = document.getElementById('landing-live-container');
    if (!container) return;

    if (preferredLocId) {
      this.selectedLiveLocationId = preferredLocId;
    }

    const state = streamingService.getPublicLiveDarshanState(this.selectedLiveLocationId);
    const isLive = state.isLive;
    const session = state.session;
    const selectedLocation = state.selectedLocation;
    const locations = state.availableLocations;

    // Concurrency heartbeat
    if (isLive && session) {
      analyticsService.startViewerHeartbeat(session.id, session.locationId, session.locationName);
    } else {
      analyticsService.stopViewerHeartbeat('STREAM_OFFLINE');
    }

    container.innerHTML = `
      <!-- Location Switcher Pills -->
      <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-bottom: 20px;">
        ${locations.map(loc => {
          const isSelected = selectedLocation && selectedLocation.id === loc.id;
          return `
            <button 
              class="landing-location-btn ${isSelected ? 'active' : ''}" 
              data-loc-id="${loc.id}"
              style="
                display: inline-flex;
                align-items: center;
                gap: 6px;
                background: ${isSelected ? 'var(--color-primary)' : '#FFFDF8'};
                color: ${isSelected ? '#FFFDF8' : 'var(--color-text-main)'};
                border: 1px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'};
                border-radius: 20px;
                padding: 7px 16px;
                font-size: 0.85rem;
                font-weight: 600;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.04);
                transition: all 0.2s ease;
              "
            >
              ${loc.isCurrentlyLive ? `
                <span style="width: 7px; height: 7px; background: #E53935; border-radius: 50%; display: inline-block;"></span>
              ` : ''}
              <span>${loc.name}</span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Live Player Card -->
      <div class="card" style="padding: 0; overflow: hidden; border: 1.5px solid var(--color-border); box-shadow: 0 10px 30px rgba(0,0,0,0.08); background: #000; border-radius: 16px;">
        <div style="position: relative; width: 100%; aspect-ratio: 16/9; background: #1C1917; display: flex; align-items: center; justify-content: center;">
          ${isLive ? `
            <video 
              id="landingLiveVideo" 
              autoplay 
              playsinline 
              muted 
              style="width: 100%; height: 100%; object-fit: cover; background: #000;"
              poster="./assets/images/navaratri-invitation.jpg"
            ></video>

            <div style="position: absolute; top: 14px; left: 14px; display: flex; align-items: center; gap: 8px; z-index: 5;">
              <span style="background: rgba(229, 57, 53, 0.95); color: #FFF; font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.5px;">
                ● LIVE
              </span>
              <span id="landingViewerCountBadge" style="background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); color: #FFF; font-size: 0.75rem; padding: 4px 10px; border-radius: 4px;">
                👁️ ${session ? Math.max(1, session.viewerCount) : 1} Devotees Watching Live
              </span>
            </div>

            <div style="position: absolute; bottom: 14px; right: 14px; display: flex; gap: 8px; z-index: 5;">
              <button id="landingBtnMute" style="background: rgba(0,0,0,0.65); color: #FFF; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px;">
                🔊
              </button>
              <button id="landingBtnFullscreen" style="background: rgba(0,0,0,0.65); color: #FFF; border: none; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 14px;">
                ⛶
              </button>
            </div>
          ` : `
            <div style="position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; padding: 30px; background: linear-gradient(180deg, #2A1719 0%, #150A0B 100%);">
              <div style="font-size: 3rem; margin-bottom: 10px; filter: drop-shadow(0 2px 10px rgba(197, 155, 39, 0.5));">
                🪔
              </div>
              <h3 style="font-family: var(--font-serif); color: #FAF7F2; font-size: 1.4rem; margin-bottom: 6px;">
                ${selectedLocation ? selectedLocation.name : 'Sanctum'} Broadcast Offline
              </h3>
              <p style="color: #EADFCD; font-size: 0.95rem; max-width: 480px; margin: 0 auto 16px; line-height: 1.4; opacity: 0.9;">
                The sanctum is currently open for in-person devotees in Chandra Layout, Bengaluru. Next scheduled live broadcast starts during temple aarti.
              </p>
              <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: center;">
                <a href="app.html#live" class="btn btn-primary btn-sm" style="text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                  <span>📱</span> Open in Devotee App
                </a>
              </div>
            </div>
          `}
        </div>

        <div style="padding: 16px 20px; background: #FFFDF8; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <h4 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); margin: 0 0 2px;">
              ${selectedLocation ? selectedLocation.name : 'Sri Durga Devi Garbha Gudi'}
            </h4>
            <p style="font-size: 0.85rem; color: var(--color-text-muted); margin: 0;">
              ${selectedLocation && selectedLocation.description ? selectedLocation.description : 'Main sanctum of Goddess Durga Parameshwari.'}
            </p>
          </div>
          <div style="display: flex; gap: 10px; align-items: center;">
            <a href="app.html#live" class="btn btn-secondary btn-sm" style="text-decoration: none;">
              Open Full Devotee Experience 🪔
            </a>
          </div>
        </div>
      </div>
    `;

    // Attach pill events
    container.querySelectorAll('.landing-location-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-loc-id');
        this.selectedLiveLocationId = targetId;
        this._renderLiveStreamingSection(targetId);
      });
    });

    if (isLive && session) {
      // Start viewer telemetry heartbeat for landing page
      analyticsService.startViewerHeartbeat(
        session.id,
        session.locationId,
        session.locationName
      );

      // Listen for dynamic viewer count changes
      if (!this._landingCountListenerAttached) {
        this._landingCountListenerAttached = true;
        streamingService.subscribe((msg) => {
          if (msg.type === 'VIEWER_COUNT_UPDATED' && msg.payload) {
            const badge = document.getElementById('landingViewerCountBadge');
            if (badge) {
              badge.textContent = `👁️ ${Math.max(1, msg.payload.count)} Devotees Watching Live`;
            }
          }
        });
      }

      const video = document.getElementById('landingLiveVideo');
      const muteBtn = document.getElementById('landingBtnMute');
      const fsBtn = document.getElementById('landingBtnFullscreen');

      if (muteBtn && video) {
        muteBtn.addEventListener('click', () => {
          video.muted = !video.muted;
          muteBtn.textContent = video.muted ? '🔇' : '🔊';
        });
      }

      if (fsBtn && video) {
        fsBtn.addEventListener('click', () => {
          if (video.requestFullscreen) video.requestFullscreen();
          else if (video.webkitRequestFullscreen) video.webkitRequestFullscreen();
        });
      }

      const publisherStream = streamingService.getActivePublisherStream();
      if (publisherStream && video) {
        video.srcObject = publisherStream;
        video.play().catch(() => {});
      } else if (video) {
        this._initViewerLiveFeed(video, selectedLocation);
      }
    } else {
      analyticsService.stopViewerHeartbeat('BROADCAST_OFFLINE');
    }
  }

  // Devotee viewer live feed (ambient sanctum darshan stream with live camera frame and live IST timecode)
  _initViewerLiveFeed(video, selectedLocation) {
    if (!video) return;
    if (this._viewerFeedCleanup) {
      this._viewerFeedCleanup();
      this._viewerFeedCleanup = null;
    }

    try {
      let canvas = document.getElementById('landingLiveFeedCanvas');
      if (!canvas) {
        canvas = document.createElement('canvas');
        canvas.id = 'landingLiveFeedCanvas';
        canvas.width = 1280;
        canvas.height = 720;
        canvas.style.display = 'none';
        document.body.appendChild(canvas);
      }
      const ctx = canvas.getContext('2d');
      const fallbackImg = new Image();
      fallbackImg.crossOrigin = 'anonymous';
      fallbackImg.src = './assets/images/navaratri-invitation.jpg';

      const cameraImg = new Image();
      cameraImg.crossOrigin = 'anonymous';
      let hasCameraFrame = false;
      let lastCameraFrameTime = 0;
      let isFetchingRemoteFrame = false;

      // Check if frame is already cached in memory
      const initialFrame = streamingService.getLatestBroadcastFrame();
      if (initialFrame) {
        cameraImg.src = initialFrame;
        hasCameraFrame = true;
        lastCameraFrameTime = Date.now();
      }

      // 1. Listen for local broadcast channel frame sync (cross-tab on same machine)
      const unsub = streamingService.subscribe((msg) => {
        if (msg.type === 'LIVE_CAMERA_FRAME' && msg.payload) {
          if (msg.payload.frame) {
            cameraImg.src = msg.payload.frame;
            hasCameraFrame = true;
            lastCameraFrameTime = Date.now();
          } else {
            hasCameraFrame = false;
          }
        }
      });

      // 2. Poll server frame relay for remote devices (mobile / different browsers)
      const pollRemoteFrame = async () => {
        if (Date.now() - lastCameraFrameTime < 800) return; // Skip if local BroadcastChannel active
        if (isFetchingRemoteFrame) return;
        isFetchingRemoteFrame = true;
        try {
          const url = streamingService.getApiUrl('api/live-frame.php?json=1');
          const res = await fetch(url, { cache: 'no-store' });
          if (res.ok) {
            const data = await res.json();
            if (data && data.success && data.frame) {
              cameraImg.src = data.frame;
              hasCameraFrame = true;
              lastCameraFrameTime = Date.now();
            }
          }
        } catch (_) {
        } finally {
          isFetchingRemoteFrame = false;
        }
      };

      const pollInterval = setInterval(pollRemoteFrame, 350);
      pollRemoteFrame();

      let animId = null;
      let phase = 0;

      const render = () => {
        if (!document.getElementById('landingLiveVideo')) {
          if (animId) cancelAnimationFrame(animId);
          clearInterval(pollInterval);
          if (unsub) unsub();
          return;
        }
        phase += 0.08;

        // 1. Draw video background: broadcaster webcam frame if active, else sanctum poster
        if (hasCameraFrame && cameraImg.complete && cameraImg.naturalWidth > 0) {
          const hRatio = canvas.width / cameraImg.naturalWidth;
          const vRatio = canvas.height / cameraImg.naturalHeight;
          const ratio = Math.max(hRatio, vRatio);
          const centerShiftX = (canvas.width - cameraImg.naturalWidth * ratio) / 2;
          const centerShiftY = (canvas.height - cameraImg.naturalHeight * ratio) / 2;
          ctx.drawImage(
            cameraImg,
            0, 0, cameraImg.naturalWidth, cameraImg.naturalHeight,
            centerShiftX, centerShiftY, cameraImg.naturalWidth * ratio, cameraImg.naturalHeight * ratio
          );
        } else if (fallbackImg.complete && fallbackImg.naturalWidth > 0) {
          ctx.drawImage(fallbackImg, 0, 0, canvas.width, canvas.height);
        } else {
          ctx.fillStyle = '#1C1917';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // 2. Golden Sanctum Vignette
        const vig = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 200, canvas.width / 2, canvas.height / 2, canvas.width / 1.3);
        vig.addColorStop(0, 'rgba(0,0,0,0.05)');
        vig.addColorStop(1, 'rgba(0,0,0,0.65)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 3. Sanctum Diya Flame Flicker
        const flicker = Math.sin(phase) * 5 + Math.cos(phase * 2.1) * 3;
        const diya = ctx.createRadialGradient(canvas.width / 2, canvas.height - 110, 10, canvas.width / 2, canvas.height - 110, 190 + flicker);
        diya.addColorStop(0, 'rgba(255, 200, 50, 0.4)');
        diya.addColorStop(0.5, 'rgba(217, 93, 15, 0.2)');
        diya.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = diya;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 4. Top Banner
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, canvas.width, 60);

        ctx.font = 'bold 22px Cinzel, Georgia, serif';
        ctx.fillStyle = '#FFFDF8';
        ctx.fillText('SRI DURGA PARAMESHWARI TEMPLE • SANCTUM LIVE DARSHAN', 30, 38);

        // 5. Live Clock
        const now = new Date();
        const ist = now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }) + ' IST';
        ctx.font = '600 20px "JetBrains Mono", monospace';
        ctx.fillStyle = '#F59E0B';
        ctx.textAlign = 'right';
        ctx.fillText('● ' + ist, canvas.width - 30, 38);
        ctx.textAlign = 'left';

        // 6. Bottom Location & Mantra
        ctx.fillStyle = 'rgba(114, 28, 43, 0.9)';
        ctx.fillRect(0, canvas.height - 52, canvas.width, 52);

        ctx.font = 'bold 18px Cinzel, Georgia, serif';
        ctx.fillStyle = '#FAF7F2';
        const loc = (selectedLocation && selectedLocation.name) ? selectedLocation.name : 'Main Garbha Gudi';
        ctx.fillText(`📍 ${loc.toUpperCase()} — ॐ ಶ್ರೀ ದುರ್ಗಾಪರಮೇಶ್ವರ್ಯೈ ನಮಃ`, 30, canvas.height - 19);

        animId = requestAnimationFrame(render);
      };

      this._viewerFeedCleanup = () => {
        if (animId) cancelAnimationFrame(animId);
        clearInterval(pollInterval);
        if (unsub) unsub();
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

  // Live Panchanga Strip computed dynamically
  _renderLivePanchangaStrip() {
    const stripEl = document.getElementById('panchanga-strip-container');
    if (!stripEl) return;
    const p = PanchangaService.getPanchanga(new Date());
    const festivalBanner = p.hasFestival ? `
      <div style="grid-column: 1 / -1; background: rgba(234, 88, 12, 0.25); border: 1.5px solid #F97316; border-radius: var(--radius-lg); padding: 12px 18px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.4rem;">🎉</span>
          <div>
            <div style="font-weight: 800; font-size: 1.05rem; color: #FFFDF8;">${p.primaryFestival.name} (${p.primaryFestival.kannada})</div>
            <div style="font-size: 0.8rem; color: #FED7AA;">${p.primaryFestival.description}</div>
          </div>
        </div>
        <span class="badge" style="background: #EA580C; color: #FFF; font-weight: 800; font-size: 0.75rem;">${p.masa} Masa • ${p.paksha}</span>
      </div>
    ` : (p.upcomingFestivals && p.upcomingFestivals.length > 0 ? `
      <div style="grid-column: 1 / -1; background: rgba(255, 253, 248, 0.08); border: 1px solid rgba(197, 155, 39, 0.4); border-radius: var(--radius-lg); padding: 10px 18px; margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 1.2rem;">🗓️</span>
          <div>
            <div style="font-weight: 700; font-size: 0.95rem; color: #FFFDF8;">Upcoming Festival: ${p.upcomingFestivals[0].name} (${p.upcomingFestivals[0].kannada})</div>
            <div style="font-size: 0.78rem; color: #E7E5E4;">${p.upcomingFestivals[0].formattedDate} • ${p.upcomingFestivals[0].description}</div>
          </div>
        </div>
        <span class="badge badge-gold" style="font-size: 0.75rem; font-weight: 800;">${p.upcomingFestivals[0].relativeLabel}</span>
      </div>
    ` : '');

    stripEl.innerHTML = `
      ${festivalBanner}
      <div class="panchanga-strip-card">
        <div class="label">Tithi Today</div>
        <div class="val">${p.tithi.name}</div>
        <div class="sub">${p.tithi.isShukla ? 'Shukla' : 'Krishna'} • Karana: ${p.karanaDetails ? p.karanaDetails.current : 'Bava'}</div>
      </div>

      <div class="panchanga-strip-card">
        <div class="label">Nakshatra & Moon</div>
        <div class="val">${p.nakshatra.name}</div>
        <div class="sub">${p.rashi} • Till ${p.nakshatra.endTime}</div>
      </div>

      <div class="panchanga-strip-card">
        <div class="label">Ritu & Ayana</div>
        <div class="val">${p.ritu}</div>
        <div class="sub">${p.samvatsara} • ${p.ayana}</div>
      </div>

      <div class="panchanga-strip-card" style="border-color: #FCD5BD;">
        <div class="label" style="color: #FED7AA;">Rahu Kala (Bengaluru)</div>
        <div class="val num-tabular" style="color: #FFEDD5;">${p.rahuKala}</div>
        <div class="sub">${p.isTuesdaySpecialRahu ? '🔥 Special 3:30 PM Deepada Seva' : 'Inauspicious for secular starts'}</div>
      </div>

      <div class="panchanga-strip-card" style="border-color: #B7E4C7;">
        <div class="label" style="color: #BBF7D0;">Abhijit Muhurtha</div>
        <div class="val num-tabular" style="color: #DCFCE7;">${p.abhijitMuhurtha}</div>
        <div class="sub">Solar Noon apex window</div>
      </div>

      <div class="panchanga-strip-card">
        <div class="label">Solar Horizon</div>
        <div class="val num-tabular">🌅 ${p.sunrise}</div>
        <div class="sub">🌇 Sunset: ${p.sunset} (${p.daylightDuration})</div>
      </div>
    `;
  }

  // Render Sevas Grid
  _renderSevasGrid() {
    const gridEl = document.getElementById('landing-sevas-grid');
    if (!gridEl) return;

    const filtered = this.currentCategory === 'all'
      ? SEVAS_DATA
      : SEVAS_DATA.filter(s => s.category === this.currentCategory);

    gridEl.innerHTML = filtered.map(s => `
      <div class="seva-card-landing">
        <div>
          <div class="seva-card-landing-header">
            <div>
              <h3 class="seva-title-h3">${s.name}</h3>
              <div class="seva-kannada">${s.kannadaName}</div>
            </div>
            <div class="seva-price-tag num-tabular">₹${s.kanike}</div>
          </div>
          <p class="seva-desc-p">${s.description}</p>
          <div class="seva-meta-tags">
            <span class="seva-meta-tag">⏱️ ${s.durationMins} mins</span>
            <span class="seva-meta-tag">🪔 ${s.category.toUpperCase()}</span>
            ${s.allowedDays ? `<span class="seva-meta-tag" style="color: var(--color-warning);">📅 ${s.allowedDays.map(d => ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d]).join(', ')} only</span>` : '<span class="seva-meta-tag" style="color: var(--color-success);">📅 Daily</span>'}
          </div>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 14px;">
          <a href="app.html#booking" onclick="sessionStorage.setItem('sdd_preselect_seva', '${s.id}')" class="btn btn-primary btn-sm" style="flex: 1; text-align: center; text-decoration: none;">
            Book Online 🪔
          </a>
          <button onclick="window.landing.bookSevaWhatsApp('${s.id}')" class="btn btn-whatsapp btn-sm" style="display: flex; align-items: center; justify-content: center; gap: 4px;" title="Book via WhatsApp">
            💬 WhatsApp
          </button>
        </div>
      </div>
    `).join('');
  }

  filterCategory(cat) {
    this.currentCategory = cat;
    document.querySelectorAll('.filter-pill-btn').forEach(btn => {
      if (btn.getAttribute('data-cat') === cat) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this._renderSevasGrid();
  }

  // Dynamic Temple Gallery
  _renderGalleryGrid() {
    const galleryEl = document.getElementById('landing-gallery-grid');
    if (!galleryEl) return;
    const items = templeStore.getGallery();
    if (!items || items.length === 0) return;

    galleryEl.innerHTML = items.map(item => `
      <div class="gallery-item">
        <img src="${item.url}" alt="${item.title}" loading="lazy" onerror="this.src='icons/icon.svg'">
        <div class="gallery-caption">
          <strong>${item.title}</strong>
          ${item.kannadaTitle ? ` • <span>${item.kannadaTitle}</span>` : ''}
          ${item.caption ? `<div style="font-size: 0.75rem; opacity: 0.9; margin-top: 2px;">${item.caption}</div>` : ''}
        </div>
      </div>
    `).join('');
  }

  // Synchronize Contact and WhatsApp Links with CMS Store
  _updateContactLinks() {
    const config = templeStore.getContactConfig();
    if (!config) return;

    const waPhone = config.whatsappPhone || '919845012345';
    const waDisplay = config.whatsappDisplay || '+91 98450 12345';
    const officePhone = config.officePhone || '080-23394447';
    const address = config.address || 'Sri Durga Parameshwari Temple, Chandra Layout 1st Phase, Bengaluru, Karnataka - 560 072';

    const waLinkEl = document.getElementById('landing-wa-phone-link');
    if (waLinkEl) {
      waLinkEl.href = `https://wa.me/${waPhone}`;
      waLinkEl.textContent = waDisplay;
    }

    const officeLinkEl = document.getElementById('landing-office-phone-link');
    if (officeLinkEl) {
      officeLinkEl.href = `tel:${officePhone.replace(/\D/g, '')}`;
      officeLinkEl.textContent = officePhone;
    }

    const addrEl = document.getElementById('landing-address-text');
    if (addrEl) {
      addrEl.textContent = address;
    }

    // Update all general wa.me buttons across the page
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
      try {
        const url = new URL(link.href);
        const textParam = url.searchParams.get('text') || '';
        link.href = `https://wa.me/${waPhone}${textParam ? `?text=${encodeURIComponent(textParam)}` : ''}`;
      } catch (e) {
        // Fallback simple replace
        link.href = link.href.replace(/wa\.me\/\d+/, `wa.me/${waPhone}`);
      }
    });
  }

  bookSevaWhatsApp(sevaId) {
    const seva = SEVAS_DATA.find(s => s.id === sevaId) || SEVAS_DATA[0];
    const phone = WhatsAppService.getWhatsAppPhone();
    const text = `Namaskara Sri Durga Parameshwari Temple 🙏\nI would like to enquire and request availability for:\n• Seva: ${seva.name} (${seva.kannadaName})\n• Contribution: ₹${seva.kanike}\n• Temple: Chandra Layout, Bengaluru\n\nPlease let me know available dates and sankalpa guidelines.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
  }
}

// Global instance
const initLanding = () => {
  if (!window.landing) {
    window.landing = new TempleLandingController();
  }
  window.landing.init();
};

window.landing = new TempleLandingController();
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLanding);
} else {
  initLanding();
}
