// Handcrafted Tour Packages curated by OASIS India Thrissur
export const PACKAGES = [
  {
    id: 'kasi-ayodhya-yatra',
    title: 'Sacred North Yatra: Kashi, Ayodhya & Prayagraj',
    subtitle: 'Thrissur Departure Special Pilgrimage Package',
    destinationId: 'kashi-varanasi',
    duration: '7 Days / 6 Nights',
    price: 32999,
    originalPrice: 38999,
    discountPercent: 15,
    rating: 4.95,
    reviews: 214,
    badge: 'Bestseller Pilgrimage',
    image: './kashi-vishwanath-real.jpg',
    bgMixImages: [
      './kashi-vishwanath-real.jpg',
      './ayodhya-ram-mandir-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    mainPlaces: ['Varanasi', 'Ayodhya', 'Prayagraj'],
    placeImages: [
      { name: 'Kashi Vishwanath Temple', url: './kashi-vishwanath-real.jpg', group: 'Kashi' },
      { name: 'Shri Ram Janmabhoomi Ayodhya', url: './ayodhya-ram-mandir-real.jpg', group: 'Ayodhya' }
    ],
    included: [
      'Round-trip flight/train booking assistance from Thrissur',
      '5-Star/4-Star AC hotel stays with breakfast & dinner',
      'VIP Darshan tickets at Kashi Vishwanath & Ram Mandir Ayodhya',
      'Private sunrise boat tour & reserved Ganga Aarti seats',
      'Dedicated Malayalam/English speaking OASIS tour manager'
    ],
    itinerary: [
      { day: 1, title: 'Departure from Thrissur & Arrival in Varanasi', desc: 'Welcome at Varanasi airport/station by OASIS representative. Hotel check-in and evening Ganga Aarti.' },
      { day: 2, title: 'Kashi Vishwanath VIP Darshan & Annapurna Shrine', desc: 'Early morning holy bath at Dashashwamedh ghat followed by VIP Darshan at Kashi Vishwanath corridor.' },
      { day: 3, title: 'Sarnath Excursion & Temple Circuit', desc: 'Visit ancient Sarnath deer park, Ashoka Pillar, Sankat Mochan & Durga Kund temples.' },
      { day: 4, title: 'Varanasi to Prayagraj Sangam', desc: 'Drive to Prayagraj. Private boat dip at Triveni Sangam (confluence of Ganga, Yamuna & Saraswati).' },
      { day: 5, title: 'Prayagraj to Shri Ram Janmabhoomi Ayodhya', desc: 'Transfer to sacred Ayodhya. Afternoon VIP Darshan at grand Shri Ram Janmabhoomi Temple.' },
      { day: 6, title: 'Hanuman Garhi, Kanak Bhawan & Saryu Aarti', desc: 'Morning visit to Hanuman Garhi and Kanak Bhawan. Twilight Saryu River Aarti.' },
      { day: 7, title: 'Return Journey to Thrissur', desc: 'Transfer to airport/railway station with divine memories.' }
    ]
  },
  {
    id: 'kerala-hill-safari',
    title: 'Emerald Escapes: Munnar, Ooty & Parambikulam',
    subtitle: 'Luxury Nature & Hill Station Tour from Thrissur',
    destinationId: 'munnar-tea-plantations',
    duration: '6 Days / 5 Nights',
    price: 27999,
    originalPrice: 32999,
    discountPercent: 15,
    rating: 4.90,
    reviews: 188,
    badge: 'Popular Nature',
    image: './munnar-tea-plantations-real.jpg',
    bgMixImages: [
      './ooty-toy-train-real.jpg',
      './ooty-tea-gardens-real.jpg',
      './ooty-botanical-garden-real.jpg',
      './ooty-lake-boating-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    mainPlaces: ['Munnar', 'Ooty', 'Parambikulam'],
    placeImages: [
      { name: 'Ooty Heritage Toy Train', url: './ooty-toy-train-real.jpg', group: 'Tamil Nadu' },
      { name: 'Ooty Tea Gardens', url: './ooty-tea-gardens-real.jpg', group: 'Tamil Nadu' },
      { name: 'Ooty Botanical Garden', url: './ooty-botanical-garden-real.jpg', group: 'Tamil Nadu' },
      { name: 'Ooty Lake Boating', url: './ooty-lake-boating-real.jpg', group: 'Tamil Nadu' },
      { name: 'Munnar Tea Gardens', url: './munnar-tea-plantations-real.jpg', group: 'Kerala' },
      { name: 'Parambikulam Forest', url: './parambikulam-forest-real.jpg', group: 'Kerala' }
    ],
    included: [
      'Private Luxury AC Innova/Traveller from Thrissur Swaraj Round',
      '4x4 Jeep Safari to Kolukkumalai Sunrise Peak',
      'UNESCO Nilgiri Toy Train 1st Class Confirmed Tickets',
      'Parambikulam Tiger Reserve Bamboo Rafting',
      '4-Star & 5-Star Resort Stays with daily breakfast'
    ],
    itinerary: [
      { day: 1, title: 'Thrissur to Munnar Tea Country', desc: 'Scenic drive from Thrissur via Cheeyappara waterfalls to Munnar. Evening tea estate stroll.' },
      { day: 2, title: 'Kolukkumalai Sunrise & Eravikulam Safari', desc: '4:30 AM 4x4 Jeep safari to Kolukkumalai sunrise. Afternoon Eravikulam Nilgiri Tahr sanctuary.' },
      { day: 3, title: 'Munnar to Ooty via Chinnar Wildlife Road', desc: 'Drive through Chinnar sanctuary and Marayoor sandalwood forests to Ooty.' },
      { day: 4, title: 'Ooty Heritage Toy Train & Doddabetta', desc: 'Ride the iconic UNESCO Nilgiri Toy Train to Coonoor. Visit Botanical Gardens and tea factory.' },
      { day: 5, title: 'Ooty to Parambikulam Tiger Reserve', desc: 'Descent to Palakkad/Parambikulam. Jungle safari and Kannimara ancient teak visit.' },
      { day: 6, title: 'Bamboo Rafting & Return to Thrissur', desc: 'Morning reservoir bamboo rafting and return drive to Thrissur office.' }
    ]
  },
  {
    id: 'odisha-golden-temple',
    title: 'Divine Odisha: Puri Jagannath, Konark & Bhubaneswar',
    subtitle: 'Heritage & Char Dham Experience',
    destinationId: 'puri-jagannath',
    duration: '5 Days / 4 Nights',
    price: 25999,
    originalPrice: 29999,
    discountPercent: 13,
    rating: 4.88,
    reviews: 156,
    badge: 'Char Dham Special',
    image: './puri-jagannath-real.jpg',
    bgMixImages: [
      './puri-jagannath-real.jpg',
      './puri-jagannath-entrance-real.jpg',
      './konark-sun-temple-real.jpg',
      './lingaraj-temple-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    mainPlaces: ['Puri', 'Konark', 'Bhubaneswar'],
    placeImages: [
      { name: 'Puri Jagannath Temple', url: './puri-jagannath-real.jpg', group: 'Odisha' },
      { name: 'Jagannath Singhadwara Entrance', url: './puri-jagannath-entrance-real.jpg', group: 'Odisha' }
    ],
    included: [
      'Cochin to Bhubaneswar round-trip flight arrangements',
      '5-Star Beach Resort stay in Puri & Mayfair Bhubaneswar',
      'VIP escorted entry at Puri Jagannath Temple & Mahaprasad',
      'Konark Sun Temple Light & Sound Show entry',
      'Chilika Lake Dolphin spotting boat safari'
    ],
    itinerary: [
      { day: 1, title: 'Bhubaneswar Arrival & Temple City Tour', desc: 'Arrival at BBI airport. Visit Lingaraj & Mukteshwar temples. Overnight in Bhubaneswar.' },
      { day: 2, title: 'Bhubaneswar to Puri via Konark Sun Temple', desc: 'Drive to Konark UNESCO heritage Sun Temple. Proceed to Puri Beach Resort.' },
      { day: 3, title: 'Puri Jagannath Temple VIP Darshan & Beach', desc: 'Special morning Darshan at Jagannath Temple, Mahaprasad dining, and Golden Beach sunset.' },
      { day: 4, title: 'Chilika Lake Irrawaddy Dolphin Excursion', desc: 'Boat safari at Satapada Chilika Lake to spot rare Irrawaddy dolphins and migratory birds.' },
      { day: 5, title: 'Handicraft Village Visit & Return Flight', desc: 'Visit Raghurajpur heritage artisan village before transfer to airport.' }
    ]
  },
  {
    id: 'south-temple-trail',
    title: 'Tamil Nadu Sacred Trail: Tenkasi & Tiruchendur',
    subtitle: 'Weekend Spiritual Getaway from Thrissur',
    destinationId: 'tiruchendur-murugan',
    duration: '3 Days / 2 Nights',
    price: 14999,
    originalPrice: 17999,
    discountPercent: 16,
    rating: 4.92,
    reviews: 142,
    badge: 'Quick Getaway',
    image: './tiruchendur-murugan-real.jpg',
    bgMixImages: [
      './tiruchendur-murugan-real.jpg',
      './tiruchendur-beach-real.jpg',
      './thenkasi-viswanathar-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    mainPlaces: ['Tenkasi', 'Tiruchendur'],
    placeImages: [
      { name: 'Tiruchendur Murugan Temple', url: './tiruchendur-murugan-real.jpg', group: 'Tamil Nadu' },
      { name: 'Tiruchendur Beach', url: './tiruchendur-beach-real.jpg', group: 'Tamil Nadu' }
    ],
    included: [
      'Luxury AC Sleeper Coach from Thrissur',
      '3-Star Deluxe Hotel Stay near Tiruchendur Seashore',
      'Special Abhishekam tickets at Tiruchendur Murugan Temple',
      'Courtallam Herbal Waterfalls Bath Excursion',
      'All meals included (Authentic South Indian Vegetarian cuisine)'
    ],
    itinerary: [
      { day: 1, title: 'Thrissur to Tenkasi Kasi Viswanathar', desc: 'Early morning departure from Thrissur. Visit Tenkasi Viswanathar Temple and Courtallam falls.' },
      { day: 2, title: 'Tenkasi to Tiruchendur Seashore Temple', desc: 'Proceed to Tiruchendur. Holy dip at Nazhikinaru spring and special evening Darshan.' },
      { day: 3, title: 'Sunrise Beach Aarti & Return to Thrissur', desc: 'Watch golden sunrise over Bay of Bengal. Afternoon drive back to Thrissur.' }
    ]
  },
  {
    id: 'kashmir-punjab-golden-trail',
    title: 'Kashmir Paradise & Punjab Golden Trail',
    subtitle: 'Amritsar • Wagah Border • Gulmarg • Pahalgam • Sonamarg • Dal Lake',
    destinationId: 'kashmir-punjab-golden-trail',
    duration: '7 Days / 6 Nights',
    price: 49999,
    originalPrice: 57999,
    discountPercent: 14,
    rating: 4.98,
    reviews: 178,
    badge: 'Luxury Himalayan Escape',
    image: './dal-lake-shikara-real.jpg',
    bgMixImages: [
      './dal-lake-shikara-real.jpg',
      './gulmarg-real.jpg',
      './golden-temple-real.jpg',
      './wagah-border-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    mainPlaces: ['Amritsar', 'Punjab', 'Wagah Border'],
    placeImages: [
      { name: 'Sonamarg', url: './sonamarg-real.jpg', group: 'kashmir' },
      { name: 'Gulmarg', url: './gulmarg-real.jpg', group: 'kashmir' },
      { name: 'Pahalgam', url: './pahalgam-real.jpg', group: 'kashmir' },
      { name: 'Srinagar', url: './srinagar-real.jpg', group: 'kashmir' },
      { name: 'Dal Lake Shikara', url: './dal-lake-shikara-real.jpg', group: 'kashmir' },
      { name: 'Golden Temple', url: './golden-temple-real.jpg', group: 'punjab' },
      { name: 'Wagah Border', url: './wagah-border-real.jpg', group: 'punjab' }
    ],
    punjabHighlights: [
      'Golden Temple (Harmandir Sahib) spiritual Darshan & Langar community meal',
      'Wagah Border Beating Retreat ceremony on India–Pakistan frontier',
      'Jallianwala Bagh memorial & Heritage Amritsar city walk',
      'Authentic Amritsari Kulcha, Lassi & Makki di Roti–Sarson da Saag dinner'
    ],
    included: [
      'Round-trip Cochin to Srinagar flight arrangements via Delhi',
      'Deluxe Dal Lake Houseboat overnight stay & shikara transfers',
      'Gulmarg Gondola (Phase 1 & 2) VIP priority cable car tickets',
      'Sonamarg Thajiwas Glacier pony trek with warm jackets & snow gear',
      'Golden Temple VIP Darshan entry & Wagah Border reserved viewing seats',
      'Luxury AC coach between Srinagar, Gulmarg, Pahalgam & Amritsar',
      'Daily breakfast & dinner with Kashmiri Wazwan & Punjabi specials',
      'Dedicated Malayalam/English speaking OASIS tour manager throughout'
    ],
    itinerary: [
      { day: 1, title: 'Cochin → Delhi → Srinagar Arrival', desc: 'Escorted flight from Cochin. Arrival at Srinagar SXR, private transfer to Dal Lake. Evening welcome Kahwa tea on the houseboat.' },
      { day: 2, title: 'Dal Lake Shikara Ride & Mughal Gardens', desc: 'Morning shikara ride across mirror-still Dal Lake past floating vegetable market, lotus gardens & char chinar. Afternoon Nishat & Shalimar Mughal Gardens.' },
      { day: 3, title: 'Gulmarg Meadow of Flowers & Gondola', desc: 'Drive to Gulmarg (8,700 ft). Scenic pony walks through flower meadows and the worlds 2nd highest Gulmarg Gondola to Kongdoori at 13,050 ft.' },
      { day: 4, title: 'Pahalgam Valley & Betaab Valley Drive', desc: 'Scenic Lidder River drive to Pahalgam. Explore Betaab Valley, Baisaran meadow and pine forest picnic with snow views.' },
      { day: 5, title: 'Sonamarg Thajiwas Glacier Adventure', desc: 'Drive along Sindh River to Sonamarg (Golden Meadow). Thajiwas glacier pony trek, snowball fights & riverside lunch.' },
      { day: 6, title: 'Srinagar → Delhi → Amritsar Golden Temple', desc: 'Morning flight to Amritsar. Golden Temple darshan, evening Palki Sahib & sarovar parikrama. Special Amritsari dinner.' },
      { day: 7, title: 'Wagah Border Ceremony & Return Journey', desc: 'Sunrise Golden Temple darshan, Jallianwala Bagh visit, then reserved seats at the iconic Wagah Border beating retreat before return to Thrissur.' }
    ]
  }
];
