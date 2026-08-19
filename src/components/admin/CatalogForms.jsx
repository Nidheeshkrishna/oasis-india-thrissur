import React, { useState, useEffect, useRef } from 'react';
import { X, Package, Image as ImageIcon, BookOpen, Save, MonitorPlay, Sparkles, Compass, Eye, Check, Navigation, Clock, Wand2, RefreshCw, Upload, Loader2, Layers, Plus, Trash2, ChevronUp, ChevronDown, Copy, Tag, Video, Calendar, ChevronLeft, ChevronRight, Search, Globe } from 'lucide-react';
import { DESTINATIONS } from '../../data/destinationsData';
import { catalogService } from '../../services/catalog';
import { storageService } from '../../services/firebase';
import MixedBackground from '../MixedBackground';
import ImageUploader, { PRESET_IMAGES } from './ImageUploader';
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
  '🏛️ Heritage',
  '🛕 Divine',
  '✈️ International',
  '🏖️ Vacation',
  '🔥 Bestseller',
  '✨ New Launch',
  '🌟 Signature Yatra',
  '⚡ Upcoming Departure',
  '👑 Luxury Retreat',
  '🌴 Kerala Special',
  '💎 Premium Pilgrimage',
  '⭐ Highly Recommended'
];

export const PLACE_PHOTO_LIBRARY = {
  pokhara: {
    name: 'Pokhara',
    title: 'Pokhara Phewa Lake & Annapurna Reflections',
    url: './nepal_pokhara_phewa_lake.png',
    description: 'Tranquil lakeside paradise reflecting snow-capped Mount Machapuchare (Fishtail). Includes private boat ride to Tal Barahi Island Temple, roaring Davis Falls, and Gupteshwor Mahadev cave.'
  },
  muktinath: {
    name: 'Muktinath (3,710 M)',
    title: 'Muktinath Holy Temple (3,710 M Altitude)',
    url: './nepal_muktinath_temple.png',
    description: 'The sacred Vishnu & Buddhist shrine perched at 3,710m altitude in the Mustang Himalayas. Holy bath under the 108 stone water spouts (Mukti Dhara) and eternal natural flame shrine of Jwala Mai.'
  },
  kathmandu: {
    name: 'Kathmandu',
    title: 'Sacred Pashupatinath & Boudhanath Stupa',
    url: './nepal_kathmandu_pashupatinath.png',
    description: 'Revered spiritual capital of Nepal. Experience VIP darshan at the holy Pashupatinath Temple on the banks of Bagmati river, circumambulate the massive Boudhanath UNESCO Buddhist Stupa, and explore Swayambhunath.'
  },
  lumbini: {
    name: 'Lumbini',
    title: 'Lumbini Sacred Garden & Maya Devi Temple',
    url: './nepal_lumbini_sacred_garden.png',
    description: 'UNESCO World Heritage site and sacred birthplace of Lord Gautama Buddha. Visit ancient Maya Devi Temple, 3rd-century BC Ashoka Pillar, sacred Pushkarini pool, and World Peace Pagoda.'
  },
  sarangkot: {
    name: 'Sarangkot Sunrise',
    title: 'Sarangkot Golden Himalayan Sunrise Viewpoint',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
    description: 'Spectacular 5:00 AM hilltop panoramic view of golden morning sunlight breaking across the Annapurna I, Machapuchare (Fishtail), and Dhaulagiri mountain ranges.'
  },
  pashupatinath: {
    name: 'Pashupatinath',
    title: 'Holy Pashupatinath Temple Darshan & Bagmati Aarti',
    url: './nepal_kathmandu_pashupatinath.png',
    description: 'Ancient sacred pagoda temple of Lord Shiva along the holy Bagmati River in Kathmandu. Special VIP morning darshan and evening Bagmati Ganga Aarti.'
  },
  munnar: {
    name: 'Munnar',
    title: 'Munnar Misty Tea Plantations & Eravikulam',
    url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
    description: 'Lush rolling emerald tea estates, misty mountain valleys, Eravikulam National Park (Nilgiri Tahr habitat), and scenic Mattupetty Dam boating.'
  },
  athirappilly: {
    name: 'Athirappilly',
    title: 'Athirappilly Grand Niagara of India Waterfalls',
    url: './athirappilly-falls-real.jpg',
    description: 'Majestic 80-foot natural cascading waterfall nestled in the lush Chalakudy river basin with Vazhachal rainforest trails.'
  },
  wayanad: {
    name: 'Wayanad',
    title: 'Wayanad Chembra Heart Lake & Banasura Sagar',
    url: './wayanad_chembra_heart_lake_ai.png',
    description: 'Pristine rainforest retreat featuring heart-shaped Chembra Lake, ancient Edakkal stone-age caves, and Banasura Sagar earthen dam.'
  },
  varanasi: {
    name: 'Varanasi / Kashi',
    title: 'Kashi Vishwanath Temple & Ganga Aarti',
    url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    description: 'Spiritual heart of India. VIP Darshan at Kashi Vishwanath Golden Temple corridor and enchanting evening Ganga Aarti at Dashashwamedh Ghat.'
  },
  ayodhya: {
    name: 'Ayodhya',
    title: 'Ayodhya Shri Ram Janmabhoomi Mandir',
    url: './ayodhya-ram-mandir-real.jpg',
    description: 'Magnificent newly consecrated grand Shri Ram Mandir, Hanumangarhi temple, and serene evening Aarti at Saryu river ghats.'
  },
  kashmir: {
    name: 'Kashmir Valley',
    title: 'Srinagar Dal Lake Shikara & Gulmarg Gondola',
    url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    description: 'Paradise on Earth. Romantic Shikara ride on Dal Lake, floating houseboat stay, and high-altitude Gulmarg snow Gondola cable car ride.'
  },
  ooty: {
    name: 'Ooty',
    title: 'Ooty Nilgiri Heritage Toy Train & Botanical Gardens',
    url: './ooty-toy-train-real.jpg',
    description: 'UNESCO Heritage steam toy train ride, 55-acre Government Botanical Gardens, and pedal boating across misty Ooty Lake.'
  },
  kovalam: {
    name: 'Kovalam Beach',
    title: 'Kovalam Lighthouse Beach & Sunset Promenade',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    description: 'Crescent-shaped golden sand beaches, historic red-and-white striped lighthouse, and refreshing Arabian Sea coastal breeze.'
  },
  alleppey: {
    name: 'Alleppey Backwaters',
    title: 'Alleppey Luxury Houseboat Cruise & Vembanad Lake',
    url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    description: 'Tranquil palm-fringed backwaters, traditional Kettuvallam luxury houseboat cruise, and authentic Kerala village canals.'
  },
  kodaikanal: {
    name: 'Kodaikanal',
    title: 'Kodaikanal Star Lake & Pine Forest Walk',
    url: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1200&q=80',
    description: 'Princess of Hill Stations featuring misty pine forests, star-shaped lake, and Pillar Rocks.'
  },
  goa: {
    name: 'Goa Beaches',
    title: 'Goa Golden Coastline & Heritage Palaces',
    url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    description: 'Scenic tropical palm beaches, vibrant coastline, and Portuguese architecture.'
  },
  tajmahal: {
    name: 'Taj Mahal Agra',
    title: 'Taj Mahal UNESCO World Wonder',
    url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
    description: 'Magnificent white marble mausoleum monument of eternal love on the Yamuna river.'
  },
  jaipur: {
    name: 'Jaipur Pink City',
    title: 'Hawa Mahal & Amer Fort Royal Trail',
    url: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    description: 'Royal Rajasthani heritage, Hawa Mahal Palace of Winds, and Amer Fort.'
  },
  manali: {
    name: 'Manali & Solang',
    title: 'Manali Snow Valley & Rohtang Pass',
    url: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80',
    description: 'Snowy Himalayan mountain peaks, Beas river valley, and Solang adventure sports.'
  },
  ladakh: {
    name: 'Ladakh & Pangong',
    title: 'Pangong Tso Blue Himalayan Lake',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    description: 'Mesmerizing high-altitude sapphire lake, rugged mountain passes, and ancient monasteries.'
  },
  hampi: {
    name: 'Hampi Heritage',
    title: 'Hampi Vijayanagara Stone Chariot & Ruins',
    url: 'https://images.unsplash.com/photo-1600100397608-f010f443a131?auto=format&fit=crop&w=1200&q=80',
    description: 'UNESCO World Heritage architectural wonders and boulder-strewn Tungabhadra landscapes.'
  },
  rameshwaram: {
    name: 'Rameshwaram',
    title: 'Rameshwaram Temple & Pamban Sea Bridge',
    url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    description: 'Holy Jyotirlinga teertham, Ramanathaswamy corridor, and historic Pamban railway bridge.'
  },
  kedarnath: {
    name: 'Kedarnath Yatra',
    title: 'Holy Kedarnath Himalayan Temple',
    url: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80',
    description: 'Revered ancient Shiva temple in the Garhwal Himalayas at 3,583m altitude.'
  },
  puri: {
    name: 'Puri Jagannath',
    title: 'Puri Shree Jagannath Mandir & Golden Beach',
    url: './puri-jagannath-real.jpg',
    description: 'Sacred Dham in Odisha with 56 Bhog Mahaprasad and Golden Beach promenade.'
  },
  parambikulam: {
    name: 'Parambikulam Tiger Reserve',
    title: 'Parambikulam Forest & Bamboo Rafting',
    url: './parambikulam-forest-real.jpg',
    description: 'Lush evergreen rainforest, Kannimara teak, and bamboo boating safari.'
  },
  thanjavur: {
    name: 'Thanjavur Brihadeeswara Temple',
    title: 'Brihadeeswara Big Temple (UNESCO World Heritage Chola Wonder)',
    url: './thanjavur_brihadeeswara_temple.png',
    description: 'World-famous 1,000-year-old granite wonder built by Emperor Raja Raja Chola I with 216-ft Vimana tower and monolithic Nandi.'
  },
  chidambaram: {
    name: 'Chidambaram Thillai Nataraja',
    title: 'Thillai Nataraja Kshethram (Akasa Sthalam)',
    url: './chidambaram_nataraja_temple.png',
    description: 'Sacred Akasa Pancha Bhoota Sthalam with golden roof Kanakasabha where Lord Shiva performs cosmic Ananda Tandavam.'
  },
  srirangam: {
    name: 'Srirangam Sri Ranganathaswamy',
    title: 'Sri Ranganathaswamy Maha Temple (Trichy)',
    url: './srirangam_ranganathaswamy_temple.png',
    description: 'Premier Divya Desam spanning 156 acres on Kaveri island with 21 magnificent gopurams and Lord Ranganatha in reclining posture.'
  },
  kumbakonam: {
    name: 'Kumbakonam Temples & Vaitheeswaran Koil',
    title: 'Adi Kumbeswarar, Sarangapani, Chakrapani & Vaitheeswaran Koil',
    url: './thanjavur_yathra_poster.png',
    description: 'Ancient temple city trinity temples with sacred Mahamaham tank and powerful healing shrine of Vaitheeswaran Koil.'
  }
};

export function getMatchingPlacePhotos(query) {
  if (!query || typeof query !== 'string') return [];
  const q = query.toLowerCase().trim();
  const results = [];
  for (const [key, item] of Object.entries(PLACE_PHOTO_LIBRARY)) {
    if (q.includes(key) || key.includes(q) || item.name.toLowerCase().includes(q) || item.title.toLowerCase().includes(q)) {
      results.push(item);
    }
  }
  return results;
}

/**
 * Live search for authentic original photography from Wikimedia Commons & public databases
 */
