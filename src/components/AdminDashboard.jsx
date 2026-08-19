import React, { useState, useEffect, useCallback } from 'react';
import { 
  X, LayoutDashboard, Calendar, Users, Package, Image as ImageIcon, 
  BookOpen, ShieldCheck, Check, Trash2, Plus, Search, 
  Lock, Sparkles, Download, Save, AlertCircle, Loader2, Wand2, 
  PenTool, Eye, RefreshCw, Upload, ImagePlus, Type, Copy, Pencil, Edit3, Edit, Send,
  MonitorPlay, ArrowUp, ArrowDown, Phone, Mail, MapPin, Clock, Globe, Star
} from 'lucide-react';
import { firestoreService, isFirebaseConnected } from '../services/firebase';
import { geminiService, posterStorage } from '../services/gemini';
import { catalogService, initCatalogFromCloud, getLastWriteOk, sortToursUpcomingFirst } from '../services/catalog';
import { reviewStorage } from '../services/reviews';
import { RatingStars } from './ReviewsSection';

import { AdminFormModal, TourForm, GalleryForm, BlogForm, HeroSlideForm, DestinationForm } from './admin/CatalogForms';
import ImageUploader from './admin/ImageUploader';
import MixedBackground from './MixedBackground';
import PackageModal from './PackageModal';

const ADMIN_PIN = '2026';
const SESSION_KEY = 'oasis_admin_session';

