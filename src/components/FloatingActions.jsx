import React, { useEffect, useState } from 'react';
import { MessageCircle, ArrowUp, Phone, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getWhatsAppNumber, getPhoneNumber } from '../services/whatsapp';

export default function FloatingActions({ onOpenAdmin }) {
  const { t } = useLanguage();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Floating Admin Console Quick Access Badge */}
      {onOpenAdmin && (
        <button
          onClick={onOpenAdmin}
          className="float-admin-badge"
          title="Open Admin Console (PIN: 2026)"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 899,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'linear-gradient(135deg, rgba(6, 12, 23, 0.95), rgba(15, 23, 42, 0.95))',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid var(--gold-primary)',
            borderRadius: '50px',
            color: '#fef08a',
            padding: '0.55rem 1.05rem',
            fontSize: '0.82rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6), 0 0 16px rgba(212,175,55,0.35)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 35px rgba(245,158,11,0.55), 0 0 20px rgba(245,158,11,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.6), 0 0 16px rgba(212,175,55,0.35)';
          }}
        >
          <ShieldCheck size={16} color="#fbbf24" />
          <span>Admin Console</span>
        </button>
      )}

      {/* Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent('Hello OASIS India Thrissur, I want to plan a tour package.')}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="float-whatsapp"
      >
        <span className="float-whatsapp-label">{t('floating.chat')}</span>
        <MessageCircle size={28} />
      </a>

      {/* Floating Call Now Button */}
      <a
        href={`tel:${getPhoneNumber()}`}
        aria-label="Call us now"
        className="float-call"
      >
        <Phone size={26} />
      </a>

      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="float-top"
        >
          <ArrowUp size={20} />
        </button>
      )}
    </>
  );
}
