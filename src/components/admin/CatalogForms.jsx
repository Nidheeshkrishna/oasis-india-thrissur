import React, { useState } from 'react';
import { X, Package, Image as ImageIcon, BookOpen, Save, MonitorPlay } from 'lucide-react';
import { DESTINATIONS } from '../../data/destinationsData';
import ImageUploader from './ImageUploader';

export const fieldStyle = {
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

const labelStyle = {
  display: 'block',
  fontSize: '0.78rem',
  color: 'var(--text-muted)',
  marginBottom: '0.35rem',
  fontWeight: 600
};

export function AdminFormModal({ title, icon: Icon, onClose, children }) {
  return (
    <div className="modal-overlay" style={{ zIndex: 10002 }} onClick={onClose}>
      <div
        className="glass-card"
        style={{
          maxWidth: '660px',
          width: '100%',
          maxHeight: '88vh',
          overflowY: 'auto',
          padding: '1.8rem',
          background: '#081222',
          border: '1px solid var(--border-gold)',
          cursor: 'default'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem' }}>
          <h3 style={{ color: 'var(--gold-light)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'var(--font-heading)' }}>
            <Icon size={20} color="var(--gold-primary)" /> {title}
          </h3>
          <button
            onClick={onClose}
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

export function TourForm({ initial, onSave, onCancel }) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    subtitle: initial?.subtitle || '',
    destinationId: initial?.destinationId || DESTINATIONS[0]?.id || '',
    duration: initial?.duration || '5 Days / 4 Nights',
    price: initial?.price || '',
    originalPrice: initial?.originalPrice || '',
    badge: initial?.badge || 'New Launch',
    image: initial?.image || './kashi-vishwanath-real.jpg',
    bgMixImages: initial?.bgMixImages || [],
    bgMixStyle: initial?.bgMixStyle || 'collage-blend',
    mainPlaces: (initial?.mainPlaces || []).join(', '),
    included: (initial?.included || []).join('\n')
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      price: parseFloat(form.price) || 0,
      originalPrice: parseFloat(form.originalPrice) || 0,
      mainPlaces: form.mainPlaces.split(',').map(s => s.trim()).filter(Boolean),
      included: toList(form.included)
    });
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Tour Title *</label>
          <input style={fieldStyle} value={form.title} onChange={set('title')} required placeholder="e.g. Sacred North Yatra: Kashi, Ayodhya & Prayagraj" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Subtitle</label>
          <input style={fieldStyle} value={form.subtitle} onChange={set('subtitle')} placeholder="e.g. Thrissur Departure Special Pilgrimage Package" />
        </div>
        <div>
          <label style={labelStyle}>Linked Destination</label>
          <select style={fieldStyle} value={form.destinationId} onChange={set('destinationId')}>
            {DESTINATIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
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
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Badge</label>
          <input style={fieldStyle} value={form.badge} onChange={set('badge')} placeholder="Bestseller Pilgrimage" />
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
      </div>
      <FormActions onCancel={onCancel} />
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
          <select style={fieldStyle} value={form.category} onChange={set('category')}>
            {['Spiritual', 'Nature', 'Architecture', 'Heritage'].map(c => <option key={c}>{c}</option>)}
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
          <select style={fieldStyle} value={form.destinationId} onChange={handleDestinationChange} required>
            {DESTINATIONS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
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

export const FORM_ICONS = { Package, ImageIcon, BookOpen, MonitorPlay };
