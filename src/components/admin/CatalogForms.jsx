import React, { useState, useEffect, useRef } from 'react';
import { X, Package, Image as ImageIcon, BookOpen, Save, MonitorPlay, Sparkles, Compass, Eye, Check, Navigation } from 'lucide-react';
import { DESTINATIONS } from '../../data/destinationsData';
import ImageUploader from './ImageUploader';
import AiPlaceImageSelector from './AiPlaceImageSelector';
import ItemImagePicker from './ItemImagePicker';
import AdminMapPointPicker from './AdminMapPointPicker';
import { generateAiDestinationGuide } from '../../services/aiDestinationGenerator';
import AiDestinationGuideModal from '../AiDestinationGuideModal';

const fieldStyle = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid var(--border-gold)',
  borderRadius: '10px',
  color: '#fff',
  padding: '0.7rem 1rem',
  fontSize: '0.9rem',
  outline: 'none',
  fontFamily: 'var(--font-body)'
};

const selectFieldStyle = {
  ...fieldStyle,
  background: '#091426',
  color: '#fef08a',
  cursor: 'pointer'
};

const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  color: 'var(--text-muted)',
  marginBottom: '0.35rem',
  fontWeight: 600
};

const PRESET_BADGES = [
  '🔥 Bestseller',
  '✨ New Launch',
  '🌟 Signature Yatra',
  '⚡ Upcoming Departure',
  '👑 Luxury Retreat',
  '🌴 Kerala Special',
  '💎 Premium Pilgrimage',
  '⭐ Highly Recommended'
];

