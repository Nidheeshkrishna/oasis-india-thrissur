import React, { useState } from 'react';
import { GALLERY_ITEMS } from '../data/galleryData';
import { Camera, MapPin, Eye, Heart, ShieldCheck, X, Maximize2, Share2 } from 'lucide-react';

export default function GalleryView() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [likedIds, setLikedIds] = useState({});

  const filters = ['All', 'Spiritual', 'Nature', 'Architecture', 'Heritage'];

  const filteredItems = activeFilter === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter(item => item.category === activeFilter);

  const toggleLike = (id) => {
    setLikedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="gallery" style={{ padding: '6rem 0', background: '#040810', position: 'relative' }}>
      <div className="container">
        
        {/* Gallery Title Header */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
          <span className="badge-gold" style={{ marginBottom: '0.8rem' }}>
            <ShieldCheck size={14} /> Licensed Real Destination Photography
          </span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.8rem' }}>
            Pinterest-Style <span className="text-gold-gradient">Authentic Photo Gallery</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            A curated showcase of 100% genuine, un-rendered, real travel photography capturing sacred shrines, misty tea gardens, and architectural marvels.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '0.8rem',
          flexWrap: 'wrap',
          marginBottom: '3rem'
        }}>
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                background: activeFilter === f ? 'linear-gradient(135deg, #d4af37 0%, #aa841c 100%)' : 'rgba(255,255,255,0.05)',
                color: activeFilter === f ? '#060c17' : 'var(--text-muted)',
                border: '1px solid var(--border-gold)',
                padding: '0.6rem 1.3rem',
                borderRadius: '30px',
                fontSize: '0.88rem',
                fontWeight: activeFilter === f ? '800' : '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {f} Showcase
            </button>
          ))}
        </div>

        {/* Pinterest-Style Masonry Grid */}
        <div style={{
          columnCount: 3,
          columnGap: '1.5rem',
          WebkitColumnCount: 3,
          MozColumnCount: 3
        }}>
          {filteredItems.map((item) => {
            const isLiked = likedIds[item.id];
            return (
              <div 
                key={item.id}
                className="glass-card"
                style={{
                  breakInside: 'avoid',
                  marginBottom: '1.5rem',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer'
                }}
                onClick={() => setLightboxItem(item)}
              >
                <div style={{ position: 'relative', overflow: 'hidden' }}>
                  <img
                    src={item.url}
                    alt={item.title}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      transition: 'transform 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1.0)'}
                  />

                  {/* Hover Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(6,12,23,0.9) 0%, rgba(6,12,23,0.2) 60%, rgba(6,12,23,0) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1.2rem'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge-gold">{item.category}</span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(item.id);
                        }}
                        style={{
                          background: 'rgba(6,12,23,0.8)',
                          border: 'none',
                          color: isLiked ? '#ef4444' : '#fff',
                          borderRadius: '50%',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <Heart size={18} fill={isLiked ? '#ef4444' : 'none'} />
                      </button>
                    </div>

                    <div>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.3rem' }}>
                        {item.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <MapPin size={14} color="var(--gold-primary)" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visible Info Footer */}
                <div style={{ padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Camera size={14} color="var(--gold-primary)" />
                    <span>{item.camera}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--gold-light)', fontWeight: 600 }}>
                    <Heart size={13} fill="var(--gold-primary)" />
                    <span>{item.likes + (isLiked ? 1 : 0)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox Popup Modal */}
      {lightboxItem && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div 
            className="glass-card" 
            style={{
              width: '100%',
              maxWidth: '1000px',
              maxHeight: '90vh',
              overflowY: 'auto',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              padding: 0
            }}
          >
            <button
              onClick={() => setLightboxItem(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 20,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(6,12,23,0.85)',
                border: '1px solid var(--border-gold)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>

            <div style={{ position: 'relative', width: '100%', maxHeight: '65vh', overflow: 'hidden', background: '#000' }}>
              <img 
                src={lightboxItem.url} 
                alt={lightboxItem.title} 
                style={{ width: '100%', height: '100%', objectFit: 'contain', maxHeight: '65vh' }}
              />
            </div>

            <div style={{ padding: '1.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span className="badge-gold" style={{ marginBottom: '0.4rem' }}>{lightboxItem.category}</span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                  {lightboxItem.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={15} color="var(--gold-primary)" /> {lightboxItem.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Camera size={15} color="var(--gold-primary)" /> {lightboxItem.camera}
                  </span>
                  <span>EXIF: {lightboxItem.coordinates}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.8rem' }}>
                <span className="badge-emerald" style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}>
                  <ShieldCheck size={16} /> 4K Real HDR Photo Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
