import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import DestinationTicker from './components/DestinationTicker';
import TripPlanner from './components/TripPlanner';
import StatsBand from './components/StatsBand';
import LatestTours from './components/LatestTours';
import PopularDestinations from './components/PopularDestinations';
import DestinationModal from './components/DestinationModal';
import PackageModal from './components/PackageModal';
import GalleryView from './components/GalleryView';
import ReviewsSection from './components/ReviewsSection';
import BlogSection from './components/BlogSection';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';

import { DESTINATIONS } from './data/destinationsData';
import { initialContactData } from './data/companyContactData';
import { catalogService } from './services/catalog';
import { useCatalog } from './hooks/useCatalog';
import { ShieldCheck, Award, HeartHandshake, PhoneCall, Sparkles, MapPin, Star, Plane, Hotel, Map, UtensilsCrossed, Wallet } from 'lucide-react';
import { useLanguage } from './i18n/LanguageContext';

const SERVICE_FEATURES = [
  { icon: Plane, label: 'Flight Bookings', color: '#e11d48' },
  { icon: Hotel, label: 'Handpicked Luxury Stays', color: '#d97706' },
  { icon: Map, label: 'Expert Tour Guides', color: '#7c3aed' },
  { icon: UtensilsCrossed, label: 'Pure Veg Meals', color: '#16a34a' },
  { icon: ShieldCheck, label: '100% Safe Travel', color: '#0891b2' },
  { icon: Wallet, label: 'Best Price Guarantee', color: '#f59e0b' }
];

