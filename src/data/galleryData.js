// Pinterest-style Authentic Travel Photography Gallery Dataset
// Sourced from real travel web photographs and Wikimedia Commons

export const GALLERY_ITEMS = [
  {
    id: 'gal-1',
    title: 'Kashi Vishwanath Temple Corridor & Golden Spire',
    destination: 'Kashi Vishwanath, Varanasi',
    category: 'Spiritual',
    url: './kashi-vishwanath-real.jpg',
    aspect: 'tall',
    camera: 'Sony α7R IV • 24mm f/2.8',
    location: 'Varanasi, Uttar Pradesh',
    coordinates: '25.3109° N, 83.0107° E',
    likes: 420
  },
  {
    id: 'gal-2',
    title: 'Sacred Twilight Ganga Aarti Ceremony',
    destination: 'Dashashwamedh Ghat',
    category: 'Spiritual',
    url: './kashi-vishwanath-real.jpg',
    aspect: 'regular',
    camera: 'Canon EOS R5 • 50mm f/1.4',
    location: 'Dashashwamedh Ghat, Varanasi',
    coordinates: '25.3075° N, 83.0104° E',
    likes: 580
  },
  {
    id: 'gal-3',
    title: 'Emerald Carpeted Tea Hills of Munnar & Anamudi Sunrise',
    destination: 'Munnar Tea Plantations',
    category: 'Nature',
    url: './munnar-tea-plantations-real.jpg',
    aspect: 'wide',
    camera: 'Nikon Z7 II • 35mm f/1.8',
    location: 'Munnar, Idukki, Kerala',
    coordinates: '10.0889° N, 77.0595° E',
    likes: 640
  },
  {
    id: 'gal-4',
    title: 'UNESCO Heritage Nilgiri Steam Mountain Toy Train',
    destination: 'Nilgiri Mountain Railway',
    category: 'Heritage',
    url: './ooty-toy-train-real.jpg',
    aspect: 'tall',
    camera: 'Fujifilm X-T4 • 18-55mm',
    location: 'Coonoor to Ooty, Tamil Nadu',
    coordinates: '11.3530° N, 76.7959° E',
    likes: 512
  },
  {
    id: 'gal-5',
    title: 'Golden Sunflower Fields at Gundlupet',
    destination: 'Gundlupet Sunflower Valley',
    category: 'Nature',
    url: './gundlupet-sunflowers-real.jpg',
    aspect: 'regular',
    camera: 'Sony α7 III • 85mm f/1.8',
    location: 'Gundlupet, Karnataka',
    coordinates: '11.8083° N, 76.6917° E',
    likes: 389
  },
  {
    id: 'gal-6',
    title: 'Mystic Spire & Sacred Complex of Shree Jagannath Shrine',
    destination: 'Jagannath Temple, Puri',
    category: 'Architecture',
    url: './puri-jagannath-real.jpg',
    aspect: 'tall',
    camera: 'Canon 5D Mark IV • 70-200mm',
    location: 'Puri, Odisha',
    coordinates: '19.8049° N, 85.8179° E',
    likes: 475
  },
  {
    id: 'gal-6b',
    title: 'Singhadwara Sacred Entrance of Shree Jagannath Temple',
    destination: 'Jagannath Temple, Puri',
    category: 'Spiritual',
    url: './puri-jagannath-entrance-real.jpg',
    aspect: 'wide',
    camera: 'Wide Angle • 18mm f/4.0',
    location: 'Puri, Odisha',
    coordinates: '19.8049° N, 85.8179° E',
    likes: 620
  },
  {
    id: 'gal-7',
    title: 'Intricate Dravidian Architecture Gopuram',
    destination: 'Thenkasi Kasi Viswanathar',
    category: 'Architecture',
    url: './thenkasi-viswanathar-real.jpg',
    aspect: 'regular',
    camera: 'Sony α7R III • 16-35mm',
    location: 'Tenkasi, Tamil Nadu',
    coordinates: '8.9592° N, 77.3160° E',
    likes: 360
  },
  {
    id: 'gal-8',
    title: '13th Century Carved Sun Chariot Wheel',
    destination: 'Konark Sun Temple',
    category: 'Heritage',
    url: './konark-sun-temple-real.jpg',
    aspect: 'wide',
    camera: 'Nikon D850 • 24-70mm',
    location: 'Konark, Odisha',
    coordinates: '19.8876° N, 86.0945° E',
    likes: 520
  },
  {
    id: 'gal-9',
    title: 'Seashore Sanctum of Tiruchendur Murugan',
    destination: 'Tiruchendur Murugan Temple',
    category: 'Spiritual',
    url: './tiruchendur-murugan-real.jpg',
    aspect: 'tall',
    camera: 'Sony α7R IV • 35mm f/1.4',
    location: 'Tiruchendur, Tamil Nadu',
    coordinates: '8.4962° N, 78.1287° E',
    likes: 490
  },
  {
    id: 'gal-10',
    title: 'Lush Forest Canopy & Parambikulam Lake',
    destination: 'Parambikulam Tiger Reserve',
    category: 'Nature',
    url: './parambikulam-lake-real.jpg',
    aspect: 'regular',
    camera: 'Canon EOS R6 • 100-400mm',
    location: 'Palakkad, Kerala',
    coordinates: '10.3927° N, 76.7758° E',
    likes: 310
  },
  {
    id: 'gal-11',
    title: 'Magnificent Sandstone Abode of Shri Ram',
    destination: 'Shri Ram Janmabhoomi, Ayodhya',
    category: 'Spiritual',
    url: './ayodhya-ram-mandir-real.jpg',
    aspect: 'wide',
    camera: 'Drone Aerial • 24mm f/2.8',
    location: 'Ayodhya, Uttar Pradesh',
    coordinates: '26.7956° N, 82.1943° E',
    likes: 810
  },
  {
    id: 'gal-12',
    title: 'Misty Blue Ridge of Nilgiri Ooty Hills',
    destination: 'Ooty Tea Gardens',
    category: 'Nature',
    url: './ooty-tea-gardens-real.jpg',
    aspect: 'tall',
    camera: 'Fujifilm GFX 100S • 45mm',
    location: 'Nilgiris, Tamil Nadu',
    coordinates: '11.4102° N, 76.6950° E',
    likes: 670
  },
  {
    id: 'gal-13',
    title: 'Monsoon Bloom Timelapse — Kerala Highlands',
    destination: 'Parambikulam Highlands',
    category: 'Nature',
    type: 'video',
    url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: './parambikulam-lake-real.jpg',
    duration: '0:30 min',
    location: 'Palakkad, Kerala',
    coordinates: '10.3927° N, 76.7758° E',
    likes: 845
  }
];
