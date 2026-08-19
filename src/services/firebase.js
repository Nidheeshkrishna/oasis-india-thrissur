// Firebase Service Module for OASIS India Thrissur
import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc 
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  uploadString, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';

// Default Firebase Configuration template
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyOasisThrissur2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "chatapp-a9181.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "chatapp-a9181",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "chatapp-a9181.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID || "824770841743",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:824770841743:web:7111a5c56890e613a4b4fa"
};

// Initialize Firebase App
let app;
let db;
let storage;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
  storage = getStorage(app);
} catch (e) {
  console.warn("Firebase initialization warning:", e.message);
}

// Check if live cloud credentials are active
export const isFirebaseConnected = () => {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return Boolean(key && !key.includes('DemoKey') && key.length > 10);
};

// Sanitizer to remove all `undefined` values (Firestore rejects undefined fields)
export function sanitizeForFirestore(data) {
  if (data === undefined) return null;
  if (data === null || typeof data !== 'object') return data;
  if (Array.isArray(data)) {
    return data.map(sanitizeForFirestore).filter(v => v !== undefined);
  }
  const clean = {};
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      clean[key] = sanitizeForFirestore(value);
    }
  }
  return clean;
}

// ==========================================
// 📦 FIREBASE CLOUD STORAGE SERVICE
// ==========================================
export const storageService = {
  isConfigured() {
    return isFirebaseConnected();
  },

  /**
   * Upload an image File / Blob to Firebase Cloud Storage with instant Base64 fallback
   */
  async uploadFile(file, folder = 'uploads') {
    if (!file) throw new Error('No file provided for upload');

    // Local data URL reader fallback
    const readAsDataUrl = () => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve({ success: true, url: e.target.result, isLocal: true });
      reader.onerror = () => resolve({ success: false, url: '' });
      reader.readAsDataURL(file);
    });
    
    if (storage && this.isConfigured()) {
      try {
        const cleanName = (file.name || 'image.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `oasis-india-thrissur/${folder}/${Date.now()}_${cleanName}`;
        const storageRef = ref(storage, filePath);
        
        const uploadTask = (async () => {
          const snapshot = await uploadBytes(storageRef, file, {
            contentType: file.type || 'image/jpeg'
          });
          const downloadUrl = await getDownloadURL(snapshot.ref);
          return { success: true, url: downloadUrl, path: filePath };
        })();

        const timeoutTask = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firebase Storage timed out')), 4000)
        );

        return await Promise.race([uploadTask, timeoutTask]);
      } catch (err) {
        console.warn('Firebase Cloud Storage upload fallback to local URL:', err.message);
      }
    }

    return await readAsDataUrl();
  },

  /**
   * Upload a base64 / data URL string to Firebase Cloud Storage
   */
  async uploadBase64(base64Str, filename = 'generated-poster.png', folder = 'posters') {
    if (!base64Str) return null;

    if (storage && this.isConfigured() && base64Str.startsWith('data:image')) {
      try {
        const filePath = `oasis-india-thrissur/${folder}/${Date.now()}_${filename}`;
        const storageRef = ref(storage, filePath);
        await uploadString(storageRef, base64Str, 'data_url');
        const downloadUrl = await getDownloadURL(storageRef);
        return { success: true, url: downloadUrl, path: filePath };
      } catch (err) {
        console.warn('Firebase Storage uploadBase64 fallback:', err.message);
      }
    }

    return { success: true, url: base64Str, isLocal: true };
  },

  /**
   * Delete a file from Firebase Cloud Storage by path
   */
  async deleteFile(storagePath) {
    if (!storage || !this.isConfigured() || !storagePath) return false;
    try {
      const storageRef = ref(storage, storagePath);
      await deleteObject(storageRef);
      return true;
    } catch (err) {
      console.warn('Firebase Storage delete warning:', err.message);
      return false;
    }
  },

  /**
   * Automatically detect if image is a base64 data URL and upload to Firebase Storage,
   * returning the permanent cloud download URL.
   */
  async uploadImageIfBase64(imgUrlOrBase64, folder = 'catalog-images', filename = 'image.png') {
    if (!imgUrlOrBase64 || typeof imgUrlOrBase64 !== 'string') return imgUrlOrBase64;
    if (imgUrlOrBase64.startsWith('data:image')) {
      const res = await this.uploadBase64(imgUrlOrBase64, filename, folder);
      return res?.url || imgUrlOrBase64;
    }
    return imgUrlOrBase64;
  },

  /**
   * Upload an array of images or placeImage objects to Firebase Storage if they contain base64 data
   */
  async uploadImagesArrayIfBase64(imagesArray, folder = 'catalog-images') {
    if (!Array.isArray(imagesArray)) return imagesArray;
    const uploaded = await Promise.all(
      imagesArray.map(async (item, idx) => {
        if (typeof item === 'string') {
          return await this.uploadImageIfBase64(item, folder, `img_${idx}_${Date.now()}.png`);
        }
        if (item && typeof item === 'object' && item.url) {
          const newUrl = await this.uploadImageIfBase64(item.url, folder, `place_${idx}_${Date.now()}.png`);
          return { ...item, url: newUrl };
        }
        return item;
      })
    );
    return uploaded;
  }
};

