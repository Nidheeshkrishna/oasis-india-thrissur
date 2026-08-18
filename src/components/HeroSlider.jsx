import React, { useState, useEffect } from 'react';
import { Star, Clock, Calendar, ArrowRight, Sparkles, ChevronLeft, ChevronRight, MapPin, Shield, Wand2, Check, MessageCircle } from 'lucide-react';
import { posterStorage } from '../services/gemini';
import { catalogService } from '../services/catalog';
import { getWhatsAppNumber, buildQuickEnquiryMessage } from '../services/whatsapp';
import { useCatalog } from '../hooks/useCatalog';
import { useLanguage } from '../i18n/LanguageContext';
import MixedBackground from './MixedBackground';

// AI Poster Design Banner Carousel — shows the latest 4 AI-generated posters
// from the admin console as framed poster designs at the top of the page.
function PosterDesignCarousel({ posters, onBookTour, compact }) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posters.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [posters.length, isPaused]);

  const poster = posters[currentIndex] || posters[0];

  const goPrev = () => setCurrentIndex((prev) => (prev - 1 + posters.length) % posters.length);
  const goNext = () => setCurrentIndex((prev) => (prev + 1) % posters.length);

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        minHeight: compact ? '0px' : '680px',
        height: compact ? 'auto' : '100vh',
        overflow: 'hidden',
        background: '#040810',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: compact ? '5rem' : 0
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated Aurora / Shimmer Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at 25% 35%, rgba(168,85,247,0.16), transparent 55%), radial-gradient(ellipse at 75% 70%, rgba(212,175,55,0.14), transparent 55%), radial-gradient(ellipse at 50% 100%, rgba(16,185,129,0.08), transparent 50%)',
        animation: 'auroraDrift 14s ease-in-out infinite alternate'
      }} />
      {/* Twinkling Stars */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.5), transparent), radial-gradient(2px 2px at 70% 20%, rgba(255,255,255,0.4), transparent), radial-gradient(1.5px 1.5px at 40% 60%, rgba(255,255,255,0.35), transparent), radial-gradient(2px 2px at 85% 50%, rgba(255,255,255,0.4), transparent), radial-gradient(1.5px 1.5px at 55% 80%, rgba(255,255,255,0.3), transparent), radial-gradient(2px 2px at 10% 75%, rgba(255,255,255,0.4), transparent)',
        animation: 'twinkle 3.2s ease-in-out infinite'
      }} />
      {/* Floating Gold Particles */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(3px 3px at 30% 40%, rgba(212,175,55,0.5), transparent), radial-gradient(2px 2px at 65% 65%, rgba(212,175,55,0.45), transparent), radial-gradient(2.5px 2.5px at 50% 25%, rgba(212,175,55,0.4), transparent), radial-gradient(2px 2px at 80% 80%, rgba(212,175,55,0.4), transparent)',
        animation: 'floatParticles 7s ease-in-out infinite'
      }} />

      {/* Auto-Slide Progress Bar */}
      <div style={{
        position: 'absolute',
        top: '80px',
        left: 0,
        right: 0,
        height: '3px',
        background: 'rgba(255, 255, 255, 0.12)',
        zIndex: 20
      }}>
        <div
          key={currentIndex}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #a855f7, #d4af37, #10b981)',
            backgroundSize: '200% 100%',
            animation: isPaused ? 'none' : 'slideProgress 5s linear infinite'
          }}
        />
      </div>

      <style>{`
        @keyframes auroraDrift {
          0%   { background-position: 0% 0%; opacity: 0.8; }
          50%  { opacity: 1; }
          100% { background-position: 100% 100%; opacity: 0.9; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 1; }
        }
        @keyframes floatParticles {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.5; }
          50%      { transform: translateY(-14px) scale(1.15); opacity: 1; }
        }
        @keyframes slideProgress {
          from { width: 0%; }
          to   { width: 100%; }
        }
        @keyframes kenburns {
          0%   { transform: scale(1.02); }
          100% { transform: scale(1.18); }
        }
        @keyframes posterFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50%      { transform: translateY(-10px) rotate(0.4deg); }
        }
        @keyframes shimmerFrame {
          0%   { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        @keyframes popIn {
          0%   { transform: scale(0.6) translateY(30px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes slideUpFade {
          0%   { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          0%   { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 30px 80px rgba(0,0,0,0.65), 0 0 45px rgba(212,175,55,0.18); }
          50%      { box-shadow: 0 34px 90px rgba(0,0,0,0.7), 0 0 70px rgba(212,175,55,0.42); }
        }
        @keyframes shimmerSweep {
          0%   { transform: translateX(-130%) skewX(-18deg); }
          100% { transform: translateX(230%) skewX(-18deg); }
        }
      `}</style>

      <div className="container" style={{ position: 'relative', zIndex: 5, paddingTop: compact ? '4.5rem' : '110px', paddingBottom: '40px' }}>

        {/* Poster Design Stage */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'stretch', justifyContent: 'center', flexWrap: 'wrap' }}>

          {/* Framed Poster Card */}
          <div style={{
            position: 'relative',
            width: 'min(420px, 92vw)',
            aspectRatio: '3 / 4',
            borderRadius: '18px',
            padding: '10px',
            background: 'linear-gradient(90deg, #d4af37, #f5e08c, #a855f7, #d4af37)',
            backgroundSize: '300% 100%',
            animation: 'shimmerFrame 6s linear infinite, posterFloat 5s ease-in-out infinite, glowPulse 4s ease-in-out infinite',
            flexShrink: 0
          }}>
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              borderRadius: '12px',
              overflow: 'hidden',
              background: '#000'
            }}>
              <img
                key={poster.id}
                src={poster.imageUrl}
                alt={poster.slogan || poster.prompt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  animation: 'kenburns 8s ease-in-out infinite alternate'
                }}
              />
              {/* Shimmer Sweep Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                zIndex: 3,
                background: 'linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 48%, rgba(255,255,255,0.28) 50%, transparent 68%)',
                transform: 'translateX(-130%) skewX(-18deg)',
                animation: 'shimmerSweep 4.5s ease-in-out infinite'
              }} />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, rgba(6,12,23,0.1) 0%, rgba(6,12,23,0.35) 55%, rgba(6,12,23,0.92) 100%)'
              }} />

              {/* Poster Slogan Typography */}
              <div style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                padding: '1.6rem 1.4rem',
                textAlign: 'center',
                animation: 'slideUpFade 0.6s ease-out both'
              }}>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.85), rgba(212,175,55,0.85))',
                  color: '#fff',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '0.25rem 0.7rem',
                  borderRadius: '20px',
                  marginBottom: '0.7rem',
                  animation: 'fadeIn 0.8s ease-out both'
                }}>
                  <Wand2 size={12} className="animate-pulse-slow" /> AI Generated Poster
                </span>
                <h3 style={{
                  fontSize: 'clamp(1.3rem, 2.4vw, 1.8rem)',
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: '#fff',
                  fontFamily: 'var(--font-heading)',
                  textShadow: '0 3px 14px rgba(0,0,0,0.85)',
                  fontStyle: 'italic',
                  animation: 'popIn 0.7s cubic-bezier(0.16, 1, 0.3, 1) both'
                }}>
                  "{poster.slogan || 'AI Crafted Travel Poster'}"
                </h3>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '0.8rem', fontSize: '0.7rem', color: 'var(--text-muted)', animation: 'fadeIn 1s ease-out both' }}>
                  <span style={{ background: 'rgba(6,12,23,0.7)', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
                    Style: {poster.style}
                  </span>
                  <span style={{ background: 'rgba(6,12,23,0.7)', padding: '0.2rem 0.6rem', borderRadius: '10px' }}>
                    {new Date(poster.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Poster Details Panel */}
          <div style={{
            maxWidth: '380px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '1rem',
            animation: 'slideUpFade 0.8s ease-out 0.15s both'
          }}>
            <div className="glass-card" style={{ padding: '1.6rem', border: '1px solid var(--border-gold)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                {t('hero.aiPrompt')}
              </div>
              <p style={{ color: 'var(--gold-light)', fontSize: '0.95rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{poster.prompt}"
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
              <button className="btn-gold" onClick={() => onBookTour(poster)}>
                <Sparkles size={18} />
                <span>{t('hero.bookPosterTour')}</span>
              </button>
            </div>

            {/* Poster Thumbnails — Latest 4 */}
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '0.6rem' }}>
                {t('hero.posterSelection', { count: posters.length })}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                {posters.map((p, idx) => (
                  <button
                    key={p.id}
                    onClick={() => setCurrentIndex(idx)}
                    title={p.slogan || p.prompt}
                    style={{
                      position: 'relative',
                      aspectRatio: '3 / 4',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      padding: 0,
                      border: idx === currentIndex ? '2px solid var(--gold-primary)' : '2px solid rgba(255,255,255,0.12)',
                      opacity: idx === currentIndex ? 1 : 0.55,
                      transform: idx === currentIndex ? 'scale(1.05)' : 'scale(0.96)',
                      transition: 'all 0.3s ease',
                      animation: 'fadeIn 0.5s ease-out both'
                    }}
                  >
                    <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }} />
                    {idx === currentIndex && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, transparent 55%, rgba(212,175,55,0.55) 100%)'
                      }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem', marginTop: '1.8rem', animation: 'slideUpFade 0.8s ease-out 0.3s both' }}>
          <button onClick={goPrev} style={{
            width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
            border: '1px solid var(--border-gold)', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease', transform: 'rotate(0deg)'
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.background = 'rgba(212,175,55,0.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          >
            <ChevronLeft size={22} />
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {posters.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: idx === currentIndex ? '32px' : '10px', height: '10px', borderRadius: '5px',
                  background: idx === currentIndex ? 'linear-gradient(90deg, #a855f7, #d4af37)' : 'rgba(255,255,255,0.3)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.3s ease'
                }}
              />
            ))}
          </div>
          <button onClick={goNext} style={{
            width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
            border: '1px solid var(--border-gold)', color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)',
            transition: 'all 0.3s ease', transform: 'rotate(0deg)'
          }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.12)'; e.currentTarget.style.background = 'rgba(212,175,55,0.25)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
          >
            <ChevronRight size={22} />
          </button>
        </div>

      </div>
    </section>
  );
}

