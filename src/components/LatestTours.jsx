import React, { useState, useRef, useEffect } from 'react';
import { Star, Clock, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, MapPin, Eye, MessageCircle } from 'lucide-react';
import { catalogService, sortToursUpcomingFirst } from '../services/catalog';
import { getWhatsAppNumber, buildQuickEnquiryMessage } from '../services/whatsapp';
import { useCatalog } from '../hooks/useCatalog';
import { useLanguage } from '../i18n/LanguageContext';
import { getValidOriginalPrice, getDiscountPercent } from '../utils/price';
import MixedBackground from './MixedBackground';

export default function LatestTours({ onBookTour, onSelectDestination, onViewDetails }) {
  const { t } = useLanguage();
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const isTourActive = (departureDate) => {
    if (!departureDate) return true;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tourDate = new Date(`${departureDate}T00:00:00`);
      if (isNaN(tourDate.getTime())) return true;
      return tourDate >= today;
    } catch {
      return true;
    }
  };

  const rawTours = useCatalog(catalogService.getTours) || [];
  // Strictly hide inactive / departed tours from public Curated Tour Packages
  const activeTours = rawTours.filter(pkg => isTourActive(pkg.departureDate));
  const tours = sortToursUpcomingFirst(activeTours);

  const CARD_STEP = 400;

  // Normalize admin-entered list fields (arrays, comma/line separated strings, or empty)
  const toList = (val) => {
    if (Array.isArray(val)) return val.map(String).filter(Boolean);
    if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
    return [];
  };
  const highlightedTours = tours.map(pkg => ({
    ...pkg,
    mainPlaces: toList(pkg.mainPlaces),
    included: toList(pkg.included),
    punjabHighlights: toList(pkg.punjabHighlights),
    validOriginalPrice: getValidOriginalPrice(pkg.price, pkg.originalPrice),
    discountPercent: getDiscountPercent(pkg.price, pkg.originalPrice)
  }));

  const updateArrowState = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 5);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 5);
  };

  useEffect(() => {
    updateArrowState();
    window.addEventListener('resize', updateArrowState);
    return () => window.removeEventListener('resize', updateArrowState);
  }, [tours.length]);

  const handlePrev = () => {
    trackRef.current?.scrollBy({ left: -CARD_STEP, behavior: 'smooth' });
  };

  const handleNext = () => {
    trackRef.current?.scrollBy({ left: CARD_STEP, behavior: 'smooth' });
  };

  return (
    <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', position: 'relative', background: 'linear-gradient(180deg, #ffffff 0%, #f6efff 50%, #eaf7ff 100%)', overflow: 'hidden' }}>
      {/* Colorful ambient orbs */}
      <div className="orb" style={{ width: '360px', height: '360px', background: 'var(--saffron)', top: '-120px', right: '-80px' }} />
      <div className="orb" style={{ width: '300px', height: '300px', background: 'var(--rose)', bottom: '-60px', left: '-100px', animationDelay: '-5s' }} />
      <div className="orb" style={{ width: '240px', height: '240px', background: 'var(--violet)', top: '30%', right: '30%', animationDelay: '-9s' }} />

      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="badge-aurora" style={{ marginBottom: '0.6rem' }}>
              {t('tours.badge')}
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a' }}>
              {t('tours.title')}
            </h2>
            <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '0.4rem' }}>
              {t('tours.subtitle')}
            </p>
          </div>

          {/* Carousel Arrows */}
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button 
              onClick={handlePrev} 
              disabled={!canPrev}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: canPrev ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-gold)',
                color: canPrev ? 'var(--gold-deep)' : '#444',
                cursor: canPrev ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <ChevronLeft size={22} />
            </button>

            <button 
              onClick={handleNext}
              disabled={!canNext}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: canNext ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border-gold)',
                color: canNext ? 'var(--gold-deep)' : '#444',
                cursor: canNext ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease'
              }}
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>

        {/* Multi-Card Tour Carousel */}
        <div style={{ overflow: 'hidden' }}>
          <div
            ref={trackRef}
            onScroll={updateArrowState}
            style={{
              display: 'flex',
              gap: '2rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              scrollbarWidth: 'thin',
              paddingBottom: '0.5rem',
            }}
          >
            {highlightedTours.map((pkg) => (
              <div 
                key={pkg.id} 
                className="glass-card"
                onClick={() => onViewDetails && onViewDetails(pkg)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: '0 0 auto',
                  width: 'min(380px, 88vw)',
                  scrollSnapAlign: 'start',
                  height: '100%',
                  overflow: 'hidden',
                  cursor: onViewDetails ? 'pointer' : 'default'
                }}
              >
                {/* Package Hero Image */}
                {pkg.image && (
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden', flexShrink: 0 }}>
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)'
                      }}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(to top, rgba(6,12,23,0.85) 0%, rgba(6,12,23,0.15) 50%, transparent 100%)',
                      pointerEvents: 'none'
                    }} />
                    <span style={{
                      position: 'absolute',
                      bottom: '0.8rem',
                      left: '0.8rem',
                      background: 'rgba(6,12,23,0.8)',
                      border: '1px solid var(--border-gold)',
                      color: 'var(--gold-deep)',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.3rem 0.7rem',
                      borderRadius: '20px',
                      backdropFilter: 'blur(6px)'
                    }}>
                      <MapPin size={11} style={{ verticalAlign: '-1px', marginRight: '3px' }} />
                      {pkg.mainPlaces?.[0] || pkg.badge}
                    </span>
                  </div>
                )}

                {/* Card Info Content */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  
                  <div>
                    {/* Badge Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                      <span style={{
                        background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
                        border: '1px solid var(--border-gold)',
                        borderRadius: '20px',
                        padding: '0.3rem 0.8rem',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: 'var(--gold-deep)'
                      }}>
                        {pkg.badge}
                      </span>
                    </div>

                    {/* Rating & Duration */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b', fontSize: '0.9rem', fontWeight: 700 }}>
                        <Star size={16} fill="#f59e0b" stroke="none" />
                        <span style={{ color: 'rgba(255,255,255,0.85)' }}>{pkg.rating} ({pkg.reviews} reviews)</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, fontSize: '0.85rem' }}>
                        <Clock size={15} color="#f59e0b" />
                        <span>{pkg.duration}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                      {pkg.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#fef08a', fontWeight: 600, marginBottom: '1.2rem', fontStyle: 'italic' }}>
                      {pkg.subtitle}
                    </p>

                    {/* Main Places — Sightseeing */}
                    {pkg.mainPlaces.length > 0 && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                          Sightseeing
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {pkg.mainPlaces.map((place, idx) => (
                            <span key={idx} style={{
                              background: 'rgba(245,158,11,0.18)',
                              border: '1px solid rgba(245,158,11,0.4)',
                              color: '#fef08a',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              padding: '0.25rem 0.7rem',
                              borderRadius: '20px'
                            }}>
                              <MapPin size={11} style={{ verticalAlign: '-1px', marginRight: '3px' }} />
                              {place}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Included Highlights */}
                    {pkg.included.length > 0 && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                          Highlights
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                          {pkg.included.slice(0, 4).map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                              <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Punjab Highlights */}
                    {pkg.punjabHighlights && pkg.punjabHighlights.length > 0 && (
                      <div style={{
                        padding: '0.6rem 0',
                        marginBottom: '1rem'
                      }}>
                        <div style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                          Punjab Highlights
                        </div>
                        {pkg.punjabHighlights.map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.85)', marginBottom: '0.35rem' }}>
                            <Sparkles size={14} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Price & Action Row */}
                  <div style={{ paddingTop: '1rem', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#fef08a', fontWeight: 700, textTransform: 'uppercase' }}>
                        {t('tours.startingFrom')}
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f59e0b' }}>
                        ₹{pkg.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <a
                        href={`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(buildQuickEnquiryMessage(pkg))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Ask about this package on WhatsApp"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          border: '1px solid rgba(37,211,102,0.5)',
                          background: 'rgba(37,211,102,0.15)',
                          color: '#4ade80',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          flexShrink: 0
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(37,211,102,0.3)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(37,211,102,0.15)'; }}
                      >
                        <MessageCircle size={18} />
                      </a>

                      {/* Book Now Button ONLY for Upcoming Tours (departureDate >= today) */}
                      {(() => {
                        const isUpcoming = (() => {
                          if (!pkg.departureDate) return true;
                          try {
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const tourDate = new Date(`${pkg.departureDate}T00:00:00`);
                            if (isNaN(tourDate.getTime())) return true;
                            return tourDate >= today;
                          } catch {
                            return true;
                          }
                        })();

                        return isUpcoming ? (
                          <button 
                            className="btn-gold" 
                            onClick={(e) => { e.stopPropagation(); onBookTour(pkg); }}
                            style={{ padding: '0.6rem 1.2rem', fontSize: '0.82rem' }}
                          >
                            <Sparkles size={15} />
                            <span>{t('tours.bookNow')}</span>
                          </button>
                        ) : (
                          <span style={{
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            color: '#94a3b8',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            padding: '0.4rem 0.75rem',
                            borderRadius: '8px'
                          }}>
                            Departed ({pkg.departureDate})
                          </span>
                        );
                      })()}
                    </div>
                  </div>

                  {/* View Details Link */}
                  {onViewDetails && (
                    <div
                      style={{
                        borderTop: '1px solid var(--border-subtle)',
                        paddingTop: '0.9rem',
                        marginTop: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        color: 'var(--gold-primary)',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        transition: 'color 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = 'var(--gold-deep)'}
                      onMouseLeave={(e) => e.currentTarget.style.color = 'var(--gold-primary)'}
                    >
                      <Eye size={16} /> {t('tours.viewDetails')}
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
