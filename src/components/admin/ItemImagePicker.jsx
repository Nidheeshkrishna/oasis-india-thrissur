import React, { useEffect, useRef, useState } from 'react';
import { Upload, Sparkles, Trash2, Check, Search, MapPin as MapPinIcon, Wand2, Loader2 } from 'lucide-react';
import { PRESET_IMAGES } from './ImageUploader';
import { findTopPlaces } from '../../data/topPlacesData';
import { geminiService } from '../../services/gemini';

const GOOGLE_KEY_STORAGE = 'oasis_google_img_key';
const GOOGLE_CX_STORAGE = 'oasis_google_img_cx';

// Extra keyword → real-photo pools for places without local assets
const AI_IMAGE_POOLS = [
  {
    keys: ['silent valley', 'kunthi', 'sairandhri'],
    images: ['https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80']
  },
  {
    keys: ['athirappilly', 'vazhachal', 'chalakudy', 'niagara'],
    images: ['https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80']
  },
  {
    keys: ['wayanad', 'chembra', 'banasura', 'edakkal'],
    images: ['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80']
  },
  {
    keys: ['kashmir', 'dal lake', 'gulmarg', 'srinagar', 'sonamarg', 'pahalgam'],
    images: ['./dal-lake-shikara-real.jpg', './gulmarg-real.jpg', './srinagar-real.jpg', './sonamarg-real.jpg', './pahalgam-real.jpg']
  },
  {
    keys: ['kashi', 'varanasi', 'ganga', 'ayodhya', 'ram mandir'],
    images: ['./kashi-vishwanath-real.jpg', './ayodhya-ram-mandir-real.jpg', 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80']
  },
  {
    keys: ['munnar'],
    images: ['./munnar-tea-plantations-real.jpg']
  },
  {
    keys: ['parambikulam'],
    images: ['./parambikulam-forest-real.jpg', './parambikulam-lake-real.jpg', './parambikulam-tiger-real.jpg']
  },
  {
    keys: ['kerala'],
    images: ['./munnar-tea-plantations-real.jpg', './parambikulam-forest-real.jpg', './parambikulam-lake-real.jpg', './parambikulam-tiger-real.jpg']
  },
  {
    keys: ['odisha', 'puri', 'konark', 'jagannath', 'bhubaneswar', 'lingaraj'],
    images: ['./puri-jagannath-real.jpg', './puri-jagannath-entrance-real.jpg', './konark-sun-temple-real.jpg', './lingaraj-temple-real.jpg']
  },
  {
    keys: ['punjab', 'amritsar', 'golden temple', 'wagah'],
    images: ['./golden-temple-real.jpg', './wagah-border-real.jpg']
  },
  {
    keys: ['tiruchendur', 'thenkasi', 'tamil nadu', 'tamilnadu'],
    images: ['./tiruchendur-beach-real.jpg', './tiruchendur-murugan-real.jpg', './thenkasi-viswanathar-real.jpg']
  },
  {
    keys: ['horanadu', 'annapoorneshwari', 'gundlupet', 'karnataka'],
    images: ['./horanadu-annapoorneshwari-real.jpg', './gundlupet-sunflowers-real.jpg']
  }
];

const FALLBACK_POOL = [
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
  './kashi-vishwanath-real.jpg'
];

const urlToName = (url) => {
  const base = String(url).split('/').pop().replace(/\.(png|jpe?g|webp)$/i, '').replace(/[-_]+/g, ' ');
  return base.replace(/\b\w/g, c => c.toUpperCase());
};

const isRealPhoto = (url) => {
  const u = String(url);
  if (/_ai\.png$/i.test(u)) return false;
  if (u.includes('images.unsplash.com') || u.includes('upload.wikimedia.org')) return true;
  if (u.startsWith('data:image')) return true;
  return /\.(jpe?g|webp|png|gif)(\?.*)?$/i.test(u);
};

const findPoolImages = (prompt) => {
  const p = (prompt || '').toLowerCase();
  const match = AI_IMAGE_POOLS.find(pool => pool.keys.some(k => p.includes(k)));
  return match ? match.images : [];
};

// Given a place name keyword, return every matching image with its display name
// (real photos sorted first, then AI-generated posters).
// Fallback pool is used ONLY when nothing matches, so unrelated images never mix in.
const matchImages = (keyword) => {
  const p = (keyword || '').toLowerCase().trim();
  if (!p) return [];

  const named = PRESET_IMAGES
    .filter(it => it.name.toLowerCase().includes(p) || it.category.toLowerCase().includes(p))
    .map(it => ({ name: it.name, url: it.url }));

  const pooled = findPoolImages(p).map(url => ({ name: urlToName(url), url }));

  let combined = [...named, ...pooled];
  if (combined.length === 0) {
    combined = FALLBACK_POOL.map(url => ({ name: urlToName(url), url }));
  }

  const seen = new Set();
  return combined
    .filter(it => (seen.has(it.url) ? false : (seen.add(it.url), true)))
    .sort((a, b) => (isRealPhoto(b.url) ? 1 : 0) - (isRealPhoto(a.url) ? 1 : 0));
};

/**
 * ItemImagePicker — per-item image selector for admin forms.
 * - Upload File: local drag & drop / browse (Base64)
 * - AI Image List: type a place name → lists all matching images (real photos first, tagged Real/AI)
 * - Google Images: live Google Custom Search (needs API key + CSE id, saved to localStorage)
 * - URL: direct entry with live preview
 */
export default function ItemImagePicker({
  value = '',
  onChange,
  hint = 'e.g. Ooty',
  multiple = false,
  images = [],
  onImagesChange
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'ai' | 'google'
  const [aiPrompt, setAiPrompt] = useState('');
  const [candidates, setCandidates] = useState([]);
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  // Google Custom Search state
  const [gKey, setGKey] = useState(() => localStorage.getItem(GOOGLE_KEY_STORAGE) || '');
  const [gCx, setGCx] = useState(() => localStorage.getItem(GOOGLE_CX_STORAGE) || '');
  const [gQuery, setGQuery] = useState('');
  const [gResults, setGResults] = useState([]);
  const [gLoading, setGLoading] = useState(false);
  const [gError, setGError] = useState('');

  // Gemini AI Image Generator state
  const [genPrompt, setGenPrompt] = useState(hint ? hint.replace(/^e\.g\.\s*/i, '') : '');
  const [genStyle, setGenStyle] = useState('photorealistic');
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState('');
  const [genSuccess, setGenSuccess] = useState('');

  useEffect(() => {
    if (hint && !genPrompt) {
      setGenPrompt(hint.replace(/^e\.g\.\s*/i, ''));
    }
  }, [hint]);

  const handleGenerateWithGemini = async () => {
    const promptToUse = genPrompt.trim() || hint.replace(/^e\.g\.\s*/i, '');
    if (!promptToUse) {
      setGenError('Please enter a description for the image.');
      return;
    }
    setGenLoading(true);
    setGenError('');
    setGenSuccess('');
    try {
      const styleMap = {
        photorealistic: 'Create a stunning photorealistic 4K travel photograph',
        artistic: 'Create a vibrant artistic travel illustration',
        cinematic: 'Create a dramatic cinematic travel scene with golden hour lighting'
      };
      const fullPrompt = `${styleMap[genStyle] || styleMap.photorealistic} of ${promptToUse}. Suitable for a luxury travel agency poster banner.`;
      const generatedUrl = await geminiService.generatePosterImage(fullPrompt, genStyle);
      addUrl(generatedUrl);
      setGenSuccess('✓ Generated and applied successfully!');
    } catch (err) {
      setGenError(err.message || 'AI Generation failed');
    } finally {
      setGenLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem(GOOGLE_KEY_STORAGE, gKey);
  }, [gKey]);
  useEffect(() => {
    localStorage.setItem(GOOGLE_CX_STORAGE, gCx);
  }, [gCx]);

  const handlePromptChange = (val) => {
    setAiPrompt(val);
    setCandidates(matchImages(val));
  };

  const handleFileUpload = (files) => {
    const file = files && files[0];
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange && onChange(e.target.result);
    reader.readAsDataURL(file);
  };

  const selectedSet = new Set(Array.isArray(images) ? images : []);
  const topPlaces = findTopPlaces(aiPrompt);

  const addUrl = (url) => {
    if (multiple) {
      if (!onImagesChange) return;
      const cur = Array.isArray(images) ? images : [];
      if (!cur.includes(url)) onImagesChange([...cur, url]);
    } else if (onChange) {
      onChange(url);
    }
  };

  const toggleCandidate = (url) => {
    if (!onImagesChange) return;
    const cur = Array.isArray(images) ? images : [];
    onImagesChange(selectedSet.has(url) ? cur.filter(u => u !== url) : [...cur, url]);
  };

  const selectAllCandidates = () => {
    if (!onImagesChange) return;
    const cur = Array.isArray(images) ? images : [];
    const merged = [...cur];
    candidates.forEach(c => { if (!merged.includes(c.url)) merged.push(c.url); });
    onImagesChange(merged);
  };

  const handleGoogleSearch = async (query) => {
    const q = query ?? gQuery;
    setGError('');
    setGResults([]);
    if (!gKey || !gCx || !q) {
      setGError('Enter the Google API key, CSE ID and a search query.');
      return;
    }
    setGLoading(true);
    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(gKey)}&cx=${encodeURIComponent(gCx)}&searchType=image&num=8&q=${encodeURIComponent(q)}`;
      const res = await fetch(url);
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Google API error (${res.status})`);
      }
      const data = await res.json();
      setGResults(data.items || []);
    } catch (err) {
      setGError(err.message || 'Google search failed.');
    } finally {
      setGLoading(false);
    }
  };

  const startGoogleSearch = (placeName) => {
    setGQuery(placeName);
    setActiveTab('google');
    if (gKey && gCx) {
      handleGoogleSearch(placeName);
    } else {
      setGError('Add the Google API key and CSE ID above to fetch original photos for this place.');
    }
  };

  const renderCard = (url, name, tag) => (
    <div style={{ position: 'relative', height: '96px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.2s ease' }}>
      <img src={url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 45%, rgba(0,0,0,0.85) 100%)' }} />
      {tag && (
        <span style={{
          position: 'absolute', top: '0.3rem', left: '0.3rem',
          fontSize: '0.55rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.03em',
          padding: '0.12rem 0.4rem', borderRadius: '6px',
          background: tag === 'Google' ? '#4285f4' : tag === 'AI' ? 'rgba(212,175,55,0.25)' : 'rgba(16,185,129,0.9)',
          color: tag === 'Google' ? '#fff' : tag === 'AI' ? '#fef08a' : '#04230f'
        }}>
          {tag}
        </span>
      )}
      <span style={{ position: 'absolute', bottom: '0.3rem', left: '0.4rem', right: '0.4rem', fontSize: '0.62rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {name}
      </span>
    </div>
  );

  return (
    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '0.7rem', background: 'rgba(0,0,0,0.25)' }}>
      {/* URL field + live preview */}
      <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '0.6rem' }}>
        <div style={{ width: '56px', height: '40px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {value ? (
            <img src={value} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>No img</span>
          )}
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder="Paste image URL or ./asset.jpg"
          style={{
            flex: 1,
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--border-gold)',
            borderRadius: '8px',
            color: '#fff',
            padding: '0.45rem 0.7rem',
            fontSize: '0.78rem',
            outline: 'none'
          }}
        />
        {value && (
          <button type="button" onClick={() => onChange && onChange('')} style={{ border: 'none', background: 'transparent', color: '#f87171', cursor: 'pointer', flexShrink: 0 }} title="Clear image">
            <Trash2 size={15} />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem', borderRadius: '16px', marginBottom: '0.6rem', width: 'fit-content', flexWrap: 'wrap' }}>
        {[
          { id: 'upload', label: 'Upload File' },
          { id: 'generate', label: '✨ AI Generate (Gemini)' },
          { id: 'ai', label: '🗂️ Preset Library' },
          { id: 'google', label: '🔍 Google Images' }
        ].map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: activeTab === tab.id ? 'linear-gradient(135deg, #d4af37, #aa841c)' : 'transparent',
              color: activeTab === tab.id ? '#060c17' : 'var(--text-muted)',
              border: 'none',
              padding: '0.3rem 0.7rem',
              borderRadius: '14px',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'generate' && (
        <div style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.25)', borderRadius: '10px', padding: '0.8rem' }}>
          <div style={{ fontSize: '0.72rem', color: '#c4b5fd', marginBottom: '0.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Wand2 size={13} color="#a78bfa" /> Describe scene to generate with Google Gemini AI:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input
              type="text"
              value={genPrompt}
              onChange={(e) => { setGenPrompt(e.target.value); setGenError(''); setGenSuccess(''); }}
              placeholder="e.g. Ooty toy train passing through green tea valley at sunrise"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(139,92,246,0.35)',
                borderRadius: '8px',
                color: '#fff',
                padding: '0.45rem 0.7rem',
                fontSize: '0.78rem',
                outline: 'none'
              }}
            />
            <select
              value={genStyle}
              onChange={(e) => setGenStyle(e.target.value)}
              style={{
                background: '#0a0d1e',
                border: '1px solid rgba(139,92,246,0.35)',
                color: '#c4b5fd',
                borderRadius: '8px',
                padding: '0.45rem 0.6rem',
                fontSize: '0.75rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="photorealistic">📷 Photorealistic</option>
              <option value="cinematic">🎬 Cinematic</option>
              <option value="artistic">🎨 Artistic</option>
            </select>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Uses Gemini 2.0 Flash multimodal image generator
            </span>
            <button
              type="button"
              onClick={handleGenerateWithGemini}
              disabled={genLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.4rem 0.85rem',
                borderRadius: '8px',
                cursor: genLoading ? 'not-allowed' : 'pointer',
                background: genLoading ? 'rgba(139,92,246,0.2)' : 'linear-gradient(135deg, #7c3aed, #4c1d95)',
                border: '1px solid rgba(139,92,246,0.4)',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 700,
                opacity: genLoading ? 0.7 : 1
              }}
            >
              {genLoading ? <Loader2 size={13} className="animate-pulse-slow" /> : <Sparkles size={13} />}
              <span>{genLoading ? 'Generating...' : '✨ Generate Image'}</span>
            </button>
          </div>
          {genError && <div style={{ marginTop: '0.4rem', color: '#f87171', fontSize: '0.72rem', fontWeight: 600 }}>⚠️ {genError}</div>}
          {genSuccess && <div style={{ marginTop: '0.4rem', color: '#34d399', fontSize: '0.72rem', fontWeight: 700 }}>{genSuccess}</div>}
        </div>
      )}

      {activeTab === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => { e.preventDefault(); setDragging(false); handleFileUpload(e.dataTransfer.files); }}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: dragging ? '2px dashed var(--gold-primary)' : '1px dashed rgba(212,175,55,0.4)',
            borderRadius: '8px',
            padding: '0.9rem',
            textAlign: 'center',
            cursor: 'pointer',
            background: dragging ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.02)',
            transition: 'all 0.3s ease'
          }}
        >
          <Upload size={18} color="var(--gold-primary)" style={{ marginBottom: '0.25rem' }} />
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#fff' }}>Drag &amp; drop or <span style={{ color: 'var(--gold-light)' }}>browse</span> an image</div>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e.target.files)} style={{ display: 'none' }} />
        </div>
      )}

      {activeTab === 'ai' && (
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Type a place name (e.g. <strong style={{ color: 'var(--gold-light)' }}>{hint.replace('e.g. ', '')}</strong>) — real photos are listed first, AI posters marked as AI:
          </div>
          <input
            type="text"
            value={aiPrompt}
            onChange={(e) => handlePromptChange(e.target.value)}
            placeholder="e.g. Ooty, Kashi, Kashmir, Munnar, Athirappilly..."
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'rgba(0,0,0,0.5)',
              border: '1px solid var(--border-gold)',
              borderRadius: '8px',
              color: '#fff',
              padding: '0.5rem 0.7rem',
              fontSize: '0.78rem',
              outline: 'none'
            }}
          />
          {candidates.length === 0 && aiPrompt && (
            <div style={{ marginTop: '0.6rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              No matching images for "{aiPrompt}". Try a known place like Ooty, Munnar, Kashi, Kashmir, Srinagar, Amritsar, Puri, Tiruchendur, Silent Valley, Athirappilly, Wayanad, Kerala.
            </div>
          )}
          {candidates.length > 0 && multiple && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn-gold"
                onClick={selectAllCandidates}
                disabled={candidates.every(c => selectedSet.has(c.url))}
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
              >
                <Sparkles size={12} style={{ verticalAlign: '-2px', marginRight: '4px' }} /> Select All Images ({candidates.length})
              </button>
              {selectedSet.size > 0 && (
                <span style={{ fontSize: '0.72rem', color: 'var(--emerald-accent)', fontWeight: 700 }}>{selectedSet.size} selected</span>
              )}
            </div>
          )}
          {candidates.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem', marginTop: '0.6rem', maxHeight: '220px', overflowY: 'auto', paddingRight: '0.2rem' }}>
              {candidates.map((c, i) => {
                const selected = multiple ? selectedSet.has(c.url) : value === c.url;
                return (
                  <div
                    key={i}
                    onClick={() => (multiple ? toggleCandidate(c.url) : onChange && onChange(c.url))}
                    style={{
                      position: 'relative',
                      height: '96px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: selected ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.12)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {renderCard(c.url, c.name, isRealPhoto(c.url) ? 'Real Photo' : 'AI')}
                    {selected && (
                      <div style={{ position: 'absolute', top: '0.3rem', right: '0.3rem', background: 'var(--gold-primary)', color: '#000', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                        <Check size={12} strokeWidth={3} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          {multiple && selectedSet.size > 0 && (
            <div style={{ marginTop: '0.6rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '0.4rem' }}>Selected Images ({selectedSet.size})</div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {(Array.isArray(images) ? images : []).map((url, i) => (
                  <div key={i} style={{ position: 'relative', width: '58px', height: '48px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-gold)' }}>
                    <img src={url} alt={`Selected ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => onImagesChange && onImagesChange((Array.isArray(images) ? images : []).filter((_, x) => x !== i))}
                      style={{
                        position: 'absolute', top: '2px', right: '2px',
                        background: 'rgba(239,68,68,0.85)', color: '#fff', border: 'none',
                        borderRadius: '4px', width: '16px', height: '16px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0
                      }}
                      title="Remove"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          {topPlaces && (
            <div style={{ marginTop: '0.8rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.7rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 800, color: 'var(--gold-light)', marginBottom: '0.5rem' }}>
                <MapPinIcon size={13} /> Top Places in {topPlaces.label} — click to fetch original Google photos
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {topPlaces.places.map((p, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => startGoogleSearch(p.name)}
                    title={p.tag}
                    style={{
                      background: 'rgba(16,185,129,0.12)',
                      border: '1px solid rgba(16,185,129,0.4)',
                      color: '#6ee7b7',
                      borderRadius: '16px',
                      padding: '0.3rem 0.7rem',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
              {topPlaces.nearby && topPlaces.nearby.length > 0 && (
                <>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.6rem', marginBottom: '0.35rem' }}>Nearby places to add</div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {topPlaces.nearby.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => startGoogleSearch(`${p.name} ${topPlaces.label}`)}
                        title={p.tag}
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px dashed rgba(255,255,255,0.2)',
                          color: '#cbd5e1',
                          borderRadius: '16px',
                          padding: '0.3rem 0.7rem',
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
            <Sparkles size={12} color="var(--gold-primary)" /> {candidates.length > 0 ? `${candidates.length} matching image(s) found` : 'Start typing to list images'}
          </div>
        </div>
      )}

      {activeTab === 'google' && (
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
            Search original photos live from Google. Your API key &amp; CSE ID are saved on this browser only. Get them at the <a href="https://developers.google.com/custom-search/v1/overview" target="_blank" rel="noreferrer" style={{ color: 'var(--gold-light)' }}>Google Custom Search docs</a>.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.4rem' }}>
            <input
              type="text"
              value={gKey}
              onChange={(e) => setGKey(e.target.value)}
              placeholder="Google API key"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--border-gold)',
                borderRadius: '8px',
                color: '#fff',
                padding: '0.45rem 0.7rem',
                fontSize: '0.72rem',
                outline: 'none'
              }}
            />
            <input
              type="text"
              value={gCx}
              onChange={(e) => setGCx(e.target.value)}
              placeholder="Custom Search Engine ID (cx)"
              style={{
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--border-gold)',
                borderRadius: '8px',
                color: '#fff',
                padding: '0.45rem 0.7rem',
                fontSize: '0.72rem',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <input
              type="text"
              value={gQuery}
              onChange={(e) => setGQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGoogleSearch()}
              placeholder={hint.replace('e.g. ', '')}
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--border-gold)',
                borderRadius: '8px',
                color: '#fff',
                padding: '0.45rem 0.7rem',
                fontSize: '0.75rem',
                outline: 'none'
              }}
            />
            <button type="button" className="btn-gold" onClick={handleGoogleSearch} disabled={gLoading} style={{ padding: '0.45rem 0.8rem', fontSize: '0.75rem', flexShrink: 0 }}>
              <Search size={13} /> {gLoading ? 'Searching...' : 'Search Google'}
            </button>
          </div>
          {gError && <div style={{ marginTop: '0.5rem', fontSize: '0.72rem', color: '#f87171', fontWeight: 600 }}>{gError}</div>}
          {gResults.length > 0 && (
            <>
              {gResults.length > 0 && multiple && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginTop: '0.6rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn-gold"
                    onClick={() => {
                      const cur = Array.isArray(images) ? images : [];
                      const merged = [...cur];
                      gResults.forEach(r => { if (!merged.includes(r.link)) merged.push(r.link); });
                      onImagesChange && onImagesChange(merged);
                    }}
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                  >
                    Select All Google Results ({gResults.length})
                  </button>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem', marginTop: '0.6rem', maxHeight: '260px', overflowY: 'auto', paddingRight: '0.2rem' }}>
                {gResults.map((r, i) => {
                  const selected = multiple ? selectedSet.has(r.link) : value === r.link;
                  return (
                    <div
                      key={i}
                      title={r.title}
                      onClick={() => addUrl(r.link)}
                      style={{
                        position: 'relative',
                        height: '96px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: selected ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.12)',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {renderCard(r.image?.thumbnailLink || r.link, r.title, 'Google')}
                      {selected && (
                        <div style={{ position: 'absolute', top: '0.3rem', right: '0.3rem', background: 'var(--gold-primary)', color: '#000', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              {multiple && selectedSet.size > 0 && (
                <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--emerald-accent)', fontWeight: 700 }}>{selectedSet.size} image(s) selected in total</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
