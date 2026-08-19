import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation, Compass, CheckCircle2, Phone, Sparkles, ExternalLink, Shield } from 'lucide-react';

export const MAJOR_PICKUP_POINTS = [
  {
    id: 'thrissur-hub',
    name: 'Thrissur Swaraj Round & Central Railway Station',
    category: 'Primary Hub & Main Office',
    lat: 10.5276,
    lng: 76.2144,
    address: '40/3924 Rohini Plaza, Near Railway Station, Kokkalai, Thrissur',
    landmark: 'Opposite Banyan Tree & Vadakkunnathan Temple Gate',
    contact: '+91 98470 12345',
    isHub: true,
    mapLink: 'https://maps.google.com/?q=Thrissur+Swaraj+Round'
  },
  {
    id: 'cochin-airport',
    name: 'Cochin International Airport (COK)',
    category: 'Airport Pickup & Drop',
    lat: 10.1518,
    lng: 76.3930,
    address: 'Nedumbassery, Kochi, Kerala 683111',
    landmark: 'Arrivals Gate 3 - OASIS Chauffeur Desk',
    contact: '+91 98470 12346',
    mapLink: 'https://maps.google.com/?q=Cochin+International+Airport'
  },
  {
    id: 'ernakulam-junction',
    name: 'Ernakulam Junction (South) / Town Station',
    category: 'Railway Transit Hub',
    lat: 9.9714,
    lng: 76.2842,
    address: 'South Railway Station Road, Ernakulam, Kochi 682016',
    landmark: 'Main Concourse Parking Bay 1',
    contact: '+91 98470 12347',
    mapLink: 'https://maps.google.com/?q=Ernakulam+Junction'
  },
  {
    id: 'palakkad-junction',
    name: 'Palakkad Junction & Fort Bus Terminal',
    category: 'Express Pickup Point',
    lat: 10.7867,
    lng: 76.6548,
    address: 'Olavakode, Palakkad, Kerala 678002',
    landmark: 'Near Palakkad Fort Gate',
    contact: '+91 98470 12348',
    mapLink: 'https://maps.google.com/?q=Palakkad+Junction'
  },
  {
    id: 'calicut-airport',
    name: 'Calicut (Kozhikode) International Airport (CCJ)',
    category: 'North Kerala Airport Hub',
    lat: 11.1395,
    lng: 75.9555,
    address: 'Karipur, Kozhikode, Kerala 673647',
    landmark: 'Terminal 2 Pickup Zone',
    contact: '+91 98470 12349',
    mapLink: 'https://maps.google.com/?q=Calicut+International+Airport'
  },
  {
    id: 'coimbatore-hub',
    name: 'Coimbatore Junction & Airport (CJB)',
    category: 'Interstate Pickup Point',
    lat: 11.0168,
    lng: 76.9558,
    address: 'State Bank Road, Gopalapuram, Coimbatore, Tamil Nadu 641018',
    landmark: 'Main Station Gate & Peelamedu Airport',
    contact: '+91 98470 12350',
    mapLink: 'https://maps.google.com/?q=Coimbatore+Junction'
  }
];