export const searchOriginalOnlinePhotos = async (query) => {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];
  const q = query.trim();
  try {
    const wikiRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(q + ' tourism attraction')}&gsrlimit=14&prop=pageimages|extracts&piprop=original|thumbnail&pithumbsize=1200&exintro=1&explaintext=1`
    );
    if (!wikiRes.ok) return [];
    const data = await wikiRes.json();
    const pages = data.query?.pages ? Object.values(data.query.pages) : [];
    const results = [];
    const seenUrls = new Set();

    for (const page of pages) {
      const imgUrl = page.original?.source || page.thumbnail?.source;
      if (imgUrl && !seenUrls.has(imgUrl) && !imgUrl.endsWith('.svg') && !imgUrl.includes('flag') && !imgUrl.includes('icon')) {
        seenUrls.add(imgUrl);
        results.push({
          id: `wiki-${page.pageid || Math.random()}`,
          name: page.title,
          title: page.title,
          url: imgUrl,
          category: 'Original Landmark Photo',
          type: 'original',
          source: 'Wikimedia Commons',
          description: page.extract ? page.extract.slice(0, 120) + '...' : `Original authentic photograph of ${page.title}.`
        });
      }
    }
    return results;
  } catch (err) {
    console.warn('Original photo search error:', err);
    return [];
  }
};

/**
 * Aggregates and ranks matching AI & curated photo suggestions for Main Tour Cover Photo
 */
export function getCoverPhotoAiSuggestions(query, defaultLocation = '', sessionAiImages = [], liveOnlineImages = [], filterType = 'all') {
  const q = (query || defaultLocation || '').toLowerCase().trim();
  let results = [];
  const seenUrls = new Set();

  // 1. Live fetched original online photos from Wikimedia
  (liveOnlineImages || []).forEach(img => {
    if (img && img.url && !seenUrls.has(img.url)) {
      if (!q || img.name?.toLowerCase().includes(q) || img.category?.toLowerCase().includes(q)) {
        seenUrls.add(img.url);
        results.push({
          id: img.id || img.url,
          name: img.name || 'Original Landmark Photo',
          title: img.title || img.name,
          url: img.url,
          category: img.category || 'Original Photo',
          type: 'original',
          source: img.source || 'Wikimedia'
        });
      }
    }
  });

  // 2. Session-generated AI images
  (sessionAiImages || []).forEach(img => {
    if (img && img.url && !seenUrls.has(img.url)) {
      if (!q || img.name?.toLowerCase().includes(q) || img.category?.toLowerCase().includes(q)) {
        seenUrls.add(img.url);
        results.push({
          id: img.id || img.url,
          name: img.name || 'AI Generated Scene',
          title: img.title || img.name,
          url: img.url,
          category: img.category || 'AI Visual',
          type: 'ai'
        });
      }
    }
  });

  // 3. Matching items from PLACE_PHOTO_LIBRARY
  for (const [key, item] of Object.entries(PLACE_PHOTO_LIBRARY)) {
    if (!seenUrls.has(item.url)) {
      const match = !q || q.includes(key) || key.includes(q) || item.name.toLowerCase().includes(q) || item.title.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q);
      if (match) {
        seenUrls.add(item.url);
        const isAi = item.url.includes('_ai.') || item.url.includes('nepal_');
        results.push({
          id: key,
          name: item.name,
          title: item.title,
          url: item.url,
          category: item.name,
          type: isAi ? 'ai' : 'original'
        });
      }
    }
  }

  // 4. Matching items from PRESET_IMAGES
  if (Array.isArray(PRESET_IMAGES)) {
    PRESET_IMAGES.forEach(it => {
      if (it && it.url && !seenUrls.has(it.url)) {
        const match = !q || it.name.toLowerCase().includes(q) || it.category.toLowerCase().includes(q) || it.id.toLowerCase().includes(q);
        if (match) {
          seenUrls.add(it.url);
          results.push({
            id: it.id,
            name: it.name,
            title: it.name,
            url: it.url,
            category: it.category,
            type: it.url.includes('_ai.') ? 'ai' : 'original'
          });
        }
      }
    });
  }

  // 5. If fewer than 5 items matched, append rest of library so the horizontal list is always rich
  if (results.length < 5) {
    for (const [key, item] of Object.entries(PLACE_PHOTO_LIBRARY)) {
      if (!seenUrls.has(item.url)) {
        seenUrls.add(item.url);
        results.push({
          id: key,
          name: item.name,
          title: item.title,
          url: item.url,
          category: item.name,
          type: item.url.includes('_ai.') || item.url.includes('nepal_') ? 'ai' : 'original'
        });
      }
    }
  }

  // Filter based on user-selected filterType tab ('all' | 'original' | 'ai')
  if (filterType === 'original') {
    results = results.filter(r => r.type === 'original' || r.type === 'real' || !r.type?.includes('ai'));
  } else if (filterType === 'ai') {
    results = results.filter(r => r.type === 'ai');
  }

  return results;
}

export function AdminFormModal({ title, icon: Icon, onClose, children, fullscreen = false, dirty = false }) {
  const requestClose = () => {
    if (dirty && !window.confirm('You have unsaved changes in this form. Discard them and close?')) return;
    onClose();
  };
  return (
    <div 
      className="admin-form-modal-overlay" 
      style={{ 
        zIndex: 10002,
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }} 
      onClick={requestClose}
    >
      <div
        className={`admin-form-modal-card ${fullscreen ? 'fullscreen' : ''}`}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: fullscreen ? '1000px' : '960px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: 'rgba(8, 14, 28, 0.98)',
          border: '1px solid var(--border-gold)',
          borderRadius: '16px',
          padding: 'clamp(1rem, 3vw, 2rem)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', paddingBottom: '0.6rem', borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
          <h3 style={{ color: 'var(--gold-light)', fontSize: 'clamp(0.95rem, 2.5vw, 1.25rem)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-heading)', margin: 0, overflow: 'hidden' }}>
            <Icon size={20} color="var(--gold-primary)" style={{ flexShrink: 0 }} /> 
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
          </h3>
          <button
            onClick={requestClose}
            title="Close (Esc)"
            style={{
              width: '36px', height: '36px', borderRadius: '50%', flexShrink: 0,
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-gold)',
              color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
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
    <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
      <button type="button" className="btn-glass" onClick={onCancel} style={{ flex: '1 1 120px', justifyContent: 'center' }}>
        Cancel
      </button>
      <button type="submit" className="btn-gold" style={{ flex: '2 1 180px', justifyContent: 'center' }}>
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
  if (combined.includes('nepal') || combined.includes('kathmandu') || combined.includes('pokhara') || combined.includes('chitwan') || combined.includes('everest') || combined.includes('pashupatinath') || combined.includes('sarangkot')) return 'Nepal';
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
  
  return title.trim() || inputLoc.trim() || 'Nepal';
};

const resolveDestinationIdFromKeyword = (key = '') => {
  const k = key.toLowerCase();
  if (k.includes('nepal') || k.includes('kathmandu') || k.includes('pokhara') || k.includes('chitwan') || k.includes('everest')) return 'nepal-himalayan-kingdom';
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
  if (k.includes('thanjavur') || k.includes('chidambaram') || k.includes('srirangam') || k.includes('kumbakonam')) return 'thanjavur-chidambaram-srirangam';
  return DESTINATIONS[0]?.id || 'nepal-himalayan-kingdom';
};

// Comprehensive Complete Blueprints for Instant 1-Click Package Autofill
export const AUTOFILL_DESTINATION_BLUEPRINTS = {
  'thanjavur': {
    keyword: 'Thanjavur',
    displayName: 'Thanjavur • Chidambaram • Srirangam Yathra',
    title: 'Thanjavur • Chidambaram • Srirangam Yathra',
    subtitle: '4 Days Grand Chola Temple Pilgrimage • AC Bus Departure from Thrissur • 1 Night Stay & 6 Meals Included',
    destinationId: 'thanjavur-chidambaram-srirangam',
    durationDays: 4,
    durationNights: 3,
    price: 4200,
    originalPrice: 5499,
    badge: '⚡ October 9 – 12 Departure • Special Temple Yathra',
    image: './thanjavur_yathra_poster.png',
    bgMixImages: [
      './thanjavur_yathra_poster.png',
      './thanjavur_brihadeeswara_temple.png',
      './chidambaram_nataraja_temple.png',
      './srirangam_ranganathaswamy_temple.png'
    ],
    bgMixStyle: 'collage-blend',
    mainPlaces: 'Thanjavur Brihadeeswara Temple, Chidambaram Thillai Nataraja Kshethram, Srirangam Sri Ranganathaswamy Temple, Kumbakonam & Vaitheeswaran Koil',
    included: `Comfortable AC Bus transportation from Thrissur & return
6 Delicious pure vegetarian meals included throughout the tour
1 Night comfortable hotel accommodation in Kumbakonam / Thanjavur
All temple entry passes & special darshan arrangements
Brihadeeswara Temple UNESCO Big Temple guided visit
Chidambaram Thillai Nataraja Kshethram Darshan
Srirangam Sri Ranganathaswamy Temple VIP Darshan
Kumbakonam Temples (Adi Kumbeswarar, Sarangapani, Chakrapani)
Vaitheeswaran Koil Lord Vaidyanatha healing shrine visit
Experienced Malayali Tour Escort & dedicated pilgrimage assistance from Thrissur`,
    sightseeing: [
      {
        name: 'Thanjavur Brihadeeswara Temple (Big Temple)',
        image: './thanjavur_brihadeeswara_temple.png',
        images: ['./thanjavur_brihadeeswara_temple.png'],
        text: 'World-famous 1,000-year-old UNESCO World Heritage granite marvel built by Raja Raja Chola I with 216-ft Vimana tower and monolithic Nandi.',
        video: '',
        location: 'Thanjavur'
      },
      {
        name: 'Chidambaram Thillai Nataraja Kshethram',
        image: './chidambaram_nataraja_temple.png',
        images: ['./chidambaram_nataraja_temple.png'],
        text: 'One of the Pancha Bhoota Sthalams (Akasa / Space Lingam). Sacred golden roof hall where Lord Shiva performs the cosmic Ananda Tandavam dance.',
        video: '',
        location: 'Chidambaram'
      },
      {
        name: 'Srirangam Sri Ranganathaswamy Temple',
        image: './srirangam_ranganathaswamy_temple.png',
        images: ['./srirangam_ranganathaswamy_temple.png'],
        text: 'First and premier of the 108 Divya Desams spanning 156 acres on the Kaveri river island with 21 magnificent gopurams and reclining Lord Ranganatha.',
        video: '',
        location: 'Trichy Srirangam'
      },
      {
        name: 'Kumbakonam Temples & Vaitheeswaran Koil',
        image: './thanjavur_yathra_poster.png',
        images: ['./thanjavur_yathra_poster.png'],
        text: 'Ancient temple city shrines including Adi Kumbeswarar, chariot-shaped Sarangapani, Chakrapani, and holy healing shrine of Vaitheeswaran Koil.',
        video: '',
        location: 'Kumbakonam'
      }
    ],
    highlights: [
      { title: 'Brihadeeswara UNESCO Big Temple', image: './thanjavur_brihadeeswara_temple.png', images: ['./thanjavur_brihadeeswara_temple.png'], location: 'Thanjavur' },
      { title: 'Chidambaram Nataraja Akasa Sthalam', image: './chidambaram_nataraja_temple.png', images: ['./chidambaram_nataraja_temple.png'], location: 'Chidambaram' },
      { title: 'Srirangam 108 Divya Desam', image: './srirangam_ranganathaswamy_temple.png', images: ['./srirangam_ranganathaswamy_temple.png'], location: 'Srirangam' },
      { title: 'Kumbakonam & Vaitheeswaran Koil', image: './thanjavur_yathra_poster.png', images: ['./thanjavur_yathra_poster.png'], location: 'Kumbakonam' }
    ],
    routePoints: [
      { name: 'Oasis India Holidays LLP, Rohini Plaza, Thrissur', type: 'start', address: 'Near Railway Station, Thrissur - 21', time: '09:00 PM', lat: 10.5276, lng: 76.2144 },
      { name: 'Kumbakonam Temples', type: 'stop', address: 'Kumbakonam, Tamil Nadu', time: '06:30 AM', lat: 10.9602, lng: 79.3845 },
      { name: 'Vaitheeswaran Koil', type: 'stop', address: 'Vaitheeswaran Koil, Tamil Nadu', time: '03:00 PM', lat: 11.2008, lng: 79.7128 },
      { name: 'Thanjavur Brihadeeswara Temple', type: 'stop', address: 'Thanjavur, Tamil Nadu', time: '07:30 AM', lat: 10.7828, lng: 79.1318 },
      { name: 'Chidambaram Nataraja Temple', type: 'stop', address: 'Chidambaram, Tamil Nadu', time: '12:00 PM', lat: 11.3992, lng: 79.6935 },
      { name: 'Srirangam Ranganathaswamy Temple', type: 'stop', address: 'Srirangam, Trichy, Tamil Nadu', time: '04:30 PM', lat: 10.8624, lng: 78.6901 },
      { name: 'Return to Thrissur', type: 'drop', address: 'Thrissur, Kerala', time: '05:00 AM', lat: 10.5276, lng: 76.2144 }
    ]
  },
  'nepal': {
    keyword: 'Nepal',
    displayName: 'Nepal (Kathmandu, Pokhara & Chitwan)',
    title: 'Himalayan Marvels: Nepal Kathmandu Valley, Pokhara Lakes & Annapurna Sunrise Yatra',
    subtitle: 'Thrissur / Cochin Departure Special • Sacred Pashupatinath Darshan, Phewa Lake Boating & Sarangkot Himalayan Sunrise',
    destinationId: 'nepal-himalayan-kingdom',
    durationDays: 6,
    durationNights: 5,
    price: 38999,
    originalPrice: 45999,
    badge: '✨ International Bestseller',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1920&q=85',
    bgMixImages: [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80'
    ],
    bgMixStyle: 'collage-blend',
    mainPlaces: 'Kathmandu, Pokhara, Chitwan, Nagarkot, Bhaktapur, Pashupatinath, Phewa Lake, Sarangkot',
    included: `Return Flight Assistance from Cochin / Thrissur to Kathmandu
5 Nights Luxury 4-Star Hotel Accommodation (Twin / Double Sharing)
Daily Buffet Breakfast & Chef-Curated Multi-Cuisine Dinners
Dedicated AC Tourist Coach with Experienced Mountain Driver & Escort
VIP Darshan Passes for Pashupatinath & Guhyeshwari Temple
Sarangkot Sunrise Excursion with Annapurna Himalayan Views
Scenic Phewa Lake Boating & Tal Barahi Island Temple Visit
Chitwan National Park Jungle Safari & Tharu Cultural Folk Dance
All Nepal Tourist Entry Permits, TIMS Cards & Heritage Site Fees
Dedicated Malayalam & English speaking OASIS Tour Manager throughout`,
    sightseeing: [
      {
        name: 'Pashupatinath Temple & Sacred Bagmati River',
        image: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1200&q=80',
        images: ['https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1200&q=80'],
        text: 'UNESCO World Heritage 5th-century sacred Shiva shrine on the Bagmati River. Witness golden pagoda architecture and evening sandhya Maha Aarti.',
        video: '',
        location: 'Kathmandu'
      },
      {
        name: 'Pokhara Phewa Lake & Tal Barahi Island Temple',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'],
        text: 'Serene freshwater lake in Pokhara mirroring Mt. Machapuchare and the Annapurna range. Includes private boat cruise to the island temple of Tal Barahi.',
        video: '',
        location: 'Pokhara'
      },
      {
        name: 'Sarangkot Annapurna & Dhaulagiri Sunrise Viewpoint',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'],
        text: 'Perched at 1,600m above sea level, Sarangkot offers a world-famous 360-degree golden sunrise panorama across Annapurna I, Machapuchare and Dhaulagiri.',
        video: '',
        location: 'Pokhara'
      },
      {
        name: 'Swayambhunath Monkey Temple Stupa',
        image: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1200&q=80',
        images: ['https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1200&q=80'],
        text: 'Ancient 5th-century Buddhist stupa atop a Kathmandu hilltop with all-seeing Buddha eyes, prayer wheels and 360-degree valley vistas.',
        video: '',
        location: 'Kathmandu'
      },
      {
        name: 'Boudhanath Stupa (Tibetan Mandala)',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
        images: ['https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'],
        text: 'One of the largest spherical stupas in the world. Experience peaceful chanting, prayer wheels, Tibetan thangkas, and rooftop sunset cafes.',
        video: '',
        location: 'Kathmandu'
      },
      {
        name: 'Chitwan National Park Tiger & Rhino Safari',
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
        images: ['https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80'],
        text: 'UNESCO World Heritage subtropical wildlife sanctuary. Open jeep safari to spot the endangered One-Horned Rhinoceros, Bengal Tigers, and birdlife.',
        video: '',
        location: 'Chitwan'
      },
      {
        name: 'Bhaktapur Durbar Square & 55-Window Palace',
        image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
        images: ['https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80'],
        text: 'Medieval Newari open-air museum featuring the 55-Window Palace, Golden Gate, Nyatapola five-tier pagoda, and traditional artisan pottery squares.',
        video: '',
        location: 'Bhaktapur'
      },
      {
        name: 'Nagarkot Himalayan Mount Everest Panoramic Ridge',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'],
        text: 'High-altitude mountain ridge at 2,175m offering sunrise horizon panoramas of 8 Himalayan ranges including Mount Everest on clear morning skies.',
        video: '',
        location: 'Nagarkot'
      }
    ],
    highlights: [
      {
        title: 'Sarangkot Golden Annapurna Himalayan Sunrise',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
        images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80'],
        location: 'Pokhara'
      },
      {
        title: 'Phewa Lake Wooden Boat Ride with Fishtail Reflection',
        image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'],
        location: 'Pokhara'
      },
      {
        title: 'Pashupatinath Evening Sacred Bagmati Maha Aarti',
        image: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1200&q=80',
        images: ['https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=1200&q=80'],
        location: 'Kathmandu'
      },
      {
        title: 'Chitwan Jungle Safari & One-Horned Rhino Sighting',
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80',
        images: ['https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80'],
        location: 'Chitwan'
      }
    ],
    routePoints: [
      { name: 'Thrissur Swaraj Round Main Office', type: 'start', address: 'Thrissur, Kerala', time: '05:00 AM', lat: 10.5276, lng: 76.2144 },
      { name: 'Cochin International Airport (COK)', type: 'pickup', address: 'Nedumbassery, Kochi', time: '06:30 AM', lat: 10.1518, lng: 76.3930 },
      { name: 'Kathmandu Tribhuvan Airport (KTM)', type: 'stop', address: 'Kathmandu Valley, Nepal', time: '01:30 PM', lat: 27.6966, lng: 85.3591 },
      { name: 'Pashupatinath & Boudhanath Stupa', type: 'stop', address: 'Kathmandu, Nepal', time: '04:30 PM', lat: 27.7105, lng: 85.3487 },
      { name: 'Pokhara Phewa Lake & Lakeside', type: 'stop', address: 'Pokhara, Gandaki, Nepal', time: '09:00 AM', lat: 28.2096, lng: 83.9856 },
      { name: 'Sarangkot Mountain Viewpoint', type: 'stop', address: 'Sarangkot, Pokhara, Nepal', time: '05:15 AM', lat: 28.2439, lng: 83.9486 },
      { name: 'Chitwan National Park Jungle Camp', type: 'stop', address: 'Sauraha, Chitwan, Nepal', time: '02:00 PM', lat: 27.5794, lng: 84.4988 },
      { name: 'Nagarkot Himalayan Panorama Ridge', type: 'stop', address: 'Nagarkot, Bhaktapur, Nepal', time: '04:30 PM', lat: 27.7172, lng: 85.5200 },
      { name: 'Cochin International Airport / Thrissur Return', type: 'drop', address: 'Thrissur Swaraj Round, Kerala', time: '08:30 PM', lat: 10.5276, lng: 76.2144 }
    ]
  },
  'kashmir': {
    keyword: 'Kashmir',
    displayName: 'Kashmir & Punjab Golden Circuit',
    title: 'Paradise on Earth: Kashmir Valley, Gulmarg Snow & Dal Lake Shikara',
    subtitle: 'Thrissur Direct Flight Escorted Tour • Deluxe Houseboat, Apharwat Gondola & Golden Temple Amritsar',
    destinationId: 'kashmir-punjab-golden-trail',
    durationDays: 7,
    durationNights: 6,
    price: 49999,
    originalPrice: 57999,
    badge: 'Luxury Himalayan Escape',
    image: './kashmir_paradise_ai.png',
    bgMixImages: ['./kashmir_paradise_ai.png', './dal-lake-shikara-real.jpg', './gulmarg-real.jpg', './golden-temple-amritsar-real.jpg'],
    bgMixStyle: 'collage-blend',
    mainPlaces: 'Srinagar, Gulmarg, Pahalgam, Sonamarg, Amritsar',
    included: `Round-trip Cochin to Srinagar flight arrangements
