import React, { useState } from 'react';
import { Star, Clock, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, MapPin, Eye } from 'lucide-react';
import { catalogService } from '../services/catalog';
import { useCatalog } from '../hooks/useCatalog';
import { useLanguage } from '../i18n/LanguageContext';
import MixedBackground from './MixedBackground';

export default function LatestTours({ onBookTour, onSelectDestination, onViewDetails }) {
  const { t } = useLanguage();
  const [scrollIndex, setScrollIndex] = useState(0);
  const tours = useCatalog(catalogService.getTours);

  const handlePrev = () => {
    setScrollIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setScrollIndex((prev) => Math.min(tours.length - 1, prev + 1));
  };

  return (
    <section style={{ padding: '6rem 0', position: 'relative', background: 'linear-gradient(180deg, #ffffff 0%, #f6efff 50%, #eaf7ff 100%)', overflow: 'hidden' }}>
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
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
              {t('tours.title')}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.4rem' }}>
              {t('tours.subtitle')}
            </p>
          </div>

          {/* Carousel Arrows */}
          <div style={{ display: 'flex', gap: '0.8rem' }}>
            <button 
              onClick={handlePrev} 
              disabled={scrollIndex === 0}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: scrollIndex === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(212,175,55,0.15)',
                border: '1px solid var(--border-gold)',
                color: scrollIndex === 0 ? '#444' : 'var(--gold-deep)',
                cursor: scrollIndex === 0 ? 'not-allowed' : 'pointer',
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
              disabled={scrollIndex >= tours.length - 2}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: scrollIndex >= tours.length - 2 ? 'rgba(255,255,255,0.03)' : 'rgba(212,175,55,0.15)',
                border: '1px solid var(--border-gold)',
                color: scrollIndex >= tours.length - 2 ? '#444' : 'var(--gold-deep)',
                cursor: scrollIndex >= tours.length - 2 ? 'not-allowed' : 'pointer',
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
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '2rem'
          }}>
            {tours.map((pkg) => (
              <div 
                key={pkg.id} 
                className="glass-card"
                onClick={() => onViewDetails && onViewDetails(pkg)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
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
                    {/* Badge & Discount Row */}
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
                      <span style={{
                        background: '#10b981',
                        color: '#000',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        padding: '0.3rem 0.7rem',
                        borderRadius: '12px'
                      }}>
                        {t('tours.off')} {pkg.discountPercent}%
                      </span>                    </div>

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

                    {/* Main Places Chips */}
                    {pkg.mainPlaces && pkg.mainPlaces.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
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
                    )}

                    {/* Included Key Features */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.5rem' }}>
                      {pkg.included.slice(0, 3).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                          <CheckCircle2 size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

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
                        ₹{pkg.price.toLocaleString('en-IN')}{' '}
                        <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', textDecoration: 'line-through' }}>
                          ₹{pkg.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button 
                      className="btn-gold" 
                      onClick={(e) => { e.stopPropagation(); onBookTour(pkg); }}
                      style={{ padding: '0.6rem 1.2rem', fontSize: '0.82rem' }}
                    >
                      <Sparkles size={15} />
                      <span>{t('tours.bookNow')}</span>
                    </button>
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
