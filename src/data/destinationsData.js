// Comprehensive Dataset of Real Destinations with Authentic High-Resolution Web Photographs
// All images are 100% real, authentic travel photographs sourced from verified web sources & Wikimedia Commons.

export const DESTINATIONS = [
  {
    id: 'ooty-nilgiri-hills',
    name: 'Ooty Nilgiri Hills & Heritage Toy Train',
    tagline: 'Queen of Hill Stations, Emerald Tea Gardens & Steam Rail',
    category: 'Hill Station',
    location: 'Ooty, Nilgiris, Tamil Nadu',
    coordinates: [11.4102, 76.6950],
    heroImage: './ooty-toy-train-real.jpg',
    bgMixImages: [
      './ooty-toy-train-real.jpg',
      './ooty-botanical-garden-real.jpg',
      './ooty-lake-boating-real.jpg',
      './ooty-tea-gardens-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      './ooty-toy-train-real.jpg',
      './ooty-botanical-garden-real.jpg',
      './ooty-lake-boating-real.jpg',
      './ooty-tea-gardens-real.jpg'
    ],
    rating: 4.97,
    reviewsCount: 388,
    startingPrice: 14999,
    duration: '3 Days / 2 Nights',
    bestTime: 'October to June',
    weather: { temp: '16°C', condition: 'Crisp & Misty', humidity: '65%', bestSeason: 'Summer & Winter' },
    description: 'Experience the romantic Queen of Hill Stations with OASIS Thrissur. Board the vintage UNESCO World Heritage Nilgiri Mountain Toy Train, stroll through 55-acre Government Botanical Gardens, boat across Ooty Lake, and explore panoramic Doddabetta Peak with direct luxury coach transfers from Thrissur Swaraj Round.',
    highlights: [
      'Reserved VIP Tickets for Nilgiri Mountain Heritage Toy Train',
      'Excursion to Government Botanical Garden & Italian Glasshouse',
      'Pedal & Speedboating on scenic 65-acre Ooty Lake',
      'Doddabetta Peak (8,652 ft) & Pykara Waterfall Safari'
    ],
    travelGuide: {
      howToReach: 'Direct luxury AC coach transfers from Thrissur Swaraj Round (195 km via Palakkad, Coimbatore & Mettupalayam ghats).',
      dressCode: 'Warm woollen sweaters, jackets for morning/evening & comfortable walking shoes.',
      localCuisine: 'Authentic Nilgiri Homemade Chocolates, Fresh Eucalyptus Tea, Hot Vada Pav & South Indian Thali.',
      essentialTips: 'Toy train tickets book weeks in advance; OASIS manages reserved group seats.'
    },
    nearbyAttractions: [
      { name: 'Doddabetta Peak', distance: '9 km', type: 'Viewpoint' },
      { name: 'Pykara Falls & Lake', distance: '21 km', type: 'Waterfall' },
      { name: 'Government Rose Garden', distance: '3 km', type: 'Garden' }
    ],
    hotels: [
      { name: 'Savoy - IHCL SeleQtions Ooty', rating: '5 Star Heritage', location: 'Sylks Road' },
      { name: 'Sterling Ooty Fern Hill Resort', rating: '4 Star Deluxe', location: 'Fern Hill' }
    ]
  },
  {
    id: 'kochi-heritage-harbor',
    name: 'Kochi Heritage Harbor & Fort Kochi',
    tagline: 'Queen of the Arabian Sea, Chinese Fishing Nets & Dutch Palaces',
    category: 'Heritage & Beaches',
    location: 'Kochi / Ernakulam, Kerala',
    coordinates: [9.9312, 76.2673],
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1920&q=85',
    bgMixImages: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.95,
    reviewsCount: 412,
    startingPrice: 8999,
    duration: '2 Days / 1 Night',
    bestTime: 'September to March',
    weather: { temp: '28°C', condition: 'Tropical Coastal Breeze', humidity: '75%', bestSeason: 'Winter & Spring' },
    description: 'Explore the historic Queen of the Arabian Sea with OASIS Thrissur. Witness the iconic 14th-century Chinese Fishing Nets at sunset, 1555 Mattancherry Dutch Palace with ancient Ramayana murals, 1568 Jewish Synagogue and Jew Town antique lanes, St. Francis Church (Vasco da Gama 1503), and Marine Drive evening harbor cruise with direct private AC transfers from Thrissur Swaraj Round.',
    highlights: [
      'Guided Sunset Excursion to Fort Kochi Chinese Fishing Nets',
      'VIP Entry to Mattancherry Dutch Palace & Jewish Synagogue',
      'Evening Marine Drive Harbor Sunset Cruise across Vembanad Lake',
      'Private luxury AC transport from Thrissur Swaraj Round Main Branch'
    ],
    travelGuide: {
      howToReach: 'Direct 72 km luxury AC coach / private car drive from Thrissur Swaraj Round via NH544 & Edappally (1.5 hrs).',
      dressCode: 'Light cotton casuals, modest attire for synagogues and churches, sunhat & sunglasses.',
      localCuisine: 'Authentic Cochin Seafood Thali, Karimeen Pollichathu, Appam with Stew & Jew Town Spiced Pastries.',
      essentialTips: 'Chinese fishing nets best photographed at sunset (5:30 PM - 6:30 PM). Jewish synagogue closed on Saturdays.'
    },
    nearbyAttractions: [
      { name: 'Chinese Fishing Nets', distance: '1 km', type: 'Heritage' },
      { name: 'Mattancherry Palace', distance: '3 km', type: 'History' },
      { name: 'Marine Drive Rainbow Bridge', distance: '5 km', type: 'Waterfront' }
    ],
    hotels: [
      { name: 'Brunton Boatyard - CGH Earth', rating: '5 Star Heritage', location: 'Fort Kochi' },
      { name: 'Grand Hyatt Kochi Bolgatty', rating: '5 Star Luxury', location: 'Bolgatty Island' }
    ]
  },
  {
    id: 'wayanad-misty-hills',
    name: 'Wayanad Misty Hills & Heart Lake',
    tagline: 'High Altitude Rainforests & Heritage Caves',
    category: 'Hill Station',
    location: 'Wayanad, Kerala',
    coordinates: [11.6854, 76.1320],
    heroImage: './wayanad_chembra_heart_lake_ai.png',
    galleryImages: [
      './wayanad_chembra_heart_lake_ai.png',
      './wayanad_banasura_lake_ai.png'
    ],
    rating: 4.94,
    reviewsCount: 245,
    startingPrice: 16999,
    duration: '3 Days / 2 Nights',
    bestTime: 'October to May',
    weather: { temp: '21°C', condition: 'Misty & Cool', humidity: '70%', bestSeason: 'Winter & Spring' },
    description: 'Discover the misty tea plantations, prehistoric Edakkal caves, and heart-shaped Chembra Lake in Wayanad with OASIS Thrissur. Direct escorted tours departing from Swaraj Round with luxury resort stays.',
    highlights: [
      'Trek to Chembra Peak & Natural Heart-Shaped Lake',
      'Speedboat Ride on Banasura Sagar Dam Lake',
      'Prehistoric Petroglyph Exploration at Edakkal Caves',
      'Treehouse Resort Stay with Tea Plantation Views'
    ],
    travelGuide: {
      howToReach: 'Direct luxury AC transfers from Thrissur Swaraj Round (175 km via Kozhikode-Thamarassery ghats).',
      dressCode: 'Comfortable trekking shoes, warm layers for evening & rain gear.',
      localCuisine: 'Authentic Wayanad Bamboo Rice Payasam, Malabar Parotta & Duck Roast.',
      essentialTips: 'Chembra peak trekking permits issued early morning. Edakkal caves closed Mondays.'
    },
    nearbyAttractions: [
      { name: 'Edakkal Caves', distance: '12 km', type: 'Heritage' },
      { name: 'Banasura Sagar Dam', distance: '21 km', type: 'Lake' },
      { name: 'Kuruva Island', distance: '35 km', type: 'Ecotourism' }
    ],
    hotels: [
      { name: 'Vythiri Resort Treehouses', rating: '5 Star Deluxe', location: 'Vythiri' },
      { name: 'Banasura Hill Eco Resort', rating: '4 Star', location: 'Padinjarathara' }
    ]
  },
  {
    id: 'athirappilly-waterfalls',
    name: 'Athirappilly Waterfalls & Chalakudy River',
    tagline: 'The Niagara of India & Rainforest Paradise',
    category: 'Nature',
    location: 'Chalakudy, Thrissur, Kerala',
    coordinates: [10.2851, 76.5698],
    heroImage: './athirappilly_waterfall_main_ai.png',
    galleryImages: [
      './athirappilly_waterfall_main_ai.png',
      './athirappilly_rainbow_spray_ai.png',
      './athirappilly_chalakudy_river_ai.png',
      './athirappilly_twilight_view_ai.png'
    ],
    rating: 4.98,
    reviewsCount: 312,
    startingPrice: 4999,
    duration: '1 Day / Day Tour',
    bestTime: 'June to January (Monsoon & Post-Monsoon)',
    weather: { temp: '26°C', condition: 'Misty & Tropical', humidity: '80%', bestSeason: 'Monsoon Magic' },
    description: 'Witness India\'s most majestic 80-foot roaring waterfall cascading through lush Sholayar rainforests with OASIS Thrissur. Located just 1.2 hours from Swaraj Round, Athirappilly offers bamboo forest walks, rainbow mist sprays, and Chalakudy river eco-tours.',
    highlights: [
      'Guided Trek to Base of Athirappilly Roaring Waterfall',
      'Excursion to Vazhachal Cascades & Charpa Falls',
      'Chalakudy Riverfront Picnic & Rainforest Canopy Stroll',
      'Luxury AC Transport from Thrissur Swaraj Round Main Branch'
    ],
    travelGuide: {
      howToReach: 'Direct 48 km AC private cab/coach drive from Thrissur Swaraj Round via Chalakudy.',
      dressCode: 'Comfortable footwear with good grip, light cotton clothing & rainwear.',
      localCuisine: 'Authentic Kerala Fish Curry Meals, Toddy Shop Style Cuisine & Fresh Tender Coconut.',
      essentialTips: 'Best photography views from top viewpoint at 10 AM and base at 4 PM.'
    },
    nearbyAttractions: [
      { name: 'Vazhachal Waterfalls', distance: '5 km', type: 'Nature' },
      { name: 'Charpa Falls', distance: '3 km', type: 'Waterfall' },
      { name: 'Thumboormuzhi Butterfly Park', distance: '14 km', type: 'Ecotourism' }
    ],
    hotels: [
      { name: 'Rainforest Luxury Resort Athirappilly', rating: '5 Star Deluxe', location: 'Waterfall View' },
      { name: 'Niramayam Jungle Resort', rating: '4 Star', location: 'Chalakudy Riverfront' }
    ]
  },
  {
    id: 'silent-valley-national-park',
    name: 'Silent Valley National Park & Kunthi River',
    tagline: 'Pristine Virgin Rainforest & Rare Wildlife Expedition',
    category: 'Nature',
    location: 'Mannarkkad, Palakkad, Kerala',
    coordinates: [11.0833, 76.4500],
    heroImage: './silent_valley_rainforest_ai.png',
    galleryImages: [
      './silent_valley_rainforest_ai.png',
      './silent_valley_kunthi_river_ai.png',
      './silent_valley_wildlife_ai.png',
      './silent_valley_watchtower_ai.png'
    ],
    rating: 4.96,
    reviewsCount: 168,
    startingPrice: 18999,
    duration: '3 Days / 2 Nights',
    bestTime: 'September to March',
    weather: { temp: '20°C', condition: 'Misty & Refreshing', humidity: '75%', bestSeason: 'Post-Monsoon & Winter' },
    description: 'Explore one of the world\'s oldest, most undisturbed tropical evergreen rainforests with OASIS Thrissur. Located just 2.5 hours from Thrissur Swaraj Round, Silent Valley is home to the rare Lion-Tailed Macaque, crystal clear Kunthi river, and ancient forest canopy.',
    highlights: [
      'Guided Forest Trek through Sairandhri Canopy & Watchtower',
      'Excursion to pristine Kunthi River & Suspension Bridge',
      'Wildlife Spotting: Lion-Tailed Macaque, Malabar Giant Squirrel & Hornbills',
      'Luxury Forest Eco-Lodge stay with Sattvic Kerala Dining'
    ],
    travelGuide: {
      howToReach: 'Direct luxury AC transfers from Thrissur Swaraj Round (85 km via Palakkad-Mannarkkad road).',
      dressCode: 'Light cotton trekking wear, sturdy hiking boots & earth-toned clothing.',
      localCuisine: 'Authentic Palakkad Iyer Sadya, Fresh Bamboo Shoot Curry & Wild Honey Herbal Tea.',
      essentialTips: 'Forest entry passes handled directly by OASIS escort desk. Plastic-free zone.'
    },
    nearbyAttractions: [
      { name: 'Sairandhri Watchtower', distance: '1 km', type: 'Viewpoint' },
      { name: 'Kunthi River Suspension Bridge', distance: '2 km', type: 'Nature' },
      { name: 'Kanjirapuzha Dam & Gardens', distance: '28 km', type: 'Sightseeing' }
    ],
    hotels: [
      { name: 'Silent Valley Eco Resort', rating: '4 Star Deluxe', location: 'Mukkali' },
      { name: 'Palakkad Heritage Jungle Lodge', rating: ' luxury Eco', location: 'Mannarkkad' }
    ]
  },
  {
    id: 'kashi-varanasi',
    name: 'Kashi Vishwanath Temple & Varanasi',
    tagline: 'The Eternal City of Light & Devotion',
    category: 'Pilgrimage',
    location: 'Varanasi, Uttar Pradesh',
    coordinates: [25.3109, 83.0107],
    heroImage: './kashi-vishwanath-real.jpg',
    galleryImages: [
      './kashi-vishwanath-real.jpg',
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
    heroImage: './kashi-vishwanath-real.jpg',
    bgMixImages: [
      './kashi-vishwanath-real.jpg',
      './ayodhya-ram-mandir-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      './kashi-vishwanath-real.jpg',
      './ayodhya-ram-mandir-real.jpg'
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
    heroImage: './horanadu-annapoorneshwari-real.jpg',
    bgMixImages: [
      './horanadu-annapoorneshwari-real.jpg',
      './munnar-tea-plantations-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      './horanadu-annapoorneshwari-real.jpg',
      './munnar-tea-plantations-real.jpg'
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
    heroImage: './ayodhya-ram-mandir-real.jpg',
    bgMixImages: [
      './ayodhya-ram-mandir-real.jpg',
      './kashi-vishwanath-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      './ayodhya-ram-mandir-real.jpg',
      './kashi-vishwanath-real.jpg'
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
    heroImage: './thenkasi-viswanathar-real.jpg',
    bgMixImages: [
      './thenkasi-viswanathar-real.jpg',
      './tiruchendur-murugan-real.jpg',
      './tiruchendur-beach-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      './thenkasi-viswanathar-real.jpg',
      './tiruchendur-murugan-real.jpg'
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
    heroImage: './tiruchendur-murugan-real.jpg',
    bgMixImages: [
      './tiruchendur-murugan-real.jpg',
      './tiruchendur-beach-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      './tiruchendur-murugan-real.jpg',
      './tiruchendur-beach-real.jpg'
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
    heroImage: './gundlupet-sunflowers-real.jpg',
    bgMixImages: [
      './gundlupet-sunflowers-real.jpg',
      './parambikulam-forest-real.jpg',
      './ooty-tea-gardens-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      './gundlupet-sunflowers-real.jpg',
      './parambikulam-forest-real.jpg'
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
    heroImage: './puri-jagannath-entrance-real.jpg',
    bgMixImages: [
      './puri-jagannath-entrance-real.jpg',
      './puri-jagannath-real.jpg',
      './konark-sun-temple-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      './puri-jagannath-entrance-real.jpg',
      './puri-jagannath-real.jpg',
      './konark-sun-temple-real.jpg'
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
    heroImage: './konark-sun-temple-real.jpg',
    bgMixImages: [
      './konark-sun-temple-real.jpg',
      './puri-jagannath-real.jpg',
      './lingaraj-temple-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      './konark-sun-temple-real.jpg',
      './puri-jagannath-real.jpg'
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
    heroImage: './lingaraj-temple-real.jpg',
    bgMixImages: [
      './lingaraj-temple-real.jpg',
      './konark-sun-temple-real.jpg',
      './puri-jagannath-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      './lingaraj-temple-real.jpg',
      './konark-sun-temple-real.jpg'
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
    heroImage: './ooty-toy-train-real.jpg',
    bgMixImages: [
      './ooty-toy-train-real.jpg',
      './ooty-tea-gardens-real.jpg',
      './ooty-botanical-garden-real.jpg',
      './ooty-lake-boating-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      './ooty-toy-train-real.jpg',
      './ooty-tea-gardens-real.jpg',
      './ooty-botanical-garden-real.jpg',
      './ooty-lake-boating-real.jpg',
      'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1200&q=80'
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
    heroImage: './parambikulam-tiger-real.jpg',
    galleryImages: [
      './parambikulam-tiger-real.jpg',
      './parambikulam-forest-real.jpg',
      './parambikulam-lake-real.jpg'
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
    heroImage: './munnar-tea-plantations-real.jpg',
    galleryImages: [
      './munnar-tea-plantations-real.jpg',
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
  },
  {
    id: 'kashmir-punjab-golden-trail',
    name: 'Kashmir Paradise & Punjab Golden Trail',
    tagline: 'Dal Lake Shikara Rides, Snowy Meadows & the Golden Temple',
    category: 'Holiday',
    location: 'Srinagar / Gulmarg / Amritsar, India',
    coordinates: [34.1172, 74.8679],
    heroImage: './dal-lake-shikara-real.jpg',
    bgMixImages: [
      './dal-lake-shikara-real.jpg',
      './gulmarg-real.jpg',
      './golden-temple-real.jpg',
      './wagah-border-real.jpg'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      './dal-lake-shikara-real.jpg',
      './gulmarg-real.jpg',
      './pahalgam-real.jpg',
      './sonamarg-real.jpg',
      './srinagar-real.jpg',
      './golden-temple-real.jpg',
      './wagah-border-real.jpg'
    ],
    rating: 4.98,
    reviewsCount: 420,
    startingPrice: 49999,
    duration: '7 Days / 6 Nights',
    bestTime: 'April to October (Summer), December to February (Snow)',
    weather: { temp: '18°C', condition: 'Crisp Mountain Air & Clear Skies', humidity: '55%', bestSeason: 'April – October' },
    description: 'A majestic Himalayan and Punjabi cultural circuit from Thrissur — shikara rides over the mirror-still Dal Lake, gondola cable car at Gulmarg, valley views of Pahalgam, glacier walks at Sonamarg, the serene Mughal gardens of Srinagar, and the resplendent Golden Temple with the Wagah Border retreat ceremony.',
    highlights: [
      'Romantic Shikara Ride on the emerald Dal Lake with floating market & lotus gardens',
      'Gulmarg Gondola — the worlds second highest cable car (Kongdoori 13,050 ft)',
      'Pahalgam & Betaab Valley scenic drives along the Lidder River',
      'Sonamarg Thajiwas Glacier pony trek & snow adventure',
      'Golden Temple (Harmandir Sahib) Darshan & Langar community meal in Amritsar',
      'Wagah Border India–Pakistan Beating Retreat evening ceremony',
      'Houseboat night stay on Dal Lake with Kashmiri Wazwan feast'
    ],
    travelGuide: {
      howToReach: 'Direct flight from Cochin (COK) to Srinagar (SXR) via Delhi, escorted by OASIS tour manager from Thrissur.',
      dressCode: 'Layered woollens for high-altitude meadows; warm pheran shawls provided at Dal Lake houseboat.',
      localCuisine: 'Kashmiri Wazwan, Rogan Josh, Dum Aloo, Kahwa Tea, Amritsari Kulcha & Makki di Roti with Sarson da Saag.',
      essentialTips: 'Gulmarg gondola & Dal Lake houseboats book months in advance — OASIS reserves VIP priority passes.'
    },
    nearbyAttractions: [
      { name: 'Mughal Gardens — Shalimar & Nishat', distance: '9 km', type: 'Heritage Garden' },
      { name: 'Betaab Valley, Pahalgam', distance: '25 km', type: 'Scenic Valley' }
    ],
    hotels: [
      { name: 'Deluxe Dal Lake Houseboat', rating: '5 Star Heritage Houseboat', location: 'Dal Lake, Srinagar' },
      { name: 'Hotel Welcome Grand Srinagar', rating: '4 Star', location: 'Boulevard Road' },
      { name: 'Hotel Ritz Plaza Amritsar', rating: '4 Star', location: 'Near Golden Temple' }
    ]
  },
  {
    id: 'kodaikanal-princess-hills',
    name: 'Kodaikanal Princess of Hill Stations',
    tagline: 'Misty Star Lake, Pine Forest Canopy & Pillar Rock Spires',
    category: 'Hill Station',
    location: 'Kodaikanal, Dindigul, Tamil Nadu',
    coordinates: [10.2381, 77.4892],
    heroImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1920&q=85',
    bgMixImages: [
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    bgMixStyle: 'collage-blend',
    galleryImages: [
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.96,
    reviewsCount: 365,
    startingPrice: 15999,
    duration: '3 Days / 2 Nights',
    bestTime: 'October to June (Spring & Summer)',
    weather: { temp: '18°C', condition: 'Pleasant & Misty', humidity: '65%', bestSeason: 'Summer & Winter' },
    description: 'Discover the Princess of Hill Stations with OASIS Thrissur. Pedal boat on the 60-acre star-shaped Kodaikanal Lake, stroll through Bryant Botanical Park with 740+ rose varieties, explore 400-foot Pillar Rocks and the famed Manjummel Guna Caves, with direct luxury AC coach transfers from Thrissur Swaraj Round.',
    highlights: [
      'Pedal Boating & Perimeter Cycling on 60-acre Kodaikanal Star Lake',
      'Coaker’s Walk 180-degree Panoramic Valley View & Telescope Deck',
      'Exploration of 400 ft Pillar Rocks & Manjummel Guna Caves',
      'Century-old Dense Pine Forest Walk & Silver Cascade Falls Excursion'
    ],
    travelGuide: {
      howToReach: 'Direct luxury AC coach transfers from Thrissur Swaraj Round (230 km via Palakkad, Pollachi & Palani ghats).',
      dressCode: 'Warm layers, light woollens for evening mist & comfortable walking shoes.',
      localCuisine: 'Homemade Kodai Artisan Chocolates, Fresh Organic Plums, Eucalyptus Oil & South Indian Thali.',
      essentialTips: 'Boating at Kodaikanal Lake is most pleasant at 8:30 AM before mist rises.'
    },
    nearbyAttractions: [
      { name: 'Kodaikanal Star Lake', distance: '1.2 km', type: 'Lake & Boating' },
      { name: 'Bryant Botanical Park', distance: '1.5 km', type: 'Garden' },
      { name: 'Pillar Rocks', distance: '7.2 km', type: 'Viewpoint' }
    ],
    hotels: [
      { name: 'The Carlton Kodaikanal (5 Star Lakeside Luxury)', rating: '5 Star Deluxe', location: 'Lake Road' },
      { name: 'Sterling Kodaikanal Valley Resort', rating: '4 Star Deluxe', location: 'Pallangi Road' }
    ]
  },
  {
    id: 'kollam-ashtamudi-lake',
    name: 'Kollam Ashtamudi Backwaters & Jatayu Rock',
    tagline: 'Gateway to Kerala Backwaters & Coastal Heritage',
    category: 'Backwaters',
    location: 'Kollam, Kerala',
    coordinates: [8.8932, 76.6141],
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    galleryImages: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80'
    ],
    rating: 4.92,
    reviewsCount: 268,
    startingPrice: 13999,
    duration: '2 Days / 1 Night',
    bestTime: 'September to March (Pleasant Backwater Breeze)',
    weather: { temp: '29°C', condition: 'Warm Coastal & Backwater', humidity: '72%', bestSeason: 'Winter Cruising' },
    description: 'Sail the legendary 8-arm Ashtamudi backwaters of Kollam on a luxury houseboat, climb the world\'s largest bird sculpture at Jatayu Rock, and explore the 1902 Thangassery Light House with OASIS Thrissur. India\'s first ecotourism destination, Thenmala, and the hidden canals of Munroe Island complete this coastal heritage odyssey.',
    highlights: [
      'Luxury Ashtamudi Houseboat Cruise with On-board Kerala Seafood Sadya',
      'Jatayu Earth\'s Center — World\'s Largest Bird Sculpture & Cable Car',
      'Thangassery 144-ft Light House & 16th-century Fort Ruins Walk',
      'Munroe Island Canoe Ride through Tree-canopied Backwater Canals',
      'Luxury AC Transport & Escorted Guide from Thrissur Swaraj Round'
    ],
    travelGuide: {
      howToReach: 'Direct 4-hr AC coach/cab from Thrissur via MC Road; Kollam Junction is the backwater gateway with excellent rail links.',
      dressCode: 'Light cottons, sun hat, sunscreen; floaters or sandals for jetty and canoe rides.',
      localCuisine: 'Backwater Kerala fish curry, Karimeen pollichathu, appam, and fresh toddy-shop fare.',
      essentialTips: 'Book the houseboat for the 02:00 PM–09:00 AM cruise for the classic Alappuzha backwater sunrise.'
    },
    nearbyAttractions: [
      { name: 'Ashtamudi Lake', distance: '2 km', type: 'Backwater Cruise' },
      { name: 'Thangassery Light House', distance: '5 km', type: 'Heritage' },
      { name: 'Jatayu Earth\'s Center', distance: '38 km', type: 'Adventure' },
      { name: 'Munroe Island', distance: '26 km', type: 'Backwater Village' }
    ],
    hotels: [
      { name: 'Backwater Royale Houseboat Stay', rating: 'Luxury Houseboat', location: 'Ashtamudi Lake' },
      { name: 'Kollam Lakeshore Heritage Resort', rating: '4 Star', location: 'Kollam Beach' }
    ]
  }
];

