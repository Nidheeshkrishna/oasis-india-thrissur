import React, { useState } from 'react';
import {
  X, MapPin, Star, Clock, Sparkles, CheckCircle2, Compass, ShieldCheck,
  Camera, Layers, BadgePercent, Package as PackageIcon
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import MixedBackground from './MixedBackground';

export default function PackageModal({ pkg, onClose, onBookTour }) {
  const { t } = useLanguage();
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!pkg) return null;

  const placeGroups = (pkg.placeImages || []).reduce((groups, img) => {
    const key = img.group ? img.group.charAt(0).toUpperCase() + img.group.slice(1) : 'Destinations';
    if (!groups[key]) groups[key] = [];
    groups[key].push(img);
    return groups;
  }, {});

  return (
    <div className="modal-overlay" style={{ zIndex: 10001 }} onClick={onClose}>
      <div
        className="glass-card"
        style={{
          maxWidth: '1000px',
          width: '95%',
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: 0,
          background: '#060c17',
          border: '1px solid var(--border-gold)',
          position: 'relative',
          cursor: 'default'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            zIndex: 30,
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'rgba(6, 12, 23, 0.85)',
            border: '1px solid var(--border-gold)',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(8px)'
          }}
        >
          <X size={22} />
        </button>

        {/* Hero Image Header with Mixed Background */}
        {(pkg.image || (pkg.bgMixImages && pkg.bgMixImages.length > 0)) && (
          <div style={{ position: 'relative', height: '360px', overflow: 'hidden' }}>
            <MixedBackground
              images={pkg.bgMixImages}
              fallbackImage={pkg.image}
              style={pkg.bgMixStyle || 'collage-blend'}
              height="100%"
              overlayOpacity={0.55}
            />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', zIndex: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                <span className="badge-gold">
                  <ShieldCheck size={14} /> {t('package.signatureBadge')}
                </span>
                <span className="badge-emerald">
                  <Clock size={14} /> {pkg.duration}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#facc15', fontSize: '0.9rem', fontWeight: 700 }}>
                  <Star size={16} fill="#facc15" stroke="none" />
                  <span>{pkg.rating} ({pkg.reviews} {t('destination.travelerReviews')})</span>
                </div>
              </div>
              <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1.15, marginBottom: '0.5rem' }}>
                {pkg.title}
              </h1>
              <p style={{ fontSize: '1.05rem', color: 'var(--gold-light)', fontStyle: 'italic' }}>
                "{pkg.subtitle}"
              </p>
            </div>
          </div>
        )}

        <div style={{ padding: '2rem' }}>

          {/* Price & Badge Header */}
          <div className="glass-card" style={{
            padding: '1.6rem',
            border: '1px solid var(--border-gold)',
            marginBottom: '1.8rem',
            background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(168,85,247,0.08))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <span style={{
                background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
                border: '1px solid var(--border-gold)',
                borderRadius: '20px',
                padding: '0.3rem 0.8rem',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--gold-deep)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <PackageIcon size={13} /> {pkg.badge}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                {pkg.mainPlaces && pkg.mainPlaces.map((place, idx) => (
                  <span key={idx} style={{
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--gold-deep)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.9rem',
                    borderRadius: '20px'
                  }}>
                    <MapPin size={12} style={{ verticalAlign: '-1px', marginRight: '4px' }} />
                    {place}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                background: '#10b981',
                color: '#000',
                fontWeight: 800,
                fontSize: '0.75rem',
                padding: '0.3rem 0.7rem',
                borderRadius: '12px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                marginBottom: '0.5rem'
              }}>
                <BadgePercent size={13} /> {t('package.save', { percent: pkg.discountPercent })}
              </span>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-deep)' }}>
                ₹{pkg.price.toLocaleString('en-IN')}{' '}
                <span style={{ fontSize: '1rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                  ₹{pkg.originalPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('package.perTraveler')}</div>
            </div>
          </div>

          {/* Destination Photo Groups */}
          {Object.keys(placeGroups).length > 0 && (
            Object.entries(placeGroups).map(([groupName, images]) => (
              <div key={groupName} style={{ marginBottom: '1.8rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                  <Layers size={18} /> {t('package.groupHighlights', { group: groupName })}
                </h4>
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.6rem', scrollbarWidth: 'thin' }}>
                  {images.map((img, idx) => (
                    <div key={idx} style={{
                      position: 'relative',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: '1px solid var(--border-gold)',
                      flex: '0 0 280px',
                      height: '190px'
                    }}
                      onClick={() => setSelectedPhoto(img.url)}>
                      <img src={img.url} alt={img.name} loading="lazy"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'} />
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to top, rgba(6,12,23,0.92), rgba(6,12,23,0.15))',
                        display: 'flex', alignItems: 'flex-end', padding: '0.6rem',
                        fontSize: '0.8rem', fontWeight: 700, color: '#fff'
                      }}>
                        <Camera size={13} style={{ marginRight: '0.3rem' }} /> {img.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Punjab Highlights */}
          {pkg.punjabHighlights && pkg.punjabHighlights.length > 0 && (
            <div style={{ marginBottom: '1.8rem' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <Sparkles size={18} /> Punjab Highlights
              </h4>
              <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {pkg.punjabHighlights.map((h, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    <Sparkles size={16} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Included */}
          <div style={{ marginBottom: '1.8rem' }}>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <CheckCircle2 size={18} /> {t('package.included')}
            </h4>
            <div className="glass-card" style={{ padding: '1.4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.7rem' }}>
              {pkg.included.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                  <CheckCircle2 size={18} color="var(--emerald-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Itinerary */}
          <div>
            <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <Compass size={18} /> {t('package.itinerary')}
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {pkg.itinerary.map((day, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{
                    flexShrink: 0,
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    background: 'rgba(212,175,55,0.15)',
                    border: '1px solid var(--border-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    color: 'var(--gold-deep)',
                    fontSize: '0.8rem'
                  }}>
                    {t('package.day')} {day.day}
                  </div>
                  <div className="glass-card" style={{ flex: 1, padding: '0.9rem 1.1rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>{day.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{day.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-gold" style={{ padding: '0.8rem 1.8rem' }} onClick={() => { onClose(); onBookTour(pkg); }}>
              <Sparkles size={18} /> {t('package.book')}
            </button>
            <button className="btn-glass" style={{ padding: '0.8rem 1.8rem' }} onClick={onClose}>
              {t('package.browse')}
            </button>
          </div>

        </div>

        {/* Lightbox */}
        {selectedPhoto && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.92)',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem'
            }}
            onClick={() => setSelectedPhoto(null)}
          >
            <img
              src={selectedPhoto}
              alt="Expanded high res"
              style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', borderRadius: '8px' }}
            />
          </div>
        )}

      </div>
    </div>
  );
}
