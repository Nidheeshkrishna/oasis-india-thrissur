// Curated database of major travel hubs, pickup points, railway stations, airports, and nearby attractions
// for Kerala, South India, and major pilgrimage/nature routes across India.

export const LOCATION_CATEGORIES = {
  hub:      { label: 'Major Hub / Swaraj Boarding', icon: '🟢', color: '#10b981' },
  railway:  { label: 'Railway Station',             icon: '🚉', color: '#3b82f6' },
  airport:  { label: 'Airport / Flight Terminal',    icon: '✈️', color: '#06b6d4' },
  bus:      { label: 'Bus Terminal / Mobility Hub', icon: '🚌', color: '#f59e0b' },
  temple:   { label: 'Temple / Spiritual Shrine',   icon: '🛕', color: '#ec4899' },
  nature:   { label: 'Nature / Scenic Viewpoint',   icon: '🌴', color: '#10b981' },
  landmark: { label: 'Famous Attraction / Lake',    icon: '📍', color: '#d4af37' }
};

export const NEARBY_LOCATIONS_DATABASE = [
  // ─── THRISSUR & CENTRAL KERALA ───
  {
    name: 'Thrissur Swaraj Round Main Hub',
    category: 'hub',
    region: 'Thrissur',
    lat: 10.5276,
    lng: 76.2144,
    nearby: [
      'Thrissur Junction (TCR) Railway Station',
      'Vadakkumnathan Temple Round',
      'KSRTC Central Bus Station Thrissur',
      'Guruvayur Temple East Nada',
      'Athirappilly Waterfalls Gateway'
    ]
  },
  {
    name: 'Thrissur Junction (TCR) Railway Station',
    category: 'railway',
    region: 'Thrissur',
    lat: 10.5186,
    lng: 76.2104,
    nearby: [
      'Thrissur Swaraj Round Main Hub',
      'KSRTC Stand Thrissur',
      'Sakthan Thampuran Bus Stand',
      'Paramekkavu Bagavathi Temple'
    ]
  },
  {
    name: 'Guruvayur Temple East Nada',
    category: 'temple',
    region: 'Thrissur',
    lat: 10.5947,
    lng: 76.0387,
    nearby: [
      'Guruvayur Railway Station',
      'Mammiyoor Shiva Temple',
      'Punnathur Kotta Elephant Sanctuary',
      'Chavakkad Beach'
    ]
  },
  {
    name: 'Athirappilly Waterfalls Gateway',
    category: 'nature',
    region: 'Thrissur',
    lat: 10.2847,
    lng: 76.5694,
    nearby: [
      'Vazhachal Falls & Forest Checkpoint',
      'Charpa Falls',
      'Thumboormuzhy Dam & Butterfly Garden',
      'Chalakudy Railway Station'
    ]
  },
  {
    name: 'Chalakudy Railway Station & Bus Stand',
    category: 'railway',
    region: 'Thrissur',
    lat: 10.3069,
    lng: 76.3338,
    nearby: [
      'Athirappilly Waterfalls Gateway',
      'Cochin International Airport (COK)',
      'Thumboormuzhy River Garden'
    ]
  },

  // ─── KOCHI & ERNAKULAM ───
  {
    name: 'Cochin International Airport (COK)',
    category: 'airport',
    region: 'Kochi',
    lat: 10.1518,
    lng: 76.3930,
    nearby: [
      'Angamaly for Kalady Railway Station',
      'Aluva Metro Station & Periyar Ghat',
      'Kalady Adi Shankara Janmabhoomi',
      'Thrissur Swaraj Round Main Hub',
      'Cherai Beach'
    ]
  },
  {
    name: 'Ernakulam South (ERS) Junction',
    category: 'railway',
    region: 'Kochi',
    lat: 9.9714,
    lng: 76.2842,
    nearby: [
      'Ernakulam Town (ERN) North Station',
      'Vyttila Mobility Hub Kochi',
      'Fort Kochi Chinese Fishing Nets',
      'Marine Drive Walkway Kochi',
      'MG Road Metro Station'
    ]
  },
  {
    name: 'Vyttila Mobility Hub Kochi',
    category: 'bus',
    region: 'Kochi',
    lat: 9.9678,
    lng: 76.3197,
    nearby: [
      'Ernakulam South (ERS) Junction',
      'Edappally Lulu Mall Gateway',
      'Kaloor International Stadium',
      'Kundannoor Junction'
    ]
  },
  {
    name: 'Fort Kochi Heritage Quarter',
    category: 'landmark',
    region: 'Kochi',
    lat: 9.9658,
    lng: 76.2421,
    nearby: [
      'Chinese Fishing Nets Fort Kochi',
      'Mattancherry Jew Town & Synagogue',
      'St. Francis Church Fort Kochi',
      'Vasco da Gama Square'
    ]
  },
  {
    name: 'Aluva Metro & Railway Station',
    category: 'railway',
    region: 'Kochi',
    lat: 10.1102,
    lng: 76.3533,
    nearby: [
      'Aluva Shiva Temple Manappuram',
      'Cochin International Airport (COK)',
      'Angamaly National Highway Hub'
    ]
  },

  // ─── PALAKKAD & COIMBATORE ───
  {
    name: 'Palakkad Junction & Fort Terminal',
    category: 'railway',
    region: 'Palakkad',
    lat: 10.7867,
    lng: 76.6548,
    nearby: [
      'Palakkad Tipu Sultan Fort',
      'Malampuzha Dam & Gardens',
      'Silent Valley National Park Entry Gate',
      'KSRTC Palakkad Stand',
      'Coimbatore Junction & Airport'
    ]
  },
  {
    name: 'Silent Valley Entry Gate (Mukkali)',
    category: 'nature',
    region: 'Palakkad',
    lat: 11.0624,
    lng: 76.4428,
    nearby: [
      'Sairandhri Watchtower Silent Valley',
      'Kunthi River Crossing',
      'Mannarkkad Town Hub',
      'Attappadi Hills'
    ]
  },
  {
    name: 'Malampuzha Dam & Rock Garden',
    category: 'nature',
    region: 'Palakkad',
    lat: 10.8305,
    lng: 76.6833,
    nearby: [
      'Palakkad Junction & Fort Terminal',
      'Kava Viewpoint Palakkad',
      'Yakshi Sculpture Park'
    ]
  },
  {
    name: 'Coimbatore Junction & Airport',
    category: 'railway',
    region: 'Coimbatore',
    lat: 11.0168,
    lng: 76.9558,
    nearby: [
      'Gandhipuram Central Bus Stand Coimbatore',
      'Isha Yoga Center Adiyogi',
      'Marudhamalai Murugan Temple',
      'Mettupalayam Nilgiri Mountain Railway',
      'Pollachi Gateway'
    ]
  },
  {
    name: 'Adiyogi Shiva & Isha Yoga Center',
    category: 'temple',
    region: 'Coimbatore',
    lat: 10.9760,
    lng: 76.7346,
    nearby: [
      'Velliangiri Hills Foot',
      'Coimbatore Junction & Airport',
      'Siruvani Waterfalls'
    ]
  },
  {
    name: 'Parambikulam Tiger Reserve Hub',
    category: 'nature',
    region: 'Palakkad / Pollachi',
    lat: 10.4354,
    lng: 76.7861,
    nearby: [
      'Thunakadavu Reservoir & Treehouse',
      'Kannimara Teak World Heritage Tree',
      'Anamalai Tiger Reserve Topslip',
      'Pollachi Junction'
    ]
  },

  // ─── MUNNAR & IDUKKI ───
  {
    name: 'Munnar Tea Gardens & Town Center',
    category: 'nature',
    region: 'Munnar',
    lat: 10.0889,
    lng: 77.0595,
    nearby: [
      'Eravikulam National Park (Nilgiri Tahr)',
      'Mattupetty Dam & Speedboating',
      'Top Station & Kundala Lake',
      'Tea Museum Munnar (KDHP)',
      'Attukad Waterfalls',
      'Anamudi Peak Base'
    ]
  },
  {
    name: 'Eravikulam National Park Gateway',
    category: 'nature',
    region: 'Munnar',
    lat: 10.1500,
    lng: 77.0700,
    nearby: [
      'Munnar Tea Gardens & Town Center',
      'Anamudi Viewpoint',
      'Rajamalai Safari Desk',
      'Lakkam Waterfalls'
    ]
  },
  {
    name: 'Mattupetty Dam & Eco Point',
    category: 'nature',
    region: 'Munnar',
    lat: 10.1065,
    lng: 77.1250,
    nearby: [
      'Kundala Arch Dam & Boating',
      'Top Station Cloud Valley',
      'Echo Point Munnar',
      'Munnar Tea Gardens & Town Center'
    ]
  },

  // ─── KODAIKANAL & DINDIGUL ───
  {
    name: 'Kodaikanal Lake & Star Promenade',
    category: 'nature',
    region: 'Kodaikanal',
    lat: 10.2381,
    lng: 77.4892,
    nearby: [
      'Coaker\u2019s Walk & Mountain Valley View',
      'Pillar Rocks & Guna Caves',
      'Bryant Park Botanical Garden',
      'Silver Cascade Waterfall',
      'Dolphin\u2019s Nose Viewpoint',
      'Kodaikanal Bus Stand & Town'
    ]
  },
  {
    name: 'Pillar Rocks & Guna Caves',
    category: 'nature',
    region: 'Kodaikanal',
    lat: 10.2185,
    lng: 77.4705,
    nearby: [
      'Kodaikanal Lake & Star Promenade',
      'Pine Forest Kodaikanal',
      'Moir Point & Berijam Lake Gate',
      'Green Valley View (Suicide Point)'
    ]
  },
  {
    name: 'Silver Cascade Waterfall',
    category: 'nature',
    region: 'Kodaikanal',
    lat: 10.2605,
    lng: 77.5250,
    nearby: [
      'Kodaikanal Ghat Road Toll Hub',
      'Kodaikanal Lake & Star Promenade',
      'Batlagundu Bus Hub',
      'Kodai Road Railway Station'
    ]
  },

  // ─── OOTY & NILGIRIS ───
  {
    name: 'Ooty (Udhagamandalam) Lake & Heritage Rail',
    category: 'nature',
    region: 'Ooty',
    lat: 11.4064,
    lng: 76.6932,
    nearby: [
      'Doddabetta Peak & Telescope House',
      'Government Botanical Garden Ooty',
      'Rose Garden Ooty',
      'Pykara Lake & Waterfalls',
      'Coonoor Sim\u2019s Park & Dolphin Nose',
      'Mettupalayam Heritage Railway'
    ]
  },
  {
    name: 'Doddabetta Peak (2637m)',
    category: 'nature',
    region: 'Ooty',
    lat: 11.4007,
    lng: 76.7364,
    nearby: [
      'Ooty (Udhagamandalam) Lake & Heritage Rail',
      'Tea Factory & Museum Ooty',
      'Kotagiri Kodanad Viewpoint'
    ]
  },
  {
    name: 'Pykara Lake, Dam & Waterfalls',
    category: 'nature',
    region: 'Ooty',
    lat: 11.4886,
    lng: 76.6022,
    nearby: [
      'Shooting Point (9th Mile) Ooty',
      'Mudumalai National Park Theppakadu',
      'Ooty Lake Promenade'
    ]
  },
  {
    name: 'Coonoor Sim\u2019s Park & High Tea Estate',
    category: 'nature',
    region: 'Ooty / Nilgiris',
    lat: 11.3530,
    lng: 76.7959,
    nearby: [
      'Dolphin\u2019s Nose Coonoor',
      'Lamb\u2019s Rock Viewpoint',
      'Coonoor Railway Station',
      'Ketti Valley View'
    ]
  },

  // ─── WAYANAD & CALICUT ───
  {
    name: 'Wayanad Chembra Peak & Ghat Gate',
    category: 'nature',
    region: 'Wayanad',
    lat: 11.6854,
    lng: 76.1320,
    nearby: [
      'Banasura Sagar Earth Dam',
      'Edakkal Caves Stone Age Site',
      'Lakkidi Viewpoint & Thamarassery Churam',
      'Pookode Freshwater Lake',
      'Kuruva Island River Rafting',
      'Calicut (CCJ) Airport'
    ]
  },
  {
    name: 'Calicut (Kozhikode) Airport (CCJ) & Station',
    category: 'airport',
    region: 'Calicut',
    lat: 11.1395,
    lng: 75.9555,
    nearby: [
      'Kozhikode Railway Station (CLT)',
      'Kozhikode Beach & South Beach Pier',
      'Mananchira Square Kozhikode',
      'Beypore Port & Dhow Yard'
    ]
  },

  // ─── MADURAI, TENKASI & KANYAKUMARI ───
  {
    name: 'Madurai Meenakshi Amman Temple',
    category: 'temple',
    region: 'Madurai',
    lat: 9.9195,
    lng: 78.1193,
    nearby: [
      'Madurai Junction Railway Station',
      'Thirumalai Nayakkar Mahal',
      'Alagar Kovil Temple',
      'Madurai Airport (IXM)',
      'Mattuthavani Central Bus Stand'
    ]
  },
  {
    name: 'Tenkasi Kasi Viswanathar Temple',
    category: 'temple',
    region: 'Tenkasi',
    lat: 8.9589,
    lng: 77.3152,
    nearby: [
      'Courtallam Main Waterfalls',
      'Tenkasi Junction Railway Station',
      'Shenkottai Western Ghats Gate',
      'Papanasam Agasthiyar Falls'
    ]
  },
  {
    name: 'Tiruchendur Subramanya Swamy Sea Temple',
    category: 'temple',
    region: 'Tiruchendur',
    lat: 8.4969,
    lng: 78.1247,
    nearby: [
      'Tiruchendur Beach & Sea View',
      'Tiruchendur Railway Station',
      'Tuticorin (Thoothukudi) Port & Airport',
      'Tirunelveli Junction'
    ]
  },
  {
    name: 'Kanyakumari Vivekananda Rock & Triveni Sangam',
    category: 'landmark',
    region: 'Kanyakumari',
    lat: 8.0883,
    lng: 77.5385,
    nearby: [
      'Thiruvalluvar Statue Rock',
      'Kanyakumari Sunrise & Sunset View',
      'Bhagavathy Amman Temple Kanyakumari',
      'Kanyakumari Railway Station (CAPE)',
      'Nagercoil Junction'
    ]
  },

  // ─── NORTH INDIA PILGRIMAGE & SACRED YATRA ───
  {
    name: 'Kashi Vishwanath Temple & Varanasi Ghats',
    category: 'temple',
    region: 'Varanasi',
    lat: 25.3109,
    lng: 83.0107,
    nearby: [
      'Dashashwamedh Ghat Ganga Aarti',
      'Assi Ghat & Subah-e-Banaras',
      'Manikarnika Sacred Ghat',
      'Varanasi Junction (BSB) Cantt Station',
      'Banaras (BSBS) Railway Station',
      'Lal Bahadur Shastri Airport (VNS)',
      'Sarnath Deer Park & Dhamek Stupa',
      'Kaal Bhairav Temple Kashi'
    ]
  },
  {
    name: 'Dashashwamedh Ghat Evening Aarti',
    category: 'landmark',
    region: 'Varanasi',
    lat: 25.3060,
    lng: 83.0100,
    nearby: [
      'Kashi Vishwanath Corridor Gateway',
      'Assi Ghat Sunrise',
      'Manikarnika Ghat Boating Desk',
      'Godowlia Chowk Varanasi'
    ]
  },
  {
    name: 'Ayodhya Shri Ram Janmabhoomi Mandir',
    category: 'temple',
    region: 'Ayodhya',
    lat: 26.7922,
    lng: 82.1998,
    nearby: [
      'Hanuman Garhi Temple Ayodhya',
      'Kanak Bhawan Ayodhya',
      'Sarayu River Ram Ki Paidi & Aarti',
      'Ayodhya Dham (AY) Railway Station',
      'Ayodhya Cantt (AYC) Station',
      'Maharishi Valmiki Airport Ayodhya (AYJ)',
      'Surya Kund Ayodhya'
    ]
  },
  {
    name: 'Prayagraj Triveni Sangam Sacred Confluence',
    category: 'temple',
    region: 'Prayagraj',
    lat: 25.4358,
    lng: 81.8463,
    nearby: [
      'Prayagraj Junction (PRYJ) Railway Station',
      'Bade Hanuman Ji Temple (Lete Hanuman)',
      'Akshayavat & Allahabad Fort',
      'Alopi Devi Temple Sangam',
      'Prayagraj Airport (IXD)',
      'Civil Lines Prayagraj'
    ]
  },
  {
    name: 'Puri Shri Jagannath Temple & Grand Road',
    category: 'temple',
    region: 'Puri / Odisha',
    lat: 19.8076,
    lng: 85.8251,
    nearby: [
      'Golden Beach Blue Flag Puri',
      'Puri Railway Station (PURI)',
      'Gundicha Temple Puri',
      'Konark Sun Temple Black Pagoda',
      'Chilika Lake Satapada Dolphin Point',
      'Bhubaneswar Lingaraj Temple'
    ]
  },
  {
    name: 'Konark Sun Temple (UNESCO World Heritage)',
    category: 'landmark',
    region: 'Konark / Odisha',
    lat: 19.8876,
    lng: 86.0945,
    nearby: [
      'Chandrabhaga Beach Konark',
      'Konark Marine Drive Promenade',
      'Puri Shri Jagannath Temple',
      'Bhubaneswar Airport (BBI)'
    ]
  },
  {
    name: 'Srinagar Dal Lake & Houseboat Boulevard',
    category: 'nature',
    region: 'Kashmir',
    lat: 34.0837,
    lng: 74.7973,
    nearby: [
      'Mughal Gardens (Shalimar & Nishat Bagh)',
      'Shankaracharya Hill Temple',
      'Gulmarg Gondola & Apharwat Peak',
      'Pahalgam Betaab Valley & Aru',
      'Sheikh ul-Alam Airport Srinagar (SXR)',
      'Lal Chowk Srinagar'
    ]
  },
  {
    name: 'Amritsar Sri Harmandir Sahib (Golden Temple)',
    category: 'temple',
    region: 'Amritsar / Punjab',
    lat: 31.6200,
    lng: 74.8765,
    nearby: [
      'Jallianwala Bagh Memorial',
      'Attari-Wagah Border Flag Ceremony',
      'Amritsar Junction (ASR) Railway Station',
      'Sri Guru Ram Dass Jee Airport (ATQ)',
      'Durgiana Temple Amritsar'
    ]
  }
];