// Local Storage Helper functions to maintain instant reactive UI state
const getStorageItem = (key, defaultData) => {
  try {
    const saved = localStorage.getItem(`oasis_db_${key}`);
    return saved ? JSON.parse(saved) : defaultData;
  } catch (e) {
    return defaultData;
  }
};

const setStorageItem = (key, data) => {
  try {
    localStorage.setItem(`oasis_db_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error("Local storage error:", e);
  }
};

// Initial Mock Datasets
const INITIAL_BOOKINGS = [
  {
    id: 'OASIS-BK-9021',
    customerName: 'Ramesh Menon',
    email: 'ramesh.menon@gmail.com',
    phone: '+91 98470 12345',
    pickupCity: 'Thrissur Swaraj Round',
    destination: 'Kashi Vishwanath & Varanasi',
    packageName: 'Sacred North Yatra: Kashi, Ayodhya & Prayagraj',
    travelers: 4,
    travelDate: '2026-09-15',
    totalPrice: 131996,
    status: 'Confirmed',
    paymentStatus: 'Paid (Full)',
    createdAt: '2026-07-28'
  },
  {
    id: 'OASIS-BK-9022',
    customerName: 'Lakshmi Nair',
    email: 'lakshmi.nair@yahoo.com',
    phone: '+91 94471 88990',
    pickupCity: 'Thrissur Junction Railway Station',
    destination: 'Munnar Tea Plantations',
    packageName: 'Emerald Escapes: Munnar, Ooty & Parambikulam',
    travelers: 2,
    travelDate: '2026-08-20',
    totalPrice: 55998,
    status: 'Pending',
    paymentStatus: 'Advance Deposit (₹15,000)',
    createdAt: '2026-07-30'
  },
  {
    id: 'OASIS-BK-9023',
    customerName: 'Dr. Suresh Kumar',
    email: 'dr.suresh@kims.in',
    phone: '+91 98950 44321',
    pickupCity: 'Cochin International Airport (COK)',
    destination: 'Shree Jagannath Temple, Puri',
    packageName: 'Divine Odisha: Puri Jagannath, Konark & Bhubaneswar',
    travelers: 3,
    travelDate: '2026-10-05',
    totalPrice: 77997,
    status: 'Confirmed',
    paymentStatus: 'Paid (Full)',
    createdAt: '2026-07-31'
  }
];

const INITIAL_INQUIRIES = [
  {
    id: 'INQ-101',
    name: 'Anil Varma',
    phone: '+91 94000 55443',
    subject: 'Ayodhya Ram Mandir Family Trip',
    message: 'Looking for 10 seats for senior citizens from Thrissur for Ram Mandir Darshan in October.',
    status: 'New Inquiry',
    date: '2026-07-31'
  },
  {
    id: 'INQ-102',
    name: 'Deepa Pillai',
    phone: '+91 97455 11223',
    subject: 'Ooty & Nilgiri Toy Train Booking',
    message: 'Need 1st class luxury toy train confirmed seats for group of 6.',
    status: 'Quoted',
    date: '2026-07-30'
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'rev-1',
    name: 'Ramesh Menon',
    email: 'ramesh.menon@gmail.com',
    rating: 5,
    review: 'Kashi Yatra from Thrissur was perfectly arranged. VIP darshan, Ganga Aarti boat seats and the Malayalam escort made our senior parents feel completely at home. Highly recommended!',
    trip: 'Sacred North Yatra: Kashi, Ayodhya & Prayagraj',
    createdAt: '2026-07-28'
  },
  {
    id: 'rev-2',
    name: 'Lakshmi Nair',
    email: 'lakshmi.nair@yahoo.com',
    rating: 5,
    review: 'The Kashmir package was magical — Dal Lake houseboat, Gulmarg gondola and the Golden Temple. OASIS handled everything from Cochin airport to Wagah Border with zero hassle.',
    trip: 'Kashmir Paradise & Punjab Golden Trail',
    createdAt: '2026-07-30'
  },
  {
    id: 'rev-3',
    name: 'Dr. Suresh Kumar',
    email: 'dr.suresh@kims.in',
    rating: 4,
    review: 'Parambikulam jungle safari and Kannimara teak were wonderful. Eco lodge stay inside the reserve was a unique experience. Smooth transfers from Thrissur.',
    trip: 'Emerald Escapes: Munnar, Ooty & Parambikulam',
    createdAt: '2026-07-31'
  },
  {
    id: 'rev-4',
    name: 'Anitha Varma',
    email: 'anitha.varma@gmail.com',
    rating: 5,
    review: 'Ayodhya Shri Ram Janmabhoomi darshan was a divine, memorable experience for our whole family. AC coach, Kerala food arrangements, and guide support was 10/10.',
    trip: 'Sacred North Yatra: Kashi, Ayodhya & Prayagraj',
    createdAt: '2026-08-05'
  }
];

// ==========================================
// 🔥 FIRESTORE REALTIME CRUD SERVICE
// ==========================================
export const firestoreService = {
  // ---- Bookings ----
  async getBookings() {
    const local = getStorageItem('bookings', INITIAL_BOOKINGS);
    if (db && isFirebaseConnected()) {
      try {
        const snap = await getDocs(collection(db, 'oasis_bookings'));
        if (!snap.empty) {
          const cloudList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setStorageItem('bookings', cloudList);
          return cloudList;
        } else if (local && local.length > 0) {
          // Cloud is empty, automatically seed to Firebase Firestore
          for (const b of local) {
            await setDoc(doc(db, 'oasis_bookings', String(b.id)), sanitizeForFirestore(b), { merge: true });
          }
        }
      } catch (err) {
        console.warn('Firestore getBookings error:', err.message);
      }
    }
    return local;
  },

  async createBooking(bookingData) {
    const bookings = getStorageItem('bookings', INITIAL_BOOKINGS);
    const newBooking = {
      id: `OASIS-BK-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Confirmed',
      paymentStatus: 'Paid (Online)',
      createdAt: new Date().toISOString().split('T')[0],
      ...bookingData
    };
    const updated = [newBooking, ...bookings];
    setStorageItem('bookings', updated);

    if (db && isFirebaseConnected()) {
      try {
        await setDoc(doc(db, 'oasis_bookings', newBooking.id), sanitizeForFirestore(newBooking));
      } catch (err) {
        console.warn('Firestore createBooking error:', err.message);
      }
    }
    return newBooking;
  },

  async updateBookingStatus(id, newStatus) {
    const bookings = getStorageItem('bookings', INITIAL_BOOKINGS);
    const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
    setStorageItem('bookings', updated);

    if (db && isFirebaseConnected()) {
      try {
        await updateDoc(doc(db, 'oasis_bookings', id), { status: newStatus });
      } catch (err) {
        console.warn('Firestore updateBookingStatus error:', err.message);
      }
    }
    return updated;
  },

  async deleteBooking(id) {
    const bookings = getStorageItem('bookings', INITIAL_BOOKINGS);
    const updated = bookings.filter(b => b.id !== id);
    setStorageItem('bookings', updated);

    if (db && isFirebaseConnected()) {
      try {
        await deleteDoc(doc(db, 'oasis_bookings', id));
      } catch (err) {
        console.warn('Firestore deleteBooking error:', err.message);
      }
    }
    return updated;
  },

  // ---- Inquiries ----
  async getInquiries() {
    const local = getStorageItem('inquiries', INITIAL_INQUIRIES);
    if (db && isFirebaseConnected()) {
      try {
        const snap = await getDocs(collection(db, 'oasis_inquiries'));
        if (!snap.empty) {
          const cloudList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setStorageItem('inquiries', cloudList);
          return cloudList;
        } else if (local && local.length > 0) {
          // Cloud is empty, automatically seed to Firebase Firestore
          for (const i of local) {
            await setDoc(doc(db, 'oasis_inquiries', String(i.id)), sanitizeForFirestore(i), { merge: true });
          }
        }
      } catch (err) {
        console.warn('Firestore getInquiries error:', err.message);
      }
    }
    return local;
  },

  async createInquiry(inquiryData) {
    const inquiries = getStorageItem('inquiries', INITIAL_INQUIRIES);
    const newInquiry = {
      id: `INQ-${Math.floor(100 + Math.random() * 900)}`,
      status: 'New Inquiry',
      date: new Date().toISOString().split('T')[0],
      ...inquiryData
    };
    const updated = [newInquiry, ...inquiries];
    setStorageItem('inquiries', updated);

    if (db && isFirebaseConnected()) {
      try {
        await setDoc(doc(db, 'oasis_inquiries', newInquiry.id), sanitizeForFirestore(newInquiry));
      } catch (err) {
        console.warn('Firestore createInquiry error:', err.message);
      }
    }
    return newInquiry;
  },

  async updateInquiryStatus(id, newStatus) {
    const inquiries = getStorageItem('inquiries', INITIAL_INQUIRIES);
    const updated = inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i);
    setStorageItem('inquiries', updated);

    if (db && isFirebaseConnected()) {
      try {
        await updateDoc(doc(db, 'oasis_inquiries', id), { status: newStatus });
      } catch (err) {
        console.warn('Firestore updateInquiryStatus error:', err.message);
      }
    }
    return updated;
  },

  async deleteInquiry(id) {
    const inquiries = getStorageItem('inquiries', INITIAL_INQUIRIES);
    const updated = inquiries.filter(i => i.id !== id);
    setStorageItem('inquiries', updated);

    if (db && isFirebaseConnected()) {
      try {
        await deleteDoc(doc(db, 'oasis_inquiries', id));
      } catch (err) {
        console.warn('Firestore deleteInquiry error:', err.message);
      }
    }
    return updated;
  },

  // ---- Traveler Reviews & Ratings ----
  async getReviews(defaultReviews = INITIAL_REVIEWS) {
    const local = getStorageItem('reviews', defaultReviews);
    if (db && isFirebaseConnected()) {
      try {
        const snap = await getDocs(collection(db, 'oasis_reviews'));
        if (!snap.empty) {
          const cloudList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          cloudList.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          setStorageItem('reviews', cloudList);
          return cloudList;
        } else if (local && local.length > 0) {
          // Seed cloud database from local defaults
          for (const r of local) {
            await setDoc(doc(db, 'oasis_reviews', String(r.id)), sanitizeForFirestore(r), { merge: true });
          }
        }
      } catch (err) {
        console.warn('Firestore getReviews error:', err.message);
      }
    }
    return local;
  },

  async createReview(reviewData) {
    const reviews = getStorageItem('reviews', INITIAL_REVIEWS);
    let imageUrl = reviewData.image || null;

    if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('data:image')) {
      try {
        imageUrl = await storageService.uploadImageIfBase64(imageUrl, 'reviews', `rev_${Date.now()}.png`);
      } catch (err) {
        console.warn('Firebase Storage review image upload fallback:', err.message);
      }
    }

    const newReview = {
      id: reviewData.id || `rev-${Date.now()}`,
      name: reviewData.name || 'Traveler',
      email: reviewData.email || '',
      rating: Number(reviewData.rating) || 5,
      trip: reviewData.trip || '',
      review: reviewData.review || '',
      image: imageUrl,
      createdAt: reviewData.createdAt || new Date().toISOString().split('T')[0]
    };

    const updated = [newReview, ...reviews.filter(r => r.id !== newReview.id)];
    setStorageItem('reviews', updated);

    if (db && isFirebaseConnected()) {
      try {
        await setDoc(doc(db, 'oasis_reviews', String(newReview.id)), sanitizeForFirestore(newReview));
      } catch (err) {
        console.warn('Firestore createReview error:', err.message);
      }
    }
    return newReview;
  },

  async deleteReview(id) {
    const reviews = getStorageItem('reviews', INITIAL_REVIEWS);
    const updated = reviews.filter(r => r.id !== id);
    setStorageItem('reviews', updated);

    if (db && isFirebaseConnected()) {
      try {
        await deleteDoc(doc(db, 'oasis_reviews', String(id)));
      } catch (err) {
        console.warn('Firestore deleteReview error:', err.message);
      }
    }
    return updated;
  },

  // ---- Company Contact Settings ----
  async getContact(defaultData) {
    const local = getStorageItem('company_contact', defaultData);
    if (db && isFirebaseConnected()) {
      try {
        const snap = await getDoc(doc(db, 'oasis_settings', 'company_contact'));
        if (snap.exists()) {
          const cloudData = snap.data();
          setStorageItem('company_contact', cloudData);
          return cloudData;
        } else if (local) {
          // Cloud is empty, seed to Firebase Firestore
          await setDoc(doc(db, 'oasis_settings', 'company_contact'), sanitizeForFirestore(local), { merge: true });
        }
      } catch (err) {
        console.warn('Firestore getContact error:', err.message);
      }
    }
    return local;
  },

  async saveContact(contactData) {
    setStorageItem('company_contact', contactData);
    if (db && isFirebaseConnected()) {
      try {
        await setDoc(doc(db, 'oasis_settings', 'company_contact'), sanitizeForFirestore(contactData), { merge: true });
      } catch (err) {
        console.warn('Firestore saveContact error:', err.message);
      }
    }
    return contactData;
  },

  // ---- Cloud Catalog Sync (Tours, Destinations, Gallery, Blogs, Slides, Reviews) ----
  async syncCatalogToCloud(collectionName, items) {
    if (!db || !isFirebaseConnected() || !Array.isArray(items)) return false;
    try {
      for (const item of items) {
        if (item && item.id) {
          const cleanItem = sanitizeForFirestore(item);
          await setDoc(doc(db, `oasis_${collectionName}`, String(item.id)), cleanItem, { merge: true });
        }
      }
      return true;
    } catch (err) {
      console.warn(`Firestore sync error for ${collectionName}:`, err.message);
      throw err;
    }
  },

  async fetchCatalogFromCloud(collectionName, defaultItems) {
    if (!db || !isFirebaseConnected()) return defaultItems;
    try {
      const snap = await getDocs(collection(db, `oasis_${collectionName}`));
      if (!snap.empty) {
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      }
    } catch (err) {
      console.warn(`Firestore fetch error for ${collectionName}:`, err.message);
    }
    return defaultItems;
  },

  async saveCatalogItem(collectionName, item) {
    if (!db || !isFirebaseConnected() || !item?.id) return;
    try {
      const cleanItem = sanitizeForFirestore(item);
      await setDoc(doc(db, `oasis_${collectionName}`, String(item.id)), cleanItem, { merge: true });
    } catch (err) {
      console.warn(`Firestore save error on ${collectionName}:`, err.message);
    }
  },

  async deleteCatalogItem(collectionName, id) {
    if (!db || !isFirebaseConnected() || !id) return;
    try {
      await deleteDoc(doc(db, `oasis_${collectionName}`, String(id)));
    } catch (err) {
      console.warn(`Firestore delete error on ${collectionName}:`, err.message);
    }
  },

  // ---- 1-Click Sync All Datasets to Firestore ----
  async syncAllToCloud({ tours, destinations, gallery, blogs, slides, contact, bookings, inquiries, reviews }) {
    if (!db || !isFirebaseConnected()) {
      return { success: false, message: 'Firebase configuration is missing or invalid in .env' };
    }
    try {
      let count = 0;
      if (tours?.length) {
        await this.syncCatalogToCloud('tours', tours);
        count += tours.length;
      }
      if (destinations?.length) {
        await this.syncCatalogToCloud('destinations', destinations);
        count += destinations.length;
      }
      if (gallery?.length) {
        await this.syncCatalogToCloud('gallery', gallery);
        count += gallery.length;
      }
      if (blogs?.length) {
        await this.syncCatalogToCloud('blogs', blogs);
        count += blogs.length;
      }
      if (slides?.length) {
        await this.syncCatalogToCloud('slides', slides);
        count += slides.length;
      }
      if (reviews?.length) {
        for (const r of reviews) {
          await setDoc(doc(db, 'oasis_reviews', String(r.id)), sanitizeForFirestore(r), { merge: true });
        }
        count += reviews.length;
      }
      if (contact) {
        await this.saveContact(contact);
        count += 1;
      }
      if (bookings?.length) {
        for (const b of bookings) {
          await setDoc(doc(db, 'oasis_bookings', String(b.id)), sanitizeForFirestore(b), { merge: true });
        }
        count += bookings.length;
      }
      if (inquiries?.length) {
        for (const i of inquiries) {
          await setDoc(doc(db, 'oasis_inquiries', String(i.id)), sanitizeForFirestore(i), { merge: true });
        }
        count += inquiries.length;
      }
      return { 
        success: true, 
        message: `✓ Successfully synchronized ${count} records across all collections to Firebase Firestore!` 
      };
    } catch (err) {
      console.error('Firebase Sync Error:', err);
      // Helpful error explanations
      if (err.message && err.message.includes('permission-denied')) {
        return { 
          success: false, 
          message: '⚠️ Permission Denied: Please enable Firestore Test Mode or set rules to "allow read, write: if true;" in Firebase Console.' 
        };
      }
      if (err.message && (err.message.includes('not-found') || err.message.includes('NOT_FOUND'))) {
        return {
          success: false,
          message: '⚠️ Firestore Database not found: Please click "Create database" in Firebase Console -> Firestore Database.'
        };
      }
      return { success: false, message: `⚠️ Sync Error: ${err.message}` };
    }
  }
};

export { db, storage };
