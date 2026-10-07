/**
 * Sri Durga Devi Temple — Date Availability & Recommendation Engine
 * Hierarchy: Admin Block > Temple Event > Seva Rule > Capacity > Available
 */

import { templeStore } from './store.js?v=20261007_07';
import { PanchangaService } from './panchangaService.js?v=20261007_07';

export class AvailabilityEngine {
  /**
   * Evaluates availability for a specific date and seva
   * @param {string} dateStr "YYYY-MM-DD"
   * @param {string} sevaId 
   */
  static checkAvailability(dateStr, sevaId) {
    const [tY, tM, tD] = dateStr.split('-').map(Number);
    const targetDate = new Date(tY, tM - 1, tD);
    const dayOfWeek = targetDate.getDay();
    const seva = templeStore.getSevaById(sevaId);

    // Rule 1: Administrative Date Block (Absolute Highest Priority)
    const blockedRules = templeStore.getBlockedDates();
    const activeBlock = blockedRules.find(b => b.date === dateStr);

    if (activeBlock) {
      const alternatives = this.getAlternatives(dateStr, seva, 3, activeBlock.suggestedAlternatives);
      return {
        isAvailable: false,
        status: 'BLOCKED',
        badgeText: 'Sanctum Reserved',
        reasonTitle: activeBlock.reasonTitle,
        publicNotice: activeBlock.publicNotice,
        recommendedAlternatives: alternatives
      };
    }

    // Rule 2: Seva Day / Sampradaya Constraint
    if (seva && seva.allowedDays && seva.allowedDays.length > 0) {
      if (!seva.allowedDays.includes(dayOfWeek)) {
        const allowedDayNames = seva.allowedDays.map(d => {
          const names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          return names[d];
        }).join(" or ");

        const alternatives = this.getAlternatives(dateStr, seva, 3);
        return {
          isAvailable: false,
          status: 'DAY_MISMATCH',
          badgeText: 'Restricted Seva Day',
          reasonTitle: `Specific Day Ritual`,
          publicNotice: `${seva.name} is conducted strictly on ${allowedDayNames} according to temple sampradaya.`,
          recommendedAlternatives: alternatives
        };
      }
    }

    // Rule 3: Valid and Available
    const panchanga = PanchangaService.getPanchanga(targetDate);
    const timeSlot = (seva && seva.timeSlots && seva.timeSlots.length > 0) 
      ? seva.timeSlots[0] 
      : "Morning Darshan Hours";

    return {
      isAvailable: true,
      status: 'AVAILABLE',
      badgeText: 'Auspicious & Open',
      publicNotice: `Auspicious window for ${seva ? seva.name : 'Seva'}. Devotees may proceed to sankalpa request.`,
      muhurthaSlot: timeSlot,
      tithi: panchanga.tithi.name,
      nakshatra: panchanga.nakshatra.name,
      recommendedAlternatives: []
    };
  }

  /**
   * Search heuristic for finding top alternative dates
   */
  static getAlternatives(baseDateStr, seva, maxResults = 3, explicitDates = null) {
    const blockedDates = new Set(templeStore.getBlockedDates().map(b => b.date));
    const results = [];

    // If admin explicitly specified alternatives, honor them first
    if (explicitDates && explicitDates.length > 0) {
      for (const altStr of explicitDates) {
        if (!blockedDates.has(altStr)) {
          const d = new Date(altStr + "T00:00:00");
          if (!seva || !seva.allowedDays || seva.allowedDays.includes(d.getDay())) {
            const p = PanchangaService.getPanchanga(d);
            results.push({
              date: altStr,
              formattedDate: d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
              fullFormatted: d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
              tithi: p.tithi.name,
              nakshatra: p.nakshatra.name,
              reason: 'Admin Recommended Auspicious Alternate'
            });
            if (results.length >= maxResults) return results;
          }
        }
      }
    }

    // Heuristic forward search (1 to 30 days)
    const [bY, bM, bD] = baseDateStr.split('-').map(Number);
    const baseDate = new Date(bY, bM - 1, bD);

    for (let i = 1; i <= 30; i++) {
      const candidate = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + i);
      const candY = candidate.getFullYear();
      const candM = String(candidate.getMonth() + 1).padStart(2, '0');
      const candD = String(candidate.getDate()).padStart(2, '0');
      const candStr = `${candY}-${candM}-${candD}`;

      if (blockedDates.has(candStr)) continue;

      // Check seva constraint
      if (seva && seva.allowedDays && seva.allowedDays.length > 0) {
        if (!seva.allowedDays.includes(candidate.getDay())) continue;
      }

      const p = PanchangaService.getPanchanga(candidate);
      let score = 50;
      if (p.tithi.isShukla) score += 25;
      if (candidate.getDay() === 5) score += 30; // Friday
      if (candidate.getDay() === 2) score += 20; // Tuesday
      score -= i; // Proximity preference

      results.push({
        date: candStr,
        formattedDate: candidate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
        fullFormatted: candidate.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
        tithi: p.tithi.name,
        nakshatra: p.nakshatra.name,
        reason: candidate.getDay() === 5 ? 'Auspicious Friday for Durga Devi' : 'Auspicious Muhurtha',
        score
      });

      if (results.length >= maxResults) break;
    }

    return results;
  }
}