// Fast in-memory index for search suggestions and nearby hub discovery
export function searchLocationsAndNearby(query = '', maxResults = 8) {
  const q = (query || '').trim().toLowerCase();
  if (!q) {
    return {
      matches: NEARBY_LOCATIONS_DATABASE.slice(0, maxResults),
      nearbySuggestions: []
    };
  }

  // 1. Direct matched items
  const matches = [];
  const nearbySet = new Set();

  for (const item of NEARBY_LOCATIONS_DATABASE) {
    const nameLower = item.name.toLowerCase();
    const regionLower = item.region.toLowerCase();
    const catLabel = (LOCATION_CATEGORIES[item.category]?.label || '').toLowerCase();

    if (nameLower.includes(q) || regionLower.includes(q) || catLabel.includes(q)) {
      matches.push(item);
      if (Array.isArray(item.nearby)) {
        item.nearby.forEach(nb => nearbySet.add(nb));
      }
    }
  }

  // 2. Remove items from nearbySet that are already in matches
  const matchNames = new Set(matches.map(m => m.name.toLowerCase()));
  const nearbySuggestions = Array.from(nearbySet)
    .filter(name => !matchNames.has(name.toLowerCase()))
    .slice(0, 8);

  return {
    matches: matches.slice(0, maxResults),
    nearbySuggestions
  };
}

