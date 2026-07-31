import React, { useState } from 'react';
import { Star, Clock, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, MapPin } from 'lucide-react';
import { PACKAGES } from '../data/packagesData';

export default function LatestTours({ onBookTour, onSelectDestination }) {
  const [scrollIndex, setScrollIndex] = useState(0);

  const handlePrev = () => {
    setScrollIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setScrollIndex((prev) => Math.min(PACKAGES.length - 1, prev + 1));
  };

  return (
    <section style={{ padding: '6rem 0', position: 'relative', background: 'linear-gradient(180deg, #060c17 0%, #0a1426 100%)' }}>
      <div className="container">
        
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div className="badge-gold" style={{ marginBottom: '0.6rem' }}>
              Handcrafted Packages from Thrissur
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
              Latest Signature <span className="text-gold-gradient">Tour Packages</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.4rem' }}>
              All packages include luxury AC transfers, 4/5-Star stays, and authentic Kerala-escorted support.
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
                color: scrollIndex === 0 ? '#444' : 'var(--gold-light)',
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
              disabled={scrollIndex >= PACKAGES.length - 2}
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                background: scrollIndex >= PACKAGES.length - 2 ? 'rgba(255,255,255,0.03)' : 'rgba(212,175,55,0.15)',
                border: '1px solid var(--border-gold)',
                color: scrollIndex >= PACKAGES.length - 2 ? '#444' : 'var(--gold-light)',
                cursor: scrollIndex >= PACKAGES.length - 2 ? 'not-allowed' : 'pointer',
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
            {PACKAGES.map((pkg) => (
              <div 
                key={pkg.id} 
                className="glass-card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  overflow: 'hidden'
                }}
              >
                {/* Package Real Photograph */}
                <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                  />
                  <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: 'rgba(6, 12, 23, 0.85)',
                    backdropFilter: 'blur(8px)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '20px',
                    padding: '0.3rem 0.8rem',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--gold-light)'
                  }}>
                    {pkg.badge}
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '1rem',
                    right: '1rem',
                    background: '#10b981',
                    color: '#000',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    padding: '0.25rem 0.65rem',
                    borderRadius: '12px'
                  }}>
                    SAVE {pkg.discountPercent}%
                  </div>
                </div>

                {/* Card Info Content */}
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                  
                  <div>
                    {/* Rating & Duration */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#facc15', fontSize: '0.9rem', fontWeight: 700 }}>
                        <Star size={16} fill="#facc15" stroke="none" />
                        <span>{pkg.rating} ({pkg.reviews} reviews)</span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        <Clock size={15} color="var(--gold-primary)" />
                        <span>{pkg.duration}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                      {pkg.title}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gold-light)', marginBottom: '1.2rem', fontStyle: 'italic' }}>
                      {pkg.subtitle}
                    </p>

                    {/* Included Key Features */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginBottom: '1.5rem' }}>
                      {pkg.included.slice(0, 3).map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          <CheckCircle2 size={15} color="var(--emerald-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price & Action Row */}
                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                        Starting Price
                      </div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                        ₹{pkg.price.toLocaleString('en-IN')}{' '}
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                          ₹{pkg.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>

                    <button 
                      className="btn-gold" 
                      onClick={() => onBookTour(pkg)}
                      style={{ padding: '0.6rem 1.2rem', fontSize: '0.82rem' }}
                    >
                      <Sparkles size={15} />
                      <span>Book Now</span>
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
