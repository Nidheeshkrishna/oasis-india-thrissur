import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export default function ContactSection({ contactData }) {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    destination: 'Ooty & Nilgiri Hills',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const c = contactData || {
    phone: '+91 94470 00000',
    phoneAlt: '+91 487 2333388',
    whatsapp: '+91 94470 00000',
    email: 'sales@oasisindiatours.com',
    emailAlt: 'support@oasisindiatours.com',
    address: 'OASIS India Thrissur, Swaraj Round Main Branch & Airport Escort Desk, Thrissur, Kerala 680001',
    workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 5:00 PM',
    escortDesk: 'Cochin International Airport (COK) & Thrissur Railway Station Pickup Desk'
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
            <MapPin size={14} /> Swaraj Round Main Branch
          </span>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff' }}>
            Contact <span className="text-gold">OASIS India Thrissur</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '0.6rem' }}>
            Have questions about tour itineraries or custom pilgrimage arrangements? Reach out directly to our Thrissur team.
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
                  24/7 Booking Helpline
                </h4>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
                  <a href={`tel:${c.phone}`} style={{ color: '#fff', textDecoration: 'none' }}>{c.phone}</a>
                </div>
                {c.phoneAlt && (
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Landline: <a href={`tel:${c.phoneAlt}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>{c.phoneAlt}</a>
                  </div>
                )}
              </div>
            </div>

            {/* WhatsApp Direct */}
            <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MessageSquare size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#10b981', marginBottom: '0.3rem' }}>
                  WhatsApp Priority Support
                </h4>
                <div style={{ fontSize: '0.9rem', color: '#fff', fontWeight: 600 }}>
                  <a href={`https://wa.me/${c.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ color: '#10b981', textDecoration: 'none' }}>
                    {c.whatsapp} (Chat Now)
                  </a>
                </div>
              </div>
            </div>

            {/* Email Inquiries */}
            <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={22} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '0.3rem' }}>
                  Email & Documentation
                </h4>
                <div style={{ fontSize: '0.88rem', color: '#fff' }}>
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
                  Branch Office & Working Hours
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                  {c.address}
                </p>
                <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Clock size={13} /> {c.workingHours}
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
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
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
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Phone Number (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 98765 43210"
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
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Interested Tour Package
                  </label>
                  <select
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    style={{
                      width: '100%',
                      background: 'rgba(6,12,23,0.9)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  >
                    <option value="Ooty & Nilgiri Hills">Ooty & Nilgiri Hills Tour</option>
                    <option value="Sacred Kashi & Ayodhya Yatra">Sacred Kashi & Ayodhya Yatra</option>
                    <option value="Kashmir Paradise & Punjab">Kashmir Paradise & Punjab</option>
                    <option value="Divine Odisha & Puri Jagannath">Divine Odisha & Puri Jagannath</option>
                    <option value="Tamil Nadu Sacred Trail">Tamil Nadu Sacred Trail (Tenkasi / Tiruchendur)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 600, marginBottom: '0.3rem' }}>
                    Special Requirements or Questions
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

                <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  <Send size={16} /> Send Tour Inquiry
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
