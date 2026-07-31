import React, { useState } from 'react';
import { MapPin, Star, ArrowRight, ShieldCheck, Sparkles, Filter } from 'lucide-react';

export default function PopularDestinations({ destinations, onSelectDestination, onBookTour }) {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = [
    { id: 'All', label: 'All Destinations (15)' },
    { id: 'Pilgrimage', label: 'Pilgrimage & Sacred Temples' },
    { id: 'Nature', label: 'Nature & Wildlife' },
    { id: 'Hill Station', label: 'Hill Stations' },
    { id: 'Heritage', label: 'Heritage & History' }
  ];

  const filteredDestinations = selectedCategory === 'All'
    ? destinations
    : destinations.filter(d => d.category === selectedCategory);

  return (
    <section id="destinations" style={{ padding: '6rem 0', position: 'relative' }}>
      <div className="container">
        
        {/* Section Title */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
          <span className="badge-gold" style={{ marginBottom: '0.8rem' }}>
            <ShieldCheck size={14} /> 100% Authentic Real Destination Photos
          </span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.8rem' }}>
            Popular <span className="text-gold-gradient">Destinations</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            Explore iconic Indian pilgrimage centers, lush hill stations, and heritage monuments with OASIS Thrissur.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.8rem',
          flexWrap: 'wrap',
          marginBottom: '3.5rem'
        }}>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                background: selectedCategory === cat.id ? 'linear-gradient(135deg, #d4af37 0%, #aa841c 100%)' : 'rgba(255,255,255,0.05)',
                color: selectedCategory === cat.id ? '#060c17' : 'var(--text-muted)',
                border: '1px solid var(--border-gold)',
                padding: '0.65rem 1.4rem',
                borderRadius: '30px',
                fontSize: '0.9rem',
                fontWeight: selectedCategory === cat.id ? '800' : '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: selectedCategory === cat.id ? '0 4px 15px var(--gold-glow)' : 'none'
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
              {/* Original Real Image Container */}
              <div style={{ position: 'relative', height: '280px', overflow: 'hidden' }}>
                <img
                  src={dest.heroImage}
                  alt={dest.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                />
                
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
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}>
                  <MapPin size={15} color="var(--gold-primary)" />
                  <span>{dest.location}</span>
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, lineHeight: 1.3, marginBottom: '0.4rem', fontFamily: 'var(--font-heading)' }}>
                    {dest.name}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.2rem', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {dest.tagline}
                  </p>
                </div>

                {/* Bottom Pricing & Action */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      From Thrissur
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                      ₹{dest.startingPrice.toLocaleString('en-IN')}{' '}
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 500 }}>/ person</span>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: 'var(--gold-primary)',
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}>
                    <span>Explore</span>
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
