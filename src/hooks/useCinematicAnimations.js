/**
 * useCinematicAnimations.js
 * ─────────────────────────────────────────────────────────────
 * Ultra-premium cinematic animation engine for luxury landing pages.
 * Provides: loader sequencing, mouse parallax, scroll-inertia,
 * magnetic buttons, spring physics, and viewport reveal detection.
 * ─────────────────────────────────────────────────────────────
 */
import { useEffect, useRef, useState, useCallback } from 'react';

// ─── EASING FUNCTIONS ────────────────────────────────────────
export const ease = {
  /** Luxury cubic-bezier — elegant deceleration */
  luxury: (t) => 1 - Math.pow(1 - t, 4),
  /** Spring-like overshoot for micro-interactions */
  spring: (t) => 1 - Math.cos(t * Math.PI * 0.5) * Math.exp(-t * 4),
  /** Silky easeInOut */
  silk: (t) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  /** Cinematic power ease */
  cinematic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

// ─── LOADER SEQUENCE HOOK ────────────────────────────────────
/**
 * Manages the 3-phase loader:
 *   phase 0 → glow + particles appear (0–0.8s)
 *   phase 1 → loading line expands (0.8–2s)
 *   phase 2 → cinematic blur/fade reveal (2–3s)
 *   phase 3 → loader complete, content visible
 */
export function useCinematicLoader(totalMs = 3000) {
  const [phase, setPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const phases = [
      { until: 0.27, id: 0 },  // ambient glow + particles
      { until: 0.67, id: 1 },  // line expand
      { until: 0.90, id: 2 },  // blur dissolve
      { until: 1.00, id: 3 },  // final reveal
    ];

    let raf;
    const start = performance.now();

    const tick = (now) => {
      const raw = Math.min((now - start) / totalMs, 1);
      const eased = ease.luxury(raw);
      setProgress(eased);

      const current = phases.find(p => eased <= p.until) || phases[phases.length - 1];
      setPhase(current.id);

      if (raw < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setDone(true);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [totalMs]);

  return { phase, progress, done };
}

// ─── SMOOTH MOUSE PARALLAX HOOK ──────────────────────────────
/**
 * Returns normalised mouse position {x, y} in [-1, 1]
 * with configurable lag for buttery-smooth parallax depth.
 */
export function useMouseParallax(lag = 0.06) {
  const mouse = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const raf = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const loop = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * lag;
      smooth.current.y += (mouse.current.y - smooth.current.y) * lag;
      setPos({ x: smooth.current.x, y: smooth.current.y });
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf.current);
    };
  }, [lag]);

  return pos;
}

// ─── INERTIA SCROLL HOOK ─────────────────────────────────────
/**
 * Returns a smoothed scroll position with configurable inertia.
 * Use it to drive parallax offsets without jitter.
 */
export function useInertiaScroll(friction = 0.12) {
  const target = useRef(0);
  const current = useRef(0);
  const raf = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      target.current = window.scrollY;
    };

    const loop = () => {
      current.current += (target.current - current.current) * friction;
      setScrollY(current.current);
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf.current);
    };
  }, [friction]);

  return scrollY;
}

// ─── SPRING PHYSICS HOOK ─────────────────────────────────────
/**
 * Animates a value toward a target using spring physics.
 * const val = useSpring(targetNumber, { stiffness, damping })
 */
export function useSpring(target, { stiffness = 200, damping = 24 } = {}) {
  const pos = useRef(target);
  const vel = useRef(0);
  const raf = useRef(null);
  const [value, setValue] = useState(target);

  useEffect(() => {
    const dt = 1 / 60;

    const loop = () => {
      const force = stiffness * (target - pos.current);
      const damped = damping * vel.current;
      vel.current += (force - damped) * dt;
      pos.current += vel.current * dt;

      const diff = Math.abs(pos.current - target);
      if (diff > 0.001 || Math.abs(vel.current) > 0.001) {
        setValue(pos.current);
        raf.current = requestAnimationFrame(loop);
      } else {
        pos.current = target;
        setValue(target);
      }
    };

    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, [target, stiffness, damping]);

  return value;
}

// ─── MAGNETIC ELEMENT HOOK ───────────────────────────────────
/**
 * Attaches magnetic attraction to a ref element.
 * Returns { ref, style } — spread style on the element.
 */
export function useMagnetic(strength = 0.4, radius = 80) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const raf = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        target.current = { x: dx * strength, y: dy * strength };
      } else {
        target.current = { x: 0, y: 0 };
      }
    };

    const onLeave = () => { target.current = { x: 0, y: 0 }; };

    const loop = () => {
      current.current.x += (target.current.x - current.current.x) * 0.15;
      current.current.y += (target.current.y - current.current.y) * 0.15;
      setOffset({ x: current.current.x, y: current.current.y });
      raf.current = requestAnimationFrame(loop);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    el.addEventListener('mouseleave', onLeave);
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMove);
      if (el) el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [strength, radius]);

  return {
    ref,
    style: {
      transform: `translate(${offset.x}px, ${offset.y}px)`,
      transition: 'transform 0.1s cubic-bezier(0.22, 1, 0.36, 1)',
      willChange: 'transform',
    },
  };
}

