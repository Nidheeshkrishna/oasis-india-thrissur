import React, { useState, useEffect, useRef } from 'react';
import { Navigation, Compass, ExternalLink, ArrowRight, Clock, Layers, Flag, Search, Sparkles, MapPin } from 'lucide-react';
import { searchLocationsAndNearby, resolveLocationCoords, LOCATION_CATEGORIES, NEARBY_LOCATIONS_DATABASE } from '../data/nearbyLocationsData';

const toArr = (val) => {
  const arr = Array.isArray(val) ? val : typeof val === 'string' ? val.split(',') : [];
  return arr
    .map(s => typeof s === 'string' ? s.trim() : (s && typeof s === 'object' ? String(s.name || '').trim() : ''))
    .filter(Boolean);
};

const ROUTE_TYPE = {
  start:       { color: '#10b981', label: 'Start Point',        icon: '🟢', sub: 'Passenger Pickup & Luxury AC Coach Departure',       tag: 'DEPARTURE HUB / START' },
  pickup:      { color: '#d4af37', label: 'Pickup Point',       icon: '🟡', sub: 'Passenger pickup & en-route boarding point',          tag: 'NEXT PICKUP STOP' },
  dropping:    { color: '#a855f7', label: 'Dropping Point',     icon: '🟣', sub: 'En-route passenger drop-off point',                   tag: 'DROPPING POINT' },
  destination: { color: '#ef4444', label: 'Final Destination',  icon: '🔴', sub: 'Tour Destination — Hotel Check-in & Guided Exploration', tag: 'FINAL DESTINATION' }
};

const roleFor = (stops, routeMeta, idx) => {
  const isStart = idx === 0;
  const isDest = idx === stops.length - 1;
  if (routeMeta.length && routeMeta[idx] && ROUTE_TYPE[routeMeta[idx].type]) return routeMeta[idx].type;
  return isStart ? 'start' : isDest ? 'destination' : 'pickup';
};

