import React, { useState } from 'react';
import {
  X, MapPin, Sun, Star, Clock, Compass,
  Sparkles, CheckCircle2, Navigation, Hotel, Utensils, Info, 
  Eye, Maximize2, ShieldCheck, Package as PackageIcon,
  Camera, Layers, MessageCircle
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { catalogService } from '../services/catalog';
import { getWhatsAppNumber, buildQuickEnquiryMessage } from '../services/whatsapp';
import { useCatalog } from '../hooks/useCatalog';
import { useLanguage } from '../i18n/LanguageContext';
import MixedBackground from './MixedBackground';

export default function DestinationModal({ destination, onClose, onBookTour }) {
  const { t } = useLanguage();
  const packages = useCatalog(catalogService.getTours);
  const matchingPackage = destination ? (packages.find(p => p.destinationId === destination.id) || null) : null;
  const [activeTab, setActiveTab] = useState(matchingPackage ? 'package' : 'overview');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  if (!destination) return null;

  const position = destination.coordinates || [20.5937, 78.9629];

  const tabItems = [
    ...(matchingPackage ? [{ id: 'package', label: t('destination.packageDetails') }] : []),
    { id: 'overview', label: t('destination.overview') },
    { id: 'gallery', label: t('destination.gallery') },
    { id: 'map-weather', label: t('destination.mapWeather') },
    { id: 'guide', label: t('destination.guide') },
    { id: 'hotels', label: t('destination.hotels') }
  ];

  const sideSeenImages = matchingPackage?.placeImages?.filter(img => img.group === 'kashmir') || [];
  const punjabImages = matchingPackage?.placeImages?.filter(img => img.group === 'punjab') || [];

  return (
    <div className="modal-overlay" style={{ zIndex: 1000, overflowY: 'auto' }}>
      <div 
        className="glass-card" 
        style={{
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '92vh',
          overflowY: 'auto',
          margin: '2rem auto',
          position: 'relative',
          padding: 0,
          background: 'linear-gradient(180deg, #0a1628 0%, #060c17 100%)',
          border: '1px solid var(--border-gold)'
        }}
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

        {/* 1. Original Hero Photograph Header with Mixed Background */}
        <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
          <MixedBackground
            images={destination.bgMixImages}
            fallbackImage={destination.heroImage}
            style={destination.bgMixStyle || 'collage-blend'}
            height="100%"
            overlayOpacity={0.6}
          />

          {/* Hero Overlay Details */}
          <div style={{
            position: 'absolute',
            bottom: '2rem',
            left: '2rem',
            right: '2rem',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
              <span className="badge-gold">
                <ShieldCheck size={14} /> {t('destination.licensedPhoto')}
              </span>
              <span className="badge-emerald">
                <MapPin size={14} /> {destination.location}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#facc15', fontSize: '0.9rem', fontWeight: 700 }}>
                <Star size={16} fill="#facc15" stroke="none" />
                <span>{destination.rating} ({destination.reviewsCount} {t('destination.travelerReviews')})</span>
              </div>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, fontFamily: 'var(--font-heading)', lineHeight: 1.15, marginBottom: '0.5rem' }}>
              {destination.name}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--gold-light)', fontStyle: 'italic' }}>
              "{destination.tagline}"
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{
          borderBottom: '1px solid var(--border-subtle)',
          padding: '0 2rem',
          display: 'flex',
          gap: '1.5rem',
          background: 'rgba(6, 12, 23, 0.85)',
          overflowX: 'auto'
        }}>
          {tabItems.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab.id ? 'var(--gold-light)' : 'rgba(255,255,255,0.7)',
                fontSize: '0.95rem',
                fontWeight: activeTab === tab.id ? '700' : '500',
                padding: '1rem 0.5rem',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '3px solid var(--gold-primary)' : '3px solid transparent',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div style={{ padding: '2rem', background: 'rgba(6,12,23,0.6)' }}>
          
          {/* TAB 0: TOUR PACKAGE DETAILS */}
          {activeTab === 'package' && matchingPackage && (
            <div>
              {/* Package Header Card */}
              <div className="glass-card" style={{
                padding: '1.8rem',
                border: '1px solid var(--border-gold)',
                marginBottom: '1.5rem',
                background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(168,85,247,0.08))'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <span className="badge-gold" style={{ marginBottom: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <PackageIcon size={14} /> {t('destination.packageName')}
                    </span>
                    <h3 style={{ fontSize: '1.7rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: '0.4rem 0 0.3rem' }}>
                      {matchingPackage.title}
                    </h3>
                    <p style={{ color: 'var(--gold-deep)', fontSize: '0.95rem', fontStyle: 'italic' }}>
                      "{matchingPackage.subtitle}"
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      background: '#10b981', color: '#000', fontWeight: 800, fontSize: '0.75rem',
                      padding: '0.3rem 0.7rem', borderRadius: '12px', display: 'inline-block', marginBottom: '0.5rem'
                    }}>
                      {matchingPackage.badge}
                    </span>
                    <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--gold-deep)' }}>
                      ₹{matchingPackage.price.toLocaleString('en-IN')}{' '}
                      <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                        ₹{matchingPackage.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: '0.4rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={15} color="var(--gold-primary)" /> {matchingPackage.duration}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#facc15' }}>
                        <Star size={15} fill="#facc15" stroke="none" /> {matchingPackage.rating} ({matchingPackage.reviews})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* MAIN PLACES */}
              {matchingPackage.mainPlaces && matchingPackage.mainPlaces.length > 0 && (
                <div style={{ marginBottom: '1.8rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                    <MapPin size={18} /> {t('destination.mainPlaces')}
                  </h4>
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                    {matchingPackage.mainPlaces.map((place, idx) => (
                      <span key={idx} style={{
                        background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
                        border: '1px solid var(--border-gold)',
                        color: 'var(--gold-deep)',
                        padding: '0.5rem 1.2rem',
                        borderRadius: '30px',
                        fontSize: '0.9rem',
                        fontWeight: 700
                      }}>
                        <MapPin size={13} style={{ verticalAlign: '-2px', marginRight: '4px' }} />
                        {place}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SIDE SEEN — KASHMIR VALLEY */}
              {sideSeenImages.length > 0 && (
                <div style={{ marginBottom: '1.8rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                    <Camera size={18} /> {t('destination.sideSeen')}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
                    {sideSeenImages.map((img, idx) => (
                      <div key={idx} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border-gold)' }}
                        onClick={() => setSelectedPhoto(img.url)}>
                        <img src={img.url} alt={img.name} loading="lazy" style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'} />
                        <div style={{
                          position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,12,23,0.92), rgba(6,12,23,0.15))',
                          display: 'flex', alignItems: 'flex-end', padding: '0.6rem', fontSize: '0.8rem', fontWeight: 700, color: '#fff'
                        }}>
                          {img.name}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PUNJAB HIGHLIGHTS */}
              {punjabImages.length > 0 && (
                <div style={{ marginBottom: '1.8rem' }}>
                  <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                    <Layers size={18} /> {t('destination.punjabHighlights')}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                    {punjabImages.map((img, idx) => (
                      <div key={idx} style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
                        <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setSelectedPhoto(img.url)}>
                          <img src={img.url} alt={img.name} loading="lazy" style={{ width: '100%', height: '150px', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'} />
                          <div style={{
                            position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,12,23,0.9), rgba(6,12,23,0.1))',
                            display: 'flex', alignItems: 'flex-end', padding: '0.7rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--gold-light)'
                          }}>
                            {img.name}
                          </div>
                        </div>
                        {matchingPackage.punjabHighlights && matchingPackage.punjabHighlights[idx] && (
                          <div style={{ padding: '0.7rem 0.8rem', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.45, borderTop: '1px solid var(--border-subtle)' }}>
                            {matchingPackage.punjabHighlights[idx]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {matchingPackage.punjabHighlights && matchingPackage.punjabHighlights.length > punjabImages.length && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
                      {matchingPackage.punjabHighlights.slice(punjabImages.length).map((h, idx) => (
                        <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                          <Sparkles size={16} color="var(--gold-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* PACKAGE INCLUDED */}
              <div style={{ marginBottom: '1.8rem' }}>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                  <CheckCircle2 size={18} /> {t('destination.packageIncluded')}
                </h4>
                <div className="glass-card" style={{ padding: '1.4rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.7rem' }}>
                  {matchingPackage.included.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      <CheckCircle2 size={18} color="var(--emerald-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ITINERARY */}
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem' }}>
                  <Compass size={18} /> {t('destination.itinerary')}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {matchingPackage.itinerary.map((day, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ flexShrink: 0, width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--gold-deep)', fontSize: '0.8rem' }}>
                        {t('destination.day')} {day.day}
                      </div>
                      <div className="glass-card" style={{ flex: 1, padding: '0.9rem 1.1rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.3rem' }}>{day.title}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5 }}>{day.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '1.8rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn-gold" style={{ padding: '0.7rem 1.5rem' }} onClick={() => { onClose(); onBookTour(matchingPackage); }}>
                  <Sparkles size={18} /> {t('destination.bookThisPackage')}
                </button>
                <a
                  className="btn-glass"
                  href={`https://wa.me/${getWhatsAppNumber()}?text=${encodeURIComponent(buildQuickEnquiryMessage(matchingPackage || destination))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ padding: '0.7rem 1.5rem', textDecoration: 'none', border: '1px solid rgba(37,211,102,0.5)', color: '#4ade80' }}
                >
                  <MessageCircle size={18} /> WhatsApp Enquiry
                </a>
              </div>
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--gold-deep)', marginBottom: '1rem', fontFamily: 'var(--font-heading)', textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
                  {t('destination.aboutDestination')}
                </h3>
                <p style={{ color: '#e2e8f0', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {destination.description}
                </p>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: '#ffffff' }}>
                  {t('destination.keyHighlights')}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                  {destination.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#e2e8f0', fontSize: '0.95rem' }}>
                      <CheckCircle2 size={18} color="var(--emerald-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Booking Card */}
              <div className="glass-card" style={{ padding: '1.8rem', height: 'fit-content', border: '1px solid var(--border-gold)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                  {t('destination.signaturePackage')}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-deep)', margin: '0.4rem 0 1rem' }}>
                  ₹{destination.startingPrice.toLocaleString('en-IN')}{' '}
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{t('destination.perTraveler')}</span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{t('destination.duration')}</span>
                    <span style={{ fontWeight: 700, color: 'var(--gold-deep)' }}>{destination.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{t('destination.bestTime')}</span>
                    <span style={{ fontWeight: 700, color: 'var(--emerald-accent)' }}>{destination.bestTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>{t('destination.pickupHub')}</span>
                    <span style={{ fontWeight: 700 }}>Thrissur Swaraj Round</span>
                  </div>
                </div>

                <button 
                  className="btn-gold" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => {
                    onClose();
                    onBookTour(destination);
                  }}
                >
                  <Sparkles size={18} />
                  <span>{t('destination.bookTourPackage')}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GALLERY OF ORIGINAL IMAGES */}
          {activeTab === 'gallery' && (
            <div>
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  {t('destination.galleryHint')}
                </p>
                <span className="badge-gold">
                  <Eye size={14} /> {t('destination.realPhotos')}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.2rem' }}>
                {destination.galleryImages.map((imgUrl, idx) => (
                  <div 
                    key={idx} 
                    style={{ position: 'relative', height: '200px', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer' }}
                    onClick={() => setSelectedPhoto(imgUrl)}
                  >
                    <img 
                      src={imgUrl} 
                      alt={`${destination.name} photo ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                    />
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0,0,0,0.3)',
                      opacity: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'opacity 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                    onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                    >
                      <Maximize2 size={24} color="#fff" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: MAP & LIVE WEATHER */}
          {activeTab === 'map-weather' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              
              {/* Weather Widget */}
              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--gold-deep)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                  {t('destination.weatherTitle')}
                </h3>
                <div className="glass-card" style={{ padding: '1.5rem', border: '1px solid var(--border-gold)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: 'rgba(212,175,55,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--gold-primary)'
                    }}>
                      <Sun size={34} />
                    </div>
                    <div>
                      <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--gold-deep)' }}>
                        {destination.weather.temp}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        {destination.weather.condition}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{t('destination.humidity')}</div>
                      <div style={{ fontWeight: 700 }}>{destination.weather.humidity}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{t('destination.optimalSeason')}</div>
                      <div style={{ fontWeight: 700, color: 'var(--emerald-accent)' }}>{destination.weather.bestSeason}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Leaflet Map */}
              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--gold-deep)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                  {t('destination.mapTitle')}
                </h3>
                <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
                  <MapContainer center={position} zoom={11} scrollWheelZoom={false} style={{ height: '280px', width: '100%' }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                      <Popup>
                        <strong>{destination.name}</strong><br />
                        {destination.location}
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </div>

            </div>
          )}

          {/* TAB 4: TRAVEL GUIDE */}
          {activeTab === 'guide' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--gold-primary)', fontWeight: 700, marginBottom: '0.8rem' }}>
                  <Navigation size={20} />
                  <span>{t('destination.howToReach')}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {destination.travelGuide.howToReach}
                </p>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--gold-primary)', fontWeight: 700, marginBottom: '0.8rem' }}>
                  <Info size={20} />
                  <span>{t('destination.dressCode')}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {destination.travelGuide.dressCode}
                </p>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--gold-primary)', fontWeight: 700, marginBottom: '0.8rem' }}>
                  <Utensils size={20} />
                  <span>{t('destination.localCuisine')}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {destination.travelGuide.localCuisine}
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: HOTELS & DINING */}
          {activeTab === 'hotels' && (
            <div>
              <h3 style={{ fontSize: '1.3rem', color: 'var(--gold-deep)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                {t('destination.accommodations')}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
                {destination.hotels.map((h, i) => (
                  <div key={i} className="glass-card" style={{ padding: '1.2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--gold-primary)' }}>
                      <Hotel size={18} />
                      <span style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase' }}>{h.rating}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.2rem' }}>{h.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{h.location}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Lightbox Modal for Gallery Photo View */}
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
