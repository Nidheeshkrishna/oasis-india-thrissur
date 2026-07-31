import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, ShieldCheck, MapPin, UserCheck, Sparkles } from 'lucide-react';
import OasisLogo from './OasisLogo';

export default function Navbar({ activeTab, setActiveTab, onOpenAdmin, onBookClick }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'destinations', label: 'Popular Destinations' },
    { id: 'packages', label: 'Tour Packages' },
    { id: 'gallery', label: 'Real Photo Gallery' },
    { id: 'about', label: 'About OASIS Thrissur' }
  ];

  return (
    <header 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        transition: 'all 0.4s ease',
        background: isScrolled ? 'rgba(6, 12, 23, 0.94)' : 'linear-gradient(to bottom, rgba(6,12,23,0.9), rgba(6,12,23,0.2))',
        backdropFilter: isScrolled ? 'blur(16px)' : 'blur(6px)',
        borderBottom: isScrolled ? '1px solid rgba(212, 175, 55, 0.2)' : 'none',
        boxShadow: isScrolled ? '0 10px 30px rgba(0,0,0,0.5)' : 'none'
      }}
    >
      {/* Top Announcement Bar */}
      <div style={{
        background: 'linear-gradient(90deg, #4E6128 0%, #F37021 50%, #4E6128 100%)',
        color: '#ffffff',
        fontSize: '0.78rem',
        fontWeight: '700',
        padding: '0.35rem 1rem',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1.5rem',
        letterSpacing: '0.04em'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <MapPin size={13} />
          <span>Thrissur Swaraj Round Main Branch & Airport Escort Desk</span>
        </div>
        <div style={{ display: 'none', mdDisplay: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={13} />
          <span>100% Authentic Licensed Destination Photography • Ministry of Tourism Recognized</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Phone size={13} />
          <span>Helpline: +91 94470 00000</span>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '84px' }}>
        
        {/* Official Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')} 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <OasisLogo height={44} />
        </div>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? 'var(--gold-light)' : 'var(--text-muted)',
                  fontSize: '0.92rem',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  padding: '0.4rem 0',
                  position: 'relative',
                  transition: 'color 0.3s ease'
                }}
              >
                {link.label}
                {isActive && (
                  <span style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    right: 0,
                    height: '2px',
                    background: 'linear-gradient(90deg, #d4af37, #f3e5ab)',
                    borderRadius: '2px',
                    boxShadow: '0 0 8px var(--gold-primary)'
                  }} />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right CTA Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Admin Toggle */}
          <button
            onClick={onOpenAdmin}
            title="Open Firebase Admin Portal"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-gold)',
              color: 'var(--gold-light)',
              padding: '0.55rem 0.95rem',
              borderRadius: '25px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.82rem',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
          >
            <UserCheck size={15} />
            <span>Admin Portal</span>
          </button>

          {/* Quick WhatsApp Action */}
          <a
            href="https://wa.me/919447000000?text=Hello%20OASIS%20India%20Thrissur,%20I%20want%20to%20inquire%20about%20tour%20packages."
            target="_blank"
            rel="noopener noreferrer"
            className="btn-glass"
            style={{
              padding: '0.55rem 1rem',
              borderRadius: '25px',
              fontSize: '0.85rem',
              textDecoration: 'none',
              borderColor: '#10b981',
              color: '#10b981'
            }}
          >
            <MessageSquare size={16} />
            <span>WhatsApp</span>
          </a>

          {/* Book Now Button */}
          <button 
            className="btn-gold" 
            onClick={() => onBookClick()}
            style={{ padding: '0.6rem 1.3rem', fontSize: '0.85rem' }}
          >
            <Sparkles size={16} />
            <span>Book Tour</span>
          </button>
        </div>

      </div>
    </header>
  );
}
