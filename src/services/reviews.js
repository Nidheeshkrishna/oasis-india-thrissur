// Review Service for OASIS India Thrissur
// Manages traveler reviews, ratings, and photos.
// Automatically synchronizes with Firebase Firestore and Firebase Cloud Storage with instantaneous local caching.

import { firestoreService, storageService, isFirebaseConnected, INITIAL_REVIEWS } from './firebase';

const REVIEWS_KEY = 'oasis_db_reviews';

const listeners = new Set();

const notifyListeners = (reviews) => {
  listeners.forEach(fn => {
    try { fn(reviews); } catch (e) { console.error("Review listener error:", e); }
  });
};

const getStorageItem = (key, defaultData) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : defaultData;
  } catch (e) {
    return defaultData;
  }
};

const setStorageItem = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Storage error:", e);
  }
};

export const reviewStorage = {
  /**
   * Returns current reviews from local storage cache for immediate, zero-latency rendering
   */
  getReviews() {
    return getStorageItem(REVIEWS_KEY, INITIAL_REVIEWS);
  },

  /**
   * Subscribe to review updates (cloud sync or mutations)
   */
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /**
   * Fetches latest reviews from Firebase Firestore in background and updates local cache
   */
  async fetchReviewsFromCloud() {
    try {
      const cloudReviews = await firestoreService.getReviews(INITIAL_REVIEWS);
      if (cloudReviews && Array.isArray(cloudReviews)) {
        setStorageItem(REVIEWS_KEY, cloudReviews);
        notifyListeners(cloudReviews);
        return cloudReviews;
      }
    } catch (err) {
      console.warn("Error fetching reviews from Firestore:", err.message);
    }
    return this.getReviews();
  },

  /**
   * Adds a new review, saves to Firestore and Firebase Storage, and updates local state
   */
  async addReview(reviewData) {
    const currentReviews = this.getReviews();
    
    // Prepare local optimistic item
    const newReview = {
      id: reviewData.id || `rev-${Date.now()}`,
      name: reviewData.name?.trim() || 'Traveler',
      email: reviewData.email?.trim().toLowerCase() || '',
      rating: Number(reviewData.rating) || 5,
      trip: reviewData.trip?.trim() || '',
      review: reviewData.review?.trim() || '',
      image: reviewData.image || null,
      createdAt: reviewData.createdAt || new Date().toISOString().split('T')[0]
    };

    const updated = [newReview, ...currentReviews.filter(r => r.id !== newReview.id)];
    setStorageItem(REVIEWS_KEY, updated);
    notifyListeners(updated);

    // Save to Firebase Firestore in background / cloud
    if (isFirebaseConnected()) {
      try {
        await firestoreService.createReview(newReview);
      } catch (err) {
        console.warn("Error saving review to Firestore:", err.message);
      }
    }

    return updated;
  },

  /**
   * Deletes a review by ID from local cache and Firebase Firestore
   */
  async deleteReview(id) {
    const currentReviews = this.getReviews();
    const updated = currentReviews.filter(r => r.id !== id);
    setStorageItem(REVIEWS_KEY, updated);
    notifyListeners(updated);

    if (isFirebaseConnected()) {
      try {
        await firestoreService.deleteReview(id);
      } catch (err) {
        console.warn("Error deleting review from Firestore:", err.message);
      }
    }

    return updated;
  }
};
