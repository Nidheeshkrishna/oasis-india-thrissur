import React, { useState, useRef, useEffect, useMemo } from 'react';
import { reviewStorage } from '../services/reviews';
import { 
  Star, Mail, User, MessageSquareText, Camera, Send, Quote, 
  BadgeCheck, ImagePlus, X, ChevronLeft, ChevronRight, Loader2, Sparkles, CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

const AVATAR_COLORS = [
  'linear-gradient(135deg, #d4af37, #aa841c)',
  'linear-gradient(135deg, #10b981, #047857)',
  'linear-gradient(135deg, #f472b6, #be185d)',
  'linear-gradient(135deg, #60a5fa, #1d4ed8)',
  'linear-gradient(135deg, #fbbf24, #d97706)',
  'linear-gradient(135deg, #a78bfa, #6d28d9)',
  'linear-gradient(135deg, #34d399, #059669)',
  'linear-gradient(135deg, #fb7185, #e11d48)'
];

const getInitials = (name = '') => {
  return name.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('') || 'R';
};

const getAvatarColor = (email = '') => {
  let hash = 0;
  for (let i = 0; i < email.length; i++) hash = (hash * 31 + email.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

/**
 * Enhanced RatingStars Component with 100% visibility, hover animation, and clear contrast
 */
export const RatingStars = ({ value = 5, onChange, size = 18, showLabel = false }) => {
  const [hoverRating, setHoverRating] = useState(0);
  const activeRating = hoverRating || Number(value) || 0;

  const RATING_LABELS = {
    1: '⭐ 1.0 Star - Needs Improvement',
    2: '⭐⭐ 2.0 Stars - Fair Experience',
    3: '⭐⭐⭐ 3.0 Stars - Good Tour',
    4: '⭐⭐⭐⭐ 4.0 Stars - Very Good Experience',
    5: '⭐⭐⭐⭐⭐ 5.0 Stars - Exceptional & Highly Recommended'
  };

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: '0.4rem' }}>
      <div 
        style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}
        onMouseLeave={() => onChange && setHoverRating(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = star <= activeRating;
          return (
            <button
              key={star}
              type="button"
              onClick={() => onChange && onChange(star)}
              onMouseEnter={() => onChange && setHoverRating(star)}
              style={{
                background: isFilled 
                  ? 'rgba(245, 158, 11, 0.18)' 
                  : (onChange ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.04)'),
                border: isFilled 
                  ? '1px solid #f59e0b' 
                  : (onChange ? '1px solid rgba(255, 255, 255, 0.28)' : '1px solid rgba(255, 255, 255, 0.15)'),
                borderRadius: '8px',
                padding: onChange ? '6px 8px' : '4px 5px',
                cursor: onChange ? 'pointer' : 'default',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: onChange && hoverRating >= star ? 'scale(1.18)' : 'scale(1)',
                boxShadow: isFilled ? '0 0 10px rgba(245, 158, 11, 0.45)' : 'none'
              }}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
            >
              <Star
                size={size}
                fill={isFilled ? '#f59e0b' : 'none'}
                color={isFilled ? '#f59e0b' : '#94a3b8'}
                strokeWidth={isFilled ? 1.5 : 2}
                style={{
                  filter: isFilled ? 'drop-shadow(0 0 4px rgba(245, 158, 11, 0.8))' : 'none',
                  transition: 'all 0.2s ease'
                }}
              />
            </button>
          );
        })}
      </div>
      {showLabel && onChange && (
        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: activeRating > 0 ? '#fbbf24' : 'rgba(255, 255, 255, 0.7)', minHeight: '1.2rem', transition: 'all 0.2s ease' }}>
          {activeRating > 0 ? RATING_LABELS[activeRating] : '👈 Click to select rating (1 to 5 Stars)'}
        </div>
      )}
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const { t } = useLanguage();
  const numericRating = Number(review.rating) || 5;

  return (
    <div className="glass-card" style={{ padding: '1.8rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: getAvatarColor(review.email),
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 800,
          fontSize: '1.1rem',
          fontFamily: 'var(--font-heading)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.4)',
          flexShrink: 0
        }}>
          {getInitials(review.name)}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>{review.name}</span>
            <BadgeCheck size={16} color="#10b981" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Mail size={12} /> {review.email}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <RatingStars value={numericRating} size={16} />
          <span style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.1))',
            border: '1px solid rgba(245, 158, 11, 0.5)',
            color: '#fbbf24',
            fontSize: '0.78rem',
            fontWeight: 800,
            padding: '0.15rem 0.5rem',
            borderRadius: '8px',
            boxShadow: '0 0 8px rgba(245, 158, 11, 0.2)'
          }}>
            ★ {numericRating.toFixed(1)} / 5.0
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>{review.createdAt}</span>
      </div>

      {review.trip && (
        <span className="badge-emerald" style={{ alignSelf: 'flex-start', fontSize: '0.7rem' }}>
          <MessageSquareText size={12} /> {review.trip}
        </span>
      )}

      <p style={{ color: 'rgba(255,255,255,0.92)', fontSize: '0.94rem', lineHeight: 1.7, margin: 0, flexGrow: 1 }}>
        "{review.review}"
      </p>

      {review.image && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-gold)', marginTop: '0.2rem' }}>
          <img
            src={review.image}
            alt={`${review.name} travel experience`}
            style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <Quote size={16} color="var(--gold-primary)" />
        <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }}>{t('reviews.verified')}</span>
      </div>
    </div>
  );
};

