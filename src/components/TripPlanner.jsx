import React, { useState } from 'react';
import { Calendar, MapPin, Users, Search, Sparkles } from 'lucide-react';
import { DESTINATIONS } from '../data/destinationsData';
import { useLanguage } from '../i18n/LanguageContext';

const QUICK_SUGGESTIONS = ['Kashi & Varanasi', 'Kashmir Paradise', 'Munnar & Ooty', 'Puri Jagannath'];

export default function TripPlanner({ onBook }) {
  const { t } = useLanguage();
  const [destinationId, setDestinationId] = useState(DESTINATIONS[0].id);
  const [travelDate, setTravelDate] = useState('');
  const [guests, setGuests] = useState(2);

  const today = new Date().toISOString().split('T')[0];

  const handleSearch = () => {
    const dest = DESTINATIONS.find(d => d.id === destinationId);
    if (!dest) return;
    onBook({ ...dest, travelDate, guests });
  };

  const handleSuggestion = (name) => {
    const match = DESTINATIONS.find(d => d.name.includes(name) || d.tagline.includes(name));
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
    color: 'var(--text-main)',
    boxShadow: '0 4px 14px rgba(15,23,42,0.06)'
  };

  const selectStyle = {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'var(--text-main)',
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
    color: 'var(--text-main)',
    fontSize: '0.95rem',
    fontWeight: 600,
    flex: 1,
    minWidth: 0,
    cursor: 'pointer',
    fontFamily: 'var(--font-body)'
  };

  return (
    <section style={{ padding: '1rem 0 0', position: 'relative', zIndex: 5 }}>
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
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 14px rgba(212,160,23,0.35)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
              <div style={fieldStyle}>
                <MapPin size={18} color="#f59e0b" style={{ flexShrink: 0 }} />
                <select value={destinationId} onChange={(e) => setDestinationId(e.target.value)} style={selectStyle}>
                  {DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Sparkles size={13} color="var(--emerald-accent)" />
              <span>{t('tripPlanner.guarantee')}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