export default function HeroSlider({ destinations, onSelectDestination, onViewPackage, onBookTour }) {
  const { t } = useLanguage();
  const catalogSlides = useCatalog(catalogService.getSlides) || [];
  const catalogTours = useCatalog(catalogService.getTours) || [];

  // Convert ACTIVE tour packages into featured Hero Slides.
  // Inactive / departed tours are hidden from the homepage hero slider.
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);

  const upcomingTourSlides = catalogTours
    .filter(t => {
      const departure = t.departureDate || '';
      const tourDate = departure ? new Date(`${departure}T00:00:00`) : null;
      return tourDate && !isNaN(tourDate.getTime()) ? tourDate >= todayMidnight : true;
    })
    .map((t) => {
      const dest = destinations.find(d => d.id === t.destinationId);
      return {
        id: t.id,
        name: t.title,
        tagline: t.subtitle,
        description: Array.isArray(t.included) ? t.included.slice(0, 3).join(' • ') : (t.included || ''),
        heroImage: t.image,
        bgMixImages: t.bgMixImages || [t.image],
        bgMixStyle: t.bgMixStyle || 'collage-blend',
        location: (t.mainPlaces || []).join(', ') || dest?.location || 'Thrissur Departure',
        duration: t.duration || '3 Days / 2 Nights',
        startingPrice: t.price,
        originalPrice: t.originalPrice,
        rating: t.rating || 4.95,
        reviewsCount: t.reviews || 180,
        badge: t.badge || '⚡ Upcoming Departure',
        departureDate: t.departureDate || '',
        destinationId: t.destinationId,
        fullTour: t,
        isUpcomingTour: true,
        isCompletedTour: false
      };
    });

  // Enrich each admin slide with the full destination record
  const enrichedSlides = catalogSlides.map((s) => {
    const dest = destinations.find(d => d.id === s.destinationId);
    return dest ? { ...dest, ...s, id: dest.id } : s;
  });

  // Fallback to classic featured destinations if catalog is empty
  const fallbackSlides = [
    'ayodhya-ram-mandir', 'kashi-varanasi', 'ganga-aarti', 'manikarnika-ghat',
    'annapoorneshwari-horanadu', 'munnar-tea-plantations', 'puri-jagannath',
    'konark-sun-temple', 'lingaraj-bhubaneswar', 'ooty-tea-railway',
    'parambikulam-tiger-reserve', 'thenkasi-viswanathar', 'tiruchendur-murugan',
    'gundlupet-sunflowers', 'kashmir-punjab-golden-trail'
  ]
    .map(id => destinations.find(d => d.id === id))
    .filter(Boolean);

  // Combine ALL upcoming tours + Admin Hero Slides + Destination fallback slides
  const combinedSlides = [
    ...upcomingTourSlides,
    ...enrichedSlides,
    ...fallbackSlides
  ];

  // Unique slides by ID
  const uniqueSlidesMap = new Map();
  combinedSlides.forEach(s => {
    const key = s.id || s.name;
    if (!uniqueSlidesMap.has(key)) {
      uniqueSlidesMap.set(key, s);
    }
  });
  const uniqueSlides = Array.from(uniqueSlidesMap.values());

  // Strict sorting: UPCOMING tours ALWAYS FIRST (nearest departure date first),
  // followed by featured slides, and completed/departed tours LAST.
  const allSlides = uniqueSlides.sort((a, b) => {
    const rank = (s) => {
      if (s.isUpcomingTour) return 2;
      if (s.isCompletedTour) return 0;
      return 1;
    };
    const rankA = rank(a), rankB = rank(b);
    if (rankA !== rankB) return rankB - rankA;

    // If both are upcoming tours: sort chronologically (nearest departure date FIRST)
    if (a.isUpcomingTour && b.isUpcomingTour) {
      const timeA = a.departureDate ? new Date(`${a.departureDate}T00:00:00`).getTime() : Infinity;
      const timeB = b.departureDate ? new Date(`${b.departureDate}T00:00:00`).getTime() : Infinity;
      return timeA - timeB;
    }

    const timeA = typeof a.id === 'string' && a.id.startsWith('tour-')
      ? parseInt(a.id.replace('tour-', '')) || 0
      : (a.departureDate ? new Date(a.departureDate).getTime() : 0);

    const timeB = typeof b.id === 'string' && b.id.startsWith('tour-')
      ? parseInt(b.id.replace('tour-', '')) || 0
      : (b.departureDate ? new Date(b.departureDate).getTime() : 0);

    return timeB - timeA;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % allSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [allSlides.length, isPaused]);

  const slide = allSlides[currentIndex] || allSlides[0];

  // Booking window: admin hero slides can define a booking start date.
  // Until that date arrives, booking options (Book Now / WhatsApp) stay hidden.
  const bookingStartDate = slide.bookingStartDate;
  const bookingsOpen = !bookingStartDate || new Date(`${bookingStartDate}T00:00:00`) >= todayMidnight;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + allSlides.length) % allSlides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allSlides.length);
  };

  if (!slide) return null;

  return (
    <>
      <section
        style={{
          position: 'relative',
          width: '100%',
          minHeight: '100vh',
          overflow: 'hidden',
          background: '#040810'
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Slides — with Ken Burns motion */}
        {allSlides.map((item, idx) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: idx === currentIndex ? 1 : 0,
              transition: 'opacity 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
              zIndex: 1,
            }}
          >
            {/* Ken Burns wrapper */}
            <div
              className={idx === currentIndex ? 'ken-burns' : ''}
              style={{ width: '100%', height: '100%' }}
            >
              <MixedBackground
                images={item.bgMixImages}
                fallbackImage={item.heroImage}
                style={item.bgMixStyle || 'collage-blend'}
                height="100%"
                overlayOpacity={0.25}
              />
            </div>
          </div>
        ))}

        {/* ── Volumetric light rays ──────────────────────────── */}
        <div className="light-ray" style={{ left: '20%', opacity: 0.7 }} />
        <div className="light-ray" style={{ left: '55%', opacity: 0.5 }} />
        <div className="light-ray" style={{ left: '80%', opacity: 0.4 }} />

        {/* ── Foreground atmospheric glow ───────────────────── */}
        <div
          className="hero-float"
          style={{
            position: 'absolute',
            bottom: '15%',
            left: '5%',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,158,11,0.07), transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
        <div
          className="hero-float"
          style={{
            position: 'absolute',
            top: '20%',
            right: '8%',
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)',
            filter: 'blur(40px)',
            pointerEvents: 'none',
            zIndex: 3,
            animationDelay: '-3.5s',
          }}
        />
        {/* Auto-Slide Progress Bar */}
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
              background: slide.isAIPoster
                ? 'linear-gradient(90deg, #a855f7, #d4af37)'
                : 'linear-gradient(90deg, #d4af37, #f59e0b, #f43f5e)',
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

        {/* Slide Content - Clean, image-focused layout */}
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 10,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingTop: '110px',
            paddingBottom: '130px',
          }}
        >
          <div style={{ maxWidth: '820px' }}>

            {/* Starting Point Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'rgba(6, 12, 23, 0.8)',
              border: '1px solid rgba(212, 175, 55, 0.45)',
              padding: '0.42rem 1.05rem',
              borderRadius: '30px',
              backdropFilter: 'blur(10px)',
              marginBottom: '1.2rem',
              boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
            }}>
              <MapPin size={15} color="var(--gold-primary)" />
              <span style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>

              </span>
              <span style={{ color: '#fef08a', fontSize: '0.85rem', fontWeight: 700 }}>
                {slide.location || 'Thrissur Swaraj Round'}
              </span>
            </div>

            {/* Destination / Tour Title */}
            <h1 style={{
              fontSize: 'clamp(2.4rem, 5.2vw, 4.4rem)',
              fontWeight: 800,
              color: '#ffffff',
              lineHeight: 1.15,
              marginBottom: '2.2rem',
              fontFamily: 'var(--font-heading)',
              textShadow: '0 4px 25px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,0.9)'
            }}>
              {slide.name}
            </h1>

            {/* Action Buttons: Book Now (upcoming tours) + Explore */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
              {slide.isUpcomingTour && bookingsOpen && (
                <button
                  className="btn-gold btn-cinematic"
                  data-ripple
                  data-magnetic
                  onClick={() => onBookTour(slide.fullTour || slide)}
                >
                  <Sparkles size={18} />
                  <span>{t('bookNow')}</span>
                </button>
              )}

              {!slide.isAIPoster && (
                <button
                  className={slide.isUpcomingTour ? "btn-glass btn-cinematic" : "btn-gold btn-cinematic"}
                  data-ripple
                  data-magnetic={!slide.isUpcomingTour ? "" : undefined}
                  onClick={() => {
                    const fullPkg = slide.fullTour || catalogTours.find(p => p.id === slide.id || p.destinationId === slide.destinationId || p.destinationId === slide.id);
                    if (fullPkg && onViewPackage) {
                      onViewPackage(fullPkg);
                    } else {
                      const targetDest = destinations?.find(d => d.id === slide.destinationId || d.id === slide.id) || slide;
                      onSelectDestination(targetDest);
                    }
                  }}
                >
                  <span>{t('exploreGuide')}</span>
                  <ArrowRight size={18} />
                </button>
              )}
            </div>

          </div>
        </div>

        {/* Carousel Controls */}
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
          <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600 }}>
            <span style={{ color: 'var(--gold-light)', fontSize: '1.3rem', fontWeight: 800 }}>
              0{currentIndex + 1}
            </span> / {allSlides.length < 10 ? '0' : ''}{allSlides.length}
            {slide.isAIPoster ? ' — AI Generated Poster' : ` — ${t('hero.authenticShowcase').replace('— ', '')}`}
          </div>

          {/* Controls */}
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
              {allSlides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{
                    width: idx === currentIndex ? '32px' : '10px',
                    height: '10px',
                    borderRadius: '5px',
                    background: idx === currentIndex
                      ? (s.isAIPoster ? '#a855f7' : 'var(--gold-primary)')
                      : 'rgba(255,255,255,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  title={s.isAIPoster ? `AI Poster: ${s.name}` : s.name}
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

        {/* ── Cinematic scroll indicator ─────────────────────── */}
        <div
          className="scroll-indicator"
          style={{
            position: 'absolute',
            bottom: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              width: '24px',
              height: '36px',
              border: '1.5px solid rgba(245,158,11,0.5)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'center',
              paddingTop: '5px',
            }}
          >
            <div
              className="scroll-indicator-dot"
              style={{
                width: '4px',
                height: '8px',
                borderRadius: '2px',
                background: 'rgba(245,158,11,0.8)',
                boxShadow: '0 0 8px rgba(245,158,11,0.5)',
              }}
            />
          </div>
          <p style={{
            fontSize: '0.6rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(245,158,11,0.5)',
            margin: 0,
            fontFamily: 'var(--font-body)',
          }}>
            Scroll
          </p>
        </div>
      </section>
    </>
  );
}
