import React, { useState, useEffect, useRef, useMemo } from 'react';
import { MapPin, Plus, Trash2, Navigation, Flag, Search, ArrowUp, ArrowDown, Rocket, Maximize2, Minimize2, ExternalLink, Sparkles, Compass, Check, ArrowRight, Layers } from 'lucide-react';
import { searchLocationsAndNearby, resolveLocationCoords, getRouteCorridorPoints, getCanonicalLocationName, LOCATION_CATEGORIES, NEARBY_LOCATIONS_DATABASE, PREDEFINED_CORRIDORS } from '../../data/nearbyLocationsData';
import { DESTINATIONS } from '../../data/destinationsData';

const PRESET_HUB_COORDS = {
  'thrissur': { name: 'Thrissur Swaraj Round Main Hub', lat: 10.5276, lng: 76.2144 },
  'cochin': { name: 'Cochin International Airport (COK)', lat: 10.1518, lng: 76.3930 },
  'ernakulam': { name: 'Ernakulam South Railway Station', lat: 9.9714, lng: 76.2842 },
  'palakkad': { name: 'Palakkad Junction & Fort Terminal', lat: 10.7867, lng: 76.6548 },
  'calicut': { name: 'Calicut (Kozhikode) Airport (CCJ)', lat: 11.1395, lng: 75.9555 },
  'coimbatore': { name: 'Coimbatore Junction & Airport', lat: 11.0168, lng: 76.9558 },
  'madurai': { name: 'Madurai Station & Airport', lat: 9.9252, lng: 78.1198 },
  'wayanad': { name: 'Wayanad Ghat Gate', lat: 11.6854, lng: 76.1320 },
  'silent valley': { name: 'Silent Valley Entry Gate', lat: 11.0624, lng: 76.4428 },
  'athirappilly': { name: 'Athirappilly Waterfall Hub', lat: 10.2847, lng: 76.5694 }
};

// Role configuration for every type of route point
const POINT_TYPES = {
  start:       { label: 'Start Location',  short: 'START',    color: '#10b981', icon: '🟢' },
  pickup:      { label: 'Pickup Point',     short: 'PICKUP',   color: '#d4af37', icon: '🟡' },
  dropping:    { label: 'Dropping Point',   short: 'DROPPING', color: '#a855f7', icon: '🟣' },
  destination: { label: 'End Destination',  short: 'END',      color: '#ef4444', icon: '🔴' }
};

const normalizePoint = (p) => {
  if (typeof p === 'string') return { name: p.trim(), type: 'pickup' };
  if (p && typeof p === 'object') return { name: String(p.name || '').trim(), type: POINT_TYPES[p.type] ? p.type : 'pickup' };
  return null;
};

// Route invariant: first point is always the Start, last point is always the Destination
const enforceInvariant = (points) => {
  const list = points.map(p => ({ ...p })).filter(p => p && p.name);
  if (!list.length) return list;
  list[0].type = 'start';
  list[list.length - 1].type = 'destination';
  return list;
};

const findCoordsForLocation = (text) => {
  const resolved = resolveLocationCoords(text);
  const canonical = getCanonicalLocationName(text);
  return { name: canonical || text, lat: resolved.lat, lng: resolved.lng, nearby: resolved.nearby || [] };
};

// Candidate clickable points on the map
const CANDIDATE_POINTS = NEARBY_LOCATIONS_DATABASE.map(item => ({
  name: item.name,
  lat: item.lat,
  lng: item.lng,
  category: item.category,
  region: item.region
}));

