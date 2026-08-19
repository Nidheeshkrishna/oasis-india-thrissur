import React, { useState, useEffect, useRef } from 'react';
import { Phone, ShieldCheck, UserCheck, Sparkles, Globe, Check, ChevronDown, Menu, X, MessageCircle } from 'lucide-react';
import OasisLogo from './OasisLogo';
import { getWhatsAppNumber } from '../services/whatsapp';
import { useLanguage, LANGUAGES } from '../i18n/LanguageContext';

export default function Navbar({ activeTab, setActiveTab, onOpenAdmin, onBookClick, onOpenGuide }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const langRef = useRef(null);
  const { t, lang, setLang } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!langOpen) return;
    const close = (e) => {
      // Only close if the click is outside the language switcher area
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    // Use mousedown so it fires before onClick — prevents the race condition
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [langOpen]);

  const navLinks = [
    { id: 'home',         label: t('nav.home') },
    { id: 'destinations', label: t('nav.destinations') },
    { id: 'packages',     label: t('nav.packages') },
    { id: 'gallery',      label: t('nav.gallery') },
    { id: 'about',        label: t('nav.about') },
    { id: 'contact',      label: t('nav.contact') },
  ];

  /* ── shared glass pill style for icon buttons ── */
  const glassPill = {
    background: 'rgba(255,255,255,0.08)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    border: '1px solid rgba(245,158,11,0.4)',
    borderRadius: '50px',
    color: '#fef08a',
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: '0.5rem 1rem',
    fontSize: '0.82rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 12px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.1)',
  };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 900,
        transition: 'all 0.45s cubic-bezier(0.4,0,0.2,1)',
        /* Glassmorphism core */
        background: isScrolled
          ? 'rgba(6, 10, 22, 0.72)'
          : 'rgba(6, 10, 22, 0.45)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        /* Aurora shimmer top line */
        borderTop: '1px solid transparent',
        borderBottom: '1px solid rgba(245,158,11,0.22)',
        boxShadow: isScrolled
          ? '0 8px 40px rgba(0,0,0,0.55), inset 0 1px 0 rgba(245,158,11,0.18), inset 0 -1px 0 rgba(139,92,246,0.12)'
          : '0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
      }}
    >
      {/* ── Aurora shimmer overlay on header ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(90deg, rgba(245,158,11,0.04) 0%, rgba(139,92,246,0.06) 50%, rgba(8,145,178,0.04) 100%)',
        zIndex: 0,
      }} />

      {/* ── Top Announcement Bar ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        background: 'linear-gradient(90deg, rgba(78,97,40,0.9) 0%, rgba(243,112,33,0.9) 50%, rgba(78,97,40,0.9) 100%)',
        backdropFilter: 'blur(8px)',
        color: '#ffffff',
        fontSize: '0.76rem',
        fontWeight: 700,
        padding: '0.32rem 1rem',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        letterSpacing: '0.05em',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={12} /> <span>{t('topbarAuth')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Phone size={12} /> <span>{t('helpline')}</span>
        </div>
      </div>

      {/* ── Main Navbar Row ── */}
      <div
        className="container"
        style={{
          position: 'relative', zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '72px',
        }}
      >
        {/* Logo */}
        <div
          onClick={() => setActiveTab('home')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', flexShrink: 0 }}
        >
          <OasisLogo height={42} />
        </div>

        {/* ── Desktop Nav Links ── */}
        <nav
          className="desktop-nav"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            /* glass pill container */
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '50px',
            padding: '0.28rem 0.5rem',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 4px 16px rgba(0,0,0,0.25)',
          }}
        >
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); setMobileOpen(false); }}
                style={{
                  /* glassmorphism pill for each link */
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(245,158,11,0.35), rgba(212,175,55,0.22))'
                    : 'transparent',
                  backdropFilter: isActive ? 'blur(10px)' : 'none',
                  border: isActive
                    ? '1px solid rgba(245,158,11,0.55)'
                    : '1px solid transparent',
                  borderRadius: '50px',
                  color: isActive ? '#fbbf24' : '#ffffff',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  padding: '0.42rem 1.1rem',
                  whiteSpace: 'nowrap',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'all 0.25s ease',
                  letterSpacing: '0.025em',
                  textShadow: isActive ? '0 0 18px rgba(251,191,36,0.7)' : '0 1px 4px rgba(0,0,0,0.7)',
                  boxShadow: isActive
                    ? '0 2px 14px rgba(245,158,11,0.22), inset 0 1px 0 rgba(255,255,255,0.12)'
                    : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(245,158,11,0.14)';
                    e.currentTarget.style.color = '#fbbf24';
                    e.currentTarget.style.border = '1px solid rgba(245,158,11,0.32)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.border = '1px solid transparent';
                  }
                }}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* ── Right CTA Group ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', flexShrink: 0 }}>

          {/* Language Switcher */}
          <div ref={langRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setLangOpen(o => !o)}
              title={t('language')}
              style={glassPill}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(245,158,11,0.18)';
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.65)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                e.currentTarget.style.borderColor = 'rgba(245,158,11,0.4)';
              }}
            >
              <Globe size={14} />
              <span>{(LANGUAGES.find(l => l.code === lang) || LANGUAGES[0]).short}</span>
              <ChevronDown size={13} style={{ transform: langOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.3s ease' }} />
            </button>

            {langOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 10px)',
                right: 0,
                background: 'rgba(8, 14, 30, 0.85)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '16px',
                padding: '0.5rem',
                minWidth: '165px',
                zIndex: 1000,
                boxShadow: '0 20px 50px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)',
              }}>
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => { setLang(l.code); setLangOpen(false); }}
                    style={{
                      width: '100%',
                      background: 'none',
                      border: 'none',
                      color: 'rgba(255,255,255,0.85)',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      padding: '0.55rem 0.85rem',
                      cursor: 'pointer',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(245,158,11,0.15)';
                      e.currentTarget.style.color = '#fef08a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'none';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.85)';
                    }}
                  >
                    <span>{l.label}</span>
                    {l.code === lang && <Check size={14} color="#fbbf24" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Admin Button */}
          <button
            onClick={onOpenAdmin}
            title="Open Admin Console (PIN: 2026)"
            style={{
              ...glassPill,
              background: 'linear-gradient(135deg, rgba(245,158,11,0.22), rgba(139,92,246,0.22))',
              border: '1.5px solid var(--gold-primary)',
              color: '#fef08a',
              boxShadow: '0 0 14px rgba(245,158,11,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245,158,11,0.35), rgba(139,92,246,0.35))';
              e.currentTarget.style.borderColor = '#fbbf24';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(245,158,11,0.55)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(245,158,11,0.22), rgba(139,92,246,0.22))';
              e.currentTarget.style.borderColor = 'var(--gold-primary)';
              e.currentTarget.style.boxShadow = '0 0 14px rgba(245,158,11,0.3)';
            }}
          >
            <ShieldCheck size={15} color="#fbbf24" />
            <span style={{ fontWeight: 800 }}>Admin Console</span>
          </button>


          {/* Mobile menu toggle */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileOpen(o => !o)}
            style={{
              ...glassPill,
              display: 'none',
              padding: '0.5rem 0.75rem',
            }}
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile Dropdown Menu ── */}
      {mobileOpen && (
        <div style={{
          position: 'relative', zIndex: 1,
          background: 'rgba(6,10,22,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderTop: '1px solid rgba(245,158,11,0.2)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => { setActiveTab(link.id); setMobileOpen(false); }}
                style={{
                  background: isActive ? 'rgba(245,158,11,0.18)' : 'transparent',
                  border: isActive ? '1px solid rgba(245,158,11,0.4)' : '1px solid rgba(255,255,255,0.07)',
                  borderRadius: '10px',
                  color: isActive ? '#fbbf24' : '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: isActive ? 800 : 600,
                  padding: '0.75rem 1.2rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                }}
              >
                {link.label}
              </button>
            );
          })}
          {/* Admin Button in Mobile Menu */}
          <button
            onClick={() => { onOpenAdmin(); setMobileOpen(false); }}
            style={{
              background: 'linear-gradient(135deg, rgba(245,158,11,0.22), rgba(139,92,246,0.22))',
              border: '1.5px solid var(--gold-primary)',
              borderRadius: '10px',
              color: '#fef08a',
              fontSize: '0.95rem',
              fontWeight: 800,
              padding: '0.75rem 1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '0.4rem',
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={16} color="#fbbf24" />
              <span>Admin Console</span>
            </span>
            <span style={{ fontSize: '0.75rem', background: 'rgba(245,158,11,0.25)', padding: '0.15rem 0.5rem', borderRadius: '4px', color: '#fbbf24' }}>
              PIN: 2026
            </span>
          </button>
        </div>
      )}
    </header>
  );
}
