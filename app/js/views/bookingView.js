/**
 * Booking View — 4-Step Devotee Booking & Seva Request
 * Matches Stitch Screen: booking-request.html
 */

import { templeStore } from '../services/store.js?v=20261007_07';
import { WhatsAppService } from '../services/whatsappService.js?v=20261007_07';
import { PanchangaService } from '../services/panchangaService.js?v=20261007_07';

export function renderBookingView(sevaId = 'durga-homa', selectedDateStr = '2026-10-24') {
  const seva = templeStore.getSevaById(sevaId) || templeStore.getSevas()[0];
  const dateObj = new Date(selectedDateStr + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const panchanga = PanchangaService.getPanchanga(dateObj);
  const timeSlot = (seva.timeSlots && seva.timeSlots.length > 0) ? seva.timeSlots[0] : "10:00 AM – 12:30 PM";

  const draftToken = WhatsAppService.generateToken(selectedDateStr);

  return `
    <div class="view-booking">
      <!-- Top Bar -->
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
        <button class="icon-btn" onclick="window.app.viewPooja('${seva.id}')" aria-label="Back">
          ‹
        </button>
        <div>
          <h2 style="font-family: var(--font-serif); font-size: 1.15rem; color: var(--color-primary); font-weight: 700; line-height: 1.2;">
            Seva Request & Sankalpa
          </h2>
          <p style="font-size: 0.75rem; color: var(--color-text-soft);">Step 3 of 4: Devotee & Family Particulars</p>
        </div>
      </div>

      <!-- 4-Step Progress Stepper -->
      <div class="stepper-container">
        <div class="stepper-track"></div>
        <div class="stepper-node">
          <div class="node-circle completed">✓</div>
          <span class="node-label">Seva</span>
        </div>
        <div class="stepper-node">
          <div class="node-circle completed">✓</div>
          <span class="node-label">Date</span>
        </div>
        <div class="stepper-node">
          <div class="node-circle active">3</div>
          <span class="node-label active">Sankalpa</span>
        </div>
        <div class="stepper-node">
          <div class="node-circle">4</div>
          <span class="node-label">Confirm</span>
        </div>
      </div>

      <!-- Pre-filled Seva & Date Summary Card -->
      <section class="card card-gold-accent" style="margin-bottom: 14px;">
        <div class="card-header-row">
          <span class="badge ${seva.isSpecial ? 'badge-saffron' : 'badge-gold'}">
            ${seva.name}
          </span>
          <span class="badge badge-maroon">Payable at Counter</span>
        </div>

        <div style="margin-top: 6px; font-size: 0.9rem;">
          <div>📅 <strong>${formattedDate}</strong></div>
          <div style="color: var(--color-text-soft); font-size: 0.8rem; margin-top: 2px;">
            ⏰ ${timeSlot} (${panchanga.tithi.name} • ${panchanga.nakshatra.name})
          </div>
          <div style="color: var(--color-text-soft); font-size: 0.8rem;">
            📍 ${seva.sanctumLocation}
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border-subtle); padding-top: 8px; margin-top: 10px;">
          <span style="font-size: 0.85rem; color: var(--color-text-soft);">Devotee Kanike:</span>
          <span class="num-tabular" style="font-size: 1.25rem; font-weight: 800; color: var(--color-primary);">
            ₹${seva.kanike.toLocaleString('en-IN')}
          </span>
        </div>
      </section>

      <!-- Step 3 Form: Devotee Sankalpa Details -->
      <section class="card" style="margin-bottom: 14px;">
        <h3 class="card-title" style="margin-bottom: 2px;">
          <span>✍️</span> Sankalpa Particulars
        </h3>
        <p class="card-subtitle">Sacred details recited by Archakas during Purnahuti</p>

        <form id="booking-form" onsubmit="event.preventDefault(); window.app.submitBooking();">
          <input type="hidden" id="form-seva-id" value="${seva.id}" />
          <input type="hidden" id="form-date" value="${selectedDateStr}" />
          <input type="hidden" id="form-slot" value="${timeSlot}" />
          <input type="hidden" id="form-token-id" value="${draftToken}" />

          <!-- Primary Devotee Full Name -->
          <div class="form-group">
            <label class="form-label" for="form-devotee-name">
              Primary Devotee Full Name <span class="required">*</span>
            </label>
            <input 
              type="text" 
              id="form-devotee-name" 
              class="form-control" 
              placeholder="e.g. Suresh Kumar" 
              value="Suresh Kumar"
              required 
            />
          </div>

          <!-- WhatsApp Mobile Number -->
          <div class="form-group">
            <label class="form-label" for="form-mobile">
              WhatsApp Mobile Number <span class="required">*</span>
            </label>
            <input 
              type="tel" 
              id="form-mobile" 
              class="form-control" 
              placeholder="e.g. +91 98450 12345" 
              value="+91 98450 12345"
              required 
            />
            <span class="form-helper">Official confirmation and token diary transmitted to this number</span>
          </div>

          <!-- Gothra -->
          <div class="form-group">
            <label class="form-label" for="form-gothra">
              Gothra (Family Lineage)
            </label>
            <input 
              type="text" 
              id="form-gothra" 
              class="form-control" 
              placeholder="e.g. Kashyapa / Vishwamitra" 
              value="Kashyapa"
            />
            <span class="form-helper">Leave blank if Gothra is Shiva / not known</span>
          </div>

          <!-- Rashi & Nakshatra -->
          <div class="form-group">
            <label class="form-label" for="form-rashi-nakshatra">
              Rashi & Janma Nakshatra
            </label>
            <input 
              type="text" 
              id="form-rashi-nakshatra" 
              class="form-control" 
              placeholder="e.g. Vrishabha (Taurus) • Rohini" 
              value="Vrishabha (Taurus) • Rohini"
            />
          </div>

          <!-- Sankalpa Purpose Toggle Chips -->
          <div class="form-group">
            <label class="form-label">
              Sankalpa Purpose / Occasion
            </label>
            <div class="chips-row" id="sankalpa-chips">
              <span class="chip active" data-val="Ayushya & Good Health" onclick="this.classList.toggle('active')">
                ✓ Ayushya & Health
              </span>
              <span class="chip" data-val="Birthday / Janmadina" onclick="this.classList.toggle('active')">
                Birthday / Janmadina
              </span>
              <span class="chip" data-val="Vivaha / Anniversary" onclick="this.classList.toggle('active')">
                Vivaha / Anniversary
              </span>
              <span class="chip" data-val="Relief from Obstacles / Karya Siddhi" onclick="this.classList.toggle('active')">
                Karya Siddhi
              </span>
            </div>
          </div>

          <!-- Additional Family Members -->
          <div class="form-group">
            <label class="form-label" for="form-family-members">
              Additional Family Members for Sankalpa (Optional)
            </label>
            <textarea 
              id="form-family-members" 
              class="form-control" 
              placeholder="List spouse, children names and nakshatras for priest recitation..."
            >Radhika Suresh (Mrigashira), Aditya (Krittika)</textarea>
          </div>

          <!-- Physical Yagashala Guidelines & Agreement Checkbox -->
          <div style="padding: 12px; background: #FFF9F4; border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: 12px;">
            <div style="font-weight: 700; font-size: 0.85rem; color: var(--color-primary); margin-bottom: 6px;">
              🪔 Physical Yagashala Guidelines:
            </div>
            <ul style="font-size: 0.78rem; color: var(--color-text-main); margin-left: 16px; margin-bottom: 10px; display: flex; flex-direction: column; gap: 3px;">
              <li><strong>Temple Provides:</strong> Complete Homa Samagri, Sacred Wood, Purohit Veda Chanting.</li>
              <li><strong>Devotee Brings:</strong> 5 Fresh Dry Coconuts, 2 Flower Garlands, 5 varieties of fresh fruits.</li>
            </ul>

            <label style="display: flex; align-items: flex-start; gap: 8px; font-size: 0.82rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" id="agreement-checkbox" checked style="width: 18px; height: 18px; margin-top: 2px; accent-color: var(--color-primary);" required />
              <span>I understand the guidelines and our family will arrive 15 minutes before ${timeSlot.split(' ')[0]} at the Yagashala desk.</span>
            </label>
          </div>

          <!-- Draft Token Display -->
          <div style="padding: 10px 14px; background: var(--color-canvas); border-radius: var(--radius-md); border: 1px dashed var(--color-border-gold); margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <span style="font-size: 0.72rem; color: var(--color-text-soft); font-weight: 700; text-transform: uppercase;">Draft Booking Token:</span>
              <div class="num-tabular" style="font-weight: 800; color: var(--color-primary); font-size: 0.95rem;">${draftToken}</div>
            </div>
            <span class="badge badge-gold" style="font-size: 0.7rem;">Temple Direct Desk</span>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-whatsapp" style="font-size: 1rem;">
            Send Request via WhatsApp 🙏
          </button>
        </form>
      </section>

      <!-- Information Callout -->
      <div style="font-size: 0.78rem; color: var(--color-text-soft); text-align: center; padding: 0 10px;">
        No online payment required. Official receipt issued at Temple Counter upon arrival.
      </div>
    </div>
  `;
}
