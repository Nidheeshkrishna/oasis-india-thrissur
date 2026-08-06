import React, { useState } from 'react';
import { MapPin, Phone, Mail, ShieldCheck, Heart, ArrowUp, MailPlus, CheckCircle2 } from 'lucide-react';
import OasisLogo from './OasisLogo';
import { useLanguage } from '../i18n/LanguageContext';

export default function Footer({ setActiveTab, onOpenAdmin }) {
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
    <footer style={{ background: '#03060c', borderTop: '1px solid var(--border-gold)', color: 'var(--text-muted)', paddingTop: '5rem', paddingBottom: '2rem', position: 'relative' }}>
      <div className="container">

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
          </div>

          {/* Thrissur Head Office Details */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              {t('footer.office')}
            </h4>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                <MapPin size={18} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>OASIS Towers, Swaraj Round North, Near Thrissur Railway Station, Thrissur, Kerala - 680001</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Phone size={18} color="var(--gold-primary)" />
                <span>+91 94470 00000 / +91 487 2345678</span>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <Mail size={18} color="var(--gold-primary)" />
                <span>thrissur@oasisindia.travel</span>
              </div>
            </div>
          </div>

          {/* Destinations Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              {t('footer.quickLinks')}
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.85rem' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('destinations')}>Kashi Vishwanath</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('destinations')}>Ayodhya Ram Mandir</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('destinations')}>Puri Jagannath</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('destinations')}>Munnar Tea Plantations</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('destinations')}>Ooty Toy Railway</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('destinations')}>Konark Sun Temple</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('destinations')}>Thenkasi Viswanathar</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('destinations')}>Tiruchendur Shrine</span>
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
    </footer>
  );
}
