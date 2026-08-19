// Catalog Service for OASIS India Thrissur
// Manages tour packages, gallery items, blog posts, and destinations.
// Automatically syncs with Firebase Firestore in the cloud and provides instant local caching.

import { PACKAGES } from '../data/packagesData';
import { GALLERY_ITEMS } from '../data/galleryData';
import { DESTINATIONS } from '../data/destinationsData';
import { firestoreService, storageService, isFirebaseConnected } from './firebase';

const PREFIX = 'oasis_db_';

// Helper to auto-upload any embedded base64 images to Firebase Cloud Storage
async function processCloudImages(obj, folder = 'catalog') {
  if (!obj || typeof obj !== 'object') return obj;
  const clone = { ...obj };
  try {
    if (clone.image && typeof clone.image === 'string' && clone.image.startsWith('data:image')) {
      clone.image = await storageService.uploadImageIfBase64(clone.image, folder, `img_${Date.now()}.png`);
    }
    if (clone.heroImage && typeof clone.heroImage === 'string' && clone.heroImage.startsWith('data:image')) {
      clone.heroImage = await storageService.uploadImageIfBase64(clone.heroImage, folder, `hero_${Date.now()}.png`);
    }
    if (clone.url && typeof clone.url === 'string' && clone.url.startsWith('data:image')) {
      clone.url = await storageService.uploadImageIfBase64(clone.url, folder, `item_${Date.now()}.png`);
    }
    if (Array.isArray(clone.bgMixImages)) {
      clone.bgMixImages = await storageService.uploadImagesArrayIfBase64(clone.bgMixImages, folder);
    }
    if (Array.isArray(clone.galleryImages)) {
      clone.galleryImages = await storageService.uploadImagesArrayIfBase64(clone.galleryImages, folder);
    }
    if (Array.isArray(clone.placeImages)) {
      clone.placeImages = await storageService.uploadImagesArrayIfBase64(clone.placeImages, folder);
    }
  } catch (err) {
    console.warn('Process cloud images warning:', err.message);
  }
  return clone;
}

