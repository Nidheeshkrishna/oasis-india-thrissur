// WhatsApp Click-to-Chat helpers.
// The WhatsApp number is 8921124101 and synchronized across all company communication.
import { initialContactData } from '../data/companyContactData';

const CONTACT_STORAGE_KEY = 'oasis_db_company_contact';

export const getContactData = () => {
  try {
    const saved = localStorage.getItem(CONTACT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...initialContactData,
        ...parsed,
        // Enforce updated communication contacts
        email: parsed.email && !parsed.email.includes('oasisindiatours') ? parsed.email : initialContactData.email,
        whatsapp: parsed.whatsapp || initialContactData.whatsapp,
        phone: parsed.phone || initialContactData.phone
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

// Full booking message — formatted as a comprehensive Booking Enquiry for WhatsApp
export const buildBookingMessage = (booking) => {
  const lines = [
    '✨ *OASIS INDIA HOLIDAYS THRISSUR — BOOKING ENQUIRY*',
    '',
    'Hello, I would like to make a booking enquiry for the following tour package:',
    `📦 *Package:* ${booking.packageName || booking.title || ''}`,
    booking.destination ? `📍 *Destination:* ${booking.destination}` : '',
    booking.duration ? `⏱️ *Duration:* ${booking.duration}` : '',
    booking.totalPrice || booking.basePrice || booking.price ? `💰 *Price:* ${fmt(booking.totalPrice || booking.basePrice || booking.price)} per person` : '',
    '',
    '👤 *TRAVELER & TRIP DETAILS:*',
    `📅 *Preferred Travel / Departure Date:* ${booking.travelDate || booking.departureDate || 'Upcoming Departure'}`,
    `👥 *Travelers:* ${booking.adults || 1} Adults${booking.children ? `, ${booking.children} Children` : ''}`,
    `👤 *Name:* ${booking.customerName || ''}`,
    `📱 *Phone / WhatsApp:* ${booking.phone || '8921124101'}`,
    booking.email ? `📧 *Email:* ${booking.email}` : '',
    booking.pickupLocation ? `📍 *Pickup Point:* ${booking.pickupLocation}` : '📍 *Pickup Hub:* Thrissur Swaraj Round / Direct Escort Desk',
    booking.hotelPreference || booking.tier ? `🏨 *Stay Preference:* ${booking.hotelPreference || booking.tier}` : '',
    booking.requirements && booking.requirements !== '—' ? `📝 *Special Notes:* ${booking.requirements}` : '',
    '',
    '💬 Please confirm availability, final quote, and booking details with me.',
    'Thank you!'
  ].filter(line => line !== undefined && line !== null && line !== '');
  return lines.join('\n');
};

// Quick enquiry from a package card — "Book Now as Enquiry"
export const buildQuickEnquiryMessage = (pkg) => {
  const dest = Array.isArray(pkg.mainPlaces)
    ? pkg.mainPlaces.join(', ')
    : (pkg.destination || pkg.location || '');
  const lines = [
    '✨ *OASIS INDIA HOLIDAYS THRISSUR — BOOK NOW ENQUIRY*',
    '',
    'Hello, I am interested in booking this tour package and would like to make an enquiry:',
    `📦 *Package Name:* ${pkg.title || pkg.name || ''}`,
    dest ? `📍 *Places Covered:* ${dest}` : '',
    pkg.duration ? `⏱️ *Duration:* ${pkg.duration}` : '',
    pkg.price ? `💰 *Package Price:* ${fmt(pkg.price)} per person` : '',
    pkg.departureDate ? `📅 *Departure Date:* ${pkg.departureDate}` : '',
    '',
    '💬 Please share available slots, full itinerary, and booking procedure with me.',
    'Thank you!'
  ].filter(Boolean);
  return lines.join('\n');
};
