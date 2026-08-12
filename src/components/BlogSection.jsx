import React, { useState } from 'react';
import { BookOpen, CalendarDays, User, ArrowUpRight } from 'lucide-react';
import { catalogService } from '../services/catalog';
import { useCatalog } from '../hooks/useCatalog';
import { useLanguage } from '../i18n/LanguageContext';

export default function BlogSection() {
  const { t } = useLanguage();
  const blogs = useCatalog(catalogService.getBlogs);
  const [selected, setSelected] = useState(null);

  if (blogs.length === 0) return null;

  return (
    <section id="travel-stories" style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', position: 'relative', overflow: 'hidden' }}>
      <div className="orb" style={{ width: '340px', height: '340px', background: 'var(--pink)', top: '-100px', right: '-80px' }} />
      <div className="orb" style={{ width: '300px', height: '300px', background: 'var(--saffron)', bottom: '-80px', left: '-100px', animationDelay: '-6s' }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 2.5rem' }}>
          <span className="badge-aurora" style={{ marginBottom: '0.8rem' }}>
            <BookOpen size={14} /> {t('blog.badge')}
          </span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.8rem' }}>
            {t('blog.title')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
            {t('blog.subtitle')}
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.8rem' }}>
          {blogs.map((b, i) => (
            <div
              key={b.id}
              className="glass-card"
              style={{ overflow: 'hidden', cursor: 'pointer', animation: `slideUpFade 0.6s ease-out ${i * 0.08}s both` }}
              onClick={() => setSelected(b)}
            >
              <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                <img src={b.image} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(180deg, rgba(6,12,23,0.05) 0%, rgba(6,12,23,0.65) 100%)'
                }} />
                <span style={{
                  position: 'absolute', top: '0.8rem', left: '0.8rem',
                  background: 'linear-gradient(135deg, #f59e0b, #e11d48)',
                  color: '#fff', fontSize: '0.72rem', fontWeight: 800,
                  padding: '0.3rem 0.8rem', borderRadius: '20px',
                  letterSpacing: '0.04em', textTransform: 'uppercase'
                }}>
                  {b.tag}
                </span>
                <div style={{
                  position: 'absolute', bottom: '0.8rem', left: '0.8rem', right: '0.8rem',
                  display: 'flex', gap: '1rem', color: 'rgba(255,255,255,0.85)', fontSize: '0.75rem', fontWeight: 600
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <User size={12} /> {b.author}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CalendarDays size={12} /> {b.createdAt}
                  </span>
                </div>
              </div>
              <div style={{ padding: '1.4rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  {b.title}
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                  {b.excerpt}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--gold-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                  {t('blog.readMore')} <ArrowUpRight size={16} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="modal-overlay" style={{ zIndex: 10000 }} onClick={() => setSelected(null)}>
          <div
            className="glass-card"
            style={{ maxWidth: '760px', width: '100%', maxHeight: '90vh', overflowY: 'auto', padding: 0, background: '#081222', border: '1px solid var(--border-gold)', cursor: 'default' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative', height: '240px' }}>
              <img src={selected.image} alt={selected.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,12,23,0.1), rgba(6,12,23,0.85))' }} />
              <span style={{
                position: 'absolute', top: '1rem', left: '1rem',
                background: 'linear-gradient(135deg, #f59e0b, #e11d48)',
                color: '#fff', fontSize: '0.72rem', fontWeight: 800,
                padding: '0.3rem 0.8rem', borderRadius: '20px', textTransform: 'uppercase'
              }}>
                {selected.tag}
              </span>
            </div>
            <div style={{ padding: '1.8rem' }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--gold-light)', fontFamily: 'var(--font-heading)', marginBottom: '0.6rem' }}>
                {selected.title}
              </h2>
              <div style={{ display: 'flex', gap: '1.2rem', color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><User size={14} color="var(--gold-primary)" /> {selected.author}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><CalendarDays size={14} color="var(--gold-primary)" /> {selected.createdAt}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><BookOpen size={14} color="var(--gold-primary)" /> {selected.category}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: '1rem', lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {selected.content}
              </p>
              <div style={{ marginTop: '1.8rem', textAlign: 'right' }}>
                <button className="btn-gold" onClick={() => setSelected(null)} style={{ padding: '0.6rem 1.6rem' }}>
                  {t('blog.close')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