export default function PickupPointsMap({ selectedPointId = 'thrissur-hub', onSelectPickupPoint, destinationName = 'Kodaikanal' }) {
  const [activePoint, setActivePoint] = useState(() => 
    MAJOR_PICKUP_POINTS.find(p => p.id === selectedPointId) || MAJOR_PICKUP_POINTS[0]
  );
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);

  const handleSelect = (point) => {
    setActivePoint(point);
    if (onSelectPickupPoint) onSelectPickupPoint(point);
  };

  useEffect(() => {
    // Dynamic Leaflet Initialization
    if (window.L && mapRef.current && !leafletInstance.current) {
      try {
        const map = window.L.map(mapRef.current, {
          center: [activePoint.lat, activePoint.lng],
          zoom: 9,
          zoomControl: true
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        leafletInstance.current = map;

        // Custom Gold Marker Icons
        MAJOR_PICKUP_POINTS.forEach((pt) => {
          const marker = window.L.marker([pt.lat, pt.lng]).addTo(map);
          marker.bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <strong style="color: #0f172a; font-size: 13px;">${pt.name}</strong><br/>
              <span style="color: #475569; font-size: 11px;">${pt.category}</span><br/>
              <a href="${pt.mapLink}" target="_blank" style="color: #d97706; font-size: 11px; font-weight: bold;">Open Google Maps</a>
            </div>
          `);

          marker.on('click', () => {
            handleSelect(pt);
          });
        });
      } catch (e) {
        console.error('Leaflet init error:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (leafletInstance.current && activePoint) {
      leafletInstance.current.setView([activePoint.lat, activePoint.lng], 10, { animate: true });
    }
  }, [activePoint]);

  return (
    <div style={{ background: '#060c17', border: '1px solid var(--border-gold)', borderRadius: '20px', padding: '1.5rem', marginTop: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <span className="badge-gold" style={{ marginBottom: '0.4rem' }}>
            <Navigation size={13} /> Starting Location &amp; Pickup Hubs
          </span>
          <h3 style={{ fontSize: '1.35rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff' }}>
            Select Your Pickup Point to <span className="text-aurora">{destinationName}</span>
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.86rem', marginTop: '0.2rem' }}>
            OASIS luxury AC coaches &amp; private cabs depart directly from Swaraj Round Thrissur, Cochin Airport &amp; key transit points.
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '1.4rem' }}>
        
        {/* Interactive Map Container */}
        <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-gold)', minHeight: '340px', background: '#02060e' }}>
          
          {/* Leaflet Map Div */}
          <div ref={mapRef} style={{ width: '100%', height: '100%', minHeight: '340px', zIndex: 1 }} />

          {/* Map Overlay Badge */}
          <div style={{
            position: 'absolute', bottom: '0.8rem', left: '0.8rem', zIndex: 10,
            background: 'rgba(6,12,23,0.92)', border: '1px solid var(--border-gold)',
            borderRadius: '12px', padding: '0.5rem 0.9rem', backdropFilter: 'blur(10px)',
            display: 'flex', alignItems: 'center', gap: '0.5rem'
          }}>
            <MapPin size={16} color="var(--gold-primary)" />
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fff' }}>{activePoint.name}</div>
              <div style={{ fontSize: '0.68rem', color: 'var(--gold-light)' }}>{activePoint.lat}° N, {activePoint.lng}° E</div>
            </div>
          </div>

        </div>

        {/* Pickup Points Selector List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '0.3rem' }}>
          {MAJOR_PICKUP_POINTS.map((point) => {
            const isSelected = activePoint.id === point.id;
            return (
              <div
                key={point.id}
                onClick={() => handleSelect(point)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, rgba(245,158,11,0.18), rgba(139,92,246,0.12))' : 'rgba(255,255,255,0.03)',
                  border: isSelected ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '14px', padding: '0.85rem 1rem', cursor: 'pointer',
                  transition: 'all 0.25s ease', position: 'relative'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: isSelected ? 'var(--gold-primary)' : 'rgba(255,255,255,0.08)',
                      color: isSelected ? '#000' : 'var(--gold-light)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '0.75rem', flexShrink: 0, marginTop: '2px'
                    }}>
                      <MapPin size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: isSelected ? '#fff' : 'var(--text-main)', lineHeight: 1.3 }}>
                        {point.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: point.isHub ? 'var(--gold-primary)' : 'var(--text-muted)', fontWeight: 700, marginTop: '0.15rem' }}>
                        {point.category} {point.isHub && '★ MAIN HEADQUARTERS'}
                      </div>
                      <div style={{ fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                        📍 {point.landmark}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <span style={{ background: '#10b981', color: '#000', fontSize: '0.62rem', fontWeight: 900, padding: '0.15rem 0.5rem', borderRadius: '10px', flexShrink: 0 }}>
                      SELECTED
                    </span>
                  )}
                </div>

                {/* Google Maps External Link Button */}
                <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '0.4rem' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>📞 {point.contact}</span>
                  <a
                    href={point.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ fontSize: '0.72rem', color: 'var(--gold-light)', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}
                  >
                    Google Map Pin <ExternalLink size={12} />
                  </a>
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Selected Pickup Point Summary Card */}
      <div style={{
        marginTop: '1.2rem', padding: '0.9rem 1.2rem',
        background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)',
        borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <CheckCircle2 size={20} color="#10b981" />
          <div>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fff' }}>
              Selected Pickup: {activePoint.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Address: {activePoint.address}
            </div>
          </div>
        </div>

        <a
          href={activePoint.mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
          style={{ padding: '0.45rem 1rem', fontSize: '0.78rem' }}
        >
          <Navigation size={13} /> Navigate to Pickup Point
        </a>
      </div>

    </div>
  );
}