// ─── VIEWPORT REVEAL HOOK ────────────────────────────────────
/**
 * Fires once when element enters the viewport.
 * Returns { ref, visible } — attach ref to your element.
 */
export function useReveal(threshold = 0.15, rootMargin = '0px 0px -60px 0px') {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin]);

  return { ref, visible };
}

// ─── CARD 3D TILT HOOK ───────────────────────────────────────
/**
 * Returns event handlers and inline style for a 3D-tilt card.
 * <div {...tilt.handlers} style={{...tilt.style}}>
 */
export function useCardTilt(maxTilt = 12, perspective = 900) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, glow: false });

  const handlers = {
    onMouseMove: useCallback((e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / (rect.height / 2)) * -maxTilt;
      const ry = ((e.clientX - cx) / (rect.width / 2)) * maxTilt;
      setTilt({ x: rx, y: ry, glow: true });
    }, [maxTilt]),
    onMouseLeave: useCallback(() => {
      setTilt({ x: 0, y: 0, glow: false });
    }, []),
  };

  const style = {
    transform: `perspective(${perspective}px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(0)`,
    transition: tilt.glow
      ? 'transform 0.1s cubic-bezier(0.22, 1, 0.36, 1)'
      : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
    willChange: 'transform',
  };

  return { handlers, style, isHovered: tilt.glow };
}

// ─── SCROLL-DRIVEN PARALLAX TRANSFORM ────────────────────────
/**
 * Given a scrollY value and layer config, returns a CSS transform string.
 * layer: { speed (0-1), direction: 'y'|'x', offset }
 */
export function parallaxTransform(scrollY, { speed = 0.3, direction = 'y', offset = 0 } = {}) {
  const shift = scrollY * speed + offset;
  return direction === 'y'
    ? `translateY(${shift}px)`
    : `translateX(${shift}px)`;
}

// ─── COUNTER ANIMATION HOOK ──────────────────────────────────
/**
 * Animates a number from 0 to target when active.
 * Includes ease-out with a subtle bounce at completion.
 */
export function useCounterAnimation(target, active, duration = 2000, decimals = 0) {
  const [value, setValue] = useState(0);
  const [bounced, setBounced] = useState(false);

  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();

    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = ease.luxury(p);
      setValue(parseFloat((target * eased).toFixed(decimals)));

      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setValue(target);
        setBounced(true);
        setTimeout(() => setBounced(false), 400);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, decimals]);

  return { value, bounced };
}

// ─── BLUR REVEAL STYLE HELPER ────────────────────────────────
/**
 * Returns inline style for a blur+opacity+translateY reveal.
 * Pass visible=false for initial state, true for revealed.
 */
export function blurRevealStyle(visible, {
  delay = 0,
  duration = 0.9,
  translateY = 28,
  blur = 12,
} = {}) {
  return {
    opacity: visible ? 1 : 0,
    filter: visible ? 'blur(0px)' : `blur(${blur}px)`,
    transform: visible ? 'translateY(0)' : `translateY(${translateY}px)`,
    transition: `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s,
                 filter ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s,
                 transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
    willChange: 'opacity, filter, transform',
  };
}

// ─── IMAGE SCALE REVEAL STYLE ────────────────────────────────
/**
 * Ken Burns + scale-from-1.05 reveal helper.
 */
export function imageRevealStyle(visible, { delay = 0, duration = 1.1 } = {}) {
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'scale(1)' : 'scale(1.05)',
    transition: `opacity ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s,
                 transform ${duration}s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
    willChange: 'opacity, transform',
  };
}

// ─── STAGGER DELAY HELPER ────────────────────────────────────
/** Returns a delay in seconds for staggered children. */
export const staggerDelay = (index, base = 0, step = 0.1) =>
  base + index * step;
