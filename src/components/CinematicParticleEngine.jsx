/**
 * CinematicParticleEngine.jsx
 * ─────────────────────────────────────────────────────────────
 * Ultra-premium ambient particle system drawn on a transparent
 * canvas overlay. Zero DOM overhead. 60 FPS via rAF.
 *
 * Features:
 *  - Floating dust particles with random drift & fade
 *  - Slow-moving luminous light beams
 *  - Volumetric fog tendrils
 *  - All tied to a single canvas layer behind content
 * ─────────────────────────────────────────────────────────────
 */
import { useEffect, useRef } from 'react';

// ─── CONFIG ──────────────────────────────────────────────────
const PARTICLE_COUNT = 55;        // dust particles
const BEAM_COUNT = 4;             // volumetric beams
const FOG_COUNT = 6;              // fog tendrils

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

// ─── PARTICLE FACTORY ────────────────────────────────────────
function makeParticle(w, h) {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    size: randomBetween(0.8, 2.4),
    speedX: randomBetween(-0.18, 0.18),
    speedY: randomBetween(-0.35, -0.08),
    opacity: randomBetween(0.08, 0.38),
    opacityDir: Math.random() < 0.5 ? 1 : -1,
    opacitySpeed: randomBetween(0.002, 0.006),
    color: Math.random() < 0.6
      ? `rgba(245,158,11,`         // gold
      : Math.random() < 0.5
        ? `rgba(139,92,246,`       // violet
        : `rgba(255,255,255,`,    // white
  };
}

// ─── BEAM FACTORY ────────────────────────────────────────────
function makeBeam(w, h) {
  return {
    x: randomBetween(w * 0.1, w * 0.9),
    width: randomBetween(60, 160),
    height: h * randomBetween(0.5, 0.9),
    opacity: randomBetween(0.012, 0.045),
    opacityDir: 1,
    opacitySpeed: randomBetween(0.0003, 0.0008),
    angle: randomBetween(-0.12, 0.12),
    driftX: randomBetween(-0.04, 0.04),
    color: Math.random() < 0.5
      ? '245,158,11'    // gold
      : '139,92,246',  // violet
  };
}

// ─── FOG FACTORY ─────────────────────────────────────────────
function makeFog(w, h) {
  return {
    x: randomBetween(-200, w + 200),
    y: randomBetween(h * 0.3, h),
    rx: randomBetween(150, 350),
    ry: randomBetween(60, 140),
    opacity: randomBetween(0.018, 0.055),
    opacityDir: Math.random() < 0.5 ? 1 : -1,
    opacitySpeed: randomBetween(0.0002, 0.0006),
    driftX: randomBetween(-0.07, 0.07),
    driftY: randomBetween(-0.02, 0.02),
    color: Math.random() < 0.5
      ? '8,145,178'     // cyan
      : '139,92,246',  // violet
  };
}

// ─── COMPONENT ───────────────────────────────────────────────
export default function CinematicParticleEngine({
  style = {},
  zIndex = 0,
  fixed = false,
}) {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = fixed ? window.innerWidth : canvas.offsetWidth;
      canvas.height = fixed ? window.innerHeight : canvas.offsetHeight;
    };
    resize();

    const w = () => canvas.width;
    const h = () => canvas.height;

    // Initialise all elements
    stateRef.current = {
      particles: Array.from({ length: PARTICLE_COUNT }, () => makeParticle(w(), h())),
      beams: Array.from({ length: BEAM_COUNT }, () => makeBeam(w(), h())),
      fogs: Array.from({ length: FOG_COUNT }, () => makeFog(w(), h())),
    };

    const ro = new ResizeObserver(() => {
      resize();
      stateRef.current.particles = Array.from({ length: PARTICLE_COUNT }, () => makeParticle(w(), h()));
      stateRef.current.beams = Array.from({ length: BEAM_COUNT }, () => makeBeam(w(), h()));
      stateRef.current.fogs = Array.from({ length: FOG_COUNT }, () => makeFog(w(), h()));
    });
    ro.observe(canvas);

    // ─── RENDER LOOP ─────────────────────────────────────────
    const draw = () => {
      const state = stateRef.current;
      if (!state) return;

      ctx.clearRect(0, 0, w(), h());

      // ── Draw light beams ──────────────────────────────────
      state.beams.forEach(beam => {
        beam.x += beam.driftX;
        if (beam.x < -beam.width) beam.x = w() + beam.width;
        if (beam.x > w() + beam.width) beam.x = -beam.width;

        beam.opacity += beam.opacitySpeed * beam.opacityDir;
        if (beam.opacity > 0.05) { beam.opacity = 0.05; beam.opacityDir = -1; }
        if (beam.opacity < 0.005) { beam.opacity = 0.005; beam.opacityDir = 1; }

        ctx.save();
        ctx.translate(beam.x, -beam.height * 0.1);
        ctx.rotate(beam.angle);

        const grad = ctx.createLinearGradient(0, 0, 0, beam.height);
        grad.addColorStop(0, `rgba(${beam.color},${beam.opacity})`);
        grad.addColorStop(0.5, `rgba(${beam.color},${beam.opacity * 0.5})`);
        grad.addColorStop(1, `rgba(${beam.color},0)`);

        ctx.fillStyle = grad;
        ctx.fillRect(-beam.width / 2, 0, beam.width, beam.height);
        ctx.restore();
      });

      // ── Draw fog tendrils ─────────────────────────────────
      state.fogs.forEach(fog => {
        fog.x += fog.driftX;
        fog.y += fog.driftY;
        fog.opacity += fog.opacitySpeed * fog.opacityDir;

        if (fog.opacity > 0.06) { fog.opacity = 0.06; fog.opacityDir = -1; }
        if (fog.opacity < 0.01) { fog.opacity = 0.01; fog.opacityDir = 1; }

        // Wrap
        if (fog.x < -fog.rx * 2) fog.x = w() + fog.rx;
        if (fog.x > w() + fog.rx * 2) fog.x = -fog.rx;
        if (fog.y < 0) fog.y = h();
        if (fog.y > h() + fog.ry) fog.y = 0;

        const grad = ctx.createRadialGradient(fog.x, fog.y, 0, fog.x, fog.y, fog.rx);
        grad.addColorStop(0, `rgba(${fog.color},${fog.opacity})`);
        grad.addColorStop(1, `rgba(${fog.color},0)`);

        ctx.save();
        ctx.scale(1, fog.ry / fog.rx);
        ctx.beginPath();
        ctx.arc(fog.x, fog.y * (fog.rx / fog.ry), fog.rx, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });

      // ── Draw floating dust particles ──────────────────────
      state.particles.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.opacity += p.opacitySpeed * p.opacityDir;

        if (p.opacity > 0.42) { p.opacity = 0.42; p.opacityDir = -1; }
        if (p.opacity < 0.04) { p.opacity = 0.04; p.opacityDir = 1; }

        // Respawn at bottom when drifted above canvas
        if (p.y < -p.size * 2) {
          p.y = h() + p.size;
          p.x = Math.random() * w();
          p.opacity = randomBetween(0.04, 0.15);
        }
        if (p.x < -p.size * 2) p.x = w() + p.size;
        if (p.x > w() + p.size * 2) p.x = -p.size;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.opacity})`;
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    const onResize = () => resize();
    if (fixed) window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      if (fixed) window.removeEventListener('resize', onResize);
    };
  }, [fixed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: fixed ? 'fixed' : 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex,
        ...style,
      }}
    />
  );
}
