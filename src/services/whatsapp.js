// WhatsApp Click-to-Chat helpers.
// The WhatsApp number always comes from website settings (contactData), never hard-coded.
import { initialContactData } from '../data/companyContactData';

const CONTACT_STORAGE_KEY = 'oasis_db_company_contact';

export const getContactData = () => {
  try {
    const saved = localStorage.getItem(CONTACT_STORAGE_KEY);
    if (saved) return { ...initialContactData, ...JSON.parse(saved) };
  } catch (e) {
    // fall back to defaults
  }
  return initialContactData;
};

export const getWhatsAppNumber = () => {
  const raw = getContactData().whatsapp || getContactData().phone || '+918921124101';
  return String(raw).replace(/[^\d]/g, '');
};

export const getPhoneNumber = () => {
  const raw = getContactData().phone || '+91 89211 24101';
  return String(raw).replace(/[^\d]/g, '');
};

export const buildWhatsAppUrl = (message) => {
  return `https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(message)}`;
};

export const openWhatsApp = (message) => {
  window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
};

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

// Full booking message — package AND customer details are injected dynamically.
export const buildBookingMessage = (booking) => {
  const lines = [
    'Hello, I would like to book a tour.',
    `📦 Package: ${booking.packageName || ''}`,
    `📍 Destination: ${booking.destination || ''}`,
    `⏱️ Duration: ${booking.duration || 'As per package'}`,
    `💰 Package Price: ${fmt(booking.totalPrice || booking.basePrice)} per person`,
    '',
    `📅 Travel Date: ${booking.travelDate || ''}`,
    `👨 Adults: ${booking.adults || 0}`,
    `👧 Children: ${booking.children || 0}`,
    '',
    `👤 Name: ${booking.customerName || ''}`,
    `📱 Phone: ${booking.phone || ''}`,
    `📧 Email: ${booking.email || ''}`,
    `📍 Pickup Location: ${booking.pickupLocation || ''}`,
    `🏨 Hotel Preference: ${booking.hotelPreference || booking.tier || 'Standard 3-Star'}`,
    `📝 Special Requirements:\n${booking.requirements || '—'}`,
    '',
    'Please confirm availability, final price and booking details.'
  ];
  return lines.join('\n');
};

// Quick enquiry from a package card — no form needed.
export const buildQuickEnquiryMessage = (pkg) => {
  const dest = Array.isArray(pkg.mainPlaces)
    ? pkg.mainPlaces.join(', ')
    : (pkg.destination || pkg.location || '');
  const lines = [
    'Hello, I am interested in the following package.',
    `📦 Package: ${pkg.title || pkg.name || ''}`,
    `📍 Destination: ${dest}`,
    `⏱️ Duration: ${pkg.duration || ''}`,
    `💰 Price: ${fmt(pkg.price || pkg.startingPrice)}`,
    '',
    'Please send me availability and booking details.'
  ];
  return lines.join('\n');
};
