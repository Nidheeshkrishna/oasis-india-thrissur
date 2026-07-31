import React, { useState } from 'react';
import Navbar from './components/Navbar';
import HeroSlider from './components/HeroSlider';
import LatestTours from './components/LatestTours';
import PopularDestinations from './components/PopularDestinations';
import DestinationModal from './components/DestinationModal';
import GalleryView from './components/GalleryView';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

import { DESTINATIONS } from './data/destinationsData';
import { PACKAGES } from './data/packagesData';
import { ShieldCheck, Award, HeartHandshake, PhoneCall, Sparkles, MapPin, Star } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedBookingData, setSelectedBookingData] = useState(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleOpenBooking = (data = null) => {
    setSelectedBookingData(data);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-main)', position: 'relative' }}>
      
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
            destinations={DESTINATIONS}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onBookTour={(dest) => handleOpenBooking(dest)}
          />

          {/* Latest Signature Tour Packages Multi-Card Carousel */}
          <LatestTours 
            onBookTour={(pkg) => handleOpenBooking(pkg)}
            onSelectDestination={(pkg) => {
              const matchingDest = DESTINATIONS.find(d => d.id === pkg.destinationId) || DESTINATIONS[0];
              setSelectedDestination(matchingDest);
            }}
          />

          {/* Popular Destinations Filterable Masonry Grid */}
          <PopularDestinations 
            destinations={DESTINATIONS}
            onSelectDestination={(dest) => setSelectedDestination(dest)}
            onBookTour={(dest) => handleOpenBooking(dest)}
          />

          {/* Why Choose OASIS Thrissur Feature Section */}
          <section style={{ padding: '6rem 0', background: 'linear-gradient(180deg, #060c17 0%, #091322 100%)', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="container">
              
              <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 4rem' }}>
                <span className="badge-gold" style={{ marginBottom: '0.8rem' }}>
                  <Award size={14} /> Premier Kerala Travel Brand
                </span>
                <h2 style={{ fontSize: '2.6rem', fontWeight: 800 }}>
                  Why Travelers Trust <span className="text-gold-gradient">OASIS Thrissur</span>
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
                    background: 'rgba(212,175,55,0.15)',
                    color: 'var(--gold-primary)',
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
                    background: 'rgba(16,185,129,0.15)',
                    color: 'var(--emerald-accent)',
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
                    background: 'rgba(212,175,55,0.15)',
                    color: 'var(--gold-primary)',
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
          <GalleryView />
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

      {/* ABOUT OASIS THRISSUR TAB */}
      {activeTab === 'about' && (
        <div className="container" style={{ paddingTop: '140px', paddingBottom: '6rem' }}>
          <div className="glass-card" style={{ padding: '3rem' }}>
            <span className="badge-gold" style={{ marginBottom: '1rem' }}>About OASIS India Thrissur</span>
            <h1 style={{ fontSize: '2.8rem', fontWeight: 800, fontFamily: 'var(--font-heading)', marginBottom: '1.5rem' }}>
              Crafting Unforgettable Pilgrimages & Luxury Escapes
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

      {/* MODALS */}

      {/* Destination Page / Detail Modal */}
      {selectedDestination && (
        <DestinationModal 
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onBookTour={(dest) => handleOpenBooking(dest)}
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
          onClose={() => setIsAdminOpen(false)}
        />
      )}

      {/* Luxury Footer */}
      <Footer 
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

    </div>
  );
}
