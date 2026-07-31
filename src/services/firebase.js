// Firebase Service Module for OASIS India Thrissur
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Default Firebase Configuration template
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoKeyOasisThrissur2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "oasis-india-thrissur.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "oasis-india-thrissur",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "oasis-india-thrissur.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID || "98765432101",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:98765432101:web:abcdef123456"
};

// Initialize Firebase App
let app;
let db;

try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  db = getFirestore(app);
} catch (e) {
  console.warn("Firebase initialized in reactive demo state mode:", e.message);
}

// Initial Mock Datasets for Firestore Fallback
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

// Local Storage Helper functions to maintain reactive state
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
    console.error("Storage error:", e);
  }
};

// Firestore CRUD Wrappers
export const firestoreService = {
  // Bookings
  async getBookings() {
    return getStorageItem('bookings', INITIAL_BOOKINGS);
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
    return newBooking;
  },

  async updateBookingStatus(id, newStatus) {
    const bookings = getStorageItem('bookings', INITIAL_BOOKINGS);
    const updated = bookings.map(b => b.id === id ? { ...b, status: newStatus } : b);
    setStorageItem('bookings', updated);
    return updated;
  },

  async deleteBooking(id) {
    const bookings = getStorageItem('bookings', INITIAL_BOOKINGS);
    const updated = bookings.filter(b => b.id !== id);
    setStorageItem('bookings', updated);
    return updated;
  },

  // Customer Inquiries
  async getInquiries() {
    return getStorageItem('inquiries', INITIAL_INQUIRIES);
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
    return newInquiry;
  },

  async updateInquiryStatus(id, newStatus) {
    const inquiries = getStorageItem('inquiries', INITIAL_INQUIRIES);
    const updated = inquiries.map(i => i.id === id ? { ...i, status: newStatus } : i);
    setStorageItem('inquiries', updated);
    return updated;
  }
};

export { db };