export default function App() {
  const { t } = useLanguage();
  const destinations = useCatalog(catalogService.getDestinations) || DESTINATIONS;
  const [contactData, setContactData] = useState(initialContactData);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedBookingData, setSelectedBookingData] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleOpenBooking = (data = null) => {
    setSelectedBookingData(data);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', color: 'var(--text-main)', position: 'relative' }}>
      
      {/* Sticky Navigation Header */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onBookClick={() => handleOpenBooking()}
      />

      {/* VIEW CONDITIONAL SWITCH */}

      {/* HOME PAGE VIEW */}
      {activeTab === 'home' && (
        <main>
          {/* Full Screen 4K Real Photography Hero Carousel */}
          <HeroSlider 
            destinations={destinations}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onBookTour={(dest) => handleOpenBooking(dest)}
          />

          {/* Scrolling Destination Marquee */}
          <DestinationTicker />

          {/* Quick Trip Planner Search Bar */}
          <TripPlanner onBook={handleOpenBooking} />

          {/* Animated Travel Stats Counters */}
          <StatsBand />

          {/* Love Travel Style: Colorful Circular Service Icons */}
          <section style={{ padding: '3.5rem 0', background: 'linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0.15))', backdropFilter: 'blur(2px)' }}>
            <div className="container">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                {SERVICE_FEATURES.map((s) => (
                  <div key={s.label} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      background: `radial-gradient(circle at 30% 25%, #ffffff, ${s.color})`,
                      boxShadow: `0 12px 24px ${s.color}33`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.9rem',
                      border: '3px solid #ffffff',
                      transition: 'transform 0.3s ease'
                    }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                      <s.icon size={36} color="#ffffff" strokeWidth={1.8} />
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Latest Signature Tour Packages Multi-Card Carousel */}
          <LatestTours 
            onBookTour={(pkg) => handleOpenBooking(pkg)}
            onViewDetails={(pkg) => setSelectedPackage(pkg)}
            onSelectDestination={(pkg) => {
              const matchingDest = destinations.find(d => d.id === pkg.destinationId) || destinations[0];
              setSelectedDestination(matchingDest);
            }}
          />

          {/* Popular Destinations Filterable Masonry Grid */}
          <PopularDestinations 
            destinations={destinations}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onBookTour={(dest) => handleOpenBooking(dest)}
          />

          {/* Why Choose OASIS Thrissur Feature Section */}
          <section style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #ffffff 0%, #fff3e6 100%)', borderTop: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
            <div className="orb" style={{ width: '360px', height: '360px', background: 'var(--rose)', top: '-100px', left: '20%', animationDelay: '-3s' }} />
            <div className="orb" style={{ width: '300px', height: '300px', background: 'var(--cyan)', bottom: '-80px', right: '10%', animationDelay: '-9s' }} />
            <div className="orb" style={{ width: '280px', height: '280px', background: 'var(--violet)', top: '20%', right: '35%', animationDelay: '-6s' }} />

            <div className="container">
              
              <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
                <span className="badge-aurora" style={{ marginBottom: '0.8rem' }}>
                  <Award size={14} /> Premier Kerala Travel Brand
                </span>
                <h2 style={{ fontSize: '2.6rem', fontWeight: 800 }}>
                  Why Travelers Trust <span className="text-aurora">OASIS Thrissur</span>
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', marginTop: '0.6rem' }}>
                  Decades of Kerala hospitality combined with uncompromised luxury transport, 100% authentic destination photography, and dedicated escort services.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                
                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                    color: '#ffffff',
                    boxShadow: '0 8px 20px rgba(245, 158, 11, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.2rem'
                  }}>
                    <ShieldCheck size={30} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem', fontFamily: 'var(--font-heading)' }}>
                    100% Authentic Photography
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    No AI-generated renders or stylized illustrations. We present only genuine 4K HDR destination photography so you see exact real travel landscapes.
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #34d399, #059669)',
                    color: '#ffffff',
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.2rem'
                  }}>
                    <MapPin size={30} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem', fontFamily: 'var(--font-heading)' }}>
                    Thrissur Swaraj Hub Pickup
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Direct luxury AC sleeper coaches and escorted transfers departing straight from Swaraj Round, Thrissur Junction Railway Station & Cochin Airport.
                  </p>
                </div>

                <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #fb7185, #be123c)',
                    color: '#ffffff',
                    boxShadow: '0 8px 20px rgba(225, 29, 72, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.2rem'
                  }}>
                    <HeartHandshake size={30} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.6rem', fontFamily: 'var(--font-heading)' }}>
                    Malayalam Escort & Pure Veg Meals
                  </h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    Senior-citizen friendly tour managers who speak Malayalam, English & Hindi, serving fresh Sattvic & Kerala vegetarian meals throughout your pilgrimage.
                  </p>
                </div>

              </div>

            </div>
          </section>

          {/* Authentic Photo Gallery Preview */}
          {/* Gallery moved to its own dedicated page (Real Photo Gallery tab) */}

          {/* Love Travel Style: Colorful CTA Band */}
          <section style={{
            padding: '4.5rem 0',
            background: 'var(--grad-aurora)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div className="orb" style={{ width: '320px', height: '320px', background: 'rgba(255,255,255,0.18)', top: '-120px', right: '12%' }} />
            <div className="orb" style={{ width: '280px', height: '280px', background: 'rgba(255,255,255,0.14)', bottom: '-100px', left: '10%', animationDelay: '-6s' }} />
            <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)', marginBottom: '0.8rem' }}>
                Ready for Your Next Sacred Journey?
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto 2rem' }}>
                Talk to our Kerala-based travel specialists today — free itinerary planning, honest pricing, zero hidden costs.
              </p>
              <button
                className="btn-gold"
                onClick={() => handleOpenBooking()}
                style={{ background: '#ffffff', color: '#1e293b' }}
              >
                <PhoneCall size={18} />
                <span>Plan My Trip Now</span>
              </button>
            </div>
          </section>

          {/* Traveler Reviews & Stories */}
          <ReviewsSection />

          {/* Travel Stories & Guides (admin-managed blog) */}
          <BlogSection />

          {/* Contact Section */}
          <ContactSection contactData={contactData} />
        </main>
      )}

      {/* POPULAR DESTINATIONS DEDICATED TAB */}
      {activeTab === 'destinations' && (
        <div style={{ paddingTop: '100px' }}>
          <PopularDestinations 
            destinations={DESTINATIONS}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onBookTour={(dest) => handleOpenBooking(dest)}
          />
        </div>
      )}

      {/* TOUR PACKAGES DEDICATED TAB */}
      {activeTab === 'packages' && (
        <div style={{ paddingTop: '100px' }}>
          <LatestTours 
            onBookTour={(pkg) => handleOpenBooking(pkg)}
            onViewDetails={(pkg) => setSelectedPackage(pkg)}
            onSelectDestination={(pkg) => {
              const matchingDest = DESTINATIONS.find(d => d.id === pkg.destinationId) || DESTINATIONS[0];
              setSelectedDestination(matchingDest);
            }}
          />
        </div>
      )}

      {/* PHOTO GALLERY DEDICATED TAB */}
      {activeTab === 'gallery' && (
        <div style={{ paddingTop: '100px' }}>
          <GalleryView />
        </div>
      )}

      {/* ABOUT US TAB */}
      {activeTab === 'about' && (
        <div className="container" style={{ paddingTop: '140px', paddingBottom: '6rem' }}>
          <div className="glass-card" style={{ padding: '3rem' }}>
            <span className="badge-gold" style={{ marginBottom: '1rem' }}>{t('about.badge')}</span>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>
              {t('about.title')}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              Headquartered at Swaraj Round in cultural capital Thrissur, **OASIS India** is Kerala premier travel portal specializing in sacred Indian temple Yatras, hill station retreats, and heritage circuits.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-muted)', lineHeight: 1.8 }}>
              We take pride in absolute transparency, providing only genuine 4K HDR destination photography, 4/5-star luxury stays, and Malayalam-escorted travel management for families and pilgrims across Kerala.
            </p>
          </div>
        </div>
      )}

      {/* CONTACT US DEDICATED TAB */}
      {activeTab === 'contact' && (
        <div style={{ paddingTop: '100px' }}>
          <ContactSection contactData={contactData} />
        </div>
      )}

      {/* MODALS */}

      {/* Destination Page / Detail Modal */}
      {selectedDestination && (
        <DestinationModal 
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onBookTour={(dest) => handleOpenBooking(dest)}
        />
      )}

      {/* Tour Package Complete Details Modal */}
      {selectedPackage && (
        <PackageModal 
          pkg={selectedPackage}
          onClose={() => setSelectedPackage(null)}
          onBookTour={(pkg) => handleOpenBooking(pkg)}
        />
      )}

      {/* Multi-Step Tour Booking Modal */}
      {selectedBookingData && (
        <BookingModal 
          initialData={selectedBookingData}
          onClose={() => setSelectedBookingData(null)}
        />
      )}

      {/* Firebase Admin Dashboard Modal */}
      {isAdminOpen && (
        <AdminDashboard 
          contactData={contactData}
          onUpdateContact={(data) => setContactData(data)}
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Luxury Footer */}
      <Footer 
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Floating WhatsApp & Back-to-Top */}
      <FloatingActions />

    </div>
  );
}
