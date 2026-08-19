import React, { useState } from 'react';
import { X, Phone, User, MessageCircle, Mail } from 'lucide-react';
import { firestoreService } from '../services/firebase';
import { openWhatsApp, buildQuickEnquiryMessage } from '../services/whatsapp';
import { useLanguage } from '../i18n/LanguageContext';

export default function EnquiryModal({ initialData, onClose }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const src = initialData || {};
  const title = src.title || src.packageName || src.name || (src.isGeneral ? 'General Travel Enquiry' : 'Custom Tour Package');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.phone.trim()) {
      setError('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const inquiryData = {
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email || 'Not provided',
        tour: title,
      };
      
      // Save to Firebase/Local Storage
      await firestoreService.createInquiry(inquiryData);
      
      // Redirect to WhatsApp
      openWhatsApp(buildQuickEnquiryMessage(initialData.isGeneral ? null : initialData));
      
      // Close Modal
      onClose();
    } catch (err) {
      console.error('Failed to save inquiry:', err);
      // Still open WhatsApp even if save fails, don't block the user
      openWhatsApp(buildQuickEnquiryMessage(initialData.isGeneral ? null : initialData));
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div 
        className="glass-card" 
        style={{
          width: '100%',
          maxWidth: '420px',
          margin: 'auto',
          position: 'relative',
          padding: '2rem',
          background: 'rgba(8, 18, 34, 0.95)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#fff',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <MessageCircle size={36} color="var(--gold-primary)" style={{ margin: '0 auto 0.5rem', filter: 'drop-shadow(0 0 10px rgba(245,158,11,0.3))' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: '0.2rem' }}>Send Enquiry</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Looking at: <strong style={{ color: 'var(--gold-light)' }}>{title}</strong>
          </p>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.8rem', marginTop: '0.6rem', lineHeight: 1.4 }}>
            Please share your details to proceed. We will connect you to our Thrissur experts on WhatsApp instantly!
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.8rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid rgba(239,68,68,0.2)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>Full Name <span style={{ color: 'var(--gold-primary)' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <User size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.5rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none', fontSize: '0.95rem' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--gold-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>Phone Number <span style={{ color: 'var(--gold-primary)' }}>*</span></label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="Your mobile number"
                style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.5rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none', fontSize: '0.95rem' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--gold-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>Email Address <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>(Optional)</span></label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="For quotes & itineraries"
                style={{ width: '100%', padding: '0.85rem 1rem 0.85rem 2.5rem', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none', fontSize: '0.95rem' }}
                onFocus={(e) => e.target.style.borderColor = 'var(--gold-primary)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-gold"
            style={{ 
              width: '100%', 
              padding: '0.95rem', 
              fontSize: '1.05rem', 
              marginTop: '0.8rem', 
              display: 'flex', 
              justifyContent: 'center', 
              gap: '0.6rem',
              boxShadow: '0 4px 15px rgba(37,211,102,0.2)'
            }}
          >
            {isSubmitting ? 'Connecting...' : 'Continue to WhatsApp'} <MessageCircle size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
