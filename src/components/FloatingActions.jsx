import React, { useEffect, useState } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

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
        href="https://wa.me/919447000000?text=Hello%20OASIS%20India%20Thrissur%2C%20I%20want%20to%20plan%20a%20tour%20package."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="float-whatsapp"
      >
        <span className="float-whatsapp-label">{t('floating.chat')}</span>
        <MessageCircle size={28} />
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
