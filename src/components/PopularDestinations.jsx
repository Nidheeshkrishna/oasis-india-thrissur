import React, { useState } from 'react';
import { MapPin, Star, ArrowRight, ShieldCheck, Sparkles, Filter, Layers } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import MixedBackground from './MixedBackground';

export default function PopularDestinations({ destinations, onSelectDestination, onBookTour }) {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 'All', label: `${t('popular.catAll')} (${destinations.length})` },
    { id: 'Pilgrimage', label: t('popular.catPilgrimage') },
    { id: 'Nature', label: t('popular.catNature') },
    { id: 'Hill Station', label: t('popular.catHill') },
    { id: 'Heritage', label: t('popular.catHeritage') }
  ];

  const filteredDestinations = selectedCategory === 'All'
    ? destinations
    : destinations.filter(d => d.category === selectedCategory);

  return (
    <section id="destinations" style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', position: 'relative', overflow: 'hidden' }}>
      {/* Colorful ambient orbs */}
      <div className="orb" style={{ width: '340px', height: '340px', background: 'var(--violet)', top: '-80px', left: '-100px' }} />
      <div className="orb" style={{ width: '300px', height: '300px', background: 'var(--cyan)', bottom: '10%', right: '-90px', animationDelay: '-4s' }} />
      <div className="orb" style={{ width: '260px', height: '260px', background: 'var(--saffron)', top: '40%', left: '45%', animationDelay: '-8s' }} />

      <div className="container">
        
        {/* Section Title */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
          <span className="badge-aurora" style={{ marginBottom: '0.8rem' }}>
            <ShieldCheck size={14} /> {t('hero.authenticBadge')}
          </span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.8rem' }}>
            {t('popular.title')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            {t('popular.subtitle')}
          </p>
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.8rem',
          flexWrap: 'wrap',
          marginBottom: '2.5rem'
        }}>
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id
                  ? `linear-gradient(135deg, ${['#d4af37', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4'][i % 5]} 0%, ${['#aa841c', '#ea580c', '#be123c', '#6d28d9', '#0e7490'][i % 5]} 100%)`
                  : 'rgba(255,255,255,0.05)',
                color: selectedCategory === cat.id ? '#060c17' : 'var(--text-muted)',
                border: '1px solid var(--border-gold)',
                padding: '0.65rem 1.4rem',
                borderRadius: '30px',
                fontSize: '0.9rem',
                fontWeight: selectedCategory === cat.id ? '800' : '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedCategory === cat.id ? `0 4px 15px ${['var(--gold-glow)', 'rgba(245,158,11,0.4)', 'rgba(244,63,94,0.4)', 'rgba(139,92,246,0.4)', 'rgba(6,182,212,0.4)'][i % 5]}` : 'none'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Large Masonry Grid */}
        <div className="masonry-grid">
          {filteredDestinations.map((dest) => (
            <div 
              key={dest.id}
              className="glass-card"
              style={{
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                position: 'relative'
              }}
              onClick={() => onSelectDestination(dest)}
            >
              {/* Clean Destination Photo Container */}
              <div style={{ position: 'relative', height: '260px', overflow: 'hidden' }}>
                <img
                  src={dest.heroImage}
                  alt={dest.name}
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
                  background: 'linear-gradient(to top, rgba(6,12,23,0.88) 0%, rgba(6,12,23,0.2) 50%, transparent 100%)',
                  pointerEvents: 'none'
                }} />
                
                {/* Category & Rating Badges */}
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  left: '1rem',
                  display: 'flex',
                  gap: '0.5rem'
                }}>
                  <span className="badge-gold">
                    {dest.category}
                  </span>
                </div>

                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'rgba(6, 12, 23, 0.85)',
                  backdropFilter: 'blur(8px)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  color: '#facc15',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  border: '1px solid var(--border-gold)'
                }}>
                  <Star size={14} fill="#facc15" stroke="none" />
                  <span>{dest.rating}</span>
                </div>

                {/* Location Overlay Bar */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(6,12,23,0.95), rgba(6,12,23,0))',
                  padding: '1.2rem 1.2rem 0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--gold-light)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                }}>
                  <MapPin size={15} color="var(--gold-primary)" />
                  <span>{dest.location}</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3, marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                    {dest.name}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.85)', fontWeight: 500, marginBottom: '1.2rem', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {dest.tagline}
                  </p>
                </div>

                {/* Bottom Pricing & Action */}
                <div style={{ paddingTop: '0.8rem', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#fef08a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {t('popular.fromThrissur')}
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
                      ₹{dest.startingPrice.toLocaleString('en-IN')}{' '}
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>{t('hero.perPerson')}</span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--gold-primary)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    transition: 'all 0.3s ease'
                  }}>
                    <span className="text-aurora" style={{ fontWeight: 800 }}>{t('popular.explore')}</span>
                    <ArrowRight size={16} />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
