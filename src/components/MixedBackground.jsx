import React, { useState, useEffect } from 'react';

/**
 * MixedBackground Component
 * Renders dynamic composite multi-image background mixtures (e.g. Ooty Toy Train + Tea Estate + Botanical Garden + Lake)
 * Supports styles: 'collage-blend', 'split-grid', 'fade-slide', 'layered-soft'
 */
export default function MixedBackground({
  images = [],
  fallbackImage = '',
  style = 'collage-blend',
  overlayOpacity = 0.5,
  className = '',
  height = '100%',
  children
}) {
  const [activeSlide, setActiveSlide] = useState(0);

  // Normalize image list
  const validImages = (Array.isArray(images) && images.length > 0)
    ? images.filter(Boolean)
    : (fallbackImage ? [fallbackImage] : []);

  // For slide mode auto-cycling
  useEffect(() => {
    if (style === 'fade-slide' && validImages.length > 1) {
      const timer = setInterval(() => {
        setActiveSlide(prev => (prev + 1) % validImages.length);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [style, validImages.length]);

  if (validImages.length === 0) {
    return (
      <div style={{ position: 'relative', width: '100%', height, background: '#0a1628' }}>
        {children}
      </div>
    );
  }

  // Single Image Render
  if (validImages.length === 1) {
    return (
      <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden' }} className={className}>
        <img
          src={validImages[0]}
          alt="Background"
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
        {/* Darkening / Gradient Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(6,12,23,${overlayOpacity * 0.4}) 0%, rgba(6,12,23,${overlayOpacity}) 100%)`,
            pointerEvents: 'none'
          }}
        />
        {children}
      </div>
    );
  }

  // Multi-Image Styles
  return (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden' }} className={className}>
      
      {/* Dynamic Keyframes for Subtle Floating Movement */}
      <style>{`
        @keyframes kenBurnsMix {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.06) translate(-1%, -1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.75; }
        }
      `}</style>

      {/* 1. COLLAGE BLEND (Seamless Travel Poster Montage - Feathered Multi-Image Landscape Composite) */}
      {style === 'collage-blend' && (
        <div style={{ position: 'absolute', inset: 0, height: '100%', overflow: 'hidden', background: '#060c17' }}>
          {/* Base Layer (Image 1 - Main Background Landmark) */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <img
              src={validImages[0]}
              alt="Base poster landscape"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                animation: 'kenBurnsMix 24s ease-in-out infinite alternate',
                filter: 'brightness(1.05) contrast(1.08)'
              }}
            />
          </div>

          {/* Left Feathered Composite Layer (Image 2 - Seamless Side Blend) */}
          {validImages[1] && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: 0,
                width: '65%',
                zIndex: 2,
                WebkitMaskImage: 'radial-gradient(ellipse at 25% 45%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 80%)',
                maskImage: 'radial-gradient(ellipse at 25% 45%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 80%)',
                overflow: 'hidden'
              }}
            >
              <img
                src={validImages[1]}
                alt="Left poster blend"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  animation: 'kenBurnsMix 18s ease-in-out infinite alternate-reverse',
                  filter: 'brightness(1.05) contrast(1.1)'
                }}
              />
            </div>
          )}

          {/* Right Feathered Composite Layer (Image 3 - Seamless Right Landscape Blend) */}
          {validImages[2] && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                right: 0,
                width: '60%',
                zIndex: 3,
                WebkitMaskImage: 'radial-gradient(ellipse at 75% 35%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 80%)',
                maskImage: 'radial-gradient(ellipse at 75% 35%, rgba(0,0,0,1) 25%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0) 80%)',
                overflow: 'hidden'
              }}
            >
              <img
                src={validImages[2]}
                alt="Right poster blend"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  animation: 'kenBurnsMix 20s ease-in-out infinite alternate',
                  filter: 'brightness(1.05) contrast(1.1)'
                }}
              />
            </div>
          )}

          {/* Bottom Center Feathered Composite Layer (Image 4 - Seamless Foreground Water/Valley Blend) */}
          {validImages[3] && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: '15%',
                right: '15%',
                height: '70%',
                zIndex: 4,
                WebkitMaskImage: 'radial-gradient(ellipse at 50% 80%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 85%)',
                maskImage: 'radial-gradient(ellipse at 50% 80%, rgba(0,0,0,1) 30%, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0) 85%)',
                overflow: 'hidden'
              }}
            >
              <img
                src={validImages[3]}
                alt="Foreground poster blend"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  animation: 'kenBurnsMix 15s ease-in-out infinite alternate-reverse',
                  filter: 'brightness(1.08) contrast(1.12)'
                }}
              />
            </div>
          )}

          {/* Golden Sunset Horizon Light Rays Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 50% 30%, rgba(245,158,11,0.18) 0%, rgba(225,29,72,0.1) 40%, rgba(6,12,23,0.3) 100%)',
              mixBlendMode: 'screen',
              zIndex: 5,
              pointerEvents: 'none'
            }}
          />
        </div>
      )}

      {/* 2. SPLIT GRID (2x2 Quad Multi-Image Blend) */}
      {style === 'split-grid' && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2px' }}>
          {validImages.slice(0, 4).map((imgUrl, idx) => (
            <div key={idx} style={{ position: 'relative', overflow: 'hidden' }}>
              <img
                src={imgUrl}
                alt={`Grid bg ${idx + 1}`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  animation: `kenBurnsMix ${14 + idx * 3}s ease-in-out infinite alternate`
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(180deg, rgba(6,12,23,0.35) 0%, rgba(6,12,23,0.75) 100%)'
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* 3. FADE CAROUSEL (Smooth Crossfading Auto Slider) */}
      {style === 'fade-slide' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          {validImages.map((imgUrl, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: activeSlide === idx ? 1 : 0,
                transition: 'opacity 1.2s ease-in-out',
                zIndex: activeSlide === idx ? 2 : 1
              }}
            >
              <img
                src={imgUrl}
                alt={`Slide bg ${idx + 1}`}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: activeSlide === idx ? 'scale(1.05)' : 'scale(1.0)',
                  transition: 'transform 6s ease-out'
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* 4. LAYERED SOFT (Radial Golden Glow & Soft Blend) */}
      {style === 'layered-soft' && (
        <div style={{ position: 'absolute', inset: 0 }}>
          <img
            src={validImages[0]}
            alt="Base bg"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              animation: 'kenBurnsMix 20s ease-in-out infinite alternate'
            }}
          />
          {validImages[1] && (
            <img
              src={validImages[1]}
              alt="Layer bg"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.55,
                mixBlendMode: 'screen',
                animation: 'kenBurnsMix 15s ease-in-out infinite alternate-reverse'
              }}
            />
          )}
        </div>
      )}

      {/* Universal Soft Contrast Gradient Overlay - Light & Crisp for Image Visibility */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, rgba(6,12,23,${overlayOpacity * 1.6}) 0%, rgba(6,12,23,${overlayOpacity * 0.8}) 45%, rgba(6,12,23,${overlayOpacity * 0.3}) 100%)`,
          zIndex: 4,
          pointerEvents: 'none'
        }}
      />

      {/* Subtle Gold Ambient Rim Glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          boxShadow: 'inset 0 0 50px rgba(212,175,55,0.2)',
          zIndex: 5,
          pointerEvents: 'none'
        }}
      />

      {/* Foreground Content */}
      <div style={{ position: 'relative', zIndex: 6, height: '100%' }}>
        {children}
      </div>
    </div>
  );
}
