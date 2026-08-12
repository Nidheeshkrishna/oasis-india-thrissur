import React, { useEffect, useRef, useState } from 'react';
import { Users, MapPin, Award, Star } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

function Counter({ target, suffix, decimal, active }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const duration = 1800;
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(parseFloat((target * eased).toFixed(decimal ?? 0)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, decimal]);

  return (
    <>
      {value.toLocaleString('en-IN')}{suffix}
    </>
  );
}

export default function StatsBand() {
  const { t } = useLanguage();
  const STATS = [
    { icon: MapPin, value: 15, suffix: '+', label: t('stats.curatedDestinations'), color: '#f59e0b', glow: 'rgba(245,158,11,0.35)' },
    { icon: Users, value: 5000, suffix: '+', label: t('stats.happyTravelers'), color: '#e11d48', glow: 'rgba(225,29,72,0.35)' },
    { icon: Award, value: 25, suffix: '+', label: t('stats.yearsExperience'), color: '#8b5cf6', glow: 'rgba(139,92,246,0.35)' },
    { icon: Star, value: 4.9, suffix: '★', label: t('stats.averageRating'), color: '#0891b2', glow: 'rgba(8,145,178,0.35)', decimal: 1 }
  ];
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setActive(true);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section style={{ padding: 'clamp(3rem, 5vw, 4rem) 0', position: 'relative', overflow: 'hidden' }} ref={ref}>
      <div className="orb" style={{ width: '300px', height: '300px', background: 'var(--indigo)', top: '-120px', left: '30%' }} />
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className="glass-card"
              style={{
                padding: '1.8rem 1rem',
                textAlign: 'center',
                animation: `slideUpFade 0.7s ease-out ${i * 0.1}s both`
              }}
            >
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, #ffffff, ${s.color})`,
                boxShadow: `0 10px 22px ${s.glow}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                border: '3px solid #ffffff'
              }}>
                <s.icon size={26} color="#ffffff" strokeWidth={2} />
              </div>
              <div style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                fontFamily: 'var(--font-heading)',
                background: 'linear-gradient(135deg, #8a5d00, #d4a017, #f59e0b)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                <Counter target={s.value} suffix={s.suffix} decimal={s.decimal} active={active} />
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
