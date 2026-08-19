// WhatsApp Click-to-Chat helpers.
// The WhatsApp number is 8921124101 and synchronized across all company communication.
import { initialContactData } from '../data/companyContactData';

const CONTACT_STORAGE_KEY = 'oasis_db_company_contact';

export const getContactData = () => {
  try {
    const saved = localStorage.getItem(CONTACT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      
      // Auto-migrate old "Swaraj Round" addresses out of localStorage
      if (parsed.address && (parsed.address.includes('Swaraj Round') || parsed.address.includes('680001'))) {
        parsed.address = initialContactData.address;
      }
      if (parsed.escortDesk && (parsed.escortDesk.includes('Swaraj Round') || parsed.escortDesk.includes('680001'))) {
        parsed.escortDesk = initialContactData.escortDesk;
      }

      return {
        ...initialContactData,
        ...parsed,
        // Enforce valid oasis email format if broken
        email: parsed.email && !parsed.email.includes('oasisindiatours') && parsed.email !== initialContactData.email ? parsed.email : initialContactData.email,
      };
    }
  } catch (e) {
    // fall back to defaults
  }
  return initialContactData;
};

export const getWhatsAppNumber = () => {
  const raw = getContactData().whatsapp || getContactData().phone || '8921124101';
  const digits = String(raw).replace(/[^\d]/g, '');
  if (digits.length === 10) return `91${digits}`;
  return digits || '918921124101';
};

export const getPhoneNumber = () => {
  const raw = getContactData().phone || '8921124101';
  const digits = String(raw).replace(/[^\d]/g, '');
  return digits || '8921124101';
};

export const buildWhatsAppUrl = (message) => {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
};

export const openWhatsApp = (message) => {
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
};

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// Simple, direct tour enquiry message for WhatsApp (no complex booking fields required)
export const buildQuickEnquiryMessage = (pkg) => {
  if (!pkg) {
    return 'Hello OASIS India Holidays Thrissur, I would like to make an enquiry about your tour packages.';
  }
  const title = pkg.title || pkg.packageName || pkg.name || 'Tour Package';
  const dest = Array.isArray(pkg.mainPlaces)
    ? pkg.mainPlaces.join(', ')
    : (pkg.destination || pkg.location || '');
  const lines = [
    '✨ *OASIS INDIA HOLIDAYS THRISSUR — TOUR ENQUIRY*',
    '',
    'Hello, I would like to enquire about this tour package:',
    `📦 *Package:* ${title}`,
    pkg.departureDate ? `📅 *Departure Date:* ${pkg.departureDate}` : '',
    pkg.duration ? `⏱️ *Duration:* ${pkg.duration}` : '',
    pkg.price ? `💰 *Price:* ₹${Number(pkg.price).toLocaleString('en-IN')} / person` : '',
    dest ? `📍 *Places / Sightseeing:* ${dest}` : '',
    '',
    '💬 Please share available seats, pickup details from Thrissur, and package itinerary with me.',
    'Thank you!'
  ].filter(Boolean);
  return lines.join('\n');
};

export const buildBookingMessage = (booking) => {
  return buildQuickEnquiryMessage(booking);
};