Deluxe Dal Lake Houseboat overnight stay & shikara transfers
Gulmarg Gondola (Phase 1 & 2) VIP priority cable car tickets
Sonamarg Thajiwas Glacier pony trek with warm gear
Golden Temple VIP Darshan entry & Wagah Border reserved seats
Luxury AC coach between Srinagar, Gulmarg, Pahalgam & Amritsar
Daily breakfast & dinner with Kashmiri Wazwan & Punjabi specials
Dedicated Malayalam & English speaking OASIS tour manager throughout`,
    sightseeing: [
      { name: 'Dal Lake Royal Shikara & Floating Gardens', image: './dal-lake-shikara-real.jpg', images: ['./dal-lake-shikara-real.jpg'], text: 'Mirror-still lake waters, floating lotus gardens, and traditional shikara rides.', location: 'Srinagar' },
      { name: 'Gulmarg Gondola & Mount Apharwat Peak', image: './gulmarg-real.jpg', images: ['./gulmarg-real.jpg'], text: 'World-famous high altitude cable car ascending to 13,780 ft snow peaks.', location: 'Gulmarg' },
      { name: 'Amritsar Golden Temple (Harmandir Sahib)', image: './golden-temple-amritsar-real.jpg', images: ['./golden-temple-amritsar-real.jpg'], text: 'Spiritual sanctum, holy sarovar dip, and community langar meal.', location: 'Amritsar' }
    ],
    highlights: [
      { title: 'Dal Lake Houseboat Twilight', image: './dal-lake-shikara-real.jpg', location: 'Srinagar' },
      { title: 'Gulmarg Gondola Snow Ridge', image: './gulmarg-real.jpg', location: 'Gulmarg' }
    ],
    routePoints: [
      { name: 'Thrissur Swaraj Round', type: 'start', address: 'Thrissur, Kerala', time: '04:30 AM', lat: 10.5276, lng: 76.2144 },
      { name: 'Cochin International Airport (COK)', type: 'pickup', address: 'Nedumbassery, Kerala', time: '06:00 AM', lat: 10.1518, lng: 76.3930 },
      { name: 'Srinagar Airport (SXR)', type: 'stop', address: 'Srinagar, Kashmir', time: '02:00 PM', lat: 33.9871, lng: 74.7744 },
      { name: 'Gulmarg Gondola Base', type: 'stop', address: 'Gulmarg, Kashmir', time: '09:00 AM', lat: 34.0484, lng: 74.3805 },
      { name: 'Amritsar Golden Temple', type: 'stop', address: 'Amritsar, Punjab', time: '04:00 PM', lat: 31.6200, lng: 74.8765 },
      { name: 'Return to Thrissur', type: 'drop', address: 'Thrissur Swaraj Round', time: '09:00 PM', lat: 10.5276, lng: 76.2144 }
    ]
  },
  'munnar': {
    keyword: 'Munnar',
    displayName: 'Munnar Tea Highlands',
    title: 'Emerald Munnar: Kolukkumalai Sunrise & Rajamalai Tahr Safari',
    subtitle: 'Thrissur Direct Pickup Escorted Hill Station & Treehouse Resort Retreat',
    destinationId: 'munnar-tea-plantations',
    durationDays: 3,
    durationNights: 2,
    price: 15999,
    originalPrice: 18999,
    badge: 'Popular Hill Station',
    image: './munnar-tea-plantations-real.jpg',
    bgMixImages: ['./munnar-tea-plantations-real.jpg', 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Mattupetty_Lake_View.jpg/960px-Mattupetty_Lake_View.jpg'],
    bgMixStyle: 'collage-blend',
    mainPlaces: 'Munnar, Kolukkumalai, Eravikulam, Mattupetty, Kundala',
    included: `Private Luxury AC Vehicle from Thrissur Swaraj Round\n4-Star Resort Stay with Breakfast & Multi-course Dinner\nEravikulam National Park Safari Tickets\nKolukkumalai Sunrise 4x4 Jeep Safari\nMattupetty Dam Speedboating\nDedicated Malayalam speaking OASIS escort`,
    sightseeing: [
      { name: 'Eravikulam Rajamalai Nilgiri Tahr Sanctuary', image: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80', images: ['https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80'], text: 'Habitat of the endangered Nilgiri Tahr with scenic rolling tea slopes.', location: 'Munnar' },
      { name: 'Kolukkumalai Tea Estate (7,900 ft)', image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=80', images: ['https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=80'], text: 'Highest organic tea estate in the world with breathtaking cloud-bed sunrise.', location: 'Munnar' }
    ],
    highlights: [
      { title: 'Kolukkumalai Cloud-Bed Sunrise', image: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=80', location: 'Munnar' }
    ],
    routePoints: [
      { name: 'Thrissur Swaraj Round', type: 'start', address: 'Thrissur, Kerala', time: '06:00 AM', lat: 10.5276, lng: 76.2144 },
      { name: 'Munnar Town', type: 'stop', address: 'Munnar, Idukki', time: '11:00 AM', lat: 10.0889, lng: 77.0595 },
      { name: 'Return to Thrissur', type: 'drop', address: 'Thrissur, Kerala', time: '07:00 PM', lat: 10.5276, lng: 76.2144 }
    ]
  },
  'ooty': {
    keyword: 'Ooty',
    displayName: 'Ooty Nilgiri Hills & Toy Train',
    title: 'Queen of Nilgiris: Ooty Heritage Toy Train & Tea Highlands Yatra',
    subtitle: 'Thrissur Departure Special • Reserved UNESCO Steam Train & Ooty Lake Boating',
    destinationId: 'ooty-nilgiri-hills',
    durationDays: 3,
    durationNights: 2,
    price: 14999,
    originalPrice: 17999,
    badge: 'Heritage UNESCO Tour',
    image: './ooty-toy-train-real.jpg',
    bgMixImages: ['./ooty-toy-train-real.jpg', './ooty-botanical-garden-real.jpg', './ooty-lake-boating-real.jpg', './ooty-tea-gardens-real.jpg'],
    bgMixStyle: 'collage-blend',
    mainPlaces: 'Ooty, Coonoor, Doddabetta, Pykara Lake, Nilgiri Steam Rail',
    included: `Luxury AC Coach from Thrissur Swaraj Round\nReserved VIP Seats for Nilgiri UNESCO Toy Train\n4-Star Hill Resort Accommodation with Breakfast & Dinner\nGovernment Botanical Gardens & Italian Glasshouse Entry\nOoty Lake Boating & Doddabetta Peak Safari\nMalayalam/English speaking OASIS guide throughout`,
    sightseeing: [
      { name: 'Nilgiri Mountain Toy Train (UNESCO)', image: './ooty-toy-train-real.jpg', images: ['./ooty-toy-train-real.jpg'], text: 'Historic steam locomotive chugging through Nilgiri mountain gorges and tunnels.', location: 'Ooty' },
      { name: 'Government Botanical Garden', image: './ooty-botanical-garden-real.jpg', images: ['./ooty-botanical-garden-real.jpg'], text: '55-acre botanical wonderland featuring 1,000+ exotic floral species and glasshouse.', location: 'Ooty' }
    ],
    highlights: [
      { title: 'Nilgiri Heritage Steam Ride', image: './ooty-toy-train-real.jpg', location: 'Ooty' }
    ],
    routePoints: [
      { name: 'Thrissur Swaraj Round', type: 'start', address: 'Thrissur, Kerala', time: '06:00 AM', lat: 10.5276, lng: 76.2144 },
      { name: 'Palakkad By-pass Junction', type: 'pickup', address: 'Palakkad, Kerala', time: '07:30 AM', lat: 10.7867, lng: 76.6548 },
      { name: 'Ooty Charing Cross', type: 'stop', address: 'Ooty, Tamil Nadu', time: '12:30 PM', lat: 11.4102, lng: 76.6950 },
      { name: 'Return to Thrissur', type: 'drop', address: 'Thrissur, Kerala', time: '08:00 PM', lat: 10.5276, lng: 76.2144 }
    ]
  }
};

// Dynamic helper to resolve any destination blueprint
export const getDestinationAutofillBlueprint = (query = '', allDests = []) => {
  const q = (query || '').trim().toLowerCase();
  if (!q) return AUTOFILL_DESTINATION_BLUEPRINTS['nepal'];

  // 1. Direct blueprint match
  for (const [key, bp] of Object.entries(AUTOFILL_DESTINATION_BLUEPRINTS)) {
    if (q.includes(key) || key.includes(q)) return bp;
  }

  // 2. Lookup in all destinations catalog
  const matchedDest = allDests.find(d => 
    (d.name && d.name.toLowerCase().includes(q)) || 
    (d.id && d.id.toLowerCase().includes(q)) || 
    (d.location && d.location.toLowerCase().includes(q))
  );

  // 3. Fallback to AI guide generation
  const guide = generateAiDestinationGuide(query);
  const locName = guide.locationName || query;
  const pDays = 4;
  const pNights = 3;

  return {
    keyword: locName,
    displayName: locName,
    title: `${locName} Signature Expedition & Highlights Tour`,
    subtitle: `Thrissur Direct Departure Special • Premium Escorted Sightseeing in ${locName}`,
    destinationId: matchedDest?.id || resolveDestinationIdFromKeyword(locName),
    durationDays: pDays,
    durationNights: pNights,
    price: matchedDest?.startingPrice || 18999,
    originalPrice: matchedDest ? Math.round(matchedDest.startingPrice * 1.2) : 22999,
    badge: '✨ Special Departure',
    image: matchedDest?.heroImage || guide.heroImage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1920&q=85',
    bgMixImages: matchedDest?.bgMixImages || [guide.heroImage, ...(guide.attractions || []).map(a => a.image).filter(Boolean).slice(0, 3)],
    bgMixStyle: 'collage-blend',
    mainPlaces: matchedDest?.nearbyAttractions?.map(a => a.name).join(', ') || (guide.attractions || []).map(a => a.name).slice(0, 4).join(', ') || locName,
    included: (matchedDest?.highlights || [`Private AC Luxury Vehicle from Thrissur Swaraj Round`, `4-Star Accommodation with Daily Breakfast & Dinner`, `All Entry Fees & Guided Sightseeing Permits in ${locName}`, `Experienced Malayalam/English speaking OASIS Tour Escort`]).join('\n'),
    sightseeing: (guide.attractions || []).map(a => ({
      name: a.name,
      image: a.image || '',
      images: a.image ? [a.image] : [],
      text: a.shortDescription || `Visit ${a.name} in ${locName}.`,
      video: '',
      location: locName
    })),
    highlights: (guide.attractions || []).slice(0, 4).map(a => ({
      title: a.name,
      image: a.image || '',
      images: a.image ? [a.image] : [],
      location: locName
    })),
    routePoints: [
      { name: 'Thrissur Swaraj Round Main Office', type: 'start', address: 'Thrissur, Kerala', time: '06:00 AM', lat: 10.5276, lng: 76.2144 },
      { name: `${locName} Center / Resort`, type: 'stop', address: `${locName}`, time: '01:00 PM', lat: 10.5000, lng: 76.5000 },
      { name: 'Return to Thrissur Swaraj Round', type: 'drop', address: 'Thrissur, Kerala', time: '08:00 PM', lat: 10.5276, lng: 76.2144 }
    ]
  };
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

export const addDaysToDate = (dateStr, daysToAdd) => {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '';
    d.setDate(d.getDate() + parseInt(daysToAdd || 0, 10));
    return d.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

export const calculateDaysBetween = (startStr, endStr) => {
  if (!startStr || !endStr) return 0;
  try {
    const d1 = new Date(startStr);
    const d2 = new Date(endStr);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return 0;
    const diffTime = d2.getTime() - d1.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays > 0 ? diffDays : 1;
  } catch {
    return 0;
  }
};

export const getLocationSlogans = (locKeyword) => {
  const locLower = (locKeyword || '').toLowerCase();
  if (!locLower) return [];
  if (locLower.includes('nepal') || locLower.includes('kathmandu') || locLower.includes('pokhara') || locLower.includes('muktinath') || locLower.includes('lumbini')) {
    return [
      '7 Nights Spiritual & Scenic Journey • Kerala – Gorakhpur 3rd AC Train Included • Malayali Tour Manager',
      'Himalayan Bliss • Pokhara Phewa Lake Boating & High Altitude Muktinath (3,710 M) Holy Darshan',
      'Lumbini Buddha Birthplace, VIP Pashupatinath Darshan & Sarangkot Himalayan Sunrise'
    ];
  }
  if (locLower.includes('kashmir') || locLower.includes('srinagar') || locLower.includes('gulmarg')) {
    return [
      'Paradise on Earth • Dal Lake Luxury Shikara Stay & Gulmarg Snow Gondola Ride',
      'Pahalgam Betaab Valley & Sonamarg Golden Meadow Expedition with AC Transport',
      'Thrissur Direct Flight Escorted Tour • Deluxe Houseboat & Apharwat Gondola'
    ];
  }
  if (locLower.includes('munnar')) {
    return [
      'Thrissur Departure Special • Kolukkumalai Sunrise & Rajamalai Nilgiri Tahr Safari',
      'Misty Tea Plantations, Mattupetty Lake Boating & Treehouse Luxury Resort Retreat',
      'Emerald Munnar & Lock Heart Gap Spice Plantation Escape'
    ];
  }
  if (locLower.includes('ooty') || locLower.includes('nilgiri')) {
    return [
      'Queen of Nilgiris • Reserved UNESCO Steam Toy Train & Ooty Lake Boating',
      'Emerald Tea Estates, Doddabetta Peak Panoramic View & Botanical Glasshouse',
      'Ooty & Mudumalai Wildlife Safari with Coonoor Heritage Express'
    ];
  }
  if (locLower.includes('wayanad')) {
    return [
      'High Altitude Rainforest Retreat • Chembra Heart Lake Trek & Banasura Boating',
      'Misty Wayanad Highlands & Muthanga Wildlife Tiger Safari',
      'Lakkidi Sea of Clouds, Bamboo Rafting & 4-Star Plantation Villa Stay'
    ];
  }
  if (locLower.includes('kodaikanal') || locLower.includes('kodai')) {
    return [
      'Princess of Hill Stations • Star Lake Pedal Boating & Pine Forest Walk',
      'Kodaikanal Mist & Mannavanur Switzerland Sheep Farm Retreat',
      'Kodai Romantic Valley • Pillar Rocks & Silver Cascade Waterfalls'
    ];
  }
  if (locLower.includes('kashi') || locLower.includes('varanasi') || locLower.includes('ayodhya') || locLower.includes('prayagraj')) {
    return [
      'Sacred North Yatra • Kashi Vishwanath VIP Darshan, Ayodhya Ram Mandir & Prayagraj Sangam',
      'Ganga Twilight Maha Aarti, Sunrise Ganges Boat Ride & Banarasi Heritage Tour',
      'Thrissur Departure VIP Pilgrimage • Ganga Aarti & Triveni Sangam Holy Dip'
    ];
  }
  if (locLower.includes('athirappilly')) {
    return [
      'Niagara of India • Chalakudy Riverfront & Roaring 80-ft Falls Escorted Tour',
      'Athirappilly Rainforest Luxury Resort Stay & Sholayar Jungle Safari'
    ];
  }
  if (locLower.includes('parambikulam')) {
    return [
      'Parambikulam Tiger Reserve Rainforest & Bamboo Rafting Safari',
      'Thrissur Direct AC Coach • 450-yr-old Kannimara Giant Teak & Jungle Safari'
    ];
  }
  if (locLower.includes('puri') || locLower.includes('odisha')) {
    return [
      'Odisha Golden Triangle • Shree Jagannath 56 Bhog Mahaprasad & Konark Sun Temple',
      'Blue Flag Golden Beach & Chilika Lake Dolphin Cruise Escorted Tour'
    ];
  }
  return [
    `Thrissur Direct Escorted Tour • Premium Handcrafted Sightseeing Journey`,
    `Deluxe Resort Stay with Private AC Transport & Malayali Tour Escort`,
    `Scenic Landscapes, Guided Heritage Sightseeing & Daily Buffet Meals`
  ];
};

export function TourForm({ initial, onSave, onCancel, onDirtyChange, onDelete }) {
  const allDestinations = catalogService.getDestinations() || DESTINATIONS;
  const isEditing = Boolean(initial && (initial.id || initial.title));
  const defaultDest = allDestinations.find(d => d.id === initial?.destinationId) || allDestinations[0] || {};
  const defaultLoc = resolveLocationKeyword(initial?.title, initial?.subtitle, initial?.destinationId, defaultDest.name);

  // Parse Days and Nights separately
  const initialDuration = parseDuration(initial?.duration || (isEditing ? defaultDest.duration : '3 Days / 2 Nights'));
  const [durationDays, setDurationDays] = useState(initialDuration.days);
  const [durationNights, setDurationNights] = useState(initialDuration.nights);

  const initialStartDate = initial?.departureDate || new Date().toISOString().split('T')[0];
  const initialEndDate = initial?.returnDate || (initialDuration.days ? addDaysToDate(initialStartDate, initialDuration.days - 1) : '');

  const [form, setForm] = useState({
    title: initial?.title || '',
    subtitle: initial?.subtitle || '',
    destinationId: initial?.destinationId || defaultDest.id || (allDestinations[0]?.id || ''),
    duration: initial?.duration || formatDurationString(initialDuration.days, initialDuration.nights),
    departureDate: initialStartDate,
    returnDate: initialEndDate,
    price: initial?.price !== undefined ? initial.price : '',
    originalPrice: 0,
    badge: initial?.badge || '✨ New Launch',
    image: initial?.image || (isEditing ? defaultDest.heroImage : '') || './ooty-toy-train-real.jpg',
    bgMixImages: initial?.bgMixImages || (defaultDest.bgMixImages ? [...defaultDest.bgMixImages] : []),
    bgMixStyle: initial?.bgMixStyle || 'collage-blend',
    mainPlaces: isEditing ? formatAsString(initial?.mainPlaces, ', ', defaultDest.nearbyAttractions?.map(a => a.name) || []) : (initial?.mainPlaces ? formatAsString(initial.mainPlaces) : ''),
    included: isEditing ? formatAsString(initial?.included, '\n', defaultDest.highlights || []) : (initial?.included ? formatAsString(initial.included, '\n') : ''),
    sightseeing: (initial?.sightseeing && initial.sightseeing.length > 0)
      ? initial.sightseeing
      : (initial?.placeImages && initial.placeImages.length > 0)
        ? initial.placeImages.map(p => ({
            name: p.name || p.title || 'Sightseeing',
            title: p.title || p.name || 'Attraction',
            image: p.url || p.image || '',
            text: p.description || p.text || '',
            description: p.description || p.text || ''
          }))
        : [],
    highlights: initial?.highlights || [],
    routePoints: initial?.routePoints ? resolveRoutePoints(initial) : []
  });

  const [aiLocationInput, setAiLocationInput] = useState(defaultLoc);
  const [aiStatusMessage, setAiStatusMessage] = useState('');
  const [coverSearchName, setCoverSearchName] = useState(defaultLoc || '');
  const [customAiCoverImages, setCustomAiCoverImages] = useState([]);
  const [liveOnlineImages, setLiveOnlineImages] = useState([]);
  const [searchingOriginalOnline, setSearchingOriginalOnline] = useState(false);
  const [coverFilterType, setCoverFilterType] = useState('all');
  const coverScrollRef = useRef(null);
  const coverFileInputRef = useRef(null);

  // Instant Smart Auto-Fill handler derived directly from package name (e.g. Nepal, Kashmir, Munnar, etc.)
  const handleApplySmartAutofill = (destName) => {
    const targetKey = (destName || form.title || form.subtitle || 'Nepal').trim();
    const bp = getDestinationAutofillBlueprint(targetKey, allDestinations);
    if (bp) {
      const newDays = bp.durationDays || 3;
      const newNights = bp.durationNights || (newDays > 1 ? newDays - 1 : 0);
      setDurationDays(newDays);
      setDurationNights(newNights);
      
      const matchedDestId = bp.destinationId || allDestinations.find(d => d.id.includes(bp.keyword.toLowerCase()))?.id || form.destinationId;

      setForm(prev => ({
        ...prev,
        title: bp.title,
        subtitle: bp.subtitle,
        destinationId: matchedDestId || prev.destinationId,
        duration: formatDurationString(newDays, newNights),
        price: bp.price !== undefined ? bp.price : prev.price,
        originalPrice: bp.originalPrice !== undefined ? bp.originalPrice : prev.originalPrice,
        badge: bp.badge || prev.badge,
        image: bp.image || prev.image,
        bgMixImages: bp.bgMixImages?.length ? bp.bgMixImages : prev.bgMixImages,
        bgMixStyle: bp.bgMixStyle || prev.bgMixStyle || 'collage-blend',
        mainPlaces: bp.mainPlaces || prev.mainPlaces,
        included: bp.included || prev.included,
        sightseeing: Array.isArray(bp.sightseeing) && bp.sightseeing.length ? bp.sightseeing : prev.sightseeing,
        highlights: Array.isArray(bp.highlights) && bp.highlights.length ? bp.highlights : prev.highlights,
        routePoints: Array.isArray(bp.routePoints) && bp.routePoints.length ? bp.routePoints : prev.routePoints
      }));

      setAiLocationInput(bp.keyword || targetKey);
      setCoverSearchName(bp.keyword || targetKey);
      setAiStatusMessage(`✨ Auto-Filled all details for "${bp.displayName || bp.keyword}"! Title, pricing, 8+ sightseeing spots, photos & GPS route points applied.`);
      setTimeout(() => setAiStatusMessage(''), 5000);
      if (onDirtyChange) onDirtyChange(true);
    } else {
      setAiStatusMessage(`💡 Suggestions updated for "${targetKey}".`);
      setTimeout(() => setAiStatusMessage(''), 3000);
    }
  };

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

  // Handle Days change & sync End Date
  const handleDaysChange = (newDays) => {
    const d = Math.max(1, parseInt(newDays, 10) || 1);
    setDurationDays(d);
    const computed = formatDurationString(d, durationNights);
    setForm(prev => ({
      ...prev,
      duration: computed,
      returnDate: prev.departureDate ? addDaysToDate(prev.departureDate, d - 1) : prev.returnDate
    }));
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
    setForm(prev => ({
      ...prev,
      duration: computed,
      returnDate: prev.departureDate ? addDaysToDate(prev.departureDate, days - 1) : prev.returnDate
    }));
  };

  // Handle Start Date change
  const handleStartDateChange = (newStartDate) => {
    setForm(prev => {
      const updated = { ...prev, departureDate: newStartDate };
      if (newStartDate && durationDays) {
        updated.returnDate = addDaysToDate(newStartDate, durationDays - 1);
      }
      return updated;
    });
  };

  // Handle End Date change
  const handleEndDateChange = (newEndDate) => {
    setForm(prev => {
      const updated = { ...prev, returnDate: newEndDate };
      if (prev.departureDate && newEndDate) {
        const diff = calculateDaysBetween(prev.departureDate, newEndDate);
        if (diff >= 1) {
          const newNights = diff > 1 ? diff - 1 : 0;
          setDurationDays(diff);
          setDurationNights(newNights);
          updated.duration = formatDurationString(diff, newNights);
        }
      }
      return updated;
    });
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
    if (locLower.includes('nepal') || locLower.includes('kathmandu') || locLower.includes('pokhara') || locLower.includes('everest') || locLower.includes('pashupatinath') || locLower.includes('sarangkot')) {
      presets = [
        { title: 'Himalayan Marvels: Nepal Kathmandu Valley, Pokhara Lakes & Annapurna Sunrise Yatra', slogan: 'Thrissur / Cochin Departure Special • Sacred Pashupatinath Darshan, Phewa Lake Boating & Sarangkot Himalayan Sunrise' },
        { title: 'Nepal Heritage & Sacred Yatra: Pashupatinath, Guhyeshwari & Boudhanath Stupa', slogan: 'VIP Temple Darshan, Bagmati Evening Maha Aarti & 4-Star Hotel Escorted Package' },
        { title: 'Nepal Himalayan Panorama & Chitwan Wildlife Tiger Safari', slogan: 'Annapurna Sarangkot Dawn, Pokhara Phewa Boating & Chitwan Rhino Jeep Safari' },
        { title: 'Kathmandu, Pokhara & Nagarkot Mount Everest Sunrise Trail', slogan: 'UNESCO World Heritage Valley, Himalayan Reflection Lakes & Private AC Transport' }
      ];
    } else if (locLower.includes('ooty') || locLower.includes('nilgiri')) {
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

  const [generatingSpotAiIdx, setGeneratingSpotAiIdx] = useState(null);
  const [uploadingSpotIdx, setUploadingSpotIdx] = useState(null);
  const [generatingCoverAi, setGeneratingCoverAi] = useState(false);
  const [uploadingCoverFile, setUploadingCoverFile] = useState(false);

  const handleSearchOriginalPhotos = async (term) => {
    const q = (term || coverSearchName || form.title || activeStudioLocation || 'Nepal').trim();
    if (!q) return;
    setSearchingOriginalOnline(true);
    try {
      const photos = await searchOriginalOnlinePhotos(q);
      if (photos && photos.length > 0) {
        setLiveOnlineImages(prev => {
          const existingUrls = new Set(prev.map(p => p.url));
          const fresh = photos.filter(p => !existingUrls.has(p.url));
          return [...fresh, ...prev];
        });
        setAiStatusMessage(`📸 Found ${photos.length} original authentic photos for "${q}"!`);
        setTimeout(() => setAiStatusMessage(''), 4000);
      } else {
        setAiStatusMessage(`ℹ️ No live photos found for "${q}". Showing curated library photos.`);
        setTimeout(() => setAiStatusMessage(''), 4000);
      }
    } catch (err) {
      console.warn('Original photo search error:', err);
    } finally {
      setSearchingOriginalOnline(false);
    }
  };

  const handleGenerateCustomCoverAi = async (customPrompt) => {
    const query = (customPrompt || coverSearchName || form.title || form.subtitle || 'Scenic Luxury Tour Destination').trim();
    setGeneratingCoverAi(true);
    try {
      const prompt = `Photorealistic majestic travel photography of ${query}. Ultra high resolution, golden hour lighting, cinematic luxury travel agency cover photograph with vivid natural colors and authentic landmark details.`;
      const cloudUrl = await geminiService.generatePosterImage(prompt, 'photorealistic');
      if (cloudUrl) {
        setForm(f => ({ ...f, image: cloudUrl }));
        const newEntry = {
          id: `ai-cover-${Date.now()}`,
          name: query.replace(/\b\w/g, c => c.toUpperCase()),
          title: `${query} AI Generated Visual`,
          url: cloudUrl,
          category: 'AI Generated',
          type: 'ai'
        };
        setCustomAiCoverImages(prev => [newEntry, ...prev]);
        setAiStatusMessage(`✨ Generated new AI Cover Photo for "${query}"!`);
        setTimeout(() => setAiStatusMessage(''), 4000);
      }
    } catch (err) {
      alert(`AI Image Generation notice: ${err.message || 'Could not generate image'}`);
    } finally {
      setGeneratingCoverAi(false);
    }
  };

  const handleGenerateCoverAiPhoto = () => handleGenerateCustomCoverAi(coverSearchName || form.title || form.subtitle);

  const handleUploadCoverPhotoFile = async (file) => {
    if (!file) return;
    if (!file.type || !file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP, etc.)');
      return;
    }
    setUploadingCoverFile(true);
    try {
      // 1. Instant local read so preview updates immediately within 30ms
      const reader = new FileReader();
      reader.onload = (e) => {
        const localUrl = e.target.result;
        if (localUrl) {
          setForm(f => ({ ...f, image: localUrl }));
          setCustomAiCoverImages(prev => [{
            id: `uploaded-${Date.now()}`,
            name: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '),
            title: file.name,
            url: localUrl,
            category: 'Uploaded Photo',
            type: 'original',
            source: 'Device Upload'
          }, ...prev]);
        }
      };
      reader.readAsDataURL(file);

      // 2. Upload to storage in background
      const res = await storageService.uploadFile(file, 'tours-covers');
      if (res && res.url) {
        setForm(f => ({ ...f, image: res.url }));
        setAiStatusMessage(`✓ Cover photo "${file.name}" uploaded successfully!`);
        setTimeout(() => setAiStatusMessage(''), 4000);
      }
    } catch (err) {
      console.warn('Cover photo upload notice:', err);
    } finally {
      setUploadingCoverFile(false);
    }
  };

  const [generatingMixAi, setGeneratingMixAi] = useState(false);
  const [uploadingMixFile, setUploadingMixFile] = useState(false);
  const [mixAiPrompt, setMixAiPrompt] = useState('');

  const handleAddImageToMix = (url) => {
    if (!url) return;
    setForm(prev => {
      const current = prev.bgMixImages || (prev.image ? [prev.image] : []);
      if (current.includes(url)) return prev;
      return { ...prev, bgMixImages: [...current, url] };
    });
  };

  const handleRemoveImageFromMix = (idx) => {
    setForm(prev => {
      const current = prev.bgMixImages || [];
      return { ...prev, bgMixImages: current.filter((_, i) => i !== idx) };
    });
  };

  const handleSyncSightseeingToMix = () => {
    const spotImages = (form.sightseeing || []).map(s => s.image || s.url).filter(Boolean);
    if (spotImages.length === 0) {
      alert('No sightseeing spot photos found to sync yet. Add some sightseeing spots below first!');
      return;
    }
    setForm(prev => {
      const existing = prev.bgMixImages || (prev.image ? [prev.image] : []);
      const set = new Set([...existing, ...spotImages]);
      return { ...prev, bgMixImages: Array.from(set) };
    });
  };

  const handleGenerateMixAiPhoto = async (customText) => {
    const query = customText || mixAiPrompt || form.title || 'Scenic Travel Destination';
    setGeneratingMixAi(true);
    try {
      const prompt = `Photorealistic majestic travel photography of ${query}. Breathtaking scenic landscape, 8k resolution, cinematic golden hour lighting.`;
      const cloudUrl = await geminiService.generatePosterImage(prompt, 'photorealistic');
      if (cloudUrl) {
        handleAddImageToMix(cloudUrl);
        setMixAiPrompt('');
      }
    } catch (err) {
      alert(`AI Image Generation notice: ${err.message || 'Could not generate image'}`);
    } finally {
      setGeneratingMixAi(false);
    }
  };

  const handleUploadMixPhotoFile = async (file) => {
    if (!file) return;
    setUploadingMixFile(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target.result) handleAddImageToMix(e.target.result);
      };
      reader.readAsDataURL(file);

      const res = await storageService.uploadFile(file, 'bg-mix');
      if (res && res.url) {
        handleAddImageToMix(res.url);
      }
    } catch (err) {
      console.warn('Mix upload notice:', err);
    } finally {
      setUploadingMixFile(false);
    }
  };

  const handleGenerateSpotAiPhoto = async (idx) => {
    const s = (form.sightseeing || [])[idx];
    if (!s) return;
    const spotName = s.name || s.title || form.title || 'Scenic Destination';
    setGeneratingSpotAiIdx(idx);
    try {
      const prompt = `Photorealistic majestic travel photography of ${spotName} in ${form.title || 'Nepal/India'}. Breathtaking scenic landscape, clear vibrant details, golden hour lighting.`;
      const cloudUrl = await geminiService.generatePosterImage(prompt, 'photorealistic');
      if (cloudUrl) {
        updateListItem('sightseeing', idx, { image: cloudUrl });
      }
    } catch (err) {
      alert(`AI Image Generation notice: ${err.message || 'Could not generate image. Please check API key or upload an image.'}`);
    } finally {
      setGeneratingSpotAiIdx(null);
    }
  };

  const handleUploadSpotPhotoFile = async (idx, file) => {
    if (!file) return;
    setUploadingSpotIdx(idx);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target.result) updateListItem('sightseeing', idx, { image: e.target.result });
      };
      reader.readAsDataURL(file);

      const res = await storageService.uploadFile(file, 'sightseeing');
      if (res && res.url) {
        updateListItem('sightseeing', idx, { image: res.url });
      }
    } catch (err) {
      console.warn('Spot upload notice:', err);
    } finally {
      setUploadingSpotIdx(null);
    }
  };

  const removeListItem = (key, index) =>
    setForm(prev => ({ ...prev, [key]: (prev[key] || []).filter((_, i) => i !== index) }));

  const handleMoveSpot = (idx, direction) => {
    setForm(prev => {
      const list = [...(prev.sightseeing || [])];
      const targetIdx = idx + direction;
      if (targetIdx < 0 || targetIdx >= list.length) return prev;
      const temp = list[idx];
      list[idx] = list[targetIdx];
      list[targetIdx] = temp;
      return { ...prev, sightseeing: list };
    });
  };

  const handleDuplicateSpot = (idx) => {
    setForm(prev => {
      const list = [...(prev.sightseeing || [])];
      const item = list[idx];
      if (!item) return prev;
      const copy = { ...item, name: `${item.name || 'Sightseeing'} (Copy)` };
      list.splice(idx + 1, 0, copy);
      return { ...prev, sightseeing: list };
    });
  };

  const handleBatchAdd5Spots = (circuit) => {
    let presetSpots = [];
    if (circuit === 'nepal') {
      presetSpots = [
        PLACE_PHOTO_LIBRARY.kathmandu,
        PLACE_PHOTO_LIBRARY.pashupatinath,
        PLACE_PHOTO_LIBRARY.pokhara,
        PLACE_PHOTO_LIBRARY.sarangkot,
        PLACE_PHOTO_LIBRARY.muktinath
      ];
    } else if (circuit === 'kerala') {
      presetSpots = [
        PLACE_PHOTO_LIBRARY.munnar,
        PLACE_PHOTO_LIBRARY.athirappilly,
        PLACE_PHOTO_LIBRARY.wayanad,
        PLACE_PHOTO_LIBRARY.alleppey,
        PLACE_PHOTO_LIBRARY.kovalam
      ];
    } else if (circuit === 'pilgrimage') {
      presetSpots = [
        PLACE_PHOTO_LIBRARY.varanasi,
        PLACE_PHOTO_LIBRARY.ayodhya,
        PLACE_PHOTO_LIBRARY.kathmandu,
        PLACE_PHOTO_LIBRARY.muktinath,
        PLACE_PHOTO_LIBRARY.lumbini
      ];
    } else if (circuit === 'kashmir') {
      presetSpots = [
        PLACE_PHOTO_LIBRARY.kashmir,
        PLACE_PHOTO_LIBRARY.ooty,
        PLACE_PHOTO_LIBRARY.munnar,
        PLACE_PHOTO_LIBRARY.athirappilly,
        PLACE_PHOTO_LIBRARY.wayanad
      ];
    }

    const newItems = (presetSpots || []).filter(Boolean).map(p => ({
      name: p.name,
      title: p.title,
      image: p.url,
      url: p.url,
      text: p.description,
      description: p.description,
      timing: 'Morning to Afternoon',
      ticketInfo: 'Entry & Passes Handled by OASIS',
      category: 'Sightseeing'
    }));

    setForm(prev => ({
      ...prev,
      sightseeing: [...(prev.sightseeing || []), ...newItems]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { pickupPoints: _pickupPoints, dropPoints: _dropPoints, ...rest } = form;
    
    // Clean and sync sightseeing and placeImages
    const cleanSightseeing = (form.sightseeing || []).map(s => ({
      name: s.name || s.title || 'Sightseeing',
      title: s.title || s.name || 'Attraction',
      image: s.image || s.url || form.image,
      url: s.image || s.url || form.image,
      text: s.text || s.description || '',
      description: s.text || s.description || '',
      category: s.category || 'Sightseeing',
      timing: s.timing || '',
      ticketInfo: s.ticketInfo || '',
      video: s.video || '',
      travelMode: s.travelMode || '',
      travelerTip: s.travelerTip || '',
      location: s.location || ''
    }));

    onSave({
      ...rest,
      duration: form.duration || formatDurationString(durationDays, durationNights),
      routePoints: enforceRouteOrder(form.routePoints),
      price: parseFloat(form.price) || 0,
      originalPrice: 0,
      discountPercent: 0,
      mainPlaces: typeof form.mainPlaces === 'string' ? form.mainPlaces.split(',').map(s => s.trim()).filter(Boolean) : (form.mainPlaces || []),
      included: toList(form.included),
      sightseeing: cleanSightseeing,
      placeImages: cleanSightseeing,
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
      <div className="admin-wizard-tabs" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.2rem' }}>
        {TOUR_FORM_STEPS.map((step, idx) => {
          const isActive = activeStep === idx;
          const isDone = idx < activeStep || stepCompleteFlags[idx];
          const IconMap = [<Sparkles key="b" size={16} />, <ImageIcon key="p" size={16} />, <Navigation size={16} key="r" />];
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => setActiveStep(idx)}
              className="admin-wizard-tab-btn"
              style={{
                flex: '1 1 110px',
                minWidth: 'clamp(100px, 25vw, 160px)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.55rem 0.75rem',
                borderRadius: '12px',
                cursor: 'pointer',
                background: isActive
                  ? 'rgba(212,175,55,0.15)'
                  : isDone
                    ? 'rgba(16,185,129,0.1)'
                    : 'rgba(255,255,255,0.04)',
                border: isActive
                  ? '1px solid var(--gold-primary)'
                  : isDone
                    ? '1px solid rgba(16,185,129,0.4)'
                    : '1px solid rgba(255,255,255,0.12)',
                color: isActive ? '#fef08a' : isDone ? '#10b981' : 'var(--text-muted)',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
            >
              <span style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isActive || isDone ? 'var(--gold-primary)' : 'rgba(255,255,255,0.08)',
                color: isActive || isDone ? '#000' : 'var(--text-muted)',
                fontSize: '0.82rem', fontWeight: 800
              }}>
                {isDone ? <Check size={14} /> : IconMap[idx]}
              </span>
              <span style={{ textAlign: 'left', lineHeight: 1.15, overflow: 'hidden' }}>
                <span style={{ display: 'block', fontWeight: 800, fontSize: 'clamp(0.72rem, 1.8vw, 0.78rem)', whiteSpace: 'nowrap' }}>
                  Step {idx + 1} · {step.label}
                </span>
                <span style={{ display: 'block', fontSize: '0.64rem', opacity: 0.75, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {isDone ? '✓ Complete' : step.hint}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* ══════════════ STEP 1 · PACKAGE BASICS ══════════════ */}
      {activeStep === 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
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

          {/* TOUR TITLE WITH DIRECT AI AUTO-FILL & SLOGAN SUGGESTIONS */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0, fontSize: '0.85rem', color: 'var(--gold-light)', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                Tour Title (Package Name) *
              </label>

              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* 1. Instant Auto-Fill from typed Package Name */}
                <button
                  type="button"
                  onClick={() => handleApplySmartAutofill(form.title)}
                  style={{
                    background: 'rgba(212,175,55,0.15)',
                    color: '#fef08a',
                    border: '1px solid var(--gold-primary)',
                    borderRadius: '6px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                  title="Auto-fill details based on this package name"
                >
                  <Sparkles size={13} color="var(--gold-primary)" /> Auto-Fill Details
                </button>

                {/* 2. Slogans & Titles suggestions toggle */}
                <button
                  type="button"
                  onClick={() => generateTitleSuggestions(form.title || aiLocationInput)}
                  style={{
                    background: showTitleSuggester ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                    border: showTitleSuggester ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.15)',
                    color: showTitleSuggester ? '#000' : 'var(--text-muted)',
                    borderRadius: '6px',
                    padding: '0.3rem 0.65rem',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <Wand2 size={13} color={showTitleSuggester ? '#000' : 'var(--text-muted)'} /> 
                  {showTitleSuggester ? 'Close Suggestions' : 'AI Slogans'}
                </button>
              </div>
            </div>

            <div style={{ position: 'relative' }}>
              <input 
                style={{
                  ...fieldStyle,
                  padding: '0.75rem 1rem',
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  background: 'rgba(2,6,23,0.85)',
                  border: '1.5px solid rgba(212,175,55,0.45)',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)'
                }} 
                value={form.title} 
                onChange={set('title')} 
                required 
                placeholder="Type package name e.g. Nepal Kathmandu & Pokhara, Kashmir Dal Lake & Gulmarg, Munnar Tea Highlands..." 
              />
            </div>

            {/* Quick 1-Click Destination Preset Pills */}
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.45rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#fef08a', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                ⚡ Quick Presets:
              </span>
              {[
                { label: 'Nepal', key: 'Nepal' },
                { label: 'Kashmir', key: 'Kashmir' },
                { label: 'Munnar', key: 'Munnar' },
                { label: 'Ooty', key: 'Ooty' },
                { label: 'Wayanad', key: 'Wayanad' },
                { label: 'Kashi', key: 'Kashi' },
                { label: 'Kodaikanal', key: 'Kodaikanal' },
                { label: 'Athirappilly', key: 'Athirappilly' },
                { label: 'Parambikulam', key: 'Parambikulam' },
                { label: 'Kollam', key: 'Kollam' },
                { label: 'Ayodhya', key: 'Ayodhya' },
                { label: 'Goa', key: 'Goa' },
                { label: 'Taj Mahal', key: 'Taj Mahal' }
              ].map(preset => {
                const isActive = form.title?.toLowerCase().includes(preset.key.toLowerCase());
                return (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => {
                      setForm(f => ({ ...f, title: `${preset.key} Escorted Tour Package` }));
                      handleApplySmartAutofill(preset.key);
                    }}
                    style={{
                      background: isActive ? 'rgba(212,175,55,0.3)' : 'rgba(255,255,255,0.06)',
                      border: isActive ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.12)',
                      color: isActive ? '#fef08a' : '#e2e8f0',
                      borderRadius: '14px',
                      padding: '0.15rem 0.55rem',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Quick Slogan Suggestions Bar based on Current Typed Location */}
            {(() => {
              const currentLoc = resolveLocationKeyword(form.title, form.subtitle, form.destinationId, aiLocationInput);
              const slogans = getLocationSlogans(currentLoc);
              if (slogans.length === 0) return null;
              return (
                <div style={{ marginTop: '0.5rem', padding: '0.5rem 0.75rem', background: 'rgba(212,175,55,0.06)', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--gold-light)', fontWeight: 800, marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Sparkles size={12} color="var(--gold-primary)" /> ⚡ Slogans for "{currentLoc}": (Click any to set as subtitle/slogan)
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {slogans.map((slog, sIdx) => {
                      const isApplied = form.subtitle === slog;
                      return (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleApplySloganOnly(slog)}
                          style={{
                            background: isApplied ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                            border: isApplied ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
                            color: isApplied ? '#6ee7b7' : '#fef08a',
                            borderRadius: '12px',
                            padding: '0.2rem 0.55rem',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem'
                          }}
                        >
                          {isApplied ? '✓' : '📢'} "{slog}"
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}



            {/* AI Slogan & Title Suggester Modal / Dropdown */}
            {showTitleSuggester && (
              <div style={{ background: '#040812', border: '1px solid var(--gold-primary)', borderRadius: '12px', padding: '1rem', marginTop: '0.6rem', boxShadow: '0 8px 24px rgba(0,0,0,0.7)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', borderBottom: '1px solid rgba(245,158,11,0.2)', paddingBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Sparkles size={16} color="var(--gold-primary)" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                      AI Slogans &amp; Title Suggestions for <strong style={{ color: '#fef08a' }}>{resolveLocationKeyword(form.title, form.subtitle, form.destinationId, aiLocationInput)}</strong>
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
                      placeholder={`e.g. Luxury tour in ${resolveLocationKeyword(form.title, form.subtitle, form.destinationId, aiLocationInput)}...`}
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
                  Curated Titles &amp; Slogans for {resolveLocationKeyword(form.title, form.subtitle, form.destinationId, aiLocationInput)}:
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

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem', marginBottom: '0.8rem' }}>
              <div>
                <label style={labelStyle}>Number of Days</label>
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
                <label style={labelStyle}>Number of Nights</label>
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
            <label style={labelStyle}>Tour Price (₹) *</label>
            <input style={fieldStyle} type="number" min="0" value={form.price} onChange={set('price')} placeholder="e.g. 29000" required />
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

          {/* ─── START DATE & END DATE ─── */}
          <div style={{ gridColumn: '1 / -1', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ ...labelStyle, marginBottom: 0, color: 'var(--gold-light)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Calendar size={16} color="var(--gold-primary)" /> Tour Dates (Start Date &amp; End Date)
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                {form.departureDate && (() => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const tourDate = new Date(`${form.departureDate}T00:00:00`);
                  const isActive = !isNaN(tourDate.getTime()) && tourDate >= today;
                  return isActive ? (
                    <span style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', color: '#6ee7b7', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 800 }}>
                      🟢 Active (Upcoming)
                    </span>
                  ) : (
                    <span style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.2rem 0.6rem', borderRadius: '8px', fontSize: '0.74rem', fontWeight: 800 }}>
                      🔴 Inactive (Start Date Passed)
                    </span>
                  );
                })()}

                {(form.departureDate && form.returnDate) && (
                  <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#6ee7b7', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 800 }}>
                    📅 {form.departureDate} ➔ {form.returnDate} ({durationDays} Days)
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Start Date (Departure Date) *</label>
                <input
                  type="date"
                  style={fieldStyle}
                  value={form.departureDate || ''}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={labelStyle}>End Date (Return Date) *</label>
                <input
                  type="date"
                  style={fieldStyle}
                  value={form.returnDate || ''}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  required
                />
              </div>
            </div>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              💡 Changing dates automatically syncs the total tour days, or setting duration days auto-calculates the return date.
            </p>
          </div>
        </div>
      )}

      {/* ══════════════ STEP 2 · TOURIST PLACES, IMAGES & INCLUSIONS ══════════════ */}
      {activeStep === 1 && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          
          {/* 1. Main Cover Photo */}
          <div className="glass-card" style={{ padding: '1.2rem', background: 'rgba(9,20,38,0.6)', border: '1px solid var(--border-gold)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ImageIcon size={18} color="var(--gold-primary)" />
                <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--gold-light)', margin: 0 }}>
                  1. Main Tour Cover Photo
                </h4>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shown on website cards and header banner</span>
            </div>

            {/* Current Selected Cover & Direct URL / File Upload Row */}
            <div className="admin-grid-cover-photo" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.2rem', alignItems: 'center', marginBottom: '1rem' }}>
              {/* Clickable & Drag-and-Drop Preview Area */}
              <div
                onClick={() => coverFileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer?.files?.[0];
                  if (file) handleUploadCoverPhotoFile(file);
                }}
                title="Click or drag an image here to upload from your computer"
                style={{
                  width: '100%',
                  maxWidth: '250px',
                  height: '140px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  border: '2px solid var(--gold-primary)',
                  background: '#000',
                  position: 'relative',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.6)',
                  cursor: 'pointer',
                  transition: 'transform 0.15s ease',
                  margin: '0 auto'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                <img src={form.image || './ooty-toy-train-real.jpg'} alt="Cover preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(0,0,0,0.92))', padding: '3px 4px', fontSize: '0.62rem', color: '#fef08a', fontWeight: 800, textAlign: 'center' }}>
                  📁 Click to Upload
                </div>
                {(generatingCoverAi || uploadingCoverFile) && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-light)', gap: '0.2rem' }}>
                    <Loader2 size={22} className="spinner" />
                    <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>{uploadingCoverFile ? 'Uploading...' : 'Generating...'}</span>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={labelStyle}>Selected Cover Photo URL / Direct Upload *</label>
                <div className="admin-mix-controls" style={{ width: '100%' }}>
                  <input
                    style={{ ...fieldStyle, flex: '1 1 180px', minWidth: '0' }}
                    value={form.image}
                    onChange={set('image')}
                    placeholder="Enter image URL or upload photo from your computer 👇"
                    required
                  />
                  
                  {/* Robust Hidden File Input for Cover (with Ref) */}
                  <input
                    ref={coverFileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleUploadCoverPhotoFile(file);
                      e.target.value = ''; // Reset so the exact same file can be selected again
                    }}
                  />
                  
                  {/* Direct File Upload Button */}
                  <button
                    type="button"
                    onClick={() => coverFileInputRef.current?.click()}
                    disabled={uploadingCoverFile}
                    className="btn-glass"
                    style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      cursor: uploadingCoverFile ? 'wait' : 'pointer',
                      background: 'rgba(212,175,55,0.15)',
                      border: '1px solid var(--gold-primary)',
                      color: '#fef08a',
                      borderRadius: '8px',
                      flex: '1 1 180px'
                    }}
                  >
                    {uploadingCoverFile ? (
                      <>
                        <Loader2 size={14} className="spinner" /> Uploading Photo...
                      </>
                    ) : (
                      <>
                        <Upload size={14} color="var(--gold-primary)" /> 📁 Upload Photo from PC
                      </>
                    )}
                  </button>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  💡 Supports JPG, PNG, WebP. You can also drag &amp; drop an image onto the preview box or pick from suggestions below.
                </span>
              </div>
            </div>

            {/* ─── AI & ORIGINAL IMAGE SUGGESTIONS STUDIO & HORIZONTAL CAROUSEL ─── */}
            {(() => {
              const currentLoc = coverSearchName || resolveLocationKeyword(form.title, form.subtitle, form.destinationId, 'Nepal');
              const suggestions = getCoverPhotoAiSuggestions(coverSearchName, activeStudioLocation, customAiCoverImages, liveOnlineImages, coverFilterType);
              const originalCount = getCoverPhotoAiSuggestions(coverSearchName, activeStudioLocation, customAiCoverImages, liveOnlineImages, 'original').length;
              const aiCount = getCoverPhotoAiSuggestions(coverSearchName, activeStudioLocation, customAiCoverImages, liveOnlineImages, 'ai').length;

              return (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(2,132,199,0.08), rgba(9,20,38,0.88))',
                  border: '1px solid rgba(212,175,55,0.35)',
                  borderRadius: '12px',
                  padding: '1rem',
                  marginTop: '0.6rem'
                }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.7rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Sparkles size={16} color="var(--gold-primary)" />
                      <div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                          Original Image AI &amp; Landmark Photo Search
                        </span>
                        <span style={{ marginLeft: '0.5rem', fontSize: '0.68rem', background: 'rgba(212,175,55,0.2)', color: '#fef08a', padding: '0.12rem 0.5rem', borderRadius: '10px', fontWeight: 700 }}>
                          👈 Click any card to apply as Cover 👉
                        </span>
                      </div>
                    </div>
                    
                    {/* Horizontal Scroll Arrows */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <button
                        type="button"
                        onClick={() => coverScrollRef.current?.scrollBy({ left: -260, behavior: 'smooth' })}
                        title="Scroll Left"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#fef08a',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => coverScrollRef.current?.scrollBy({ left: 260, behavior: 'smooth' })}
                        title="Scroll Right"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#fef08a',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Search Place Name Input & Live Search / AI Generate Buttons */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative', flex: '1 1 180px', minWidth: '0' }}>
                      <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gold-primary)' }} />
                      <input
                        type="text"
                        value={coverSearchName}
                        onChange={(e) => setCoverSearchName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearchOriginalPhotos(coverSearchName);
                          }
                        }}
                        placeholder="Enter landmark or destination (e.g. Pashupatinath, Taj Mahal, Pokhara, Munnar, Kashmir)..."
                        style={{
                          ...fieldStyle,
                          paddingLeft: '2.1rem',
                          paddingRight: coverSearchName ? '2rem' : '0.9rem',
                          paddingTop: '0.55rem',
                          paddingBottom: '0.55rem',
                          fontSize: '0.82rem',
                          background: 'rgba(2,6,23,0.9)',
                          border: '1.5px solid rgba(212,175,55,0.4)',
                          color: '#ffffff'
                        }}
                      />
                      {coverSearchName && (
                        <button
                          type="button"
                          onClick={() => setCoverSearchName('')}
                          style={{
                            position: 'absolute',
                            right: '8px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          ✕
                        </button>
                      )}
                    </div>

                    {/* 1. Live Original Photo Search */}
                    <button
                      type="button"
                      onClick={() => handleSearchOriginalPhotos(coverSearchName || form.title || currentLoc)}
                      disabled={searchingOriginalOnline}
                      style={{
                        background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                        color: '#ffffff',
                        border: '1px solid #38bdf8',
                        borderRadius: '10px',
                        padding: '0.5rem 0.95rem',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        cursor: searchingOriginalOnline ? 'wait' : 'pointer',
                        opacity: searchingOriginalOnline ? 0.7 : 1,
                        whiteSpace: 'nowrap',
                        boxShadow: '0 4px 14px rgba(2,132,199,0.35)'
                      }}
                    >
                      {searchingOriginalOnline ? (
                        <>
                          <Loader2 size={14} className="spinner" /> Searching Live...
                        </>
                      ) : (
                        <>
                          <Globe size={14} /> 📸 Search Original Photos (Live)
                        </>
                      )}
                    </button>

                    {/* 2. AI Generate Photo Button */}
                    <button
                      type="button"
                      onClick={() => handleGenerateCustomCoverAi(coverSearchName || form.title || currentLoc)}
                      disabled={generatingCoverAi}
                      className="btn-gold"
                      style={{
                        padding: '0.5rem 0.95rem',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        opacity: generatingCoverAi ? 0.7 : 1,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {generatingCoverAi ? (
                        <>
                          <Loader2 size={14} className="spinner" /> Generating AI...
                        </>
                      ) : (
                        <>
                          <Wand2 size={14} /> ✨ Generate with Gemini AI
                        </>
                      )}
                    </button>
                  </div>

                  {/* Filter Mode Tabs & Preset Pills Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: '#fef08a', fontWeight: 800 }}>Show:</span>
                      {[
                        { id: 'all', label: `🌐 All Photos (${suggestions.length})` },
                        { id: 'original', label: `📸 Original Real Photos (${originalCount})` },
                        { id: 'ai', label: `✨ AI Generated (${aiCount})` }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setCoverFilterType(tab.id)}
                          style={{
                            background: coverFilterType === tab.id ? 'var(--gold-primary)' : 'rgba(255,255,255,0.06)',
                            color: coverFilterType === tab.id ? '#000' : 'var(--gold-light)',
                            border: coverFilterType === tab.id ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.12)',
                            borderRadius: '8px',
                            padding: '0.2rem 0.55rem',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Quick Popular Pills */}
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      {[
                        'Nepal',
                        'Pokhara',
                        'Muktinath',
                        'Kashmir',
                        'Munnar',
                        'Ooty',
                        'Wayanad',
                        'Athirappilly',
                        'Kashi',
                        'Ayodhya',
                        'Goa',
                        'Taj Mahal'
                      ].map((tag) => {
                        const isTagActive = coverSearchName.toLowerCase() === tag.toLowerCase();
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              setCoverSearchName(tag);
                              handleSearchOriginalPhotos(tag);
                            }}
                            style={{
                              background: isTagActive ? 'var(--gold-primary)' : 'rgba(255,255,255,0.06)',
                              color: isTagActive ? '#000' : 'var(--gold-light)',
                              border: isTagActive ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.12)',
                              borderRadius: '14px',
                              padding: '0.15rem 0.5rem',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ─── HORIZONTAL SCROLLING SUGGESTION LIST ─── */}
                  <div
                    ref={coverScrollRef}
                    style={{
                      display: 'flex',
                      gap: '0.75rem',
                      overflowX: 'auto',
                      padding: '0.4rem 0.2rem 0.6rem',
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'var(--gold-primary) rgba(255,255,255,0.05)',
                      scrollBehavior: 'smooth'
                    }}
                  >
                    {suggestions.length === 0 ? (
                      <div style={{ padding: '1.2rem', textAlign: 'center', width: '100%', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        No photos match "{coverSearchName}". Click <strong>"📸 Search Original Photos Live"</strong> or <strong>"✨ Generate AI Photo"</strong> above!
                      </div>
                    ) : suggestions.map((item, imgIdx) => {
                      const isSelected = form.image === item.url;
                      const isOriginal = item.type === 'original' || item.type === 'real' || !item.type?.includes('ai');
                      return (
                        <div
                          key={item.url + imgIdx}
                          onClick={() => setForm(f => ({ ...f, image: item.url }))}
                          style={{
                            flex: '0 0 clamp(140px, 38vw, 175px)',
                            width: 'clamp(140px, 38vw, 175px)',
                            cursor: 'pointer',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            background: '#040810',
                            border: isSelected ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.12)',
                            boxShadow: isSelected ? '0 0 16px rgba(212,175,55,0.45)' : '0 2px 8px rgba(0,0,0,0.5)',
                            position: 'relative',
                            transition: 'all 0.2s ease',
                            transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                          }}
                          onMouseEnter={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = 'rgba(212,175,55,0.6)';
                              e.currentTarget.style.transform = 'translateY(-2px)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isSelected) {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }
                          }}
                        >
                          {/* Image Thumbnail */}
                          <div style={{ width: '100%', height: '105px', position: 'relative', background: '#000' }}>
                            <img
                              src={item.url}
                              alt={item.name}
                              loading="lazy"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            
                            {/* Type Badge */}
                            <span style={{
                              position: 'absolute',
                              top: '5px',
                              left: '5px',
                              fontSize: '0.58rem',
                              fontWeight: 800,
                              padding: '0.1rem 0.38rem',
                              borderRadius: '4px',
                              background: isOriginal ? 'rgba(2,132,199,0.85)' : 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                              color: '#fff',
                              border: '1px solid rgba(255,255,255,0.25)'
                            }}>
                              {isOriginal ? (item.source === 'Wikimedia Commons' ? '📸 Original (Wikimedia)' : '📸 Original Photo') : '✨ AI Visual'}
                            </span>

                            {/* Active Checkmark Badge */}
                            {isSelected && (
                              <div style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                background: 'var(--gold-primary)',
                                color: '#000',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 900,
                                boxShadow: '0 2px 6px rgba(0,0,0,0.7)'
                              }}>
                                <Check size={13} />
                              </div>
                            )}
                          </div>

                          {/* Footer Info */}
                          <div style={{ padding: '0.45rem 0.55rem', background: 'rgba(5,12,24,0.95)' }}>
                            <div style={{
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              color: isSelected ? '#fef08a' : '#fff',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }} title={item.name}>
                              {item.name}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.25rem' }}>
                              <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                                {item.category || 'Landmark'}
                              </span>
                              <span style={{
                                fontSize: '0.62rem',
                                fontWeight: 800,
                                color: isSelected ? '#10b981' : 'var(--gold-light)'
                              }}>
                                {isSelected ? '✓ Cover' : 'Set Cover'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

          </div>

          {/* 2. Background Mixing & Multi-Image Slider (Collapsible) */}
          <details className="glass-card" style={{ padding: '0.8rem 1.2rem', background: 'rgba(9,20,38,0.6)', border: '1px solid var(--border-gold)', borderRadius: '12px' }}>
            <summary style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', outline: 'none' }}>
              <Layers size={16} color="var(--gold-primary)" />
              <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--gold-light)' }}>
                Advanced: Background Mixing & Multi-Image Slider
              </span>
            </summary>
            
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                  Mix multiple tourist place photos together for homepage banner and slider with live blend effects
                </p>

              {/* Blend Style Selector */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--gold-light)', fontWeight: 700 }}>Mix Style:</span>
                {[
                  { id: 'collage-blend', label: '🎨 Collage Blend' },
                  { id: 'fade-slide', label: '🎬 Crossfade Slider' },
                  { id: 'split-grid', label: '🔲 2x2 Split Quad' },
                  { id: 'layered-soft', label: '🌟 Layered Soft' }
                ].map(st => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, bgMixStyle: st.id }))}
                    style={{
                      padding: '0.3rem 0.65rem',
                      borderRadius: '8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      flex: '0 0 auto',
                      background: (form.bgMixStyle || 'collage-blend') === st.id ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.05)',
                      border: (form.bgMixStyle || 'collage-blend') === st.id ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                      color: (form.bgMixStyle || 'collage-blend') === st.id ? '#fef08a' : 'var(--text-muted)'
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Background Mix Preview Stage */}
            <div style={{ position: 'relative', width: '100%', height: '180px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-gold)', marginBottom: '1rem', background: '#040810' }}>
              <MixedBackground
                images={(form.bgMixImages && form.bgMixImages.length > 0) ? form.bgMixImages : [form.image || './ooty-toy-train-real.jpg']}
                fallbackImage={form.image || './ooty-toy-train-real.jpg'}
                style={form.bgMixStyle || 'collage-blend'}
                height="100%"
                overlayOpacity={0.28}
              />
              <div style={{ position: 'absolute', bottom: '12px', left: '16px', zIndex: 10, pointerEvents: 'none' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'rgba(0,0,0,0.75)', color: 'var(--gold-light)', border: '1px solid var(--border-gold)' }}>
                  Live Preview: {form.bgMixStyle || 'collage-blend'} ({((form.bgMixImages || []).length || 1)} photos mixed)
                </span>
                <div style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 800, marginTop: '4px', textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
                  {form.title || 'Tour Destination Title'}
                </div>
              </div>
            </div>

            {/* Current Mixed Images Ribbon */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 700 }}>
                  Photos currently in Background Mix ({((form.bgMixImages || []).length)}):
                </span>
                {(form.sightseeing || []).length > 0 && (
                  <button
                    type="button"
                    onClick={handleSyncSightseeingToMix}
                    className="btn-glass"
                    style={{ padding: '0.25rem 0.65rem', fontSize: '0.72rem', fontWeight: 700, color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.4)' }}
                  >
                    ⚡ Sync All Sightseeing Spots to Mix
                  </button>
                )}
              </div>

              {((form.bgMixImages || []).length === 0) ? (
                <div style={{ padding: '0.8rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.15)', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Only 1 cover photo is currently used. Add AI-generated scenic images or upload photos below to create a multi-image background mix!
                </div>
              ) : (
                <div className="sightsee-mix-ribbon">
                  {(form.bgMixImages || []).map((imgUrl, mIdx) => (
                    <div key={mIdx} style={{ position: 'relative', width: 'min(90px, 22vw)', height: '65px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-gold)', background: '#000', flexShrink: 0 }}>
                      <img src={imgUrl} alt={`Mix photo ${mIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        type="button"
                        onClick={() => handleRemoveImageFromMix(mIdx)}
                        style={{
                          position: 'absolute',
                          top: '3px',
                          right: '3px',
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: 'rgba(239,68,68,0.9)',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '11px',
                          fontWeight: 800,
                          padding: 0
                        }}
                      >
                        ✕
                      </button>
                      <span style={{ position: 'absolute', bottom: '2px', left: '3px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '9px', padding: '1px 3px', borderRadius: '3px' }}>
                        #{mIdx + 1}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add to Background Mix Controls: AI Suggest + File Upload */}
            <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.2)', display: 'grid', gap: '0.6rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)', fontWeight: 700 }}>
                ➕ Add Photos to Background Mix:
              </div>

              {/* AI Image Input & Generate for Mix */}
              <div className="admin-mix-controls">
                <input
                  style={{ ...fieldStyle, flex: '1 1 180px', minWidth: '0' }}
                  value={mixAiPrompt}
                  onChange={(e) => setMixAiPrompt(e.target.value)}
                  placeholder="Type place name for AI image (e.g. Pokhara Phewa Lake, Muktinath, Munnar Tea)..."
                />

                {/* AI Generate Button */}
                <button
                  type="button"
                  onClick={() => handleGenerateMixAiPhoto(mixAiPrompt)}
                  disabled={generatingMixAi}
                  className="btn-gold"
                  style={{
                    padding: '0.45rem 0.9rem',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    opacity: generatingMixAi ? 0.7 : 1
                  }}
                >
                  {generatingMixAi ? (
                    <>
                      <Loader2 size={13} className="spinner" /> Generating AI...
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} /> ✨ AI Suggest &amp; Add to Mix
                    </>
                  )}
                </button>

                {/* Hidden File Input for Mix */}
                <input
                  type="file"
                  id="tour-mix-file-input"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadMixPhotoFile(file);
                  }}
                />

                {/* Direct Upload Button for Mix */}
                <label
                  htmlFor="tour-mix-file-input"
                  className="btn-glass"
                  style={{
                    padding: '0.45rem 0.85rem',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                    margin: 0
                  }}
                >
                  <Upload size={13} color="var(--gold-primary)" />
                  {uploadingMixFile ? 'Uploading...' : '📁 Upload Photo to Mix'}
                </label>
              </div>

              {/* Quick 1-Click Preset Place Chips to Mix */}
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '0.2rem' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Quick Presets:</span>
                {Object.entries(PLACE_PHOTO_LIBRARY).map(([key, item]) => {
                  const alreadyInMix = (form.bgMixImages || []).includes(item.url);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleAddImageToMix(item.url)}
                      style={{
                        background: alreadyInMix ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                        border: alreadyInMix ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.12)',
                        color: alreadyInMix ? '#6ee7b7' : '#fff',
                        borderRadius: '12px',
                        padding: '0.2rem 0.55rem',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        cursor: alreadyInMix ? 'default' : 'pointer'
                      }}
                    >
                      {alreadyInMix ? '✓' : '+'} {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
            </div>
          </details>

          {/* 3. Sightseeing Places (Sightseen) */}
          <div className="glass-card" style={{ padding: '1.2rem', background: 'rgba(9,20,38,0.6)', border: '1px solid var(--border-gold)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gold-light)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  2. Sightseeing Places (Sightseen) — {((form.sightseeing || []).length)} Spots Added
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                  Add as many spots as you need (e.g. <b>5 Spots</b> for Nepal or Kerala). Use 1-click batch presets or customize below!
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-gold"
                  style={{ padding: '0.45rem 1rem', fontSize: '0.82rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  onClick={() => addListItem('sightseeing', { name: '', title: '', image: '', text: '', description: '', timing: '', ticketInfo: '', category: 'Sightseeing' })}
                >
                  <Plus size={14} /> Add Single Spot
                </button>
              </div>
            </div>

            {/* 1-Click Multi-Spot (5 Spots) Batch Add Buttons */}
            <div style={{ marginBottom: '0.8rem', padding: '0.75rem', background: 'rgba(212,175,55,0.06)', borderRadius: '10px', border: '1px solid rgba(212,175,55,0.25)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--gold-light)', fontWeight: 800, marginBottom: '0.45rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Sparkles size={14} color="var(--gold-primary)" /> ⚡ 1-Click Add 5 Popular Tour Spots:
              </div>
              <div className="admin-batch-btns">
                <button
                  type="button"
                  onClick={() => handleBatchAdd5Spots('nepal')}
                  className="btn-glass admin-batch-btn"
                  style={{ color: '#fef08a', border: '1px solid var(--border-gold)' }}
                >
                  🇳🇵 + Add 5 Nepal Highlights (Kathmandu, Pokhara, Muktinath, Sarangkot, Lumbini)
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchAdd5Spots('kerala')}
                  className="btn-glass admin-batch-btn"
                  style={{ color: '#6ee7b7', border: '1px solid rgba(16,185,129,0.4)' }}
                >
                  🌴 + Add 5 Kerala Spots (Munnar, Athirappilly, Wayanad, Kovalam, Alleppey)
                </button>
                <button
                  type="button"
                  onClick={() => handleBatchAdd5Spots('pilgrimage')}
                  className="btn-glass admin-batch-btn"
                  style={{ color: '#fbcfe8', border: '1px solid rgba(244,114,182,0.4)' }}
                >
                  🛕 + Add 5 Sacred Pilgrimage Spots (Kashi, Ayodhya, Kathmandu, Muktinath, Lumbini)
                </button>
              </div>
            </div>

            {/* Quick 1-Click Single Place Chips */}
            <div style={{ marginBottom: '1rem', padding: '0.65rem 0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px dashed rgba(212,175,55,0.3)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>
                Quick 1-Click Single Spot Presets:
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {Object.entries(PLACE_PHOTO_LIBRARY).map(([key, item]) => {
                  const alreadyAdded = (form.sightseeing || []).some(s => (s.name || '').toLowerCase().includes(item.name.toLowerCase()));
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => {
                        if (!alreadyAdded) {
                          addListItem('sightseeing', {
                            name: item.name,
                            title: item.title,
                            image: item.url,
                            text: item.description,
                            description: item.description,
                            timing: 'Morning / Afternoon',
                            ticketInfo: 'Entry Passes Handled by OASIS',
                            category: 'Sightseeing'
                          });
                        }
                      }}
                      style={{
                        background: alreadyAdded ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)',
                        border: alreadyAdded ? '1px solid #10b981' : '1px solid rgba(255,255,255,0.15)',
                        color: alreadyAdded ? '#6ee7b7' : '#fff',
                        borderRadius: '16px',
                        padding: '0.25rem 0.6rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: alreadyAdded ? 'default' : 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}
                    >
                      {alreadyAdded ? '✓' : '+'} {item.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sightseeing Items Cards */}
            {(form.sightseeing || []).length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px dashed rgba(255,255,255,0.15)' }}>
                <p style={{ margin: '0 0 0.8rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  No sightseeing spots added yet. Click one of the 5-Spot buttons above or click "+ Add Single Spot".
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.1rem' }}>
                {(form.sightseeing || []).map((s, idx) => {
                  const matchingPresets = getMatchingPlacePhotos(s.name || '');
                  return (
                    <div key={idx} className="sightsee-spot-card">
                      
                      {/* Spot Card Header with Reorder, Duplicate & Remove Controls */}
                      <div className="sightsee-spot-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            Spot #{idx + 1} {s.name ? `— ${s.name}` : ''}
                          </span>
                          {s.category && (
                            <span style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '10px', background: 'rgba(212,175,55,0.15)', color: '#fef08a', border: '1px solid rgba(212,175,55,0.3)', fontWeight: 700 }}>
                              {s.category}
                            </span>
                          )}
                        </div>

                        {/* Action Buttons Toolbar */}
                        <div className="sightsee-spot-actions">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveSpot(idx, -1)}
                              title="Move Spot Up"
                              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                            >
                              <ChevronUp size={13} /> Up
                            </button>
                          )}
                          {idx < ((form.sightseeing || []).length - 1) && (
                            <button
                              type="button"
                              onClick={() => handleMoveSpot(idx, 1)}
                              title="Move Spot Down"
                              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                            >
                              <ChevronDown size={13} /> Down
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDuplicateSpot(idx)}
                            title="Duplicate this Spot"
                            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fef08a', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                          >
                            <Copy size={12} /> Duplicate
                          </button>
                          <button
                            type="button"
                            onClick={() => removeListItem('sightseeing', idx)}
                            style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '0.25rem 0.55rem', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>

                      {/* Experience / Category Tag Chips */}
                      <div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem', fontWeight: 600 }}>
                          Experience Category:
                        </div>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {[
                            '🛕 Temple Darshan',
                            '⛵ Boating / Lake',
                            '🌄 Sunrise / Viewpoint',
                            '🌊 Waterfall',
                            '🌲 Nature / Trek',
                            '🏛️ UNESCO Heritage',
                            '🛍️ Local Market / Culture'
                          ].map((cat, cIdx) => (
                            <button
                              key={cIdx}
                              type="button"
                              onClick={() => updateListItem('sightseeing', idx, { category: cat })}
                              style={{
                                padding: '0.2rem 0.5rem',
                                borderRadius: '12px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                background: (s.category === cat) ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.05)',
                                border: (s.category === cat) ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                                color: (s.category === cat) ? '#fef08a' : 'var(--text-muted)'
                              }}
                            >
                              {cat}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Place Name & Attraction Title */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.8rem' }}>
                        <div>
                          <label style={labelStyle}>Place Name * (e.g. Pokhara, Muktinath, Munnar)</label>
                          <input
                            style={fieldStyle}
                            value={s.name || ''}
                            onChange={(e) => {
                              const newName = e.target.value;
                              const match = getMatchingPlacePhotos(newName)[0];
                              if (match && (!s.image || s.image.includes('placeholder') || !s.text)) {
                                updateListItem('sightseeing', idx, {
                                  name: newName,
                                  title: s.title || match.title,
                                  image: s.image || match.url,
                                  text: s.text || match.description,
                                  description: s.description || match.description
                                });
                              } else {
                                updateListItem('sightseeing', idx, { name: newName });
                              }
                            }}
                            placeholder="e.g. Pokhara"
                            required
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Attraction Title *</label>
                          <input
                            style={fieldStyle}
                            value={s.title || s.name || ''}
                            onChange={(e) => updateListItem('sightseeing', idx, { title: e.target.value })}
                            placeholder="e.g. Pokhara Phewa Lake & Mountain Views"
                            required
                          />
                        </div>
                      </div>

                      {/* Instant Photo Suggestions Ribbon (if matching presets exist) */}
                      {matchingPresets.length > 0 && (
                        <div style={{ padding: '0.6rem 0.8rem', background: 'rgba(212,175,55,0.08)', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.25)' }}>
                          <div style={{ fontSize: '0.72rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.4rem' }}>
                            ✨ Suggested Photos for "{s.name}": (Click any photo to select & auto-fill)
                          </div>
                          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                            {matchingPresets.map((match, mIdx) => (
                              <div
                                key={mIdx}
                                onClick={() => {
                                  updateListItem('sightseeing', idx, {
                                    image: match.url,
                                    title: match.title,
                                    text: match.description,
                                    description: match.description
                                  });
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.4rem',
                                  padding: '0.3rem 0.6rem',
                                  borderRadius: '8px',
                                  background: (s.image === match.url) ? 'rgba(212,175,55,0.25)' : 'rgba(255,255,255,0.05)',
                                  border: (s.image === match.url) ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                                  cursor: 'pointer'
                                }}
                              >
                                <img src={match.url} alt={match.name} style={{ width: '40px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
                                <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 600 }}>{match.name}</span>
                                {s.image === match.url && <span style={{ color: 'var(--gold-light)', fontSize: '0.75rem' }}>✓</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Photo Preview & Custom URL / Direct Upload / AI Generate */}
                      <div className="sightsee-photo-row">
                        <div style={{ width: '95px', height: '70px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-gold)', background: '#000', position: 'relative', margin: '0 auto' }}>
                          <img src={s.image || './ooty-toy-train-real.jpg'} alt="Spot preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          {(generatingSpotAiIdx === idx || uploadingSpotIdx === idx) && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold-light)' }}>
                              <Loader2 size={18} className="spinner" />
                            </div>
                          )}
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                          <label style={labelStyle}>Spot Photo URL / Direct Upload / AI Generate *</label>
                          <div className="sightsee-photo-inputs">
                            <input
                              style={{ ...fieldStyle, flex: '1 1 150px', minWidth: '0' }}
                              value={s.image || ''}
                              onChange={(e) => updateListItem('sightseeing', idx, { image: e.target.value })}
                              placeholder="Paste photo URL or use buttons 👉"
                              required
                            />
                            
                            {/* Hidden File Input */}
                            <input
                              type="file"
                              id={`spot-file-${idx}`}
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleUploadSpotPhotoFile(idx, file);
                              }}
                            />
                            
                            {/* Direct Upload Button */}
                            <label
                              htmlFor={`spot-file-${idx}`}
                              className="btn-glass"
                              style={{
                                padding: '0.45rem 0.85rem',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                cursor: 'pointer',
                                margin: 0
                              }}
                            >
                              <Upload size={13} color="var(--gold-primary)" />
                              {uploadingSpotIdx === idx ? 'Uploading...' : '📁 Upload Photo'}
                            </label>

                            {/* AI Image Generation Button */}
                            <button
                              type="button"
                              onClick={() => handleGenerateSpotAiPhoto(idx)}
                              disabled={generatingSpotAiIdx === idx}
                              className="btn-gold"
                              style={{
                                padding: '0.45rem 0.85rem',
                                fontSize: '0.78rem',
                                fontWeight: 800,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                opacity: generatingSpotAiIdx === idx ? 0.7 : 1
                              }}
                            >
                              {generatingSpotAiIdx === idx ? (
                                <>
                                  <Loader2 size={13} className="spinner" /> Generating AI...
                                </>
                              ) : (
                                <>
                                  <Sparkles size={13} /> ✨ AI Suggest Image
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Timing & Inclusions Badge Row (More Options) */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem' }}>
                        <div>
                          <label style={labelStyle}>Best Timing (e.g. 🌅 Sunrise 5:30 AM / 🌆 Evening 6:30 PM)</label>
                          <input
                            style={fieldStyle}
                            value={s.timing || ''}
                            onChange={(e) => updateListItem('sightseeing', idx, { timing: e.target.value })}
                            placeholder="e.g. Morning 5:30 AM Sunrise / Full Day"
                          />
                        </div>

                        <div>
                          <label style={labelStyle}>Ticket &amp; Inclusions Info</label>
                          <input
                            style={fieldStyle}
                            value={s.ticketInfo || ''}
                            onChange={(e) => updateListItem('sightseeing', idx, { ticketInfo: e.target.value })}
                            placeholder="e.g. VIP Darshan Included / Boating Charges Paid"
                          />
                        </div>
                      </div>

                      {/* Short Description */}
                      <div>
                        <label style={labelStyle}>Place Description (Shown on click in details page) *</label>
                        <textarea
                          style={{ ...fieldStyle, resize: 'vertical', minHeight: '60px' }}
                          value={s.text || s.description || ''}
                          onChange={(e) => updateListItem('sightseeing', idx, { text: e.target.value, description: e.target.value })}
                          placeholder="e.g. Tranquil lakeside paradise reflecting snow-capped Mount Machapuchare with boating to Tal Barahi Island Temple..."
                          required
                        />
                      </div>

                      {/* Expandable Extra Options: Video URL, Transfer Mode, Traveler Tips */}
                      <details style={{ background: 'rgba(255,255,255,0.02)', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px dashed rgba(212,175,55,0.2)' }}>
                        <summary style={{ fontSize: '0.75rem', color: 'var(--gold-light)', fontWeight: 700, cursor: 'pointer', outline: 'none' }}>
                          ⚙️ + Add More Options (Video Link, Transfer Mode, Traveler Tips)
                        </summary>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.7rem', marginTop: '0.6rem' }}>
                          <div>
                            <label style={labelStyle}>🎥 Video Tour URL (YouTube / Reel)</label>
                            <input
                              style={fieldStyle}
                              value={s.video || ''}
                              onChange={(e) => updateListItem('sightseeing', idx, { video: e.target.value })}
                              placeholder="https://youtu.be/..."
                            />
                          </div>

                          <div>
                            <label style={labelStyle}>🚗 Transfer Mode</label>
                            <input
                              style={fieldStyle}
                              value={s.travelMode || ''}
                              onChange={(e) => updateListItem('sightseeing', idx, { travelMode: e.target.value })}
                              placeholder="e.g. Private AC Coach / Boating / Ropeway"
                            />
                          </div>

                          <div style={{ gridColumn: '1 / -1' }}>
                            <label style={labelStyle}>💡 Traveler Tip / Dress Code Guide</label>
                            <input
                              style={fieldStyle}
                              value={s.travelerTip || ''}
                              onChange={(e) => updateListItem('sightseeing', idx, { travelerTip: e.target.value })}
                              placeholder="e.g. Traditional dress required for temple entry. Golden hour 5 PM best for photos."
                            />
                          </div>
                        </div>
                      </details>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom Add Spot Button */}
            {(form.sightseeing || []).length > 0 && (
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => addListItem('sightseeing', { name: '', title: '', image: '', text: '', description: '', timing: '', ticketInfo: '', category: 'Sightseeing' })}
                  className="btn-gold"
                  style={{ padding: '0.55rem 1.4rem', fontSize: '0.85rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.4rem', borderRadius: '20px' }}
                >
                  <Plus size={16} /> + Add Another Sightseeing Spot (Spot #{((form.sightseeing || []).length + 1)})
                </button>
              </div>
            )}

          </div>

          {/* 4. Inclusions (What's Included) */}
          <div className="glass-card" style={{ padding: '1.2rem', background: 'rgba(9,20,38,0.6)', border: '1px solid var(--border-gold)' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--gold-light)', margin: '0 0 0.4rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              ✅ 3. Inclusions (What's Included in Package)
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 0.8rem' }}>
              Check the boxes below or edit lines in the box to customize what is included for travelers:
            </p>

            {/* Common Checkbox Toggles */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.6rem', marginBottom: '1rem' }}>
              {[
                'Comfortable Hotel Stay across all destinations',
                'Daily Delicious Breakfast & Dinner Buffet',
                'Kerala – Destination Reserved 3rd AC Train / Flight Tickets',
                'Private AC Coach for All Sightseeing Transfers',
                'Experienced Malayali Tour Manager & Escort from Thrissur',
                'All Entry Permits, Tolls, Parking & Driver Allowances',
                'Sightseeing Boating / VIP Temple Darshan Entry'
              ].map((inc, i) => {
                const currentList = toList(form.included);
                const isChecked = currentList.some(item => item.toLowerCase().includes(inc.slice(0, 15).toLowerCase()));
                return (
                  <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', padding: '0.4rem 0.65rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.78rem', color: isChecked ? '#6ee7b7' : 'var(--text-muted)' }}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => {
                        if (e.target.checked) {
                          const updated = [...currentList, inc];
                          setForm(f => ({ ...f, included: updated.join('\n') }));
                        } else {
                          const updated = currentList.filter(item => !item.toLowerCase().includes(inc.slice(0, 15).toLowerCase()));
                          setForm(f => ({ ...f, included: updated.join('\n') }));
                        }
                      }}
                    />
                    <span>{inc}</span>
                  </label>
                );
              })}
            </div>

            <label style={labelStyle}>Full Inclusions List (One item per line):</label>
            <textarea
              style={{ ...fieldStyle, resize: 'vertical', minHeight: '100px' }}
              value={form.included}
              onChange={set('included')}
              placeholder="Comfortable hotel accommodation&#10;Daily breakfast & dinner&#10;Private AC transfers..."
            />
          </div>

        </div>
      )}

      {/* ══════════════ STEP 3 · START & PICKUP ROUTE ══════════════ */}
      {activeStep === 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
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
        </div>
      )}

      {/* ─── WIZARD NAVIGATION ─── */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.2rem', alignItems: 'center' }}>
        {activeStep > 0 && (
          <button
            type="button"
            className="btn-glass"
            onClick={() => handleStepNavigation(-1)}
            style={{ flex: '1 1 120px', minWidth: '110px', justifyContent: 'center', padding: '0.75rem 0.9rem', fontSize: '0.82rem' }}
          >
            ← Back
          </button>
        )}

        {initial?.id && onDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Are you sure you want to permanently delete "${initial.title || 'this tour'}"?\n\nThis will remove it immediately from the website and Firebase database.`)) {
                onDelete(initial.id);
              }
            }}
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(239,68,68,0.18)',
              border: '1px solid rgba(239,68,68,0.5)',
              color: '#fca5a5',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              flex: '1 1 120px',
              minWidth: '110px',
              transition: 'all 0.2s ease'
            }}
            title="Delete this tour package permanently"
          >
            <Trash2 size={15} /> Delete Package
          </button>
        )}

        {activeStep < TOUR_FORM_STEPS.length - 1 ? (
          <button
            type="button"
            className="btn-gold"
            onClick={() => handleStepNavigation(1)}
            disabled={!stepCompleteFlags[activeStep]}
            style={{
              flex: '2 1 180px',
              minWidth: '160px',
              justifyContent: 'center',
              padding: '0.75rem 1rem',
              fontSize: '0.85rem',
              opacity: stepCompleteFlags[activeStep] ? 1 : 0.5,
              cursor: stepCompleteFlags[activeStep] ? 'pointer' : 'not-allowed'
            }}
          >
            {stepCompleteFlags[activeStep] ? '✓ ' : ''}Next: Step {activeStep + 2} · {TOUR_FORM_STEPS[activeStep + 1].label} →
          </button>
        ) : (
          <button type="submit" className="btn-gold" style={{ flex: '2 1 180px', minWidth: '160px', justifyContent: 'center', padding: '0.75rem 1rem', fontSize: '0.85rem' }}>
            <Save size={16} /> Publish Tour Package
          </button>
        )}

        <button type="button" className="btn-glass" onClick={onCancel} style={{ flex: '1 1 90px', minWidth: '80px', justifyContent: 'center', padding: '0.75rem 0.9rem', fontSize: '0.82rem' }}>
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
    bookingStartDate: initial?.bookingStartDate || '',
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
          <label style={labelStyle}>Bookings Open From (Date)</label>
          <input style={fieldStyle} type="date" value={form.bookingStartDate} onChange={set('bookingStartDate')} />
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.3rem' }}>
            Until this date the banner shows the slide but the Book Now / WhatsApp buttons stay hidden.
          </div>
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

export function DestinationForm({ initial, onSave, onCancel, onDirtyChange, onDelete }) {
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
        {initial?.id && onDelete && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Are you sure you want to permanently delete "${initial.name || 'this destination'}"?\n\nThis will remove it immediately from the website and Firebase database.`)) {
                onDelete(initial.id);
              }
            }}
            style={{
              padding: '0.6rem 1.2rem',
              background: 'rgba(239,68,68,0.18)',
              border: '1px solid rgba(239,68,68,0.5)',
              color: '#fca5a5',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.4rem',
              transition: 'all 0.2s ease'
            }}
            title="Delete this destination permanently"
          >
            <Trash2 size={16} /> Delete Destination
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

