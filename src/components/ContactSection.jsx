import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck, Sparkles, Loader2, Navigation, ExternalLink } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from './SocialIcons';
import { useLanguage } from '../i18n/LanguageContext';
import { firestoreService } from '../services/firebase';
import { catalogService } from '../services/catalog';
import { useCatalog } from '../hooks/useCatalog';
import { DESTINATIONS } from '../data/destinationsData';

export default function ContactSection({ contactData }) {
  const { t } = useLanguage();
  const destinations = useCatalog(catalogService.getDestinations) || DESTINATIONS;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    destination: destinations[0]?.name || 'Ooty Nilgiri Hills & Heritage Toy Train',
    message: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await firestoreService.createInquiry({
        name: form.name,
        phone: form.phone,
        email: form.email,
        destination: form.destination,
        message: form.message,
        source: 'Website Contact Form'
      });
    } catch (err) {
      console.warn('Inquiry save to Firestore note:', err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  };

  const c = contactData || {
    phone: '+91 89211 24101',
    phoneAlt: '+91 89213 94179',
    whatsapp: '+91 89211 24101',
    email: 'Oasisindiaholidays@gmail.com',
    emailAlt: 'Oasisindiaholidays@gmail.com',
    address: '40/3924 Rohini Plaza, Near Railway Station, Kokkalai, Thrissur',
    workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 5:00 PM',
    escortDesk: '40/3924 Rohini Plaza, Near Railway Station, Kokkalai, Thrissur'
  };

  return (
    <section id="contact" style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', background: 'var(--bg-dark)', color: '#fff', position: 'relative' }}>
      
      {/* Decorative Golden Light Orbs */}
      <div style={{ position: 'absolute', top: 0, left: '10%', width: '300px', height: '300px', background: 'rgba(212,175,55,0.06)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, right: '10%', width: '350px', height: '350px', background: 'rgba(16,185,129,0.05)', borderRadius: '50%', filter: 'blur(100px)', pointerEvents: 'none' }} />

      <div className="container">
        
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 3rem' }}>
          <span className="badge-gold" style={{ marginBottom: '0.8rem' }}>
            <MapPin size={14} /> 40/3924 Rohini Plaza, Kokkalai, Thrissur
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff' }}>
            Contact <span className="text-gold">Oasis India Holidays</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.6rem' }}>
            Have questions about tour itineraries or custom pilgrimage arrangements? Reach out directly to our team at 40/3924 Rohini Plaza, Near Railway Station, Kokkalai, Thrissur.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
          
          {/* Left Column: Editable Contact Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            {/* Call Direct */}
            <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Phone size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '0.3rem' }}>
                  24/7 Booking Helplines
                </h4>
                <div style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 700, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <a href="tel:+918921124101" style={{ color: '#fff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    📞 +91 89211 24101
                  </a>
                  <a href="tel:+918921394179" style={{ color: 'var(--gold-light)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                    📞 +91 89213 94179
                  </a>
                </div>
              </div>
            </div>

            {/* WhatsApp Direct */}
            <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', alignItems: 'flex-start', gap: '1rem', background: 'linear-gradient(135deg, rgba(37,211,102,0.1), rgba(18,140,126,0.06))', border: '1px solid rgba(37,211,102,0.35)' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(37,211,102,0.2)', border: '1px solid rgba(37,211,102,0.5)', color: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#4ade80', marginBottom: '0.2rem' }}>
                  WhatsApp — Book Instantly
                </h4>
                <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.55)', marginBottom: '0.4rem' }}>
                  All bookings &amp; enquiries go to this number
                </div>
                <a
                  href="https://wa.me/918921124101?text=Hello%20OASIS%20India%20Holidays%20Thrissur%2C%20I%20would%20like%20to%20make%20a%20tour%20enquiry."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#25D366', textDecoration: 'none', fontWeight: 800, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  💬 +91 89211 24101
                </a>
              </div>
            </div>

            {/* Email Inquiries */}
            <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '0.3rem' }}>
                  Email & Official Inquiries
                </h4>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
                  <a href={`mailto:${c.email}`} style={{ color: '#fff', textDecoration: 'none' }}>{c.email}</a>
                </div>
              </div>
            </div>

            {/* Office Address & Working Hours */}
            <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '0.3rem' }}>
                  40/3924 Rohini Plaza, Near Railway Station, Kokkalai, Thrissur
                </h4>
                <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.95)', lineHeight: 1.5, marginBottom: '0.5rem', fontWeight: 600 }}>
                  {c.address}
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={13} /> {c.workingHours}
                </div>
              </div>
            </div>

            {/* Follow Us on Social Media */}
            <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.4)', color: '#a78bfa', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.3rem' }}>
                  Follow Us on Social Media
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.4rem' }}>
                  <a
                    href="https://www.facebook.com/p/Oasis-India-Holidays-100090841204193/"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#4da3ff', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}
                  >
                    <FacebookIcon size={17} /> facebook.com/Oasis-India-Holidays
                  </a>
                  <a
                    href="https://www.instagram.com/oasis.india.holidays?igsh=MzN5OTgzNGNiaHhv"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#f472b6', textDecoration: 'none', fontSize: '0.88rem', fontWeight: 600 }}
                  >
                    <InstagramIcon size={17} /> instagram.com/oasis.india.holidays
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Direct Message Form */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} /> Quick Tour Inquiry Form
            </h3>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              Fill in your contact details below and our Thrissur tour coordinator will get back to you within 30 minutes.
            </p>

            {submitted ? (
              <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', color: '#fff' }}>
                <CheckCircle2 size={36} color="#10b981" style={{ margin: '0 auto 0.8rem' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', marginBottom: '0.3rem' }}>
                  Inquiry Received!
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)' }}>
                  Thank you! Our Thrissur team will call you at <strong style={{ color: '#fff' }}>{form.phone}</strong> shortly.
                </p>
                <button 
                  onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', email: '', destination: destinations[0]?.name || '', message: '' }); }}
                  className="btn-gold" 
                  style={{ marginTop: '1rem', padding: '0.5rem 1.2rem', fontSize: '0.85rem' }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ramesh Menon"
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.3rem' }}>
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g. 89211 24101"
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid var(--border-gold)',
                        borderRadius: '8px',
                        color: '#fff',
                        padding: '0.65rem 0.9rem',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.3rem' }}>
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. you@example.com"
                      style={{
                        width: '100%',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid var(--border-gold)',
                        borderRadius: '8px',
                        color: '#fff',
                        padding: '0.65rem 0.9rem',
                        fontSize: '0.85rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Interested Tour Destination
                  </label>
                  <select
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    style={{
                      width: '100%',
                      background: '#091322',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    {destinations.map(d => (
                      <option key={d.id} value={d.name} style={{ background: '#091322', color: '#fff' }}>
                        {d.name} ({d.category || 'Tour'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Your Travel Requirements / Message
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us your planned travel dates, family size, or special requirements..."
                    style={{
                      width: '100%',
                      background: 'rgba(0,0,0,0.4)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.85rem',
                      outline: 'none',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="btn-gold" 
                  style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.5rem', opacity: submitting ? 0.7 : 1 }}
                >
                  {submitting ? <Loader2 size={16} className="animate-pulse-slow" /> : <Send size={16} />}
                  <span>{submitting ? 'Sending Inquiry...' : 'Send Tour Inquiry'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Interactive Google Map of Office Location */}
        <div className="glass-card" style={{ padding: '1.5rem', marginTop: '2.5rem', border: '1px solid var(--border-gold)', borderRadius: '18px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                <MapPin size={22} color="var(--gold-primary)" /> Oasis India Holidays • Office Map Location
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', marginTop: '0.25rem' }}>
                📍 40/3924 Rohini Plaza, Near Railway Station, Kokkalai, Thrissur
              </p>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=40%2F3924+Rohini+Plaza+Near+Railway+Station+Kokkalai+Thrissur+Kerala"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem', fontWeight: 800, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.45rem' }}
            >
              <Navigation size={16} />
              <span>Get Directions on Google Maps</span>
              <ExternalLink size={14} />
            </a>
          </div>
          <div style={{ position: 'relative', width: '100%', height: '340px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.3)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }}>
            <iframe
              title="Oasis India Holidays - 40/3924 Rohini Plaza Near Railway Station Kokkalai Thrissur Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src="https://maps.google.com/maps?q=40%2F3924+Rohini+Plaza%2C+Near+Railway+Station%2C+Kokkalai%2C+Thrissur%2C+Kerala&t=&z=16&ie=UTF8&iwloc=&output=embed"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
