// Catalog Service for OASIS India Thrissur
// Manages tour packages, gallery items and blog posts in localStorage.
// The admin portal writes through this service and the public site reads from it,
// so every detail entered in the admin console appears on the website instantly.

import { PACKAGES } from '../data/packagesData';
import { GALLERY_ITEMS } from '../data/galleryData';
import { DESTINATIONS } from '../data/destinationsData';

const PREFIX = 'oasis_db_';

// Default hero slides — derived from the featured real destination photography
const DEFAULT_SLIDES = [
  'ayodhya-ram-mandir',
  'kashi-varanasi',
  'ganga-aarti',
  'manikarnika-ghat',
  'annapoorneshwari-horanadu',
  'munnar-tea-plantations',
  'puri-jagannath',
  'konark-sun-temple',
  'lingaraj-bhubaneswar',
  'ooty-tea-railway',
  'parambikulam-tiger-reserve',
  'thenkasi-viswanathar',
  'tiruchendur-murugan',
  'gundlupet-sunflowers',
  'kashmir-punjab-golden-trail'
].map((destId, i) => {
  const d = DESTINATIONS.find(x => x.id === destId) || {};
  return {
    id: `hero-${i + 1}`,
    destinationId: destId,
    name: d.name || '',
    tagline: d.tagline || '',
    description: d.description || '',
    heroImage: d.heroImage || '',
    location: d.location || '',
    rating: d.rating || 4.9,
    reviewsCount: d.reviewsCount || 0,
    duration: d.duration || '',
    startingPrice: d.startingPrice || 0,
    createdAt: '2026-07-01'
  };
});

const INITIAL_BLOGS = [
  {
    id: 'blog-1',
    title: 'Thrissur Pooram & Kasi Yatra Season Guide 2026',
    tag: 'Thrissur Special Guide',
    category: 'Guides',
    excerpt: 'Detailed travel itinerary for pilgrims departing from Thrissur Swaraj Round — the perfect season, VIP darshan slots and packing essentials.',
    content: 'Every year thousands of Kerala pilgrims depart from Swaraj Round for Kashi. This guide covers the best departure windows, VIP darshan booking tips, and what to pack for a comfortable North India yatra.',
    image: './kashi-vishwanath-real.jpg',
    author: 'OASIS Travel Desk',
    createdAt: '2026-07-20'
  },
  {
    id: 'blog-2',
    title: 'Direct Flights & Express Rail Connections from Cochin & Thrissur',
    tag: 'Ayodhya Special',
    category: 'Travel Tips',
    excerpt: 'How OASIS Thrissur arranges seamless express VIP passes to Ayodhya with confirmed flights and luxury AC transfers.',
    content: 'With new direct connections from Cochin to Lucknow and Ayodhya, your Shri Ram Janmabhoomi yatra is easier than ever. OASIS handles flights, VIP darshan passes and all transfers end-to-end.',
    image: './ayodhya-ram-mandir-real.jpg',
    author: 'OASIS Travel Desk',
    createdAt: '2026-07-15'
  },
  {
    id: 'blog-3',
    title: '10 Reasons to Visit Parambikulam Tiger Reserve This Monsoon',
    tag: 'Nature Special',
    category: 'Destinations',
    excerpt: 'Misty forests, Kannimara teak, bamboo rafting and rare wildlife — why Parambikulam is Kerala\u2019s hidden gem.',
    content: 'Parambikulam comes alive in the monsoon. Mist rolls through the valleys, waterfalls roar, and the reservoirs are perfect for bamboo rafting and kayaking.',
    image: './parambikulam-lake-real.jpg',
    author: 'OASIS Nature Desk',
    createdAt: '2026-07-10'
  }
];

const getStorageItem = (key, defaultData) => {
  try {
    const saved = localStorage.getItem(`${PREFIX}${key}`);
    return saved ? JSON.parse(saved) : defaultData;
  } catch (e) {
    return defaultData;
  }
};

let lastWriteOk = true;

const setStorageItem = (key, data) => {
  try {
    localStorage.setItem(`${PREFIX}${key}`, JSON.stringify(data));
    lastWriteOk = true;
    return true;
  } catch (e) {
    console.error('Storage error:', e);
    lastWriteOk = false;
    return false;
  }
};

// Lets the admin UI show honest success/error toasts (e.g. localStorage quota exceeded)
export const getLastWriteOk = () => lastWriteOk;

const toName = (s) => {
  if (typeof s === 'string') return s.trim();
  if (s && typeof s === 'object') return String(s.name || '').trim();
  return '';
};

const toArray = (val) => {
  if (Array.isArray(val)) return val.map(toName).filter(Boolean);
  if (typeof val === 'string') return val.split(',').map(s => s.trim()).filter(Boolean);
  return [];
};

// Ordered route: first stop = Start, last stop = Destination, middle = pickup/dropping stops.
// Prefers the new routePoints model (array of {name, type} or plain names); migrates legacy pickupPoints/dropPoints on the fly.
export const getRouteStops = (data = {}) => {
  const rp = toArray(data.routePoints);
  if (rp.length) return rp;

  const picks = toArray(data.pickupPoints);
  const dest = data.destinationName || data.destination || data.title || data.name || '';
  const route = [...picks];
  if (dest.trim() && !route.includes(dest.trim())) route.push(dest.trim());

  const drops = toArray(data.dropPoints);
  drops.forEach(d => { if (!route.includes(d)) route.push(d); });

  return route.length ? route : ['Thrissur Swaraj Round', 'Kodaikanal'];
};

