import React, { useState } from 'react';
import {
  X, MapPin, Star, Clock, Sparkles, CheckCircle2, Compass, ShieldCheck,
  Camera, Layers, Eye, Maximize2, Package as PackageIcon, MessageCircle, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { getWhatsAppNumber, buildQuickEnquiryMessage } from '../services/whatsapp';
import MixedBackground from './MixedBackground';
import RouteMapVisualizer from './RouteMapVisualizer';

export default function PackageModal({ pkg, onClose, onBookTour }) {
  const { t } = useLanguage();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [activeImg, setActiveImg] = useState({});
  const [activeHl, setActiveHl] = useState({});

  if (!pkg) return null;

  const mainPlacesList = Array.isArray(pkg.mainPlaces)
    ? pkg.mainPlaces
    : typeof pkg.mainPlaces === 'string'
      ? pkg.mainPlaces.split(',').map(s => s.trim()).filter(Boolean)
      : [];

  const includedList = Array.isArray(pkg.included)
    ? pkg.included
    : typeof pkg.included === 'string'
      ? pkg.included.split('\n').map(s => s.trim()).filter(Boolean)
      : [];

  const itineraryList = Array.isArray(pkg.itinerary) ? pkg.itinerary : [];

  const punjabList = Array.isArray(pkg.punjabHighlights)
    ? pkg.punjabHighlights
    : typeof pkg.punjabHighlights === 'string'
      ? pkg.punjabHighlights.split(',').map(s => s.trim()).filter(Boolean)
      : [];

  const sightseeingList = Array.isArray(pkg.sightseeing) ? pkg.sightseeing : [];
  const highlightsList = Array.isArray(pkg.highlights) ? pkg.highlights : [];

  // Compile full sightseeing list with rich details
  const sightseeingItems = (pkg.placeImages && pkg.placeImages.length > 0)
    ? pkg.placeImages.map((img, idx) => ({
        id: `sight-${idx}-${img.name}`,
        name: img.name || img.place || img.title || `Place ${idx + 1}`,
        title: img.title || img.name || 'Sightseeing Attraction',
        url: img.url,
        group: img.group || 'Sightseeing',
        description: img.description || `Explore ${img.name || img.title} on this exclusive OASIS tour with dedicated Malayali escort, comfortable transport & authentic local sightseeing.`
      }))
    : mainPlacesList.map((place, idx) => ({
        id: `main-${idx}`,
        name: place,
        title: `${place} Sightseeing & Darshan`,
        url: pkg.image || (pkg.bgMixImages && pkg.bgMixImages[idx % pkg.bgMixImages.length]) || '',
        group: 'Main Attraction',
        description: `Explore the major cultural, scenic and spiritual highlights of ${place} with OASIS Thrissur.`
      }));

  const [activeSightseeing, setActiveSightseeing] = useState(sightseeingItems[0] || null);

  const getEmbedUrl = (url) => {
    if (!url) return null;
    const m = String(url).match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([\w-]{6,})/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : null;
  };

  // Determine if tour is upcoming or start date has passed
  const isUpcoming = (() => {
    if (!pkg?.departureDate) return true;
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

  // Main feature image to show in the hero
  const currentHeroImage = activeSightseeing?.url || pkg.image;

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

        {/* 1. Main Hero Image Header (Displays active place image or main package image) */}
        <div style={{ position: 'relative', height: '380px', overflow: 'hidden' }}>
          <img
            src={currentHeroImage}
            alt={pkg.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              transition: 'all 0.5s ease'
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(6,12,23,0.95) 0%, rgba(6,12,23,0.5) 50%, rgba(6,12,23,0.2) 100%)'
          }} />

          {/* Hero Overlay Details */}
          <div style={{ position: 'absolute', bottom: '2rem', left: '2rem', right: '2rem', zIndex: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
              <span className="badge-gold">
                <ShieldCheck size={14} /> {t('package.signatureBadge')}
              </span>
              <span className="badge-emerald">
                <Clock size={14} /> {pkg.duration}
              </span>
              {activeSightseeing && (
                <span style={{
                  background: 'rgba(212,175,55,0.25)',
                  border: '1px solid var(--border-gold)',
                  color: '#fef08a',
                  fontWeight: 800,
                  fontSize: '0.78rem',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '16px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <Camera size={13} /> {activeSightseeing.name}
                </span>
              )}
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

        <div style={{ padding: '2rem' }}>

          {/* Price & Badge Header */}
          <div className="glass-card" style={{
            padding: '1.6rem',
            border: '1px solid var(--border-gold)',
            marginBottom: '2rem',
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
                padding: '0.35rem 0.9rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--gold-deep)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                <PackageIcon size={13} /> {pkg.badge}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.8rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Destinations:
                </span>
                {mainPlacesList.map((place, idx) => (
                  <span key={idx} style={{
                    background: 'rgba(212,175,55,0.12)',
                    border: '1px solid var(--border-gold)',
                    color: 'var(--gold-deep)',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    padding: '0.3rem 0.8rem',
                    borderRadius: '20px'
                  }}>
                    <MapPin size={11} style={{ verticalAlign: '-1px', marginRight: '3px' }} />
                    {place}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--gold-deep)' }}>
                ₹{pkg.price ? pkg.price.toLocaleString('en-IN') : '0'}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('package.perTraveler')}</div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* 🗺️ INTERACTIVE SIGHTSEEING HORIZONTAL LIST & SPOTLIGHT */}
          {/* ======================================================== */}
          {sightseeingItems.length > 0 && (
            <div style={{ marginBottom: '2.2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.9rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h4 style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--gold-deep)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  margin: 0
                }}>
                  <Camera size={20} /> Sightseeing Places (Click to Explore)
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--gold-light)', fontWeight: 600 }}>
                  {sightseeingItems.length} Key Locations Included
                </span>
              </div>

              {/* Horizontal Scrollable List */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                overflowX: 'auto',
                paddingBottom: '0.8rem',
                scrollbarWidth: 'thin'
              }}>
                {sightseeingItems.map((item, idx) => {
                  const isSelected = activeSightseeing?.id === item.id;
                  return (
                    <div
                      key={item.id || idx}
                      onClick={() => setActiveSightseeing(item)}
                      style={{
                        flex: '0 0 240px',
                        cursor: 'pointer',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        position: 'relative',
                        border: isSelected ? '2px solid #fbbf24' : '1px solid var(--border-gold)',
                        boxShadow: isSelected ? '0 0 20px rgba(251,191,36,0.35)' : '0 4px 12px rgba(0,0,0,0.3)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: '#0a1628',
                        transform: isSelected ? 'scale(1.02)' : 'scale(1.0)'
                      }}
                    >
                      <div style={{ position: 'relative', height: '140px' }}>
                        <img
                          src={item.url}
                          alt={item.name}
                          loading="lazy"
                          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(6,12,23,0.9) 0%, rgba(6,12,23,0.2) 60%, transparent 100%)'
                        }} />

                        {isSelected && (
                          <span style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            background: '#fbbf24',
                            color: '#000',
                            fontWeight: 800,
                            fontSize: '0.68rem',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '10px'
                          }}>
                            ✓ Viewing
                          </span>
                        )}

                        <div style={{
                          position: 'absolute',
                          bottom: '0.5rem',
                          left: '0.7rem',
                          right: '0.7rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}>
                          <MapPin size={13} color="var(--gold-light)" style={{ flexShrink: 0 }} />
                          <span style={{
                            fontWeight: 800,
                            fontSize: '0.88rem',
                            color: '#fff',
                            textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {item.name}
                          </span>
                        </div>
                      </div>

                      <div style={{
                        padding: '0.6rem 0.8rem',
                        background: isSelected ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderTop: isSelected ? '1px solid rgba(251,191,36,0.3)' : '1px solid rgba(255,255,255,0.05)'
                      }}>
                        <span style={{ fontSize: '0.72rem', color: isSelected ? '#fef08a' : 'var(--text-muted)', fontWeight: 600 }}>
                          {item.group || 'Explore'}
                        </span>
                        <ChevronRight size={14} color={isSelected ? '#fbbf24' : 'var(--text-muted)'} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Selected Sightseeing Detail Card */}
              {activeSightseeing && (
                <div className="glass-card" style={{
                  marginTop: '1.2rem',
                  padding: '1.5rem',
                  border: '1px solid var(--border-gold)',
                  background: 'linear-gradient(135deg, rgba(10,22,40,0.9), rgba(6,12,23,0.95))',
                  borderRadius: '16px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
                    
                    {/* Place Photo (Click to zoom) */}
                    <div
                      style={{
                        position: 'relative',
                        height: '240px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        border: '1px solid var(--border-gold)',
                        cursor: 'pointer'
                      }}
                      onClick={() => setSelectedPhoto(activeSightseeing.url)}
                      title="Click to view full screen"
                    >
                      <img
                        src={activeSightseeing.url}
                        alt={activeSightseeing.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                      />
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(6,12,23,0.85) 0%, transparent 60%)',
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        padding: '0.8rem'
                      }}>
                        <span style={{ fontSize: '0.78rem', color: '#fef08a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Camera size={14} /> {activeSightseeing.name}
                        </span>
                        <span style={{ background: 'rgba(0,0,0,0.6)', padding: '0.3rem 0.6rem', borderRadius: '8px', fontSize: '0.75rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Maximize2 size={12} /> Expand
                        </span>
                      </div>
                    </div>

                    {/* Place Details Text */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                        <span style={{
                          background: 'rgba(212,175,55,0.18)',
                          border: '1px solid var(--border-gold)',
                          color: '#fef08a',
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          padding: '0.25rem 0.7rem',
                          borderRadius: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem'
                        }}>
                          <MapPin size={12} /> {activeSightseeing.name}
                        </span>
                        <span style={{
                          background: 'rgba(16,185,129,0.15)',
                          border: '1px solid rgba(16,185,129,0.4)',
                          color: '#6ee7b7',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '0.25rem 0.7rem',
                          borderRadius: '12px'
                        }}>
                          ✓ Included in Itinerary
                        </span>
                      </div>

                      <h3 style={{
                        fontSize: '1.45rem',
                        fontWeight: 800,
                        color: '#ffffff',
                        fontFamily: 'var(--font-heading)',
                        lineHeight: 1.25,
                        margin: 0
                      }}>
                        {activeSightseeing.title}
                      </h3>

                      <p style={{
                        color: 'rgba(255,255,255,0.85)',
                        fontSize: '0.96rem',
                        lineHeight: 1.65,
                        margin: 0
                      }}>
                        {activeSightseeing.description}
                      </p>

                      {isUpcoming && (
                        <div style={{ paddingTop: '0.5rem', display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                          <button
                            className="btn-gold"
                            style={{ padding: '0.55rem 1.2rem', fontSize: '0.85rem' }}
                            onClick={() => { onClose(); onBookTour(pkg); }}
                          >
                            <Sparkles size={15} /> Book Tour to Visit {activeSightseeing.name}
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}
            </div>
          )}

          {/* Punjab Highlights (if present) */}
          {punjabList.length > 0 && (
            <div style={{ marginBottom: '1.8rem' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <Sparkles size={18} /> Punjab Highlights
              </h4>
              <div className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {punjabList.map((h, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.92rem', color: 'var(--text-main)' }}>
                    <Sparkles size={16} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Included */}
          {includedList.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <CheckCircle2 size={18} /> {t('package.included')}
              </h4>
              <div className="glass-card" style={{ padding: '1.4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.7rem' }}>
                {includedList.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={18} color="var(--emerald-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sightseeing custom image gallery (if configured) */}
          {sightseeingList.length > 0 && (
            <div style={{ marginBottom: '1.8rem' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <Camera size={18} /> Additional Sightseeing Guides
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {sightseeingList.map((s, idx) => {
                  const imgList = (Array.isArray(s.images) && s.images.length) ? s.images : (s.image ? [s.image] : []);
                  const mainImg = activeImg[idx] || imgList[0] || '';
                  return (
                    <div key={idx} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 260px', minWidth: '240px', maxWidth: '100%' }}>
                          {mainImg ? (
                            <>
                              <img src={mainImg} alt={s.name || 'Sightseeing'} style={{ width: '100%', height: '220px', objectFit: 'cover', display: 'block' }} />
                              {imgList.length > 1 && (
                                <div style={{ display: 'flex', gap: '0.35rem', padding: '0.5rem', background: 'rgba(0,0,0,0.25)', overflowX: 'auto' }}>
                                  {imgList.map((u, ui) => (
                                    <div
                                      key={ui}
                                      onClick={() => setActiveImg(prev => ({ ...prev, [idx]: u }))}
                                      style={{
                                        width: '58px', height: '44px', borderRadius: '6px', overflow: 'hidden',
                                        cursor: 'pointer', flexShrink: 0,
                                        border: mainImg === u ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.15)'
                                      }}
                                    >
                                      <img src={u} alt={`${s.name || 'Sightseeing'} ${ui + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          ) : (
                            <div style={{ width: '100%', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', fontSize: '0.85rem' }}>
                              <MapPin size={18} style={{ marginRight: '6px' }} /> {s.name || 'Sightseeing'}
                            </div>
                          )}
                        </div>
                        <div style={{ flex: '2 1 320px', padding: '1.2rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                          {s.name && (
                            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Camera size={17} color="var(--gold-primary)" style={{ flexShrink: 0 }} /> {s.name}
                              </span>
                              {s.location && (
                                <span style={{
                                  background: 'rgba(212,175,55,0.15)',
                                  border: '1px solid var(--border-gold)',
                                  color: '#fef08a',
                                  fontSize: '0.72rem',
                                  fontWeight: 800,
                                  padding: '0.2rem 0.55rem',
                                  borderRadius: '12px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.25rem'
                                }}>
                                  <MapPin size={11} /> {s.location}
                                </span>
                              )}
                            </div>
                          )}
                          {s.text && (
                            <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.65, color: 'var(--text-main)' }}>{s.text}</p>
                          )}
                          {getEmbedUrl(s.video) && (
                            <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-gold)', aspectRatio: '16 / 9' }}>
                              <iframe
                                src={getEmbedUrl(s.video)}
                                title={s.name || 'Sightseeing video'}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                style={{ width: '100%', height: '100%', display: 'block' }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Highlights Gallery */}
          {highlightsList.length > 0 && (
            <div style={{ marginBottom: '1.8rem' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <Layers size={18} /> {t('package.highlights')}
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                {highlightsList.map((h, idx) => {
                  const imgList = (Array.isArray(h.images) && h.images.length) ? h.images : (h.image ? [h.image] : []);
                  const mainImg = activeHl[idx] || imgList[0] || '';
                  return (
                    <div key={idx} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                      <div style={{ position: 'relative' }}>
                        {mainImg ? (
                          <>
                            <img src={mainImg} alt={h.title || 'Highlight'} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                            {imgList.length > 1 && (
                              <div style={{ display: 'flex', gap: '0.35rem', padding: '0.5rem', background: 'rgba(0,0,0,0.35)', overflowX: 'auto' }}>
                                {imgList.map((u, ui) => (
                                  <div
                                    key={ui}
                                    onClick={() => setActiveHl(prev => ({ ...prev, [idx]: u }))}
                                    style={{
                                      width: '56px', height: '42px', borderRadius: '6px', overflow: 'hidden',
                                      cursor: 'pointer', flexShrink: 0,
                                      border: mainImg === u ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.2)'
                                    }}
                                  >
                                    <img src={u} alt={`${h.title || 'Highlight'} ${ui + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  </div>
                                ))}
                              </div>
                            )}
                          </>
                        ) : (
                          <div style={{ width: '100%', height: '175px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', fontSize: '0.85rem' }}>No image</div>
                        )}
                        {h.location && (
                          <span style={{
                            position: 'absolute', top: '0.5rem', left: '0.5rem', zIndex: 10,
                            background: 'rgba(6,12,23,0.85)',
                            border: '1px solid var(--border-gold)',
                            color: '#fef08a',
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '0.2rem 0.55rem',
                            borderRadius: '12px'
                          }}>
                            📍 {h.location}
                          </span>
                        )}
                        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '2.2rem 0.9rem 0.8rem', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', fontWeight: 800, fontSize: '0.95rem', color: '#fff' }}>
                          {h.title}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Itinerary */}
          {itineraryList.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                <Compass size={18} /> {t('package.itinerary')}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {itineraryList.map((day, idx) => (
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
                      {t('package.day')} {day.day || idx + 1}
                    </div>
                    <div className="glass-card" style={{ flex: 1, padding: '0.9rem 1.1rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>{day.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{day.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interactive Route & Pickup Map - Hidden per user directive */}

          {/* Action Buttons: Book Now (Only for Upcoming Tours) & WhatsApp Enquiry */}
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {isUpcoming ? (
              <button className="btn-gold" style={{ padding: '0.8rem 1.8rem' }} onClick={() => { onClose(); onBookTour(pkg); }}>
                <Sparkles size={18} /> {t('package.book')}
              </button>
            ) : (
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '10px',
                padding: '0.65rem 1.2rem',
                fontSize: '0.84rem',
                color: '#fef08a',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem'
              }}>
                <span>🚩 This tour departed on {pkg.departureDate}. Enquire below for upcoming batch dates!</span>
              </div>
            )}
            <a
              className="btn-glass"
              href={`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(buildQuickEnquiryMessage(pkg))}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: '0.8rem 1.8rem', textDecoration: 'none', border: '1px solid rgba(37,211,102,0.5)', color: '#4ade80' }}
            >
              <MessageCircle size={18} /> WhatsApp Enquiry
            </a>
            <button className="btn-glass" style={{ padding: '0.8rem 1.8rem' }} onClick={onClose}>
              {t('package.browse')}
            </button>
          </div>

        </div>

        {/* Lightbox for full screen photo inspection */}
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
