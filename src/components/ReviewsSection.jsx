import React, { useState, useRef, useEffect } from 'react';
import { reviewStorage } from '../services/reviews';
import { Star, Mail, User, MessageSquareText, Camera, Send, Quote, BadgeCheck, ImagePlus, X, ChevronLeft, ChevronRight } from 'lucide-react';
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

const RatingStars = ({ value, onChange, size = 18 }) => {
  return (
    <div style={{ display: 'flex', gap: '0.2rem', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          style={{
            background: 'none',
            border: 'none',
            cursor: onChange ? 'pointer' : 'default',
            padding: 0,
            color: star <= value ? 'var(--gold-primary)' : 'rgba(15,23,42,0.18)',
            transition: 'transform 0.2s ease',
            filter: star <= value ? 'drop-shadow(0 0 6px rgba(212,175,55,0.6))' : 'none'
          }}
          onMouseEnter={(e) => onChange && (e.currentTarget.style.transform = 'scale(1.25)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          <Star size={size} fill="currentColor" strokeWidth={0} />
        </button>
      ))}
    </div>
  );
};

const ReviewCard = ({ review }) => {
  const { t } = useLanguage();
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
            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{review.name}</span>
            <BadgeCheck size={16} color="var(--gold-primary)" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <Mail size={12} /> {review.email}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <RatingStars value={review.rating} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{review.createdAt}</span>
      </div>

      {review.trip && (
        <span className="badge-emerald" style={{ alignSelf: 'flex-start', fontSize: '0.7rem' }}>
          <MessageSquareText size={12} /> {review.trip}
        </span>
      )}

      <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem', lineHeight: 1.7, margin: 0 }}>
        {review.review}
      </p>

      {review.image && (
        <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
          <img
            src={review.image}
            alt={`${review.name} travel photo`}
            style={{ width: '100%', maxHeight: '220px', objectFit: 'cover', display: 'block' }}
          />
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: 'auto', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        <Quote size={16} color="var(--gold-primary)" />
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{t('reviews.verified')}</span>
      </div>
    </div>
  );
};

export default function ReviewsSection() {
  const { t } = useLanguage();
  const [reviews, setReviews] = useState(() => reviewStorage.getReviews());
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', rating: 0, trip: '', review: '' });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [visible, setVisible] = useState(4);
  const fileInputRef = useRef(null);

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
    else if (form.review.trim().length < 10) errs.review = t('reviews.errReviewShort');
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const updated = reviewStorage.addReview({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      rating: form.rating,
      trip: form.trip.trim(),
      review: form.review.trim(),
      image: previewImage || undefined
    });
    setReviews(updated);
    setForm({ name: '', email: '', rating: 0, trip: '', review: '' });
    setPreviewImage(null);
    setCurrentIndex(0);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
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
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }}>
          <span className="badge-aurora" style={{ marginBottom: '0.8rem' }}>
            <Star size={14} /> {t('reviews.badge')}
          </span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: '0.8rem', color: '#0f172a' }}>
            {t('reviews.titleA')} <span className="text-aurora">{t('reviews.titleB')}</span>
          </h2>
          <p style={{ color: '#475569', fontSize: '1.1rem' }}>
            {t('reviews.subtitle')}
          </p>
        </div>

        {/* Write a Review Button / Form */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
          <button className="btn-gold" onClick={() => setFormOpen(o => !o)} style={{ minWidth: '260px', justifyContent: 'center' }}>
            {formOpen ? <X size={18} /> : <MessageSquareText size={18} />}
            {formOpen ? t('reviews.closeForm') : t('reviews.write')}
          </button>
        </div>

        {formOpen && (
          <form
            onSubmit={handleSubmit}
            className="glass-card"
            style={{ maxWidth: '720px', margin: '0 auto 3rem', padding: '2rem' }}
          >
            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.3rem', fontFamily: 'var(--font-heading)' }}>
              {t('reviews.formTitle')}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              {t('reviews.formSubtitle')}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.2rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <User size={14} color="var(--gold-primary)" /> {t('reviews.fullName')}
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Anitha Menon"
                  style={inputStyle}
                />
                {fieldError('name')}
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                  <Mail size={14} color="var(--gold-primary)" /> {t('reviews.email')}
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  style={inputStyle}
                />
                {fieldError('email')}
              </div>
            </div>

            <div style={{ marginTop: '1.2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <Star size={14} color="var(--gold-primary)" /> {t('reviews.rating')}
              </label>
              <RatingStars value={form.rating} onChange={(r) => { setForm({ ...form, rating: r }); setErrors({ ...errors, rating: undefined }); }} size={28} />
              {fieldError('rating')}
            </div>

            <div style={{ marginTop: '1.2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <MessageSquareText size={14} color="var(--gold-primary)" /> {t('reviews.tripLabel')}
              </label>
              <select
                value={form.trip}
                onChange={(e) => setForm({ ...form, trip: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="" style={{ color: '#0f172a', background: '#ffffff' }}>{t('reviews.selectTour')}</option>
                <option style={{ color: '#0f172a', background: '#ffffff' }}>Kashmir Paradise & Punjab Golden Trail</option>
                <option style={{ color: '#0f172a', background: '#ffffff' }}>Sacred North Yatra: Kashi, Ayodhya & Prayagraj</option>
                <option style={{ color: '#0f172a', background: '#ffffff' }}>Emerald Escapes: Munnar, Ooty & Parambikulam</option>
                <option style={{ color: '#0f172a', background: '#ffffff' }}>Sacred South Temple Trails</option>
                <option style={{ color: '#0f172a', background: '#ffffff' }}>Andaman Island Paradise</option>
                <option style={{ color: '#0f172a', background: '#ffffff' }}>Other / Custom Tour</option>
              </select>
            </div>

            <div style={{ marginTop: '1.2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <MessageSquareText size={14} color="var(--gold-primary)" /> {t('reviews.reviewLabel')}
              </label>
              <textarea
                value={form.review}
                onChange={(e) => setForm({ ...form, review: e.target.value })}
                placeholder={t('reviews.reviewPlaceholder')}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical', minHeight: '110px' }}
              />
              {fieldError('review')}
            </div>

            <div style={{ marginTop: '1.2rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                <Camera size={14} color="var(--gold-primary)" /> {t('reviews.photoLabel')}
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
                  style={{ padding: '0.7rem 1.4rem', fontSize: '0.85rem' }}
                >
                  <ImagePlus size={16} /> {t('reviews.choosePhoto')}
                </button>
              )}
              {fieldError('image')}
            </div>

            {success && (
              <div style={{
                marginTop: '1.2rem', padding: '0.9rem 1.2rem', borderRadius: '10px',
                background: 'rgba(16,185,129,0.12)', border: '1px solid var(--emerald-accent)',
                color: 'var(--emerald-accent)', fontSize: '0.9rem', fontWeight: 600
              }}>
                {t('reviews.success')}
              </div>
            )}

            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button type="submit" className="btn-gold">
                <Send size={16} /> {t('reviews.publish')}
              </button>
              <button type="button" className="btn-glass" onClick={() => setFormOpen(false)}>
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
                background: 'rgba(4,8,16,0.8)'
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
                background: 'rgba(4,8,16,0.8)'
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
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.8rem' }}>
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
  background: 'rgba(255,255,255,0.92)',
  border: '1px solid var(--border-gold)',
  borderRadius: '10px',
  color: '#0f172a',
  padding: '0.8rem 1rem',
  fontSize: '0.92rem',
  outline: 'none',
  transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  boxSizing: 'border-box'
};