// Notify same-tab listeners that the catalog changed
const notifyChange = () => {
  try {
    window.dispatchEvent(new CustomEvent('oasis-catalog-changed'));
  } catch (e) {
    // ignore
  }
};

export const catalogService = {
  // ---- Tour Packages ----
  getTours() {
    return getStorageItem('catalog_tours', PACKAGES);
  },

  addTour(tourData) {
    const tours = this.getTours();
    const price = Number(tourData.price) || 0;
    const originalPrice = Number(tourData.originalPrice) || 0;
    const discountPercent = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;
    const newTour = {
      id: `tour-${Date.now()}`,
      rating: 4.9,
      reviews: 0,
      discountPercent,
      ...tourData
    };
    const updated = [newTour, ...tours];
    setStorageItem('catalog_tours', updated);
    notifyChange();
    return updated;
  },

  updateTour(id, patch) {
    const tours = this.getTours().map(t => t.id === id ? { ...t, ...patch } : t);
    setStorageItem('catalog_tours', tours);
    notifyChange();
    return tours;
  },

  deleteTour(id) {
    const tours = this.getTours().filter(t => t.id !== id);
    setStorageItem('catalog_tours', tours);
    notifyChange();
    return tours;
  },

  // ---- Gallery Items ----
  getGallery() {
    return getStorageItem('catalog_gallery', GALLERY_ITEMS);
  },

  addGalleryItem(itemData) {
    const items = this.getGallery();
    const newItem = {
      id: `gal-${Date.now()}`,
      aspect: 'regular',
      likes: 0,
      ...itemData
    };
    const updated = [newItem, ...items];
    setStorageItem('catalog_gallery', updated);
    notifyChange();
    return updated;
  },

  updateGalleryItem(id, patch) {
    const items = this.getGallery().map(g => g.id === id ? { ...g, ...patch } : g);
    setStorageItem('catalog_gallery', items);
    notifyChange();
    return items;
  },

  deleteGalleryItem(id) {
    const items = this.getGallery().filter(g => g.id !== id);
    setStorageItem('catalog_gallery', items);
    notifyChange();
    return items;
  },

  // ---- Blog Posts ----
  getBlogs() {
    return getStorageItem('catalog_blogs', INITIAL_BLOGS);
  },

  addBlog(blogData) {
    const blogs = this.getBlogs();
    const newBlog = {
      id: `blog-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      author: 'OASIS Travel Desk',
      ...blogData
    };
    const updated = [newBlog, ...blogs];
    setStorageItem('catalog_blogs', updated);
    notifyChange();
    return updated;
  },

  updateBlog(id, patch) {
    const blogs = this.getBlogs().map(b => b.id === id ? { ...b, ...patch } : b);
    setStorageItem('catalog_blogs', blogs);
    notifyChange();
    return blogs;
  },

  deleteBlog(id) {
    const blogs = this.getBlogs().filter(b => b.id !== id);
    setStorageItem('catalog_blogs', blogs);
    notifyChange();
    return blogs;
  },

  // ---- Hero Banner Slides ----
  getSlides() {
    return getStorageItem('catalog_hero_slides', DEFAULT_SLIDES);
  },

  addSlide(slideData) {
    const slides = this.getSlides();
    const newSlide = {
      id: `hero-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...slideData
    };
    const updated = [newSlide, ...slides];
    setStorageItem('catalog_hero_slides', updated);
    notifyChange();
    return updated;
  },

  updateSlide(id, patch) {
    const slides = this.getSlides().map(s => s.id === id ? { ...s, ...patch } : s);
    setStorageItem('catalog_hero_slides', slides);
    notifyChange();
    return slides;
  },

  deleteSlide(id) {
    const slides = this.getSlides().filter(s => s.id !== id);
    setStorageItem('catalog_hero_slides', slides);
    notifyChange();
    return slides;
  },

  moveSlide(id, direction) {
    const slides = this.getSlides();
    const idx = slides.findIndex(s => s.id === id);
    if (idx === -1) return slides;
    const target = idx + direction;
    if (target < 0 || target >= slides.length) return slides;
    const updated = [...slides];
    [updated[idx], updated[target]] = [updated[target], updated[idx]];
    setStorageItem('catalog_hero_slides', updated);
    notifyChange();
    return updated;
  },

  // ---- Destinations ----
  getDestinations() {
    return getStorageItem('catalog_destinations', DESTINATIONS);
  },

  addDestination(destData) {
    const list = this.getDestinations();
    const newDest = {
      id: `dest-${Date.now()}`,
      rating: 4.9,
      reviewsCount: 0,
      bgMixStyle: 'collage-blend',
      ...destData
    };
    const updated = [newDest, ...list];
    setStorageItem('catalog_destinations', updated);
    notifyChange();
    return updated;
  },

  updateDestination(id, patch) {
    const list = this.getDestinations().map(d => d.id === id ? { ...d, ...patch } : d);
    setStorageItem('catalog_destinations', list);
    notifyChange();
    return list;
  },

  deleteDestination(id) {
    const list = this.getDestinations().filter(d => d.id !== id);
    setStorageItem('catalog_destinations', list);
    notifyChange();
    return list;
  }
};
