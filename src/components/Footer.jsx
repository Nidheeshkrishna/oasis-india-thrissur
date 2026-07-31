import React from 'react';
import { MapPin, Phone, Mail, ShieldCheck, Heart, ArrowUp } from 'lucide-react';
import OasisLogo from './OasisLogo';

export default function Footer({ setActiveTab, onOpenAdmin }) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: '#03060c', borderTop: '1px solid var(--border-gold)', color: 'var(--text-muted)', paddingTop: '5rem', paddingBottom: '2rem', position: 'relative' }}>
      <div className="container">
        
        {/* Top Footer Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
          
          {/* Brand Col */}
          <div>
            <div style={{ marginBottom: '1.2rem' }}>
              <OasisLogo height={48} />
            </div>

            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
              Kerala leading luxury travel portal & pilgrimage specialist based in Thrissur. Crafting extraordinary journeys with authentic real photography, VIP temple accesses, and 5-star hospitality.
            </p>

            <span className="badge-gold">
              <ShieldCheck size={14} /> Ministry of Tourism Approved
            </span>
          </div>

          {/* Thrissur Head Office Details */}
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '1.2rem', fontFamily: 'var(--font-heading)' }}>
              Thrissur Head Office
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
              Featured Shrines & Spots
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
              Authentic Media Policy
            </h4>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>
              OASIS India Thrissur strictly utilizes 100% genuine royalty-free and licensed destination photographs. No AI generated artwork, CGI, or digital illustrations are used in our portal.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <button onClick={onOpenAdmin} className="btn-glass" style={{ padding: '0.4rem 0.9rem', fontSize: '0.78rem' }}>
                Admin Portal Console
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
            © 2026 OASIS India Thrissur Travel Agency. All Rights Reserved. Designed with <Heart size={13} fill="#ef4444" color="#ef4444" style={{ display: 'inline', margin: '0 2px' }} /> in Kerala.
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