// Default hero slides — derived from the featured real destination photography
const DEFAULT_SLIDES = [
  'thirupathi-padmavathi-kalahasthi',
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
    excerpt: 'Misty forests, Kannimara teak, bamboo rafting and rare wildlife — why Parambikulam is Kerala’s hidden gem.',
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

const notifyChange = () => {
  try {
    window.dispatchEvent(new CustomEvent('oasis-catalog-changed'));
  } catch (e) {
    // ignore
  }
};

// Background Cloud Synchronization - Automatic 2-Way Sync
export const initCatalogFromCloud = async () => {
  if (!isFirebaseConnected()) return;
  try {
    const currentTours = catalogService.getTours();
    const currentDests = catalogService.getDestinations();
    const currentGallery = catalogService.getGallery();
    const currentBlogs = catalogService.getBlogs();
    const currentSlides = catalogService.getSlides();

    const [cloudTours, cloudDests, cloudGallery, cloudBlogs, cloudSlides] = await Promise.all([
      firestoreService.fetchCatalogFromCloud('tours', null),
      firestoreService.fetchCatalogFromCloud('destinations', null),
      firestoreService.fetchCatalogFromCloud('gallery', null),
      firestoreService.fetchCatalogFromCloud('blogs', null),
      firestoreService.fetchCatalogFromCloud('slides', null)
    ]);

    // 1. Tours: If cloud has data, sync down (filtering any deleted AI curated tours); otherwise sync local up to cloud automatically
    if (cloudTours && cloudTours.length > 0) {
      const DELETED_AI_IDS = ['wayanad-heart-lake-trail', 'silent-valley-expedition'];
      const filteredCloudTours = cloudTours.filter(t => {
        if (!t) return false;
        if (DELETED_AI_IDS.includes(t.id)) {
          firestoreService.deleteCatalogItem('tours', t.id);
          return false;
        }
        const b = (t.badge || '').toLowerCase();
        const title = (t.title || '').toLowerCase();
        if (b.includes('ai curated') || b.includes('ai-curated') || title.includes('ai curated')) {
          firestoreService.deleteCatalogItem('tours', t.id);
          return false;
        }
        return true;
      });
      setStorageItem('catalog_tours', filteredCloudTours);
    } else if (currentTours?.length) {
      await firestoreService.syncCatalogToCloud('tours', currentTours);
    }

    // 2. Destinations:
    if (cloudDests && cloudDests.length > 0) {
      const deletedDestIds = getDeletedDestIds();
      const filteredCloudDests = cloudDests.filter(d => {
        if (!d) return false;
        if (deletedDestIds.includes(d.id)) {
          firestoreService.deleteCatalogItem('destinations', d.id);
          return false;
        }
        return true;
      });
      setStorageItem('catalog_destinations', filteredCloudDests);
    } else if (currentDests?.length) {
      await firestoreService.syncCatalogToCloud('destinations', currentDests);
    }

    // 3. Gallery:
    if (cloudGallery && cloudGallery.length > 0) {
      setStorageItem('catalog_gallery', cloudGallery);
    } else if (currentGallery?.length) {
      await firestoreService.syncCatalogToCloud('gallery', currentGallery);
    }

    // 4. Blogs:
    if (cloudBlogs && cloudBlogs.length > 0) {
      setStorageItem('catalog_blogs', cloudBlogs);
    } else if (currentBlogs?.length) {
      await firestoreService.syncCatalogToCloud('blogs', currentBlogs);
    }

    // 5. Slides:
    if (cloudSlides && cloudSlides.length > 0) {
      setStorageItem('catalog_hero_slides', cloudSlides);
    } else if (currentSlides?.length) {
      await firestoreService.syncCatalogToCloud('slides', currentSlides);
    }

    notifyChange();
  } catch (err) {
    console.warn('Automatic Firestore catalog sync notice:', err.message);
  }
};

// Helper to sort tours: Upcoming tours ALWAYS come first, ordered chronologically by nearest date
export const sortToursUpcomingFirst = (toursList) => {
  if (!Array.isArray(toursList)) return [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return [...toursList].sort((a, b) => {
    const dateA = a.departureDate ? new Date(`${a.departureDate}T00:00:00`) : null;
    const dateB = b.departureDate ? new Date(`${b.departureDate}T00:00:00`) : null;

    const isUpcomingA = dateA && !isNaN(dateA.getTime()) && dateA >= today;
    const isUpcomingB = dateB && !isNaN(dateB.getTime()) && dateB >= today;

    // Upcoming tours ALWAYS come first
    if (isUpcomingA && !isUpcomingB) return -1;
    if (!isUpcomingA && isUpcomingB) return 1;

    // Both are upcoming: nearest departure date first (ascending)
    if (isUpcomingA && isUpcomingB) {
      return dateA.getTime() - dateB.getTime();
    }

    // Both are past/departed: most recent departure date first (descending)
    if (dateA && dateB && !isNaN(dateA.getTime()) && !isNaN(dateB.getTime())) {
      return dateB.getTime() - dateA.getTime();
    }

    return 0;
  });
};

// Kick off cloud sync on initialization
if (typeof window !== 'undefined') {
  initCatalogFromCloud();
}

const getDeletedTourIds = () => {
  return getStorageItem('catalog_deleted_tour_ids', ['wayanad-heart-lake-trail', 'silent-valley-expedition']);
};

const recordDeletedTourId = (id) => {
  if (!id) return;
  const current = getDeletedTourIds();
  if (!current.includes(id)) {
    const updated = [...current, id];
    setStorageItem('catalog_deleted_tour_ids', updated);
  }
};

const getDeletedDestIds = () => {
  return getStorageItem('catalog_deleted_dest_ids', []);
};

const recordDeletedDestId = (id) => {
  if (!id) return;
  const current = getDeletedDestIds();
  if (!current.includes(id)) {
    const updated = [...current, id];
    setStorageItem('catalog_deleted_dest_ids', updated);
    try {
      firestoreService.saveCatalogItem('settings', { id: 'catalog_deleted_dest_ids', ids: updated });
    } catch {}
  }
};

export const catalogService = {
  // ---- Tour Packages ----
  getTours() {
    const deletedIds = getDeletedTourIds();
    const saved = getStorageItem('catalog_tours', null);
    const isAiCuratedOrDeleted = (t) => {
      if (!t) return false;
      if (deletedIds.includes(t.id)) return true;
      const b = (t.badge || '').toLowerCase();
      const title = (t.title || '').toLowerCase();
      return b.includes('ai curated') || b.includes('ai-curated') || title.includes('ai curated');
    };

    if (!saved) {
      const filtered = PACKAGES.filter(p => !isAiCuratedOrDeleted(p));
      return sortToursUpcomingFirst(filtered);
    }

    // Cleanly scrub any AI curated or deleted tours
    const validTours = [];

    saved.forEach(s => {
      if (isAiCuratedOrDeleted(s)) {
        firestoreService.deleteCatalogItem('tours', s.id);
      } else {
        const def = PACKAGES.find(p => p.id === s.id);
        if (def) {
          validTours.push({
            ...def,
            ...s,
            departureDate: s.departureDate || def.departureDate,
            returnDate: s.returnDate || def.returnDate,
            placeImages: (s.placeImages?.some(img => img.url && img.url.includes('poster'))) ? def.placeImages : (s.placeImages || def.placeImages),
            bgMixImages: s.bgMixImages || def.bgMixImages
          });
        } else {
          validTours.push(s);
        }
      }
    });

    const missingDefaults = PACKAGES.filter(p => !isAiCuratedOrDeleted(p) && !validTours.some(s => s.id === p.id));
    if (missingDefaults.length > 0) {
      const merged = [...missingDefaults, ...validTours];
      setStorageItem('catalog_tours', merged);
      return sortToursUpcomingFirst(merged);
    }
    return sortToursUpcomingFirst(validTours);
  },

  addTour(tourData) {
    const tours = this.getTours();
    const price = Number(tourData.price) || 0;
    const newTour = {
      id: `tour-${Date.now()}`,
      rating: 4.9,
      reviews: 0,
      discountPercent: 0,
      ...tourData,
      price,
      originalPrice: 0
    };
    const updated = [newTour, ...tours];
    setStorageItem('catalog_tours', updated);
    notifyChange();

    // 1. Immediately write to Firebase Firestore
    firestoreService.saveCatalogItem('tours', newTour);

    // 2. Concurrently upload any base64 images to Firebase Storage & update Firestore doc
    processCloudImages(newTour, 'tours').then(cloudTour => {
      const refreshed = this.getTours().map(t => t.id === newTour.id ? cloudTour : t);
      setStorageItem('catalog_tours', refreshed);
      firestoreService.saveCatalogItem('tours', cloudTour);
      notifyChange();
    }).catch(() => {
      firestoreService.saveCatalogItem('tours', newTour);
    });

    return updated;
  },

  updateTour(id, patch) {
    const tours = this.getTours().map(t => t.id === id ? { ...t, ...patch } : t);
    setStorageItem('catalog_tours', tours);
    const updatedTour = tours.find(t => t.id === id);
    notifyChange();

    if (updatedTour) {
      // 1. Immediately write to Firebase Firestore
      firestoreService.saveCatalogItem('tours', updatedTour);

      // 2. Concurrently upload any base64 images to Firebase Storage & update Firestore doc
      processCloudImages(updatedTour, 'tours').then(cloudTour => {
        const refreshed = this.getTours().map(t => t.id === id ? cloudTour : t);
        setStorageItem('catalog_tours', refreshed);
        firestoreService.saveCatalogItem('tours', cloudTour);
        notifyChange();
      }).catch(() => {
        firestoreService.saveCatalogItem('tours', updatedTour);
      });
    }

    return tours;
  },

  deleteTour(id) {
    recordDeletedTourId(id);
    const currentTours = getStorageItem('catalog_tours', PACKAGES);
    const tours = currentTours.filter(t => t.id !== id);
    setStorageItem('catalog_tours', tours);
    firestoreService.deleteCatalogItem('tours', id);
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

    firestoreService.saveCatalogItem('gallery', newItem);

    processCloudImages(newItem, 'gallery').then(cloudItem => {
      const refreshed = this.getGallery().map(g => g.id === newItem.id ? cloudItem : g);
      setStorageItem('catalog_gallery', refreshed);
      firestoreService.saveCatalogItem('gallery', cloudItem);
      notifyChange();
    }).catch(() => {
      firestoreService.saveCatalogItem('gallery', newItem);
    });

    return updated;
  },

  updateGalleryItem(id, patch) {
    const items = this.getGallery().map(g => g.id === id ? { ...g, ...patch } : g);
    setStorageItem('catalog_gallery', items);
    const updatedItem = items.find(g => g.id === id);
    notifyChange();

    if (updatedItem) {
      firestoreService.saveCatalogItem('gallery', updatedItem);

      processCloudImages(updatedItem, 'gallery').then(cloudItem => {
        const refreshed = this.getGallery().map(g => g.id === id ? cloudItem : g);
        setStorageItem('catalog_gallery', refreshed);
        firestoreService.saveCatalogItem('gallery', cloudItem);
        notifyChange();
      }).catch(() => {
        firestoreService.saveCatalogItem('gallery', updatedItem);
      });
    }

    return items;
  },

  deleteGalleryItem(id) {
    const items = this.getGallery().filter(g => g.id !== id);
    setStorageItem('catalog_gallery', items);
    firestoreService.deleteCatalogItem('gallery', id);
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

    firestoreService.saveCatalogItem('blogs', newBlog);

    processCloudImages(newBlog, 'blogs').then(cloudBlog => {
      const refreshed = this.getBlogs().map(b => b.id === newBlog.id ? cloudBlog : b);
      setStorageItem('catalog_blogs', refreshed);
      firestoreService.saveCatalogItem('blogs', cloudBlog);
      notifyChange();
    }).catch(() => {
      firestoreService.saveCatalogItem('blogs', newBlog);
    });

    return updated;
  },

  updateBlog(id, patch) {
    const blogs = this.getBlogs().map(b => b.id === id ? { ...b, ...patch } : b);
    setStorageItem('catalog_blogs', blogs);
    const updatedBlog = blogs.find(b => b.id === id);
    notifyChange();

    if (updatedBlog) {
      firestoreService.saveCatalogItem('blogs', updatedBlog);

      processCloudImages(updatedBlog, 'blogs').then(cloudBlog => {
        const refreshed = this.getBlogs().map(b => b.id === id ? cloudBlog : b);
        setStorageItem('catalog_blogs', refreshed);
        firestoreService.saveCatalogItem('blogs', cloudBlog);
        notifyChange();
      }).catch(() => {
        firestoreService.saveCatalogItem('blogs', updatedBlog);
      });
    }

    return blogs;
  },

  deleteBlog(id) {
    const blogs = this.getBlogs().filter(b => b.id !== id);
    setStorageItem('catalog_blogs', blogs);
    firestoreService.deleteCatalogItem('blogs', id);
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

    firestoreService.saveCatalogItem('slides', newSlide);

    processCloudImages(newSlide, 'slides').then(cloudSlide => {
      const refreshed = this.getSlides().map(s => s.id === newSlide.id ? cloudSlide : s);
      setStorageItem('catalog_hero_slides', refreshed);
      firestoreService.saveCatalogItem('slides', cloudSlide);
      notifyChange();
    }).catch(() => {
      firestoreService.saveCatalogItem('slides', newSlide);
    });

    return updated;
  },

  updateSlide(id, patch) {
    const slides = this.getSlides().map(s => s.id === id ? { ...s, ...patch } : s);
    setStorageItem('catalog_hero_slides', slides);
    const updatedSlide = slides.find(s => s.id === id);
    notifyChange();

    if (updatedSlide) {
      firestoreService.saveCatalogItem('slides', updatedSlide);

      processCloudImages(updatedSlide, 'slides').then(cloudSlide => {
        const refreshed = this.getSlides().map(s => s.id === id ? cloudSlide : s);
        setStorageItem('catalog_hero_slides', refreshed);
        firestoreService.saveCatalogItem('slides', cloudSlide);
        notifyChange();
      }).catch(() => {
        firestoreService.saveCatalogItem('slides', updatedSlide);
      });
    }

    return slides;
  },

  deleteSlide(id) {
    const slides = this.getSlides().filter(s => s.id !== id);
    setStorageItem('catalog_hero_slides', slides);
    firestoreService.deleteCatalogItem('slides', id);
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
    firestoreService.syncCatalogToCloud('slides', updated);
    notifyChange();
    return updated;
  },

  // ---- Destinations ----
  getDestinations() {
    const deletedIds = getDeletedDestIds();
    const saved = getStorageItem('catalog_destinations', null);
    const filterDeleted = (list) => (list || []).filter(d => d && !deletedIds.includes(d.id));

    if (!saved) return filterDeleted(DESTINATIONS);

    const filtered = filterDeleted(saved);
    const cleaned = filtered.map(s => {
      const def = DESTINATIONS.find(d => d.id === s.id);
      if (def && (s.bgMixImages?.some(img => img && img.includes('poster')) || s.galleryImages?.some(img => img && img.includes('poster')))) {
        return { ...s, bgMixImages: def.bgMixImages, galleryImages: def.galleryImages };
      }
      return s;
    });
    return cleaned;
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

    firestoreService.saveCatalogItem('destinations', newDest);

    processCloudImages(newDest, 'destinations').then(cloudDest => {
      const refreshed = this.getDestinations().map(d => d.id === newDest.id ? cloudDest : d);
      setStorageItem('catalog_destinations', refreshed);
      firestoreService.saveCatalogItem('destinations', cloudDest);
      notifyChange();
    }).catch(() => {
      firestoreService.saveCatalogItem('destinations', newDest);
    });

    return updated;
  },

  updateDestination(id, patch) {
    const list = this.getDestinations().map(d => d.id === id ? { ...d, ...patch } : d);
    setStorageItem('catalog_destinations', list);
    const updatedDest = list.find(d => d.id === id);
    notifyChange();

    if (updatedDest) {
      firestoreService.saveCatalogItem('destinations', updatedDest);

      processCloudImages(updatedDest, 'destinations').then(cloudDest => {
        const refreshed = this.getDestinations().map(d => d.id === id ? cloudDest : d);
        setStorageItem('catalog_destinations', refreshed);
        firestoreService.saveCatalogItem('destinations', cloudDest);
        notifyChange();
      }).catch(() => {
        firestoreService.saveCatalogItem('destinations', updatedDest);
      });
    }

    return list;
  },

  deleteDestination(id) {
    recordDeletedDestId(id);
    const currentList = this.getDestinations();
    const list = currentList.filter(d => d.id !== id);
    setStorageItem('catalog_destinations', list);
    
    // Explicitly delete destination from Firebase Firestore
    try {
      firestoreService.deleteCatalogItem('destinations', id);
    } catch (err) {
      console.warn('Firestore delete destination note:', err);
    }

    // Also remove any matching hero banner slides linked to this destination
    try {
      const slides = this.getSlides();
      const remainingSlides = slides.filter(s => s.destinationId !== id && s.id !== id);
      if (remainingSlides.length !== slides.length) {
        setStorageItem('catalog_hero_slides', remainingSlides);
        firestoreService.syncCatalogToCloud('slides', remainingSlides);
      }
    } catch {}

    notifyChange();
    return list;
  }
};
