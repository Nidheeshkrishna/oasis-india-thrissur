// Review Service for OASIS India Thrissur
// Stores traveler reviews in localStorage (reactive demo state, same pattern as firebase.js)

const REVIEWS_KEY = 'oasis_db_reviews';

const INITIAL_REVIEWS = [
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
  }
];

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
  getReviews() {
    return getStorageItem(REVIEWS_KEY, INITIAL_REVIEWS);
  },

  addReview(reviewData) {
    const reviews = this.getReviews();
    const newReview = {
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      ...reviewData
    };
    reviews.unshift(newReview);
    setStorageItem(REVIEWS_KEY, reviews);
    return reviews;
  },

  deleteReview(id) {
    const reviews = this.getReviews().filter(r => r.id !== id);
    setStorageItem(REVIEWS_KEY, reviews);
    return reviews;
  }
};
