import React, { useState } from 'react';
import { 
  X, Calendar, Users, MapPin, Sparkles, CheckCircle2, 
  CreditCard, ShieldCheck, Download, Printer, QrCode, Phone, Mail 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { firestoreService } from '../services/firebase';
import OasisLogo from './OasisLogo';

export default function BookingModal({ initialData, onClose, onBookingSuccess }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    packageName: initialData?.title || initialData?.name || 'Sacred North Yatra: Kashi, Ayodhya & Prayagraj',
    destination: initialData?.name || 'Kashi Vishwanath Temple & Varanasi',
    travelDate: '',
    adults: 2,
    children: 0,
    tier: 'Deluxe 4-Star',
    pickupLocation: 'Thrissur Swaraj Round Main Office',
    customerName: '',
    email: '',
    phone: '',
    dietary: 'Pure Veg (Jain / South Indian Available)'
  });

  const basePricePerPerson = initialData?.price || initialData?.startingPrice || 24999;
  
  const tierMultiplier = formData.tier === 'Super Luxury 5-Star' ? 1.35 : formData.tier === 'Standard 3-Star' ? 0.85 : 1.0;
  const subtotal = Math.round(basePricePerPerson * (formData.adults + formData.children * 0.6) * tierMultiplier);
  const gst = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + gst;

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await firestoreService.createBooking({
        ...formData,
        totalPrice: totalAmount,
        basePrice: basePricePerPerson
      });

      setConfirmedBooking(result);
      setStep(4); // Success Voucher Step

      // Trigger Confetti Celebration
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onBookingSuccess) onBookingSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
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
                <Sparkles size={14} /> Instant Tour Booking Wizard
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
              Reserve Your <span className="text-gold-gradient">OASIS Tour</span>
            </h2>

            {/* Step Indicators */}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.2rem' }}>
              {['1. Package & Dates', '2. Passenger Details', '3. Tier & Payment'].map((sName, idx) => (
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
                Selected Tour Package
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Departure / Travel Date *
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
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Pickup Point in Kerala
                </label>
                <select
                  value={formData.pickupLocation}
                  onChange={(e) => setFormData({ ...formData, pickupLocation: e.target.value })}
                  style={{
                    width: '100%',
                    background: '#0b172a',
                    border: '1px solid var(--border-gold)',
                    color: '#fff',
                    padding: '0.85rem 1rem',
                    borderRadius: '10px'
                  }}
                >
                  <option value="Thrissur Swaraj Round Main Office">Thrissur Swaraj Round Office</option>
                  <option value="Thrissur Junction Railway Station (TCR)">Thrissur Junction Railway Station</option>
                  <option value="Cochin International Airport (COK)">Cochin International Airport (COK)</option>
                  <option value="Ernakulam Junction (ERS)">Ernakulam Junction</option>
                </select>
              </div>
            </div>

            {/* Travelers Count */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Adult Travelers (12+ yrs)
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
                  Children (5-11 yrs)
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
              <span>Continue to Passenger Info</span>
            </button>
          </div>
        )}

        {/* STEP 2: PASSENGER DETAILS */}
        {step === 2 && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem', marginBottom: '1.2rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                  Full Name *
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
                  Phone Number (WhatsApp) *
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
                Email Address *
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

            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Dietary Preference & Special Needs
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

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-glass" onClick={() => setStep(1)} style={{ flex: 1, justifyContent: 'center' }}>
                Back
              </button>
              <button 
                disabled={!formData.customerName || !formData.phone || !formData.email}
                className="btn-gold" 
                onClick={() => setStep(3)} 
                style={{ flex: 2, justifyContent: 'center', opacity: (formData.customerName && formData.phone) ? 1 : 0.5 }}
              >
                Proceed to Customization
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: TIER & PAYMENT SUMMARY */}
        {step === 3 && (
          <form onSubmit={handleSubmitBooking}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Select Luxury Accommodation Tier
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
                Fare Calculation Breakdown
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Base Package Fare ({formData.adults} Adults, {formData.children} Child)</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>GST & Tourism Tax (5%)</span>
                  <span>₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-gold)', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem', color: 'var(--gold-light)' }}>
                  <span>Total Amount Payable:</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" className="btn-glass" onClick={() => setStep(2)} style={{ flex: 1, justifyContent: 'center' }}>
                Back
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="btn-gold" 
                style={{ flex: 2, justifyContent: 'center' }}
              >
                <CreditCard size={18} />
                <span>{isSubmitting ? 'Confirming Booking...' : 'Confirm & Generate Receipt'}</span>
              </button>
            </div>
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
                Booking Confirmed!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Official Travel Voucher generated for {confirmedBooking.customerName}
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
                    Swaraj Round North, Thrissur, Kerala • Reg. No: KTD/TS/2026/89
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ background: '#4E6128', color: '#ffffff', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.75rem', display: 'inline-block' }}>
                    CONFIRMED VOUCHER
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.3rem', color: '#0f172a' }}>
                    ID: {confirmedBooking.id}
                  </div>
                </div>
              </div>

              {/* Voucher Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.2rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Package Name</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.8rem' }}>
                    {confirmedBooking.packageName}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Traveler: </span>
                      <strong>{confirmedBooking.customerName}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Travel Date: </span>
                      <strong>{confirmedBooking.travelDate}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Pickup Hub: </span>
                      <strong>{confirmedBooking.pickupLocation}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Tier: </span>
                      <strong>{confirmedBooking.tier}</strong>
                    </div>
                  </div>
                </div>

                {/* QR Code & Total */}
                <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', paddingLeft: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <QrCode size={80} color="#0f172a" />
                  <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.4rem' }}>Scan at Pickup Desk</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#059669', marginTop: '0.6rem' }}>
                    ₹{confirmedBooking.totalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.8rem', fontSize: '0.75rem', color: '#64748b', textAlign: 'center' }}>
                For instant assistance, present this voucher at Thrissur Office or call 24x7 Helpline +91 94470 00000.
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button 
                className="btn-glass" 
                onClick={() => window.print()}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <Printer size={18} />
                <span>Print Voucher</span>
              </button>

              <button 
                className="btn-gold" 
                onClick={onClose}
                style={{ flex: 1, justifyContent: 'center' }}
              >
                <span>Done</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
