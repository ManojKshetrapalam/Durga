/**
 * Sri Durga Devi Temple — WhatsApp Deep-Link & Token Generator
 * Dynamically calibrated with Temple Store CMS configuration.
 * Chandra Layout Temple Desk: Configurable via CMS (Default: +91 98450 12345 / 080-23394447)
 */

import { templeStore } from './store.js';

export class WhatsAppService {
  /**
   * Retrieves active WhatsApp contact number from Temple Store CMS configuration
   */
  static getWhatsAppPhone() {
    try {
      const cfg = templeStore.getContactConfig();
      const raw = cfg ? (cfg.whatsappPhone || cfg.whatsappNumber) : null;
      if (raw) {
        // Strip spaces, dashes, plus signs for clean WhatsApp URI
        const clean = raw.replace(/[^0-9]/g, '');
        if (clean.length >= 10) return clean;
      }
    } catch (e) {
      // Fallback
    }
    return "919845012345";
  }

  /**
   * Generates a unique devotee booking token
   * Format: SDD-YYYY-MMDD-XXX
   * @param {string} dateStr "YYYY-MM-DD"
   */
  static generateToken(dateStr) {
    const parts = (dateStr || new Date().toISOString().split('T')[0]).split('-');
    const year = parts[0] || "2026";
    const mmdd = `${parts[1] || "10"}${parts[2] || "01"}`;
    const seq = Math.floor(100 + Math.random() * 900); // 3-digit randomized counter
    return `SDD-${year}-${mmdd}-${seq}`;
  }

  /**
   * Builds pre-formatted booking dispatch message and deep-link
   */
  static createBookingLink(booking) {
    const phone = this.getWhatsAppPhone();
    const lines = [
      "Namaskara Sri Durga Devi Temple 🙏",
      "",
      "I wish to request a Seva booking:",
      `🪔 Seva: ${booking.sevaName} (₹${booking.contribution})`,
      `📅 Date: ${booking.date}`,
      `⏰ Time: ${booking.timeSlot || 'Morning Darshan'}`,
      `👤 Devotee: ${booking.devoteeName}`,
      `📱 Mobile: ${booking.mobile}`,
      `🌿 Gothra: ${booking.gothra || 'Shiva / Not Known'}`,
      `⭐ Rashi / Nakshatra: ${booking.rashi || 'Not Specified'} • ${booking.nakshatra || ''}`,
      `🎯 Sankalpa: ${Array.isArray(booking.sankalpa) ? booking.sankalpa.join(', ') : (booking.sankalpa || 'General Devotional')}`,
      booking.additionalNames ? `👨‍👩‍👧 Family: ${booking.additionalNames}` : null,
      "",
      `🎟️ Token ID: ${booking.tokenId}`,
      "",
      "I have noted the items to bring and will arrive 15 minutes before the seva.",
      "Contribution will be offered at the Temple Counter. Please confirm Archaka assignment."
    ].filter(Boolean);

    const messageText = lines.join("\n");
    return {
      messageText,
      url: `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`
    };
  }

  /**
   * Builds general query URL for a blocked date or alternative date inquiry
   */
  static createAlternativeInquiryLink(requestedDate, blockReason, sevaName) {
    const phone = this.getWhatsAppPhone();
    const text = [
      "Namaskara Sri Durga Devi Temple 🙏",
      "",
      `I noticed that ${requestedDate} is reserved for "${blockReason}".`,
      `Could you kindly advise if an alternative date is available for performing ${sevaName}?`,
      "",
      "Please guide regarding Archaka schedule."
    ].join("\n");

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  /**
   * Builds on-premises counter query URL
   */
  static createCounterInquiryLink(spotName = "Temple Entrance") {
    const phone = this.getWhatsAppPhone();
    const text = [
      "Namaskara Sri Durga Devi Temple 🙏",
      "",
      `I am currently at the temple (${spotName}).`,
      "I would like guidance regarding offering Seva / Archana today at the counter.",
      "Please advise if Archakas are available for Sankalpa."
    ].join("\n");

    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }

  /**
   * Builds general direct temple WhatsApp chat link
   */
  static createDirectChatLink(customText = "Namaskara Sri Durga Devi Temple 🙏") {
    const phone = this.getWhatsAppPhone();
    return `https://wa.me/${phone}?text=${encodeURIComponent(customText)}`;
  }

  /**
   * Builds seva inquiry URL for landing page or devotee catalog
   */
  static generateSevaInquiryUrl(seva) {
    const phone = this.getWhatsAppPhone();
    const text = [
      "Namaskara Sri Durga Parameshwari Temple 🙏",
      "I would like to enquire and request availability for:",
      `• Seva: ${seva.name}${seva.kannadaName ? ` (${seva.kannadaName})` : ''}`,
      `• Contribution: ₹${seva.kanike}`,
      "• Temple: Chandra Layout, Bengaluru",
      "",
      "Please let me know available dates and sankalpa guidelines."
    ].join("\n");
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  }
}
