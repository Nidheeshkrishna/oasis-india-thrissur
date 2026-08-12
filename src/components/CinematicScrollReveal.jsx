/**
 * CinematicScrollReveal.jsx
 * ─────────────────────────────────────────────────────────────
 * A lightweight global controller that:
 *  1. Adds "is-visible" to any element with a reveal class
 *     when it enters the viewport (IntersectionObserver).
 *  2. Applies stagger delays to children of [data-stagger] parents.
 *  3. Wires up magnetic attraction for [data-magnetic] elements.
 *  4. Handles ripple effect on [data-ripple] buttons.
 *  5. Provides card glare tracking for .card-cinematic elements.
 *
 * Usage: Mount once at the root level inside <App> AFTER the
 * main content renders.  It uses no visual output itself.
 * ─────────────────────────────────────────────────────────────
 */
import { useEffect } from 'react';

// ─── REVEAL CLASSES ──────────────────────────────────────────
const REVEAL_CLASSES = [
  '.reveal',
  '.reveal-left',
  '.reveal-right',
  '.reveal-image',
  '.reveal-card',
  '.mask-reveal',
  '.cta-reveal',
  '.footer-cinematic',
  '.text-reveal-line',
  '.word-fade',
];

// ─── STAGGER DELAY COMPUTATION ───────────────────────────────
function applyStagger(container) {
  const step = parseFloat(container.dataset.stagger) || 0.1;
  const base = parseFloat(container.dataset.staggerBase) || 0;
  const children = container.querySelectorAll(':scope > *');
  children.forEach((child, i) => {
    child.style.transitionDelay = `${base + i * step}s`;
  });
}

// ─── MAGNETIC BUTTON LOGIC ───────────────────────────────────
function initMagnetic(el) {
  const strength = parseFloat(el.dataset.magneticStrength) || 0.38;
  const radius = parseFloat(el.dataset.magneticRadius) || 90;

  let raf = null;
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };

  const onMove = (e) => {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.hypot(dx, dy);

    if (dist < radius) {
      target.x = dx * strength;
      target.y = dy * strength;
    } else {
      target.x = 0;
      target.y = 0;
    }
  };

  const loop = () => {
    current.x += (target.x - current.x) * 0.14;
    current.y += (target.y - current.y) * 0.14;
    el.style.transform = `translate(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px)`;
    raf = requestAnimationFrame(loop);
  };

  const onLeave = () => {
    target.x = 0;
    target.y = 0;
  };

  window.addEventListener('mousemove', onMove, { passive: true });
  el.addEventListener('mouseleave', onLeave);
  raf = requestAnimationFrame(loop);

  return () => {
    window.removeEventListener('mousemove', onMove);
    el.removeEventListener('mouseleave', onLeave);
    cancelAnimationFrame(raf);
  };
}

// ─── RIPPLE EFFECT ───────────────────────────────────────────
function initRipple(el) {
  const onClick = (e) => {
    const rect = el.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${e.clientX - rect.left - size / 2}px;
      top: ${e.clientY - rect.top - size / 2}px;
    `;
    el.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  };

  el.addEventListener('click', onClick);
  return () => el.removeEventListener('click', onClick);
}

// ─── CARD GLARE TRACKING ─────────────────────────────────────
function initCardGlare(el) {
  const glare = el.querySelector('.card-glare');
  if (!glare) return () => {};

  const onMove = (e) => {
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    glare.style.background = `
      radial-gradient(circle at ${x}% ${y}%,
        rgba(255,255,255,0.1) 0%,
        rgba(255,255,255,0) 70%)
    `;
  };

  el.addEventListener('mousemove', onMove);
  return () => el.removeEventListener('mousemove', onMove);
}

// ─── WORD STAGGER SETUP ──────────────────────────────────────
function wrapWordsInSpans(el) {
  if (el.dataset.wordWrapped) return;
  el.dataset.wordWrapped = '1';
  const text = el.textContent;
  el.innerHTML = text
    .split(' ')
    .map((word, i) => `<span style="transition-delay:${(i * 0.07).toFixed(2)}s">${word}</span>`)
    .join(' ');
}

// ─── MAIN COMPONENT ──────────────────────────────────────────
export default function CinematicScrollReveal() {
  useEffect(() => {
    const cleanups = [];

    // ── 1. Intersection Observer for reveal classes ──────────
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    const revealEls = document.querySelectorAll(REVEAL_CLASSES.join(','));
    revealEls.forEach((el) => observer.observe(el));

    // ── 2. Stagger children ──────────────────────────────────
    document.querySelectorAll('[data-stagger]').forEach(applyStagger);

    // ── 3. Word-fade setup ───────────────────────────────────
    document.querySelectorAll('.word-fade').forEach(wrapWordsInSpans);

    // ── 4. Magnetic buttons ──────────────────────────────────
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      cleanups.push(initMagnetic(el));
    });

    // ── 5. Ripple buttons ─────────────────────────────────────
    document.querySelectorAll('[data-ripple]').forEach((el) => {
      cleanups.push(initRipple(el));
    });

    // ── 6. Card glare ────────────────────────────────────────
    document.querySelectorAll('.card-cinematic').forEach((el) => {
      cleanups.push(initCardGlare(el));
    });

    // ── 7. MutationObserver — watch for dynamically added elements ──
    const mutObs = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (node.nodeType !== 1) return;

          // Re-observe reveal elements
          REVEAL_CLASSES.forEach((cls) => {
            if (node.matches(cls)) observer.observe(node);
            node.querySelectorAll(cls).forEach((el) => observer.observe(el));
          });

          // New stagger containers
          if (node.matches('[data-stagger]')) applyStagger(node);
          node.querySelectorAll('[data-stagger]').forEach(applyStagger);

          // New magnetics
          [node, ...node.querySelectorAll('[data-magnetic]')].forEach((el) => {
            if (el.dataset?.magnetic !== undefined) {
              cleanups.push(initMagnetic(el));
            }
          });

          // New ripples
          [node, ...node.querySelectorAll('[data-ripple]')].forEach((el) => {
            if (el.dataset?.ripple !== undefined) {
              cleanups.push(initRipple(el));
            }
          });

          // New card glares
          [node, ...node.querySelectorAll('.card-cinematic')].forEach((el) => {
            if (el.classList?.contains('card-cinematic')) {
              cleanups.push(initCardGlare(el));
            }
          });

          // New word-fades
          node.querySelectorAll('.word-fade').forEach(wrapWordsInSpans);
        });
      });
    });

    mutObs.observe(document.body, { childList: true, subtree: true });
    cleanups.push(() => mutObs.disconnect());

    return () => {
      observer.disconnect();
      cleanups.forEach((fn) => { if (typeof fn === 'function') fn(); });
    };
  }, []);

  // Purely functional — no visual output
  return null;
}
