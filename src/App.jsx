import React, { useState, useEffect } from 'react';
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
import AiDestinationGuideModal from './components/AiDestinationGuideModal';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import FloatingActions from './components/FloatingActions';
import CinematicLoader from './components/CinematicLoader';
import CinematicScrollReveal from './components/CinematicScrollReveal';
import CinematicParticleEngine from './components/CinematicParticleEngine';

import { DESTINATIONS } from './data/destinationsData';
import { getContactData } from './services/whatsapp';
import { catalogService } from './services/catalog';
import { useCatalog } from './hooks/useCatalog';
import { ShieldCheck, Award, HeartHandshake, PhoneCall, Sparkles, MapPin, Star } from 'lucide-react';
import { FacebookIcon, InstagramIcon } from './components/SocialIcons';
import { useLanguage } from './i18n/LanguageContext';

export default function App() {
  const { t } = useLanguage();
  const destinations = useCatalog(catalogService.getDestinations) || DESTINATIONS;
  const [contactData, setContactData] = useState(getContactData);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedBookingData, setSelectedBookingData] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAiGuideOpen, setIsAiGuideOpen] = useState(false);
  const [aiGuideLocation, setAiGuideLocation] = useState('Kodaikanal');
  const [loaderDone, setLoaderDone] = useState(false);

  const handleOpenBooking = (data = null) => {
    setSelectedBookingData(data);
  };

  // Auto-open admin if URL contains #admin or ?admin=true
  useEffect(() => {
    const checkAdminUrl = () => {
      if (window.location.hash === '#admin' || window.location.search.includes('admin=true')) {
        setIsAdminOpen(true);
      }
    };
    checkAdminUrl();
    window.addEventListener('hashchange', checkAdminUrl);
    return () => window.removeEventListener('hashchange', checkAdminUrl);
  }, []);

  // Always land at the top of the page when switching tabs
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  // Persist admin-edited contact / WhatsApp settings so they survive reloads
  useEffect(() => {
    try {
      localStorage.setItem('oasis_db_company_contact', JSON.stringify(contactData));
    } catch (e) {
      // ignore storage errors
    }
  }, [contactData]);

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', color: 'var(--text-main)', position: 'relative' }}>

      {/* ── Cinematic page loader (plays once, 3 s) ── */}
      <CinematicLoader onComplete={() => setLoaderDone(true)} />

      {/* ── Global ambient particle layer (fixed, behind everything) ── */}
      <CinematicParticleEngine fixed zIndex={-1} />

      {/* ── Global scroll reveal + interactive wiring ── */}
      <CinematicScrollReveal />
      
      {/* Sticky Navigation Header */}
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenGuide={() => { setAiGuideLocation('Kodaikanal'); setIsAiGuideOpen(true); }}
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
          <section style={{ padding: 'clamp(4rem, 7vw, 5.5rem) 0', background: 'linear-gradient(180deg, #ffffff 0%, #fff3e6 100%)', borderTop: '1px solid var(--border-subtle)', position: 'relative', overflow: 'hidden' }}>
            <div className="orb" style={{ width: '360px', height: '360px', background: 'var(--rose)', top: '-100px', left: '20%', animationDelay: '-3s' }} />
            <div className="orb" style={{ width: '300px', height: '300px', background: 'var(--cyan)', bottom: '-80px', right: '10%', animationDelay: '-9s' }} />
            <div className="orb" style={{ width: '280px', height: '280px', background: 'var(--violet)', top: '20%', right: '35%', animationDelay: '-6s' }} />

            <div className="container">
              
              <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem' }} className="reveal">
                <span className="badge-aurora" style={{ marginBottom: '0.8rem' }}>
                  <Award size={14} /> Premier Kerala Travel Brand
                </span>
                <h2 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#0f172a' }}>
                  Why Travelers Trust <span className="text-aurora">OASIS Thrissur</span>
                </h2>
                <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '0.6rem' }}>
                  Decades of Kerala hospitality combined with uncompromised luxury transport, 100% authentic destination photography, and dedicated escort services.
                </p>
              </div>

              <div
                data-stagger="0.12"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}
              >
                
                <div className="glass-card card-cinematic reveal-card" style={{ padding: '2rem', textAlign: 'center' }}>
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

                <div className="glass-card card-cinematic reveal-card" style={{ padding: '2rem', textAlign: 'center' }}>
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

                <div className="glass-card card-cinematic reveal-card" style={{ padding: '2rem', textAlign: 'center' }}>
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
            padding: 'clamp(3.5rem, 6vw, 5rem) 0',
            background: 'var(--grad-aurora)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div className="orb" style={{ width: '320px', height: '320px', background: 'rgba(255,255,255,0.18)', top: '-120px', right: '12%' }} />
            <div className="orb" style={{ width: '280px', height: '280px', background: 'rgba(255,255,255,0.14)', bottom: '-100px', left: '10%', animationDelay: '-6s' }} />
            <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
              <h2 className="reveal word-fade" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-heading)', marginBottom: '0.8rem' }}>
                Ready for Your Next Sacred Journey?
              </h2>
              <p className="reveal reveal-delay-2" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: '640px', margin: '0 auto 2rem' }}>
                Talk to our Kerala-based travel specialists today — free itinerary planning, honest pricing, zero hidden costs.
              </p>
              <button
                className="btn-gold btn-cinematic cta-reveal reveal-delay-3"
                data-ripple
                data-magnetic
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
        <div style={{ paddingTop: '110px' }}>
          <PopularDestinations 
            destinations={destinations}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onBookTour={(dest) => handleOpenBooking(dest)}
          />
        </div>
      )}

      {/* TOUR PACKAGES DEDICATED TAB */}
      {activeTab === 'packages' && (
        <div style={{ paddingTop: '110px' }}>
          <LatestTours 
            onBookTour={(pkg) => handleOpenBooking(pkg)}
            onViewDetails={(pkg) => setSelectedPackage(pkg)}
            onSelectDestination={(pkg) => {
              const matchingDest = destinations.find(d => d.id === pkg.destinationId) || destinations[0];
              setSelectedDestination(matchingDest);
            }}
          />
        </div>
      )}

      {/* PHOTO GALLERY DEDICATED TAB */}
      {activeTab === 'gallery' && (
        <div style={{ paddingTop: '110px' }}>
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

            {/* Follow OASIS India on Social Media */}
            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--gold-light)', marginBottom: '1rem' }}>
                Follow OASIS India on Social Media
              </h3>
              <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                <a
                  href="https://www.facebook.com/p/Oasis-India-Holidays-100090841204193/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass btn-cinematic"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#4da3ff', border: '1px solid rgba(77,163,255,0.45)' }}
                >
                  <FacebookIcon size={18} /> Facebook
                </a>
                <a
                  href="https://www.instagram.com/oasis.india.holidays?igsh=MzN5OTgzNGNiaHhv"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-glass btn-cinematic"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#f472b6', border: '1px solid rgba(244,114,182,0.45)' }}
                >
                  <InstagramIcon size={18} /> Instagram
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTACT US DEDICATED TAB */}
      {activeTab === 'contact' && (
        <div style={{ paddingTop: '110px' }}>
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

      {/* AI Nearby Attractions & 1-Day Itinerary Guide Modal */}
      {isAiGuideOpen && (
        <AiDestinationGuideModal 
          initialLocation={aiGuideLocation}
          onClose={() => setIsAiGuideOpen(false)}
          onBookTour={(data) => {
            setIsAiGuideOpen(false);
            handleOpenBooking(data);
          }}
        />
      )}

      {/* Luxury Footer */}
      <Footer 
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectDestination={(id) => {
          const dest = destinations.find(d => d.id === id);
          if (dest) setSelectedDestination(dest);
        }}
      />

      {/* Floating WhatsApp, Call, Back-to-Top & Admin Badge */}
      <FloatingActions onOpenAdmin={() => setIsAdminOpen(true)} />

    </div>
  );
}
