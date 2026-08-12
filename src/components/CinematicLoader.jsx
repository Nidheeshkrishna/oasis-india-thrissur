/**
 * CinematicLoader.jsx
 * ─────────────────────────────────────────────────────────────
 * Ultra-premium 3-second cinematic page loader.
 *
 * Phase timeline:
 *   0.0 – 0.8s  → black screen, ambient glow blooms
 *   0.8 – 2.0s  → particles appear + loading line draws
 *   2.0 – 2.7s  → blur dissolve transition begins
 *   2.7 – 3.0s  → full cinematic reveal, loader exits
 * ─────────────────────────────────────────────────────────────
 */
import React, { useEffect, useState } from 'react';
import { useCinematicLoader } from '../hooks/useCinematicAnimations';
import CinematicParticleEngine from './CinematicParticleEngine';

export default function CinematicLoader({ onComplete }) {
  const { phase, progress, done } = useCinematicLoader(3000);
  const [exiting, setExiting] = useState(false);
  const [removed, setRemoved] = useState(false);

  // Trigger exit sequence when loader is done
  useEffect(() => {
    if (done && !exiting) {
      setExiting(true);
      const t = setTimeout(() => {
        setRemoved(true);
        if (onComplete) onComplete();
      }, 900); // exit animation duration
      return () => clearTimeout(t);
    }
  }, [done, exiting, onComplete]);

  if (removed) return null;

  // Line progress: starts at 0, fills to 100% over phase 1–2
  const lineProgress = phase >= 1 ? Math.min(((progress - 0.27) / 0.4) * 100, 100) : 0;

  // Overall container opacity — fade out on exit
  const containerOpacity = exiting ? 0 : 1;
  const containerBlur = exiting ? 'blur(20px)' : 'blur(0px)';
  const containerScale = exiting ? 1.04 : 1;

  return (
    <div
      aria-label="Loading"
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        background: '#000000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        // As soon as we start exiting, stop intercepting any pointer events
        // so UI beneath (navbar, language switcher, etc.) is immediately usable.
        pointerEvents: exiting ? 'none' : 'all',
        // Exit transition
        opacity: containerOpacity,
        filter: containerBlur,
        transform: `scale(${containerScale})`,
        transition: exiting
          ? 'opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1), filter 0.9s cubic-bezier(0.22, 1, 0.36, 1), transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)'
          : 'none',
      }}
    >
      {/* ── Ambient glow bloom ─────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.06), transparent 60%),
            radial-gradient(ellipse at 25% 70%, rgba(139,92,246,0.05), transparent 50%),
            radial-gradient(ellipse at 75% 30%, rgba(8,145,178,0.04), transparent 50%)
          `,
          opacity: phase >= 0 ? 1 : 0,
          transition: 'opacity 1.2s cubic-bezier(0.22, 1, 0.36, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Centre glow orb ────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
          opacity: phase >= 0 ? 1 : 0,
          transform: phase >= 1 ? 'scale(1.3)' : 'scale(0.8)',
          transition: 'opacity 1.5s ease, transform 2.5s cubic-bezier(0.22, 1, 0.36, 1)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Floating ambient particles ─────────────────────── */}
      {phase >= 1 && (
        <CinematicParticleEngine
          fixed
          zIndex={1}
          style={{ opacity: Math.min((progress - 0.27) / 0.2, 1) }}
        />
      )}

      {/* ── Central content ────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem',
        }}
      >
        {/* Monogram / brand placeholder ring */}
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            border: '1.5px solid rgba(245,158,11,0.35)',
            background: 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: phase >= 0 ? 1 : 0,
            transform: phase >= 1 ? 'scale(1)' : 'scale(0.85)',
            transition: 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1.4s cubic-bezier(0.22, 1, 0.36, 1)',
            boxShadow: '0 0 28px rgba(245,158,11,0.12), inset 0 0 20px rgba(245,158,11,0.04)',
            animation: phase >= 1 ? 'loaderRingPulse 3s ease-in-out infinite' : 'none',
          }}
        >
          {/* Inner dot */}
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'rgba(245,158,11,0.7)',
              boxShadow: '0 0 10px rgba(245,158,11,0.5)',
              animation: phase >= 1 ? 'loaderDotPulse 2s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        {/* Loading progress line */}
        <div
          style={{
            width: '220px',
            height: '1px',
            background: 'rgba(255,255,255,0.08)',
            borderRadius: '2px',
            overflow: 'hidden',
            opacity: phase >= 1 ? 1 : 0,
            transition: 'opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${lineProgress}%`,
              background: 'linear-gradient(90deg, rgba(245,158,11,0.4), rgba(245,158,11,0.9), rgba(255,255,255,0.6))',
              borderRadius: '2px',
              boxShadow: '0 0 12px rgba(245,158,11,0.4)',
              transition: 'width 0.05s linear',
            }}
          />
        </div>

        {/* Subtle status text */}
        <p
          style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.65rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(245,158,11,0.45)',
            margin: 0,
            opacity: phase >= 1 ? 1 : 0,
            transform: phase >= 1 ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 1s cubic-bezier(0.22, 1, 0.36, 1), transform 1s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          {phase < 2 ? 'Preparing Experience' : 'Entering'}
        </p>
      </div>

      {/* ── Keyframe styles ────────────────────────────────── */}
      <style>{`
        @keyframes loaderRingPulse {
          0%, 100% { box-shadow: 0 0 28px rgba(245,158,11,0.12), inset 0 0 20px rgba(245,158,11,0.04); }
          50%       { box-shadow: 0 0 48px rgba(245,158,11,0.22), inset 0 0 32px rgba(245,158,11,0.08); }
        }
        @keyframes loaderDotPulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </div>
  );
}
