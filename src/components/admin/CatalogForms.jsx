import React, { useState, useEffect, useRef } from 'react';
import { X, Package, Image as ImageIcon, BookOpen, Save, MonitorPlay, Sparkles, Compass, Eye, Check, Navigation, Clock, Wand2, RefreshCw } from 'lucide-react';
import { DESTINATIONS } from '../../data/destinationsData';
import { catalogService } from '../../services/catalog';
import ImageUploader from './ImageUploader';
import AiPlaceImageSelector from './AiPlaceImageSelector';
import ItemImagePicker from './ItemImagePicker';
import AdminMapPointPicker from './AdminMapPointPicker';
import { generateAiDestinationGuide } from '../../services/aiDestinationGenerator';
import AiDestinationGuideModal from '../AiDestinationGuideModal';
import { geminiService } from '../../services/gemini';

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

// Helpers for clean Days and Nights duration separation
export const parseDuration = (dStr) => {
  if (!dStr) return { days: 3, nights: 2 };
  const s = String(dStr);
  const dMatch = s.match(/(\d+)\s*Day/i);
  const nMatch = s.match(/(\d+)\s*Night/i);
  const days = dMatch ? parseInt(dMatch[1], 10) : 1;
  const nights = nMatch ? parseInt(nMatch[1], 10) : (s.toLowerCase().includes('full day') ? 0 : Math.max(0, days - 1));
  return { days, nights };
};

export const formatDurationString = (d, n) => {
  const days = parseInt(d, 10) || 0;
  const nights = parseInt(n, 10) || 0;
  if (days <= 0 && nights <= 0) return '1 Day / Full Day Tour';
  if (days === 1 && nights === 0) return '1 Day / Full Day Tour';
  if (nights === 0) return `${days} ${days === 1 ? 'Day' : 'Days'} / Day Tour`;
  return `${days} ${days === 1 ? 'Day' : 'Days'} / ${nights} ${nights === 1 ? 'Night' : 'Nights'}`;
};

