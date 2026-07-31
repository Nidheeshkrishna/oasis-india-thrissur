import React, { useState, useEffect } from 'react';
import { Star, Clock, Calendar, ArrowRight, Sparkles, ChevronLeft, ChevronRight, MapPin, Shield } from 'lucide-react';

export default function HeroSlider({ destinations, onSelectDestination, onBookTour }) {
  // Select top featured real photo slides (Ayodhya Ram Mandir as primary slide)
  const featuredSlides = [
    destinations.find(d => d.id === 'ayodhya-ram-mandir'),
    destinations.find(d => d.id === 'kashi-varanasi'),
    destinations.find(d => d.id === 'munnar-tea-plantations'),
    destinations.find(d => d.id === 'puri-jagannath'),
    destinations.find(d => d.id === 'ooty-tea-railway')
  ].filter(Boolean);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredSlides.length);
    }, 5000); // 5 seconds auto-slide
    return () => clearInterval(interval);
  }, [featuredSlides.length, isPaused]);

  const slide = featuredSlides[currentIndex] || featuredSlides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredSlides.length) % featuredSlides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredSlides.length);
  };

  return (
    <section 
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '680px',
        overflow: 'hidden',
        background: '#040810'
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background 4K Real Photography Slide with Motion */}
      {featuredSlides.map((item, idx) => (
        <div
          key={item.id}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: idx === currentIndex ? 1 : 0,
            transition: 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
            zIndex: 1
          }}
        >
          <img
            src={item.heroImage}
            alt={item.name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              transform: idx === currentIndex ? 'scale(1.04)' : 'scale(1.0)',
              transition: 'transform 6s ease-out'
            }}
          />
          {/* Gradient Overlay for Readability */}
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(6,12,23,0.4) 0%, rgba(6,12,23,0.7) 60%, rgba(6,12,23,0.98) 100%), linear-gradient(90deg, rgba(6,12,23,0.85) 0%, rgba(6,12,23,0.3) 60%)'
          }} />
        </div>
      ))}

      {/* Auto-Slide Top Progress Bar (5 seconds) */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: 0,
        right: 0,
        height: '3px',
        background: 'rgba(255, 255, 255, 0.15)',
        zIndex: 10
      }}>
        <div 
          key={currentIndex}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #d4af37, #10b981)',
            animation: isPaused ? 'none' : 'slideProgress 5s linear infinite'
          }}
        />
      </div>

      <style>{`
        @keyframes slideProgress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>

      {/* Slide Main Content */}
      <div 
        className="container" 
        style={{
          position: 'relative',
          zIndex: 10,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '100px'
        }}
      >
        <div style={{ maxWidth: '780px' }}>
          
          {/* Top Real Photo & Location Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
            <span className="badge-gold">
              <Shield size={14} /> 100% Authentic Real Destination Photo
            </span>
            <span className="badge-emerald" style={{ background: 'rgba(16, 185, 129, 0.2)' }}>
              <MapPin size={14} /> {slide.location}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#facc15', fontSize: '0.9rem', fontWeight: 700 }}>
              <Star size={16} fill="#facc15" stroke="none" />
              <span>{slide.rating} ({slide.reviewsCount} Authentic Reviews)</span>
            </div>
          </div>

          {/* Destination Name & Headline */}
          <h1 style={{
            fontSize: 'clamp(2.4rem, 5vw, 4.2rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1rem',
            fontFamily: 'var(--font-heading)',
            textShadow: '0 4px 20px rgba(0,0,0,0.8)'
          }}>
            {slide.name}
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            color: 'var(--gold-light)',
            fontWeight: 500,
            marginBottom: '1.5rem',
            fontStyle: 'italic'
          }}>
            "{slide.tagline}"
          </p>

          <p style={{
            fontSize: '1rem',
            color: 'var(--text-muted)',
            marginBottom: '2rem',
            maxHeight: '75px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical'
          }}>
            {slide.description}
          </p>

          {/* Key Info Bar (Duration, Price, Departure) */}
          <div className="glass-card" style={{
            padding: '1.2rem 1.8rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '2.5rem',
            flexWrap: 'wrap'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                Tour Duration
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} color="var(--gold-primary)" />
                {slide.duration}
              </div>
            </div>

            <div style={{ width: '1px', height: '35px', background: 'var(--border-gold)' }} />

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                Starting Package Price
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                ₹{slide.startingPrice.toLocaleString('en-IN')}{' '}
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ person</span>
              </div>
            </div>

            <div style={{ width: '1px', height: '35px', background: 'var(--border-gold)' }} />

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                Thrissur Pickup
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--emerald-accent)' }}>
                Swaraj Round & TCR Station
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <button 
              className="btn-gold"
              onClick={() => onBookTour(slide)}
            >
              <Sparkles size={18} />
              <span>Book Now</span>
            </button>

            <button 
              className="btn-glass"
              onClick={() => onSelectDestination(slide)}
            >
              <span>Explore Destination Guide</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>

      {/* Carousel Controls & Slide Indicators */}
      <div 
        className="container"
        style={{
          position: 'absolute',
          bottom: '30px',
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Slide Counter */}
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          <span style={{ color: 'var(--gold-light)', fontSize: '1.3rem', fontWeight: 800 }}>
            0{currentIndex + 1}
          </span> / 0{featuredSlides.length} — Authentic Photography Showcase
        </div>

        {/* Thumbnail Preview Dots & Nav Arrows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={handlePrev}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid var(--border-gold)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)'
            }}
          >
            <ChevronLeft size={22} />
          </button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {featuredSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: idx === currentIndex ? '32px' : '10px',
                  height: '10px',
                  borderRadius: '5px',
                  background: idx === currentIndex ? 'var(--gold-primary)' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>

          <button 
            onClick={handleNext}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid var(--border-gold)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)'
            }}
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
