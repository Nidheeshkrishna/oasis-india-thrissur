import React, { useState } from 'react';
import { MapPin, Phone, Mail, ShieldCheck, Heart, ArrowUp, MailPlus, CheckCircle2 } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from './SocialIcons';
import OasisLogo from './OasisLogo';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer({ setActiveTab, onOpenAdmin, onSelectDestination }) {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  return (
    <footer className="footer-cinematic" style={{ background: '#03060c', borderTop: '1px solid var(--border-gold)', color: 'var(--text-muted)', paddingTop: 'clamp(3.5rem, 6vw, 5rem)', paddingBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
      {/* Ambient particle layer inside footer */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.06), transparent 60%), radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.04), transparent 50%)',
          animation: 'footerAmbient 12s ease-in-out infinite alternate',
          pointerEvents: 'none',
        }} />
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>

        {/* Newsletter Signup Band */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '18px',
            padding: '2.2rem',
            marginBottom: '4rem',
            background: 'linear-gradient(120deg, #f59e0b, #e11d48, #8b5cf6, #0891b2)',
            backgroundSize: '300% 100%',
            animation: 'gradientShift 10s ease infinite',
            boxShadow: '0 16px 40px -12px rgba(225,29,72,0.45)'
          }}
        >
          <div className="orb" style={{ width: '220px', height: '220px', background: 'rgba(255,255,255,0.18)', top: '-80px', right: '10%' }} />
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '260px' }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)', marginBottom: '0.4rem' }}>
                {t('footer.newsletterTitle')}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem', margin: 0 }}>
                {t('footer.newsletterText')}
              </p>
            </div>
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: '0.6rem', flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#ffffff', borderRadius: '50px', padding: '0.4rem 1.1rem', flex: 1 }}>
                <MailPlus size={18} color="#e11d48" style={{ flexShrink: 0 }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('footer.emailPlaceholder')}
                  style={{ border: 'none', outline: 'none', background: 'transparent', color: '#0f172a', fontSize: '0.95rem', flex: 1, minWidth: 0, padding: '0.5rem 0', fontFamily: 'var(--font-body)' }}
                />
              </div>
              <button type="submit" style={{
                background: '#ffffff',
                color: '#e11d48',
                border: 'none',
                borderRadius: '50px',
                padding: '0.8rem 1.6rem',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                fontFamily: 'var(--font-body)'
              }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.25)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                {t('footer.subscribe')}
              </button>
            </form>
          </div>
          {subscribed && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 5,
              background: 'rgba(3,6,12,0.88)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '1rem',
              borderRadius: '18px'
            }}>
              <CheckCircle2 size={22} color="#34d399" />
              {t('footer.subscribed')}
            </div>
          )}
        </div>

        {/* Top Footer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ marginBottom: '1.2rem' }}>
              <OasisLogo height={48} />
            </div>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              {t('footer.aboutText')}
            </p>

            <span className="badge-gold">
              <ShieldCheck size={14} /> Ministry of Tourism Approved
            </span>

            {/* Social Media Links */}
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <a
                href="https://www.facebook.com/p/Oasis-India-Holidays-100090841204193/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Oasis India Holidays on Facebook"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: 'rgba(24,119,242,0.12)',
                  border: '1px solid rgba(24,119,242,0.4)',
                  color: '#4da3ff',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '30px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <FacebookIcon size={16} /> Facebook
              </a>
              <a
                href="https://www.instagram.com/oasis.india.holidays?igsh=MzN5OTgzNGNiaHhv"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Oasis India Holidays on Instagram"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  background: 'rgba(225,29,72,0.12)',
                  border: '1px solid rgba(225,29,72,0.4)',
                  color: '#f472b6',
                  padding: '0.45rem 0.9rem',
                  borderRadius: '30px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <InstagramIcon size={16} /> Instagram
              </a>
            </div>
          </div>

          {/* Thrissur Head Office Details */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              {t('footer.office')}
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=40%2F3924+Rohini+Plaza+Near+Railway+Station+Kokkalai+Thrissur+Kerala"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  40/3924 Rohini Plaza, Near Railway Station, Kokkalai, Thrissur
                </a>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--gold-primary)" />
                <span>
                  <a href="tel:+918921124101" style={{ color: 'inherit', textDecoration: 'none' }}>+91 89211 24101</a>
                  {' / '}
                  <a href="tel:+918921394179" style={{ color: 'inherit', textDecoration: 'none' }}>+91 89213 94179</a>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Mail size={18} color="var(--gold-primary)" />
                <a href="mailto:Oasisindiaholidays@gmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>Oasisindiaholidays@gmail.com</a>
              </div>
            </div>
          </div>

          {/* Destinations Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              {t('footer.quickLinks')}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.85rem' }}>
              {[
                { id: 'kashi-varanasi', label: 'Kashi Vishwanath' },
                { id: 'ayodhya-ram-mandir', label: 'Ayodhya Ram Mandir' },
                { id: 'puri-jagannath', label: 'Puri Jagannath' },
                { id: 'munnar-tea-plantations', label: 'Munnar Tea Plantations' },
                { id: 'ooty-tea-railway', label: 'Ooty Toy Railway' },
                { id: 'konark-sun-temple', label: 'Konark Sun Temple' },
                { id: 'thenkasi-viswanathar', label: 'Thenkasi Viswanathar' },
                { id: 'tiruchendur-murugan', label: 'Tiruchendur Shrine' },
              ].map((d) => (
                <span
                  key={d.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setActiveTab('home');
                    onSelectDestination(d.id);
                  }}
                >
                  {d.label}
                </span>
              ))}
            </div>
          </div>

          {/* Guarantee Note */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              {t('footer.mediaPolicy')}
            </h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              OASIS India Thrissur strictly utilizes 100% genuine royalty-free and licensed destination photographs. No AI generated artwork, CGI, or digital illustrations are used in our portal.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={onOpenAdmin} className="btn-glass" style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}>
                {t('adminPortal')}
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Back to Top */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          fontSize: '0.82rem'
        }}>
          <div>
            © 2026 OASIS India Thrissur Travel Agency. {t('footer.rights')}
          </div>

          <button
            onClick={scrollToTop}
            style={{
              background: 'rgba(212,175,55,0.15)',
              border: '1px solid var(--border-gold)',
              color: 'var(--gold-light)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ArrowUp size={18} />
          </button>
        </div>

      </div>
      <style>{`
        @keyframes footerAmbient {
          0%   { opacity: 0.6; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.04); }
        }
      `}</style>
    </footer>
  );
}