// Curated Corridor Routes between major Kerala departure hubs and all destinations
export const PREDEFINED_CORRIDORS = {
  'kashi': [
    { name: 'Thrissur Swaraj Round Main Hub', type: 'start', reason: 'Primary Kerala departure hub & luxury coach terminal' },
    { name: 'Cochin International Airport (COK)', type: 'pickup', reason: 'Direct flight / express train connection hub' },
    { name: 'Varanasi Junction (BSB) Cantt Station', type: 'pickup', reason: 'Varanasi rail transit hub' },
    { name: 'Dashashwamedh Ghat Evening Aarti', type: 'pickup', reason: 'Sacred Ganga Aarti boarding point' },
    { name: 'Manikarnika Sacred Ghat', type: 'pickup', reason: 'Ancient Kashi riverfront site' },
    { name: 'Ayodhya Shri Ram Janmabhoomi Mandir', type: 'dropping', reason: 'Ram Mandir darshan waypoint' },
    { name: 'Prayagraj Triveni Sangam Sacred Confluence', type: 'dropping', reason: 'Triveni Sangam holy dip & return hub' },
    { name: 'Kashi Vishwanath Temple & Varanasi Ghats', type: 'destination', reason: 'Main pilgrimage destination' }
  ],
  'ayodhya': [
    { name: 'Thrissur Swaraj Round Main Hub', type: 'start', reason: 'Main Kerala departure hub' },
    { name: 'Cochin International Airport (COK)', type: 'pickup', reason: 'Direct flight departure to Ayodhya/Lucknow' },
    { name: 'Ayodhya Dham (AY) Railway Station', type: 'pickup', reason: 'Ayodhya rail arrival concourse' },
    { name: 'Hanuman Garhi Temple Ayodhya', type: 'pickup', reason: 'Sankat Mochan Hanuman blessing stop' },
    { name: 'Sarayu River Ram Ki Paidi & Aarti', type: 'dropping', reason: 'Sarayu riverfront evening aarti' },
    { name: 'Ayodhya Shri Ram Janmabhoomi Mandir', type: 'destination', reason: 'Grand Ram Mandir final destination' }
  ],
  'kodaikanal': [
    { name: 'Thrissur Swaraj Round Main Hub', type: 'start', reason: 'Central Kerala departure lounge' },
    { name: 'Palakkad Junction & Fort Terminal', type: 'pickup', reason: 'Palakkad Gap transit junction' },
    { name: 'Coimbatore Junction & Airport', type: 'pickup', reason: 'Highway passenger boarding hub' },
    { name: 'Silver Cascade Waterfall', type: 'pickup', reason: 'Ghat entrance viewpoint & photo stop' },
    { name: 'Pillar Rocks & Guna Caves', type: 'dropping', reason: 'Majestic cliff vista waypoint' },
    { name: 'Coaker\u2019s Walk & Mountain Valley View', type: 'dropping', reason: 'Panoramic mountain ridge walk' },
    { name: 'Kodaikanal Lake & Star Promenade', type: 'destination', reason: 'Heart of Kodaikanal final destination' }
  ],
  'munnar': [
    { name: 'Thrissur Swaraj Round Main Hub', type: 'start', reason: 'Main departure terminal' },
    { name: 'Chalakudy Railway Station & Bus Stand', type: 'pickup', reason: 'NH544 en-route pickup' },
    { name: 'Cochin International Airport (COK)', type: 'pickup', reason: 'Airport arrivals & highway link' },
    { name: 'Aluva Metro & Railway Station', type: 'pickup', reason: 'Kochi metro connection point' },
    { name: 'Eravikulam National Park Gateway', type: 'pickup', reason: 'Nilgiri Tahr safari point' },
    { name: 'Mattupetty Dam & Eco Point', type: 'dropping', reason: 'Speedboating & elephant lake' },
    { name: 'Munnar Tea Gardens & Town Center', type: 'destination', reason: 'Scenic tea valley resort destination' }
  ],
  'ooty': [
    { name: 'Thrissur Swaraj Round Main Hub', type: 'start', reason: 'Primary boarding hub' },
    { name: 'Palakkad Junction & Fort Terminal', type: 'pickup', reason: 'Palakkad district transit stop' },
    { name: 'Coimbatore Junction & Airport', type: 'pickup', reason: 'Nilgiri gateway transit junction' },
    { name: 'Coonoor Sim\u2019s Park & High Tea Estate', type: 'pickup', reason: 'Heritage tea garden & mountain rail' },
    { name: 'Doddabetta Peak (2637m)', type: 'dropping', reason: 'Highest Nilgiris peak viewpoint' },
    { name: 'Pykara Lake, Dam & Waterfalls', type: 'dropping', reason: 'Scenic boating & pine forests' },
    { name: 'Ooty (Udhagamandalam) Lake & Heritage Rail', type: 'destination', reason: 'Queen of Hill Stations destination' }
  ],
  'parambikulam': [
    { name: 'Thrissur Swaraj Round Main Hub', type: 'start', reason: 'Primary departure lounge' },
    { name: 'Palakkad Junction & Fort Terminal', type: 'pickup', reason: 'Palakkad transit station' },
    { name: 'Athirappilly Waterfalls Gateway', type: 'pickup', reason: 'Rainforest waterfall waypoint' },
    { name: 'Parambikulam Tiger Reserve Hub', type: 'destination', reason: 'Kannimara teak & tiger forest destination' }
  ],
  'silent valley': [
    { name: 'Thrissur Swaraj Round Main Hub', type: 'start', reason: 'Main office departure' },
    { name: 'Palakkad Junction & Fort Terminal', type: 'pickup', reason: 'Palakkad rail transit' },
    { name: 'Malampuzha Dam & Rock Garden', type: 'pickup', reason: 'Dam & garden waypoint' },
    { name: 'Silent Valley Entry Gate (Mukkali)', type: 'destination', reason: 'Virgin rainforest safari destination' }
  ],
  'puri': [
    { name: 'Thrissur Swaraj Round Main Hub', type: 'start', reason: 'Kerala departure hub' },
    { name: 'Cochin International Airport (COK)', type: 'pickup', reason: 'Flight transfer to Bhubaneswar' },
    { name: 'Konark Sun Temple (UNESCO World Heritage)', type: 'pickup', reason: 'Black Pagoda heritage waypoint' },
    { name: 'Puri Shri Jagannath Temple & Grand Road', type: 'destination', reason: 'Sacred Dham destination' }
  ],
  'kashmir': [
    { name: 'Thrissur Swaraj Round Main Hub', type: 'start', reason: 'Departure hub' },
    { name: 'Cochin International Airport (COK)', type: 'pickup', reason: 'Connecting flight to Srinagar' },
    { name: 'Amritsar Sri Harmandir Sahib (Golden Temple)', type: 'pickup', reason: 'Golden Temple blessing stop' },
    { name: 'Srinagar Dal Lake & Houseboat Boulevard', type: 'destination', reason: 'Paradise on Earth final destination' }
  ],
  'madurai': [
    { name: 'Thrissur Swaraj Round Main Hub', type: 'start', reason: 'Departure hub' },
    { name: 'Palakkad Junction & Fort Terminal', type: 'pickup', reason: 'Palakkad transit' },
    { name: 'Tenkasi Kasi Viswanathar Temple', type: 'pickup', reason: 'Southern Kashi temple waypoint' },
    { name: 'Tiruchendur Subramanya Swamy Sea Temple', type: 'dropping', reason: 'Seashore Murugan temple' },
    { name: 'Kanyakumari Vivekananda Rock & Triveni Sangam', type: 'dropping', reason: 'Triveni ocean confluence' },
    { name: 'Madurai Meenakshi Amman Temple', type: 'destination', reason: 'Historic temple city destination' }
  ]
};

