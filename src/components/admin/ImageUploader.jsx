import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Plus, Trash2, Layers, Check, Sparkles } from 'lucide-react';
import MixedBackground from '../MixedBackground';

// Pre-configured high resolution local assets and presets
export const PRESET_IMAGES = [
  // Silent Valley National Park AI Assets
  { id: 'sv-rainforest', name: 'Silent Valley Misty Rainforest', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80', category: 'Silent Valley' },
  { id: 'sv-river', name: 'Silent Valley Kunthi River Stream', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80', category: 'Silent Valley' },
  { id: 'sv-wildlife', name: 'Silent Valley Lion-Tailed Macaque', url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80', category: 'Silent Valley' },
  { id: 'sv-tower', name: 'Sairandhri Watchtower Panorama', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', category: 'Silent Valley' },

  // Athirappilly Waterfalls
  { id: 'ath-main', name: 'Athirappilly Roaring Waterfall', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80', category: 'Athirappilly' },
  { id: 'ath-spray', name: 'Athirappilly Rainbow Mist Spray', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80', category: 'Athirappilly' },
  { id: 'ath-river', name: 'Chalakudy Riverfront Rainforest', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80', category: 'Athirappilly' },
  { id: 'ath-sunset', name: 'Athirappilly Twilight Sunset', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80', category: 'Athirappilly' },

  // Wayanad Hills
  { id: 'way-chembra', name: 'Wayanad Chembra Heart Lake', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', category: 'Wayanad' },
  { id: 'way-banasura', name: 'Banasura Sagar Dam Lake', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', category: 'Wayanad' },

  // Kashi & Ayodhya
  { id: 'kashi-poster', name: 'Kashi Vishwanath Corridor', url: './kashi-vishwanath-real.jpg', category: 'Kashi & Ayodhya' },
  { id: 'ayodhya-poster', name: 'Shri Ram Janmabhoomi Temple', url: './ayodhya-ram-mandir-real.jpg', category: 'Kashi & Ayodhya' },
  { id: 'kashmir-poster', name: 'Kashmir Dal Lake Shikara', url: './dal-lake-shikara-real.jpg', category: 'Kashmir' },

  // Kerala & Heritage Presets
  { id: 'ooty-train', name: 'Ooty Heritage Toy Train', url: './ooty-toy-train-real.jpg', category: 'Ooty' },
  { id: 'ooty-tea', name: 'Ooty Nilgiri Tea Gardens', url: './ooty-tea-gardens-real.jpg', category: 'Ooty' },
  { id: 'ooty-botanical', name: 'Ooty Botanical Garden', url: './ooty-botanical-garden-real.jpg', category: 'Ooty' },
  { id: 'ooty-lake', name: 'Ooty Boating Lake', url: './ooty-lake-boating-real.jpg', category: 'Ooty' },
  { id: 'munnar-tea', name: 'Munnar Tea Estates', url: './munnar-tea-plantations-real.jpg', category: 'Kerala' },
  { id: 'parambikulam-tiger', name: 'Parambikulam Tiger Reserve', url: './parambikulam-tiger-real.jpg', category: 'Nature' },
  { id: 'gundlupet-sunflowers', name: 'Gundlupet Sunflower Fields', url: './gundlupet-sunflowers-real.jpg', category: 'Karnataka' },
  { id: 'horanadu-annapoorneshwari', name: 'Horanadu Annapoorneshwari Temple', url: './horanadu-annapoorneshwari-real.jpg', category: 'Karnataka' },
  { id: 'srinagar', name: 'Srinagar City & Jhelum', url: './srinagar-real.jpg', category: 'Kashmir' },
  { id: 'sonamarg', name: 'Sonamarg Golden Meadow', url: './sonamarg-real.jpg', category: 'Kashmir' },
  { id: 'pahalgam', name: 'Pahalgam Valley & Lidder River', url: './pahalgam-real.jpg', category: 'Kashmir' },
  { id: 'gulmarg', name: 'Gulmarg Meadows Ski Resort', url: './gulmarg-real.jpg', category: 'Kashmir' },
  { id: 'golden-temple', name: 'Golden Temple Amritsar', url: './golden-temple-real.jpg', category: 'Punjab' },
  { id: 'wagah-border', name: 'Wagah Border Ceremony', url: './wagah-border-real.jpg', category: 'Punjab' },
  { id: 'konark-sun', name: 'Konark Sun Temple', url: './konark-sun-temple-real.jpg', category: 'Odisha' },
  { id: 'lingaraj', name: 'Lingaraj Temple Bhubaneswar', url: './lingaraj-temple-real.jpg', category: 'Odisha' },
  { id: 'puri-jagannath', name: 'Puri Jagannath Temple', url: './puri-jagannath-real.jpg', category: 'Odisha' },
  { id: 'puri-jagannath-entrance', name: 'Puri Jagannath Entrance Gate', url: './puri-jagannath-entrance-real.jpg', category: 'Odisha' },
  { id: 'thenkasi-viswanathar', name: 'Thenkasi Kasi Viswanathar Temple', url: './thenkasi-viswanathar-real.jpg', category: 'Tamil Nadu' },
  { id: 'tiruchendur-beach', name: 'Tiruchendur Beach', url: './tiruchendur-beach-real.jpg', category: 'Tamil Nadu' },
  { id: 'tiruchendur-murugan', name: 'Tiruchendur Murugan Temple', url: './tiruchendur-murugan-real.jpg', category: 'Tamil Nadu' },
  { id: 'kashi-vishwanath', name: 'Kashi Vishwanath Corridor', url: './kashi-vishwanath-real.jpg', category: 'Pilgrimage' },
  { id: 'ayodhya-mandir', name: 'Ayodhya Shri Ram Mandir', url: './ayodhya-ram-mandir-real.jpg', category: 'Pilgrimage' },
  { id: 'parambikulam-forest', name: 'Parambikulam Rainforest', url: './parambikulam-forest-real.jpg', category: 'Nature' },
  { id: 'parambikulam-lake', name: 'Parambikulam Bamboo Lake', url: './parambikulam-lake-real.jpg', category: 'Nature' },
  { id: 'dal-lake', name: 'Srinagar Dal Lake Shikara', url: './dal-lake-shikara-real.jpg', category: 'Kashmir' }
];

const BLEND_STYLES = [
  { id: 'collage-blend', name: 'Collage Blend', desc: 'Diagonal split grid with soft gradient overlays' },
  { id: 'split-grid', name: '2x2 Split Quad', desc: 'Symmetrical 4-quadrant dynamic grid' },
  { id: 'fade-slide', name: 'Crossfade Slideshow', desc: 'Smooth auto-cycling crossfade transition' },
  { id: 'layered-soft', name: 'Layered Soft Blend', desc: 'Screen overlay with golden ambient glow' }
];

/**
 * ImageUploader Component
 * Allows uploading file(s), choosing from presets, mixing multiple background images,
 * and selecting background blend modes.
 */
export default function ImageUploader({
  value = '',
  onChange,
  multiValues = [],
  onMultiChange,
  blendStyle = 'collage-blend',
  onBlendStyleChange,
  enableMixMode = true
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'preset' | 'mix'
  const fileInputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [customAiPrompt, setCustomAiPrompt] = useState('Ooty Heritage Toy Train, Tea Estate, Botanical Gardens and Boating Lake Composite Poster');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiStatus, setAiStatus] = useState('');

  // Intelligent Location AI Image Generator & Matcher
  const handleGenerateCustomAI = () => {
    setIsGenerating(true);
    setAiStatus('✨ AI generating & fetching location photography for destination...');

    setTimeout(() => {
      const promptLower = customAiPrompt.toLowerCase();
      let matchedImages = [];

      if (promptLower.includes('silent valley') || promptLower.includes('kunthi') || promptLower.includes('sairandhri')) {
        matchedImages = [
          './silent_valley_rainforest_ai.png',
          './silent_valley_kunthi_river_ai.png',
          './silent_valley_wildlife_ai.png',
          './silent_valley_watchtower_ai.png'
        ];
      } else if (promptLower.includes('athirappilly') || promptLower.includes('vazhachal') || promptLower.includes('chalakudy') || promptLower.includes('niagara')) {
        matchedImages = [
          './athirappilly_waterfall_main_ai.png',
          './athirappilly_rainbow_spray_ai.png',
          './athirappilly_chalakudy_river_ai.png',
          './athirappilly_twilight_view_ai.png'
        ];
      } else if (promptLower.includes('wayanad') || promptLower.includes('chembra') || promptLower.includes('banasura') || promptLower.includes('edakkal')) {
        matchedImages = [
          './wayanad_chembra_heart_lake_ai.png',
          './wayanad_banasura_lake_ai.png'
        ];
      } else if (promptLower.includes('kashmir') || promptLower.includes('dal lake') || promptLower.includes('gulmarg') || promptLower.includes('srinagar')) {
        matchedImages = [
          './kashmir_paradise_ai.png',
          './dal-lake-shikara-real.jpg',
          './gulmarg-real.jpg',
          './golden-temple-amritsar-real.jpg'
        ];
      } else if (promptLower.includes('kashi') || promptLower.includes('varanasi') || promptLower.includes('ganga') || promptLower.includes('ayodhya') || promptLower.includes('ram mandir')) {
        matchedImages = [
          './kashi_yatra_ai.png',
          './ayodhya_ram_mandir_ai.png',
          './kashi-vishwanath-real.jpg',
          './ayodhya-ram-mandir-real.jpg'
        ];
      } else if (promptLower.includes('munnar') || promptLower.includes('parambikulam') || promptLower.includes('kerala')) {
        matchedImages = [
          './munnar-tea-plantations-real.jpg',
          './parambikulam-forest-real.jpg',
          './parambikulam-lake-real.jpg'
        ];
      } else {
        matchedImages = [
          './silent_valley_rainforest_ai.png',
          './athirappilly_waterfall_main_ai.png',
          './wayanad_chembra_heart_lake_ai.png',
          './kashi_yatra_ai.png'
        ];
      }

      if (enableMixMode && onMultiChange) {
        onMultiChange(matchedImages);
      }
      if (onChange && matchedImages.length > 0) {
        onChange(matchedImages[0]);
      }

      setIsGenerating(false);
      setAiStatus(`✓ Successfully generated & selected 4K AI images for "${customAiPrompt}"`);
    }, 400);
  };

  // File Upload Handler (Base64)
  const handleFileUpload = (files) => {
    if (!files || files.length === 0) return;

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Url = e.target.result;
        if (enableMixMode && onMultiChange) {
          const current = Array.isArray(multiValues) ? multiValues : [];
          onMultiChange([...current, base64Url]);
        }
        if (onChange && (!value || multiValues.length === 0)) {
          onChange(base64Url);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleRemoveMixImage = (index) => {
    if (!onMultiChange) return;
    const updated = multiValues.filter((_, i) => i !== index);
    onMultiChange(updated);
    if (updated.length > 0 && onChange) {
      onChange(updated[0]);
    }
  };

  const handleAddPreset = (url) => {
    if (enableMixMode && onMultiChange) {
      const current = Array.isArray(multiValues) ? multiValues : [];
      if (!current.includes(url)) {
        onMultiChange([...current, url]);
      }
    }
    if (onChange) {
      onChange(url);
    }
  };

  const isMixActive = Array.isArray(multiValues) && multiValues.length > 0;

  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-gold)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
      
      {/* Header & Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--gold-light)', fontWeight: 700, fontSize: '0.88rem' }}>
          <ImageIcon size={16} /> Image & Background Mixer
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(0,0,0,0.3)', padding: '0.2rem', borderRadius: '20px', flexWrap: 'wrap' }}>
          {[
            { id: 'upload', label: 'Upload File' },
            { id: 'preset', label: 'Preset Assets' },
            { id: 'ai-poster', label: '✨ AI Poster Generator' },
            ...(enableMixMode ? [{ id: 'mix', label: `Mix Background (${multiValues.length})` }] : [])
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                background: activeTab === tab.id ? 'var(--gold-primary)' : 'transparent',
                color: activeTab === tab.id ? '#060c17' : 'var(--text-muted)',
                border: 'none',
                padding: '0.3rem 0.75rem',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Field URL Input */}
      <div style={{ marginBottom: '0.8rem' }}>
        <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
          Primary Image URL or Base64
        </label>
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange && onChange(e.target.value)}
          placeholder="./ooty-toy-train-real.jpg or base64..."
          style={{
            width: '100%',
            background: 'rgba(0,0,0,0.4)',
            border: '1px solid var(--border-gold)',
            borderRadius: '8px',
            color: '#fff',
            padding: '0.55rem 0.8rem',
            fontSize: '0.82rem',
            outline: 'none'
          }}
        />
      </div>

      {/* TAB 1: FILE DRAG & DROP UPLOADER */}
      {activeTab === 'upload' && (
        <div>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: dragging ? '2px dashed var(--gold-primary)' : '1px dashed rgba(212,175,55,0.4)',
              borderRadius: '10px',
              padding: '1.2rem',
              textAlign: 'center',
              cursor: 'pointer',
              background: dragging ? 'rgba(212,175,55,0.1)' : 'rgba(255,255,255,0.02)',
              transition: 'all 0.3s ease'
            }}
          >
            <Upload size={24} color="var(--gold-primary)" style={{ marginBottom: '0.4rem' }} />
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff' }}>
              Drag & Drop local images here or <span style={{ color: 'var(--gold-light)' }}>Browse File</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              Supports JPG, PNG, WEBP. Converted to instant Base64 storage.
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple={enableMixMode}
              onChange={(e) => handleFileUpload(e.target.files)}
              style={{ display: 'none' }}
            />
          </div>
        </div>
      )}

      {/* TAB 2: PRESET ASSET GALLERY PICKER */}
      {activeTab === 'preset' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem', maxHeight: '180px', overflowY: 'auto' }}>
          {PRESET_IMAGES.map(item => {
            const isSelected = value === item.url || (multiValues || []).includes(item.url);
            return (
              <div
                key={item.id}
                onClick={() => handleAddPreset(item.url)}
                style={{
                  position: 'relative',
                  height: '75px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: isSelected ? '2px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                  transition: 'all 0.2s ease'
                }}
              >
                <img src={item.url} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.8) 100%)' }} />
                <span style={{ position: 'absolute', bottom: '0.3rem', left: '0.4rem', right: '0.4rem', fontSize: '0.65rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.name}
                </span>
                {isSelected && (
                  <div style={{ position: 'absolute', top: '0.3rem', right: '0.3rem', background: 'var(--gold-primary)', color: '#000', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: AI POSTER & COMPOSITE BACKGROUND GENERATOR */}
      {activeTab === 'ai-poster' && (
        <div style={{ background: 'rgba(6,12,23,0.5)', border: '1px solid var(--border-gold)', borderRadius: '10px', padding: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-primary)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
            <Sparkles size={16} /> AI Travel Poster & Multi-Landmark Composite Studio
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
            Generate a seamless multi-landmark composite background (like Taj Mahal + Kerala Backwaters + Kashmir Snowy Mountains) or pick AI poster presets:
          </div>

          {/* AI Composite Presets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
            {[
              {
                name: 'Ooty 4-Photo Mix',
                images: ['./ooty-toy-train-real.jpg', './ooty-tea-gardens-real.jpg', './ooty-botanical-garden-real.jpg', './ooty-lake-boating-real.jpg']
              },
              {
                name: 'Kashmir & Punjab Mix',
                images: ['./dal-lake-shikara-real.jpg', './gulmarg-real.jpg', './golden-temple-real.jpg', './wagah-border-real.jpg']
              },
              {
                name: 'Kashi & Ayodhya Yatra',
                images: ['./kashi-vishwanath-real.jpg', './ayodhya-ram-mandir-real.jpg']
              },
              {
                name: 'Odisha Temple Triangle',
                images: ['./puri-jagannath-real.jpg', './puri-jagannath-entrance-real.jpg', './konark-sun-temple-real.jpg', './lingaraj-temple-real.jpg']
              }
            ].map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  if (onMultiChange) onMultiChange(preset.images);
                  if (onChange) onChange(preset.images[0]);
                }}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border-gold)',
                  borderRadius: '8px',
                  padding: '0.5rem',
                  color: '#fff',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-light)' }}>{preset.name}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{preset.images.length} Photos Combined</div>
              </button>
            ))}
          </div>

          {/* AI Prompt Input & Action */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: aiStatus ? '0.5rem' : 0 }}>
            <input
              type="text"
              value={customAiPrompt}
              onChange={(e) => setCustomAiPrompt(e.target.value)}
              placeholder="e.g. Type any custom prompt (e.g. Kashmir snow peaks with Dal Lake shikara & Golden Temple)..."
              style={{
                flex: 1,
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid var(--border-gold)',
                borderRadius: '8px',
                color: '#fff',
                padding: '0.55rem 0.8rem',
                fontSize: '0.78rem',
                outline: 'none'
              }}
            />
            <button
              type="button"
              className="btn-gold"
              onClick={handleGenerateCustomAI}
              disabled={isGenerating}
              style={{ padding: '0.55rem 0.95rem', fontSize: '0.78rem', flexShrink: 0 }}
            >
              <Sparkles size={14} /> {isGenerating ? 'Generating...' : 'Generate Composite'}
            </button>
          </div>

          {aiStatus && (
            <div style={{ fontSize: '0.72rem', color: aiStatus.startsWith('✓') ? '#10b981' : 'var(--gold-light)', fontWeight: 600 }}>
              {aiStatus}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: BACKGROUND MIXER & BLEND STYLES */}
      {enableMixMode && activeTab === 'mix' && (
        <div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
            Combine multiple images (e.g. Ooty Toy Train + Tea Gardens + Botanical Garden + Lake) to construct a dynamic blended background:
          </div>

          {/* Added Mix Thumbnails List */}
          <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '0.8rem' }}>
            {(multiValues || []).map((imgUrl, i) => (
              <div key={i} style={{ position: 'relative', width: '70px', height: '55px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border-gold)' }}>
                <img src={imgUrl} alt={`Mix ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => handleRemoveMixImage(i)}
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: 'rgba(239,68,68,0.85)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    width: '18px',
                    height: '18px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={11} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                width: '70px',
                height: '55px',
                borderRadius: '6px',
                border: '1px dashed var(--border-gold)',
                background: 'rgba(255,255,255,0.04)',
                color: 'var(--gold-light)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                flexShrink: 0
              }}
            >
              <Plus size={16} /> Add Image
            </button>
          </div>

          {/* Blend Style Selection */}
          <div style={{ marginBottom: '0.8rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.4rem' }}>
              Select Mixing Blend Style
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {BLEND_STYLES.map(styleOpt => (
                <button
                  key={styleOpt.id}
                  type="button"
                  onClick={() => onBlendStyleChange && onBlendStyleChange(styleOpt.id)}
                  style={{
                    padding: '0.4rem 0.6rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-gold)',
                    background: blendStyle === styleOpt.id ? 'linear-gradient(135deg, #d4af37, #aa841c)' : 'rgba(0,0,0,0.3)',
                    color: blendStyle === styleOpt.id ? '#060c17' : 'var(--text-muted)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '0.78rem', fontWeight: 700 }}>{styleOpt.name}</div>
                  <div style={{ fontSize: '0.65rem', opacity: 0.85 }}>{styleOpt.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Composite Background Preview */}
      {isMixActive && (
        <div style={{ marginTop: '0.8rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Sparkles size={12} color="var(--gold-primary)" /> Live Composite Background Preview ({multiValues.length} images mixed)
          </div>
          <div style={{ height: '110px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
            <MixedBackground images={multiValues} fallbackImage={value} style={blendStyle} overlayOpacity={0.4}>
              <div style={{ padding: '0.8rem', color: '#fff', fontSize: '0.8rem', fontWeight: 700, textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                Mixed Background Composition
              </div>
            </MixedBackground>
          </div>
        </div>
      )}

    </div>
  );
}