export default function RouteMapVisualizer({
  routePoints = [],
  pickupPoints = ['Thrissur Swaraj Round', 'Cochin International Airport (COK)', 'Ernakulam South Station', 'Palakkad Junction'],
  dropPoints = ['Thrissur Swaraj Round', 'Cochin International Airport (COK)', 'Ernakulam South Station'],
  destinationName = 'Kodaikanal',
  destinationCoords = { lat: 10.2381, lng: 77.4892 },
  initialPickup,
  initialDrop,
  onPickupChange,
  onDropChange
}) {
  // Ordered route stops: [Start, ...next pickups, Destination]
  const rawRoute = Array.isArray(routePoints) ? routePoints : [];
  const routeMeta = (rawRoute.length > 0 && typeof rawRoute[0] === 'object')
    ? rawRoute
        .map(p => ({ name: String((p && p.name) || '').trim(), type: ROUTE_TYPE[p.type] ? p.type : 'pickup' }))
        .filter(m => m.name)
    : [];

  const stops = (() => {
    if (routeMeta.length) return routeMeta.map(m => m.name);
    const picks = toArr(pickupPoints);
    const dest = (destinationName || '').trim();
    const route = [...picks];
    if (dest && !route.includes(dest)) route.push(dest);
    toArr(dropPoints).forEach(d => { if (!route.includes(d)) route.push(d); });
    return route.length ? route : ['Thrissur Swaraj Round', 'Kodaikanal'];
  })();

  const startName = stops[0];
  const destName = stops[stops.length - 1];
  const waypointNames = stops.slice(1, stops.length - 1);

  // Boarding options = every stop except the final destination
  const pickupOptions = stops.slice(0, stops.length - 1);
  // Dropping options = the destination first, then all other stops (return pickups)
  const dropOptions = stops;

  const [selectedPickup, setSelectedPickup] = useState(() =>
    (initialPickup && pickupOptions.includes(initialPickup)) ? initialPickup : startName
  );
  const [selectedDrop, setSelectedDrop] = useState(() =>
    (initialDrop && dropOptions.includes(initialDrop)) ? initialDrop : destName
  );
  const [customPickupInput, setCustomPickupInput] = useState('');
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [nearbySuggestions, setNearbySuggestions] = useState([]);
  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const routePolyline = useRef(null);
  const markerGroup = useRef([]);

  const activePickupName = customPickupInput.trim() || selectedPickup || startName;

  // Dynamic route stops: origin begins with the user's selected/typed pickup point
  const activeStops = (() => {
    const list = [...stops];
    if (activePickupName) {
      list[0] = activePickupName;
    }
    return list;
  })();

  // Derive nearby points based on active start point
  useEffect(() => {
    const searchTarget = activePickupName || startName;
    const resolved = resolveLocationCoords(searchTarget);
    const searchRes = searchLocationsAndNearby(searchTarget, 6);
    const combined = Array.from(new Set([...(resolved.nearby || []), ...(searchRes.nearbySuggestions || [])]));
    setNearbySuggestions(combined.slice(0, 6));
  }, [activePickupName, startName]);

  const getPointCoords = (strName) => {
    const resolved = resolveLocationCoords(strName);
    return { lat: resolved.lat, lng: resolved.lng, label: strName };
  };

  const stopCoords = activeStops.map((name, idx) => {
    const isDest = idx === activeStops.length - 1;
    if (isDest && destinationCoords?.lat) {
      return { lat: destinationCoords.lat, lng: destinationCoords.lng, label: name };
    }
    return getPointCoords(name);
  });

  const pickupCoords = stopCoords[0] || getPointCoords(activePickupName);
  const destCoords = stopCoords[stopCoords.length - 1];

  // Calculate approximate distance & travel time (sum across all route legs)
  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 1.35); // Road winding multiplier
  };

  const roadDistance = stopCoords.slice(1).reduce((sum, c, idx) => {
    const prev = stopCoords[idx];
    return sum + calculateDistanceKm(prev.lat, prev.lng, c.lat, c.lng);
  }, 0) || calculateDistanceKm(pickupCoords.lat, pickupCoords.lng, destCoords.lat, destCoords.lng);

  const driveHours = Math.floor(roadDistance / 45);
  const driveMins = Math.round((roadDistance % 45) * 60 / 45);

  const handlePickupSelect = (val) => {
    setSelectedPickup(val);
    setCustomPickupInput(val);
    if (onPickupChange) onPickupChange(val);
  };

  const handleDropSelect = (val) => {
    setSelectedDrop(val);
    if (onDropChange) onDropChange(val);
  };

  useEffect(() => {
    if (window.L && mapRef.current && !leafletMap.current) {
      try {
        const map = window.L.map(mapRef.current, {
          center: [pickupCoords.lat, pickupCoords.lng],
          zoom: 8,
          zoomControl: true
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        leafletMap.current = map;
      } catch (e) {
        console.error(e);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (leafletMap.current && window.L) {
      const map = leafletMap.current;

      // Remove existing markers & polyline
      markerGroup.current.forEach(m => map.removeLayer(m));
      markerGroup.current = [];

      if (routePolyline.current) {
        map.removeLayer(routePolyline.current);
      }

      // Markers for every stop in sequence (color-coded by role)
      stopCoords.forEach((c, idx) => {
        const rType = ROUTE_TYPE[roleFor(stops, routeMeta, idx)] || ROUTE_TYPE.pickup;

        const m = window.L.circleMarker([c.lat, c.lng], {
          radius: rType === ROUTE_TYPE.start || rType === ROUTE_TYPE.destination ? 9 : 7,
          color: rType.color,
          fillColor: rType.color,
          fillOpacity: 0.35,
          weight: 3
        }).addTo(map);
        m.bindPopup(`<strong style="color: ${rType.color};">${rType.icon} ${rType.label}: ${c.label}</strong>`);
        markerGroup.current.push(m);
      });

      // Connecting polyline through all stops
      const line = window.L.polyline(stopCoords.map(c => [c.lat, c.lng]), {
        color: '#f59e0b',
        weight: 5,
        opacity: 0.9,
        dashArray: '10, 10'
      }).addTo(map);
      routePolyline.current = line;

      // Fit bounds to show the complete route
      const bounds = window.L.latLngBounds(stopCoords.map(c => [c.lat, c.lng]));
      map.fitBounds(bounds, { padding: [45, 45], maxZoom: 9 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePickupName, destinationName]);

  const mapUrl = `https://maps.google.com/?saddr=${stopCoords[0].lat},${stopCoords[0].lng}&daddr=${destCoords.lat},${destCoords.lng}`;

  return (
    <div style={{ background: '#060c17', border: '1px solid var(--border-gold)', borderRadius: '18px', padding: '1.4rem', marginTop: '1.4rem' }}>

      {/* Route Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.6rem' }}>
        <div>
          <span className="badge-gold" style={{ marginBottom: '0.3rem' }}>
            <Navigation size={13} /> Real-Time Route &amp; Pickup Visualizer
          </span>
          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#fff' }}>
            Full Route: <span style={{ color: '#10b981' }}>{activePickupName}</span> <ArrowRight size={16} style={{ verticalAlign: '-2px', color: 'var(--gold-primary)' }} /> <span className="text-aurora">{destName}</span>
          </h4>
          {waypointNames.length > 0 && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem', flexWrap: 'wrap' }}>
              <Flag size={12} color="var(--gold-primary)" />
              Via: {waypointNames.map((w, i) => (
                <span key={i} style={{ color: 'var(--gold-light)' }}>
                  {i > 0 && ' → '}
                  <b>{w}</b>
                </span>
              ))}
            </div>
          )}
        </div>

        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold"
          style={{ padding: '0.45rem 1rem', fontSize: '0.78rem', gap: '0.35rem' }}
        >
          Open Navigation in Google Maps <ExternalLink size={13} />
        </a>
      </div>

      {/* START POINT INPUT & PICKUP/DROP SELECTORS */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '1rem', marginBottom: '0.8rem' }}>

        {/* Custom Start Location Input with Auto-complete */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '0.8rem', position: 'relative' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
            ✍️ Enter Start / Boarding Location
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              value={customPickupInput}
              onChange={(e) => {
                setCustomPickupInput(e.target.value);
                setShowStartSuggestions(true);
                if (onPickupChange) onPickupChange(e.target.value);
              }}
              onFocus={() => setShowStartSuggestions(true)}
              onBlur={() => setTimeout(() => setShowStartSuggestions(false), 200)}
              placeholder="Type starting city, station, or landmark..."
              style={{
                width: '100%', background: '#091426', border: '1px solid var(--border-gold)',
                color: '#fff', padding: '0.55rem 0.85rem 0.55rem 2rem', borderRadius: '10px',
                fontSize: '0.84rem', fontWeight: 600, outline: 'none'
              }}
            />
            <Search size={13} color="var(--gold-primary)" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />

            {/* Smart Suggestions Dropdown */}
            {showStartSuggestions && customPickupInput.trim().length >= 2 && (() => {
              const res = searchLocationsAndNearby(customPickupInput, 6);
              if (!res.matches.length) return null;
              return (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 60,
                  background: '#091426', border: '1px solid var(--border-gold)', borderRadius: '10px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.8)', maxHeight: '220px', overflowY: 'auto'
                }}>
                  {res.matches.map((item, i) => {
                    const cat = LOCATION_CATEGORIES[item.category] || LOCATION_CATEGORIES.landmark;
                    return (
                      <button
                        key={i}
                        type="button"
                        onMouseDown={() => {
                          setCustomPickupInput(item.name);
                          setSelectedPickup(item.name);
                          setShowStartSuggestions(false);
                          if (onPickupChange) onPickupChange(item.name);
                        }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          width: '100%', padding: '0.45rem 0.75rem', background: 'transparent',
                          border: 'none', borderBottom: '1px solid rgba(255,255,255,0.05)',
                          color: '#fff', fontSize: '0.78rem', textAlign: 'left', cursor: 'pointer'
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <span>{cat.icon}</span>
                          <span style={{ fontWeight: 700 }}>{item.name}</span>
                        </span>
                        <span style={{ fontSize: '0.66rem', color: 'var(--gold-light)' }}>{item.region}</span>
                      </button>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Pickup Dropdown */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '0.8rem' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
            📍 Select Pickup Hub
          </label>
          <select
            value={selectedPickup}
            onChange={(e) => handlePickupSelect(e.target.value)}
            style={{
              width: '100%', background: '#091426', border: '1px solid var(--border-gold)',
              color: '#fef08a', padding: '0.55rem 0.85rem', borderRadius: '10px',
              fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', outline: 'none'
            }}
          >
            {pickupOptions.map((p, idx) => (
              <option key={idx} value={p} style={{ background: '#091426', color: '#fef08a' }}>
                {idx === 0 ? '🟢' : '🟡'} {p}
              </option>
            ))}
          </select>
        </div>

        {/* Dropping Dropdown */}
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '0.8rem' }}>
          <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '0.35rem' }}>
            🏁 Select Dropping Location
          </label>
          <select
            value={selectedDrop}
            onChange={(e) => handleDropSelect(e.target.value)}
            style={{
              width: '100%', background: '#091426', border: '1px solid var(--border-gold)',
              color: '#fef08a', padding: '0.55rem 0.85rem', borderRadius: '10px',
              fontSize: '0.84rem', fontWeight: 700, cursor: 'pointer', outline: 'none'
            }}
          >
            {dropOptions.map((d, idx) => (
              <option key={idx} value={d} style={{ background: '#091426', color: '#fef08a' }}>
                {idx === dropOptions.length - 1 ? '🔴' : '🏁'} {d}
              </option>
            ))}
          </select>
        </div>

      </div>

      {/* ✨ NEARBY PICKUP POINTS RIBBON (Based on Starting Point) */}
      {nearbySuggestions.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(16,185,129,0.06))',
          border: '1px solid rgba(212,175,55,0.22)',
          borderRadius: '12px',
          padding: '0.5rem 0.85rem',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap'
        }}>
          <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={13} color="var(--gold-primary)" />
            Nearby Points from {activePickupName.split(' ')[0]}:
          </span>
          {nearbySuggestions.map((nb, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handlePickupSelect(nb)}
              style={{
                background: selectedPickup === nb ? 'var(--gold-primary)' : 'rgba(212,175,55,0.12)',
                color: selectedPickup === nb ? '#000' : '#fef08a',
                border: '1px solid var(--border-gold)',
                borderRadius: '14px',
                padding: '0.2rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              📍 {nb}
            </button>
          ))}
        </div>
      )}

      {/* Interactive Leaflet Map Visualizer Element */}
      <div style={{ position: 'relative', height: '300px', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-gold)', background: '#02060e' }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Floating Route Summary Overlay */}
        <div style={{
          position: 'absolute', bottom: '0.9rem', left: '0.9rem', right: '0.9rem', zIndex: 10,
          background: 'rgba(6,12,23,0.92)', border: '1px solid var(--border-gold)',
          borderRadius: '14px', padding: '0.7rem 1.1rem', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#10b981' }}>🟢 {activePickupName}</span>
            <ArrowRight size={14} color="var(--gold-primary)" />
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ef4444' }}>🔴 {destName}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', fontSize: '0.78rem', color: '#fff', fontWeight: 700 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--gold-light)' }}>
              <Layers size={14} color="var(--gold-primary)" /> Approx {roadDistance} KM
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--gold-light)' }}>
              <Clock size={14} color="var(--emerald-accent)" /> ~{driveHours}h {driveMins}m drive
            </span>
          </div>
        </div>

      </div>

      {/* ROUTE STOPS & ITINERARY BREAKDOWN LIST */}
      <div style={{ marginTop: '1.2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '14px', padding: '1rem' }}>
        <h5 style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--gold-deep)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.7rem' }}>
          <Compass size={16} /> Route Stops &amp; Transit Waypoints List
        </h5>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {stopCoords.map((c, idx) => {
            const rType = ROUTE_TYPE[roleFor(stops, routeMeta, idx)] || ROUTE_TYPE.pickup;

            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.55rem 0.8rem', background: `${rType.color}14`, border: `1px solid ${rType.color}4d`, borderRadius: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: rType.color, color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '0.7rem', flexShrink: 0 }}>
                    {idx + 1}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff' }}>
                      {rType.label}: {c.label}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{rType.sub}</div>
                  </div>
                </div>
                <span style={{ fontSize: '0.72rem', color: rType.color, fontWeight: 800, flexShrink: 0 }}>
                  {rType.icon} {rType.tag}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
