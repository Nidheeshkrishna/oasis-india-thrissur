/**
 * CinematicButton.jsx
 * ─────────────────────────────────────────────────────────────
 * Ultra-premium interactive button with:
 *  - Magnetic cursor attraction (spring physics)
 *  - Scale + glow on hover
 *  - Ripple on click
 *  - Soft glow pulse (optional)
 *  - Smooth spring return on mouse leave
 * ─────────────────────────────────────────────────────────────
 */
import React, { useRef, useState, useCallback, useEffect } from 'react';

export default function CinematicButton({
  children,
  onClick,
  variant = 'gold',      // 'gold' | 'glass' | 'aurora' | 'outline'
  glow = true,
  pulse = false,
  magnetic = true,
  magneticStrength = 0.35,
  magneticRadius = 100,
  style = {},
  className = '',
  ...rest
}) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [ripples, setRipples] = useState([]);

  // ── Spring state for magnetic offset ─────────────────────────
  const offset = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });
  const raf = useRef(null);

  useEffect(() => {
    if (!magnetic) return;

    const onMove = (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < magneticRadius) {
        target.current = { x: dx * magneticStrength, y: dy * magneticStrength };
      } else {
        target.current = { x: 0, y: 0 };
      }
    };

    const loop = () => {
      const el = ref.current;
      if (!el) { raf.current = requestAnimationFrame(loop); return; }

      offset.current.x += (target.current.x - offset.current.x) * 0.13;
      offset.current.y += (target.current.y - offset.current.y) * 0.13;

      el.style.transform = `translate(${offset.current.x.toFixed(2)}px, ${offset.current.y.toFixed(2)}px)`;
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [magnetic, magneticStrength, magneticRadius]);

  // ── Ripple handler ───────────────────────────────────────────
  const handleClick = useCallback((e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    const id = Date.now();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    setRipples((prev) => [...prev, { id, x, y, size }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 700);

    if (onClick) onClick(e);
  }, [onClick]);

  // ── Variant styles ───────────────────────────────────────────
  const variants = {
    gold: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #e11d48 100%)',
      color: '#ffffff',
      border: 'none',
      boxShadow: hovered
        ? '0 12px 32px rgba(225,29,72,0.45), 0 0 30px rgba(245,158,11,0.2)'
        : '0 6px 18px rgba(225,29,72,0.3)',
    },
    glass: {
      background: 'rgba(255,255,255,0.06)',
      color: '#ffffff',
      border: '1px solid rgba(245,158,11,0.35)',
      backdropFilter: 'blur(16px)',
      boxShadow: hovered
        ? '0 12px 32px rgba(245,158,11,0.18), inset 0 0 20px rgba(245,158,11,0.05)'
        : '0 4px 16px rgba(0,0,0,0.3)',
    },
    aurora: {
      background: 'linear-gradient(135deg, #f59e0b, #e11d48, #8b5cf6)',
      backgroundSize: '200% 200%',
      animation: 'gradientShift 5s ease infinite',
      color: '#ffffff',
      border: 'none',
      boxShadow: hovered
        ? '0 12px 36px rgba(139,92,246,0.45), 0 0 40px rgba(225,29,72,0.25)'
        : '0 6px 22px rgba(139,92,246,0.3)',
    },
    outline: {
      background: 'transparent',
      color: 'rgba(245,158,11,0.9)',
      border: '1px solid rgba(245,158,11,0.5)',
      boxShadow: hovered
        ? '0 0 20px rgba(245,158,11,0.2), inset 0 0 20px rgba(245,158,11,0.04)'
        : 'none',
    },
  };

  const variantStyle = variants[variant] || variants.gold;

  return (
    <button
      ref={ref}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); target.current = { x: 0, y: 0 }; }}
      className={`btn-cinematic ${pulse ? 'btn-glow-pulse' : ''} ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        padding: '0.85rem 1.8rem',
        borderRadius: '50px',
        cursor: 'pointer',
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        willChange: 'transform',
        // Scale on hover — transform base from magnetic
        // The magnetic offset is applied directly on the element style
        transition: 'box-shadow 0.3s cubic-bezier(0.22, 1, 0.36, 1), filter 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        filter: hovered && glow
          ? 'brightness(1.08)'
          : 'brightness(1)',
        ...variantStyle,
        ...style,
      }}
      {...rest}
    >
      {/* Inner scale wrapper for hover pop */}
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          transform: hovered ? 'scale(1.04)' : 'scale(1)',
          transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
          pointerEvents: 'none',
        }}
      >
        {children}
      </span>

      {/* Shimmer sweep overlay */}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '-80%',
          width: '50%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)',
          transform: 'skewX(-20deg)',
          animation: hovered ? 'none' : 'btnShimmer 4s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Ripples */}
      {ripples.map(({ id, x, y, size }) => (
        <span
          key={id}
          className="ripple"
          aria-hidden="true"
          style={{
            position: 'absolute',
            borderRadius: '50%',
            width: size,
            height: size,
            left: x - size / 2,
            top: y - size / 2,
            background: 'rgba(255,255,255,0.22)',
            transform: 'scale(0)',
            animation: 'btnRipple 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards',
            pointerEvents: 'none',
          }}
        />
      ))}

      <style>{`
        @keyframes btnShimmer {
          0%   { left: -80%; }
          60%, 100% { left: 140%; }
        }
      `}</style>
    </button>
  );
}
