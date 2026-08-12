import React, { useState } from 'react';
import { 
  X, MapPin, Search, Calendar, Clock, Sparkles, Navigation, 
  Camera, DollarSign, ExternalLink, Award, Compass, Sun, Train, Plane, Layers
} from 'lucide-react';
import { generateAiDestinationGuide } from '../services/aiDestinationGenerator';
import { useLanguage } from '../i18n/LanguageContext';

export default function AiDestinationGuideModal({ initialLocation = 'Kodaikanal', onClose, onBookTour }) {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState(initialLocation);
  const [guideData, setGuideData] = useState(() => generateAiDestinationGuide(initialLocation));

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (!searchQuery.trim()) return;
    const data = generateAiDestinationGuide(searchQuery);
    setGuideData(data);
  };

  const handlePresetClick = (locName) => {
    setSearchQuery(locName);
    const data = generateAiDestinationGuide(locName);
    setGuideData(data);
  };

  const PRESETS = [
    'Kodaikanal', 'Munnar', 'Wayanad', 'Ooty', 
    'Thrissur', 'Silent Valley', 'Athirappilly', 'Kashmir', 'Coorg', 'Goa'
  ];

  return (
    <div className="modal-overlay" style={{ zIndex: 10005, background: 'rgba(3,6,12,0.92)', backdropFilter: 'blur(16px)' }}>
      <div 
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '1180px',
          maxHeight: '94vh',
          overflowY: 'auto',
          margin: 'auto',
          position: 'relative',
          padding: 0,
          background: '#060c17',
          border: '1px solid var(--border-gold)',
          borderRadius: '24px',
          boxShadow: '0 30px 90px rgba(0,0,0,0.8)'
        }}
      >
        {/* Sticky Header Control Bar */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: 'rgba(6, 12, 23, 0.95)',
          backdropFilter: 'blur(12px)',
          padding: '1rem 1.8rem',
          borderBottom: '1px solid var(--border-gold)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={22} color="var(--gold-primary)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--gold-light)' }}>
              AI Nearby Attractions &amp; 1-Day Itinerary Guide
            </h2>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', flex: 1, maxWidth: '420px', minWidth: '260px' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-gold)',
              borderRadius: '20px', padding: '0.4rem 0.9rem', flex: 1
            }}>
              <Search size={16} color="var(--gold-primary)" />
              <input
                type="text"
                placeholder="Enter any location (e.g. Kodaikanal, Munnar, Ooty)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'none', border: 'none', outline: 'none',
                  color: '#fff', fontSize: '0.88rem', fontWeight: 600, width: '100%'
                }}
              />
            </div>
            <button type="submit" className="btn-gold" style={{ padding: '0.4rem 1rem', fontSize: '0.8rem', flexShrink: 0 }}>
              Generate
            </button>
          </form>

          {/* Close Modal */}
          <button
            onClick={onClose}
            style={{
              width: '38px', height: '38px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-gold)',
              color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Location Preset Pills */}
        <div style={{
          padding: '0.6rem 1.8rem', background: '#091322',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', gap: '0.5rem', overflowX: 'auto'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-primary)', flexShrink: 0, textTransform: 'uppercase' }}>
            Popular Locations:
          </span>
          {PRESETS.map((loc) => (
            <button
              key={loc}
              onClick={() => handlePresetClick(loc)}
              style={{
                background: searchQuery.toLowerCase() === loc.toLowerCase() ? 'var(--gold-primary)' : 'rgba(255,255,255,0.06)',
                color: searchQuery.toLowerCase() === loc.toLowerCase() ? '#000' : 'var(--text-muted)',
                border: '1px solid var(--border-gold)',
                borderRadius: '16px', padding: '0.25rem 0.75rem',
                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', flexShrink: 0, transition: 'all 0.2s'
              }}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* HERO IMAGE BANNER & LOCATION INFO */}
        <div style={{ position: 'relative', height: '360px', overflow: 'hidden' }}>
          <img 
            src={guideData.heroImage} 
            alt={guideData.locationName}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, #060c17 10%, rgba(6,12,23,0.6) 50%, transparent 100%)'
          }} />

          <div style={{ position: 'absolute', bottom: '1.8rem', left: '2rem', right: '2rem', zIndex: 10 }}>
            <span className="badge-aurora" style={{ marginBottom: '0.6rem' }}>
              <Navigation size={13} /> 50 km Radius Travel Guide
            </span>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#ffffff', marginBottom: '0.3rem' }}>
              {guideData.locationName}
            </h1>
            <p style={{ fontSize: '1.15rem', color: 'var(--gold-light)', fontWeight: 600 }}>
              {guideData.tagline}
            </p>
          </div>
        </div>

        {/* LOCATION INFORMATION BAND */}
        <div style={{ padding: '1.8rem 2rem', background: '#081427', borderBottom: '1px solid var(--border-gold)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={18} /> Location Information &amp; Key Travel Stats
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem' }}>
            
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '12px', padding: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#f59e0b', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                <Train size={15} /> Nearest Railway Station
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
                {guideData.nearestStation}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '12px', padding: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                <Plane size={15} /> Nearest Airport
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
                {guideData.nearestAirport}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '12px', padding: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                <Calendar size={15} /> Best Time to Visit
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
                {guideData.bestTime}
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: '12px', padding: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#a78bfa', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                <Sun size={15} /> Weather &amp; Climate
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff' }}>
                {guideData.weather}
              </div>
            </div>

          </div>

          {/* Google Map Link Button */}
          <div style={{ marginTop: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <a 
              href={guideData.googleMapLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-glass"
              style={{ padding: '0.55rem 1.2rem', fontSize: '0.82rem', color: 'var(--gold-light)' }}
            >
              <Navigation size={15} /> View {guideData.locationName} on Google Maps ({guideData.googleMapCoordinates}) <ExternalLink size={14} />
            </a>

            <button 
              className="btn-gold" 
              onClick={() => onBookTour && onBookTour({ name: guideData.locationName, title: `Custom ${guideData.locationName} Tour` })}
              style={{ padding: '0.55rem 1.4rem', fontSize: '0.85rem' }}
            >
              Book Custom {guideData.locationName} Tour
            </button>
          </div>
        </div>

        {/* NEARBY TOURIST ATTRACTIONS GRID */}
        <div style={{ padding: '2.5rem 2rem' }}>
          <div style={{ textAlign: 'center', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
            <span className="badge-aurora" style={{ marginBottom: '0.6rem' }}>
              <Layers size={13} /> {guideData.attractions.length} Popular Attractions Within 50 km
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Nearby Tourist Attractions in <span className="text-aurora">{guideData.locationName}</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              Sorted by travel distance from {guideData.locationName} with entry fees, opening hours, photography highlights &amp; activities.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            {guideData.attractions.map((item, idx) => (
              <div key={item.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                
                {/* Large Hero Image */}
                <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,12,23,0.9) 0%, transparent 60%)' }} />
                  
                  <span style={{
                    position: 'absolute', top: '0.8rem', left: '0.8rem',
                    background: 'rgba(6,12,23,0.85)', border: '1px solid var(--border-gold)',
                    color: 'var(--gold-light)', fontWeight: 800, fontSize: '0.75rem',
                    padding: '0.25rem 0.65rem', borderRadius: '14px', backdropFilter: 'blur(6px)'
                  }}>
                    #{idx + 1} Attraction
                  </span>

                  <span style={{
                    position: 'absolute', bottom: '0.8rem', left: '0.8rem',
                    background: 'rgba(16,185,129,0.9)', color: '#000', fontWeight: 800,
                    fontSize: '0.72rem', padding: '0.25rem 0.65rem', borderRadius: '14px'
                  }}>
                    {item.distance} • {item.travelTime}
                  </span>
                </div>

                {/* Attraction Info */}
                <div style={{ padding: '1.4rem', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-heading)', marginBottom: '0.6rem' }}>
                      {item.name}
                    </h3>
                    <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {item.shortDescription}
                    </p>

                    {/* Highlights Badges */}
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      {item.highlights?.map((h, i) => (
                        <span key={i} style={{
                          background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)',
                          color: '#fef08a', fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '12px'
                        }}>
                          ✓ {h}
                        </span>
                      ))}
                    </div>

                    {/* Key Details Grid */}
                    <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.8rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ color: 'var(--gold-primary)', fontWeight: 700, display: 'block' }}>Opening Hours:</span>
                        {item.openingHours}
                      </div>
                      <div>
                        <span style={{ color: '#10b981', fontWeight: 700, display: 'block' }}>Entry Fee:</span>
                        {item.entryFee}
                      </div>
                    </div>

                    {/* Best Photography Spot */}
                    <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Camera size={14} color="#38bdf8" />
                      <span><strong>Photo Spot:</strong> {item.bestPhotoSpot}</span>
                    </div>
                  </div>

                  {/* Google Map Link Button */}
                  <a 
                    href={item.mapLink} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-glass"
                    style={{ width: '100%', justifyContent: 'center', padding: '0.55rem', fontSize: '0.8rem' }}
                  >
                    <Navigation size={14} /> Open Location on Google Maps <ExternalLink size={13} />
                  </a>

                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ONE-DAY TIMED ITINERARY TIMELINE */}
        <div style={{ padding: '2.5rem 2rem', background: '#040914', borderTop: '1px solid var(--border-gold)' }}>
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
            <span className="badge-gold" style={{ marginBottom: '0.6rem' }}>
              <Clock size={13} /> Optimized Sightseeing Schedule
            </span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--gold-light)' }}>
              Suggested 1-Day Itinerary for <span className="text-aurora">{guideData.locationName}</span>
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
              The best order to visit top attractions in a single day (08:00 AM to 06:00 PM).
            </p>
          </div>

          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {guideData.oneDayItinerary.map((slot, idx) => (
              <div 
                key={idx} 
                className="glass-card"
                style={{ padding: '1.2rem 1.6rem', display: 'flex', alignItems: 'center', gap: '1.4rem', borderLeft: '4px solid var(--gold-primary)' }}
              >
                <div style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: '#000', fontWeight: 900, fontSize: '0.85rem',
                  padding: '0.4rem 0.8rem', borderRadius: '12px', flexShrink: 0
                }}>
                  {slot.time}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {slot.title} • {slot.place}
                  </div>
                  <div style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 600, marginTop: '0.2rem' }}>
                    {slot.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Book Tour CTA Button */}
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button 
              className="btn-aurora" 
              onClick={() => onBookTour && onBookTour({ name: guideData.locationName, title: `Custom ${guideData.locationName} Tour` })}
              style={{ padding: '0.85rem 2.2rem', fontSize: '0.95rem' }}
            >
              <Sparkles size={18} />
              <span>Book Full-Day Escorted Tour to {guideData.locationName}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