export function TourForm({ initial, onSave, onCancel, onDirtyChange }) {
  const allDestinations = catalogService.getDestinations() || DESTINATIONS;
  const isEditing = Boolean(initial && (initial.id || initial.title));
  const defaultDest = allDestinations.find(d => d.id === initial?.destinationId) || allDestinations[0] || {};
  const defaultLoc = resolveLocationKeyword(initial?.title, initial?.subtitle, initial?.destinationId, defaultDest.name);

  // Parse Days and Nights separately
  const initialDuration = parseDuration(initial?.duration || (isEditing ? defaultDest.duration : '3 Days / 2 Nights'));
  const [durationDays, setDurationDays] = useState(initialDuration.days);
  const [durationNights, setDurationNights] = useState(initialDuration.nights);

  const [form, setForm] = useState({
    title: initial?.title || '',
    subtitle: initial?.subtitle || '',
    destinationId: initial?.destinationId || defaultDest.id || (allDestinations[0]?.id || ''),
    duration: initial?.duration || formatDurationString(initialDuration.days, initialDuration.nights),
    price: initial?.price !== undefined ? initial.price : '',
    originalPrice: initial?.originalPrice !== undefined ? initial.originalPrice : '',
    badge: initial?.badge || '✨ New Launch',
    image: initial?.image || (isEditing ? defaultDest.heroImage : '') || './ooty-toy-train-real.jpg',
    bgMixImages: initial?.bgMixImages || (defaultDest.bgMixImages ? [...defaultDest.bgMixImages] : []),
    bgMixStyle: initial?.bgMixStyle || 'collage-blend',
    mainPlaces: isEditing ? formatAsString(initial?.mainPlaces, ', ', defaultDest.nearbyAttractions?.map(a => a.name) || []) : (initial?.mainPlaces ? formatAsString(initial.mainPlaces) : ''),
    included: isEditing ? formatAsString(initial?.included, '\n', defaultDest.highlights || []) : (initial?.included ? formatAsString(initial.included, '\n') : ''),
    sightseeing: initial?.sightseeing || [],
    highlights: initial?.highlights || [],
    routePoints: initial?.routePoints ? resolveRoutePoints(initial) : []
  });

  const [aiLocationInput, setAiLocationInput] = useState(defaultLoc);
  const [aiStatusMessage, setAiStatusMessage] = useState('');

  // Slogan & Title Generator state
  const [suggestedTitles, setSuggestedTitles] = useState([]);
  const [showTitleSuggester, setShowTitleSuggester] = useState(false);
  const [customSloganQuery, setCustomSloganQuery] = useState('');
  const [isGeneratingAiSlogans, setIsGeneratingAiSlogans] = useState(false);
  const [aiGeneratedSlogansList, setAiGeneratedSlogansList] = useState([]);

  // Report dirty state to parent
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
    { key: 'basics', label: 'Package Basics', icon: '📝', hint: 'Name, duration & pricing' },
    { key: 'places', label: 'Tourist Places & Images', icon: '🖼️', hint: 'Pick spots & photos' },
    { key: 'route', label: 'Start & Pickup Route', icon: '🗺️', hint: 'Map start & pickup points' }
  ];
  const [activeStep, setActiveStep] = useState(0);
  const stepCompleteFlags = {
    0: Boolean((form.title || '').trim() && (form.destinationId || '').trim() && form.price),
    1: Boolean((form.image || '').trim()),
    2: true
  };

  const handleStepNavigation = (dir) => {
    const target = activeStep + dir;
    if (target < 0 || target > TOUR_FORM_STEPS.length - 1) return;
    setActiveStep(target);
  };

  // Handle Days change
  const handleDaysChange = (newDays) => {
    const d = Math.max(1, parseInt(newDays, 10) || 1);
    setDurationDays(d);
    const computed = formatDurationString(d, durationNights);
    setForm(prev => ({ ...prev, duration: computed }));
  };

  // Handle Nights change
  const handleNightsChange = (newNights) => {
    const n = Math.max(0, parseInt(newNights, 10) || 0);
    setDurationNights(n);
    const computed = formatDurationString(durationDays, n);
    setForm(prev => ({ ...prev, duration: computed }));
  };

  // Handle quick preset duration click
  const handlePresetDuration = (days, nights) => {
    setDurationDays(days);
    setDurationNights(nights);
    const computed = formatDurationString(days, nights);
    setForm(prev => ({ ...prev, duration: computed }));
  };

  // Handle Linked Destination dropdown change (avoids wiping user-entered price or duration)
  const handleDestinationChange = (e) => {
    const newDestId = e.target.value;
    const dest = allDestinations.find(d => d.id === newDestId);
    if (dest) {
      const locKey = resolveLocationKeyword('', '', dest.id, dest.name);
      setAiLocationInput(locKey);
      setForm(prev => ({
        ...prev,
        destinationId: newDestId,
        image: prev.image || dest.heroImage || '',
        bgMixImages: prev.bgMixImages?.length ? prev.bgMixImages : (dest.bgMixImages || [dest.heroImage])
      }));
      setAiStatusMessage(`📍 Linked destination set to "${dest.name}".`);
      setTimeout(() => setAiStatusMessage(''), 3000);
    } else {
      setForm(prev => ({ ...prev, destinationId: newDestId }));
    }
  };

  // AI Slogan & Title generator
  const generateTitleSuggestions = (keyword) => {
    const locKeyword = resolveLocationKeyword(keyword, form.subtitle, form.destinationId, aiLocationInput);
    const locLower = locKeyword.toLowerCase();
    
    let presets = [];
    if (locLower.includes('ooty') || locLower.includes('nilgiri')) {
      presets = [
        { title: 'Queen of Nilgiris: Ooty Heritage Toy Train & Tea Highlands Yatra', slogan: 'Thrissur Departure Special • Reserved UNESCO Steam Train & Ooty Lake Boating' },
        { title: 'Ooty Emerald Tea Plantations & Doddabetta Mountain Summit Trail', slogan: 'Misty High Altitude Retreat with Italian Sunken Glasshouse & Lake Cycling' },
        { title: 'Ooty & Mudumalai Wildlife Safari with Coonoor Heritage Express', slogan: 'Bengal Tiger Safari, Theppakadu Elephant Camp & Sim’s Park High Tea' }
      ];
    } else if (locLower.includes('kodaikanal') || locLower.includes('kodai')) {
      presets = [
        { title: 'Princess of Hill Stations: Kodaikanal Star Lake & Pine Forest Yatra', slogan: 'Pedal Boating, Coaker’s 180° Valley Walk & Manjummel Guna Caves Roots' },
        { title: 'Kodaikanal Mist & Mannavanur Switzerland Sheep Farm Retreat', slogan: 'Highland Coracle Boating, Poombarai Terraced Garlic Village & Dolphin’s Nose' },
        { title: 'Kodai Romantic Valley: Pillar Rocks & Silver Cascade Waterfalls', slogan: '400ft Granite Spires, Bryant Rose Gardens & Sunset at Suicide Point' }
      ];
    } else if (locLower.includes('munnar')) {
      presets = [
        { title: 'Emerald Munnar: Kolukkumalai Sunrise & Rajamalai Tahr Safari', slogan: 'World’s Highest Tea Estate at 7,900 ft & Mattupetty Dam Speedboating' },
        { title: 'Munnar Cloudbed Tea Highlands & Blossom River Kayaking', slogan: 'Thrissur Direct Pickup Escorted Hill Station & Treehouse Resort Retreat' },
        { title: 'Munnar & Lock Heart Gap Spice Plantation Escape', slogan: 'Cardamom Hill Treks, Kundala Arch Dam & Luxury Valley View Stays' }
      ];
    } else if (locLower.includes('kochi') || locLower.includes('cochin') || locLower.includes('ernakulam')) {
      presets = [
        { title: 'Queen of Arabian Sea: Kochi Heritage Harbor & Chinese Nets Yatra', slogan: 'Fort Kochi Colonial Walk, 1555 Dutch Palace & Marine Drive Sunset Cruise' },
        { title: 'Fort Kochi Heritage, Jewish Synagogue & Vypin Island Coastal Escape', slogan: 'Cobblestone Antique Alley, 1568 Synagogue & Cherai Beach Sunset Waves' },
        { title: 'Royal Kochi Kingdom & Vembanad Backwaters Luxury Gateway', slogan: 'Tripunithura Hill Palace Gold Crown & Bolgatty Island Heritage Resort Stay' }
      ];
    } else if (locLower.includes('wayanad')) {
      presets = [
        { title: 'Wayanad Rainforest, Heart Lake & Banasura Dam Expedition', slogan: 'Chembra Peak Trek, Prehistoric Edakkal Caves & Treehouse Resort Stay' },
        { title: 'Misty Wayanad Highlands & Muthanga Wildlife Tiger Safari', slogan: 'Lakkidi Sea of Clouds, Bamboo Rafting & 4-Star Plantation Villa Stay' }
      ];
    } else if (locLower.includes('athirappilly')) {
      presets = [
        { title: 'Niagara of India: Athirappilly & Vazhachal Falls Day Trail', slogan: 'Roaring 80-ft Falls, Chalakudy Riverfront & Thumboormuzhi Butterfly Park' },
        { title: 'Athirappilly Rainforest Retreat & Sholayar Jungle Safari', slogan: 'Overnight Rainforest Luxury Resort Stay with Chalakudy River View' }
      ];
    } else if (locLower.includes('silent valley')) {
      presets = [
        { title: 'Silent Valley Virgin Rainforest & Kunthi River Expedition', slogan: 'Sairandhri Canopy Watchtower, Lion-Tailed Macaque & Crystal Kunthi River' }
      ];
    } else if (locLower.includes('kashi') || locLower.includes('varanasi')) {
      presets = [
        { title: 'Sacred North Yatra: Kashi Vishwanath, Ayodhya Ram Mandir & Prayagraj', slogan: 'Thrissur Departure VIP Pilgrimage • Ganga Aarti & Triveni Sangam Holy Dip' },
        { title: 'Kashi Eternal City: Ganga Twilight Aarti & Sarnath Buddhist Shrine', slogan: 'VIP Corridor Darshan, Sunrise Ganges Boat Ride & Banarasi Heritage Tour' }
      ];
    } else if (locLower.includes('ayodhya')) {
      presets = [
        { title: 'Shri Ram Janmabhoomi & Sacred Ayodhya Pilgrimage', slogan: 'Direct Cochin/Thrissur Escorted Flight • VIP Darshan & Saryu Evening Aarti' }
      ];
    } else if (locLower.includes('kashmir')) {
      presets = [
        { title: 'Paradise on Earth: Kashmir Valley, Gulmarg Snow & Dal Lake Shikara', slogan: 'Thrissur Direct Flight Escorted Tour • Deluxe Houseboat & Apharwat Gondola' },
        { title: 'Kashmir Paradise & Punjab Golden Temple Heritage Circuit', slogan: 'Srinagar Mughal Gardens, Gulmarg Snow & Amritsar Wagah Border Ceremony' }
      ];
    } else if (locLower.includes('parambikulam')) {
      presets = [
        { title: 'Parambikulam Tiger Reserve Rainforest & Bamboo Rafting', slogan: 'Thrissur Direct AC Coach • 450-yr-old Kannimara Giant Teak & Jungle Safari' }
      ];
    } else if (locLower.includes('puri') || locLower.includes('jagannath') || locLower.includes('odisha')) {
      presets = [
        { title: 'Odisha Golden Triangle: Shree Jagannath Puri & Konark Sun Temple', slogan: '56 Bhog Mahaprasad, Konark 24-Chariot Wheels & Blue Flag Beach' }
      ];
    } else if (locLower.includes('tiruchendur') || locLower.includes('thenkasi')) {
      presets = [
        { title: 'Tiruchendur Seashore Murugan & Thenkasi Viswanathar Yatra', slogan: 'Bay of Bengal Seashore Darshan, Courtallam Falls & 180-ft Raja Gopuram' }
      ];
    } else if (locLower.includes('gundlupet')) {
      presets = [
        { title: 'Gundlupet Golden Sunflower Meadows & Bandipur Tiger Safari', slogan: 'Thrissur Direct Escorted Tour • Blooming Flower Fields & Gopalaswamy Betta' }
      ];
    } else if (locLower.includes('horanadu')) {
      presets = [
        { title: 'Annapoorneshwari Horanadu & Western Ghats Temple Circuit', slogan: 'Sacred Mahaprasadam, Golden Goddess Idol & Kalasa Shiva Shrine' }
      ];
    } else {
      presets = [
        { title: `${locKeyword} Majestic Expedition & Highlights Trail`, slogan: `Thrissur Direct Departure Special • Premium Escorted Sightseeing Tour` },
        { title: `${locKeyword} Signature Luxury Holiday & Cultural Retreat`, slogan: `4-Star Resort Stay with Private AC Transport from Swaraj Round` }
      ];
    }

    setSuggestedTitles(presets);
    setShowTitleSuggester(true);
  };

  const handleApplyTitleAndSlogan = (item) => {
    setForm(prev => ({
      ...prev,
      title: item.title,
      subtitle: item.slogan || item.subtitle || prev.subtitle
    }));
    setShowTitleSuggester(false);
    setAiStatusMessage(`✓ Applied Title & Slogan: "${item.title}"`);
    setTimeout(() => setAiStatusMessage(''), 3500);
  };

  const handleApplySloganOnly = (sloganText) => {
    setForm(prev => ({ ...prev, subtitle: sloganText }));
    setShowTitleSuggester(false);
    setAiStatusMessage(`✓ Applied Slogan: "${sloganText}"`);
    setTimeout(() => setAiStatusMessage(''), 3500);
  };

  const handleGenerateLiveSlogans = async () => {
    const query = customSloganQuery.trim() || form.title || activeStudioLocation || 'Luxury Tour Package';
    setIsGeneratingAiSlogans(true);
    try {
      const results = await geminiService.generateSlogans(query);
      setAiGeneratedSlogansList(results || []);
    } catch (err) {
      console.warn('Gemini Slogan generation error:', err);
    } finally {
      setIsGeneratingAiSlogans(false);
    }
  };

  const updateListItem = (key, index, patch) =>
    setForm(prev => ({
      ...prev,
      [key]: (prev[key] || []).map((item, i) => (i === index ? { ...item, ...patch } : item))
    }));

  const addListItem = (key, blank) =>
    setForm(prev => ({ ...prev, [key]: [...(prev[key] || []), blank] }));

  const handleGenerateSightseeingOnly = () => {
    const loc = form.mainPlaces || form.title || form.destinationId || 'Kollam';
    const guide = generateAiDestinationGuide(loc);
    if (guide.attractions && guide.attractions.length) {
      const newItems = guide.attractions.map(a => ({
        name: a.name,
        image: a.image || '',
        images: a.image ? [a.image] : [],
        text: a.desc || a.shortDescription || `Guided visit to ${a.name} in ${loc}.`,
        video: '',
        location: loc
      }));
      setForm(prev => ({
        ...prev,
        sightseeing: [...(prev.sightseeing || []), ...newItems]
      }));
    }
  };

  const handleAiSuggestSightseeingDesc = (idx) => {
    const s = (form.sightseeing || [])[idx];
    if (!s) return;
    const name = s.name || activeStudioLocation;
    const suggested = `Experience ${name} with expert commentary from OASIS tour guides. Scenic viewpoints and photo opportunities.`;
    updateListItem('sightseeing', idx, { text: suggested });
  };

  const handleAiSuggestHighlightTitle = (idx) => {
    const h = (form.highlights || [])[idx];
    if (!h) return;
    const suggested = `${h.title || activeStudioLocation} Scenic Experience`;
    updateListItem('highlights', idx, { title: suggested });
  };

  const removeListItem = (key, index) =>
    setForm(prev => ({ ...prev, [key]: (prev[key] || []).filter((_, i) => i !== index) }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const { pickupPoints: _pickupPoints, dropPoints: _dropPoints, ...rest } = form;
    onSave({
      ...rest,
      duration: form.duration || formatDurationString(durationDays, durationNights),
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
                color: '#000',
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
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} color="var(--gold-primary)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold-light)', margin: 0, fontFamily: 'var(--font-heading)' }}>
                Step 1 of 3 — Package Name, Duration &amp; Pricing
              </h4>
            </div>
            {aiStatusMessage && (
              <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                {aiStatusMessage}
              </span>
            )}
          </div>

          {/* TOUR TITLE WITH AI TITLE & SLOGAN SUGGESTER */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Tour Title (Package Name) *</label>
              <button
                type="button"
                onClick={() => generateTitleSuggestions(form.title || aiLocationInput)}
                style={{
                  background: 'rgba(245,158,11,0.15)',
                  border: '1px solid var(--gold-primary)',
                  color: '#fef08a',
                  borderRadius: '8px',
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.74rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}
              >
                <Sparkles size={13} color="var(--gold-primary)" /> ✨ AI Suggest Slogans &amp; Titles ({activeStudioLocation})
              </button>
            </div>
            <input 
              style={fieldStyle} 
              value={form.title} 
              onChange={set('title')} 
              required 
              placeholder="e.g. Queen of Nilgiris: Ooty Heritage Toy Train & Tea Highlands Yatra" 
            />

            {/* AI Slogan & Title Suggester Modal / Dropdown */}
            {showTitleSuggester && (
              <div style={{ background: '#040812', border: '1px solid var(--gold-primary)', borderRadius: '12px', padding: '1rem', marginTop: '0.6rem', boxShadow: '0 8px 24px rgba(0,0,0,0.7)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(245,158,11,0.2)', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={16} color="var(--gold-primary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                      AI Slogans &amp; Title Suggestions for <strong style={{ color: '#fef08a' }}>{activeStudioLocation}</strong>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowTitleSuggester(false)}
                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 700 }}
                  >
                    ✕ Close
                  </button>
                </div>

                {/* Gemini AI Live Slogan Generator Row */}
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(139,92,246,0.3)', borderRadius: '10px', padding: '0.7rem', marginBottom: '0.8rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c4b5fd', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Wand2 size={13} /> Generate Custom Gemini AI Slogans:
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={customSloganQuery}
                      onChange={(e) => setCustomSloganQuery(e.target.value)}
                      placeholder={`e.g. Honeymoon luxury escape in ${activeStudioLocation}, Family pilgrimage...`}
                      style={{ flex: 1, background: '#02060e', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '8px', color: '#fff', padding: '0.4rem 0.7rem', fontSize: '0.78rem', outline: 'none' }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleGenerateLiveSlogans();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleGenerateLiveSlogans}
                      disabled={isGeneratingAiSlogans}
                      style={{
                        background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                        color: '#fff', border: 'none', borderRadius: '8px',
                        padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 800,
                        cursor: isGeneratingAiSlogans ? 'wait' : 'pointer',
                        display: 'flex', alignItems: 'center', gap: '0.3rem'
                      }}
                    >
                      {isGeneratingAiSlogans ? <RefreshCw size={12} className="spin" /> : <Sparkles size={12} />}
                      {isGeneratingAiSlogans ? 'Generating...' : 'Generate Slogans'}
                    </button>
                  </div>

                  {/* Live Generated Gemini Slogans List */}
                  {aiGeneratedSlogansList.length > 0 && (
                    <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Click to apply as Subtitle / Slogan:</span>
                      {aiGeneratedSlogansList.map((slog, sIdx) => (
                        <div
                          key={sIdx}
                          onClick={() => handleApplySloganOnly(slog)}
                          style={{
                            background: 'rgba(139,92,246,0.15)', border: '1px solid rgba(139,92,246,0.35)',
                            borderRadius: '6px', padding: '0.35rem 0.6rem', cursor: 'pointer',
                            fontSize: '0.76rem', color: '#fef08a', fontStyle: 'italic',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}
                        >
                          <span>"{slog}"</span>
                          <span style={{ fontSize: '0.65rem', background: '#8b5cf6', color: '#fff', padding: '0.1rem 0.4rem', borderRadius: '4px', fontStyle: 'normal', fontWeight: 700 }}>Apply Slogan</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Curated Package Title & Slogan Presets */}
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '0.4rem' }}>
                  Curated Titles &amp; Slogans for {activeStudioLocation}:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '220px', overflowY: 'auto' }}>
                  {suggestedTitles.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleApplyTitleAndSlogan(item)}
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
                        <span style={{ background: 'var(--gold-primary)', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '6px' }}>
                          Apply Title &amp; Slogan
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

          {/* SUBTITLE / PROMOTIONAL SLOGAN */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Subtitle / Promotional Slogan</label>
            <input 
              style={fieldStyle} 
              value={form.subtitle} 
              onChange={set('subtitle')} 
              placeholder="e.g. Thrissur Departure Special • Reserved Steam Toy Train & Lake Boating" 
            />
          </div>

          {/* LINKED DESTINATION */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Linked Destination *</label>
            <select style={selectFieldStyle} value={form.destinationId} onChange={handleDestinationChange}>
              {allDestinations.map(d => (
                <option key={d.id} value={d.id} style={{ background: '#091426', color: '#fef08a', padding: '8px' }}>
                  {d.name} ({d.category})
                </option>
              ))}
            </select>
          </div>

          {/* ─── DURATION (SEPARATE DAYS & NIGHTS) ─── */}
          <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0, color: 'var(--gold-light)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={16} color="var(--gold-primary)" /> Tour Duration (Days &amp; Nights) *
              </label>
              <div style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid var(--gold-primary)', color: '#fef08a', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.82rem', fontWeight: 800 }}>
                Formatted: {form.duration || formatDurationString(durationDays, durationNights)}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '0.8rem' }}>
              <div>
                <label style={labelStyle}>Number of Days ☀️</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  style={fieldStyle}
                  value={durationDays}
                  onChange={(e) => handleDaysChange(e.target.value)}
                  placeholder="e.g. 3"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Number of Nights 🌙</label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  style={fieldStyle}
                  value={durationNights}
                  onChange={(e) => handleNightsChange(e.target.value)}
                  placeholder="e.g. 2"
                  required
                />
              </div>
            </div>

            {/* Quick Duration Presets */}
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700 }}>Quick Presets:</span>
              {[
                { label: '1 Day / Full Day', d: 1, n: 0 },
                { label: '2 Days / 1 Night', d: 2, n: 1 },
                { label: '3 Days / 2 Nights', d: 3, n: 2 },
                { label: '4 Days / 3 Nights', d: 4, n: 3 },
                { label: '5 Days / 4 Nights', d: 5, n: 4 },
                { label: '6 Days / 5 Nights', d: 6, n: 5 },
                { label: '7 Days / 6 Nights', d: 7, n: 6 },
                { label: '10 Days / 9 Nights', d: 10, n: 9 }
              ].map(p => {
                const isSelected = durationDays === p.d && durationNights === p.n;
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handlePresetDuration(p.d, p.n)}
                    style={{
                      background: isSelected ? 'var(--gold-primary)' : 'rgba(255,255,255,0.06)',
                      color: isSelected ? '#000' : 'var(--gold-light)',
                      border: isSelected ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '16px',
                      padding: '0.25rem 0.6rem',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* PRICING & BADGES */}
          <div>
            <label style={labelStyle}>Selling Price (₹) *</label>
            <input style={fieldStyle} type="number" min="0" value={form.price} onChange={set('price')} placeholder="e.g. 14999" required />
          </div>
          <div>
            <label style={labelStyle}>Original Price (₹)</label>
            <input style={fieldStyle} type="number" min="0" value={form.originalPrice} onChange={set('originalPrice')} placeholder="e.g. 17999" />
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
          <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ImageIcon size={18} color="var(--gold-primary)" />
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold-light)', margin: 0, fontFamily: 'var(--font-heading)' }}>
                Step 2 of 3 — Select Tourist Places &amp; Images
              </h4>
            </div>
          </div>

          {/* Admin AI Place Image & Multi-Location Explorer Studio */}
          <div style={{ gridColumn: '1 / -1' }}>
            <AiPlaceImageSelector
              locationName={form.mainPlaces || form.title || form.destinationId || 'Kollam and Munnar'}
              sightseeingList={form.sightseeing}
              highlightsList={form.highlights}
              coverImageUrl={form.image}
              mixedBackgroundUrls={form.bgMixImages}
              onSelectCoverImage={(url) => setForm(f => ({ ...f, image: url }))}
              onSelectMixImages={(list) => setForm(f => ({ ...f, bgMixImages: list }))}
              onToggleSightseeing={(place) => {
                setForm(prev => {
                  const exists = (prev.sightseeing || []).some(s => (s.name || '').toLowerCase() === place.placeName.toLowerCase());
                  if (exists) {
                    return {
                      ...prev,
                      sightseeing: prev.sightseeing.filter(s => (s.name || '').toLowerCase() !== place.placeName.toLowerCase())
                    };
                  } else {
                    const newItem = {
                      name: place.placeName,
                      image: place.url,
                      images: place.url ? [place.url] : [],
                      text: place.description || `Visit ${place.placeName} (${place.location || place.category || 'Sightseeing'}). Guided tour with OASIS India Thrissur.`,
                      video: '',
                      location: place.location || ''
                    };
                    const updatedMainPlaces = prev.mainPlaces
                      ? (prev.mainPlaces.toLowerCase().includes((place.location || place.placeName).toLowerCase()) ? prev.mainPlaces : `${prev.mainPlaces}, ${place.location || place.placeName}`)
                      : (place.location || place.placeName);
                    return {
                      ...prev,
                      sightseeing: [...(prev.sightseeing || []), newItem],
                      mainPlaces: updatedMainPlaces
                    };
                  }
                });
              }}
              onToggleHighlight={(place) => {
                setForm(prev => {
                  const exists = (prev.highlights || []).some(h => (h.title || '').toLowerCase() === place.placeName.toLowerCase());
                  if (exists) {
                    return {
                      ...prev,
                      highlights: prev.highlights.filter(h => (h.title || '').toLowerCase() !== place.placeName.toLowerCase())
                    };
                  } else {
                    const newItem = {
                      title: place.placeName,
                      image: place.url,
                      images: place.url ? [place.url] : [],
                      location: place.location || ''
                    };
                    return {
                      ...prev,
                      highlights: [...(prev.highlights || []), newItem]
                    };
                  }
                });
              }}
              onBatchAddSightseeing={(places) => {
                setForm(prev => {
                  const existingNames = new Set((prev.sightseeing || []).map(s => (s.name || '').toLowerCase()));
                  const newItems = places.filter(p => !existingNames.has(p.placeName.toLowerCase())).map(p => ({
                    name: p.placeName,
                    image: p.url,
                    images: p.url ? [p.url] : [],
                    text: `Explore ${p.placeName} (${p.location || 'Sightseeing'}) with dedicated transfer and experienced OASIS tour manager.`,
                    video: '',
                    location: p.location || ''
                  }));
                  const locSet = new Set((prev.mainPlaces ? prev.mainPlaces.split(',').map(s => s.trim()) : []));
                  places.forEach(p => { if (p.location) locSet.add(p.location); });
                  return {
                    ...prev,
                    sightseeing: [...(prev.sightseeing || []), ...newItems],
                    mainPlaces: Array.from(locSet).join(', ')
                  };
                });
              }}
              onBatchAddHighlights={(places) => {
                setForm(prev => {
                  const existingTitles = new Set((prev.highlights || []).map(h => (h.title || '').toLowerCase()));
                  const newItems = places.filter(p => !existingTitles.has(p.placeName.toLowerCase())).map(p => ({
                    title: p.placeName,
                    image: p.url,
                    images: p.url ? [p.url] : [],
                    location: p.location || ''
                  }));
                  return {
                    ...prev,
                    highlights: [...(prev.highlights || []), ...newItems]
                  };
                });
              }}
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
            <input style={fieldStyle} value={form.mainPlaces} onChange={set('mainPlaces')} placeholder="Kollam, Munnar, Kochi, Ooty" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Included Highlights (one per line)</label>
            <textarea style={{ ...fieldStyle, resize: 'vertical', minHeight: '90px' }} value={form.included} onChange={set('included')} />
          </div>

          {/* Sightseeing Items (image + text + video) */}
          <div style={{ gridColumn: '1 / -1', marginTop: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <label style={{ ...labelStyle, marginBottom: '0.2rem' }}>Sightseeing Details (Image, Description &amp; Video)</label>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  Upload image or generate with Gemini AI directly in each spot.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn-gold" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }} onClick={() => addListItem('sightseeing', { name: '', image: '', text: '', video: '' })}>
                  + Add Sightseeing
                </button>
              </div>
            </div>
            {(form.sightseeing || []).length === 0 && (
              <div style={{ padding: '1.2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.15)', marginBottom: '0.8rem' }}>
                <p style={{ margin: '0 0 0.6rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>No sightseeing entries yet.</p>
                <button type="button" className="btn-gold" style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }} onClick={handleGenerateSightseeingOnly}>
                  <Sparkles size={13} style={{ verticalAlign: '-2px', marginRight: '4px' }} /> Auto-Generate from AI Guide
                </button>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {(form.sightseeing || []).map((s, idx) => (
                <div key={idx} style={{ border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '1rem', background: 'rgba(9,20,38,0.6)', display: 'grid', gap: '0.7rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label style={{ ...labelStyle, margin: 0 }}>Sightseeing #{idx + 1}</label>
                      <button
                        type="button"
                        onClick={() => handleAiSuggestSightseeingDesc(idx)}
                        style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid var(--gold-primary)', color: '#fef08a', borderRadius: '6px', padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Sparkles size={11} color="var(--gold-primary)" /> ✨ AI Suggest Details
                      </button>
                    </div>
                    <button type="button" className="btn-glass" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', color: '#f87171' }} onClick={() => removeListItem('sightseeing', idx)}>Remove</button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
                    <div>
                      <label style={labelStyle}>Place Name *</label>
                      <input style={fieldStyle} value={s.name} onChange={(e) => updateListItem('sightseeing', idx, { name: e.target.value })} placeholder="Kashi Vishwanath Temple Darshan" />
                    </div>
                    <div>
                      <label style={labelStyle}>Video URL (YouTube)</label>
                      <input style={fieldStyle} value={s.video} onChange={(e) => updateListItem('sightseeing', idx, { video: e.target.value })} placeholder="https://youtu.be/..." />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.7rem' }}>
                    <div>
                      <label style={labelStyle}>Images (Upload File / Gemini AI Generate / Preset Pool) — {((s.images || []).length > 0 ? s.images.length : s.image ? 1 : 0)} selected</label>
                      <ItemImagePicker
                        value={s.image}
                        onChange={(url) => updateListItem('sightseeing', idx, { image: url })}
                        hint={`e.g. ${s.name || activeStudioLocation || 'Sightseeing spot'}`}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <label style={{ ...labelStyle, margin: 0 }}>Highlight #{idx + 1}</label>
                      <button
                        type="button"
                        onClick={() => handleAiSuggestHighlightTitle(idx)}
                        style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid var(--gold-primary)', color: '#fef08a', borderRadius: '6px', padding: '0.15rem 0.5rem', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                      >
                        <Sparkles size={11} color="var(--gold-primary)" /> ✨ Suggest Title
                      </button>
                    </div>
                    <button type="button" className="btn-glass" style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', color: '#f87171' }} onClick={() => removeListItem('highlights', idx)}>Remove</button>
                  </div>
                  <div>
                    <label style={labelStyle}>Title *</label>
                    <input style={fieldStyle} value={h.title} onChange={(e) => updateListItem('highlights', idx, { title: e.target.value })} placeholder="Ganga Aarti at Dashashwamedh Ghat" />
                  </div>
                  <div>
                    <label style={labelStyle}>Images (Upload File / Gemini AI Generate / Preset Pool) — {((h.images || []).length > 0 ? h.images.length : h.image ? 1 : 0)} selected</label>
                    <ItemImagePicker
                      value={h.image}
                      onChange={(url) => updateListItem('highlights', idx, { image: url })}
                      hint={`e.g. ${h.title || activeStudioLocation || 'Tour highlight'}`}
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

// ─────────────────────────────────────────────────────────────────────────────
// DESTINATION FORM — Add / Edit a full destination card
// ─────────────────────────────────────────────────────────────────────────────
const DEST_CATEGORIES = [
  'Hill Station', 'Heritage & Beaches', 'Nature', 'Pilgrimage',
  'Wildlife', 'Heritage', 'Adventure', 'Beach', 'Cultural'
];

const DEST_FORM_STEPS = [
  { key: 'basics',     label: 'Basic Info',       icon: '📝', hint: 'Name, price & details' },
  { key: 'highlights', label: 'Highlights',        icon: '🌟', hint: 'Key selling points'    },
  { key: 'sightseeing',label: 'Sightseeing',       icon: '🗺️', hint: 'Nearby attractions'   },
  { key: 'images',     label: 'Images',            icon: '🖼️', hint: 'Hero & gallery photos' }
];

export function DestinationForm({ initial, onSave, onCancel, onDirtyChange }) {
  const [form, setForm] = useState({
    name:           initial?.name           || '',
    tagline:        initial?.tagline        || '',
    category:       initial?.category       || 'Nature',
    location:       initial?.location       || '',
    description:    initial?.description    || '',
    bestTime:       initial?.bestTime       || '',
    duration:       initial?.duration       || '2 Days / 1 Night',
    startingPrice:  initial?.startingPrice  || '',
    rating:         initial?.rating         || 4.9,
    reviewsCount:   initial?.reviewsCount   || 0,
    heroImage:      initial?.heroImage      || '',
    galleryImages:  Array.isArray(initial?.galleryImages) ? initial.galleryImages : (initial?.heroImage ? [initial.heroImage] : []),
    bgMixImages:    Array.isArray(initial?.bgMixImages)   ? initial.bgMixImages   : [],
    bgMixStyle:     initial?.bgMixStyle     || 'collage-blend',
    highlights:     Array.isArray(initial?.highlights)    ? initial.highlights    : [],
    nearbyAttractions: Array.isArray(initial?.nearbyAttractions) ? initial.nearbyAttractions : [],
    weather: initial?.weather || { temp: '', condition: '', humidity: '', bestSeason: '' },
    travelGuide: initial?.travelGuide || { howToReach: '', dressCode: '', localCuisine: '', essentialTips: '' }
  });

  const [activeStep, setActiveStep]   = useState(0);
  const [aiImgPrompt, setAiImgPrompt] = useState('');
  const [aiImgStyle,  setAiImgStyle]  = useState('photorealistic');
  const [aiImgLoading, setAiImgLoading] = useState(false);
  const [aiImgError,  setAiImgError]  = useState('');
  const [aiImgSuccess,setAiImgSuccess]= useState('');
  const [aiImgTarget, setAiImgTarget] = useState('hero'); // 'hero' | 'gallery' | 'bgmix'

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    if (onDirtyChange) onDirtyChange(true);
  }, [form, onDirtyChange]);

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }));
  const setWeather = (k) => (e) => setForm(prev => ({ ...prev, weather: { ...prev.weather, [k]: e.target.value } }));
  const setGuide   = (k) => (e) => setForm(prev => ({ ...prev, travelGuide: { ...prev.travelGuide, [k]: e.target.value } }));

  // Highlight helpers
  const addHighlight    = () => setForm(p => ({ ...p, highlights: [...p.highlights, ''] }));
  const updateHighlight = (i, val) => setForm(p => ({ ...p, highlights: p.highlights.map((h, idx) => idx === i ? val : h) }));
  const removeHighlight = (i) => setForm(p => ({ ...p, highlights: p.highlights.filter((_, idx) => idx !== i) }));

  // Nearby attraction helpers
  const addAttraction    = () => setForm(p => ({ ...p, nearbyAttractions: [...p.nearbyAttractions, { name: '', distance: '', type: '' }] }));
  const updateAttraction = (i, patch) => setForm(p => ({
    ...p,
    nearbyAttractions: p.nearbyAttractions.map((a, idx) => idx === i ? { ...a, ...patch } : a)
  }));
  const removeAttraction = (i) => setForm(p => ({ ...p, nearbyAttractions: p.nearbyAttractions.filter((_, idx) => idx !== i) }));

  // Gallery image helpers
  const addGalleryImage    = (url) => setForm(p => ({ ...p, galleryImages: [...p.galleryImages, url] }));
  const removeGalleryImage = (i)   => setForm(p => ({ ...p, galleryImages: p.galleryImages.filter((_, idx) => idx !== i) }));
  const addBgMixImage      = (url) => setForm(p => ({ ...p, bgMixImages: [...p.bgMixImages, url] }));
  const removeBgMixImage   = (i)   => setForm(p => ({ ...p, bgMixImages: p.bgMixImages.filter((_, idx) => idx !== i) }));

  // AI image generation
  const handleAiGenerate = async () => {
    if (!aiImgPrompt.trim()) { setAiImgError('Please enter a description for the image'); return; }
    setAiImgLoading(true);
    setAiImgError('');
    setAiImgSuccess('');
    try {
      const styleMap = {
        photorealistic: 'Create a stunning photorealistic travel photograph',
        artistic:       'Create a vibrant artistic travel illustration',
        cinematic:      'Create a cinematic dramatic travel scene'
      };
      const fullPrompt = `${styleMap[aiImgStyle]} of ${aiImgPrompt}. Rich colors, golden hour lighting, luxury travel feel suitable for a premium travel agency website banner.`;
      const imgUrl = await geminiService.generatePosterImage(fullPrompt, aiImgStyle);
      if (aiImgTarget === 'hero') {
        setForm(p => ({ ...p, heroImage: imgUrl }));
        setAiImgSuccess('✓ Hero image generated!');
      } else if (aiImgTarget === 'gallery') {
        addGalleryImage(imgUrl);
        setAiImgSuccess('✓ Image added to gallery!');
      } else {
        addBgMixImage(imgUrl);
        setAiImgSuccess('✓ Image added to background mix!');
      }
    } catch (err) {
      setAiImgError('AI generation failed: ' + err.message);
    } finally {
      setAiImgLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      startingPrice: parseFloat(form.startingPrice) || 0,
      rating:        parseFloat(form.rating)        || 4.9,
      reviewsCount:  parseInt(form.reviewsCount)    || 0,
      highlights:    form.highlights.filter(h => h.trim()),
      nearbyAttractions: form.nearbyAttractions.filter(a => a.name.trim()),
      bgMixImages:   form.bgMixImages.length ? form.bgMixImages : (form.heroImage ? [form.heroImage] : [])
    });
  };

  const stepComplete = {
    0: !!(form.name.trim() && form.category && form.location.trim()),
    1: form.highlights.length > 0,
    2: true,
    3: !!form.heroImage.trim()
  };

  const inputStyle = { ...fieldStyle, marginBottom: 0 };

  return (
    <form onSubmit={handleSubmit} onKeyDown={e => e.key === 'Enter' && e.target.tagName === 'INPUT' && e.preventDefault()}>
      {/* Step wizard header */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.4rem' }}>
        {DEST_FORM_STEPS.map((step, idx) => {
          const isActive = activeStep === idx;
          const isDone   = idx < activeStep || stepComplete[idx];
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => setActiveStep(idx)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.45rem 0.9rem', borderRadius: '20px', cursor: 'pointer',
                border: isActive ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.15)',
                background: isActive ? 'rgba(212,175,55,0.18)' : 'rgba(255,255,255,0.05)',
                color: isActive ? '#fef08a' : isDone ? '#10b981' : 'rgba(255,255,255,0.6)',
                fontSize: '0.8rem', fontWeight: isActive ? 800 : 600, whiteSpace: 'nowrap',
                boxShadow: isActive ? '0 0 10px rgba(212,175,55,0.25)' : 'none', transition: 'all 0.2s'
              }}
            >
              <span>{step.icon}</span>
              <span>{step.label}</span>
              {isDone && !isActive && <span style={{ color: '#10b981', fontSize: '0.7rem' }}>✓</span>}
            </button>
          );
        })}
      </div>

      {/* ── STEP 0: BASIC INFO ── */}
      {activeStep === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Destination Name *</label>
            <input style={inputStyle} placeholder="e.g. Kodaikanal Princess Hills" required value={form.name} onChange={set('name')} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Tagline / Subtitle</label>
            <input style={inputStyle} placeholder="e.g. Misty Lakes & Pine Forests of the Princess Hills" value={form.tagline} onChange={set('tagline')} />
          </div>
          <div>
            <label style={labelStyle}>Category *</label>
            <select style={{ ...fieldStyle, ...{ background: '#091426', color: '#fef08a', cursor: 'pointer' } }} value={form.category} onChange={set('category')}>
              {DEST_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Location *</label>
            <input style={inputStyle} placeholder="e.g. Kodaikanal, Dindigul, Tamil Nadu" required value={form.location} onChange={set('location')} />
          </div>
          <div>
            <label style={labelStyle}>Best Time to Visit</label>
            <input style={inputStyle} placeholder="e.g. October to June" value={form.bestTime} onChange={set('bestTime')} />
          </div>
          <div>
            <label style={labelStyle}>Duration</label>
            <input style={inputStyle} placeholder="e.g. 3 Days / 2 Nights" value={form.duration} onChange={set('duration')} />
          </div>
          <div>
            <label style={labelStyle}>Starting Price (₹)</label>
            <input style={inputStyle} type="number" min="0" placeholder="e.g. 14999" value={form.startingPrice} onChange={set('startingPrice')} />
          </div>
          <div>
            <label style={labelStyle}>Rating (0–5)</label>
            <input style={inputStyle} type="number" min="0" max="5" step="0.1" value={form.rating} onChange={set('rating')} />
          </div>
          <div>
            <label style={labelStyle}>Reviews Count</label>
            <input style={inputStyle} type="number" min="0" value={form.reviewsCount} onChange={set('reviewsCount')} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Description</label>
            <textarea
              style={{ ...inputStyle, height: '90px', resize: 'vertical' }}
              placeholder="Detailed description of the destination for the website card..."
              value={form.description}
              onChange={set('description')}
            />
          </div>
          {/* Weather */}
          <div style={{ gridColumn: '1 / -1', background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.8rem' }}>🌤️ Weather Info (optional)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.7rem' }}>
              <div><label style={labelStyle}>Temperature</label><input style={inputStyle} placeholder="e.g. 18°C" value={form.weather.temp} onChange={setWeather('temp')} /></div>
              <div><label style={labelStyle}>Condition</label><input style={inputStyle} placeholder="e.g. Misty & Cool" value={form.weather.condition} onChange={setWeather('condition')} /></div>
              <div><label style={labelStyle}>Humidity</label><input style={inputStyle} placeholder="e.g. 68%" value={form.weather.humidity} onChange={setWeather('humidity')} /></div>
              <div><label style={labelStyle}>Best Season</label><input style={inputStyle} placeholder="e.g. Winter & Spring" value={form.weather.bestSeason} onChange={setWeather('bestSeason')} /></div>
            </div>
          </div>
          {/* Travel Guide */}
          <div style={{ gridColumn: '1 / -1', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '10px', padding: '1rem' }}>
            <div style={{ fontSize: '0.82rem', color: '#10b981', fontWeight: 700, marginBottom: '0.8rem' }}>🧭 Travel Guide (optional)</div>
            <div style={{ display: 'grid', gap: '0.7rem' }}>
              <div><label style={labelStyle}>How to Reach</label><textarea style={{ ...inputStyle, height: '55px', resize: 'vertical' }} placeholder="Transport details from Thrissur..." value={form.travelGuide.howToReach} onChange={setGuide('howToReach')} /></div>
              <div><label style={labelStyle}>Dress Code</label><input style={inputStyle} placeholder="e.g. Light cottons, warm layers for evening" value={form.travelGuide.dressCode} onChange={setGuide('dressCode')} /></div>
              <div><label style={labelStyle}>Local Cuisine</label><input style={inputStyle} placeholder="e.g. Nilgiri Tea, Chocolate, Ooty Varkey" value={form.travelGuide.localCuisine} onChange={setGuide('localCuisine')} /></div>
              <div><label style={labelStyle}>Essential Tips</label><textarea style={{ ...inputStyle, height: '55px', resize: 'vertical' }} placeholder="Key tips for visitors..." value={form.travelGuide.essentialTips} onChange={setGuide('essentialTips')} /></div>
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 1: HIGHLIGHTS ── */}
      {activeStep === 1 && (
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Add the key highlights / USPs of this destination — these appear as bullet points on the destination card.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem', marginBottom: '1rem' }}>
            {form.highlights.map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ color: 'var(--gold-primary)', fontSize: '1rem', flexShrink: 0 }}>🌟</span>
                <input
                  style={{ ...inputStyle, flex: 1 }}
                  placeholder={`Highlight ${i + 1} (e.g. VIP Darshan at Kashi Vishwanath)`}
                  value={h}
                  onChange={e => updateHighlight(i, e.target.value)}
                />
                <button type="button" onClick={() => removeHighlight(i)}
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', padding: '0.5rem 0.7rem', cursor: 'pointer', flexShrink: 0 }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addHighlight}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(212,175,55,0.1)', border: '1px dashed var(--gold-primary)', color: 'var(--gold-light)', borderRadius: '10px', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, width: '100%', justifyContent: 'center' }}>
            + Add Highlight
          </button>
          {form.highlights.length === 0 && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', marginTop: '2rem' }}>
              No highlights yet. Click "Add Highlight" to add key selling points.
            </div>
          )}
        </div>
      )}

      {/* ── STEP 2: SIGHTSEEING / NEARBY ATTRACTIONS ── */}
      {activeStep === 2 && (
        <div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Add nearby attractions — these appear as the "Sightseeing" section on the destination detail modal.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1rem' }}>
            {form.nearbyAttractions.map((a, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr auto', gap: '0.5rem', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '10px', padding: '0.8rem' }}>
                <div>
                  <label style={{ ...labelStyle, marginBottom: '0.25rem' }}>Place Name</label>
                  <input style={inputStyle} placeholder="e.g. Doddabetta Peak" value={a.name} onChange={e => updateAttraction(i, { name: e.target.value })} />
                </div>
                <div>
                  <label style={{ ...labelStyle, marginBottom: '0.25rem' }}>Distance</label>
                  <input style={inputStyle} placeholder="e.g. 9 km" value={a.distance} onChange={e => updateAttraction(i, { distance: e.target.value })} />
                </div>
                <div>
                  <label style={{ ...labelStyle, marginBottom: '0.25rem' }}>Type</label>
                  <input style={inputStyle} placeholder="e.g. Viewpoint" value={a.type} onChange={e => updateAttraction(i, { type: e.target.value })} />
                </div>
                <button type="button" onClick={() => removeAttraction(i)}
                  style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', padding: '0.5rem 0.7rem', cursor: 'pointer', alignSelf: 'flex-end' }}>
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addAttraction}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(16,185,129,0.08)', border: '1px dashed #10b981', color: '#10b981', borderRadius: '10px', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, width: '100%', justifyContent: 'center' }}>
            + Add Sightseeing Spot
          </button>
          {form.nearbyAttractions.length === 0 && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', marginTop: '2rem' }}>
              No sightseeing spots yet. Click above to add nearby attractions.
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3: IMAGES ── */}
      {activeStep === 3 && (
        <div>
          {/* AI Image Generator Panel */}
          <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '14px', padding: '1.2rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ✨ AI Image Generator (Gemini)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.6rem', marginBottom: '0.7rem' }}>
              <input
                style={{ ...inputStyle, border: '1px solid rgba(139,92,246,0.35)' }}
                placeholder={`Describe the image (e.g. "Ooty Toy Train winding through misty tea gardens at golden hour")`}
                value={aiImgPrompt}
                onChange={e => { setAiImgPrompt(e.target.value); setAiImgError(''); setAiImgSuccess(''); }}
              />
              <select
                value={aiImgStyle}
                onChange={e => setAiImgStyle(e.target.value)}
                style={{ background: '#0e0a26', border: '1px solid rgba(139,92,246,0.35)', color: '#a78bfa', borderRadius: '10px', padding: '0.7rem 0.8rem', fontSize: '0.85rem', outline: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                <option value="photorealistic">📷 Photorealistic</option>
                <option value="artistic">🎨 Artistic</option>
                <option value="cinematic">🎬 Cinematic</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>Add to:</span>
              {[
                { val: 'hero',    label: '🖼️ Hero Image'    },
                { val: 'gallery', label: '🗂️ Gallery'       },
                { val: 'bgmix',   label: '🎨 BG Mix Layer'  }
              ].map(opt => (
                <button key={opt.val} type="button" onClick={() => setAiImgTarget(opt.val)}
                  style={{ padding: '0.3rem 0.7rem', borderRadius: '12px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, border: aiImgTarget === opt.val ? '1px solid #a78bfa' : '1px solid rgba(255,255,255,0.15)', background: aiImgTarget === opt.val ? 'rgba(139,92,246,0.25)' : 'rgba(255,255,255,0.05)', color: aiImgTarget === opt.val ? '#a78bfa' : 'rgba(255,255,255,0.6)', transition: 'all 0.2s' }}>
                  {opt.label}
                </button>
              ))}
              <button type="button" onClick={handleAiGenerate} disabled={aiImgLoading}
                style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 1rem', borderRadius: '10px', cursor: aiImgLoading ? 'not-allowed' : 'pointer', background: aiImgLoading ? 'rgba(139,92,246,0.2)' : 'linear-gradient(135deg,#7c3aed,#4c1d95)', border: '1px solid rgba(139,92,246,0.4)', color: '#fff', fontSize: '0.82rem', fontWeight: 700, opacity: aiImgLoading ? 0.7 : 1 }}>
                {aiImgLoading ? '⏳ Generating...' : '✨ Generate'}
              </button>
            </div>
            {aiImgError   && <div style={{ marginTop: '0.5rem', color: '#f87171', fontSize: '0.8rem', fontWeight: 600 }}>⚠️ {aiImgError}</div>}
            {aiImgSuccess && <div style={{ marginTop: '0.5rem', color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>{aiImgSuccess}</div>}
          </div>

          {/* Hero Image */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ ...labelStyle, color: 'var(--gold-light)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>🖼️ Hero / Main Image</label>
            <ImageUploader
              value={form.heroImage}
              onChange={(url) => setForm(p => ({ ...p, heroImage: url }))}
            />
          </div>

          {/* Gallery Images */}
          <div style={{ marginBottom: '1.2rem' }}>
            <label style={{ ...labelStyle, color: 'var(--gold-light)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>🗂️ Gallery Images ({form.galleryImages.length})</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.6rem' }}>
              {form.galleryImages.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                  <button type="button" onClick={() => removeGalleryImage(i)}
                    style={{ position: 'absolute', top: 2, right: 2, width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(239,68,68,0.85)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <ImageUploader
              value=""
              onChange={(url) => { if (url) addGalleryImage(url); }}
              label="Upload Gallery Image"
            />
          </div>

          {/* Background Mix Images */}
          <div>
            <label style={{ ...labelStyle, color: 'var(--gold-light)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>🎨 Background Mix Images ({form.bgMixImages.length})</label>
            <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>These images are blended in the destination card background. 2–4 images recommended.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.6rem' }}>
              {form.bgMixImages.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(139,92,246,0.35)' }}>
                  <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                  <button type="button" onClick={() => removeBgMixImage(i)}
                    style={{ position: 'absolute', top: 2, right: 2, width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(239,68,68,0.85)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <ImageUploader
              value=""
              onChange={(url) => { if (url) addBgMixImage(url); }}
              label="Upload BG Mix Image"
            />
          </div>
        </div>
      )}

      {/* Step navigation */}
      <div style={{ display: 'flex', gap: '0.7rem', marginTop: '1.6rem', alignItems: 'center' }}>
        {activeStep > 0 && (
          <button type="button" onClick={() => setActiveStep(s => s - 1)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            ← Back
          </button>
        )}
        {activeStep < DEST_FORM_STEPS.length - 1 ? (
          <button type="button" onClick={() => setActiveStep(s => s + 1)}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', background: 'linear-gradient(135deg, rgba(212,175,55,0.25), rgba(212,175,55,0.1))', border: '1px solid var(--gold-primary)', color: '#fef08a', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700 }}>
            Next → {DEST_FORM_STEPS[activeStep + 1].icon} {DEST_FORM_STEPS[activeStep + 1].label}
          </button>
        ) : (
          <button type="button" onClick={() => onCancel()}
            style={{ padding: '0.6rem 1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem' }}>
            Cancel
          </button>
        )}
        <button type="submit"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.4rem', background: 'linear-gradient(135deg, #d4af37, #aa841c)', border: '1px solid rgba(212,175,55,0.4)', color: '#000', borderRadius: '10px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 800 }}>
          💾 Save Destination
        </button>
      </div>
    </form>
  );
}

