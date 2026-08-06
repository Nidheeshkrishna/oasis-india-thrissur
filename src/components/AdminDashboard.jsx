import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, LayoutDashboard, Calendar, Users, Package, Image as ImageIcon, 
  BookOpen, ShieldCheck, Check, Trash2, Plus, Search, 
  Lock, Sparkles, Download, Save, AlertCircle, Loader2, Wand2, 
  PenTool, Eye, RefreshCw, Upload, ImagePlus, Type, Copy, Pencil, Send,
  MonitorPlay, ArrowUp, ArrowDown, Phone, Mail, MapPin, Clock
} from 'lucide-react';
import { firestoreService } from '../services/firebase';
import { geminiService, posterStorage } from '../services/gemini';
import { catalogService } from '../services/catalog';
import { AdminFormModal, TourForm, GalleryForm, BlogForm, HeroSlideForm } from './admin/CatalogForms';
import ImageUploader from './admin/ImageUploader';
import MixedBackground from './MixedBackground';

const ADMIN_PIN = '2026';

export default function AdminDashboard({ contactData, onUpdateContact, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('posters');
  
  // Data States
  const [contactForm, setContactForm] = useState(contactData || {
    phone: '+91 94470 00000',
    phoneAlt: '+91 487 2333388',
    whatsapp: '+91 94470 00000',
    email: 'sales@oasisindiatours.com',
    emailAlt: 'support@oasisindiatours.com',
    address: 'OASIS India Thrissur, Swaraj Round Main Branch & Airport Escort Desk, Thrissur, Kerala 680001',
    workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 5:00 PM',
    escortDesk: 'Cochin International Airport (COK) & Thrissur Railway Station Pickup Desk'
  });
  const [contactMsg, setContactMsg] = useState('');

  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [tours, setTours] = useState(() => catalogService.getTours());
  const [destinations, setDestinations] = useState(() => catalogService.getDestinations());
  const [galleryItems, setGalleryItems] = useState(() => catalogService.getGallery());
  const [blogs, setBlogs] = useState(() => catalogService.getBlogs());
  const [heroSlides, setHeroSlides] = useState(() => catalogService.getSlides());
  const [selectedDestForMix, setSelectedDestForMix] = useState('ooty-tea-railway');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Catalog Editor States
  const [tourFormOpen, setTourFormOpen] = useState(false);
  const [galleryFormOpen, setGalleryFormOpen] = useState(false);
  const [blogFormOpen, setBlogFormOpen] = useState(false);
  const [slideFormOpen, setSlideFormOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [editingGallery, setEditingGallery] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingSlide, setEditingSlide] = useState(null);
  const [catalogMsg, setCatalogMsg] = useState('');

  // Poster Management States
  const [posters, setPosters] = useState([]);
  const [sloganInput, setSloganInput] = useState('');
  const [generatedSlogans, setGeneratedSlogans] = useState([]);
  const [selectedSlogan, setSelectedSlogan] = useState('');
  const [posterStyle, setPosterStyle] = useState('photorealistic');
  const [posterPrompt, setPosterPrompt] = useState('');
  const [isGeneratingSlogan, setIsGeneratingSlogan] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [posterProgress, setPosterProgress] = useState({ current: 0, total: 0, status: '' });
  const [posterError, setPosterError] = useState('');
  const [posterSuccess, setPosterSuccess] = useState('');
  const [previewPoster, setPreviewPoster] = useState(null);
  const [apiStatus, setApiStatus] = useState('');

  // Load data on mount
  useEffect(() => {
    loadAdminData();
    setPosters(posterStorage.getPosters());
  }, []);

  // Check API key status
  useEffect(() => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (key) {
      setApiStatus('connected');
    } else {
      setApiStatus('no-key');
    }
  }, []);

  const loadAdminData = async () => {
    const bData = await firestoreService.getBookings();
    const iData = await firestoreService.getInquiries();
    setBookings(bData);
    setInquiries(iData);
  };

  // Catalog Save/Delete Handlers
  const showCatalogMsg = (msg) => {
    setCatalogMsg(msg);
    setTimeout(() => setCatalogMsg(''), 4000);
  };

  const handleSaveTour = (form) => {
    const updated = editingTour
      ? catalogService.updateTour(editingTour.id, form)
      : catalogService.addTour(form);
    setTours(updated);
    setTourFormOpen(false);
    setEditingTour(null);
    showCatalogMsg(editingTour ? 'Tour package updated on the website!' : 'New tour package published to the website!');
  };

  const handleDeleteTour = (id) => {
    if (confirm('Delete this tour package? It will be removed from the public website.')) {
      setTours(catalogService.deleteTour(id));
      showCatalogMsg('Tour package deleted.');
    }
  };

  const handleSaveGallery = (form) => {
    const updated = editingGallery
      ? catalogService.updateGalleryItem(editingGallery.id, form)
      : catalogService.addGalleryItem(form);
    setGalleryItems(updated);
    setGalleryFormOpen(false);
    setEditingGallery(null);
    showCatalogMsg(editingGallery ? 'Gallery photo updated!' : 'New gallery photo published!');
  };

  const handleDeleteGallery = (id) => {
    if (confirm('Delete this gallery item from the public gallery?')) {
      setGalleryItems(catalogService.deleteGalleryItem(id));
      showCatalogMsg('Gallery item deleted.');
    }
  };

  const handleSaveBlog = (form) => {
    const updated = editingBlog
      ? catalogService.updateBlog(editingBlog.id, form)
      : catalogService.addBlog(form);
    setBlogs(updated);
    setBlogFormOpen(false);
    setEditingBlog(null);
    showCatalogMsg(editingBlog ? 'Blog updated on the website!' : 'New blog published to the website!');
  };

  const handleDeleteBlog = (id) => {
    if (confirm('Delete this blog post from the website?')) {
      setBlogs(catalogService.deleteBlog(id));
      showCatalogMsg('Blog post deleted.');
    }
  };

  const handleSaveSlide = (form) => {
    const updated = editingSlide
      ? catalogService.updateSlide(editingSlide.id, form)
      : catalogService.addSlide(form);
    setHeroSlides(updated);
    setSlideFormOpen(false);
    setEditingSlide(null);
    showCatalogMsg(editingSlide ? 'Hero slide updated!' : 'New hero slide published to the top banner!');
  };

  const handleDeleteSlide = (id) => {
    if (confirm('Delete this hero slide from the top banner?')) {
      setHeroSlides(catalogService.deleteSlide(id));
      showCatalogMsg('Hero slide deleted.');
    }
  };

  const handleMoveSlide = (id, direction) => {
    setHeroSlides(catalogService.moveSlide(id, direction));
  };

  // PIN Auth Handler
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError('');
    } else {
      setPinError('Invalid PIN. Access denied.');
      setPinInput('');
    }
  };

  // Booking Handlers
  const handleUpdateBookingStatus = async (id, status) => {
    const updated = await firestoreService.updateBookingStatus(id, status);
    setBookings(updated);
  };

  const handleDeleteBooking = async (id) => {
    if (confirm('Are you sure you want to delete this booking record?')) {
      const updated = await firestoreService.deleteBooking(id);
      setBookings(updated);
    }
  };

  const handleUpdateInquiryStatus = async (id, status) => {
    const updated = await firestoreService.updateInquiryStatus(id, status);
    setInquiries(updated);
  };

  const filteredBookings = bookings.filter(b => {
    const matchesSearch = b.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          b.packageName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Slogan Generation
  const handleGenerateSlogans = async () => {
    if (!sloganInput.trim()) {
      setPosterError('Please enter a destination or theme');
      return;
    }
    setIsGeneratingSlogan(true);
    setPosterError('');
    setGeneratedSlogans([]);
    try {
      const slogans = await geminiService.generateSlogans(sloganInput, 5);
      setGeneratedSlogans(slogans);
    } catch (err) {
      setPosterError('Failed to generate slogans: ' + err.message);
    } finally {
      setIsGeneratingSlogan(false);
    }
  };

  // Poster Image Generation
  const handleGeneratePoster = async (slogan) => {
    if (!slogan && !posterPrompt.trim()) {
      setPosterError('Please select a slogan or enter a custom prompt');
      return;
    }
    setIsGeneratingImage(true);
    setPosterError('');
    setPosterSuccess('');
    
    const prompt = slogan || posterPrompt;
    try {
      setPosterProgress({ current: 1, total: 1, status: 'generating' });
      const results = await geminiService.generateMultiplePosters([prompt], posterStyle, 
        (current, total, status) => {
          setPosterProgress({ current, total, status });
        }
      );
      
      if (results[0].imageUrl) {
        const newPoster = {
          id: `poster-${Date.now()}`,
          slogan: slogan || '',
          prompt: prompt,
          style: posterStyle,
          imageUrl: results[0].imageUrl,
          createdAt: new Date().toISOString()
        };
        const updated = posterStorage.addPoster(newPoster);
        setPosters(updated);
        setPosterSuccess('Poster generated successfully!');
        setSelectedSlogan('');
      } else {
        setPosterError('Image generation failed: ' + (results[0].error || 'Unknown error'));
      }
    } catch (err) {
      setPosterError('Failed to generate poster: ' + err.message);
    } finally {
      setIsGeneratingImage(false);
      setPosterProgress({ current: 0, total: 0, status: '' });
    }
  };

  // Generate 4 posters from prompts (top banner shows latest 4 as poster design)
  const handleGenerateBatch = async () => {
    const prompts = [
      'Dal Lake Srinagar at sunrise with a traditional shikara boat and floating market, houseboat in the background, golden light',
      'Ancient Kashi Vishwanath temple at golden hour with Ganga aarti ceremony on the ghats',
      'Gulmarg snowy meadow with the gondola cable car and Himalayan peaks at sunset',
      'Golden Temple Amritsar illuminated at night reflecting in the holy sarovar'
    ];
    
    setIsGeneratingImage(true);
    setPosterError('');
    setPosterSuccess('');
    
    try {
      setPosterProgress({ current: 0, total: 4, status: 'starting' });
      const results = await geminiService.generateMultiplePosters(prompts, posterStyle,
        (current, total, status) => {
          setPosterProgress({ current, total, status });
        }
      );
      
      let successCount = 0;
      for (const result of results) {
        if (result.imageUrl) {
          const newPoster = {
            id: result.id,
            slogan: '',
            prompt: result.prompt,
            style: posterStyle,
            imageUrl: result.imageUrl,
            createdAt: result.createdAt
          };
          posterStorage.addPoster(newPoster);
          successCount++;
        }
      }
      
      setPosters(posterStorage.getPosters());
      setPosterSuccess(`Generated ${successCount} of 4 posters successfully!`);
    } catch (err) {
      setPosterError('Batch generation failed: ' + err.message);
    } finally {
      setIsGeneratingImage(false);
      setPosterProgress({ current: 0, total: 0, status: '' });
    }
  };

  // Delete poster
  const handleDeletePoster = (id) => {
    if (confirm('Delete this poster?')) {
      const updated = posterStorage.deletePoster(id);
      setPosters(updated);
    }
  };

  // Copy poster image URL
  const handleCopyImage = (imageUrl) => {
    navigator.clipboard.writeText(imageUrl).then(() => {
      alert('Image data copied to clipboard');
    });
  };

  // AUTH GATE - PIN Login Screen
  if (!isAuthenticated) {
    return (
      <div className="modal-overlay" style={{ zIndex: 10000 }}>
        <div 
          className="glass-card"
          style={{
            width: '100%',
            maxWidth: '420px',
            padding: '2.5rem',
            textAlign: 'center',
            background: '#060d1a',
            border: '1px solid var(--border-gold)'
          }}
        >
          {/* Logo & Title */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4af37, #aa841c)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 0 30px rgba(212,175,55,0.3)'
          }}>
            <ShieldCheck size={36} color="#060c17" />
          </div>

          <h2 style={{ 
            fontSize: '1.6rem', 
            fontWeight: 800, 
            fontFamily: 'var(--font-heading)',
            color: 'var(--gold-light)',
            marginBottom: '0.4rem'
          }}>
            OASIS Admin Portal
          </h2>
          <p style={{ 
            color: 'var(--text-muted)', 
            fontSize: '0.9rem', 
            marginBottom: '2rem' 
          }}>
            Enter your admin PIN to access the dashboard
          </p>

          {/* PIN Input Form */}
          <form onSubmit={handlePinSubmit}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.05)',
                border: pinError ? '2px solid #ef4444' : '2px solid var(--border-gold)',
                borderRadius: '16px',
                padding: '0.8rem 1.2rem',
                transition: 'border-color 0.3s'
              }}>
                <Lock size={20} color={pinError ? '#ef4444' : 'var(--gold-primary)'} />
                <input
                  type="password"
                  placeholder="Enter 4-digit PIN"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setPinError('');
                  }}
                  maxLength={6}
                  autoFocus
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    letterSpacing: '0.4em',
                    width: '100%',
                    outline: 'none',
                    textAlign: 'center',
                    fontFamily: 'monospace'
                  }}
                />
              </div>
              {pinError && (
                <p style={{ color: '#ef4444', fontSize: '0.82rem', marginTop: '0.6rem', fontWeight: 600 }}>
                  {pinError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="btn-gold"
              style={{ width: '100%', justifyContent: 'center', padding: '0.9rem' }}
            >
              <Lock size={18} />
              <span>Access Admin Console</span>
            </button>
          </form>

          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              marginTop: '1.2rem',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              margin: '1.2rem auto 0'
            }}
          >
            <X size={16} /> Cancel
          </button>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD - After Authentication
  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }}>
      <div 
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '1240px',
          maxHeight: '94vh',
          overflow: 'hidden',
          margin: 'auto',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          background: '#060d1a',
          border: '1px solid var(--border-gold)'
        }}
      >
        {/* Header Bar */}
        <div style={{
          padding: '1.2rem 2rem',
          borderBottom: '1px solid var(--border-gold)',
          background: 'rgba(6, 12, 23, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4af37, #aa841c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000'
            }}>
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--gold-light)' }}>
                OASIS Thrissur • Admin Console
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Authenticated</span>
                <span>•</span>
                <span style={{ 
                  color: apiStatus === 'connected' ? 'var(--emerald-accent)' : '#f59e0b',
                  display: 'flex', alignItems: 'center', gap: '0.25rem'
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: apiStatus === 'connected' ? 'var(--emerald-accent)' : '#f59e0b', display: 'inline-block' }} />
                  Gemini API {apiStatus === 'connected' ? 'Connected' : 'No Key'}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <button
              onClick={() => { setIsAuthenticated(false); setPinInput(''); }}
              style={{
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#ef4444',
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <Lock size={14} /> Lock
            </button>
            <button
              onClick={onClose}
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid var(--border-gold)',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs - High Contrast & High Visibility */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.5rem',
          padding: '0.8rem 1.5rem',
          borderBottom: '1px solid var(--border-gold)',
          background: '#091322'
        }}>
          {[
            { id: 'posters', label: 'AI Poster Studio', icon: ImagePlus, count: posters.length },
            { id: 'bgmixer', label: 'Background Mixer', icon: Sparkles, count: destinations.length },
            { id: 'contact', label: 'Contact Info', icon: Phone },
            { id: 'bookings', label: 'Bookings', icon: Calendar, count: bookings.length },
            { id: 'customers', label: 'Inquiries', icon: Users, count: inquiries.length },
            { id: 'slides', label: 'Hero Banner', icon: MonitorPlay, count: heroSlides.length },
            { id: 'tours', label: 'Tours', icon: Package, count: tours.length },
            { id: 'gallery', label: 'Gallery', icon: ImageIcon, count: galleryItems.length },
            { id: 'blogs', label: 'Blog', icon: BookOpen, count: blogs.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.12))'
                    : 'rgba(255, 255, 255, 0.07)',
                  border: isActive ? '1px solid var(--gold-primary)' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: isActive ? '#fef08a' : '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: isActive ? '800' : '600',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '20px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? '0 0 12px rgba(212,175,55,0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={15} color={isActive ? '#fef08a' : 'var(--gold-light)'} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span style={{
                    background: isActive ? 'var(--gold-primary)' : 'rgba(255,255,255,0.18)',
                    color: isActive ? '#000000' : '#ffffff',
                    padding: '0.12rem 0.45rem',
                    borderRadius: '10px',
                    fontSize: '0.72rem',
                    fontWeight: 800
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <div style={{ padding: '1.8rem', overflowY: 'auto', flexGrow: 1 }}>

          {/* ==================== TAB: EDITABLE CONTACT INFO ==================== */}
          {activeTab === 'contact' && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={22} color="var(--gold-primary)" /> Contact Details & Office Locations Editor
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                  Update helpline phone numbers, WhatsApp contact, email addresses, Swaraj Round branch office address, and escort desk locations:
                </p>
              </div>

              {contactMsg && (
                <div style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid #10b981', color: '#10b981', padding: '0.8rem 1rem', borderRadius: '10px', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
                  {contactMsg}
                </div>
              )}

              <form onSubmit={(e) => {
                e.preventDefault();
                if (onUpdateContact) onUpdateContact(contactForm);
                setContactMsg('✓ Contact details saved and updated live on website!');
                setTimeout(() => setContactMsg(''), 4000);
              }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Main Helpline Phone *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-gold)', borderRadius: '8px', color: '#fff', padding: '0.6rem 0.8rem', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Landline / Alt Phone
                  </label>
                  <input
                    type="text"
                    value={contactForm.phoneAlt}
                    onChange={(e) => setContactForm({ ...contactForm, phoneAlt: e.target.value })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-gold)', borderRadius: '8px', color: '#fff', padding: '0.6rem 0.8rem', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#10b981', fontWeight: 700, marginBottom: '0.3rem' }}>
                    WhatsApp Priority Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactForm.whatsapp}
                    onChange={(e) => setContactForm({ ...contactForm, whatsapp: e.target.value })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid #10b981', borderRadius: '8px', color: '#fff', padding: '0.6rem 0.8rem', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Official Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-gold)', borderRadius: '8px', color: '#fff', padding: '0.6rem 0.8rem', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Branch Office Address *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={contactForm.address}
                    onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-gold)', borderRadius: '8px', color: '#fff', padding: '0.6rem 0.8rem', fontSize: '0.85rem', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Escort & Pickup Desk Locations
                  </label>
                  <input
                    type="text"
                    value={contactForm.escortDesk}
                    onChange={(e) => setContactForm({ ...contactForm, escortDesk: e.target.value })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-gold)', borderRadius: '8px', color: '#fff', padding: '0.6rem 0.8rem', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Working Hours
                  </label>
                  <input
                    type="text"
                    value={contactForm.workingHours}
                    onChange={(e) => setContactForm({ ...contactForm, workingHours: e.target.value })}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border-gold)', borderRadius: '8px', color: '#fff', padding: '0.6rem 0.8rem', fontSize: '0.85rem', outline: 'none' }}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <button type="submit" className="btn-gold" style={{ padding: '0.75rem 1.8rem', fontSize: '0.9rem' }}>
                    <Save size={16} /> Save Contact Details Live
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* ==================== TAB: BACKGROUND MIXER STUDIO ==================== */}
          {activeTab === 'bgmixer' && (() => {
            const currentDest = destinations.find(d => d.id === selectedDestForMix) || destinations[0] || {};
            
            const handleUpdateMix = (patch) => {
              const updated = catalogService.updateDestination(currentDest.id, patch);
              setDestinations(updated);
              showCatalogMsg(`Mixed background updated for ${currentDest.name}!`);
            };

            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Sparkles size={22} color="var(--gold-primary)" /> Multi-Image Background Mixer Studio
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                      Upload & mix multiple background images (e.g. Ooty Toy Train + Tea Gardens + Botanical Garden + Lake)
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Select Destination:</label>
                    <select
                      value={selectedDestForMix}
                      onChange={(e) => setSelectedDestForMix(e.target.value)}
                      style={{
                        background: '#081222',
                        border: '1px solid var(--border-gold)',
                        color: '#fff',
                        borderRadius: '10px',
                        padding: '0.6rem 1rem',
                        fontSize: '0.9rem',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {destinations.map(d => (
                        <option key={d.id} value={d.id}>{d.name} ({d.category})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {catalogMsg && (
                  <div style={{ padding: '0.8rem 1.2rem', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981', marginBottom: '1.5rem', fontSize: '0.88rem', fontWeight: 700 }}>
                    <Check size={16} style={{ verticalAlign: '-3px', marginRight: '6px' }} /> {catalogMsg}
                  </div>
                )}

                {/* Main Mixer Layout: Controls + Live Preview Card */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
                  
                  {/* Left Column: Image Uploader & Mixer Controls */}
                  <div className="glass-card" style={{ padding: '1.5rem' }}>
                    <h4 style={{ fontSize: '1rem', color: 'var(--gold-light)', marginBottom: '1rem', fontWeight: 700 }}>
                      Configure Background Composition
                    </h4>

                    <ImageUploader
                      value={currentDest.heroImage || ''}
                      onChange={(url) => handleUpdateMix({ heroImage: url })}
                      multiValues={currentDest.bgMixImages || []}
                      onMultiChange={(list) => handleUpdateMix({ bgMixImages: list })}
                      blendStyle={currentDest.bgMixStyle || 'collage-blend'}
                      onBlendStyleChange={(st) => handleUpdateMix({ bgMixStyle: st })}
                      enableMixMode={true}
                    />

                    <button
                      type="button"
                      className="btn-gold"
                      onClick={() => showCatalogMsg(`Live background mix saved for ${currentDest.name}!`)}
                      style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '0.85rem' }}
                    >
                      <Save size={18} /> Publish Background Blend to Website
                    </button>
                  </div>

                  {/* Right Column: Live Website Card Preview */}
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '0.6rem' }}>
                      Live Website Card Preview ({currentDest.name})
                    </div>

                    <div className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                      <div style={{ position: 'relative', height: '300px', overflow: 'hidden' }}>
                        <MixedBackground
                          images={currentDest.bgMixImages}
                          fallbackImage={currentDest.heroImage}
                          style={currentDest.bgMixStyle || 'collage-blend'}
                          height="100%"
                          overlayOpacity={0.4}
                        />

                        <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', gap: '0.5rem', zIndex: 10 }}>
                          <span className="badge-gold">{currentDest.category}</span>
                          <span className="badge-emerald">{currentDest.location}</span>
                        </div>

                        <div style={{ position: 'absolute', bottom: '1.2rem', left: '1.2rem', right: '1.2rem', zIndex: 10 }}>
                          <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
                            {currentDest.name}
                          </h3>
                          <p style={{ fontSize: '0.88rem', color: 'var(--gold-light)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                            "{currentDest.tagline}"
                          </p>
                        </div>
                      </div>

                      <div style={{ padding: '1.2rem' }}>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.8rem', lineHeight: 1.5 }}>
                          {currentDest.description}
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                          {(currentDest.bgMixImages || [currentDest.heroImage]).map((img, i) => (
                            <span key={i} style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderRadius: '12px', background: 'rgba(212,175,55,0.15)', border: '1px solid var(--border-gold)', color: 'var(--gold-light)' }}>
                              Layer {i + 1} Image
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })()}

          {/* ==================== TAB: AI POSTER STUDIO ==================== */}
          {activeTab === 'posters' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Wand2 size={22} /> AI Poster Studio
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    Generate travel poster images using Google Gemini AI
                  </p>
                </div>
                <button 
                  className="btn-gold" 
                  onClick={handleGenerateBatch}
                  disabled={isGeneratingImage}
                  style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem', opacity: isGeneratingImage ? 0.5 : 1 }}
                >
                  {isGeneratingImage ? <Loader2 size={16} className="animate-pulse-slow" /> : <Sparkles size={16} />}
                  <span>Generate 4 Posters</span>
                </button>
              </div>

              {/* Generation Progress */}
              {posterProgress.total > 0 && (
                <div className="glass-card" style={{ padding: '1.2rem', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.8rem' }}>
                    <Loader2 size={18} className="animate-pulse-slow" color="var(--gold-primary)" />
                    <span style={{ fontWeight: 600, color: 'var(--gold-light)' }}>
                      Generating Poster {posterProgress.current} of {posterProgress.total}...
                    </span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    background: 'rgba(255,255,255,0.1)', 
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${(posterProgress.current / posterProgress.total) * 100}%`,
                      height: '100%',
                      background: 'linear-gradient(90deg, #d4af37, #10b981)',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }} />
                  </div>
                </div>
              )}

              {/* Status Messages */}
              {posterError && (
                <div style={{ 
                  background: 'rgba(239,68,68,0.15)', 
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '12px', 
                  padding: '0.8rem 1.2rem', 
                  marginBottom: '1rem',
                  color: '#ef4444',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <AlertCircle size={18} /> {posterError}
                </div>
              )}
              {posterSuccess && (
                <div style={{ 
                  background: 'rgba(16,185,129,0.15)', 
                  border: '1px solid rgba(16,185,129,0.3)',
                  borderRadius: '12px', 
                  padding: '0.8rem 1.2rem', 
                  marginBottom: '1rem',
                  color: 'var(--emerald-accent)',
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Check size={18} /> {posterSuccess}
                </div>
              )}

              {/* Slogan Generator */}
              <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <PenTool size={18} /> AI Slogan Generator
                </h4>
                
                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Enter destination or theme (e.g., Kerala, Kashi, Hill Stations)"
                    value={sloganInput}
                    onChange={(e) => setSloganInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleGenerateSlogans()}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '12px',
                      padding: '0.7rem 1rem',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    className="btn-gold"
                    onClick={handleGenerateSlogans}
                    disabled={isGeneratingSlogan}
                    style={{ padding: '0.7rem 1.2rem', fontSize: '0.85rem' }}
                  >
                    {isGeneratingSlogan ? <Loader2 size={16} className="animate-pulse-slow" /> : <Wand2 size={16} />}
                    Generate
                  </button>
                </div>

                {/* Generated Slogans */}
                {generatedSlogans.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.3rem' }}>
                      Click a slogan to generate a poster, or select and customize:
                    </p>
                    {generatedSlogans.map((slogan, idx) => (
                      <div 
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 0.8rem',
                          background: selectedSlogan === slogan ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                          border: selectedSlogan === slogan ? '1px solid var(--gold-primary)' : '1px solid var(--border-subtle)',
                          borderRadius: '10px',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}
                        onClick={() => setSelectedSlogan(selectedSlogan === slogan ? '' : slogan)}
                      >
                        <span style={{ 
                          color: 'var(--gold-light)', 
                          fontWeight: 600, 
                          fontSize: '0.9rem',
                          flex: 1,
                          fontStyle: 'italic'
                        }}>
                          "{slogan}"
                        </span>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleGeneratePoster(slogan); }}
                            disabled={isGeneratingImage}
                            style={{
                              background: 'rgba(16,185,129,0.2)',
                              border: 'none',
                              color: 'var(--emerald-accent)',
                              padding: '0.3rem 0.6rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            <ImagePlus size={14} /> Generate Poster
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(slogan); }}
                            style={{
                              background: 'rgba(255,255,255,0.06)',
                              border: 'none',
                              color: 'var(--text-muted)',
                              padding: '0.3rem 0.5rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              fontSize: '0.75rem'
                            }}
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Prompt Generator */}
              <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <ImagePlus size={18} /> Custom Poster Prompt
                </h4>
                
                <div style={{ display: 'flex', gap: '0.8rem', marginBottom: '0.8rem' }}>
                  <textarea
                    placeholder="Describe the poster image you want to generate... (e.g., 'Golden temple at sunset with devotees, warm orange sky')"
                    value={posterPrompt}
                    onChange={(e) => setPosterPrompt(e.target.value)}
                    rows={3}
                    style={{
                      flex: 1,
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '12px',
                      padding: '0.7rem 1rem',
                      color: '#fff',
                      fontSize: '0.9rem',
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                  <select
                    value={posterStyle}
                    onChange={(e) => setPosterStyle(e.target.value)}
                    style={{
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid var(--border-gold)',
                      borderRadius: '10px',
                      padding: '0.6rem 1rem',
                      color: '#fff',
                      fontSize: '0.85rem',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="photorealistic">Photorealistic</option>
                    <option value="artistic">Artistic</option>
                    <option value="cinematic">Cinematic</option>
                  </select>

                  <button
                    className="btn-gold"
                    onClick={() => handleGeneratePoster(null)}
                    disabled={isGeneratingImage || !posterPrompt.trim()}
                    style={{ padding: '0.6rem 1.2rem', fontSize: '0.85rem', opacity: (isGeneratingImage || !posterPrompt.trim()) ? 0.5 : 1 }}
                  >
                    {isGeneratingImage ? <Loader2 size={16} className="animate-pulse-slow" /> : <Sparkles size={16} />}
                    Generate
                  </button>
                </div>
              </div>

              {/* Generated Posters Gallery */}
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <Eye size={18} /> Generated Posters ({posters.length})
                </h4>

                {posters.length === 0 ? (
                  <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
                    <ImageIcon size={48} color="var(--text-dim)" style={{ margin: '0 auto 1rem' }} />
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                      No posters generated yet. Use the AI tools above to create your first poster!
                    </p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
                    {posters.map((poster) => (
                      <div key={poster.id} className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
                        {poster.imageUrl ? (
                          <img 
                            src={poster.imageUrl} 
                            alt={poster.slogan || poster.prompt}
                            style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                          />
                        ) : (
                          <div style={{ 
                            width: '100%', 
                            height: '200px', 
                            background: 'rgba(255,255,255,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--text-dim)'
                          }}>
                            <AlertCircle size={32} />
                          </div>
                        )}
                        <div style={{ padding: '1rem' }}>
                          {poster.slogan && (
                            <p style={{ 
                              color: 'var(--gold-light)', 
                              fontSize: '0.88rem', 
                              fontWeight: 600,
                              fontStyle: 'italic',
                              marginBottom: '0.4rem'
                            }}>
                              "{poster.slogan}"
                            </p>
                          )}
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.6rem' }}>
                            {poster.prompt?.substring(0, 80)}...
                          </p>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ 
                              fontSize: '0.7rem', 
                              color: 'var(--text-dim)',
                              background: 'rgba(255,255,255,0.05)',
                              padding: '0.2rem 0.5rem',
                              borderRadius: '8px'
                            }}>
                              {poster.style} • {new Date(poster.createdAt).toLocaleDateString()}
                            </span>
                            <div style={{ display: 'flex', gap: '0.3rem' }}>
                              <button
                                onClick={() => setPreviewPoster(poster)}
                                style={{
                                  background: 'rgba(212,175,55,0.15)',
                                  border: 'none',
                                  color: 'var(--gold-primary)',
                                  padding: '0.3rem 0.5rem',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem'
                                }}
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={() => handleDeletePoster(poster.id)}
                                style={{
                                  background: 'rgba(239,68,68,0.15)',
                                  border: 'none',
                                  color: '#ef4444',
                                  padding: '0.3rem 0.5rem',
                                  borderRadius: '6px',
                                  cursor: 'pointer',
                                  fontSize: '0.75rem'
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== TAB: BOOKING MANAGEMENT ==================== */}
          {activeTab === 'bookings' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-gold)', borderRadius: '25px', padding: '0.4rem 1rem', width: '320px' }}>
                  <Search size={16} color="var(--gold-primary)" />
                  <input
                    type="text"
                    placeholder="Search by name, ID or tour..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.88rem', width: '100%', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  {['All', 'Confirmed', 'Pending', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setStatusFilter(st)}
                      style={{
                        background: statusFilter === st ? 'var(--gold-primary)' : 'rgba(255,255,255,0.05)',
                        color: statusFilter === st ? '#000' : 'var(--text-muted)',
                        border: 'none',
                        padding: '0.4rem 0.9rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-gold)', color: 'var(--gold-light)' }}>
                      <th style={{ padding: '0.8rem' }}>Booking ID</th>
                      <th style={{ padding: '0.8rem' }}>Customer</th>
                      <th style={{ padding: '0.8rem' }}>Tour Package</th>
                      <th style={{ padding: '0.8rem' }}>Date</th>
                      <th style={{ padding: '0.8rem' }}>Travelers</th>
                      <th style={{ padding: '0.8rem' }}>Total (₹)</th>
                      <th style={{ padding: '0.8rem' }}>Status</th>
                      <th style={{ padding: '0.8rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr key={b.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)' }}>
                        <td style={{ padding: '0.8rem', fontWeight: 700, color: 'var(--gold-light)' }}>{b.id}</td>
                        <td style={{ padding: '0.8rem' }}>
                          <div style={{ fontWeight: 700 }}>{b.customerName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{b.phone}</div>
                        </td>
                        <td style={{ padding: '0.8rem', color: 'var(--text-main)', maxWidth: '220px' }}>{b.packageName}</td>
                        <td style={{ padding: '0.8rem' }}>{b.travelDate}</td>
                        <td style={{ padding: '0.8rem' }}>{b.travelers} Persons</td>
                        <td style={{ padding: '0.8rem', fontWeight: 800, color: 'var(--emerald-accent)' }}>₹{b.totalPrice.toLocaleString('en-IN')}</td>
                        <td style={{ padding: '0.8rem' }}>
                          <span style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: b.status === 'Confirmed' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                            color: b.status === 'Confirmed' ? '#10b981' : '#f59e0b'
                          }}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '0.8rem', textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                            <button
                              onClick={() => handleUpdateBookingStatus(b.id, b.status === 'Confirmed' ? 'Pending' : 'Confirmed')}
                              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-gold)', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
                            >
                              Toggle
                            </button>
                            <button
                              onClick={() => handleDeleteBooking(b.id)}
                              style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#ef4444', padding: '0.3rem 0.5rem', borderRadius: '6px', cursor: 'pointer' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== TAB: CUSTOMER INQUIRIES ==================== */}
          {activeTab === 'customers' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
              {inquiries.map((inq) => (
                <div key={inq.id} className="glass-card" style={{ padding: '1.4rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                    <span className="badge-gold">{inq.id}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{inq.date}</span>
                  </div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.2rem' }}>{inq.name}</h4>
                  <div style={{ fontSize: '0.85rem', color: 'var(--gold-light)', marginBottom: '0.6rem' }}>{inq.phone}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem' }}>{inq.subject}</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                    "{inq.message}"
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem' }}>
                    <span className="badge-emerald">{inq.status}</span>
                    <button
                      onClick={() => handleUpdateInquiryStatus(inq.id, 'Responded / Contacted')}
                      className="btn-glass"
                      style={{ padding: '0.3rem 0.7rem', fontSize: '0.75rem' }}
                    >
                      Mark Contacted
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ==================== TAB: HERO BANNER SLIDES ==================== */}
          {activeTab === 'slides' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    Top Hero Banner Slides
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                    Control the full-screen slideshow at the top of the website. Order = slide order (use arrows to rearrange).
                  </p>
                </div>
                <button className="btn-gold" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }} onClick={() => { setEditingSlide(null); setSlideFormOpen(true); }}>
                  <Plus size={16} /> Add New Slide
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
                {heroSlides.map((s, idx) => (
                  <div key={s.id} className="glass-card" style={{ padding: '1.2rem' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={s.heroImage} alt={s.name} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.8rem' }} />
                      <span style={{
                        position: 'absolute', top: '8px', left: '8px',
                        background: 'linear-gradient(135deg, rgba(139,92,246,0.9), rgba(212,175,55,0.9))',
                        color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '0.25rem 0.6rem', borderRadius: '12px'
                      }}>
                        Slide {idx + 1}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem', marginBottom: '0.3rem', lineHeight: 1.35 }}>{s.name}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
                      {s.location} • {s.duration}
                    </div>
                    <div style={{ color: 'var(--gold-light)', fontSize: '0.9rem', fontWeight: 800, marginBottom: '0.8rem' }}>
                      ₹{s.startingPrice?.toLocaleString('en-IN')} / person
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem', alignItems: 'center' }}>
                      <button
                        onClick={() => handleMoveSlide(s.id, -1)}
                        disabled={idx === 0}
                        title="Move up"
                        style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: idx === 0 ? '#444' : 'var(--text-muted)', padding: '0.4rem 0.6rem', borderRadius: '8px', cursor: idx === 0 ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowUp size={15} />
                      </button>
                      <button
                        onClick={() => handleMoveSlide(s.id, 1)}
                        disabled={idx === heroSlides.length - 1}
                        title="Move down"
                        style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: idx === heroSlides.length - 1 ? '#444' : 'var(--text-muted)', padding: '0.4rem 0.6rem', borderRadius: '8px', cursor: idx === heroSlides.length - 1 ? 'not-allowed' : 'pointer' }}
                      >
                        <ArrowDown size={15} />
                      </button>
                      <button
                        onClick={() => { setEditingSlide(s); setSlideFormOpen(true); }}
                        className="btn-glass"
                        style={{ flex: 1, justifyContent: 'center', padding: '0.45rem', fontSize: '0.8rem' }}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSlide(s.id)}
                        style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#ef4444', padding: '0.45rem 0.8rem', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: TOUR PACKAGES ==================== */}
          {activeTab === 'tours' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    Tour Packages Catalogue
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                    Changes publish instantly to the website Tour Packages section.
                  </p>
                </div>
                <button className="btn-gold" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }} onClick={() => { setEditingTour(null); setTourFormOpen(true); }}>
                  <Plus size={16} /> Add New Tour
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
                {tours.map((p) => (
                  <div key={p.id} className="glass-card" style={{ padding: '1.2rem' }}>
                    <div style={{ position: 'relative' }}>
                      <img src={p.image} alt={p.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.8rem' }} />
                      <span style={{
                        position: 'absolute', top: '8px', left: '8px',
                        background: 'rgba(6,12,23,0.85)', color: 'var(--gold-light)',
                        fontSize: '0.7rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '12px'
                      }}>
                        {p.badge || 'Package'}
                      </span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.98rem', marginBottom: '0.3rem', lineHeight: 1.35 }}>{p.title}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginBottom: '0.4rem' }}>
                      {p.duration} • {p.mainPlaces?.join(', ') || '—'}
                    </div>
                    <div style={{ color: 'var(--gold-light)', fontSize: '0.95rem', fontWeight: 800, marginBottom: '0.8rem' }}>
                      ₹{p.price?.toLocaleString('en-IN')}
                      {p.originalPrice > p.price && (
                        <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem', textDecoration: 'line-through', marginLeft: '0.5rem', fontWeight: 500 }}>
                          ₹{p.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem' }}>
                      <button
                        onClick={() => { setEditingTour(p); setTourFormOpen(true); }}
                        className="btn-glass"
                        style={{ flex: 1, justifyContent: 'center', padding: '0.45rem', fontSize: '0.8rem' }}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTour(p.id)}
                        style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#ef4444', padding: '0.45rem 0.8rem', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: GALLERY ==================== */}
          {activeTab === 'gallery' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    Licensed Photography Repository
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                    Photos appear instantly on the website Real Photo Gallery tab.
                  </p>
                </div>
                <button className="btn-gold" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }} onClick={() => { setEditingGallery(null); setGalleryFormOpen(true); }}>
                  <ImagePlus size={16} /> Upload Photo Metadata
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {galleryItems.map((g) => (
                  <div key={g.id} className="glass-card" style={{ padding: '0.8rem' }}>
                    <img src={g.url} alt={g.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.4rem' }} />
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.2rem' }}>{g.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>{g.camera}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
                      <button
                        onClick={() => { setEditingGallery(g); setGalleryFormOpen(true); }}
                        className="btn-glass"
                        style={{ flex: 1, justifyContent: 'center', padding: '0.4rem', fontSize: '0.75rem' }}
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGallery(g.id)}
                        style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#ef4444', padding: '0.4rem 0.7rem', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==================== TAB: BLOGS ==================== */}
          {activeTab === 'blogs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                    Travel Stories & Blogs
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                    Blog posts appear in the Travel Stories section on the website.
                  </p>
                </div>
                <button className="btn-gold" style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }} onClick={() => { setEditingBlog(null); setBlogFormOpen(true); }}>
                  <Plus size={16} /> Add New Blog
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                {blogs.map((b) => (
                  <div key={b.id} className="glass-card" style={{ padding: '1.2rem', overflow: 'hidden' }}>
                    {b.image && (
                      <img src={b.image} alt={b.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.8rem' }} />
                    )}
                    <span className="badge-gold" style={{ marginBottom: '0.5rem', fontSize: '0.7rem' }}>{b.tag}</span>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0.4rem 0' }}>{b.title}</h4>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginBottom: '0.6rem' }}>
                      {b.excerpt?.substring(0, 110)}{b.excerpt?.length > 110 ? '...' : ''}
                    </p>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: '0.8rem' }}>
                      {b.author} • {b.createdAt}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.8rem' }}>
                      <button
                        onClick={() => { setEditingBlog(b); setBlogFormOpen(true); }}
                        className="btn-glass"
                        style={{ flex: 1, justifyContent: 'center', padding: '0.45rem', fontSize: '0.78rem' }}
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(b.id)}
                        style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#ef4444', padding: '0.45rem 0.8rem', borderRadius: '10px', cursor: 'pointer' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Catalog Success Toast */}
        {catalogMsg && (
          <div style={{
            position: 'absolute',
            bottom: '1.5rem',
            right: '1.5rem',
            zIndex: 10003,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            padding: '0.8rem 1.2rem',
            borderRadius: '12px',
            fontSize: '0.88rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: '0 10px 26px rgba(16,185,129,0.45)',
            animation: 'slideUpFade 0.4s ease-out both'
          }}>
            <Check size={18} /> {catalogMsg}
          </div>
        )}

        {/* Tour Package Add/Edit Modal */}
        {tourFormOpen && (
          <AdminFormModal
            title={editingTour ? 'Edit Tour Package' : 'Add New Tour Package'}
            icon={Package}
            onClose={() => { setTourFormOpen(false); setEditingTour(null); }}
          >
            <TourForm
              initial={editingTour}
              onSave={handleSaveTour}
              onCancel={() => { setTourFormOpen(false); setEditingTour(null); }}
            />
          </AdminFormModal>
        )}

        {/* Gallery Item Add/Edit Modal */}
        {galleryFormOpen && (
          <AdminFormModal
            title={editingGallery ? 'Edit Gallery Photo' : 'Upload Photo Metadata'}
            icon={ImageIcon}
            onClose={() => { setGalleryFormOpen(false); setEditingGallery(null); }}
          >
            <GalleryForm
              initial={editingGallery}
              onSave={handleSaveGallery}
              onCancel={() => { setGalleryFormOpen(false); setEditingGallery(null); }}
            />
          </AdminFormModal>
        )}

        {/* Blog Add/Edit Modal */}
        {blogFormOpen && (
          <AdminFormModal
            title={editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
            icon={BookOpen}
            onClose={() => { setBlogFormOpen(false); setEditingBlog(null); }}
          >
            <BlogForm
              initial={editingBlog}
              onSave={handleSaveBlog}
              onCancel={() => { setBlogFormOpen(false); setEditingBlog(null); }}
            />
          </AdminFormModal>
        )}

        {/* Hero Slide Add/Edit Modal */}
        {slideFormOpen && (
          <AdminFormModal
            title={editingSlide ? 'Edit Hero Slide' : 'Add New Hero Slide'}
            icon={MonitorPlay}
            onClose={() => { setSlideFormOpen(false); setEditingSlide(null); }}
          >
            <HeroSlideForm
              initial={editingSlide}
              onSave={handleSaveSlide}
              onCancel={() => { setSlideFormOpen(false); setEditingSlide(null); }}
            />
          </AdminFormModal>
        )}

        {/* Poster Preview Modal */}
        {previewPoster && (
          <div 
            className="modal-overlay" 
            style={{ zIndex: 10001 }}
            onClick={() => setPreviewPoster(null)}
          >
            <div 
              className="glass-card"
              style={{ 
                maxWidth: '700px', 
                width: '90%', 
                padding: 0, 
                overflow: 'hidden',
                cursor: 'default'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {previewPoster.imageUrl && (
                <img 
                  src={previewPoster.imageUrl} 
                  alt={previewPoster.slogan || previewPoster.prompt}
                  style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', background: '#000' }}
                />
              )}
              <div style={{ padding: '1.2rem' }}>
                {previewPoster.slogan && (
                  <p style={{ color: 'var(--gold-light)', fontSize: '1rem', fontWeight: 700, fontStyle: 'italic', marginBottom: '0.5rem' }}>
                    "{previewPoster.slogan}"
                  </p>
                )}
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  Prompt: {previewPoster.prompt}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    Style: {previewPoster.style}
                  </span>
                  <button 
                    onClick={() => setPreviewPoster(null)}
                    className="btn-glass"
                    style={{ padding: '0.4rem 1rem', fontSize: '0.82rem' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