export default function AdminMapPointPicker({
  routePoints = [],
  onUpdateRoutePoints,
  destinationName
}) {
  const points = enforceInvariant((routePoints || []).map(normalizePoint).filter(Boolean));
  const initialStart = points[0]?.name || 'Thrissur Swaraj Round Main Hub';
  const initialEnd = points[points.length - 1]?.name || destinationName || 'Kodaikanal Lake & Star Promenade';

  const [startPointInput, setStartPointInput] = useState(initialStart);
  const [endPointInput, setEndPointInput] = useState(initialEnd);
  const [pointName, setPointName] = useState('');
  const [pointType, setPointType] = useState('pickup');
  const [fullView, setFullView] = useState(false);
  const [osmResults, setOsmResults] = useState([]);
  const [osmLoading, setOsmLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pinnedCoords, setPinnedCoords] = useState({ lat: 10.5276, lng: 76.2144 });
  const [activeNearbyPoints, setActiveNearbyPoints] = useState([]);
  const [corridorSuccessMsg, setCorridorSuccessMsg] = useState('');
  const mapRef = useRef(null);
  const leafletInstance = useRef(null);
  const overlayRef = useRef({ markers: [], polyline: null, corridorMarkers: [] });

  // Dynamically compute all points along the corridor based on Start Point and End Point
  const corridorResult = useMemo(() => {
    return getRouteCorridorPoints(startPointInput, endPointInput);
  }, [startPointInput, endPointInput]);

  const updateRoute = (next) => {
    if (onUpdateRoutePoints) onUpdateRoutePoints(enforceInvariant(next.map(normalizePoint).filter(Boolean)));
  };

  // 1-Click Auto-populate complete route based on start point and end point
  const handleAutoPopulateCorridor = () => {
    if (corridorResult && corridorResult.recommendedCompleteRoute.length > 0) {
      updateRoute(corridorResult.recommendedCompleteRoute);
      setCorridorSuccessMsg(`✓ Complete route populated with ${corridorResult.recommendedCompleteRoute.length} stops from "${startPointInput.split(' ')[0]}" to "${endPointInput.split(' ')[0]}"!`);
      setTimeout(() => setCorridorSuccessMsg(''), 4500);
    }
  };

  // Move pin and discover nearby points when typing a location name
  useEffect(() => {
    if (pointName.trim().length >= 2) {
      const match = findCoordsForLocation(pointName);
      setPinnedCoords({ lat: match.lat, lng: match.lng });
      
      const searchRes = searchLocationsAndNearby(pointName, 6);
      if (searchRes.nearbySuggestions && searchRes.nearbySuggestions.length > 0) {
        setActiveNearbyPoints(searchRes.nearbySuggestions);
      }

      if (leafletInstance.current && window.L) {
        leafletInstance.current.setView([match.lat, match.lng], 10, { animate: true });
      }
    }
  }, [pointName]);

  // Live location search from OpenStreetMap (like Google Maps dropdown) — free, no key needed
  useEffect(() => {
    const q = pointName.trim();
    if (q.length < 3) {
      setOsmResults([]);
      setOsmLoading(false);
      return;
    }
    setOsmLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=8&countrycodes=in&q=${encodeURIComponent(q)}`
        );
        const data = await res.json();
        setOsmResults(Array.isArray(data) ? data : []);
      } catch {
        setOsmResults([]);
      } finally {
        setOsmLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [pointName]);

  // Init Leaflet once
  useEffect(() => {
    if (window.L && mapRef.current && !leafletInstance.current) {
      try {
        const map = window.L.map(mapRef.current, {
          center: [pinnedCoords.lat, pinnedCoords.lng],
          zoom: 9
        });

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);

        leafletInstance.current = map;

        // Click on map to pick a location
        map.on('click', (e) => {
          const lat = parseFloat(e.latlng.lat.toFixed(4));
          const lng = parseFloat(e.latlng.lng.toFixed(4));
          setPinnedCoords({ lat, lng });

          setPointName((prev) => prev || `Custom Location (${lat}, ${lng})`);
        });
      } catch (err) {
        console.error('Admin map error:', err);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Lock page scroll while the map is expanded, and refresh Leaflet when the container resizes
  useEffect(() => {
    if (fullView) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      if (leafletInstance.current) {
        setTimeout(() => leafletInstance.current.invalidateSize(), 60);
      }
    }
    return () => { document.body.style.overflow = ''; };
  }, [fullView]);

  // Render the full route on the map (Start → Pickups → Droppings → Destination) + all possible points
  useEffect(() => {
    if (leafletInstance.current && window.L) {
      const map = leafletInstance.current;

      overlayRef.current.markers.forEach(m => map.removeLayer(m));
      if (overlayRef.current.polyline) map.removeLayer(overlayRef.current.polyline);
      overlayRef.current.markers = [];
      overlayRef.current.polyline = null;

      const stopCoords = points.map(p => {
        const c = findCoordsForLocation(p.name);
        return [c.lat, c.lng];
      });

      // Connecting route line through every stop in order
      if (stopCoords.length >= 2) {
        overlayRef.current.polyline = window.L.polyline(stopCoords, {
          color: '#f59e0b',
          weight: 4,
          opacity: 0.85,
          dashArray: '8, 8'
        }).addTo(map);
      }

      // All possible selectable points (dim dots) — click to add to the route
      CANDIDATE_POINTS.forEach((cp) => {
        const alreadyAdded = points.some(p => p.name.toLowerCase() === cp.name.toLowerCase());
        if (alreadyAdded) return;
        const m = window.L.circleMarker([cp.lat, cp.lng], {
          radius: 5,
          color: '#94a3b8',
          fillColor: '#cbd5e1',
          fillOpacity: 0.5,
          weight: 1.5
        }).addTo(map);
        const cfg = POINT_TYPES[pointType];
        m.bindPopup(`<div style="font-family:sans-serif;font-size:12px;padding:4px;">
          <strong style="color:#0f172a;">${cp.name}</strong><br/>
          <span style="color:#475569;">${cp.lat}° N, ${cp.lng}° E</span><br/>
          <span style="color:#10b981;font-weight:700;">Click to add as ${cfg.icon} ${cfg.label}</span>
        </div>`);
        m.on('click', () => {
          setPinnedCoords({ lat: cp.lat, lng: cp.lng });
          setPointName(cp.name);
          addPointByName(cp.name);
        });
        overlayRef.current.markers.push(m);
      });

      // Configured route stops (color-coded by role)
      points.forEach((p, idx) => {
        const cfg = POINT_TYPES[p.type];
        const m = window.L.circleMarker(stopCoords[idx], {
          radius: p.type === 'start' || p.type === 'destination' ? 9 : 7,
          color: cfg.color,
          fillColor: cfg.color,
          fillOpacity: 0.35,
          weight: 3
        }).addTo(map);
        m.bindPopup(`<strong style="color: ${cfg.color};">${cfg.icon} ${cfg.label}: ${p.name}</strong>`);
        overlayRef.current.markers.push(m);
      });

      // Active pin (the point currently being typed / clicked)
      const activeM = window.L.marker([pinnedCoords.lat, pinnedCoords.lng]).addTo(map);
      activeM.bindPopup(`<strong>📍 Selected Pin: ${pointName || 'Click to set location'}</strong><br/>Coords: ${pinnedCoords.lat}° N, ${pinnedCoords.lng}° E`).openPopup();
      overlayRef.current.markers.push(activeM);

      const pts = [...stopCoords, [pinnedCoords.lat, pinnedCoords.lng]];
      if (pts.length) {
        map.fitBounds(window.L.latLngBounds(pts), { padding: [45, 45], maxZoom: 11 });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pinnedCoords, pointName, routePoints, pointType]);

  const addPointByName = (name, explicitType) => {
    // Resolve misspelled / partial names to the proper location name (e.g. "vyur" → Viyyur)
    const label = getCanonicalLocationName(name) || (name || '').trim();
    if (!label) return;

    const targetType = explicitType || pointType;
    const newPoint = { name: label, type: targetType };
    
    // If point already exists, update its type and enforce order
    let next = points.filter(p => p.name.toLowerCase() !== label.toLowerCase());

    const dropIdx = next.findIndex(p => p.type === 'dropping');
    const destIdx = next.findIndex(p => p.type === 'destination');

    if (targetType === 'start') {
      next = [newPoint, ...next.filter(p => p.type !== 'start')];
    } else if (targetType === 'destination') {
      next = [...next.filter(p => p.type !== 'destination'), newPoint];
    } else if (targetType === 'dropping') {
      next.splice(destIdx !== -1 ? destIdx : next.length, 0, newPoint);
    } else {
      // pickup goes before dropping / destination
      const insertAt = dropIdx !== -1 ? dropIdx : (destIdx !== -1 ? destIdx : next.length);
      next.splice(insertAt, 0, newPoint);
    }
    updateRoute(next);
  };

  const handleAddPoint = (explicitType) => {
    addPointByName(pointName, explicitType);
    setPointName('');
  };

  const handleSuggestionPick = (name) => {
    setPointName(name);
    setShowSuggestions(false);
    setOsmResults([]);
    const match = findCoordsForLocation(name);
    setPinnedCoords({ lat: match.lat, lng: match.lng });
    if (leafletInstance.current && window.L) {
      leafletInstance.current.setView([match.lat, match.lng], 10, { animate: true });
    }
  };

  const handleOsmPick = (item) => {
    const shortName = item.display_name
      ? item.display_name.split(',').slice(0, 3).join(',').trim()
      : String(item.name || 'Location');
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    setPointName(shortName);
    setShowSuggestions(false);
    setOsmResults([]);
    setPinnedCoords({ lat, lng });
    if (leafletInstance.current && window.L) {
      leafletInstance.current.setView([lat, lng], 13, { animate: true });
    }
  };

  const query = pointName.trim().toLowerCase();

  const handleQuickAddPreset = (presetKey) => {
    const hub = PRESET_HUB_COORDS[presetKey];
    if (!hub) return;
    setPinnedCoords({ lat: hub.lat, lng: hub.lng });
    setPointName(hub.name);
  };

  const handleRemovePoint = (idx) => {
    updateRoute(points.filter((_, i) => i !== idx));
  };

  const handleMovePoint = (idx, dir) => {
    const target = idx + dir;
    if (target < 0 || target >= points.length) return;
    const next = [...points];
    [next[idx], next[target]] = [next[target], next[idx]];
    updateRoute(next);
  };

  const handleClearAllAndResetRoute = () => {
    if (window.confirm('Clear the entire route (start, pickup & dropping points, destination) to build a brand new route from scratch?')) {
      updateRoute([]);
      setPointName('');
    }
  };

  const currentType = POINT_TYPES[pointType];

  // Connected-route link: open the full stop sequence in Google Maps
  const connectedRouteUrl = (() => {
    if (points.length < 2) return '';
    const origin = encodeURIComponent(points[0].name);
    const destination = encodeURIComponent(points[points.length - 1].name);
    const waypoints = points.slice(1, -1).map(p => encodeURIComponent(p.name)).join('|');
    let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    if (waypoints) url += `&waypoints=${waypoints}`;
    return url;
  })();

  return (
    <div style={{ background: 'rgba(6, 12, 23, 0.85)', border: '1px solid var(--border-gold)', borderRadius: '16px', padding: '1.2rem', marginBottom: '1.2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Navigation size={16} color="var(--gold-primary)" /> Route Builder — Start, Pickup, Dropping &amp; Destination
        </h4>
        <button
          type="button"
          onClick={handleClearAllAndResetRoute}
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            borderRadius: '10px',
            padding: '0.35rem 0.75rem',
            fontSize: '0.74rem',
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          <Trash2 size={13} /> Clear All &amp; Create New Route
        </button>
      </div>

      {/* Step-by-step workflow guide */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        flexWrap: 'wrap',
        padding: '0.55rem 0.85rem',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(239,68,68,0.06))',
        border: '1px solid rgba(212,175,55,0.3)',
        borderRadius: '12px',
        marginBottom: '0.8rem',
        fontSize: '0.76rem',
        color: 'var(--text-main)'
      }}>
        <Rocket size={14} color="var(--gold-primary)" />
        <span style={{ fontWeight: 800, color: 'var(--gold-light)' }}>Build order:</span>
        <span>🟢 <b>Start Location</b></span>
        <span>→</span>
        <span>🟡 <b>Pickup Points</b></span>
        <span>→</span>
        <span>🟣 <b>Dropping Points</b></span>
        <span>→</span>
        <span>🔴 <b>End / Destination</b></span>
        <span style={{ marginLeft: 'auto', color: 'var(--emerald-accent)', fontWeight: 800 }}>
          Adding: {currentType.icon} {currentType.label}
        </span>
      </div>

      {/* ─── 🛣️ START POINT & END DESTINATION CORRIDOR SELECTOR ─── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(10,25,47,0.95), rgba(6,12,23,0.98))',
        border: '1.5px solid var(--gold-primary)',
        borderRadius: '14px',
        padding: '1rem 1.1rem',
        marginBottom: '1rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fef08a', fontWeight: 800, fontSize: '0.86rem', fontFamily: 'var(--font-heading)' }}>
            <Compass size={17} color="var(--gold-primary)" /> Select Start Point &amp; Destination to Discover All En-Route Waypoints
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--emerald-accent)', fontWeight: 700 }}>
            ✨ Real-time corridor mapping active
          </span>
        </div>

        {/* Start Point & End Destination Dropdowns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem', marginBottom: '0.8rem' }}>
          {/* Start Point Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#10b981', marginBottom: '0.25rem' }}>
              🟢 Select Start Point
            </label>
            <select
              value={startPointInput}
              onChange={(e) => {
                const val = e.target.value;
                setStartPointInput(val);
                addPointByName(val, 'start');
              }}
              style={{
                width: '100%', background: '#040812', border: '1px solid #10b981',
                color: '#fff', padding: '0.5rem 0.8rem', borderRadius: '10px',
                fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', outline: 'none'
              }}
            >
              {[
                'Thrissur Swaraj Round Main Hub',
                'Thrissur Junction (TCR) Railway Station',
                'Cochin International Airport (COK)',
                'Ernakulam South (ERS) Junction',
                'Palakkad Junction & Fort Terminal',
                'Calicut (Kozhikode) Airport (CCJ)',
                'Coimbatore Junction & Airport',
                'Madurai Station & Airport'
              ].map((hub) => (
                <option key={hub} value={hub} style={{ background: '#040812', color: '#fff' }}>
                  🟢 {hub}
                </option>
              ))}
            </select>
          </div>

          {/* End Destination Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 800, color: '#ef4444', marginBottom: '0.25rem' }}>
              🔴 Select End Destination
            </label>
            <select
              value={endPointInput}
              onChange={(e) => {
                const val = e.target.value;
                setEndPointInput(val);
                addPointByName(val, 'destination');
              }}
              style={{
                width: '100%', background: '#040812', border: '1px solid #ef4444',
                color: '#fff', padding: '0.5rem 0.8rem', borderRadius: '10px',
                fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', outline: 'none'
              }}
            >
              {[
                'Kodaikanal Lake & Star Promenade',
                'Munnar Tea Gardens & Town Center',
                'Ooty (Udhagamandalam) Lake & Heritage Rail',
                'Kashi Vishwanath Temple & Varanasi Ghats',
                'Ayodhya Shri Ram Janmabhoomi Mandir',
                'Parambikulam Tiger Reserve Hub',
                'Silent Valley Entry Gate (Mukkali)',
                'Puri Shri Jagannath Temple & Grand Road',
                'Srinagar Dal Lake & Houseboat Boulevard',
                'Madurai Meenakshi Amman Temple'
              ].map((dest) => (
                <option key={dest} value={dest} style={{ background: '#040812', color: '#fff' }}>
                  🔴 {dest}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Corridor Waypoints Banner & 1-Click Auto-Populate */}
        {corridorResult && corridorResult.corridorStops.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(212,175,55,0.4)',
            borderRadius: '10px',
            padding: '0.65rem 0.85rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Layers size={13} color="var(--gold-primary)" />
                Detected {corridorResult.corridorStops.length} Corridor Waypoints between <b>{startPointInput.split(' ')[0]}</b> and <b>{endPointInput.split(' ')[0]}</b>:
              </span>
              <button
                type="button"
                className="btn-gold"
                onClick={handleAutoPopulateCorridor}
                style={{ padding: '0.35rem 0.85rem', fontSize: '0.74rem', gap: '0.35rem' }}
              >
                <Sparkles size={13} /> ⚡ Auto-Populate Complete Route ({corridorResult.corridorStops.length} stops)
              </button>
            </div>

            {corridorSuccessMsg && (
              <div style={{ color: '#10b981', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                {corridorSuccessMsg}
              </div>
            )}

            {/* Individual Waypoint Chips */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {corridorResult.corridorStops.map((stop, i) => {
                const alreadyInRoute = points.some(p => p.name.toLowerCase() === stop.name.toLowerCase());
                const cfg = POINT_TYPES[stop.type] || POINT_TYPES.pickup;
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => addPointByName(stop.name, stop.type)}
                    style={{
                      background: alreadyInRoute ? 'rgba(255,255,255,0.06)' : `${cfg.color}18`,
                      border: alreadyInRoute ? '1px solid rgba(255,255,255,0.15)' : `1px solid ${cfg.color}66`,
                      color: alreadyInRoute ? 'var(--text-muted)' : '#fff',
                      borderRadius: '12px',
                      padding: '0.2rem 0.55rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <span>{alreadyInRoute ? '✓' : '+'}</span>
                    <span>{cfg.icon} {stop.name.split(' ')[0]}</span>
                    <span style={{ fontSize: '0.62rem', opacity: 0.8, color: cfg.color }}>({cfg.short})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Point Type Selector */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
        {['start', 'pickup', 'dropping', 'destination'].map(t => {
          const cfg = POINT_TYPES[t];
          const active = pointType === t;
          return (
            <button
              key={t}
              type="button"
              onClick={() => setPointType(t)}
              style={{
                flex: 1,
                minWidth: '110px',
                padding: '0.45rem 0.6rem',
                borderRadius: '10px',
                cursor: 'pointer',
                background: active ? cfg.color : 'rgba(255,255,255,0.05)',
                border: active ? '1px solid transparent' : '1px solid rgba(255,255,255,0.15)',
                color: active ? '#000' : '#fff',
                fontSize: '0.74rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.3rem',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{cfg.icon}</span> {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Quick Preset Hub Shortcuts */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, alignSelf: 'center', marginRight: '0.3rem' }}>Quick Presets:</span>
        {Object.keys(PRESET_HUB_COORDS).slice(0, 6).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleQuickAddPreset(key)}
            style={{
              background: 'rgba(212,175,55,0.12)', border: '1px solid var(--border-gold)',
              color: 'var(--gold-light)', borderRadius: '14px', padding: '0.2rem 0.6rem',
              fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer'
            }}
          >
            + {PRESET_HUB_COORDS[key].name.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Type or Pick Location Input */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <input
              type="text"
              value={pointName}
              onChange={(e) => {
                setPointName(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddPoint();
                }
              }}
              placeholder={`Type a location name or word for the ${currentType.label.toLowerCase()} (e.g. Swaraj Round, Cochin Airport, Munnar, Kashi)...`}
              style={{ width: '100%', background: '#040812', border: '1px solid var(--border-gold)', borderRadius: '10px', color: '#fff', padding: '0.55rem 0.85rem 0.55rem 2.2rem', fontSize: '0.84rem', outline: 'none' }}
            />
            <Search size={14} color="var(--gold-primary)" style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)' }} />

            {/* Smart Categorized Suggestions & Live Google-Maps-Style OSM Search */}
            {showSuggestions && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 50,
                background: '#091426', border: '1px solid var(--border-gold)', borderRadius: '12px',
                boxShadow: '0 12px 35px rgba(0,0,0,0.75)', overflow: 'auto', maxHeight: '340px'
              }}>
                {/* Categorized database matches */}
                {(() => {
                  const searchRes = searchLocationsAndNearby(pointName, 16);
                  const qLower = (pointName || '').trim().toLowerCase();
                  const regionHits = searchRes.matches.filter(m => (m.region || '').toLowerCase().includes(qLower));
                  const regionLabel = (regionHits.length > 0 && regionHits.length === searchRes.matches.length && qLower.length >= 3)
                    ? regionHits[0].region
                    : '';
                  return (
                    <>
                      {searchRes.matches.length > 0 && (
                        <div>
                          <div style={{ padding: '0.45rem 0.8rem 0.25rem', fontSize: '0.66rem', fontWeight: 900, color: 'var(--gold-light)', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <span>📍 {regionLabel ? `ALL LOCATIONS IN ${regionLabel.toUpperCase()} — HUBS, ATTRACTIONS & ROUTE POINTS` : 'VERIFIED TRAVEL HUBS & ATTRACTIONS'}</span>
                            <span style={{ color: 'var(--text-muted)' }}>{searchRes.matches.length} found</span>
                          </div>
                          {searchRes.matches.map((item, idx) => {
                            const cat = LOCATION_CATEGORIES[item.category] || LOCATION_CATEGORIES.landmark;
                            return (
                              <div
                                key={`match-${idx}`}
                                style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                                  background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.04)',
                                  color: '#fff', padding: '0.45rem 0.8rem', fontSize: '0.78rem', gap: '0.5rem'
                                }}
                              >
                                <div
                                  onClick={() => handleSuggestionPick(item.name)}
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', cursor: 'pointer', flex: 1 }}
                                >
                                  <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{cat.icon}</span>
                                  <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                      {item.name}
                                    </div>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                      {cat.label} • {item.region}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                                  <button
                                    type="button"
                                    onClick={() => { addPointByName(item.name, 'start'); setShowSuggestions(false); }}
                                    title="Add as Start Location"
                                    style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', color: '#10b981', borderRadius: '6px', padding: '0.15rem 0.4rem', fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer' }}
                                  >
                                    + Start
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { addPointByName(item.name, 'pickup'); setShowSuggestions(false); }}
                                    title="Add as Pickup Point"
                                    style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid var(--border-gold)', color: '#fef08a', borderRadius: '6px', padding: '0.15rem 0.4rem', fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer' }}
                                  >
                                    + Pickup
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { addPointByName(item.name, 'dropping'); setShowSuggestions(false); }}
                                    title="Add as Dropping Point"
                                    style={{ background: 'rgba(168,85,247,0.2)', border: '1px solid #a855f7', color: '#c084fc', borderRadius: '6px', padding: '0.15rem 0.4rem', fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer' }}
                                  >
                                    + Drop
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { addPointByName(item.name, 'destination'); setShowSuggestions(false); }}
                                    title="Add as Destination"
                                    style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#f87171', borderRadius: '6px', padding: '0.15rem 0.4rem', fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer' }}
                                  >
                                    + End
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Typo / misspelling correction suggestions (e.g. "vyur" → Viyyur) */}
                      {searchRes.fuzzyMatches.length > 0 && (
                        <div>
                          <div style={{ padding: '0.45rem 0.8rem 0.25rem', fontSize: '0.66rem', fontWeight: 900, color: '#4ade80', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                            <span>🔎 DID YOU MEAN?</span>
                            <span style={{ color: 'var(--text-muted)' }}>
                              <strong style={{ color: '#4ade80' }}>"{pointName.trim()}"</strong> → {searchRes.fuzzyMatches.length} match(es)
                            </span>
                          </div>
                          {searchRes.fuzzyMatches.map((item, idx) => {
                            const cat = LOCATION_CATEGORIES[item.category] || LOCATION_CATEGORIES.landmark;
                            const canonical = getCanonicalLocationName(pointName);
                            return (
                              <div
                                key={`fuzzy-${idx}`}
                                style={{
                                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                                  background: 'rgba(74,222,128,0.04)', borderBottom: '1px solid rgba(255,255,255,0.04)',
                                  color: '#fff', padding: '0.45rem 0.8rem', fontSize: '0.78rem', gap: '0.5rem'
                                }}
                              >
                                <div
                                  onClick={() => handleSuggestionPick(item.name)}
                                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden', cursor: 'pointer', flex: 1 }}
                                >
                                  <span style={{ fontSize: '0.9rem', flexShrink: 0 }}>{cat.icon}</span>
                                  <div style={{ overflow: 'hidden' }}>
                                    <div style={{ fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#86efac' }}>
                                      {canonical && canonical !== item.name ? `${canonical}` : item.name}
                                    </div>
                                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                                      {cat.label} • {item.region}
                                    </div>
                                  </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                                  <button
                                    type="button"
                                    onClick={() => { addPointByName(item.name, 'start'); setShowSuggestions(false); }}
                                    title="Add as Start Location"
                                    style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', color: '#10b981', borderRadius: '6px', padding: '0.15rem 0.4rem', fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer' }}
                                  >
                                    + Start
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { addPointByName(item.name, 'pickup'); setShowSuggestions(false); }}
                                    title="Add as Pickup Point"
                                    style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid var(--border-gold)', color: '#fef08a', borderRadius: '6px', padding: '0.15rem 0.4rem', fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer' }}
                                  >
                                    + Pickup
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { addPointByName(item.name, 'destination'); setShowSuggestions(false); }}
                                    title="Add as Destination"
                                    style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#f87171', borderRadius: '6px', padding: '0.15rem 0.4rem', fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer' }}
                                  >
                                    + End
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  );
                })()}

                {/* OpenStreetMap Live Query for arbitrary locations */}
                {query.length >= 3 && (
                  <div style={{ padding: '0.4rem 0.8rem 0.2rem', fontSize: '0.64rem', fontWeight: 900, color: '#4ade80', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.3rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                    <span>🌐 LIVE GOOGLE MAP / OPENSTREETMAP SEARCH</span>
                    {osmLoading && <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>searching…</span>}
                  </div>
                )}

                {osmResults.map((item, i) => (
                  <div
                    key={`osm-${i}`}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%',
                      background: 'transparent', borderBottom: '1px solid rgba(255,255,255,0.04)',
                      color: '#fff', padding: '0.45rem 0.8rem', fontSize: '0.78rem', gap: '0.5rem'
                    }}
                  >
                    <div
                      onClick={() => handleOsmPick(item)}
                      style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.1rem', overflow: 'hidden', cursor: 'pointer', flex: 1 }}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', width: '100%', whiteSpace: 'nowrap', overflow: 'hidden' }}>
                        <Search size={12} color="#4ade80" style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 700 }}>
                          {item.display_name.split(',').slice(0, 3).join(',').trim()}
                        </span>
                      </span>
                      <span style={{ fontSize: '0.66rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', paddingLeft: '1.2rem' }}>
                        {item.display_name}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => {
                          const short = item.display_name ? item.display_name.split(',').slice(0, 3).join(',').trim() : String(item.name);
                          addPointByName(short, 'start');
                          setShowSuggestions(false);
                        }}
                        style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', color: '#10b981', borderRadius: '6px', padding: '0.15rem 0.4rem', fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        + Start
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const short = item.display_name ? item.display_name.split(',').slice(0, 3).join(',').trim() : String(item.name);
                          addPointByName(short, 'pickup');
                          setShowSuggestions(false);
                        }}
                        style={{ background: 'rgba(212,175,55,0.2)', border: '1px solid var(--border-gold)', color: '#fef08a', borderRadius: '6px', padding: '0.15rem 0.4rem', fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer' }}
                      >
                        + Pickup
                      </button>
                    </div>
                  </div>
                ))}

                {osmLoading && !osmResults.length && (
                  <div style={{ padding: '0.5rem 0.8rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>🔍 Searching live location pins…</div>
                )}
              </div>
            )}
          </div>

          <button
            type="button"
            className="btn-gold"
            onClick={handleAddPoint}
            style={{ padding: '0.5rem 1.1rem', fontSize: '0.8rem', gap: '0.35rem' }}
          >
            <Plus size={15} /> Add {currentType.short}
          </button>
        </div>

        {/* ✨ NEARBY POINTS DISCOVERY RIBBON (Based on Starting Point & Active Location) */}
        {(() => {
          // Derive nearby suggestions from starting point or currently typed point
          const startLocationName = (points.find(p => p.type === 'start') || points[0])?.name || pointName || 'Thrissur';
          const resolved = resolveLocationCoords(startLocationName);
          const nearbyList = (resolved.nearby && resolved.nearby.length > 0)
            ? resolved.nearby
            : (activeNearbyPoints.length > 0 ? activeNearbyPoints : []);

          if (!nearbyList.length) return null;

          return (
            <div style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.09), rgba(16,185,129,0.07))',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: '12px',
              padding: '0.55rem 0.85rem',
              marginTop: '0.2rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Sparkles size={13} color="var(--gold-primary)" />
                  Nearby Points from Starting Hub (<b>{startLocationName.split(' ')[0]}</b>):
                </span>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  Click + to add directly into route sequence
                </span>
              </div>
              
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {nearbyList.map((nbName, i) => {
                  const alreadyInRoute = points.some(p => p.name.toLowerCase() === nbName.toLowerCase());
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => addPointByName(nbName)}
                      disabled={alreadyInRoute}
                      style={{
                        background: alreadyInRoute ? 'rgba(255,255,255,0.05)' : 'rgba(212,175,55,0.14)',
                        border: alreadyInRoute ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--border-gold)',
                        color: alreadyInRoute ? 'var(--text-muted)' : '#fef08a',
                        borderRadius: '14px',
                        padding: '0.2rem 0.6rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: alreadyInRoute ? 'not-allowed' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <span>{alreadyInRoute ? '✓' : '+'}</span>
                      <span>{nbName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}

      </div>

      {/* Interactive Map Canvas Element (Full View expands to fullscreen) */}
      <div style={{
        position: fullView ? 'fixed' : 'relative',
        inset: fullView ? '0' : undefined,
        zIndex: fullView ? 10000 : undefined,
        height: fullView ? '100vh' : '280px',
        width: fullView ? '100%' : undefined,
        borderRadius: fullView ? '0' : '12px',
        overflow: 'hidden',
        border: '1px solid var(--border-gold)',
        marginBottom: fullView ? '0' : '1rem',
        background: '#02060e'
      }}>
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />

        {/* Full View Toggle */}
        <button
          type="button"
          onClick={() => setFullView(v => !v)}
          style={{
            position: 'absolute', top: '0.6rem', left: '0.6rem', zIndex: 20,
            background: 'rgba(6,12,23,0.9)', border: '1px solid var(--border-gold)',
            color: 'var(--gold-light)', borderRadius: '8px', padding: '0.35rem 0.7rem',
            fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '0.3rem'
          }}
        >
          {fullView ? <Minimize2 size={14} /> : <Maximize2 size={14} />} {fullView ? 'Minimize' : 'Full View'}
        </button>
        <div style={{ position: 'absolute', bottom: '0.6rem', left: '0.6rem', zIndex: 10, background: 'rgba(6,12,23,0.9)', border: '1px solid var(--border-gold)', borderRadius: '8px', padding: '0.35rem 0.7rem', fontSize: '0.7rem', color: 'var(--gold-light)', fontWeight: 700 }}>
          Pin Coords: {pinnedCoords.lat}° N, {pinnedCoords.lng}° E | Click map to move pin
        </div>

        {/* Map Legend */}
        <div style={{
          position: 'absolute', top: '0.6rem', right: '0.6rem', zIndex: 10,
          background: 'rgba(6,12,23,0.92)', border: '1px solid var(--border-gold)',
          borderRadius: '10px', padding: '0.45rem 0.7rem', fontSize: '0.66rem',
          color: '#fff', fontWeight: 700, display: 'flex', flexDirection: 'column', gap: '0.25rem'
        }}>
          <span style={{ color: 'var(--gold-light)' }}>Map Legend</span>
          <span><span style={{ color: '#10b981' }}>●</span> Start</span>
          <span><span style={{ color: '#d4af37' }}>●</span> Pickup</span>
          <span><span style={{ color: '#a855f7' }}>●</span> Dropping</span>
          <span><span style={{ color: '#ef4444' }}>●</span> Destination</span>
          <span>          <span style={{ color: '#cbd5e1' }}>○</span> Available — click to add</span>
        </div>
      </div>

      {/* Connected Route in Google Maps */}
      <a
        href={connectedRouteUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: connectedRouteUrl ? 'inline-flex' : 'none',
          alignItems: 'center', gap: '0.35rem',
          background: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.5)',
          color: '#fbbf24',
          borderRadius: '10px',
          padding: '0.45rem 0.85rem',
          fontSize: '0.74rem',
          fontWeight: 800,
          textDecoration: 'none',
          marginBottom: '0.8rem'
        }}
      >
        🧭 View Connected Route in Google Maps <ExternalLink size={13} />
      </a>


      {/* Ordered Route Stops List */}
      <div>
        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
          <Flag size={14} color="var(--gold-primary)" /> Route Sequence ({points.length}) — Start → Pickups → Droppings → Destination
        </span>

        {points.length === 0 ? (
          <div style={{
            padding: '1rem',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.03)',
            border: '1px dashed rgba(212,175,55,0.4)',
            borderRadius: '10px',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}>
            No route stops yet. Pick a point type above, then type or select a location name and click <b style={{ color: 'var(--gold-light)' }}>Add</b>.
            The <b style={{ color: '#10b981' }}>Start Location</b> comes first and the <b style={{ color: '#ef4444' }}>End Destination</b> comes last.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
            {points.map((p, idx) => {
              const cfg = POINT_TYPES[p.type];
              return (
                <div
                  key={`${idx}-${p.name}`}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${cfg.color}55`,
                    borderRadius: '8px',
                    padding: '0.35rem 0.6rem',
                    fontSize: '0.75rem',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <span
                    style={{
                      flexShrink: 0,
                      minWidth: '68px',
                      textAlign: 'center',
                      borderRadius: '8px',
                      padding: '0.1rem 0.4rem',
                      fontSize: '0.6rem',
                      fontWeight: 900,
                      color: '#000',
                      background: cfg.color
                    }}
                  >
                    {cfg.short}
                  </span>
                  <span style={{ flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {cfg.icon} {p.name}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', flexShrink: 0 }}>
                    <button
                      type="button"
                      onClick={() => handleMovePoint(idx, -1)}
                      disabled={idx === 0}
                      title="Move up"
                      style={{ background: 'none', border: 'none', color: idx === 0 ? 'rgba(255,255,255,0.15)' : 'var(--gold-light)', cursor: idx === 0 ? 'not-allowed' : 'pointer', padding: '0.15rem' }}
                    >
                      <ArrowUp size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMovePoint(idx, 1)}
                      disabled={idx === points.length - 1}
                      title="Move down"
                      style={{ background: 'none', border: 'none', color: idx === points.length - 1 ? 'rgba(255,255,255,0.15)' : 'var(--gold-light)', cursor: idx === points.length - 1 ? 'not-allowed' : 'pointer', padding: '0.15rem' }}
                    >
                      <ArrowDown size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePoint(idx)}
                      title="Remove stop"
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.15rem' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