// Intelligently resolve all points along a route corridor based on Start Point and End Point
export function getRouteCorridorPoints(startName = 'Thrissur Swaraj Round Main Hub', endName = 'Kodaikanal Lake & Star Promenade') {
  const startClean = (startName || '').trim();
  const endClean = (endName || '').trim();

  const startCoords = resolveLocationCoords(startClean);
  const endCoords = resolveLocationCoords(endClean);

  const startKey = startClean.toLowerCase();
  const endKey = endClean.toLowerCase();

  // Check if a predefined corridor matches the destination
  let matchedCorridorKey = Object.keys(PREDEFINED_CORRIDORS).find(k => endKey.includes(k) || startKey.includes(k));

  let candidatePoints = [];

  if (matchedCorridorKey && PREDEFINED_CORRIDORS[matchedCorridorKey]) {
    candidatePoints = PREDEFINED_CORRIDORS[matchedCorridorKey].map(p => {
      const c = resolveLocationCoords(p.name);
      return {
        name: p.name,
        type: p.type,
        category: c.category || 'landmark',
        region: c.region || 'En-route',
        lat: c.lat,
        lng: c.lng,
        reason: p.reason || 'Corridor transit waypoint'
      };
    });
  } else {
    // Dynamically discover candidate points in the geographic bounding corridor between start and end
    const minLat = Math.min(startCoords.lat, endCoords.lat) - 0.5;
    const maxLat = Math.max(startCoords.lat, endCoords.lat) + 0.5;
    const minLng = Math.min(startCoords.lng, endCoords.lng) - 0.5;
    const maxLng = Math.max(startCoords.lng, endCoords.lng) + 0.5;

    const enRouteMatches = NEARBY_LOCATIONS_DATABASE.filter(item => {
      const inBox = item.lat >= minLat && item.lat <= maxLat && item.lng >= minLng && item.lng <= maxLng;
      const isStartOrEnd = item.name.toLowerCase() === startClean.toLowerCase() || item.name.toLowerCase() === endClean.toLowerCase();
      return inBox || isStartOrEnd;
    });

    candidatePoints = [
      { name: startClean, type: 'start', lat: startCoords.lat, lng: startCoords.lng, category: startCoords.category, region: startCoords.region, reason: 'Departure Hub' },
      ...enRouteMatches
        .filter(m => m.name.toLowerCase() !== startClean.toLowerCase() && m.name.toLowerCase() !== endClean.toLowerCase())
        .map((m, idx) => ({
          name: m.name,
          type: idx < 2 ? 'pickup' : 'dropping',
          lat: m.lat,
          lng: m.lng,
          category: m.category,
          region: m.region,
          reason: 'En-route waypoint'
        })),
      { name: endClean, type: 'destination', lat: endCoords.lat, lng: endCoords.lng, category: endCoords.category, region: endCoords.region, reason: 'Final Destination' }
    ];
  }

  return {
    start: { name: startClean, lat: startCoords.lat, lng: startCoords.lng },
    destination: { name: endClean, lat: endCoords.lat, lng: endCoords.lng },
    corridorStops: candidatePoints,
    recommendedCompleteRoute: candidatePoints.map(p => ({ name: p.name, type: p.type }))
  };
}

// Locate coordinates from known locations or fallback to hash-coords
export function resolveLocationCoords(locationName = '') {
  const lower = (locationName || '').trim().toLowerCase();
  if (!lower) return { lat: 10.5276, lng: 76.2144 };

  const exact = NEARBY_LOCATIONS_DATABASE.find(loc =>
    loc.name.toLowerCase() === lower ||
    loc.name.toLowerCase().includes(lower) ||
    lower.includes(loc.name.toLowerCase()) ||
    lower.includes(loc.region.toLowerCase())
  );

  if (exact) {
    return {
      lat: exact.lat,
      lng: exact.lng,
      category: exact.category,
      region: exact.region,
      nearby: exact.nearby || []
    };
  }

  // Deterministic coordinate generator for arbitrary locations
  let h = 0;
  for (let i = 0; i < lower.length; i++) {
    h = (h * 31 + lower.charCodeAt(i)) % 100000;
  }
  const lat = 10.5276 + ((h % 600) / 10000);
  const lng = 76.2144 + ((Math.floor(h / 600) % 600) / 10000);
  return {
    lat: +lat.toFixed(4),
    lng: +lng.toFixed(4),
    category: 'landmark',
    region: 'Custom Location',
    nearby: []
  };
}
