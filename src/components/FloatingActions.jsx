import React, { useEffect, useState } from 'react';
import { MessageCircle, ArrowUp, Phone } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getWhatsAppNumber, getPhoneNumber } from '../services/whatsapp';

export default function FloatingActions() {
  const { t } = useLanguage();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
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
