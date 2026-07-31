import React, { useState, useEffect } from 'react';
import { 
  X, LayoutDashboard, Calendar, Users, Package, Image as ImageIcon, 
  BookOpen, ShieldCheck, Check, Trash2, Edit3, Plus, Search, Filter, RefreshCw, Key
} from 'lucide-react';
import { firestoreService } from '../services/firebase';
import { PACKAGES } from '../data/packagesData';
import { GALLERY_ITEMS } from '../data/galleryData';

export default function AdminDashboard({ onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [pinInput, setPinInput] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');
  
  // Data States
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [packagesList, setPackagesList] = useState(PACKAGES);
  const [galleryList, setGalleryList] = useState(GALLERY_ITEMS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Load Firestore Bookings & Inquiries
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    const bData = await firestoreService.getBookings();
    const iData = await firestoreService.getInquiries();
    setBookings(bData);
    setInquiries(iData);
  };

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
                OASIS Thrissur • Firebase Firestore Admin Console
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Real-time Sync Active • Project ID: oasis-india-thrissur
              </div>
            </div>
          </div>

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

        {/* Admin Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          padding: '0 2rem',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(12, 22, 38, 0.5)'
        }}>
          {[
            { id: 'bookings', label: 'Booking Management', icon: Calendar, count: bookings.length },
            { id: 'customers', label: 'Customer Inquiries', icon: Users, count: inquiries.length },
            { id: 'tours', label: 'Tour Packages', icon: Package, count: packagesList.length },
            { id: 'gallery', label: 'Gallery Management', icon: ImageIcon, count: galleryList.length },
            { id: 'blogs', label: 'Blog & News', icon: BookOpen, count: 3 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: isActive ? 'var(--gold-light)' : 'var(--text-muted)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? '700' : '500',
                  padding: '1rem 0.5rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  borderBottom: isActive ? '3px solid var(--gold-primary)' : '3px solid transparent'
                }}
              >
                <Icon size={16} color={isActive ? 'var(--gold-primary)' : 'var(--text-dim)'} />
                <span>{tab.label}</span>
                <span style={{
                  background: isActive ? 'rgba(212,175,55,0.2)' : 'rgba(255,255,255,0.06)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '10px',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content Section */}
        <div style={{ padding: '1.8rem', overflowY: 'auto', flexGrow: 1 }}>
          
          {/* TAB 1: BOOKING MANAGEMENT */}
          {activeTab === 'bookings' && (
            <div>
              {/* Search & Filter Bar */}
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

              {/* Bookings Table */}
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

          {/* TAB 2: CUSTOMER INQUIRIES */}
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

          {/* TAB 3: TOUR PACKAGES MANAGER */}
          {activeTab === 'tours' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                  Active Tour Packages Catalogue
                </h3>
                <button className="btn-gold" style={{ padding: '0.4rem 1rem', fontSize: '0.82rem' }}>
                  <Plus size={16} /> Add New Tour
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
                {packagesList.map((p) => (
                  <div key={p.id} className="glass-card" style={{ padding: '1.2rem' }}>
                    <img src={p.image} alt={p.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.8rem' }} />
                    <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.3rem' }}>{p.title}</div>
                    <div style={{ color: 'var(--gold-light)', fontSize: '0.85rem', fontWeight: 800 }}>₹{p.price.toLocaleString('en-IN')}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GALLERY MANAGER */}
          {activeTab === 'gallery' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--gold-light)' }}>
                  Licensed Photography Repository (100% Authentic)
                </h3>
                <button className="btn-gold" style={{ padding: '0.4rem 1rem', fontSize: '0.82rem' }}>
                  <Plus size={16} /> Upload Photo Metadata
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
                {galleryList.map((g) => (
                  <div key={g.id} className="glass-card" style={{ padding: '0.8rem' }}>
                    <img src={g.url} alt={g.title} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '6px', marginBottom: '0.4rem' }} />
                    <div style={{ fontSize: '0.8rem', fontWeight: 700 }}>{g.title}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{g.camera}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: BLOGS & ANNOUNCEMENTS */}
          {activeTab === 'blogs' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <span className="badge-gold" style={{ marginBottom: '0.5rem' }}>Thrissur Special Guide</span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.4rem 0' }}>Thrissur Pooram & Kasi Yatra Season Guide 2026</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Detailed travel itinerary for pilgrims departing from Thrissur Swaraj Round.</p>
              </div>

              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <span className="badge-emerald" style={{ marginBottom: '0.5rem' }}>Ayodhya Special</span>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0.4rem 0' }}>Direct Flight & Express Rail Connections from Cochin & Thrissur</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>How OASIS Thrissur arranges seamless express VIP passes.</p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