export default function AdminDashboard({ contactData, onUpdateContact, onClose }) {
  // Restore session from sessionStorage — cleared on tab close, persists on refresh
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === 'true'; } catch { return false; }
  });
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');
  const [activeTab, setActiveTab] = useState('tours');
  const [previewTourPkg, setPreviewTourPkg] = useState(null);
  const [tourSearchTerm, setTourSearchTerm] = useState('');
  const [tourStatusFilter, setTourStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'
  
  // Data States
  const [contactForm, setContactForm] = useState(contactData || {
    phone: '+91 89211 24101',
    phoneAlt: '+91 89213 94179',
    whatsapp: '+91 89211 24101',
    email: 'Oasisindiaholidays@gmail.com',
    emailAlt: 'Oasisindiaholidays@gmail.com',
    address: '40/3924 Rohini Plaza, Near Railway Station, Kokkalai, Thrissur',
    workingHours: 'Mon - Sat: 9:00 AM - 8:00 PM | Sun: 10:00 AM - 5:00 PM',
    escortDesk: '40/3924 Rohini Plaza, Near Railway Station, Kokkalai, Thrissur'
  });
  const [contactMsg, setContactMsg] = useState('');

  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [reviews, setReviews] = useState(() => reviewStorage.getReviews());
  const [tours, setTours] = useState(() => catalogService.getTours());
  const [destinations, setDestinations] = useState(() => catalogService.getDestinations());
  const [galleryItems, setGalleryItems] = useState(() => catalogService.getGallery());
  const [blogs, setBlogs] = useState(() => catalogService.getBlogs());
  const [heroSlides, setHeroSlides] = useState(() => catalogService.getSlides());
  const [selectedDestForMix, setSelectedDestForMix] = useState('ooty-tea-railway');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Reviews Editor States
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [adminReviewForm, setAdminReviewForm] = useState({ name: '', email: '', rating: 5, trip: '', review: '', image: '' });
  const [reviewSearchTerm, setReviewSearchTerm] = useState('');

  // Catalog Editor States
  const [tourFormOpen, setTourFormOpen] = useState(false);
  const [tourDirty, setTourDirty] = useState(false);
  const [galleryFormOpen, setGalleryFormOpen] = useState(false);
  const [blogFormOpen, setBlogFormOpen] = useState(false);
  const [slideFormOpen, setSlideFormOpen] = useState(false);
  const [destinationFormOpen, setDestinationFormOpen] = useState(false);
  const [destinationDirty, setDestinationDirty] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [editingGallery, setEditingGallery] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);
  const [editingSlide, setEditingSlide] = useState(null);
  const [editingDestination, setEditingDestination] = useState(null);
  const [destSearchTerm, setDestSearchTerm] = useState('');
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

  const isTourActive = (departureDate) => {
    if (!departureDate) return true;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tourDate = new Date(`${departureDate}T00:00:00`);
      if (isNaN(tourDate.getTime())) return true;
      return tourDate >= today;
    } catch {
      return true;
    }
  };
  const activeToursCount = tours.filter(p => isTourActive(p.departureDate)).length;

  // Load data on mount and auto-sync with Firebase in background
  useEffect(() => {
    loadAdminData();
    setPosters(posterStorage.getPosters());
    if (isFirebaseConnected()) {
      initCatalogFromCloud();
    }
    reviewStorage.fetchReviewsFromCloud().then(r => r && setReviews(r));
    const unsubReviews = reviewStorage.subscribe(setReviews);
    return () => unsubReviews();
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

  // Review Handlers
  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this traveler review from Firebase cloud and website?')) return;
    const updated = await reviewStorage.deleteReview(id);
    setReviews(updated);
    showCatalogMsg('Review deleted from Firebase cloud and website');
  };

  const handleSaveAdminReview = async (e) => {
    e.preventDefault();
    if (!adminReviewForm.name.trim() || !adminReviewForm.review.trim()) {
      alert('Please provide traveler name and review text');
      return;
    }
    const updated = await reviewStorage.addReview({
      name: adminReviewForm.name.trim(),
      email: adminReviewForm.email.trim() || 'verified.traveler@oasis.in',
      rating: Number(adminReviewForm.rating) || 5,
      trip: adminReviewForm.trip.trim(),
      review: adminReviewForm.review.trim(),
      image: adminReviewForm.image || undefined
    });
    setReviews(updated);
    setAdminReviewForm({ name: '', email: '', rating: 5, trip: '', review: '', image: '' });
    setReviewFormOpen(false);
    showCatalogMsg('Verified review saved to Firebase cloud & published!');
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
    setTourDirty(false);
    if (getLastWriteOk()) {
      showCatalogMsg(editingTour ? 'Tour package updated on the website!' : 'New tour package published to the website!');
    } else {
      showCatalogMsg('⚠️ Could not save — package images are too large for browser storage. Use smaller images.');
    }
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

  const handleSaveDestination = (form) => {
    const updated = editingDestination
      ? catalogService.updateDestination(editingDestination.id, form)
      : catalogService.addDestination(form);
    setDestinations(updated);
    setDestinationFormOpen(false);
    setEditingDestination(null);
    setDestinationDirty(false);
    if (getLastWriteOk()) {
      showCatalogMsg(editingDestination ? 'Destination updated on the website!' : 'New destination published to the website!');
    } else {
      showCatalogMsg('⚠️ Could not save — image files may be too large for browser storage. Use smaller images.');
    }
  };

  const handleDeleteDestination = (id) => {
    if (confirm('Delete this destination? It will be removed immediately from the public website and deleted from Firebase cloud.')) {
      const updated = catalogService.deleteDestination(id);
      setDestinations(updated);
      showCatalogMsg('✓ Destination removed from website and deleted from Firebase cloud.');
    }
  };

  // PIN Auth Handler
  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      setIsAuthenticated(true);
      setPinError('');
      try { sessionStorage.setItem(SESSION_KEY, 'true'); } catch {}
    } else {
      setPinError('Incorrect PIN. Access denied.');
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

  // AUTH GATE - Premium PIN Login Screen
  if (!isAuthenticated) {
    return (
      <div
        className="modal-overlay"
        style={{ zIndex: 10000, background: 'rgba(3,6,12,0.96)', backdropFilter: 'blur(20px)' }}
      >
        <style>{`
          @keyframes adminGlowPulse {
            0%, 100% { box-shadow: 0 0 40px rgba(212,175,55,0.2), 0 0 80px rgba(212,175,55,0.08); }
            50%       { box-shadow: 0 0 60px rgba(212,175,55,0.4), 0 0 120px rgba(212,175,55,0.15); }
          }
          @keyframes adminShake {
            0%, 100% { transform: translateX(0); }
            15%       { transform: translateX(-8px); }
            30%       { transform: translateX(8px); }
            45%       { transform: translateX(-6px); }
            60%       { transform: translateX(6px); }
            75%       { transform: translateX(-3px); }
            90%       { transform: translateX(3px); }
          }
          @keyframes adminFadeIn {
            from { opacity: 0; transform: translateY(20px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          .admin-login-card { animation: adminFadeIn 0.5s cubic-bezier(0.22,1,0.36,1) both; }
          .admin-shake       { animation: adminShake 0.5s cubic-bezier(0.36,0.07,0.19,0.97) both; }
        `}</style>

        {/* Ambient glow orbs */}
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '15%', left: '20%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(212,175,55,0.06), transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '15%', right: '20%', width: '350px', height: '350px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.05), transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div
          className="admin-login-card"
          style={{
            width: '100%',
            maxWidth: '400px',
            padding: '2.8rem 2.4rem 2.2rem',
            textAlign: 'center',
            background: 'linear-gradient(160deg, rgba(10,18,36,0.98) 0%, rgba(6,10,22,0.99) 100%)',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: '24px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.8), inset 0 1px 0 rgba(212,175,55,0.1)',
            position: 'relative',
          }}
        >
          {/* Top gold line accent */}
          <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: '2px', background: 'linear-gradient(90deg, transparent, rgba(212,175,55,0.6), transparent)', borderRadius: '1px' }} />

          {/* Shield icon */}
          <div style={{
            width: '76px', height: '76px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #1a1200, #2d1f00)',
            border: '2px solid rgba(212,175,55,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1.6rem',
            animation: 'adminGlowPulse 3s ease-in-out infinite',
          }}>
            <ShieldCheck size={36} color="#d4af37" strokeWidth={1.5} />
          </div>

          <h2 style={{ fontSize: '1.55rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: '#f5e08c', marginBottom: '0.3rem', letterSpacing: '-0.01em' }}>
            Admin Portal
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '2rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            OASIS India Thrissur · Secure Access
          </p>

          {/* PIN Form */}
          <form onSubmit={handlePinSubmit}>
            {/* PIN input field */}
            <div
              className={pinError ? 'admin-shake' : ''}
              style={{ marginBottom: '0.8rem' }}
            >
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.8rem',
                background: 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${pinError ? 'rgba(239,68,68,0.6)' : 'rgba(212,175,55,0.3)'}`,
                borderRadius: '14px',
                padding: '0.85rem 1.2rem',
                transition: 'border-color 0.3s',
              }}>
                <Lock size={18} color={pinError ? '#ef4444' : '#d4af37'} style={{ flexShrink: 0 }} />
                <input
                  type="password"
                  placeholder="Enter PIN"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setPinError('');
                  }}
                  maxLength={6}
                  autoFocus
                  style={{
                    background: 'none', border: 'none', outline: 'none',
                    color: '#ffffff',
                    fontSize: '1.4rem', fontWeight: 700,
                    letterSpacing: '0.5em',
                    width: '100%', textAlign: 'center',
                    fontFamily: 'monospace',
                    caretColor: '#d4af37',
                  }}
                />
              </div>

              {/* Dot indicators */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: i < pinInput.length ? '#d4af37' : 'rgba(255,255,255,0.15)',
                    transition: 'background 0.2s ease',
                    boxShadow: i < pinInput.length ? '0 0 8px rgba(212,175,55,0.5)' : 'none',
                  }} />
                ))}
              </div>
            </div>

            {/* Error message */}
            {pinError && (
              <div style={{
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
                borderRadius: '8px', padding: '0.6rem 0.9rem',
                color: '#f87171', fontSize: '0.8rem', fontWeight: 600,
                marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem',
              }}>
                <AlertCircle size={14} /> {pinError}
              </div>
            )}

            <button
              type="submit"
              disabled={pinInput.length < 4}
              style={{
                width: '100%', padding: '0.9rem',
                background: pinInput.length >= 4
                  ? 'linear-gradient(135deg, #d4af37, #aa841c)'
                  : 'rgba(212,175,55,0.1)',
                border: `1px solid ${pinInput.length >= 4 ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.15)'}`,
                borderRadius: '12px',
                color: pinInput.length >= 4 ? '#000' : 'rgba(212,175,55,0.4)',
                fontSize: '0.9rem', fontWeight: 800,
                cursor: pinInput.length >= 4 ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.3s ease',
                letterSpacing: '0.04em',
              }}
            >
              <ShieldCheck size={16} />
              Unlock Admin Console
            </button>
          </form>

          {/* Cancel link */}
          <button
            onClick={onClose}
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.25)',
              cursor: 'pointer', marginTop: '1.4rem', fontSize: '0.8rem',
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              transition: 'color 0.2s',
              letterSpacing: '0.04em',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.25)'}
          >
            <X size={14} /> Cancel &amp; go back
          </button>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD - After Authentication
  return (
    <div className="modal-overlay" style={{ zIndex: 10000 }}>
      <div 
        className="glass-card admin-dash-card"
        style={{
          width: '100%',
          maxWidth: '1240px',
          height: '94vh',
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
        <div className="admin-dash-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', minWidth: 0 }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d4af37, #aa841c)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              flexShrink: 0
            }}>
              <LayoutDashboard size={20} />
            </div>
            <div style={{ minWidth: 0 }}>
              <h2 style={{ fontSize: 'clamp(0.95rem, 2.5vw, 1.3rem)', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                OASIS Thrissur • Admin Console
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span>Authenticated</span>
                <span>•</span>
                <span style={{ 
                  color: isFirebaseConnected() ? '#10b981' : '#f59e0b',
                  display: 'flex', alignItems: 'center', gap: '0.25rem'
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: isFirebaseConnected() ? '#10b981' : '#f59e0b', display: 'inline-block' }} />
                  Firebase {isFirebaseConnected() ? 'Cloud Active (chatapp-a9181)' : 'Demo Cache'}
                </span>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Real-time Cloud Indicator (No manual sync button needed) */}
            {isFirebaseConnected() && (
              <div
                style={{
                  background: 'rgba(16,185,129,0.12)',
                  border: '1px solid rgba(16,185,129,0.4)',
                  color: '#6ee7b7',
                  padding: '0.35rem 0.8rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem'
                }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
                <span>Auto Cloud Sync</span>
              </div>
            )}

            <button
              onClick={() => {
                setIsAuthenticated(false);
                setPinInput('');
                try { sessionStorage.removeItem(SESSION_KEY); } catch {}
              }}
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
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <div className="admin-dash-tabs">
                {[
                  { id: 'tours', label: 'Tours', icon: Package, count: activeToursCount },
                  { id: 'bookings', label: 'Bookings', icon: Calendar, count: bookings.length },
                  { id: 'customers', label: 'Inquiries', icon: Users, count: inquiries.length },
                  { id: 'reviews', label: 'Reviews & Ratings', icon: Star, count: reviews.length },
                  { id: 'destinations', label: 'Destinations', icon: Globe, count: destinations.length },
                  { id: 'slides', label: 'Hero Banner', icon: MonitorPlay, count: heroSlides.length },
                  { id: 'contact', label: 'Contact Info', icon: Phone },
                  { id: 'posters', label: 'AI Poster Studio', icon: ImagePlus, count: posters.length },
                  { id: 'bgmixer', label: 'BG Mixer', icon: Sparkles, count: destinations.length },
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
                      className={`admin-dash-tab-btn ${isActive ? 'active' : ''}`}
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
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '40px', background: 'linear-gradient(to right, transparent, #091322)', pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '4px' }}>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', opacity: 0.6 }}>▸</span>
          </div>
        </div>

              {/* Content Section */}
              <div className="admin-dash-content" style={{ padding: '1.5rem' }}>

                {/* Quick Metrics & Overview Dashboard for Admin */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.8rem'
                }}>
                  <div className="glass-card" style={{ padding: '1.1rem 1.3rem', background: 'rgba(212,175,55,0.08)', border: '1px solid var(--border-gold)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fef08a' }}>
                      <Package size={22} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Tour Packages</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{activeToursCount} Active</div>
                    </div>
                  </div>

            <div className="glass-card" style={{ padding: '1.1rem 1.3rem', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(59,130,246,0.3), rgba(59,130,246,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#93c5fd' }}>
                <Calendar size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Total Bookings</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{bookings.length} Received</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.1rem 1.3rem', background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.3)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(168,85,247,0.3), rgba(168,85,247,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d8b4fe' }}>
                <Users size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Traveler Inquiries</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff' }}>{inquiries.length} Messages</div>
              </div>
            </div>

            <div className="glass-card" style={{ padding: '1.1rem 1.3rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.3)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, rgba(16,185,129,0.3), rgba(16,185,129,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6ee7b7' }}>
                <Globe size={22} />
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Cloud Sync</div>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#6ee7b7', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                  {isFirebaseConnected() ? 'Online (Firebase)' : 'Local Cache'}
                </div>
              </div>
            </div>
          </div>

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
                firestoreService.saveContact(contactForm);
                setContactMsg('✓ Contact details saved and updated live on website & cloud!');
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
                    Alternate / Direct Phone
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

          {/* ==================== TAB: DESTINATIONS MANAGER ==================== */}
          {activeTab === 'destinations' && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe size={22} color="var(--gold-primary)" /> Destinations Manager
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    Add, edit or remove destinations — changes publish live to the website.
                  </p>
                </div>
                <button
                  className="btn-gold"
                  onClick={() => { setEditingDestination(null); setDestinationFormOpen(true); }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} /> Add New Destination
                </button>
              </div>

              {catalogMsg && (
                <div style={{ padding: '0.8rem 1.2rem', borderRadius: '10px', background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981', marginBottom: '1.5rem', fontSize: '0.88rem', fontWeight: 700 }}>
                  <Check size={16} style={{ verticalAlign: '-3px', marginRight: '6px' }} />{catalogMsg}
                </div>
              )}

              {/* Search bar */}
              <div style={{ position: 'relative', marginBottom: '1.2rem', maxWidth: '400px' }}>
                <Search size={16} style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  placeholder="Search destinations…"
                  value={destSearchTerm}
                  onChange={e => setDestSearchTerm(e.target.value)}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-gold)', borderRadius: '10px', color: '#fff', padding: '0.65rem 1rem 0.65rem 2.5rem', fontSize: '0.88rem', outline: 'none' }}
                />
              </div>

              {/* Destination Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {destinations
                  .filter(d => !destSearchTerm || d.name?.toLowerCase().includes(destSearchTerm.toLowerCase()) || d.category?.toLowerCase().includes(destSearchTerm.toLowerCase()) || d.location?.toLowerCase().includes(destSearchTerm.toLowerCase()))
                  .map(dest => (
                  <div key={dest.id} className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                    {/* Image strip */}
                    <div style={{ position: 'relative', height: '120px', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}>
                      {dest.heroImage ? (
                        <img src={dest.heroImage} alt={dest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.target.style.display = 'none'; }} />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '2rem' }}>🌏</div>
                      )}
                      {/* Category & Rating badges */}
                      <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                        <span className="badge-gold" style={{ fontSize: '0.68rem', padding: '0.1rem 0.5rem' }}>{dest.category}</span>
                      </div>
                      <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.7)', borderRadius: '8px', padding: '0.2rem 0.5rem', fontSize: '0.72rem', color: '#fef08a', fontWeight: 700 }}>
                        ⭐ {dest.rating || '4.9'}
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '0.9rem 1rem' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#fff', marginBottom: '0.2rem', lineHeight: 1.3 }}>{dest.name}</div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={11} /> {dest.location}
                      </div>
                      {/* Highlights preview */}
                      {Array.isArray(dest.highlights) && dest.highlights.length > 0 && (
                        <div style={{ marginBottom: '0.6rem' }}>
                          {dest.highlights.slice(0, 2).map((h, i) => (
                            <div key={i} style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'flex-start', gap: '0.3rem', marginBottom: '0.15rem' }}>
                              <span style={{ color: 'var(--gold-primary)', flexShrink: 0, marginTop: '1px' }}>✦</span>
                              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h}</span>
                            </div>
                          ))}
                          {dest.highlights.length > 2 && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>+{dest.highlights.length - 2} more highlights</div>
                          )}
                        </div>
                      )}
                      {/* Sightseeing count */}
                      {Array.isArray(dest.nearbyAttractions) && dest.nearbyAttractions.length > 0 && (
                        <div style={{ fontSize: '0.72rem', color: '#10b981', marginBottom: '0.6rem' }}>
                          🗺️ {dest.nearbyAttractions.length} sightseeing spot{dest.nearbyAttractions.length !== 1 ? 's' : ''}
                        </div>
                      )}
                      {/* Pricing & duration */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                        {dest.startingPrice > 0 && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--gold-light)', fontWeight: 700 }}>₹{dest.startingPrice?.toLocaleString()}</span>
                        )}
                        {dest.duration && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.06)', padding: '0.1rem 0.45rem', borderRadius: '8px' }}>{dest.duration}</span>
                        )}
                        {dest.bestTime && (
                          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>Best: {dest.bestTime}</span>
                        )}
                      </div>
                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => { setEditingDestination(dest); setDestinationFormOpen(true); }}
                          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.5rem', background: 'rgba(212,175,55,0.12)', border: '1px solid var(--border-gold)', color: 'var(--gold-light)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.22)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,175,55,0.12)'; }}
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDestination(dest.id)}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem', padding: '0.5rem 0.8rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.2)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {destinations.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'rgba(255,255,255,0.3)' }}>
                  <Globe size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                  <div style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No destinations yet</div>
                  <div style={{ fontSize: '0.85rem' }}>Click "Add New Destination" to get started.</div>
                </div>
              )}

              {/* Destination Form Modal */}
              {destinationFormOpen && (
                <AdminFormModal
                  title={editingDestination ? `Edit: ${editingDestination.name}` : 'Add New Destination'}
                  icon={Globe}
                  onClose={() => {
                    if (destinationDirty && !window.confirm('You have unsaved changes. Discard them and close?')) return;
                    setDestinationFormOpen(false);
                    setEditingDestination(null);
                    setDestinationDirty(false);
                  }}
                  dirty={destinationDirty}
                  fullscreen={false}
                >
                  <DestinationForm
                    initial={editingDestination}
                    onSave={handleSaveDestination}
                    onDelete={(id) => {
                      handleDeleteDestination(id);
                      setDestinationFormOpen(false);
                      setEditingDestination(null);
                      setDestinationDirty(false);
                    }}
                    onCancel={() => {
                      if (destinationDirty && !window.confirm('You have unsaved changes. Discard them and close?')) return;
                      setDestinationFormOpen(false);
                      setEditingDestination(null);
                      setDestinationDirty(false);
                    }}
                    onDirtyChange={setDestinationDirty}
                  />
                </AdminFormModal>
              )}
            </div>
          )}

          {/* ==================== TAB: BACKGROUND MIXER STUDIO ==================== */}
          {activeTab === 'bgmixer' && (() => {

            const currentDest = destinations.find(d => d.id === selectedDestForMix) || destinations[0] || {};
            
            const handleUpdateMix = (patch) => {
              const updated = catalogService.updateDestination(currentDest.id, patch);
              setDestinations(updated);
              if (getLastWriteOk()) {
                showCatalogMsg(`Mixed background updated for ${currentDest.name}!`);
              } else {
                showCatalogMsg(`⚠️ Could not save — image files are too large for the browser storage. Use smaller photos.`);
              }
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
                      onClick={() => {
                        catalogService.updateDestination(currentDest.id, {});
                        if (getLastWriteOk()) {
                          showCatalogMsg(`Live background mix published for ${currentDest.name}! Changes are now on the website hero.`);
                        } else {
                          showCatalogMsg(`⚠️ Could not save — image files are too large for the browser storage. Use smaller photos.`);
                        }
                      }}
                      style={{ width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '0.85rem' }}
                    >
                      <Save size={18} /> Publish Background Blend to Website
                    </button>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.5rem' }}>
                      Tip: every image change is auto-saved. This button re-saves & confirms it is live.
                    </p>
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
            <div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-gold)', color: 'var(--gold-light)' }}>
                      <th style={{ padding: '0.8rem' }}>Inquiry ID / Date</th>
                      <th style={{ padding: '0.8rem' }}>Customer Details</th>
                      <th style={{ padding: '0.8rem' }}>Tour / Package</th>
                      <th style={{ padding: '0.8rem' }}>Status</th>
                      <th style={{ padding: '0.8rem', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inquiries.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                          No inquiries found.
                        </td>
                      </tr>
                    ) : inquiries.map((inq) => (
                      <tr key={inq.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255,255,255,0.01)' }}>
                        <td style={{ padding: '0.8rem' }}>
                          <div style={{ fontWeight: 700, color: 'var(--gold-light)' }}>{inq.id}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{inq.date}</div>
                        </td>
                        <td style={{ padding: '0.8rem' }}>
                          <div style={{ fontWeight: 700, fontSize: '1rem', color: '#fff' }}>{inq.customerName || inq.name}</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--gold-light)' }}>{inq.phone}</div>
                          {inq.email && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inq.email}</div>}
                        </td>
                        <td style={{ padding: '0.8rem', maxWidth: '220px', color: '#fff' }}>
                          <div style={{ fontWeight: 600 }}>{inq.tour || inq.subject || 'General Enquiry'}</div>
                          {inq.message && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.3rem' }}>"{inq.message}"</div>}
                        </td>
                        <td style={{ padding: '0.8rem' }}>
                          <span style={{
                            padding: '0.25rem 0.65rem',
                            borderRadius: '12px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            background: inq.status === 'Responded / Contacted' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                            color: inq.status === 'Responded / Contacted' ? '#10b981' : '#f59e0b'
                          }}>
                            {inq.status || 'New Inquiry'}
                          </span>
                        </td>
                        <td style={{ padding: '0.8rem', textAlign: 'right' }}>
                          <button
                            onClick={() => handleUpdateInquiryStatus(inq.id, inq.status === 'Responded / Contacted' ? 'New Inquiry' : 'Responded / Contacted')}
                            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-gold)', color: '#fff', padding: '0.3rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem' }}
                          >
                            Toggle Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
                      {s.bookingStartDate && (
                        <span style={{ display: 'block', fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                          📅 Bookings open: {s.bookingStartDate}
                        </span>
                      )}
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
              {/* Header & Controls */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--gold-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                    <Package size={22} color="var(--gold-primary)" /> Tour Packages Manager
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginTop: '0.3rem' }}>
                    View, preview, create and edit all tour packages shown on your public website.
                  </p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
                  {/* Instant Search Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-gold)', borderRadius: '25px', padding: '0.45rem 1rem', width: '260px' }}>
                    <Search size={15} color="var(--gold-primary)" />
                    <input
                      type="text"
                      placeholder="Search packages by name or place..."
                      value={tourSearchTerm}
                      onChange={(e) => setTourSearchTerm(e.target.value)}
                      style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.84rem', width: '100%', outline: 'none' }}
                    />
                  </div>

                  <button
                    className="btn-gold"
                    style={{ padding: '0.6rem 1.4rem', fontSize: '0.88rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                    onClick={() => { setEditingTour(null); setTourDirty(false); setTourFormOpen(true); }}
                  >
                    <Plus size={18} /> Add New Tour Package
                  </button>
                </div>
              </div>

              {/* Notification Toast Message */}
              {catalogMsg && (
                <div style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', background: 'rgba(16,185,129,0.18)', border: '1px solid #10b981', color: '#6ee7b7', marginBottom: '1.5rem', fontSize: '0.88rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Sparkles size={16} /> {catalogMsg}
                </div>
              )}
              {/* Helper for Tour Active Status based on Start Date */}
              {(() => {
                const isTourActive = (departureDate) => {
                  if (!departureDate) return true;
                  try {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const tourDate = new Date(`${departureDate}T00:00:00`);
                    if (isNaN(tourDate.getTime())) return true;
                    return tourDate >= today;
                  } catch {
                    return true;
                  }
                };

                const activeCount = tours.filter(p => isTourActive(p.departureDate)).length;
                const inactiveCount = tours.filter(p => !isTourActive(p.departureDate)).length;

                const rawFiltered = tours.filter(p => {
                  const isActive = isTourActive(p.departureDate);
                  if (tourStatusFilter === 'active' && !isActive) return false;
                  if (tourStatusFilter === 'inactive' && isActive) return false;
                  if (!tourSearchTerm.trim()) return true;
                  const q = tourSearchTerm.toLowerCase();
                  return (p.title || '').toLowerCase().includes(q) ||
                    (p.subtitle || '').toLowerCase().includes(q) ||
                    (Array.isArray(p.mainPlaces) ? p.mainPlaces.join(' ') : String(p.mainPlaces || '')).toLowerCase().includes(q) ||
                    (p.badge || '').toLowerCase().includes(q);
                });
                const filteredTours = sortToursUpcomingFirst(rawFiltered);

                return (
                  <>
                    {/* Status Filter Tabs */}
                    <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.2rem', flexWrap: 'wrap', alignItems: 'center' }}>
                      <button
                        type="button"
                        onClick={() => setTourStatusFilter('all')}
                        style={{
                          background: tourStatusFilter === 'all' ? 'var(--gold-primary)' : 'rgba(255,255,255,0.06)',
                          color: tourStatusFilter === 'all' ? '#000' : '#fff',
                          border: tourStatusFilter === 'all' ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '20px',
                          padding: '0.35rem 0.9rem',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        All Packages ({tours.length})
                      </button>

                      <button
                        type="button"
                        onClick={() => setTourStatusFilter('active')}
                        style={{
                          background: tourStatusFilter === 'active' ? '#10b981' : 'rgba(16,185,129,0.12)',
                          color: tourStatusFilter === 'active' ? '#000' : '#6ee7b7',
                          border: '1px solid #10b981',
                          borderRadius: '20px',
                          padding: '0.35rem 0.9rem',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        🟢 Active ({activeCount})
                      </button>

                      <button
                        type="button"
                        onClick={() => setTourStatusFilter('inactive')}
                        style={{
                          background: tourStatusFilter === 'inactive' ? '#ef4444' : 'rgba(239,68,68,0.12)',
                          color: tourStatusFilter === 'inactive' ? '#fff' : '#fca5a5',
                          border: '1px solid #ef4444',
                          borderRadius: '20px',
                          padding: '0.35rem 0.9rem',
                          fontSize: '0.8rem',
                          fontWeight: 800,
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        🔴 Inactive / Departed ({inactiveCount})
                      </button>
                    </div>

                    {/* Tour Packages Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.4rem' }}>
                      {filteredTours.map((p) => {
                        const spotsCount = (p.sightseeing || p.placeImages || []).length;
                        const active = isTourActive(p.departureDate);
                        return (
                          <div key={p.id} className="glass-card" style={{ padding: '0', overflow: 'hidden', border: active ? '1px solid var(--border-gold)' : '1px solid rgba(239,68,68,0.4)', display: 'flex', flexDirection: 'column', borderRadius: '14px', background: 'rgba(6,12,23,0.85)' }}>
                            
                            {/* Package Cover Photo with Clean Top Header Bar */}
                            <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
                              <img src={p.image || './ooty-toy-train-real.jpg'} alt={p.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: active ? 'none' : 'grayscale(35%)' }} />
                              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,12,23,0.95) 0%, rgba(6,12,23,0.35) 50%, rgba(6,12,23,0.7) 100%)' }} />
                              
                              {/* Unified Top Header Bar: Badge on Left, Day/Night Duration on Right */}
                              <div style={{ position: 'absolute', top: '10px', left: '10px', right: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', zIndex: 5 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', maxWidth: '65%' }}>
                                  {p.badge ? (
                                    <span style={{
                                      background: 'rgba(6,12,23,0.9)',
                                      border: '1px solid var(--border-gold)',
                                      color: 'var(--gold-light)',
                                      fontSize: '0.72rem',
                                      fontWeight: 800,
                                      padding: '0.25rem 0.65rem',
                                      borderRadius: '12px',
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis'
                                    }}>
                                      {p.badge}
                                    </span>
                                  ) : null}

                                  {/* Active / Inactive Status Pill */}
                                  <span style={{
                                    background: active ? 'rgba(16,185,129,0.92)' : 'rgba(239,68,68,0.92)',
                                    color: '#fff',
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '10px',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {active ? '🟢 Active' : '🔴 Inactive'}
                                  </span>
                                </div>

                                {/* Top Right Duration Pill */}
                                <span style={{
                                  background: 'rgba(16,185,129,0.92)',
                                  color: '#fff',
                                  fontSize: '0.74rem',
                                  fontWeight: 800,
                                  padding: '0.25rem 0.65rem',
                                  borderRadius: '12px',
                                  whiteSpace: 'nowrap',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.3rem',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                                  marginLeft: 'auto'
                                }}>
                                  <Clock size={12} /> {p.duration || '3 Days / 2 Nights'}
                                </span>
                              </div>

                              {/* Bottom Photo Overlay: Selling Price & Departure Date */}
                              <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', zIndex: 5 }}>
                                <div>
                                  <span style={{ fontSize: '0.66rem', color: 'rgba(255,255,255,0.7)', display: 'block', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.04em' }}>Selling Price</span>
                                  <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--gold-deep)', textShadow: '0 2px 8px rgba(0,0,0,0.95)', lineHeight: 1.1 }}>
                                    ₹{p.price ? Number(p.price).toLocaleString('en-IN') : '0'} <span style={{ fontSize: '0.72rem', color: '#fff', fontWeight: 500 }}>/ person</span>
                                  </div>
                                </div>

                                {p.departureDate && (
                                  <span style={{ fontSize: '0.72rem', color: active ? '#fef08a' : '#fca5a5', fontWeight: 700, background: 'rgba(0,0,0,0.75)', border: active ? '1px solid rgba(212,175,55,0.3)' : '1px solid rgba(239,68,68,0.4)', padding: '0.25rem 0.55rem', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                                    <Calendar size={11} color={active ? 'var(--gold-primary)' : '#ef4444'} /> {p.departureDate}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Card Body */}
                            <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                              
                              {/* Title & Subtitle */}
                              <h4 style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff', margin: '0 0 0.35rem', lineHeight: 1.35 }}>
                                {p.title}
                              </h4>
                              {p.subtitle && (
                                <p style={{ color: 'var(--gold-light)', fontSize: '0.8rem', margin: '0 0 0.75rem', fontStyle: 'italic', lineHeight: 1.4 }}>
                                  "{p.subtitle}"
                                </p>
                              )}

                              {/* Structured Day/Night Duration & Spots Count Ribbon */}
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                                <span style={{
                                  background: 'rgba(212,175,55,0.12)',
                                  border: '1px solid rgba(212,175,55,0.3)',
                                  color: '#fef08a',
                                  fontSize: '0.74rem',
                                  fontWeight: 700,
                                  padding: '0.25rem 0.6rem',
                                  borderRadius: '8px',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.35rem'
                                }}>
                                  <Clock size={12} color="var(--gold-primary)" /> {p.duration || '3 Days / 2 Nights'}
                                </span>

                                {spotsCount > 0 && (
                                  <span style={{
                                    background: 'rgba(168,85,247,0.12)',
                                    border: '1px solid rgba(168,85,247,0.3)',
                                    color: '#d8b4fe',
                                    fontSize: '0.74rem',
                                    fontWeight: 700,
                                    padding: '0.25rem 0.6rem',
                                    borderRadius: '8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem'
                                  }}>
                                    📍 {spotsCount} Sightseeing Spots
                                  </span>
                                )}
                              </div>

                              {/* Places Chips */}
                              {p.mainPlaces && (
                                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                  {(Array.isArray(p.mainPlaces) ? p.mainPlaces : String(p.mainPlaces).split(',')).slice(0, 4).map((place, pIdx) => (
                                    <span key={pIdx} style={{
                                      background: 'rgba(255,255,255,0.06)',
                                      border: '1px solid rgba(255,255,255,0.1)',
                                      color: 'var(--text-muted)',
                                      fontSize: '0.72rem',
                                      padding: '0.2rem 0.55rem',
                                      borderRadius: '10px',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      gap: '0.25rem'
                                    }}>
                                      <MapPin size={10} color="var(--gold-light)" /> {typeof place === 'string' ? place.trim() : place}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Card Actions Footer */}
                              <div style={{ display: 'flex', gap: '0.6rem', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.9rem' }}>
                                <button
                                  type="button"
                                  onClick={() => setPreviewTourPkg(p)}
                                  className="btn-glass"
                                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                                  title="Preview live traveler experience"
                                >
                                  <Eye size={15} color="var(--gold-primary)" /> Preview
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => { setEditingTour(p); setTourDirty(false); setTourFormOpen(true); }}
                                  className="btn-gold"
                                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.82rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}
                                >
                                  <Pencil size={14} /> Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteTour(p.id)}
                                  style={{
                                    background: 'rgba(239,68,68,0.14)',
                                    border: '1px solid rgba(239,68,68,0.4)',
                                    color: '#f87171',
                                    borderRadius: '10px',
                                    padding: '0.5rem 0.85rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.35rem',
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    transition: 'all 0.2s ease'
                                  }}
                                  title="Delete Tour Package permanently"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </div>

                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
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
                  <ImagePlus size={16} /> Add Gallery Photo
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

          {/* ==================== TAB: REVIEWS & RATINGS ==================== */}
          {activeTab === 'reviews' && (() => {
            const filteredReviews = reviews.filter(r => {
              const q = reviewSearchTerm.toLowerCase();
              return (
                (r.name && r.name.toLowerCase().includes(q)) ||
                (r.email && r.email.toLowerCase().includes(q)) ||
                (r.trip && r.trip.toLowerCase().includes(q)) ||
                (r.review && r.review.toLowerCase().includes(q))
              );
            });

            const avgRating = reviews.length
              ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
              : '5.0';

            const fiveStarCount = reviews.filter(r => Number(r.rating) === 5).length;

            return (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                      Traveler Reviews & Star Ratings
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '0.2rem' }}>
                      Manage public traveler ratings. All reviews are permanently synchronized with Firebase Firestore cloud.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      background: 'rgba(245, 158, 11, 0.15)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      padding: '0.4rem 0.85rem',
                      borderRadius: '20px'
                    }}>
                      <Star size={16} fill="#f59e0b" color="#f59e0b" />
                      <span style={{ fontWeight: 800, color: '#fbbf24', fontSize: '0.9rem' }}>
                        Avg {avgRating} / 5.0
                      </span>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem' }}>
                        ({fiveStarCount} Five-Star)
                      </span>
                    </div>

                    <button 
                      className="btn-gold" 
                      style={{ padding: '0.5rem 1.2rem', fontSize: '0.85rem' }} 
                      onClick={() => setReviewFormOpen(true)}
                    >
                      <Plus size={16} /> Add Verified Review
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div style={{ marginBottom: '1.5rem', position: 'relative', maxWidth: '400px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                  <input
                    type="text"
                    placeholder="Search reviews by traveler name, email, trip..."
                    value={reviewSearchTerm}
                    onChange={(e) => setReviewSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.6rem 1rem 0.6rem 2.4rem',
                      borderRadius: '10px',
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Reviews Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.2rem' }}>
                  {filteredReviews.map((r) => {
                    const numRating = Number(r.rating) || 5;
                    return (
                      <div key={r.id} className="glass-card" style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', background: '#091322' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.98rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <span>{r.name}</span>
                              <Check size={14} color="#10b981" />
                            </div>
                            <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.1rem' }}>
                              {r.email} • {r.createdAt}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteReview(r.id)}
                            style={{ background: 'rgba(239,68,68,0.15)', border: 'none', color: '#ef4444', padding: '0.45rem', borderRadius: '8px', cursor: 'pointer' }}
                            title="Delete Review"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {/* Stars and Score Badge */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0' }}>
                          <RatingStars value={numRating} size={15} />
                          <span style={{
                            background: 'rgba(245, 158, 11, 0.2)',
                            border: '1px solid rgba(245, 158, 11, 0.5)',
                            color: '#fbbf24',
                            fontWeight: 800,
                            fontSize: '0.75rem',
                            padding: '0.15rem 0.45rem',
                            borderRadius: '6px'
                          }}>
                            ★ {numRating.toFixed(1)} / 5.0
                          </span>
                        </div>

                        {r.trip && (
                          <span className="badge-emerald" style={{ alignSelf: 'flex-start', fontSize: '0.7rem' }}>
                            {r.trip}
                          </span>
                        )}

                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                          "{r.review}"
                        </p>

                        {r.image && (
                          <div style={{ borderRadius: '8px', overflow: 'hidden', maxHeight: '140px', border: '1px solid rgba(245,158,11,0.3)', marginTop: '0.2rem' }}>
                            <img src={r.image} alt="Travel Photo" style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {filteredReviews.length === 0 && (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '3rem 0' }}>
                    No reviews found matching "{reviewSearchTerm}".
                  </p>
                )}
              </div>
            );
          })()}

        </div>

        {/* Add Verified Review Modal */}
        {reviewFormOpen && (
          <AdminFormModal
            title="Add Verified Traveler Review"
            icon={Star}
            onClose={() => setReviewFormOpen(false)}
          >
            <form onSubmit={handleSaveAdminReview} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', padding: '1rem 0' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#ffffff' }}>
                  Traveler Full Name *
                </label>
                <input
                  value={adminReviewForm.name}
                  onChange={(e) => setAdminReviewForm({ ...adminReviewForm, name: e.target.value })}
                  placeholder="e.g. Ramesh Menon"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0b1626', border: '1px solid rgba(245,158,11,0.4)', color: '#fff', outline: 'none' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#ffffff' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  value={adminReviewForm.email}
                  onChange={(e) => setAdminReviewForm({ ...adminReviewForm, email: e.target.value })}
                  placeholder="traveler@example.com"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0b1626', border: '1px solid rgba(245,158,11,0.4)', color: '#fff', outline: 'none' }}
                  required
                />
              </div>

              <div style={{ padding: '0.8rem', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.3)' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: '#fbbf24' }}>
                  Rating Stars *
                </label>
                <RatingStars
                  value={adminReviewForm.rating}
                  onChange={(r) => setAdminReviewForm({ ...adminReviewForm, rating: r })}
                  size={24}
                  showLabel={true}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#ffffff' }}>
                  Tour Package Name (Optional)
                </label>
                <input
                  value={adminReviewForm.trip}
                  onChange={(e) => setAdminReviewForm({ ...adminReviewForm, trip: e.target.value })}
                  placeholder="e.g. Sacred North Yatra: Kashi, Ayodhya & Prayagraj"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0b1626', border: '1px solid rgba(245,158,11,0.4)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#ffffff' }}>
                  Review & Experience Text *
                </label>
                <textarea
                  value={adminReviewForm.review}
                  onChange={(e) => setAdminReviewForm({ ...adminReviewForm, review: e.target.value })}
                  placeholder="Share feedback on arrangements, food, darshan, guides..."
                  rows={4}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0b1626', border: '1px solid rgba(245,158,11,0.4)', color: '#fff', outline: 'none', resize: 'vertical' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem', color: '#ffffff' }}>
                  Travel Photo (Optional URL or base64)
                </label>
                <input
                  value={adminReviewForm.image}
                  onChange={(e) => setAdminReviewForm({ ...adminReviewForm, image: e.target.value })}
                  placeholder="https://... or data:image/..."
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', background: '#0b1626', border: '1px solid rgba(245,158,11,0.4)', color: '#fff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-gold" style={{ flex: 1, justifyContent: 'center' }}>
                  <Check size={16} /> Save to Firebase Cloud
                </button>
                <button type="button" className="btn-glass" onClick={() => setReviewFormOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </AdminFormModal>
        )}

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
            fullscreen
            dirty={tourDirty}
            onClose={() => { setTourFormOpen(false); setEditingTour(null); setTourDirty(false); }}
          >
            <TourForm
              initial={editingTour}
              onSave={handleSaveTour}
              onDelete={(id) => {
                handleDeleteTour(id);
                setTourFormOpen(false);
                setEditingTour(null);
                setTourDirty(false);
              }}
              onDirtyChange={() => setTourDirty(true)}
              onCancel={() => {
                if (tourDirty && !window.confirm('You have unsaved changes in this tour. Discard them and close?')) return;
                setTourFormOpen(false); setEditingTour(null); setTourDirty(false);
              }}
            />
          </AdminFormModal>
        )}

        {/* Gallery Item Add/Edit Modal */}
        {galleryFormOpen && (
          <AdminFormModal
            title={editingGallery ? 'Edit Gallery Photo' : 'Add Gallery Photo'}
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

        {/* Live Traveler Experience Preview Modal */}
        {previewTourPkg && (
          <PackageModal
            pkg={previewTourPkg}
            onClose={() => setPreviewTourPkg(null)}
            onBookTour={() => setPreviewTourPkg(null)}
          />
        )}

      </div>
    </div>
  );
}
