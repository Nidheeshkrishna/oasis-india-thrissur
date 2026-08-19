// Curated "Top Places to See" per destination, shown in the admin image picker.
// Clicking a place triggers a live Google image search for original photos.
export const TOP_PLACES = {
  munnar: {
    label: 'Munnar',
    keyword: 'munnar',
    places: [
      { name: 'Munnar Tea Gardens', tag: 'Rolling tea plantations & mountain views' },
      { name: 'Eravikulam National Park', tag: 'Nilgiri tahr & mountain landscapes' },
      { name: 'Mattupetty Dam', tag: 'Reservoir, boating & hills' },
      { name: 'Echo Point', tag: 'Natural echo experience' },
      { name: 'Top Station', tag: 'Best panoramic Western Ghats viewpoint' },
      { name: 'Kundala Lake', tag: 'Boating lake amid green hills' },
      { name: 'Tea Museum', tag: 'Tea growing & processing history' },
      { name: 'Pothamedu View Point', tag: 'Tea, coffee & cardamom plantation views' },
      { name: 'Attukad Waterfalls', tag: 'Scenic waterfall in lush mountains' },
      { name: 'Lakkam Waterfalls', tag: 'Popular waterfall on the Marayoor route' },
      { name: 'Blossom Park', tag: 'Family-friendly recreation area' },
      { name: 'Chinnakanal Waterfalls', tag: 'Waterfall on the Munnar–Kodaikanal route' },
      { name: 'Lockhart Gap', tag: 'Dramatic misty mountain viewpoint' },
      { name: 'Anamudi Peak', tag: 'Highest peak in South India' },
      { name: 'Photo Point', tag: 'Popular photography spot' }
    ],
    nearby: [
      { name: 'Marayoor', tag: 'Sandalwood forests & dolmens' },
      { name: 'Kanthalloor', tag: 'Fruit village & valleys' },
      { name: 'Vattavada', tag: 'High-altitude farming village' },
      { name: 'Kovilkadavu', tag: 'Scenic village view' },
      { name: 'Anakulam', tag: 'Valley viewpoint' },
      { name: 'Chinnar Wildlife Sanctuary', tag: 'Wildlife & dry forest landscape' },
      { name: 'Muniyara Dolmens', tag: 'Ancient megalithic burial sites' }
    ]
  },
  ooty: {
    label: 'Ooty',
    keyword: 'ooty',
    places: [
      { name: 'Ooty Botanical Gardens', tag: 'Rare flora & glasshouse' },
      { name: 'Ooty Lake Boating', tag: 'Boating & paddle rides' },
      { name: 'Doddabetta Peak', tag: 'Highest point in the Nilgiris' },
      { name: 'Ooty Heritage Toy Train', tag: 'UNESCO mountain railway' },
      { name: 'Pykara Lake & Falls', tag: 'Boating & pine forests' },
      { name: 'Nilgiri Tea Estates', tag: 'Rolling tea gardens' },
      { name: 'Rose Garden', tag: 'Thousands of rose varieties' },
      { name: 'Emerald Lake', tag: 'Scenic pine-shore lake' }
    ]
  },
  kashi: {
    label: 'Varanasi (Kashi)',
    keyword: 'kashi',
    places: [
      { name: 'Kashi Vishwanath Temple', tag: 'One of the 12 Jyotirlingas' },
      { name: 'Dashashwamedh Ghat', tag: 'Grand Ganga Aarti' },
      { name: 'Assi Ghat', tag: 'Evening Ganga Aarti' },
      { name: 'Ganga Aarti', tag: 'Evening fire ritual on the ghats' },
      { name: 'Sarnath', tag: 'Where Buddha gave his first sermon' },
      { name: 'Manikarnika Ghat', tag: 'Sacred cremation ghat' },
      { name: 'Alamgir Mosque', tag: 'Mughal-era riverside mosque' },
      { name: 'Boat Ride on River Ganges', tag: 'Sunrise ghat cruise' }
    ]
  },
  ayodhya: {
    label: 'Ayodhya',
    keyword: 'ayodhya',
    places: [
      { name: 'Shri Ram Janmabhoomi Temple', tag: 'Birthplace of Lord Rama' },
      { name: 'Hanuman Garhi', tag: 'Historic Hanuman temple' },
      { name: 'Saryu Ghat Aarti', tag: 'Evening aarti at Saryu river' },
      { name: 'Ramkot', tag: 'Old fortress & temple complex' },
      { name: 'Nageshwarnath Temple', tag: 'Shiva temple of ancient Ayodhya' }
    ]
  },
  kashmir: {
    label: 'Kashmir',
    keyword: 'kashmir',
    places: [
      { name: 'Dal Lake Shikara Ride', tag: 'Iconic houseboat lake' },
      { name: 'Mughal Gardens', tag: 'Shalimar & Nishat gardens' },
      { name: 'Gulmarg Gondola', tag: 'Asia\u2019s highest cable car' },
      { name: 'Pahalgam Valley', tag: 'Lidder river & meadows' },
      { name: 'Sonamarg', tag: 'Meadow of gold' },
      { name: 'Shankaracharya Temple', tag: 'Hilltop temple over Srinagar' },
      { name: 'Srinagar Old City & Jhelum', tag: 'Heritage boat ride' }
    ]
  },
  puri: {
    label: 'Puri (Odisha)',
    keyword: 'puri',
    places: [
      { name: 'Jagannath Temple', tag: 'One of the Char Dham temples' },
      { name: 'Puri Beach', tag: 'Golden sand coastline' },
      { name: 'Konark Sun Temple', tag: 'UNESCO chariot-shaped temple' },
      { name: 'Lingaraj Temple', tag: 'Ancient Bhubaneswar temple' },
      { name: 'Chilika Lake', tag: 'Largest brackish water lagoon' }
    ]
  },
  thanjavur: {
    label: 'Thanjavur & Chidambaram',
    keyword: 'thanjavur',
    places: [
      { name: 'Brihadeeswara Temple', tag: 'UNESCO Great Living Chola Big Temple' },
      { name: 'Chidambaram Nataraja Temple', tag: 'Akasa Lingam & Golden Hall' },
      { name: 'Srirangam Ranganathaswamy Temple', tag: '156-acre 108 Divya Desam' },
      { name: 'Adi Kumbeswarar Temple', tag: 'Sacred Mahamaham temple' },
      { name: 'Sarangapani Temple', tag: 'Vaishnavite chariot temple' },
      { name: 'Vaitheeswaran Koil', tag: 'Healing Shiva & Mars temple' }
    ]
  }
};

export const findTopPlaces = (prompt) => {
  const p = (prompt || '').toLowerCase().trim();
  if (!p) return null;
  const entry = Object.values(TOP_PLACES).find(e =>
    p.includes(e.keyword) || e.label.toLowerCase().includes(p)
  );
  return entry || null;
};