export function AdminFormModal({ title, icon: Icon, onClose, children, fullscreen = false, dirty = false }) {
  const requestClose = () => {
    if (dirty && !window.confirm('You have unsaved changes in this form. Discard them and close?')) return;
    onClose();
  };
  return (
    <div className="modal-overlay" style={{ zIndex: 10002, padding: fullscreen ? '0' : undefined, alignItems: fullscreen ? 'stretch' : undefined }} onClick={requestClose}>
      <div
        className="glass-card"
        style={{
          maxWidth: fullscreen ? 'none' : '660px',
          width: fullscreen ? '100vw' : '100%',
          height: fullscreen ? '100vh' : undefined,
          maxHeight: fullscreen ? 'none' : '88vh',
          overflowY: 'auto',
          padding: fullscreen ? '2rem 2.5rem' : '1.8rem',
          background: '#081222',
          border: fullscreen ? 'none' : '1px solid var(--border-gold)',
          borderRadius: fullscreen ? '0' : undefined,
          cursor: 'default'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
          <h3 style={{ color: 'var(--gold-light)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            <Icon size={20} color="var(--gold-primary)" /> {title}
          </h3>
          <button
            onClick={requestClose}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-gold)',
              color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function FormActions({ onCancel }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
      <button type="button" className="btn-glass" onClick={onCancel} style={{ flex: 1, justifyContent: 'center' }}>
        Cancel
      </button>
      <button type="submit" className="btn-gold" style={{ flex: 2, justifyContent: 'center' }}>
        <Save size={16} /> Save Changes
      </button>
    </div>
  );
}

const toList = (str = '') => str.split('\n').map(s => s.trim()).filter(Boolean);

const formatAsString = (val, separator = ', ', fallback = []) => {
  if (Array.isArray(val)) return val.join(separator);
  if (typeof val === 'string') return val;
  return Array.isArray(fallback) ? fallback.join(separator) : '';
};

// Route point: { name, type } where type ∈ start | pickup | dropping | destination
const normalizeRoutePoint = (p) => {
  if (typeof p === 'string') return { name: p.trim(), type: 'pickup' };
  if (p && typeof p === 'object') {
    const type = ['start', 'pickup', 'dropping', 'destination'].includes(p.type) ? p.type : 'pickup';
    return { name: String(p.name || '').trim(), type };
  }
  return null;
};

// Route invariant: first = Start, last = Destination
const enforceRouteOrder = (points) => {
  const list = points.map(normalizeRoutePoint).filter(p => p && p.name);
  if (list.length) {
    list[0].type = 'start';
    list[list.length - 1].type = 'destination';
  }
  return list;
};

// Ordered route: first = Start, last = Destination. Migrates legacy pickupPoints/dropPoints.
const resolveRoutePoints = (initial) => {
  if (Array.isArray(initial?.routePoints) && initial.routePoints.length) {
    return enforceRouteOrder(initial.routePoints);
  }
  const list = [];
  const push = (val, type) => {
    const arr = Array.isArray(val) ? val : typeof val === 'string' ? val.split(',') : [];
    arr.map(normalizeRoutePoint).filter(Boolean).forEach(p => {
      if (!list.some(x => x.name.toLowerCase() === p.name.toLowerCase())) {
        list.push({ ...p, type });
      }
    });
  };
  push(initial?.pickupPoints, 'pickup');
  push(initial?.dropPoints, 'dropping');
  return enforceRouteOrder(list);
};

// Helper to resolve clean location keyword from text or destination
const resolveLocationKeyword = (title = '', subtitle = '', destId = '', inputLoc = '') => {
  const combined = `${title} ${subtitle} ${destId} ${inputLoc}`.toLowerCase();
  if (combined.includes('kodaikanal') || combined.includes('kodai')) return 'Kodaikanal';
  if (combined.includes('munnar')) return 'Munnar';
  if (combined.includes('ooty') || combined.includes('nilgiri')) return 'Ooty';
  if (combined.includes('kochi') || combined.includes('cochin') || combined.includes('ernakulam')) return 'Kochi';
  if (combined.includes('kollam') || combined.includes('quilon')) return 'Kollam';
  if (combined.includes('wayanad')) return 'Wayanad';
  if (combined.includes('athirappilly')) return 'Athirappilly';
  if (combined.includes('silent valley')) return 'Silent Valley';
  if (combined.includes('ayodhya')) return 'Ayodhya';
  if (combined.includes('kashi') || combined.includes('varanasi')) return 'Kashi';
  if (combined.includes('kashmir') || combined.includes('gulmarg') || combined.includes('pahalgam') || combined.includes('srinagar')) return 'Kashmir';
  if (combined.includes('parambikulam')) return 'Parambikulam';
  if (combined.includes('puri') || combined.includes('jagannath') || combined.includes('konark') || combined.includes('bhubaneswar')) return 'Puri';
  if (combined.includes('tiruchendur') || combined.includes('thenkasi')) return 'Tiruchendur';
  if (combined.includes('gundlupet')) return 'Gundlupet';
  if (combined.includes('horanadu')) return 'Horanadu';
  
  return title.trim() || inputLoc.trim() || 'Ooty';
};

const resolveDestinationIdFromKeyword = (key = '') => {
  const k = key.toLowerCase();
  if (k.includes('kodaikanal') || k.includes('kodai')) return 'kodaikanal-princess-hills';
  if (k.includes('munnar')) return 'munnar-tea-plantations';
  if (k.includes('ooty') || k.includes('nilgiri')) return 'ooty-nilgiri-hills';
  if (k.includes('kochi') || k.includes('cochin') || k.includes('ernakulam')) return 'kochi-heritage-harbor';
  if (k.includes('kollam') || k.includes('quilon')) return 'kollam-ashtamudi-lake';
  if (k.includes('wayanad')) return 'wayanad-misty-hills';
  if (k.includes('athirappilly')) return 'athirappilly-waterfalls';
  if (k.includes('silent valley')) return 'silent-valley-national-park';
  if (k.includes('ayodhya')) return 'ayodhya-ram-mandir';
  if (k.includes('kashi') || k.includes('varanasi')) return 'kashi-varanasi';
  if (k.includes('kashmir')) return 'kashmir-punjab-golden-trail';
  if (k.includes('parambikulam')) return 'parambikulam-tiger-reserve';
  if (k.includes('puri') || k.includes('jagannath')) return 'puri-jagannath';
  if (k.includes('konark')) return 'konark-sun-temple';
  if (k.includes('lingaraj') || k.includes('bhubaneswar')) return 'lingaraj-bhubaneswar';
  if (k.includes('tiruchendur')) return 'tiruchendur-murugan';
  if (k.includes('thenkasi')) return 'thenkasi-viswanathar';
  if (k.includes('gundlupet')) return 'gundlupet-sunflowers';
  if (k.includes('horanadu')) return 'annapoorneshwari-horanadu';
  return DESTINATIONS[0]?.id || 'ooty-nilgiri-hills';
};

export function TourForm({ initial, onSave, onCancel, onDirtyChange }) {
  const defaultDest = DESTINATIONS.find(d => d.id === initial?.destinationId) || DESTINATIONS[0] || {};
  const defaultLoc = resolveLocationKeyword(initial?.title, initial?.subtitle, initial?.destinationId, defaultDest.name);

  const [form, setForm] = useState({
    title: initial?.title || '',
    subtitle: initial?.subtitle || '',
    destinationId: initial?.destinationId || defaultDest.id || '',
    duration: initial?.duration || defaultDest.duration || '3 Days / 2 Nights',
    price: initial?.price || defaultDest.startingPrice || '',
    originalPrice: initial?.originalPrice || (defaultDest.startingPrice ? Math.round(defaultDest.startingPrice * 1.2) : ''),
    badge: initial?.badge || 'New Launch',
    image: initial?.image || defaultDest.heroImage || './ooty-toy-train-real.jpg',
    bgMixImages: initial?.bgMixImages || defaultDest.bgMixImages || [defaultDest.heroImage || './ooty-toy-train-real.jpg'],
    bgMixStyle: initial?.bgMixStyle || 'collage-blend',
    mainPlaces: formatAsString(initial?.mainPlaces, ', ', defaultDest.nearbyAttractions?.map(a => a.name) || []),
    included: formatAsString(initial?.included, '\n', defaultDest.highlights || []),
    sightseeing: initial?.sightseeing || [],
    highlights: initial?.highlights || [],
    routePoints: resolveRoutePoints(initial)
  });

  const [aiLocationInput, setAiLocationInput] = useState(defaultLoc);
  const [isPreviewGuideOpen, setIsPreviewGuideOpen] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState('');

  // Report to the parent when the admin starts changing the form, so closing it
  // can warn about unsaved work.
  const firstRenderRef = useRef(true);
  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      return;
    }
    if (onDirtyChange) onDirtyChange(true);
  }, [form, onDirtyChange]);

  // Multi-step wizard navigation: 0 = Package Basics, 1 = Tourist Places & Images, 2 = Start & Pickup Route
  const TOUR_FORM_STEPS = [
    { key: 'basics', label: 'Package Basics', icon: '📝', hint: 'Name & pricing' },
    { key: 'places', label: 'Tourist Places & Images', icon: '🖼️', hint: 'Pick spots & photos' },
    { key: 'route', label: 'Start & Pickup Route', icon: '🗺️', hint: 'Map start & pickup points' }
  ];
  const [activeStep, setActiveStep] = useState(0);
  const stepCompleteFlags = {
    0: Boolean((form.title || '').trim() && (form.destinationId || '').trim() && form.price),
    1: Boolean((form.image || '').trim() && (form.mainPlaces || '').trim() && form.bgMixImages?.length),
    2: Boolean((form.routePoints || []).length >= 2)
  };

  const handleStepNavigation = (dir) => {
    const target = activeStep + dir;
    if (target < 0 || target > TOUR_FORM_STEPS.length - 1) return;
    setActiveStep(target);
  };

  // Handle Linked Destination dropdown change
  const handleDestinationChange = (e) => {
    const newDestId = e.target.value;
    const dest = DESTINATIONS.find(d => d.id === newDestId);
    if (dest) {
      const locKey = resolveLocationKeyword('', '', dest.id, dest.name);
      setAiLocationInput(locKey);
      setForm(prev => ({
        ...prev,
        destinationId: newDestId,
        image: prev.image === defaultDest.heroImage || !prev.image ? dest.heroImage : prev.image,
        bgMixImages: dest.bgMixImages || [dest.heroImage],
        duration: prev.duration || dest.duration || '3 Days / 2 Nights',
        price: prev.price || dest.startingPrice || '',
        originalPrice: prev.originalPrice || (dest.startingPrice ? Math.round(dest.startingPrice * 1.2) : '')
      }));
      setAiStatusMessage(`📍 Linked destination switched to "${dest.name}". Image studio & AI suggestions synchronized!`);
      setTimeout(() => setAiStatusMessage(''), 3500);
    } else {
      setForm(prev => ({ ...prev, destinationId: newDestId }));
    }
  };

  const handleAutoFillFromAiGuide = () => {
    if (!aiLocationInput.trim()) return;
    const guideData = generateAiDestinationGuide(aiLocationInput);
    
    const placeNames = guideData.attractions ? guideData.attractions.slice(0, 5).map(a => a.name).join(', ') : '';
    const itineraryText = guideData.oneDayItinerary ? guideData.oneDayItinerary.map(slot => `• ${slot.time} - ${slot.title} (${slot.place}): ${slot.desc}`).join('\n') : '';
    const highlightsText = guideData.attractions ? guideData.attractions.slice(0, 4).map(a => `✓ ${a.name} (${a.distance}): ${a.openingHours} | Fee: ${a.entryFee}`).join('\n') : '';
    const fullIncludedText = `${highlightsText}\n\n1-DAY OPTIMIZED SIGHTSEEING TIMETABLE:\n${itineraryText}`;
    const matchingDestId = resolveDestinationIdFromKeyword(aiLocationInput);

    setForm(prev => ({
      ...prev,
      destinationId: matchingDestId || prev.destinationId,
      title: `${guideData.locationName} Expedition & Highlights Trail`,
      subtitle: `Thrissur Departure Special • ${guideData.attractions?.length || 5}+ Sightseeing Spots & 1-Day Itinerary`,
      duration: prev.duration || '3 Days / 2 Nights',
      price: prev.price || 16999,
      originalPrice: prev.originalPrice || 19999,
      badge: 'AI Curated Special',
      image: guideData.heroImage || prev.image,
      bgMixImages: guideData.attractions?.map(a => a.image).slice(0, 4) || prev.bgMixImages,
      mainPlaces: placeNames,
      included: fullIncludedText
    }));

    setAiStatusMessage(`✨ Auto-filled tour package details for "${guideData.locationName}"!`);
    setTimeout(() => setAiStatusMessage(''), 4500);
  };

  const handleAutoFillFromAiStudio = (packageData) => {
    const matchingDestId = resolveDestinationIdFromKeyword(packageData.title || packageData.destinationId || aiLocationInput);
    setForm(prev => ({
      ...prev,
      title: packageData.title || prev.title,
      subtitle: packageData.subtitle || prev.subtitle,
      duration: packageData.duration || prev.duration,
      price: packageData.price || prev.price,
      originalPrice: packageData.originalPrice || prev.originalPrice,
      badge: packageData.badge || prev.badge,
      image: packageData.image || prev.image,
      bgMixImages: packageData.bgMixImages || prev.bgMixImages,
      bgMixStyle: packageData.bgMixStyle || prev.bgMixStyle,
      mainPlaces: packageData.mainPlaces || prev.mainPlaces,
      included: packageData.included || prev.included,
      destinationId: matchingDestId || packageData.destinationId || prev.destinationId
    }));
    const newLoc = resolveLocationKeyword(packageData.title, packageData.subtitle, packageData.destinationId);
    setAiLocationInput(newLoc);
    setAiStatusMessage(`⚡ Auto-filled complete package from AI Studio: ${packageData.title}`);
    setTimeout(() => setAiStatusMessage(''), 4500);
  };

  // Intelligent AI Package Name & Slogan Generator based on location/title
  const [suggestedTitles, setSuggestedTitles] = useState([]);
  const [showTitleSuggester, setShowTitleSuggester] = useState(false);

  const generateTitleSuggestions = (keyword) => {
    const locKeyword = resolveLocationKeyword(keyword, form.subtitle, form.destinationId, aiLocationInput);
    const locLower = locKeyword.toLowerCase();
    
    let presets = [];
    if (locLower.includes('ooty') || locLower.includes('nilgiri')) {
      presets = [
        { title: 'Queen of Nilgiris: Ooty Heritage Toy Train & Tea Highlands Yatra', slogan: 'Thrissur Departure Special • Reserved UNESCO Steam Train & Ooty Lake Boating', duration: '3 Days / 2 Nights', price: 14999, badge: '🔥 Bestseller', places: 'Ooty Toy Train, Botanical Garden, Doddabetta Peak, Pykara Falls', destId: 'ooty-nilgiri-hills', loc: 'Ooty' },
        { title: 'Ooty Emerald Tea Plantations & Doddabetta Mountain Summit Trail', slogan: 'Misty High Altitude Retreat with Italian Sunken Glasshouse & Lake Cycling', duration: '3 Days / 2 Nights', price: 15999, badge: '✨ New Launch', places: 'Doddabetta Peak, Ooty Lake, Rose Garden, Highfield Tea Factory', destId: 'ooty-nilgiri-hills', loc: 'Ooty' },
        { title: 'Ooty & Mudumalai Wildlife Safari with Coonoor Heritage Express', slogan: 'Bengal Tiger Safari, Theppakadu Elephant Camp & Sim’s Park High Tea', duration: '4 Days / 3 Nights', price: 19999, badge: '👑 Luxury Retreat', places: 'Mudumalai Tiger Reserve, Coonoor Sim’s Park, Ooty Lake, Avalanche', destId: 'ooty-nilgiri-hills', loc: 'Ooty' }
      ];
    } else if (locLower.includes('kodaikanal') || locLower.includes('kodai')) {
      presets = [
        { title: 'Princess of Hill Stations: Kodaikanal Star Lake & Pine Forest Yatra', slogan: 'Pedal Boating, Coaker’s 180° Valley Walk & Manjummel Guna Caves Roots', duration: '3 Days / 2 Nights', price: 15999, badge: '🔥 Bestseller', places: 'Kodaikanal Lake, Bryant Park, Coaker’s Walk, Pillar Rocks, Pine Forest', destId: 'kodaikanal-princess-hills', loc: 'Kodaikanal' },
        { title: 'Kodaikanal Mist & Mannavanur Switzerland Sheep Farm Retreat', slogan: 'Highland Coracle Boating, Poombarai Terraced Garlic Village & Dolphin’s Nose', duration: '4 Days / 3 Nights', price: 19999, badge: '👑 Luxury Retreat', places: 'Mannavanur Lake, Poombarai Temple, Dolphin’s Nose, Green Valley', destId: 'kodaikanal-princess-hills', loc: 'Kodaikanal' },
        { title: 'Kodai Romantic Valley: Pillar Rocks & Silver Cascade Waterfalls', slogan: '400ft Granite Spires, Bryant Rose Gardens & Sunset at Suicide Point', duration: '3 Days / 2 Nights', price: 16999, badge: '✨ New Launch', places: 'Pillar Rocks, Silver Cascade, Bryant Park, Kodai Star Lake', destId: 'kodaikanal-princess-hills', loc: 'Kodaikanal' }
      ];
    } else if (locLower.includes('munnar')) {
      presets = [
        { title: 'Emerald Munnar: Kolukkumalai Sunrise & Rajamalai Tahr Safari', slogan: 'World’s Highest Tea Estate at 7,900 ft & Mattupetty Dam Speedboating', duration: '3 Days / 2 Nights', price: 16999, badge: '🔥 Bestseller', places: 'Kolukkumalai Sunrise, Eravikulam Park, Mattupetty Dam, Tea Museum', destId: 'munnar-tea-plantations', loc: 'Munnar' },
        { title: 'Munnar Cloudbed Tea Highlands & Blossom River Kayaking', slogan: 'Thrissur Direct Pickup Escorted Hill Station & Treehouse Resort Retreat', duration: '3 Days / 2 Nights', price: 17999, badge: '👑 Luxury Retreat', places: 'Anamudi Viewpoint, Kundala Lake, Attukad Falls, Blossom Park', destId: 'munnar-tea-plantations', loc: 'Munnar' },
        { title: 'Munnar & Lock Heart Gap Spice Plantation Escape', slogan: 'Cardamom Hill Treks, Kundala Arch Dam & Luxury Valley View Stays', duration: '4 Days / 3 Nights', price: 21999, badge: '✨ New Launch', places: 'Lock Heart Gap, Kundala Dam, Tea Museum, Pothamedu', destId: 'munnar-tea-plantations', loc: 'Munnar' }
      ];
    } else if (locLower.includes('kochi') || locLower.includes('cochin') || locLower.includes('ernakulam')) {
      presets = [
        { title: 'Queen of Arabian Sea: Kochi Heritage Harbor & Chinese Nets Yatra', slogan: 'Fort Kochi Colonial Walk, 1555 Dutch Palace & Marine Drive Sunset Cruise', duration: '2 Days / 1 Night', price: 8999, badge: '🌴 Kerala Special', places: 'Chinese Fishing Nets, Dutch Palace, Jew Town, Marine Drive', destId: 'kochi-heritage-harbor', loc: 'Kochi' },
        { title: 'Fort Kochi Heritage, Jewish Synagogue & Vypin Island Coastal Escape', slogan: 'Cobblestone Antique Alley, 1568 Synagogue & Cherai Beach Sunset Waves', duration: '2 Days / 1 Night', price: 9999, badge: '✨ New Launch', places: 'Paradesi Synagogue, Santa Cruz Basilica, Cherai Beach, Hill Palace', destId: 'kochi-heritage-harbor', loc: 'Kochi' },
        { title: 'Royal Kochi Kingdom & Vembanad Backwaters Luxury Gateway', slogan: 'Tripunithura Hill Palace Gold Crown & Bolgatty Island Heritage Resort Stay', duration: '3 Days / 2 Nights', price: 14999, badge: '👑 Luxury Retreat', places: 'Hill Palace, Bolgatty Palace, St Francis Church, Marine Drive', destId: 'kochi-heritage-harbor', loc: 'Kochi' }
      ];
    } else if (locLower.includes('wayanad')) {
      presets = [
        { title: 'Wayanad Rainforest, Heart Lake & Banasura Dam Expedition', slogan: 'Chembra Peak Trek, Prehistoric Edakkal Caves & Treehouse Resort Stay', duration: '3 Days / 2 Nights', price: 16999, badge: '🔥 Bestseller', places: 'Chembra Peak, Banasura Sagar Dam, Edakkal Caves, Kuruva Island', destId: 'wayanad-misty-hills', loc: 'Wayanad' },
        { title: 'Misty Wayanad Highlands & Muthanga Wildlife Tiger Safari', slogan: 'Lakkidi Sea of Clouds, Bamboo Rafting & 4-Star Plantation Villa Stay', duration: '3 Days / 2 Nights', price: 17999, badge: '👑 Luxury Retreat', places: 'Muthanga Safari, Lakkidi Viewpoint, Pookode Lake, Soochipara Falls', destId: 'wayanad-misty-hills', loc: 'Wayanad' }
      ];
    } else if (locLower.includes('athirappilly')) {
      presets = [
        { title: 'Niagara of India: Athirappilly & Vazhachal Falls Day Trail', slogan: 'Roaring 80-ft Falls, Chalakudy Riverfront & Thumboormuzhi Butterfly Park', duration: '1 Day / Full Day Tour', price: 4999, badge: '🌊 Kerala Special', places: 'Athirappilly Falls, Vazhachal Cascades, Charpa Falls, Thumboormuzhi', destId: 'athirappilly-waterfalls', loc: 'Athirappilly' },
        { title: 'Athirappilly Rainforest Retreat & Sholayar Jungle Safari', slogan: 'Overnight Rainforest Luxury Resort Stay with Chalakudy River View', duration: '2 Days / 1 Night', price: 9999, badge: '✨ New Launch', places: 'Athirappilly Falls, Sholayar Dam, Vazhachal, Peringalkuthu', destId: 'athirappilly-waterfalls', loc: 'Athirappilly' }
      ];
    } else if (locLower.includes('silent valley')) {
      presets = [
        { title: 'Silent Valley Virgin Rainforest & Kunthi River Expedition', slogan: 'Sairandhri Canopy Watchtower, Lion-Tailed Macaque & Crystal Kunthi River', duration: '3 Days / 2 Nights', price: 18999, badge: '🌿 Eco Special', places: 'Sairandhri Watchtower, Kunthi River, Kanjirapuzha Dam', destId: 'silent-valley-national-park', loc: 'Silent Valley' }
      ];
    } else if (locLower.includes('kashi') || locLower.includes('varanasi')) {
      presets = [
        { title: 'Sacred North Yatra: Kashi Vishwanath, Ayodhya Ram Mandir & Prayagraj', slogan: 'Thrissur Departure VIP Pilgrimage • Ganga Aarti & Triveni Sangam Holy Dip', duration: '7 Days / 6 Nights', price: 24999, badge: '🌟 Signature Yatra', places: 'Kashi Vishwanath, Dashashwamedh Ghat, Ayodhya Ram Mandir, Sarnath', destId: 'kashi-varanasi', loc: 'Kashi' },
        { title: 'Kashi Eternal City: Ganga Twilight Aarti & Sarnath Buddhist Shrine', slogan: 'VIP Corridor Darshan, Sunrise Ganges Boat Ride & Banarasi Heritage Tour', duration: '5 Days / 4 Nights', price: 21999, badge: '💎 Premium Pilgrimage', places: 'Kashi Vishwanath, Manikarnika Ghat, Assi Ghat, Sarnath Stupa', destId: 'kashi-varanasi', loc: 'Kashi' }
      ];
    } else if (locLower.includes('ayodhya')) {
      presets = [
        { title: 'Shri Ram Janmabhoomi & Sacred Ayodhya Pilgrimage', slogan: 'Direct Cochin/Thrissur Escorted Flight • VIP Darshan & Saryu Evening Aarti', duration: '6 Days / 5 Nights', price: 28999, badge: '🌟 Signature Yatra', places: 'Ram Janmabhoomi Mandir, Hanuman Garhi, Kanak Bhawan, Saryu Ghat', destId: 'ayodhya-ram-mandir', loc: 'Ayodhya' }
      ];
    } else if (locLower.includes('kashmir')) {
      presets = [
        { title: 'Paradise on Earth: Kashmir Valley, Gulmarg Snow & Dal Lake Shikara', slogan: 'Thrissur Direct Flight Escorted Tour • Deluxe Houseboat & Apharwat Gondola', duration: '7 Days / 6 Nights', price: 49999, badge: '👑 Luxury Retreat', places: 'Dal Lake Shikara, Gulmarg Gondola, Pahalgam Betaab Valley, Sonamarg Glacier', destId: 'kashmir-punjab-golden-trail', loc: 'Kashmir' },
        { title: 'Kashmir Paradise & Punjab Golden Temple Heritage Circuit', slogan: 'Srinagar Mughal Gardens, Gulmarg Snow & Amritsar Wagah Border Ceremony', duration: '7 Days / 6 Nights', price: 52999, badge: '🌟 Signature Yatra', places: 'Dal Lake, Gulmarg, Golden Temple Amritsar, Wagah Border', destId: 'kashmir-punjab-golden-trail', loc: 'Kashmir' }
      ];
    } else if (locLower.includes('parambikulam')) {
      presets = [
        { title: 'Parambikulam Tiger Reserve Rainforest & Bamboo Rafting', slogan: 'Thrissur Direct AC Coach • 450-yr-old Kannimara Giant Teak & Jungle Safari', duration: '3 Days / 2 Nights', price: 13999, badge: '🐅 Wildlife Safari', places: 'Parambikulam Reservoir, Kannimara Teak, Tiger Safari, Topslip', destId: 'parambikulam-tiger-reserve', loc: 'Parambikulam' }
      ];
    } else if (locLower.includes('puri') || locLower.includes('jagannath') || locLower.includes('odisha')) {
      presets = [
        { title: 'Odisha Golden Triangle: Shree Jagannath Puri & Konark Sun Temple', slogan: '56 Bhog Mahaprasad, Konark 24-Chariot Wheels & Blue Flag Beach', duration: '5 Days / 4 Nights', price: 26999, badge: '💎 Premium Pilgrimage', places: 'Puri Jagannath, Konark Sun Temple, Lingaraj Bhubaneswar, Chilika Lake', destId: 'puri-jagannath', loc: 'Puri' }
      ];
    } else if (locLower.includes('tiruchendur') || locLower.includes('thenkasi')) {
      presets = [
        { title: 'Tiruchendur Seashore Murugan & Thenkasi Viswanathar Yatra', slogan: 'Bay of Bengal Seashore Darshan, Courtallam Falls & 180-ft Raja Gopuram', duration: '3 Days / 2 Nights', price: 15999, badge: '💎 Premium Pilgrimage', places: 'Tiruchendur Murugan, Nazhikinaru, Thenkasi Viswanathar, Courtallam Falls', destId: 'tiruchendur-murugan', loc: 'Tiruchendur' }
      ];
    } else if (locLower.includes('gundlupet')) {
      presets = [
        { title: 'Gundlupet Golden Sunflower Meadows & Bandipur Tiger Safari', slogan: 'Thrissur Direct Escorted Tour • Blooming Flower Fields & Gopalaswamy Betta', duration: '2 Days / 1 Night', price: 11999, badge: '✨ New Launch', places: 'Gundlupet Flower Fields, Bandipur Tiger Reserve, Gopalaswamy Betta', destId: 'gundlupet-sunflowers', loc: 'Gundlupet' }
      ];
    } else if (locLower.includes('horanadu')) {
      presets = [
        { title: 'Annapoorneshwari Horanadu & Western Ghats Temple Circuit', slogan: 'Sacred Mahaprasadam, Golden Goddess Idol & Kalasa Shiva Shrine', duration: '3 Days / 2 Nights', price: 14999, badge: '💎 Premium Pilgrimage', places: 'Horanadu Annapoorneshwari, Kalasa Temple, Chikmagalur Tea Hills', destId: 'annapoorneshwari-horanadu', loc: 'Horanadu' }
      ];
    } else {
      presets = [
        { title: `${locKeyword} Majestic Expedition & Highlights Trail`, slogan: `Thrissur Direct Departure Special • Premium Escorted Sightseeing Tour`, duration: '3 Days / 2 Nights', price: 16999, badge: '✨ New Launch', places: `${locKeyword} Central Hub, Viewpoint, Waterfalls, Heritage Site`, destId: resolveDestinationIdFromKeyword(locKeyword), loc: locKeyword },
        { title: `${locKeyword} Signature Luxury Holiday & Cultural Retreat`, slogan: `4-Star Resort Stay with Private AC Transport from Swaraj Round`, duration: '4 Days / 3 Nights', price: 21999, badge: '👑 Luxury Retreat', places: `${locKeyword} Major Attractions, Local Cuisine, Scenic Spots`, destId: resolveDestinationIdFromKeyword(locKeyword), loc: locKeyword }
      ];
    }

    setSuggestedTitles(presets);
    setShowTitleSuggester(true);
  };

  const handleApplyTitlePreset = (item) => {
    setForm(prev => ({
      ...prev,
      title: item.title,
      subtitle: item.slogan,
      duration: item.duration || prev.duration,
      price: item.price || prev.price,
      badge: item.badge || prev.badge,
      mainPlaces: item.places || prev.mainPlaces,
      destinationId: item.destId || prev.destinationId
    }));
    if (item.loc) {
      setAiLocationInput(item.loc);
    }
    setShowTitleSuggester(false);
    setAiStatusMessage(`✓ Applied package: "${item.title}". Image selector synced to ${item.loc || 'destination'}!`);
    setTimeout(() => setAiStatusMessage(''), 4000);
  };

  const updateListItem = (key, index, patch) =>
    setForm(prev => ({
      ...prev,
      [key]: (prev[key] || []).map((item, i) => (i === index ? { ...item, ...patch } : item))
    }));

  const addListItem = (key, blank) =>
    setForm(prev => ({ ...prev, [key]: [...(prev[key] || []), blank] }));

  const removeListItem = (key, index) =>
    setForm(prev => ({ ...prev, [key]: (prev[key] || []).filter((_, i) => i !== index) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { pickupPoints: _pickupPoints, dropPoints: _dropPoints, ...rest } = form;
    onSave({
      ...rest,
      routePoints: enforceRouteOrder(form.routePoints),
      price: parseFloat(form.price) || 0,
      originalPrice: parseFloat(form.originalPrice) || 0,
      mainPlaces: typeof form.mainPlaces === 'string' ? form.mainPlaces.split(',').map(s => s.trim()).filter(Boolean) : (form.mainPlaces || []),
      included: toList(form.included),
      sightseeing: Array.isArray(form.sightseeing) ? form.sightseeing.filter(s => s && (s.name || s.image || (Array.isArray(s.images) && s.images.length))) : [],
      highlights: Array.isArray(form.highlights) ? form.highlights.filter(h => h && (h.title || h.image || (Array.isArray(h.images) && h.images.length))) : []
    });
  };

  const set = (k) => (e) => {
    const val = e.target.value;
    setForm(prev => ({ ...prev, [k]: val }));
    if (k === 'title' && val.length > 2) {
      const derived = resolveLocationKeyword(val, form.subtitle, form.destinationId, '');
      if (derived && derived !== 'Ooty') {
        setAiLocationInput(derived);
      }
    }
  };

  const handleFormKeyDown = (e) => {
    // Prevent Enter key in text inputs from unintentionally submitting the form and closing the modal
    if (e.key === 'Enter' && e.target.tagName === 'INPUT') {
      e.preventDefault();
    }
  };

  // Active resolved location for the image studio
  const activeStudioLocation = resolveLocationKeyword(form.title, form.subtitle, form.destinationId, aiLocationInput);

  return (
    <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown}>
      {/* ─── STEP WIZARD PROGRESS HEADER ─── */}
      <div style={{
        display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem'
      }}>
        {TOUR_FORM_STEPS.map((step, idx) => {
          const isActive = activeStep === idx;
          const isDone = idx < activeStep || stepCompleteFlags[idx];
          const IconMap = [<Sparkles key="b" size={16} />, <ImageIcon key="p" size={16} />, <Navigation size={16} key="r" />];
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => setActiveStep(idx)}
              style={{
                flex: 1,
                minWidth: '180px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.6rem 0.8rem',
                borderRadius: '12px',
                cursor: 'pointer',
                background: isActive
                  ? 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.12))'
                  : isDone
                    ? 'rgba(16,185,129,0.1)'
                    : 'rgba(255,255,255,0.04)',
                border: isActive
                  ? '1.5px solid var(--gold-primary)'
                  : isDone
                    ? '1px solid rgba(16,185,129,0.4)'
                    : '1px solid rgba(255,255,255,0.12)',
                color: isActive ? '#fef08a' : isDone ? '#10b981' : 'var(--text-muted)',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{
                width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive || isDone ? 'var(--gold-primary)' : 'rgba(255,255,255,0.08)',
                color: isDone ? '#000' : '#000',
                fontSize: '0.85rem', fontWeight: 900
              }}>
                {isDone ? <Check size={15} /> : IconMap[idx]}
              </span>
              <span style={{ textAlign: 'left', lineHeight: 1.15 }}>
                <span style={{ display: 'block', fontWeight: 800, fontSize: '0.78rem' }}>
                  Step {idx + 1} · {step.label}
                </span>
                <span style={{ display: 'block', fontSize: '0.66rem', opacity: 0.75 }}>
                  {isDone ? '✓ Complete' : step.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ══════════════ STEP 1 · PACKAGE BASICS ══════════════ */}
      {activeStep === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.1rem' }}>
            <Sparkles size={18} color="var(--gold-primary)" />
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold-light)', margin: 0, fontFamily: 'var(--font-heading)' }}>
              Step 1 of 3 — Enter Package Name &amp; Pricing
            </h4>
          </div>

          {/* Admin AI 50km Guide Generator Box */}
          <div style={{ gridColumn: '1 / -1', background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(139,92,246,0.1))', border: '1px solid var(--border-gold)', borderRadius: '14px', padding: '1rem', marginBottom: '0.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-light)', fontWeight: 800, fontSize: '0.88rem' }}>
                <Sparkles size={16} color="var(--gold-primary)" /> Admin AI Destination &amp; Attractions Studio
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                Current Active Location Focus: <strong style={{ color: '#fef08a' }}>{activeStudioLocation}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={aiLocationInput}
                onChange={(e) => setAiLocationInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAutoFillFromAiGuide();
                  }
                }}
                placeholder="e.g. Ooty, Munnar, Kodaikanal, Kochi, Wayanad, Kashmir, Kashi, Athirappilly, Puri..."
                style={{ flex: 1, minWidth: '200px', background: '#040812', border: '1px solid var(--border-gold)', borderRadius: '10px', color: '#fff', padding: '0.55rem 0.85rem', fontSize: '0.85rem', outline: 'none' }}
              />
              <button
                type="button"
                className="btn-gold"
                onClick={handleAutoFillFromAiGuide}
                style={{ padding: '0.55rem 1rem', fontSize: '0.8rem', gap: '0.4rem' }}
              >
                <Sparkles size={14} /> Auto-Fill Tour Form
              </button>
              <button
                type="button"
                className="btn-glass"
                onClick={() => setIsPreviewGuideOpen(true)}
                style={{ padding: '0.55rem 0.9rem', fontSize: '0.8rem', gap: '0.35rem', color: 'var(--gold-light)' }}
              >
                <Eye size={14} /> Inspect 50km Guide
              </button>
            </div>

            {aiStatusMessage && (
              <div style={{ marginTop: '0.6rem', fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                {aiStatusMessage}
              </div>
            )}
          </div>

          {/* Modal preview when admin inspects 50km guide */}
          {isPreviewGuideOpen && (
            <AiDestinationGuideModal
              initialLocation={aiLocationInput}
              onClose={() => setIsPreviewGuideOpen(false)}
              onBookTour={() => setIsPreviewGuideOpen(false)}
            />
          )}

          {/* TOUR TITLE WITH AI TITLE & SLOGAN SUGGESTER */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Tour Title (Package Name) *</label>
              <button
                type="button"
                onClick={() => generateTitleSuggestions(form.title || aiLocationInput)}
                style={{
                  background: 'rgba(245,158,11,0.15)',
                  border: '1px solid var(--gold-primary)',
                  color: '#fef08a',
                  borderRadius: '8px',
                  padding: '0.2rem 0.6rem',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem'
                }}
              >
                <Sparkles size={12} color="var(--gold-primary)" /> ✨ AI Suggest Package Names &amp; Slogans for {activeStudioLocation}
              </button>
            </div>
            <input 
              style={fieldStyle} 
              value={form.title} 
              onChange={set('title')} 
              required 
              placeholder="Type your own custom package name or click 'AI Suggest Package Names'" 
            />

            {/* AI Package Name Suggestions Dropdown/Pills */}
            {showTitleSuggester && suggestedTitles.length > 0 && (
              <div style={{ background: '#040812', border: '1px solid var(--gold-primary)', borderRadius: '12px', padding: '0.8rem', marginTop: '0.6rem', boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                    💡 Click any AI suggested package name for <strong style={{ color: '#fef08a' }}>{activeStudioLocation}</strong> to apply instantly:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTitleSuggester(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    ✕ Close
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {suggestedTitles.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleApplyTitlePreset(item)}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(245,158,11,0.25)',
                        borderRadius: '8px',
                        padding: '0.5rem 0.8rem',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold-primary)'; e.currentTarget.style.background = 'rgba(245,158,11,0.1)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(245,158,11,0.25)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#fff' }}>
                          {item.title}
                        </span>
                        <span style={{ background: 'rgba(245,158,11,0.85)', color: '#000', fontSize: '0.62rem', fontWeight: 900, padding: '0.1rem 0.45rem', borderRadius: '6px' }}>
                          {item.badge} • ₹{item.price.toLocaleString()}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--gold-light)', marginTop: '0.2rem', fontStyle: 'italic' }}>
                        📢 Slogan: "{item.slogan}"
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* SUBTITLE / SLOGAN */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Subtitle / Promotional Slogan</label>
            <input style={fieldStyle} value={form.subtitle} onChange={set('subtitle')} placeholder="e.g. Thrissur Departure Special • Reserved Steam Toy Train & Lake Boating" />
          </div>
          <div>
            <label style={labelStyle}>Linked Destination *</label>
            <select style={selectFieldStyle} value={form.destinationId} onChange={handleDestinationChange}>
              {DESTINATIONS.map(d => (
                <option key={d.id} value={d.id} style={{ background: '#091426', color: '#fef08a', padding: '8px' }}>
                  {d.name} ({d.category})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Duration</label>
            <input style={fieldStyle} value={form.duration} onChange={set('duration')} placeholder="7 Days / 6 Nights" />
          </div>
          <div>
            <label style={labelStyle}>Selling Price (₹) *</label>
            <input style={fieldStyle} type="number" min="0" value={form.price} onChange={set('price')} required />
          </div>
          <div>
            <label style={labelStyle}>Original Price (₹)</label>
            <input style={fieldStyle} type="number" min="0" value={form.originalPrice} onChange={set('originalPrice')} />
          </div>
          <div>
            <label style={labelStyle}>Badge Tag *</label>
            <select style={selectFieldStyle} value={form.badge} onChange={set('badge')}>
              {PRESET_BADGES.map(b => (
                <option key={b} value={b} style={{ background: '#091426', color: '#fef08a', padding: '8px' }}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Upcoming Departure Date *</label>
            <input
              type="date"
              style={fieldStyle}
              value={form.departureDate || new Date().toISOString().split('T')[0]}
              onChange={set('departureDate')}
              required
            />
          </div>
        </div>
      )}

      {/* ══════════════ STEP 2 · TOURIST PLACES & IMAGES ══════════════ */}
      {activeStep === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.1rem' }}>
            <ImageIcon size={18} color="var(--gold-primary)" />
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold-light)', margin: 0, fontFamily: 'var(--font-heading)' }}>
              Step 2 of 3 — Select Tourist Places &amp; Images
            </h4>
          </div>

          {/* Admin AI Place Image & Hero Composite Studio (Admin Console Only) */}
          <div style={{ gridColumn: '1 / -1' }}>
            <AiPlaceImageSelector
              locationName={activeStudioLocation}
              onSelectCoverImage={(url) => setForm(f => ({ ...f, image: url }))}
              onSelectMixImages={(list) => setForm(f => ({ ...f, bgMixImages: list }))}
              onSelectMainPlaces={(places) => setForm(f => ({ ...f, mainPlaces: places }))}
              onSelectIncludedHighlights={(h) => setForm(f => ({ ...f, included: h }))}
              onAutoFillPackage={handleAutoFillFromAiStudio}
            />
          </div>

          {/* Image Uploader & Background Mixer */}
          <div style={{ gridColumn: '1 / -1' }}>
            <ImageUploader
              value={form.image}
              onChange={(val) => setForm(f => ({ ...f, image: val }))}
              multiValues={form.bgMixImages}
              onMultiChange={(list) => setForm(f => ({ ...f, bgMixImages: list }))}
              blendStyle={form.bgMixStyle}
              onBlendStyleChange={(st) => setForm(f => ({ ...f, bgMixStyle: st }))}
              enableMixMode={true}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Main Places (comma separated)</label>
            <input style={fieldStyle} value={form.mainPlaces} onChange={set('mainPlaces')} placeholder="Varanasi, Ayodhya, Prayagraj" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Included Highlights (one per line)</label>
            <textarea style={{ ...fieldStyle, resize: 'vertical', minHeight: '90px' }} value={form.included} onChange={set('included')} />
          </div>

          {/* Sightseeing Items (image + text + video) */}
          <div style={{ gridColumn: '1 / -1', marginTop: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <label style={labelStyle}>Sightseeing Details (Image, Description &amp; Video)</label>
              <button type="button" className="btn-gold" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }} onClick={() => addListItem('sightseeing', { name: '', image: '', text: '', video: '' })}>
                + Add Sightseeing
              </button>
            </div>
            {(form.sightseeing || []).length === 0 && (
              <p style={{ margin: '0 0 0.8rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>No sightseeing entries yet — click "Add Sightseeing" to show a photo, description and video on the package details page.</p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {(form.sightseeing || []).map((s, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', background: 'rgba(9,20,38,0.6)', display: 'grid', gap: '0.7rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ ...labelStyle, margin: 0 }}>Sightseeing #{idx + 1}</label>
                    <button type="button" className="btn-glass" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', color: '#f87171' }} onClick={() => removeListItem('sightseeing', idx)}>Remove</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                    <div>
                      <label style={labelStyle}>Name *</label>
                      <input style={fieldStyle} value={s.name} onChange={(e) => updateListItem('sightseeing', idx, { name: e.target.value })} placeholder="Kashi Vishwanath Temple Darshan" />
                    </div>
                    <div>
                      <label style={labelStyle}>Video URL (YouTube)</label>
                      <input style={fieldStyle} value={s.video} onChange={(e) => updateListItem('sightseeing', idx, { video: e.target.value })} placeholder="https://youtu.be/..." />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.7rem' }}>
                    <div>
                      <label style={labelStyle}>Images (Upload / AI / URL) — {((s.images || []).length > 0 ? s.images.length : s.image ? 1 : 0)} selected</label>
                      <ItemImagePicker
                        value={s.image}
                        onChange={(url) => updateListItem('sightseeing', idx, { image: url })}
                        hint={`e.g. ${s.name || 'Sightseeing spot'}`}
                        multiple
                        images={s.images || []}
                        onImagesChange={(list) => updateListItem('sightseeing', idx, { images: list, image: list[0] || '' })}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Description</label>
                      <textarea style={{ ...fieldStyle, resize: 'vertical', minHeight: '60px' }} value={s.text} onChange={(e) => updateListItem('sightseeing', idx, { text: e.target.value })} placeholder="Morning Ganga aarti at the ghats, spiritual darshan..." />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights Items (title + image) */}
          <div style={{ gridColumn: '1 / -1', marginTop: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <label style={labelStyle}>Tour Highlights Gallery (Title &amp; Image)</label>
              <button type="button" className="btn-gold" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }} onClick={() => addListItem('highlights', { title: '', image: '' })}>
                + Add Highlight
              </button>
            </div>
            {(form.highlights || []).length === 0 && (
              <p style={{ margin: '0 0 0.8rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>No highlight cards yet — add a striking image with a short title shown on the package details page.</p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {(form.highlights || []).map((h, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', background: 'rgba(9,20,38,0.6)', display: 'grid', gap: '0.7rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ ...labelStyle, margin: 0 }}>Highlight #{idx + 1}</label>
                    <button type="button" className="btn-glass" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', color: '#f87171' }} onClick={() => removeListItem('highlights', idx)}>Remove</button>
                  </div>
                  <div>
                    <label style={labelStyle}>Title *</label>
                    <input style={fieldStyle} value={h.title} onChange={(e) => updateListItem('highlights', idx, { title: e.target.value })} placeholder="Ganga Aarti at Dashashwamedh Ghat" />
                  </div>
                  <div>
                    <label style={labelStyle}>Images (Upload / AI / URL) — {((h.images || []).length > 0 ? h.images.length : h.image ? 1 : 0)} selected</label>
                    <ItemImagePicker
                      value={h.image}
                      onChange={(url) => updateListItem('highlights', idx, { image: url })}
                      hint={`e.g. ${h.title || 'Tour highlight'}`}
                      multiple
                      images={h.images || []}
                      onImagesChange={(list) => updateListItem('highlights', idx, { images: list, image: list[0] || '' })}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════ STEP 3 · START & PICKUP ROUTE ══════════════ */}
      {activeStep === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.1rem' }}>
            <Navigation size={18} color="var(--gold-primary)" />
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold-light)', margin: 0, fontFamily: 'var(--font-heading)' }}>
              Step 3 of 3 — Add Start Point &amp; Pickup Points on the Map
            </h4>
          </div>

          {/* Admin Interactive Map Sequential Route Builder (Start → Next Stops → Destination) */}
          <div style={{ gridColumn: '1 / -1' }}>
            <AdminMapPointPicker
              routePoints={form.routePoints}
              destinationName={form.title || form.destinationId}
              onUpdateRoutePoints={(list) => setForm(f => ({ ...f, routePoints: list }))}
            />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Route Sequence (comma separated: Start, Pickup Stops, Dropping Stops, Destination)</label>
            <input
              style={fieldStyle}
              value={(form.routePoints || []).map(p => p.name).join(', ')}
              onChange={(e) => setForm(f => ({ ...f, routePoints: enforceRouteOrder(e.target.value.split(',')) }))}
              placeholder="Thrissur Swaraj Round, Cochin Airport, Ernakulam South, Varanasi"
            />
          </div>
        </div>
      )}

      {/* ─── WIZARD NAVIGATION ─── */}
      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.2rem' }}>
        {activeStep > 0 && (
          <button
            type="button"
            className="btn-glass"
            onClick={() => handleStepNavigation(-1)}
            style={{ flex: 1, justifyContent: 'center', padding: '0.8rem' }}
          >
            ← Back to {TOUR_FORM_STEPS[activeStep - 1].icon} {TOUR_FORM_STEPS[activeStep - 1].label}
          </button>
        )}

        {activeStep < TOUR_FORM_STEPS.length - 1 ? (
          <button
            type="button"
            className="btn-gold"
            onClick={() => handleStepNavigation(1)}
            disabled={!stepCompleteFlags[activeStep]}
            style={{
              flex: 2,
              justifyContent: 'center',
              padding: '0.8rem',
              opacity: stepCompleteFlags[activeStep] ? 1 : 0.5,
              cursor: stepCompleteFlags[activeStep] ? 'pointer' : 'not-allowed'
            }}
          >
            {stepCompleteFlags[activeStep] ? '✓ ' : ''}Continue to Step {activeStep + 2} · {TOUR_FORM_STEPS[activeStep + 1].label} →
          </button>
        ) : (
          <button type="submit" className="btn-gold" style={{ flex: 2, justifyContent: 'center', padding: '0.8rem' }}>
            <Save size={16} /> Publish Tour Package
          </button>
        )}

        <button type="button" className="btn-glass" onClick={onCancel} style={{ flex: 1, justifyContent: 'center', padding: '0.8rem' }}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export function GalleryForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    type: initial?.type || 'photo',
    title: initial?.title || '',
    destination: initial?.destination || '',
    category: initial?.category || 'Nature',
    url: initial?.url || '',
    poster: initial?.poster || '',
    camera: initial?.camera || '',
    duration: initial?.duration || '',
    location: initial?.location || '',
    coordinates: initial?.coordinates || '',
    likes: initial?.likes || 0,
    aspect: initial?.aspect || 'regular'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, likes: parseInt(form.likes) || 0 });
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const isVideo = form.type === 'video';

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.6rem', marginBottom: '0.2rem' }}>
          {[
            { value: 'photo', label: 'Photo', hint: 'Add a photograph' },
            { value: 'video', label: 'Video', hint: 'Add a video clip' }
          ].map((opt) => {
            const active = form.type === opt.value;
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => setForm(f => ({ ...f, type: opt.value }))}
                style={{
                  flex: 1,
                  padding: '0.7rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--border-gold)',
                  cursor: 'pointer',
                  background: active
                    ? 'linear-gradient(135deg, #d4af37, #aa841c)'
                    : 'rgba(255,255,255,0.05)',
                  color: active ? '#060c17' : 'var(--text-muted)',
                  fontWeight: active ? 800 : 600,
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ display: 'block', fontSize: '0.9rem' }}>{opt.label}</span>
                <span style={{ display: 'block', fontSize: '0.72rem', opacity: 0.85 }}>{opt.hint}</span>
              </button>
            );
          })}
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>{isVideo ? 'Media Title *' : 'Photo Title *'}</label>
          <input style={fieldStyle} value={form.title} onChange={set('title')} required />
        </div>
        <div>
          <label style={labelStyle}>Destination</label>
          <input style={fieldStyle} value={form.destination} onChange={set('destination')} />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select style={selectFieldStyle} value={form.category} onChange={set('category')}>
            {['Spiritual', 'Nature', 'Architecture', 'Heritage', 'Hill Station'].map(c => (
              <option key={c} value={c} style={{ background: '#091426', color: '#fef08a', padding: '8px' }}>{c}</option>
            ))}
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>{isVideo ? 'Video URL *' : 'Image URL *'}</label>
          <input style={fieldStyle} value={form.url} onChange={set('url')} required placeholder={isVideo ? 'https://.../clip.mp4 or YouTube embed link' : './parambikulam-lake-real.jpg or https://...'} />
        </div>
        {isVideo ? (
          <>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Poster Thumbnail URL</label>
              <input style={fieldStyle} value={form.poster} onChange={set('poster')} placeholder="./parambikulam-lake-real.jpg (shown before play)" />
            </div>
            <div>
              <label style={labelStyle}>Video Duration</label>
              <input style={fieldStyle} value={form.duration} onChange={set('duration')} placeholder="e.g. 2:45 min" />
            </div>
          </>
        ) : (
          <>
            <div>
              <label style={labelStyle}>Camera / Gear</label>
              <input style={fieldStyle} value={form.camera} onChange={set('camera')} placeholder="Sony α7R IV • 24mm f/2.8" />
            </div>
          </>
        )}
        <div>
          <label style={labelStyle}>Location</label>
          <input style={fieldStyle} value={form.location} onChange={set('location')} placeholder="Munnar, Idukki, Kerala" />
        </div>
        <div>
          <label style={labelStyle}>Coordinates</label>
          <input style={fieldStyle} value={form.coordinates} onChange={set('coordinates')} placeholder="10.0889° N, 77.0595° E" />
        </div>
        <div>
          <label style={labelStyle}>Likes Count</label>
          <input style={fieldStyle} type="number" min="0" value={form.likes} onChange={set('likes')} />
        </div>
      </div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

export function BlogForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    tag: initial?.tag || 'Travel Guide',
    category: initial?.category || 'Travel Tips',
    excerpt: initial?.excerpt || '',
    content: initial?.content || '',
    image: initial?.image || './kashi-vishwanath-real.jpg',
    author: initial?.author || 'OASIS Travel Desk'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Blog Title *</label>
          <input style={fieldStyle} value={form.title} onChange={set('title')} required />
        </div>
        <div>
          <label style={labelStyle}>Tag / Label</label>
          <input style={fieldStyle} value={form.tag} onChange={set('tag')} />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <input style={fieldStyle} value={form.category} onChange={set('category')} />
        </div>
        <div>
          <label style={labelStyle}>Author</label>
          <input style={fieldStyle} value={form.author} onChange={set('author')} />
        </div>
        <div>
          <label style={labelStyle}>Cover Image URL</label>
          <input style={fieldStyle} value={form.image} onChange={set('image')} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Short Excerpt</label>
          <input style={fieldStyle} value={form.excerpt} onChange={set('excerpt')} />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Full Content</label>
          <textarea style={{ ...fieldStyle, resize: 'vertical', minHeight: '120px' }} value={form.content} onChange={set('content')} />
        </div>
      </div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

export function HeroSlideForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    destinationId: initial?.destinationId || DESTINATIONS[0]?.id || '',
    name: initial?.name || '',
    tagline: initial?.tagline || '',
    description: initial?.description || '',
    heroImage: initial?.heroImage || './ayodhya-ram-mandir-real.jpg',
    bgMixImages: initial?.bgMixImages || [],
    bgMixStyle: initial?.bgMixStyle || 'collage-blend',
    location: initial?.location || '',
    duration: initial?.duration || '5 Days / 4 Nights',
    startingPrice: initial?.startingPrice || '',
    rating: initial?.rating || 4.9,
    reviewsCount: initial?.reviewsCount || 0
  });

  const handleDestinationChange = (e) => {
    const destId = e.target.value;
    const dest = DESTINATIONS.find(d => d.id === destId);
    setForm(f => ({
      ...f,
      destinationId: destId,
      name: dest?.name || f.name,
      location: dest?.location || f.location,
      heroImage: dest?.heroImage || f.heroImage,
      bgMixImages: dest?.bgMixImages || f.bgMixImages || [],
      bgMixStyle: dest?.bgMixStyle || f.bgMixStyle || 'collage-blend',
      duration: dest?.duration || f.duration,
      startingPrice: dest?.startingPrice || f.startingPrice,
      rating: dest?.rating || f.rating,
      reviewsCount: dest?.reviewsCount || f.reviewsCount
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      startingPrice: parseFloat(form.startingPrice) || 0,
      rating: parseFloat(form.rating) || 4.9,
      reviewsCount: parseInt(form.reviewsCount) || 0
    });
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Linked Destination *</label>
          <select style={selectFieldStyle} value={form.destinationId} onChange={handleDestinationChange} required>
            {DESTINATIONS.map(d => (
              <option key={d.id} value={d.id} style={{ background: '#091426', color: '#fef08a', padding: '8px' }}>
                {d.name} ({d.category})
              </option>
            ))}
          </select>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
            Picking a destination auto-fills the fields below — you can still customize each one.
          </div>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Hero Slide Title *</label>
          <input style={fieldStyle} value={form.name} onChange={set('name')} required />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Tagline</label>
          <input style={fieldStyle} value={form.tagline} onChange={set('tagline')} placeholder="e.g. The Eternal City of Light & Devotion" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Description</label>
          <textarea style={{ ...fieldStyle, resize: 'vertical', minHeight: '90px' }} value={form.description} onChange={set('description')} />
        </div>
        
        {/* Admin AI Place Image & Hero Composite Studio (Admin Console Only) */}
        <div style={{ gridColumn: '1 / -1' }}>
          <AiPlaceImageSelector
            locationName={form.name || 'Kodaikanal'}
            onSelectCoverImage={(url) => setForm(f => ({ ...f, heroImage: url }))}
            onSelectMixImages={(list) => setForm(f => ({ ...f, bgMixImages: list }))}
            onSelectMainPlaces={(places) => setForm(f => ({ ...f, description: (f.description ? f.description + '\n\n' : '') + 'Key Sightseeing: ' + places }))}
          />
        </div>

        {/* Image Uploader & Background Mixer */}
        <div style={{ gridColumn: '1 / -1' }}>
          <ImageUploader
            value={form.heroImage}
            onChange={(val) => setForm(f => ({ ...f, heroImage: val }))}
            multiValues={form.bgMixImages}
            onMultiChange={(list) => setForm(f => ({ ...f, bgMixImages: list }))}
            blendStyle={form.bgMixStyle}
            onBlendStyleChange={(st) => setForm(f => ({ ...f, bgMixStyle: st }))}
            enableMixMode={true}
          />
        </div>
        <div>
          <label style={labelStyle}>Location</label>
          <input style={fieldStyle} value={form.location} onChange={set('location')} />
        </div>
        <div>
          <label style={labelStyle}>Duration</label>
          <input style={fieldStyle} value={form.duration} onChange={set('duration')} />
        </div>
        <div>
          <label style={labelStyle}>Starting Price (₹)</label>
          <input style={fieldStyle} type="number" min="0" value={form.startingPrice} onChange={set('startingPrice')} />
        </div>
        <div>
          <label style={labelStyle}>Rating</label>
          <input style={fieldStyle} type="number" min="0" max="5" step="0.1" value={form.rating} onChange={set('rating')} />
        </div>
        <div>
          <label style={labelStyle}>Reviews Count</label>
          <input style={fieldStyle} type="number" min="0" value={form.reviewsCount} onChange={set('reviewsCount')} />
        </div>
      </div>
      <FormActions onCancel={onCancel} />
    </form>
  );
}

const FORM_ICONS = { Package, ImageIcon, BookOpen, MonitorPlay };
