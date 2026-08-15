import React, { useState } from 'react';
import { Calendar, MapPin, Users, Search, Sparkles, Navigation, Layers, ChevronDown } from 'lucide-react';
import { DESTINATIONS } from '../data/destinationsData';
import { catalogService } from '../services/catalog';
import { useCatalog } from '../hooks/useCatalog';
import { useLanguage } from '../i18n/LanguageContext';
import PickupPointsMap, { MAJOR_PICKUP_POINTS } from './PickupPointsMap';

const QUICK_SUGGESTIONS = ['Kashi & Varanasi', 'Kashmir Paradise', 'Munnar & Ooty', 'Puri Jagannath'];

export default function TripPlanner({ onBook }) {
  const { t } = useLanguage();
  const destinations = useCatalog(catalogService.getDestinations) || DESTINATIONS;
  const [destinationId, setDestinationId] = useState(destinations[0]?.id || 'ooty-nilgiri-hills');
  const [selectedPickup, setSelectedPickup] = useState(MAJOR_PICKUP_POINTS[0]);
  const [showMap, setShowMap] = useState(false);
  const [travelDate, setTravelDate] = useState('');
  const [guests, setGuests] = useState(2);

  const today = new Date().toISOString().split('T')[0];
  const selectedDestObj = destinations.find(d => d.id === destinationId) || destinations[0];

  const handleSearch = () => {
    if (!selectedDestObj) return;
    onBook({ ...selectedDestObj, pickupPoint: selectedPickup, travelDate, guests });
  };

  const handleSuggestion = (name) => {
    const match = destinations.find(d => d.name?.includes(name) || d.tagline?.includes(name));
    if (match) setDestinationId(match.id);
  };

  const fieldStyle = {
    flex: 1,
    minWidth: '180px',
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    background: 'rgba(255,255,255,0.95)',
    border: '1px solid var(--border-gold)',
    borderRadius: '14px',
    padding: '0.7rem 1rem',
    color: '#0f172a',
    boxShadow: '0 4px 14px rgba(15,23,42,0.06)'
  };

  const selectStyle = {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#0f172a',
    fontSize: '0.95rem',
    fontWeight: 600,
    flex: 1,
    minWidth: 0,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)'
  };

  const inputStyle = {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: '#0f172a',
    fontSize: '0.95rem',
    fontWeight: 600,
    flex: 1,
    minWidth: 0,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)'
  };

  return (
    <section style={{ padding: '2rem 0', position: 'relative', zIndex: 5 }}>
      <div className="container">
        <div className="glass-card" style={{ padding: '1.8rem', position: 'relative', overflow: 'hidden' }}>
          {/* Colorful top accents */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 0% 100%, rgba(245,158,11,0.12), transparent 50%), radial-gradient(ellipse at 100% 100%, rgba(139,92,246,0.12), transparent 50%), radial-gradient(ellipse at 50% 0%, rgba(8,145,178,0.1), transparent 50%)'
          }} />

          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={20} color="var(--gold-primary)" />
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', margin: 0 }}>
                  {t('tripPlanner.title')}
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    style={{
                      background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(225,29,72,0.12))',
                      border: '1px solid rgba(212,160,23,0.4)',
                      color: 'var(--gold-deep)',
                      borderRadius: '20px',
                      padding: '0.35rem 0.9rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
              
              {/* STARTING PICKUP LOCATION SELECTOR */}
              <div style={{ ...fieldStyle, border: '2px solid var(--gold-primary)' }}>
                <Navigation size={18} color="#d97706" style={{ flexShrink: 0 }} />
                <select 
                  value={selectedPickup.id} 
                  onChange={(e) => {
                    const found = MAJOR_PICKUP_POINTS.find(p => p.id === e.target.value);
                    if (found) setSelectedPickup(found);
                  }} 
                  style={selectStyle}
                >
                  {MAJOR_PICKUP_POINTS.map((pt) => (
                    <option key={pt.id} value={pt.id} style={{ color: '#0f172a', background: '#ffffff' }}>
                      Starting: {pt.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* DESTINATION SELECTOR */}
              <div style={fieldStyle}>
                <MapPin size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
                <select value={destinationId} onChange={(e) => setDestinationId(e.target.value)} style={selectStyle}>
                  {destinations.map((d) => (
                    <option key={d.id} value={d.id} style={{ color: '#0f172a', background: '#ffffff' }}>Destination: {d.name}</option>
                  ))}
                </select>
              </div>

              <div style={fieldStyle}>
                <Calendar size={18} color="#e11d48" style={{ flexShrink: 0 }} />
                <input
                  type="date"
                  min={today}
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <div style={fieldStyle}>
                <Users size={18} color="#8b5cf6" style={{ flexShrink: 0 }} />
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  style={inputStyle}
                />
              </div>

              <button
                onClick={handleSearch}
                className="btn-aurora"
                style={{ padding: '0.85rem 2rem', justifyContent: 'center' }}
              >
                <Search size={18} />
                <span>{t('tripPlanner.search')}</span>
              </button>
            </div>

            {/* ✨ NEARBY PICKUP POINTS BASED ON STARTING POINT */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              marginTop: '0.9rem',
              flexWrap: 'wrap',
              fontSize: '0.76rem'
            }}>
              <span style={{ color: 'var(--gold-deep)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Sparkles size={13} color="var(--gold-primary)" />
                Nearby Hubs from {selectedPickup.name.split(' ')[0]}:
              </span>
              {MAJOR_PICKUP_POINTS.filter(p => p.id !== selectedPickup.id).slice(0, 4).map((pt) => (
                <button
                  key={pt.id}
                  onClick={() => setSelectedPickup(pt)}
                  style={{
                    background: 'rgba(245,158,11,0.1)',
                    border: '1px solid rgba(212,175,55,0.3)',
                    color: 'var(--gold-deep)',
                    borderRadius: '14px',
                    padding: '0.2rem 0.6rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  📍 {pt.name.split(' ')[0]} {pt.name.includes('Airport') ? 'Airport' : pt.name.includes('Station') ? 'Station' : 'Hub'}
                </button>
              ))}
            </div>

            {/* MAP TOGGLE BUTTON */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.2rem', flexWrap: 'wrap', gap: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Sparkles size={13} color="var(--emerald-accent)" />
                <span>{t('tripPlanner.guarantee')}</span>
              </div>

              <button
                onClick={() => setShowMap(prev => !prev)}
                className="btn-glass"
                style={{ padding: '0.45rem 1rem', fontSize: '0.78rem', color: 'var(--gold-light)', gap: '0.4rem' }}
              >
                <Navigation size={14} color="var(--gold-primary)" />
                <span>{showMap ? 'Hide Pickup Map' : '📍 View Pickup Points Map'}</span>
                <ChevronDown size={13} style={{ transform: showMap ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s' }} />
              </button>
            </div>

            {/* EXPANDABLE INTERACTIVE PICKUP MAP */}
            {showMap && (
              <PickupPointsMap
                selectedPointId={selectedPickup.id}
                onSelectPickupPoint={(point) => setSelectedPickup(point)}
                destinationName={selectedDestObj.name}
              />
            )}

          </div>
        </div>
      </div>
    </section>
  );
}
