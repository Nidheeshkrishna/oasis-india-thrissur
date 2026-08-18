import React, { useState } from 'react';
import { 
  X, Calendar, Users, MapPin, Sparkles, CheckCircle2, 
  Printer, QrCode, MessageCircle 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { firestoreService } from '../services/firebase';
import { buildBookingMessage, openWhatsApp } from '../services/whatsapp';
import OasisLogo from './OasisLogo';
import { useLanguage } from '../i18n/LanguageContext';
import RouteMapVisualizer from './RouteMapVisualizer';
import { searchLocationsAndNearby, resolveLocationCoords } from '../data/nearbyLocationsData';

export default function BookingModal({ initialData, onClose, onBookingSuccess }) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const DEFAULT_HUBS = [
    'Thrissur Swaraj Round Main Hub',
    'Cochin International Airport (COK)',
    'Ernakulam Junction',
    'Palakkad Junction',
    'Calicut International Airport',
    'Coimbatore Junction'
  ];

  const toName = (s) => typeof s === 'string' ? s.trim() : (s && typeof s === 'object' ? String(s.name || '').trim() : '');

  const normalizeList = (val, fallback) => {
    const arr = Array.isArray(val) ? val : typeof val === 'string' ? val.split(',') : [];
    const l = arr.map(toName).filter(Boolean);
    return l.length ? l : fallback;
  };

  // New ordered route model: first = Start, last = Destination
  const hasRoutePoints = Array.isArray(initialData?.routePoints) && initialData.routePoints.length;
  const routeStops = hasRoutePoints ? normalizeList(initialData.routePoints, []) : [];

  const availablePickups = hasRoutePoints
    ? routeStops.slice(0, routeStops.length - 1)
    : normalizeList(initialData?.pickupPoints, DEFAULT_HUBS);

  const availableDrops = hasRoutePoints
    ? routeStops
    : normalizeList(initialData?.dropPoints, DEFAULT_HUBS);

  const defaultPickup = availablePickups[0] || 'Thrissur Swaraj Round Main Hub';
  const defaultDrop = availableDrops[availableDrops.length - 1] || defaultPickup;

  const src = initialData || {};
  const srcFullTour = src.fullTour || src;
  const srcMainPlaces = Array.isArray(srcFullTour?.mainPlaces)
    ? srcFullTour.mainPlaces.join(', ')
    : (Array.isArray(src.mainPlaces) ? src.mainPlaces.join(', ') : '');

  // Form State
  const [formData, setFormData] = useState({
    packageName: src.title || src.packageName || (src.name ? `${src.name} Tour Package` : 'Custom Tour Package'),
    destination: src.location || src.destination || srcMainPlaces || src.name || 'Thrissur Departure',
    travelDate: src.travelDate || '',
    adults: src.guests || src.adults || 2,
    children: 0,
    tier: 'Deluxe 4-Star',
    pickupLocation: src.pickupPoint?.name || defaultPickup,
    dropLocation: defaultDrop,
    customerName: '',
    email: '',
    phone: '',
    dietary: 'Pure Veg (Jain / South Indian Available)',
    specialRequirements: ''
  });

  const basePricePerPerson = initialData?.price || initialData?.startingPrice || 24999;
  
  const tierMultiplier = formData.tier === 'Super Luxury 5-Star' ? 1.35 : formData.tier === 'Standard 3-Star' ? 0.85 : 1.0;
  const subtotal = Math.round(basePricePerPerson * (formData.adults + formData.children * 0.6) * tierMultiplier);
  const gst = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + gst;

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test((v || '').trim());
  const isValidPhone = (v) => /^[+\d][\d\s\-()]{7,14}$/.test((v || '').trim());
  const canProceedStep2 = formData.customerName.trim() && isValidEmail(formData.email) && isValidPhone(formData.phone);

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    const bookingData = {
      ...formData,
      duration: src.duration || '',
      requirements: formData.specialRequirements || '',
      totalPrice: totalAmount,
      basePrice: basePricePerPerson
    };

    // Save the enquiry so the agency always has a record.
    try {
      await firestoreService.createBooking(bookingData);
    } catch (err) {
      // Never block the WhatsApp contact if saving fails
      console.warn('Booking save failed (continuing to WhatsApp):', err);
    }

    // Open WhatsApp with the fully pre-filled booking message
    const whatsappUrl = buildBookingMessage(bookingData);
    openWhatsApp(whatsappUrl);

    setConfirmedBooking({ ...bookingData, id: bookingData.id || `OASIS-BK-${Math.floor(1000 + Math.random() * 9000)}` });
    setStep(4); // Success screen

    // Trigger Confetti Celebration
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (onBookingSuccess) onBookingSuccess();
    setIsSubmitting(false);
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div 
        className="glass-card" 
        style={{
          width: '100%',
          maxWidth: step === 4 ? '780px' : '720px',
          maxHeight: '92vh',
          overflowY: 'auto',
          margin: 'auto',
          position: 'relative',
          padding: '2.5rem',
          background: '#081222',
          border: '1px solid var(--border-gold)'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid var(--border-gold)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        {/* Wizard Header Progress */}
        {step < 4 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge-gold">
                <Sparkles size={14} /> {t('booking.wizard')}
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              {t('booking.reserve')} <span className="text-gold-gradient">OASIS Tour</span>
            </h2>

            {/* Step Indicators */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.2rem' }}>
              {[t('booking.step1'), t('booking.step2'), t('booking.step3')].map((sName, idx) => (
                <div key={idx} style={{ flex: 1 }}>
                  <div style={{
                    height: '4px',
                    background: step > idx ? 'var(--gold-primary)' : 'rgba(255,255,255,0.1)',
                    borderRadius: '2px',
                    marginBottom: '0.4rem',
                    transition: 'all 0.3s ease'
                  }} />
                  <span style={{ fontSize: '0.75rem', color: step === idx + 1 ? 'var(--gold-light)' : 'var(--text-dim)', fontWeight: 600 }}>
                    {sName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1: PACKAGE & DATES */}
        {step === 1 && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                {t('booking.selectedPackage')}
              </label>
              <input
                type="text"
                value={formData.packageName}
                readOnly
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-gold)',
                  color: 'var(--gold-light)',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '1rem'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  {t('booking.travelDate')} *
                </label>
                <input
                  type="date"
                  value={formData.travelDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setFormData({ ...formData, travelDate: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Select Pickup Point *
                </label>
                <select
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#091426',
                    border: '1px solid var(--border-gold)',
                    color: '#fef08a',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {Array.from(new Set([formData.pickupLocation, ...availablePickups])).filter(Boolean).map((p, i) => (
                    <option key={i} value={p} style={{ background: '#091426', color: '#fef08a' }}>
                      📍 {p}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.4rem' }}>
                  Select Dropping Point *
                </label>
                <select
                  value={formData.dropLocation}
                  onChange={(e) => setFormData({ ...formData, dropLocation: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#091426',
                    border: '1px solid var(--border-gold)',
                    color: '#fef08a',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {Array.from(new Set([formData.dropLocation, ...availableDrops])).filter(Boolean).map((d, i) => (
                    <option key={i} value={d} style={{ background: '#091426', color: '#fef08a' }}>
                      🏁 {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Nearby Boarding Hub Discovery based on Starting Point */}
            {(() => {
              const activeStart = formData.pickupLocation || availablePickups[0] || 'Thrissur';
              const resolved = resolveLocationCoords(activeStart);
              const searchRes = searchLocationsAndNearby(activeStart, 5);
              const nearbyList = Array.from(new Set([...(resolved.nearby || []), ...(searchRes.nearbySuggestions || [])])).slice(0, 5);

              if (!nearbyList.length) return null;

              return (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(16,185,129,0.06))',
                  border: '1px solid rgba(212,175,55,0.22)',
                  borderRadius: '12px',
                  padding: '0.55rem 0.85rem',
                  marginBottom: '1.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles size={13} color="var(--gold-primary)" />
                    Nearby Pickup Hubs from {activeStart.split(' ')[0]}:
                  </span>
                  {nearbyList.map((nb, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setFormData(f => ({ ...f, pickupLocation: nb }))}
                      style={{
                        background: formData.pickupLocation === nb ? 'var(--gold-primary)' : 'rgba(212,175,55,0.12)',
                        color: formData.pickupLocation === nb ? '#000' : '#fef08a',
                        border: '1px solid var(--border-gold)',
                        borderRadius: '14px',
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      📍 {nb}
                    </button>
                  ))}
                </div>
              );
            })()}

            {/* Interactive Route & Pickup Map on Booking Time - Hidden per user directive */}

            {/* Travelers Count */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  {t('booking.adults')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData.adults}
                  onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  {t('booking.children')}
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px'
                  }}
                />
              </div>
            </div>

            <button
              disabled={!formData.travelDate}
              onClick={() => setStep(2)}
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', opacity: formData.travelDate ? 1 : 0.5 }}
            >
              <span>{t('booking.continue')}</span>
            </button>
          </div>
        )}

        {/* STEP 2: PASSENGER DETAILS */}
        {step === 2 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  {t('booking.name')} *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Menon"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px'
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  {t('booking.phoneWhatsApp')} *
                </label>
                <input
                  type="tel"
                  placeholder="+91 94470 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-gold)',
                    color: '#fff',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px'
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                {t('booking.email')} *
              </label>
              <input
                type="email"
                placeholder="ramesh@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-gold)',
                  color: '#fff',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px'
                }}
                required
              />
            </div>

            <div style={{ marginBottom: '1.2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                {t('booking.dietary')}
              </label>
              <select
                value={formData.dietary}
                onChange={(e) => setFormData({ ...formData, dietary: e.target.value })}
                style={{
                  width: '100%',
                  background: '#0b172a',
                  border: '1px solid var(--border-gold)',
                  color: '#fff',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px'
                }}
              >
                <option value="Pure Veg (Jain / South Indian Available)">Pure Veg (Sattvic / South Indian)</option>
                <option value="Non-Vegetarian (Kerala Style)">Non-Vegetarian Cuisine</option>
                <option value="Senior Citizen Wheelchair Assistance Needed">Senior Citizen Special Support</option>
              </select>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Special Requirements
              </label>
              <textarea
                placeholder="e.g. Airport pickup, adjoining family rooms, wheelchair assistance..."
                value={formData.specialRequirements}
                onChange={(e) => setFormData({ ...formData, specialRequirements: e.target.value })}
                rows={3}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-gold)',
                  color: '#fff',
                  padding: '0.85rem 1rem',
                  borderRadius: '10px',
                  resize: 'vertical',
                  fontFamily: 'var(--font-body)'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-glass" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>
                {t('booking.back')}
              </button>
              <button 
                disabled={!canProceedStep2}
                className="btn-gold" 
                onClick={() => { setSubmitError(''); setStep(3); }} 
                style={{ flex: 2, justifyContent: 'center', opacity: canProceedStep2 ? 1 : 0.5 }}
              >
                {t('booking.proceed')}
              </button>
            </div>
            {!canProceedStep2 && formData.customerName && (
              <p style={{ color: '#fca5a5', fontSize: '0.8rem', marginTop: '0.8rem' }}>
                Enter a valid email and 8+ digit phone number to continue.
              </p>
            )}
          </div>
        )}

        {/* STEP 3: REVIEW & CONTINUE ON WHATSAPP */}
        {step === 3 && (
          <form onSubmit={handleSubmitBooking}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Hotel Preference
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.8rem' }}>
                {['Standard 3-Star', 'Deluxe 4-Star', 'Super Luxury 5-Star'].map((tier) => (
                  <div
                    key={tier}
                    onClick={() => setFormData({ ...formData, tier })}
                    style={{
                      background: formData.tier === tier ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.04)',
                      border: formData.tier === tier ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      padding: '1rem 0.6rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: formData.tier === tier ? 'var(--gold-light)' : '#fff' }}>
                      {tier}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Calculation Breakdown */}
            <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '2rem', border: '1px solid var(--border-gold)' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '1rem' }}>
                {t('booking.fareBreakdown')}
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Base Package Fare ({formData.adults} Adults, {formData.children} Child)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{t('booking.gst')}</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-gold)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem', color: 'var(--gold-light)' }}>
                  <span>{t('booking.total')}:</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" className="btn-glass" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>
                {t('booking.back')}
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-gold" 
                style={{
                  flex: 2, justifyContent: 'center',
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  boxShadow: '0 4px 20px rgba(37,211,102,0.35)'
                }}
              >
                <MessageCircle size={18} />
                <span>{isSubmitting ? 'Saving...' : 'Continue to WhatsApp'}</span>
              </button>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '0.9rem', textAlign: 'center' }}>
              Your booking request is saved and WhatsApp opens with your full details ready to send. No payment taken online.
            </p>
            {submitError && (
              <p style={{ color: '#fca5a5', fontSize: '0.85rem', marginTop: '0.9rem', textAlign: 'center' }}>
                {submitError}
              </p>
            )}
          </form>
        )}

        {/* STEP 4: SUCCESS LUXURY BOOKING VOUCHER */}
        {step === 4 && confirmedBooking && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'rgba(16,185,129,0.2)',
                border: '2px solid var(--emerald-accent)',
                color: 'var(--emerald-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--gold-light)' }}>
                {t('booking.confirmed')}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                {t('booking.voucherGenerated', { name: confirmedBooking.customerName })}
              </p>
              <p style={{
                color: 'var(--emerald-accent)',
                fontSize: '0.9rem',
                fontWeight: 700,
                background: 'rgba(16,185,129,0.12)',
                border: '1px solid rgba(16,185,129,0.35)',
                borderRadius: '10px',
                padding: '0.6rem 1rem',
                marginTop: '0.8rem'
              }}>
                WhatsApp opened with your booking message — press <strong>Send</strong> there to confirm. Our Kerala-based travel specialist will call / WhatsApp you to confirm your seats and collect payment.
              </p>
            </div>

            {/* Printable Voucher Card */}
            <div 
              id="booking-voucher"
              style={{
                background: '#ffffff',
                color: '#0f172a',
                borderRadius: '12px',
                padding: '2rem',
                border: '2px solid #d4af37',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                marginBottom: '1.8rem'
              }}
            >
              {/* Voucher Header */}
              <div style={{ borderBottom: '2px dashed #cbd5e1', paddingBottom: '1rem', marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <OasisLogo height={42} />
                  <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>
                    {t('booking.voucherReg')}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ background: '#4E6128', color: '#ffffff', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', display: 'inline-block' }}>
                    {t('booking.voucherConfirmed')}
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.3rem', color: '#0f172a' }}>
                    {t('booking.voucherId', { id: confirmedBooking.id })}
                  </div>
                </div>
              </div>

              {/* Voucher Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.2rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{t('booking.packageName')}</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.8rem' }}>
                    {confirmedBooking.packageName}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>{t('booking.voucherTraveler')}</span>
                      <strong>{confirmedBooking.customerName}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>{t('booking.voucherTravelDate')}</span>
                      <strong>{confirmedBooking.travelDate}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>{t('booking.voucherPickupHub')}</span>
                      <strong>{confirmedBooking.pickupLocation}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>{t('booking.voucherTier')}</span>
                      <strong>{confirmedBooking.tier}</strong>
                    </div>
                  </div>
                </div>

                {/* QR Code & Total */}
                <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={80} color="#0f172a" />
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.4rem' }}>{t('booking.voucherScan')}</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#059669', marginTop: '0.6rem' }}>
                    ₹{confirmedBooking.totalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.8rem', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
                {t('booking.voucherNote')}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button 
                className="btn-glass" 
                onClick={() => window.print()}
                style={{ flex: 1, justifyContent: 'center', minWidth: '140px' }}
              >
                <Printer size={18} />
                <span>{t('booking.printVoucher')}</span>
              </button>

              <button
                className="btn-gold"
                onClick={() => openWhatsApp(buildBookingMessage(confirmedBooking))}
                style={{ flex: 1, justifyContent: 'center', minWidth: '140px', background: 'linear-gradient(135deg, #25D366, #128C7E)', boxShadow: '0 4px 20px rgba(37,211,102,0.35)' }}
              >
                <MessageCircle size={18} />
                <span>Open WhatsApp</span>
              </button>

              <button 
                className="btn-gold" 
                onClick={onClose}
                style={{ flex: 1, justifyContent: 'center', minWidth: '120px' }}
              >
                <span>{t('booking.done')}</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
