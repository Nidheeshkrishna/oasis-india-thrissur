import React, { useState } from 'react';
import { 
  X, MapPin, Sun, CloudRain, Star, Clock, Compass, Calendar, 
  Sparkles, CheckCircle2, Navigation, Hotel, Utensils, Info, 
  Eye, Maximize2, ShieldCheck, Share2 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function DestinationModal({ destination, onClose, onBookTour }) {
  if (!destination) return null;

  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const position = destination.coordinates || [20.5937, 78.9629];

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
          background: '#0a1424',
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

        {/* 1. Original Hero Photograph Header */}
        <div style={{ position: 'relative', height: '420px', overflow: 'hidden' }}>
          <img
            src={destination.heroImage}
            alt={destination.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(6,12,23,0.3) 0%, rgba(6,12,23,0.85) 75%, rgba(6,12,23,1) 100%)'
          }} />

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
                <ShieldCheck size={14} /> Licensed Real Destination Photograph
              </span>
              <span className="badge-emerald">
                <MapPin size={14} /> {destination.location}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#facc15', fontSize: '0.9rem', fontWeight: 700 }}>
                <Star size={16} fill="#facc15" stroke="none" />
                <span>{destination.rating} ({destination.reviewsCount} Traveler Reviews)</span>
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
          background: 'rgba(6, 12, 23, 0.6)',
          overflowX: 'auto'
        }}>
          {[
            { id: 'overview', label: 'Overview & Highlights' },
            { id: 'gallery', label: 'Original Photo Gallery' },
            { id: 'map-weather', label: 'Map & Live Weather' },
            { id: 'guide', label: 'Travel Guide & Culture' },
            { id: 'hotels', label: 'Luxury Hotels & Dining' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === tab.id ? 'var(--gold-light)' : 'var(--text-muted)',
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
        <div style={{ padding: '2rem' }}>
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--gold-light)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                  About Destination
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  {destination.description}
                </p>

                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-main)' }}>
                  Key Highlights
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '2rem' }}>
                  {destination.highlights.map((h, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      <CheckCircle2 size={18} color="var(--emerald-accent)" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sidebar Booking Card */}
              <div className="glass-card" style={{ padding: '1.8rem', height: 'fit-content', border: '1px solid var(--border-gold)' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Signature OASIS Package
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--gold-light)', margin: '0.4rem 0 1rem' }}>
                  ₹{destination.startingPrice.toLocaleString('en-IN')}{' '}
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ traveler</span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Duration:</span>
                    <span style={{ fontWeight: 700, color: 'var(--gold-light)' }}>{destination.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Best Time to Visit:</span>
                    <span style={{ fontWeight: 700, color: 'var(--emerald-accent)' }}>{destination.bestTime}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Pickup Hub:</span>
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
                  <span>Book Tour Package</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GALLERY OF ORIGINAL IMAGES */}
          {activeTab === 'gallery' && (
            <div>
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  Click any authentic travel photo to view full resolution high-definition photography.
                </p>
                <span className="badge-gold">
                  <Eye size={14} /> Real Photography Only
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
                <h3 style={{ fontSize: '1.3rem', color: 'var(--gold-light)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                  Destination Weather
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
                      <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                        {destination.weather.temp}
                      </div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        {destination.weather.condition}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Humidity</div>
                      <div style={{ fontWeight: 700 }}>{destination.weather.humidity}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Optimal Season</div>
                      <div style={{ fontWeight: 700, color: 'var(--emerald-accent)' }}>{destination.weather.bestSeason}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Leaflet Map */}
              <div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--gold-light)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                  Interactive Map View
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
                  <span>How to Reach from Thrissur</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {destination.travelGuide.howToReach}
                </p>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--gold-primary)', fontWeight: 700, marginBottom: '0.8rem' }}>
                  <Info size={20} />
                  <span>Dress Code & Etiquette</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  {destination.travelGuide.dressCode}
                </p>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--gold-primary)', fontWeight: 700, marginBottom: '0.8rem' }}>
                  <Utensils size={20} />
                  <span>Local Cuisine Highlights</span>
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
              <h3 style={{ fontSize: '1.3rem', color: 'var(--gold-light)', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                Handpicked Accommodations & Stays
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