export default function ReviewsSection() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState(() => reviewStorage.getReviews());
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', rating: 5, trip: '', review: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visible, setVisible] = useState(4);
  const fileInputRef = useRef(null);

  // Subscribe to real-time review updates and fetch latest from Firebase Firestore
  useEffect(() => {
    const unsubscribe = reviewStorage.subscribe((latestReviews) => {
      setReviews(latestReviews);
    });
    // Cloud sync in background
    reviewStorage.fetchReviewsFromCloud();
    return () => unsubscribe();
  }, []);

  // Calculate Average Rating and Statistics
  const { avgRating, totalCount, fiveStarCount } = useMemo(() => {
    if (!reviews || reviews.length === 0) return { avgRating: '5.0', totalCount: 0, fiveStarCount: 0 };
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0);
    const avg = (sum / reviews.length).toFixed(1);
    const fiveStars = reviews.filter(r => Number(r.rating) === 5).length;
    return { avgRating: avg, totalCount: reviews.length, fiveStarCount: fiveStars };
  }, [reviews]);

  useEffect(() => {
    const getVisible = () => {
      if (typeof window === 'undefined') return 4;
      if (window.innerWidth < 640) return 1;
      if (window.innerWidth < 1024) return 2;
      return 4;
    };
    const handleResize = () => setVisible(getVisible());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, reviews.length - visible);

  useEffect(() => {
    if (currentIndex > maxIndex) setCurrentIndex(maxIndex);
  }, [maxIndex, currentIndex]);

  useEffect(() => {
    if (reviews.length <= visible || isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [reviews.length, visible, maxIndex, isPaused]);

  const goPrev = () => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goNext = () => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = t('reviews.errName');
    if (!form.email.trim()) errs.email = t('reviews.errEmail');
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = t('reviews.errEmailInvalid');
    if (!form.rating) errs.rating = t('reviews.errRating');
    if (!form.review.trim()) errs.review = t('reviews.errReview');
    else if (form.review.trim().length < 8) errs.review = t('reviews.errReviewShort');
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setIsSubmitting(true);
    try {
      const updated = await reviewStorage.addReview({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        rating: Number(form.rating) || 5,
        trip: form.trip.trim(),
        review: form.review.trim(),
        image: previewImage || undefined
      });
      setReviews(updated);
      setForm({ name: '', email: '', rating: 5, trip: '', review: '' });
      setPreviewImage(null);
      setCurrentIndex(0);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4500);
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: t('reviews.errImage') }));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, image: t('reviews.errImageSize') }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
    setErrors(prev => ({ ...prev, image: undefined }));
  };

  const fieldError = (key) => errors[key] && (
    <span style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.3rem', display: 'block' }}>{errors[key]}</span>
  );

  return (
    <section id="reviews" style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', background: 'linear-gradient(180deg, #f2f6fb 0%, #eefbf3 60%, #ffffff 100%)', borderTop: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
      {/* Colorful ambient orbs */}
      <div className="orb" style={{ width: '340px', height: '340px', background: 'var(--violet)', top: '-80px', left: '-80px' }} />
      <div className="orb" style={{ width: '300px', height: '300px', background: 'var(--emerald-accent)', bottom: '-60px', right: '-90px', animationDelay: '-7s' }} />

      <div className="container">

        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 2.5rem' }}>
          <span className="badge-aurora" style={{ marginBottom: '0.8rem' }}>
            <Star size={14} fill="#f59e0b" color="#f59e0b" /> {t('reviews.badge')}
          </span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.8rem', color: '#0f172a' }}>
            {t('reviews.titleA')} <span className="text-aurora">{t('reviews.titleB')}</span>
          </h2>
          <p style={{ color: '#475569', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            {t('reviews.subtitle')}
          </p>

          {/* Overall Rating & Trust Summary Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '1rem',
            padding: '0.65rem 1.4rem',
            borderRadius: '50px',
            background: 'linear-gradient(135deg, #091322, #0d1e35)',
            border: '1px solid rgba(245, 158, 11, 0.4)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <RatingStars value={Math.round(Number(avgRating))} size={16} />
              <span style={{ fontWeight: 800, color: '#fbbf24', fontSize: '1.1rem', marginLeft: '0.2rem' }}>
                {avgRating}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>/ 5.0</span>
            </div>
            <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ color: '#ffffff', fontSize: '0.88rem', fontWeight: 600 }}>
              {totalCount} Verified Traveler Reviews
            </span>
            <span style={{ width: '1px', height: '16px', background: 'rgba(255,255,255,0.2)' }} />
            <span style={{ color: '#10b981', fontSize: '0.82rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <CheckCircle2 size={14} /> 100% Real Travelers
            </span>
          </div>
        </div>

        {/* Write a Review Button */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
          <button className="btn-gold" onClick={() => setFormOpen(o => !o)} style={{ minWidth: '260px', justifyContent: 'center' }}>
            {formOpen ? <X size={18} /> : <MessageSquareText size={18} />}
            {formOpen ? t('reviews.closeForm') : t('reviews.write')}
          </button>
        </div>

        {/* Review Form */}
        {formOpen && (
          <form
            onSubmit={handleSubmit}
            className="glass-card"
            style={{ maxWidth: '720px', margin: '0 auto 3rem', padding: '2.2rem', background: '#091322', border: '1px solid rgba(245, 158, 11, 0.45)' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: '#ffffff' }}>
                {t('reviews.formTitle')}
              </h3>
              <span style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', color: '#fbbf24', fontSize: '0.76rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: '20px' }}>
                ☁️ Cloud Synced
              </span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {t('reviews.formSubtitle')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ffffff' }}>
                  <User size={14} color="#f59e0b" /> {t('reviews.fullName')}
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Anitha Menon"
                  style={inputStyle}
                  required
                />
                {fieldError('name')}
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ffffff' }}>
                  <Mail size={14} color="#f59e0b" /> {t('reviews.email')}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  style={inputStyle}
                  required
                />
                {fieldError('email')}
              </div>
            </div>

            {/* Interactive Rating Star Selection */}
            <div style={{ marginTop: '1.3rem', padding: '1rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.6rem', color: '#fbbf24' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" /> {t('reviews.rating')}
              </label>
              <RatingStars 
                value={form.rating} 
                onChange={(r) => { 
                  setForm({ ...form, rating: r }); 
                  setErrors({ ...errors, rating: undefined }); 
                }} 
                size={26} 
                showLabel={true}
              />
              {fieldError('rating')}
            </div>

            <div style={{ marginTop: '1.2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ffffff' }}>
                <MessageSquareText size={14} color="#f59e0b" /> {t('reviews.tripLabel')}
              </label>
              <select
                value={form.trip}
                onChange={(e) => setForm({ ...form, trip: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer', background: '#0b1626', color: '#ffffff' }}
              >
                <option value="" style={{ color: '#ffffff', background: '#0b1626' }}>{t('reviews.selectTour')}</option>
                <option style={{ color: '#ffffff', background: '#0b1626' }}>Kashmir Paradise & Punjab Golden Trail</option>
                <option style={{ color: '#ffffff', background: '#0b1626' }}>Sacred North Yatra: Kashi, Ayodhya & Prayagraj</option>
                <option style={{ color: '#ffffff', background: '#0b1626' }}>Emerald Escapes: Munnar, Ooty & Parambikulam</option>
                <option style={{ color: '#ffffff', background: '#0b1626' }}>Divine Odisha: Puri Jagannath, Konark & Bhubaneswar</option>
                <option style={{ color: '#ffffff', background: '#0b1626' }}>Sacred South Temple Trails: Madurai & Rameswaram</option>
                <option style={{ color: '#ffffff', background: '#0b1626' }}>Andaman Island Paradise</option>
                <option style={{ color: '#ffffff', background: '#0b1626' }}>Other / Custom Tour</option>
              </select>
            </div>

            <div style={{ marginTop: '1.2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ffffff' }}>
                <MessageSquareText size={14} color="#f59e0b" /> {t('reviews.reviewLabel')}
              </label>
              <textarea
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                placeholder={t('reviews.reviewPlaceholder')}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '110px' }}
                required
              />
              {fieldError('review')}
            </div>

            <div style={{ marginTop: '1.2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem', color: '#ffffff' }}>
                <Camera size={14} color="#f59e0b" /> {t('reviews.photoLabel')}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              {previewImage ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: '260px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
                  <img src={previewImage} alt="Preview" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', display: 'block' }} />
                  <button
                    type="button"
                    onClick={() => { setPreviewImage(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                    style={{
                      position: 'absolute', top: '8px', right: '8px',
                      background: 'rgba(0,0,0,0.7)', color: '#fff', border: 'none',
                      borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    aria-label={t('reviews.removePhoto')}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-glass"
                  onClick={() => fileInputRef.current?.click()}
                  style={{ padding: '0.7rem 1.4rem', fontSize: '0.85rem', background: 'rgba(255,255,255,0.08)', color: '#ffffff' }}
                >
                  <ImagePlus size={16} /> {t('reviews.choosePhoto')}
                </button>
              )}
              {fieldError('image')}
            </div>

            {success && (
              <div style={{
                marginTop: '1.2rem', padding: '1rem 1.3rem', borderRadius: '10px',
                background: 'rgba(16,185,129,0.18)', border: '1px solid #10b981',
                color: '#34d399', fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem'
              }}>
                <CheckCircle2 size={18} />
                {t('reviews.success')}
              </div>
            )}

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button type="submit" className="btn-gold" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving to Cloud...
                  </>
                ) : (
                  <>
                    <Send size={16} /> {t('reviews.publish')}
                  </>
                )}
              </button>
              <button type="button" className="btn-glass" onClick={() => setFormOpen(false)} style={{ color: '#ffffff' }}>
                {t('reviews.cancel')}
              </button>
            </div>
          </form>
        )}

        {/* Reviews Carousel */}
        {reviews.length > 0 ? (
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            style={{ position: 'relative', maxWidth: '1180px', margin: '0 auto' }}
          >
            {/* Prev / Next Arrows */}
            <button
              onClick={goPrev}
              aria-label="Previous reviews"
              className="btn-glass"
              style={{
                position: 'absolute', left: '-16px', top: '50%', transform: 'translateY(-50%)',
                width: '46px', height: '46px', padding: 0, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
                background: '#091322', color: '#ffffff', border: '1px solid rgba(245, 158, 11, 0.4)'
              }}
            >
              <ChevronLeft size={22} />
            </button>
            <button
              onClick={goNext}
              aria-label="Next reviews"
              className="btn-glass"
              style={{
                position: 'absolute', right: '-16px', top: '50%', transform: 'translateY(-50%)',
                width: '46px', height: '46px', padding: 0, borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2,
                background: '#091322', color: '#ffffff', border: '1px solid rgba(245, 158, 11, 0.4)'
              }}
            >
              <ChevronRight size={22} />
            </button>

            {/* Sliding Track */}
            <div style={{ overflow: 'hidden', padding: '0.5rem' }}>
              <div style={{
                display: 'flex',
                transition: 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: `translateX(-${currentIndex * (100 / visible)}%)`
              }}>
                {reviews.map((review) => (
                  <div key={review.id} style={{ flex: `0 0 ${100 / visible}%`, minWidth: 0, padding: '0 0.75rem', boxSizing: 'border-box', display: 'flex' }}>
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Indicator */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.6rem', marginTop: '1.6rem' }}>
              {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to review slide ${i + 1}`}
                  style={{
                    width: i === currentIndex ? '28px' : '10px',
                    height: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    cursor: 'pointer',
                    background: i === currentIndex ? 'linear-gradient(135deg, #f59e0b, #e11d48)' : 'rgba(15,23,42,0.2)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>

            {/* Counter */}
            <p style={{ textAlign: 'center', color: '#475569', fontSize: '0.84rem', marginTop: '0.8rem', fontWeight: 600 }}>
              {visible > 1
                ? t('reviews.showing', { from: currentIndex + 1, to: Math.min(currentIndex + visible, reviews.length), total: reviews.length })
                : t('reviews.counter', { current: currentIndex + 1, total: reviews.length })}
            </p>
          </div>
        ) : (
          <p style={{ textAlign: 'center', color: '#475569', padding: '3rem 0' }}>
            {t('reviews.noReviews')}
          </p>
        )}

      </div>
    </section>
  );
}

const inputStyle = {
  width: '100%',
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(245, 158, 11, 0.45)',
  borderRadius: '10px',
  color: '#ffffff',
  padding: '0.85rem 1rem',
  fontSize: '0.94rem',
  outline: 'none',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  boxSizing: 'border-box'
};
