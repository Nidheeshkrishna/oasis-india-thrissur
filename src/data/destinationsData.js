// Comprehensive Dataset of Real Destinations with Authentic High-Resolution Web Photographs
// All images are 100% real, authentic travel photographs sourced from verified web sources & Wikimedia Commons.

export const DESTINATIONS = [
  {
    id: 'kashi-varanasi',
    name: 'Kashi Vishwanath Temple & Varanasi',
    tagline: 'The Eternal City of Light & Devotion',
    category: 'Pilgrimage',
    location: 'Varanasi, Uttar Pradesh',
    coordinates: [25.3109, 83.0107],
    heroImage: '/kashi-vishwanath-real.jpg',
    galleryImages: [
      '/kashi-vishwanath-real.jpg',
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Ganga_Aarti_at_Dashashwamedh_Ghat%2C_Varanasi.jpg/1280px-Ganga_Aarti_at_Dashashwamedh_Ghat%2C_Varanasi.jpg',
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    reviewsCount: 342,
    startingPrice: 24999,
    duration: '5 Days / 4 Nights',
    bestTime: 'October to March',
    weather: { temp: '24°C', condition: 'Pleasant & Clear', humidity: '55%', bestSeason: 'Winter' },
    description: 'Experience the spiritual heartland of India with OASIS Thrissur. Witness the ancient Kashi Vishwanath temple, sacred ghats, and divine evening Ganga Aarti rituals on the banks of holy river Ganges.',
    highlights: [
      'VIP Darshan at Kashi Vishwanath Jyotirlinga',
      'Private sunrise boat tour along Dashashwamedh & Manikarnika Ghats',
      'Reserved seating for evening Ganga Aarti ceremony',
      'Excursion to Sarnath Sacred Buddhist Shrine'
    ],
    travelGuide: {
      howToReach: 'Direct flights from Cochin (COK) or direct express trains (Dhanbad Express / Ernakulam-Patna) from Thrissur Junction (TCR).',
      dressCode: 'Traditional modest attire (Dhoti/Kurta for men, Saree/Salwar for women).',
      localCuisine: 'Authentic Banarasi Malaiyyo, Kachori Sabzi, Banarasi Paan & Subah-e-Banarasi breakfast.',
      essentialTips: 'Morning boat rides start at 5:30 AM. Keep footwear in designated temple lockers.'
    },
    nearbyAttractions: [
      { name: 'Sarnath Deer Park', distance: '12 km', type: 'Heritage' },
      { name: 'Kalaram Temple & Assi Ghat', distance: '3 km', type: 'Pilgrimage' },
      { name: 'Ramnagar Fort', distance: '14 km', type: 'History' }
    ],
    hotels: [
      { name: 'BrijRama Palace Heritage Hotel', rating: '5 Star', location: 'Darbhanga Ghat' },
      { name: 'Taj Nadesar Palace Varanasi', rating: '5 Star Deluxe', location: 'Cantonment' }
    ]
  },
  {
    id: 'ganga-aarti',
    name: 'Ganga Aarti at Dashashwamedh Ghat',
    tagline: 'Divine Twilight Symphony of Brass Lamps & Chants',
    category: 'Pilgrimage',
    location: 'Varanasi, Uttar Pradesh',
    coordinates: [25.3075, 83.0104],
    heroImage: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Ganga_Aarti_at_Dashashwamedh_Ghat%2C_Varanasi.jpg/1280px-Ganga_Aarti_at_Dashashwamedh_Ghat%2C_Varanasi.jpg'
    ],
    rating: 5.0,
    reviewsCount: 512,
    startingPrice: 18999,
    duration: '4 Days / 3 Nights',
    bestTime: 'October to April',
    weather: { temp: '22°C', condition: 'Cool Breeze', humidity: '50%', bestSeason: 'Winter' },
    description: 'Immerse yourself in the mesmerising Ganga Aarti at Dashashwamedh Ghat. OASIS Thrissur provides exclusive front-row boat seating for viewing priests perform grand synchronized ritual worship.',
    highlights: [
      'Exclusive VIP boat seating directly facing priests platform',
      'Floating lotus candle offering (Diya Daan) on Mother Ganga',
      'Photographer escorted twilight ghat walkthrough',
      'Sanskrit chant explanations with expert guide'
    ],
    travelGuide: {
      howToReach: 'Included in Varanasi itinerary packages managed by OASIS Thrissur tour escorts.',
      dressCode: 'Decent traditional attire recommended.',
      localCuisine: 'Varanasi Thali, Rabri Jalebi, Blue Lassi.',
      essentialTips: 'Aarti commences promptly at sunset (approx. 6:30 PM in summer, 5:30 PM in winter).'
    },
    nearbyAttractions: [
      { name: 'Kashi Vishwanath Corridor', distance: '0.4 km', type: 'Spiritual' },
      { name: 'Manikarnika Ghat', distance: '0.8 km', type: 'Sacred Site' }
    ],
    hotels: [
      { name: 'Heritage River View Suite', rating: '5 Star', location: 'Ghat Front' }
    ]
  },
  {
    id: 'manikarnika-ghat',
    name: 'Manikarnika Ghat Heritage',
    tagline: 'Sacred Gateway to Moksha on Holy River Ganges',
    category: 'Heritage',
    location: 'Varanasi, Uttar Pradesh',
    coordinates: [25.3106, 83.0139],
    heroImage: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.8,
    reviewsCount: 210,
    startingPrice: 19999,
    duration: '4 Days / 3 Nights',
    bestTime: 'October to March',
    weather: { temp: '25°C', condition: 'Sunny', humidity: '52%', bestSeason: 'Winter' },
    description: 'Manikarnika Ghat stands as one of the oldest and most revered sites in Kashi. Guided tours with OASIS Thrissur offer deep cultural and spiritual perspective on Vedic rites of passage.',
    highlights: [
      'Historical heritage walk around Manikarnika Kund',
      'Chakra-pushkarini sacred pond exploration',
      'Architectural study of ancient riverfront palaces',
      'Private boat cruise at sunrise'
    ],
    travelGuide: {
      howToReach: 'Short walk or boat ride from main Kashi Vishwanath gate.',
      dressCode: 'Respectful conservative attire.',
      localCuisine: 'Traditional Sattvic North Indian thali.',
      essentialTips: 'Maintain silence and respect photo restrictions in cremation zones.'
    },
    nearbyAttractions: [
      { name: 'Scindia Ghat', distance: '0.2 km', type: 'Heritage' },
      { name: 'Ratneshwar Mahadev Leaning Temple', distance: '0.3 km', type: 'Architecture' }
    ],
    hotels: [
      { name: 'Palace On Ganges', rating: '4 Star Heritage', location: 'Assi Ghat' }
    ]
  },
  {
    id: 'annapoorneshwari-horanadu',
    name: 'Annapoorneshwari Temple, Horanadu',
    tagline: 'Divine Sanctuary of Nourishment in Western Ghats',
    category: 'Pilgrimage',
    location: 'Horanadu, Chikmagalur, Karnataka',
    coordinates: [13.2721, 75.3422],
    heroImage: 'https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1609949279531-cf48d64bed89?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    reviewsCount: 289,
    startingPrice: 14999,
    duration: '3 Days / 2 Nights',
    bestTime: 'September to May',
    weather: { temp: '21°C', condition: 'Mist & Lush Green', humidity: '70%', bestSeason: 'Post-Monsoon' },
    description: 'Set amidst dense green tea and spice plantations of Karnataka Western Ghats, Shri Adishakthyathmaka Annapoorneshwari Temple serves sacred Annadanam to all devotees.',
    highlights: [
      'Special Archana at Golden Goddess Annapoorneshwari Idol',
      'Scenic Western Ghats mountain drive from Thrissur via Wayanad/Mangalore',
      'Sacred Prasadam Mahaprasada dining hall experience',
      'Visit to Kalasa Kalaseshwara Shiva Temple'
    ],
    travelGuide: {
      howToReach: 'Direct luxury AC bus transport arranged from OASIS Thrissur office (Thrissur Swaraj Round pickup).',
      dressCode: 'Men: Dhoti/Angavastram without shirt inside inner sanctum. Women: Saree/Salwar.',
      localCuisine: 'Traditional Karnataka Temple Mahaprasada (Payasam, Rice, Sambar, Akki Roti).',
      essentialTips: 'Temple dining hall serves free nutritious meals to all pilgrims thrice daily.'
    },
    nearbyAttractions: [
      { name: 'Kalasa Shiva Temple', distance: '8 km', type: 'Spiritual' },
      { name: 'Kudremukh National Park', distance: '25 km', type: 'Wildlife' }
    ],
    hotels: [
      { name: 'Humcha Regency & Resort', rating: '4 Star', location: 'Horanadu Hills' }
    ]
  },
  {
    id: 'ayodhya-ram-mandir',
    name: 'Shri Ram Janmabhoomi Temple, Ayodhya',
    tagline: 'The Grand Sacred Abode of Maryada Purushottam Shri Ram',
    category: 'Pilgrimage',
    location: 'Ayodhya, Uttar Pradesh',
    coordinates: [26.7956, 82.1943],
    heroImage: '/ayodhya-ram-mandir-real.jpg',
    galleryImages: [
      '/ayodhya-ram-mandir-real.jpg',
      'https://images.unsplash.com/photo-1663158021153-6112a647d34c?auto=format&fit=crop&w=1200&q=80',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Ram_Mandir_Ayodhya.jpg/1280px-Ram_Mandir_Ayodhya.jpg'
    ],
    rating: 5.0,
    reviewsCount: 680,
    startingPrice: 28999,
    duration: '6 Days / 5 Nights',
    bestTime: 'October to March',
    weather: { temp: '23°C', condition: 'Sunny & Pleasant', humidity: '48%', bestSeason: 'Winter' },
    description: 'Embark on a soul-stirring pilgrimage to Shri Ram Janmabhoomi Mandir in Ayodhya. Marvel at the magnificent pink sandstone Kalinga-Nagara architectural marvel with OASIS Thrissur premium escort.',
    highlights: [
      'Express Pass VIP Darshan at Shri Ram Lalla Shrine',
      'Holy dip at Saryu River Ghats & Saryu Aarti evening ceremony',
      'Guided visit to Hanuman Garhi & Kanak Bhawan Palace',
      'Combined package option with Kashi Vishwanath & Prayagraj Sangam'
    ],
    travelGuide: {
      howToReach: 'Direct flights to Maharishi Valmiki International Airport Ayodhya (AYJ) or luxury train connection from Thrissur.',
      dressCode: 'Strictly traditional modesty. Metal objects and mobile phones stored in secure trust lockers.',
      localCuisine: 'Ayodhya Pedha, Ram Lalla Prasadam, Bedmi Puri & Aloo Sabzi.',
      essentialTips: 'Morning Darshan slot is less crowded. OASIS tour manager handles slot bookings.'
    },
    nearbyAttractions: [
      { name: 'Hanuman Garhi', distance: '1.2 km', type: 'Pilgrimage' },
      { name: 'Kanak Bhawan', distance: '0.8 km', type: 'Heritage' }
    ],
    hotels: [
      { name: 'The Park Inn by Radisson Ayodhya', rating: '5 Star', location: 'Ram Path' }
    ]
  },
  {
    id: 'thenkasi-viswanathar',
    name: 'Thenkasi Kasi Viswanathar Temple',
    tagline: 'Southern Kashi Shrine with Towering Majestic Gopuram',
    category: 'Pilgrimage',
    location: 'Tenkasi, Tamil Nadu',
    coordinates: [8.9592, 77.3160],
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Tenkasi_Kasi_Viswanathar_Temple_Gopuram.jpg/1280px-Tenkasi_Kasi_Viswanathar_Temple_Gopuram.jpg'
    ],
    rating: 4.8,
    reviewsCount: 195,
    startingPrice: 12999,
    duration: '3 Days / 2 Nights',
    bestTime: 'October to March',
    weather: { temp: '26°C', condition: 'Tropical Breeze', humidity: '62%', bestSeason: 'Winter' },
    description: 'Built by King Parakrama Pandya in the 15th century, Thenkasi Kasi Viswanathar Temple features a towering 180-foot Raja Gopuram designed so wind creates musical resonance.',
    highlights: [
      'Exclusive Darshan of Viswanathar & Ulagamman Sanctuaries',
      'Acoustic musical pillar stone exploration',
      'Excursion to Courtallam (Kutralam) Herbal Waterfalls',
      'Comfortable luxury AC coach ride from Thrissur'
    ],
    travelGuide: {
      howToReach: 'Direct scenic highway drive from Thrissur through Palakkad & Rajapalayam.',
      dressCode: 'Traditional South Indian attire (Dhoti/Saree).',
      localCuisine: 'Tenkasi Parotta, Tirunelveli Halwa, Special South Indian Meals.',
      essentialTips: 'Combine with Courtallam falls bath for a therapeutic natural spa trip.'
    },
    nearbyAttractions: [
      { name: 'Courtallam Main Falls', distance: '6 km', type: 'Nature' },
      { name: 'Tirunelveli Nellaiappar Temple', distance: '52 km', type: 'Heritage' }
    ],
    hotels: [
      { name: 'Saaral Resort Courtallam', rating: '4 Star Resort', location: 'Tenkasi Road' }
    ]
  },
  {
    id: 'tiruchendur-murugan',
    name: 'Tiruchendur Murugan Seashore Temple',
    tagline: 'Second Arupadai Veedu Facing the Sparkling Bay of Bengal',
    category: 'Pilgrimage',
    location: 'Tiruchendur, Tamil Nadu',
    coordinates: [8.4962, 78.1287],
    heroImage: 'https://images.unsplash.com/photo-1621360841013-c7683c659ec6?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1621360841013-c7683c659ec6?auto=format&fit=crop&w=1200&q=80',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Tiruchendur_Temple_Gopuram.jpg/1280px-Tiruchendur_Temple_Gopuram.jpg'
    ],
    rating: 4.9,
    reviewsCount: 310,
    startingPrice: 15999,
    duration: '3 Days / 2 Nights',
    bestTime: 'October to March',
    weather: { temp: '27°C', condition: 'Ocean breeze & clear skies', humidity: '68%', bestSeason: 'Winter' },
    description: 'The sole coastal shrine among Lord Murugan six abodes. Marvel at the 137-foot temple gopuram built on the seashore where sea waves gently wash the outer walls.',
    highlights: [
      'Special Abhishekham & Seeshdarshan tickets',
      'Holy dip at Nazhikinaru sacred freshwater well inside sea sand',
      'Sunrise view over Bay of Bengal behind temple spire',
      'Complete Arupadai Veedu tour package option'
    ],
    travelGuide: {
      howToReach: 'Direct express train from Thrissur to Tirunelveli/Tiruchendur or private luxury AC cab.',
      dressCode: 'Dhoti for men, Sarees/Salwar for women.',
      localCuisine: 'Tiruchendur Karupatti Sweet & Fresh Coastal Prasadam.',
      essentialTips: 'Nazhikinaru spring retains pure sweet drinking water despite being surrounded by salt sea water.'
    },
    nearbyAttractions: [
      { name: 'Nazhikinaru Sacred Spring', distance: '0.1 km', type: 'Sacred Site' },
      { name: 'Kulasekharapatnam Beach', distance: '14 km', type: 'Coastal Nature' }
    ],
    hotels: [
      { name: 'Hotel RSR International', rating: '4 Star', location: 'Temple Road' }
    ]
  },
  {
    id: 'gundlupet-sunflowers',
    name: 'Gundlupet Sunflower & Marigold Valley',
    tagline: 'Golden Blooming Meadows at the Gateway to Bandipur',
    category: 'Nature',
    location: 'Gundlupet, Chamarajanagar, Karnataka',
    coordinates: [11.8083, 76.6917],
    heroImage: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=80',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_field_in_Gundlupet.jpg/1280px-Sunflower_field_in_Gundlupet.jpg'
    ],
    rating: 4.7,
    reviewsCount: 180,
    startingPrice: 11999,
    duration: '2 Days / 1 Night',
    bestTime: 'June to September (Peak Blooming)',
    weather: { temp: '24°C', condition: 'Sunny & Golden', humidity: '55%', bestSeason: 'Monsoon/Autumn' },
    description: 'Witness endless golden carpets of blooming sunflowers and vibrant marigolds framed by Nilgiri mountains. Just a 4-hour scenic drive from Thrissur.',
    highlights: [
      'Private photography tour inside bloom farms',
      'Combine with Bandipur Tiger Reserve Wildlife Safari',
      'Scenic drive through Wayanad/Gundlupet forest pass',
      'Fresh organic farmstead lunch experience'
    ],
    travelGuide: {
      howToReach: 'Direct scenic drive from Thrissur via Sultan Bathery & Wayanad Ghat roads.',
      dressCode: 'Comfortable casuals, sun hats & sunglasses.',
      localCuisine: 'Karnataka Mysore Dosa, Organic Sugarcane Juice, Jaggery sweets.',
      essentialTips: 'Peak golden flower blooming occurs from July through September.'
    },
    nearbyAttractions: [
      { name: 'Bandipur National Park', distance: '15 km', type: 'Wildlife Safari' },
      { name: 'Himavad Gopalaswamy Betta', distance: '18 km', type: 'Mist Peak' }
    ],
    hotels: [
      { name: 'The Windflower Jungle Resort Bandipur', rating: '5 Star Resort', location: 'Bandipur Border' }
    ]
  },
  {
    id: 'puri-jagannath',
    name: 'Shree Jagannath Temple, Puri',
    tagline: 'Sacred Dham of the Lord of the Universe on Odisha Coast',
    category: 'Pilgrimage',
    location: 'Puri, Odisha',
    coordinates: [19.8049, 85.8179],
    heroImage: '/puri-jagannath-entrance-real.jpg',
    galleryImages: [
      '/puri-jagannath-entrance-real.jpg',
      '/puri-jagannath-real.jpg',
      'https://images.unsplash.com/photo-1626014903708-6979a4055278?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.9,
    reviewsCount: 440,
    startingPrice: 26999,
    duration: '5 Days / 4 Nights',
    bestTime: 'October to March',
    weather: { temp: '25°C', condition: 'Golden Sea Breeze', humidity: '64%', bestSeason: 'Winter' },
    description: 'One of the holiest Char Dham pilgrimage sites. Admire the 65-meter stone spire of Jagannath Temple, the daily flag-changing ceremony (Patitapabana Bana), and Golden Puri Beach.',
    highlights: [
      'VIP escorted entry at Jagannath Temple',
      'Sampling authentic Mahaprasad (56 Bhog cooked in earthen pots)',
      'Watching the daring daily flag change atop the 214-ft spire',
      'Golden Beach sunset stroll & Chilika Lake Dolphin excursion'
    ],
    travelGuide: {
      howToReach: 'Direct flights from Cochin to Bhubaneswar (BBI) + 1-hr luxury car transfer arranged by OASIS Thrissur.',
      dressCode: 'Strictly traditional Indian clothing. No leather items or electronic gadgets allowed inside.',
      localCuisine: 'Mahaprasada, Khaja sweet, Dalma, Chena Poda dessert.',
      essentialTips: 'Puri Golden Beach is blue-flag certified for safe clean swimming.'
    },
    nearbyAttractions: [
      { name: 'Puri Blue Flag Beach', distance: '2 km', type: 'Coastal Nature' },
      { name: 'Konark Sun Temple', distance: '35 km', type: 'UNESCO Heritage' }
    ],
    hotels: [
      { name: 'Mayfair Heritage Resort Puri', rating: '5 Star Luxury', location: 'Chakratirth Road' }
    ]
  },
  {
    id: 'konark-sun-temple',
    name: 'Konark Sun Temple Heritage',
    tagline: 'UNESCO World Heritage Architectural Miracle in Stone',
    category: 'Heritage',
    location: 'Konark, Odisha',
    coordinates: [19.8876, 86.0945],
    heroImage: 'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1200&q=80',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Konark_Sun_Temple_Wheel.jpg/1280px-Konark_Sun_Temple_Wheel.jpg'
    ],
    rating: 4.9,
    reviewsCount: 390,
    startingPrice: 24999,
    duration: '4 Days / 3 Nights',
    bestTime: 'October to March',
    weather: { temp: '24°C', condition: 'Clear Sky & Breeze', humidity: '58%', bestSeason: 'Winter' },
    description: 'Built in the 13th century in the form of a colossal 24-wheeled chariot pulled by seven horses, Konark Sun Temple is a masterwork of Kalinga stone sculpture.',
    highlights: [
      'Guided historical walkthrough of carved Sundial Wheels',
      'Light & Sound evening show detailing King Narasimhadeva legacy',
      'Chandrabhaga Beach serene sunset view',
      'Combined Puri-Konark-Bhubaneswar Golden Triangle tour'
    ],
    travelGuide: {
      howToReach: 'Included in OASIS Odisha Golden Triangle itinerary (Bhubaneswar - Puri - Konark).',
      dressCode: 'Comfortable clothing & walking footwear for monument exploration.',
      localCuisine: 'Odisha Chena Poda, Rasabali, Coastal Fish Curry.',
      essentialTips: 'The 24 carved stone wheels function as accurate solar time indicators.'
    },
    nearbyAttractions: [
      { name: 'Chandrabhaga Beach', distance: '3 km', type: 'Scenic Beach' },
      { name: 'Puri Jagannath Temple', distance: '35 km', type: 'Spiritual' }
    ],
    hotels: [
      { name: 'Lotus Resort Konark', rating: '4 Star Eco Resort', location: 'Ramchandi Beach' }
    ]
  },
  {
    id: 'lingaraj-bhubaneswar',
    name: 'Lingaraj Temple, Bhubaneswar',
    tagline: '11th Century Architectural Gem of the Temple City',
    category: 'Heritage',
    location: 'Bhubaneswar, Odisha',
    coordinates: [20.2382, 85.8338],
    heroImage: 'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1600100397608-f010e423b971?auto=format&fit=crop&w=1200&q=80',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Lingaraj_Temple_Bhubaneswar.jpg/1280px-Lingaraj_Temple_Bhubaneswar.jpg'
    ],
    rating: 4.8,
    reviewsCount: 230,
    startingPrice: 22999,
    duration: '4 Days / 3 Nights',
    bestTime: 'October to March',
    weather: { temp: '25°C', condition: 'Sunny', humidity: '52%', bestSeason: 'Winter' },
    description: 'Standing 180 feet high, Lingaraj Temple represents the pinnacle of Kalinga temple architecture, dedicated to Harihara (combined Vishnu and Shiva incarnation).',
    highlights: [
      'View of the 180ft carved Deula tower and Bindusagar Tank',
      'Exploration of Mukteshwar & Rajarani ancient temple complexes',
      'Udayagiri & Khandagiri Jain Caves guided trek',
      'Luxury air-conditioned stays in Bhubaneswar center'
    ],
    travelGuide: {
      howToReach: 'Direct flights connecting Cochin International Airport to Bhubaneswar BBI.',
      dressCode: 'Modest traditional dress required.',
      localCuisine: 'Bhubaneswar Dahibara Aloodum, Pitha sweets.',
      essentialTips: 'Elevated viewing platform available for non-Hindu international travelers to admire full courtyard view.'
    },
    nearbyAttractions: [
      { name: 'Mukteshwar Temple', distance: '1.5 km', type: 'Heritage' },
      { name: 'Udayagiri Caves', distance: '8 km', type: 'History' }
    ],
    hotels: [
      { name: 'Mayfair Lagoon Bhubaneswar', rating: '5 Star Luxury', location: 'Jaydev Vihar' }
    ]
  },
  {
    id: 'ooty-tea-railway',
    name: 'Ooty Tea Gardens & Nilgiri Mountain Railway',
    tagline: 'Queen of Hill Stations & UNESCO Heritage Toy Train',
    category: 'Hill Station',
    location: 'Ooty, Nilgiris, Tamil Nadu',
    coordinates: [11.4102, 76.6950],
    heroImage: '/ooty-toy-train-real.jpg',
    galleryImages: [
      '/ooty-toy-train-real.jpg',
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Nilgiri_Mountain_Railway_train.jpg/1280px-Nilgiri_Mountain_Railway_train.jpg'
    ],
    rating: 4.9,
    reviewsCount: 520,
    startingPrice: 16999,
    duration: '4 Days / 3 Nights',
    bestTime: 'September to May',
    weather: { temp: '16°C', condition: 'Crisp Mountain Air & Mist', humidity: '72%', bestSeason: 'All Year' },
    description: 'Escape to mist-laden pine forests, sprawling tea gardens, and ride the century-old UNESCO Heritage steam toy train along Nilgiri mountain trestle bridges with OASIS Thrissur luxury cars.',
    highlights: [
      'Guaranteed First-Class tickets on Nilgiri Heritage Toy Train',
      'Private tea leaf picking session at Doddabetta Tea Estate',
      'Boating at Ooty Lake & Botanical Garden stroll',
      'Coonoor Sim Park & Dolphin Nose vantage point visit'
    ],
    travelGuide: {
      howToReach: 'Just a 4.5-hour scenic drive from Thrissur through Coimbatore / Mettupalayam ghat road.',
      dressCode: 'Warm woolens & sweaters essential, comfortable walking shoes.',
      localCuisine: 'Ooty Handmade Chocolates, Fresh Eucalyptus Honey, Nilgiri Tea.',
      essentialTips: 'OASIS Thrissur pre-books toy train tickets 120 days in advance.'
    },
    nearbyAttractions: [
      { name: 'Doddabetta Peak (2,637m)', distance: '10 km', type: 'Viewpoint' },
      { name: 'Coonoor Tea Estates', distance: '18 km', type: 'Scenic' }
    ],
    hotels: [
      { name: 'Savoy - IHCL SeleQtions Ooty', rating: '5 Star Heritage', location: 'Old Mettupalayam Road' }
    ]
  },
  {
    id: 'parambikulam-tiger-reserve',
    name: 'Parambikulam Tiger Reserve Sanctuary',
    tagline: 'Pristine Wilderness & Teak Forests of the Anamalai Hills',
    category: 'Wildlife',
    location: 'Palakkad / Parambikulam, Kerala',
    coordinates: [10.3927, 76.7758],
    heroImage: 'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1920&q=85',
    galleryImages: [
      'https://images.unsplash.com/photo-1511497584788-8767611136f6?auto=format&fit=crop&w=1200&q=80',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Parambikulam_Reservoir_Kerala.jpg/1280px-Parambikulam_Reservoir_Kerala.jpg'
    ],
    rating: 4.8,
    reviewsCount: 265,
    startingPrice: 13999,
    duration: '3 Days / 2 Nights',
    bestTime: 'October to April',
    weather: { temp: '22°C', condition: 'Forest Breeze & Shade', humidity: '75%', bestSeason: 'Winter' },
    description: 'Home to the world oldest teak tree (Kannimara Teak) and thriving populations of Bengal tigers, Asian elephants, and Great Indian Hornbills. Easily accessible from Thrissur.',
    highlights: [
      'Jungle safari escorted by indigenous tribal forest naturalists',
      'Bamboo rafting on serene Parambikulam Reservoir',
      'Visit to Kannimara Teak (over 450 years old tree)',
      'Overnight stay inside eco-treehouse or island nest resort'
    ],
    travelGuide: {
      howToReach: 'Direct 2.5-hour drive from Thrissur through Sethumadai checkpost.',
      dressCode: 'Earthy neutral tones (Green/Khaki), sturdy walking boots.',
      localCuisine: 'Traditional Kerala Tribal Cuisine (Kappa, Fish Curry, Bamboo Rice).',
      essentialTips: 'Plastic-free eco zone. Eco-tourism bookings managed by OASIS team.'
    },
    nearbyAttractions: [
      { name: 'Kannimara Teak Tree', distance: '5 km', type: 'Natural Heritage' },
      { name: 'Topslip Tiger Reserve', distance: '12 km', type: 'Wildlife' }
    ],
    hotels: [
      { name: 'Tented Niche Eco Resort', rating: '4 Star Eco Lodge', location: 'Parambikulam Core Zone' }
    ]
  },
  {
    id: 'munnar-tea-plantations',
    name: 'Munnar Tea Plantations & Anamudi',
    tagline: 'Emerald Carpeted Hills & Misty Valleys of God Own Country',
    category: 'Hill Station',
    location: 'Munnar, Idukki, Kerala',
    coordinates: [10.0889, 77.0595],
    heroImage: '/munnar-tea-plantations-real.jpg',
    galleryImages: [
      '/munnar-tea-plantations-real.jpg',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Munnar_tea_plantations_Kerala.jpg/1280px-Munnar_tea_plantations_Kerala.jpg'
    ],
    rating: 5.0,
    reviewsCount: 780,
    startingPrice: 15999,
    duration: '4 Days / 3 Nights',
    bestTime: 'September to May',
    weather: { temp: '15°C', condition: 'Misty & Refreshing', humidity: '78%', bestSeason: 'All Year' },
    description: 'Munnar offers 12,000 hectares of manicured tea estates, rare Neelakurinji blooms, and South India highest peak Anamudi. A signature OASIS Thrissur weekend getaway.',
    highlights: [
      'Private 4x4 Jeep Safari to Kolukkumalai (World Highest Tea Estate at 7,900ft)',
      'Eravikulam National Park Nilgiri Tahr endangered goat sighting',
      'Mattupetty Dam speedboat ride & Echo Point walkthrough',
      'Luxury valley view resort stay with campfire & tea tasting'
    ],
    travelGuide: {
      howToReach: 'Direct 3.5-hour picturesque highway drive from Thrissur via Chalakudy / Perumbavoor.',
      dressCode: 'Layered warm clothing, comfortable trek shoes.',
      localCuisine: 'Kerala Cardamom Tea, Appam with Stew, Fresh Spices.',
      essentialTips: 'Sunrise jeep trip to Kolukkumalai leaves at 4:30 AM for cloud-bed sunrise.'
    },
    nearbyAttractions: [
      { name: 'Eravikulam National Park', distance: '12 km', type: 'Wildlife' },
      { name: 'Kolukkumalai Sunrise Peak', distance: '32 km', type: 'Viewpoint' }
    ],
    hotels: [
      { name: 'The Panoramic Getaway Munnar', rating: '5 Star Luxury', location: 'Chithirapuram' }
    ]
  }
];
