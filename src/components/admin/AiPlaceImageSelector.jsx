import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Check, Image as ImageIcon, Layers, Eye, Star, MapPin, Upload,
  RefreshCw, Wand2, ShieldCheck, Search, Filter, ArrowRight, Zap, CheckCircle2
} from 'lucide-react';
import { generateAiDestinationGuide } from '../../services/aiDestinationGenerator';
import { geminiService } from '../../services/gemini';
import MixedBackground from '../MixedBackground';

// High-definition AI photography bank for popular tourist places
const LOCATION_PLACE_IMAGES = {
  'ooty': [
    { id: 'ooty-1', placeName: 'Nilgiri Mountain Toy Train (UNESCO World Heritage)', category: 'Heritage & Rail', url: './ooty-toy-train-real.jpg', isDefaultCover: true },
    { id: 'ooty-2', placeName: 'Government Botanical Garden & Glasshouse', category: 'Gardens & Tea', url: './ooty-botanical-garden-real.jpg' },
    { id: 'ooty-3', placeName: 'Ooty Lake & Star Boating Jetty', category: 'Lakes & Water', url: './ooty-lake-boating-real.jpg' },
    { id: 'ooty-4', placeName: 'Nilgiri Tea Plantations & Doddabetta Slopes', category: 'Gardens & Tea', url: './ooty-tea-gardens-real.jpg' },
    { id: 'ooty-5', placeName: 'Doddabetta Peak (8,652 ft) & Telescope House', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80' },
    { id: 'ooty-6', placeName: 'Pykara Lake & Cascading Roaring Waterfalls', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80' },
    { id: 'ooty-7', placeName: 'Avalanche Lake & Trout Pine Sanctuary', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
    { id: 'ooty-8', placeName: 'Government Rose Garden (20,000+ Rose Varieties)', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80' },
    { id: 'ooty-9', placeName: 'Wenlock Downs 9th Mile Shooting Meadow', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' },
    { id: 'ooty-10', placeName: 'Emerald Lake & Silent Valley Tea Ridge', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80' },
    { id: 'ooty-11', placeName: 'Highfield Tea Factory & Chocolate Museum', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80' },
    { id: 'ooty-12', placeName: 'Mudumalai Tiger Reserve & Elephant Camp', category: 'Wildlife & Safari', url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80' }
  ],
  'kodaikanal': [
    { id: 'kodai-1', placeName: 'Kodaikanal Star Lake & Pedal Boating', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80', isDefaultCover: true },
    { id: 'kodai-2', placeName: 'Bryant Botanical Park & Floral Lawns', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kodai-3', placeName: 'Coaker\'s Walk Promenade & Valley View', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kodai-4', placeName: 'Pillar Rocks Vertical Granite Cliffs', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kodai-5', placeName: 'Guna Caves (Devil\'s Kitchen Roots)', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kodai-6', placeName: 'Dense Pine Tree Forest Canopy', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kodai-7', placeName: 'Green Valley View (Suicide Point)', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kodai-8', placeName: 'Silver Cascade 180-ft Falls', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kodai-9', placeName: 'Dolphin\'s Nose Cliff & Echo Rock', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kodai-10', placeName: 'Mannavanur Eco Lake & Sheep Farm', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kodai-11', placeName: 'Poombarai Terraced Village & Temple', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80' }
  ],
  'munnar': [
    { id: 'mun-1', placeName: 'Munnar Emerald Tea Plantations', category: 'Gardens & Tea', url: './munnar-tea-plantations-real.jpg', isDefaultCover: true },
    { id: 'mun-2', placeName: 'Eravikulam National Park (Rajamalai Tahr)', category: 'Wildlife & Safari', url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80' },
    { id: 'mun-3', placeName: 'Mattupetty Dam & Speedboat Lake', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
    { id: 'mun-4', placeName: 'Kolukkumalai Sunrise (7,900 ft Cloud-bed)', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=80' },
    { id: 'mun-5', placeName: 'Anamudi Peak Summit Lookout', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' },
    { id: 'mun-6', placeName: 'Kundala Arch Dam & Pedal Boating', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80' },
    { id: 'mun-7', placeName: 'Attukad Waterfalls & Forest Cascades', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80' },
    { id: 'mun-8', placeName: 'Pothamedu Viewpoint & Cardamom Hills', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80' }
  ],
  'silent valley': [
    { id: 'sv-1', placeName: 'Misty Evergreen Rainforest Canopy', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80', isDefaultCover: true },
    { id: 'sv-2', placeName: 'Kunthi River Crystal Stream & Bridge', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80' },
    { id: 'sv-3', placeName: 'Lion-Tailed Macaque Wildlife Sanctuary', category: 'Wildlife & Safari', url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80' },
    { id: 'sv-4', placeName: 'Sairandhri Watchtower Lookout', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' }
  ],
  'athirappilly': [
    { id: 'ath-1', placeName: 'Athirappilly Roaring Waterfall Drop', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80', isDefaultCover: true },
    { id: 'ath-2', placeName: 'Rainbow Mist Spray & Jungle Rocks', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80' },
    { id: 'ath-3', placeName: 'Chalakudy Riverfront Rainforest', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80' },
    { id: 'ath-4', placeName: 'Twilight Evening Sunset Viewpoint', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80' }
  ],
  'wayanad': [
    { id: 'way-1', placeName: 'Chembra Peak Heart-Shaped Lake', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80', isDefaultCover: true },
    { id: 'way-2', placeName: 'Banasura Sagar Dam Speedboat Lake', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
    { id: 'way-3', placeName: 'Edakkal Prehistoric Caves Petroglyphs', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80' },
    { id: 'way-4', placeName: 'Kuruva Island Bamboo Rafting', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80' },
    { id: 'way-5', placeName: 'Lakkidi Ghat Viewpoint & Clouds', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' },
    { id: 'way-6', placeName: 'Muthanga Wildlife Tiger Safari', category: 'Wildlife & Safari', url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80' }
  ],
  'kashi': [
    { id: 'kas-1', placeName: 'Kashi Vishwanath Jyotirlinga & Corridor', category: 'Heritage & Culture', url: './kashi-vishwanath-real.jpg', isDefaultCover: true },
    { id: 'kas-2', placeName: 'Ayodhya Shri Ram Janmabhoomi Mandir', category: 'Heritage & Culture', url: './ayodhya-ram-mandir-real.jpg' },
    { id: 'kas-3', placeName: 'Dashashwamedh Ghat Evening Ganga Aarti', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kas-4', placeName: 'Sarnath Deer Park & Dhamek Stupa', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kas-5', placeName: 'Manikarnika Sacred Ghat Sunrise', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kas-6', placeName: 'Prayagraj Triveni Sangam Holy Confluence', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80' }
  ],
  'ayodhya': [
    { id: 'ayo-1', placeName: 'Shri Ram Janmabhoomi Mandir Complex', category: 'Heritage & Culture', url: './ayodhya-ram-mandir-real.jpg', isDefaultCover: true },
    { id: 'ayo-2', placeName: 'Saryu River Ghats & Evening Aarti', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80' },
    { id: 'ayo-3', placeName: 'Hanuman Garhi Fort Temple', category: 'Heritage & Culture', url: './kashi-vishwanath-real.jpg' },
    { id: 'ayo-4', placeName: 'Kanak Bhawan Royal Palace Temple', category: 'Heritage & Culture', url: './ayodhya-ram-mandir-real.jpg' }
  ],
  'kashmir': [
    { id: 'kas-10', placeName: 'Dal Lake Royal Shikara & Himalayas', category: 'Lakes & Water', url: './dal-lake-shikara-real.jpg', isDefaultCover: true },
    { id: 'kas-11', placeName: 'Dal Lake Houseboat & Mountain Reflection', category: 'Lakes & Water', url: './dal-lake-shikara-real.jpg' },
    { id: 'kas-12', placeName: 'Gulmarg Gondola & Mount Apharwat Snow', category: 'Peaks & Views', url: './gulmarg-real.jpg' },
    { id: 'kas-13', placeName: 'Pahalgam Betaab Valley & Lidder River', category: 'Peaks & Views', url: './pahalgam-real.jpg' },
    { id: 'kas-14', placeName: 'Sonamarg Thajiwas Glacier Snow Walk', category: 'Peaks & Views', url: './sonamarg-real.jpg' },
    { id: 'kas-15', placeName: 'Srinagar Mughal Gardens (Shalimar & Nishat)', category: 'Gardens & Tea', url: './srinagar-real.jpg' },
    { id: 'kas-16', placeName: 'Amritsar Golden Temple (Harmandir Sahib)', category: 'Heritage & Culture', url: './golden-temple-real.jpg' },
    { id: 'kas-17', placeName: 'Wagah Border Beating Retreat Ceremony', category: 'Heritage & Culture', url: './wagah-border-real.jpg' }
  ],
  'kochi': [
    { id: 'kc-1', placeName: 'Fort Kochi Chinese Fishing Nets (Cheena Vala)', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', isDefaultCover: true },
    { id: 'kc-2', placeName: 'Mattancherry Dutch Palace & Ramayana Murals', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kc-3', placeName: 'Paradesi Jewish Synagogue & Jew Town Antiques', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kc-4', placeName: 'Marine Drive Waterfront & Rainbow Bridge Harbor', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kc-5', placeName: 'St. Francis CSI Church (Vasco da Gama 1503)', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kc-6', placeName: 'Santa Cruz Cathedral Basilica Fort Kochi', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1548625361-16eb16262438?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kc-7', placeName: 'Hill Palace Museum Tripunithura (Royal Seat)', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kc-8', placeName: 'Cherai Beach & Vypin Island Sunset Coast', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kc-9', placeName: 'Bolgatty Palace & Heritage Island Resort', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kc-10', placeName: 'Cochin International Airport (COK) Solar Hub', category: 'Transit Hub', url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kc-11', placeName: 'Mangalavanam Bird Sanctuary & Mangrove Trail', category: 'Wildlife & Safari', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80' },
    { id: 'kc-12', placeName: 'Kerala Kathakali Centre Classical Heritage', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1200&q=80' }
  ],
  'cochin': [
    { id: 'coch-1', placeName: 'Fort Kochi Chinese Fishing Nets (Cheena Vala)', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', isDefaultCover: true },
    { id: 'coch-2', placeName: 'Marine Drive Waterfront & Rainbow Bridge Harbor', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80' },
    { id: 'coch-3', placeName: 'Mattancherry Dutch Palace & Murals', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80' },
    { id: 'coch-4', placeName: 'Jew Town & Paradesi Synagogue', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { id: 'coch-5', placeName: 'Cherai Beach & Vypin Island Golden Shore', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
    { id: 'coch-6', placeName: 'Hill Palace Museum Tripunithura', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80' }
  ],
  'kollam': [
    { id: 'kol-1', placeName: 'Ashtamudi Lake & Backwater Houseboat Cruise', category: 'Lakes & Water', url: 'wiki:Ashtamudi Lake', isDefaultCover: true },
    { id: 'kol-2', placeName: 'Jatayu Earth\'s Center (Chadayamangalam Rock)', category: 'Adventure & Culture', url: 'wiki:Jatayu Earth\'s Center' },
    { id: 'kol-3', placeName: 'Thangassery Light House & British Fort', category: 'Heritage & Culture', url: 'wiki:Thangassery Light House' },
    { id: 'kol-4', placeName: 'Kollam Beach & Mahatma Gandhi Park', category: 'Lakes & Water', url: 'wiki:Kollam Beach' },
    { id: 'kol-5', placeName: 'Munroe Island (Munroethuruth) Hidden Lagoon', category: 'Lakes & Water', url: 'wiki:Munroe Island' },
    { id: 'kol-6', placeName: 'Sasthamkotta Freshwater Lake', category: 'Lakes & Water', url: 'wiki:Sasthamkotta Lake' },
    { id: 'kol-7', placeName: 'Thenmala Dam & Ecotourism Boardwalk', category: 'Nature & Ecotourism', url: 'wiki:Thenmala Dam' },
    { id: 'kol-8', placeName: 'Thevally Palace & Houseboat Jetty', category: 'Heritage & Culture', url: 'wiki:Thevally Palace' },
    { id: 'kol-9', placeName: 'Paravur Lake & Puthenkavu Backwater Village', category: 'Lakes & Water', url: 'wiki:Paravur Lake' },
    { id: 'kol-10', placeName: 'Tangasseri Fort Ruins & Ancient Trade Coast', category: 'Heritage & Culture', url: 'wiki:Tangasseri Fort' },
    { id: 'kol-11', placeName: 'Amritapuri International Ashram', category: 'Spiritual & Wellness', url: 'wiki:Amritapuri' },
    { id: 'kol-12', placeName: 'Asramam Adventure Park & Maidan', category: 'Nature & Ecotourism', url: 'wiki:Asramam Maidan' }
  ],
  'parambikulam': [
    { id: 'pb-1', placeName: 'Parambikulam Tiger Reserve Rainforest', category: 'Wildlife & Safari', url: './parambikulam-forest-real.jpg', isDefaultCover: true },
    { id: 'pb-2', placeName: 'Parambikulam Reservoir Bamboo Rafting', category: 'Lakes & Water', url: './parambikulam-lake-real.jpg' },
    { id: 'pb-3', placeName: 'Royal Bengal Tiger & Leopard Safari', category: 'Wildlife & Safari', url: './parambikulam-tiger-real.jpg' },
    { id: 'pb-4', placeName: 'Kannimara 450-yr-old Giant Teak Tree', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80' }
  ],
  'puri': [
    { id: 'puri-1', placeName: 'Shree Jagannath Temple Main Entrance', category: 'Heritage & Culture', url: './puri-jagannath-entrance-real.jpg', isDefaultCover: true },
    { id: 'puri-2', placeName: 'Shree Jagannath 214-ft Sacred Deula Spire', category: 'Heritage & Culture', url: './puri-jagannath-real.jpg' },
    { id: 'puri-3', placeName: 'Konark Sun Temple 24 Sundial Chariot Wheels', category: 'Heritage & Culture', url: './konark-sun-temple-real.jpg' },
    { id: 'puri-4', placeName: 'Lingaraj Temple 180-ft Stone Tower Bhubaneswar', category: 'Heritage & Culture', url: './lingaraj-temple-real.jpg' },
    { id: 'puri-5', placeName: 'Puri Blue Flag Golden Beach & Sunset', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80' },
    { id: 'puri-6', placeName: 'Chilika Lake Irrawaddy Dolphin Sanctuary', category: 'Wildlife & Safari', url: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80' }
  ],
  'tiruchendur': [
    { id: 'tc-1', placeName: 'Tiruchendur Murugan Seashore Temple Tower', category: 'Heritage & Culture', url: './tiruchendur-murugan-real.jpg', isDefaultCover: true },
    { id: 'tc-2', placeName: 'Tiruchendur Bay of Bengal Beach Sands', category: 'Lakes & Water', url: './tiruchendur-beach-real.jpg' },
    { id: 'tc-3', placeName: 'Thenkasi Kasi Viswanathar Temple Gopuram', category: 'Heritage & Culture', url: './thenkasi-viswanathar-real.jpg' },
    { id: 'tc-4', placeName: 'Courtallam Main Herbal Waterfalls', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80' }
  ],
  'gundlupet': [
    { id: 'gp-1', placeName: 'Gundlupet Golden Sunflower & Marigold Meadows', category: 'Gardens & Tea', url: './gundlupet-sunflowers-real.jpg', isDefaultCover: true },
    { id: 'gp-2', placeName: 'Bandipur Tiger Reserve Jungle Trail', category: 'Wildlife & Safari', url: './parambikulam-forest-real.jpg' },
    { id: 'gp-3', placeName: 'Himavad Gopalaswamy Betta Misty Summit', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80' }
  ],
  'horanadu': [
    { id: 'hn-1', placeName: 'Annapoorneshwari Temple Golden Shrine', category: 'Heritage & Culture', url: './horanadu-annapoorneshwari-real.jpg', isDefaultCover: true },
    { id: 'hn-2', placeName: 'Chikmagalur Western Ghats Green Tea Slopes', category: 'Gardens & Tea', url: './munnar-tea-plantations-real.jpg' },
    { id: 'hn-3', placeName: 'Kalasa Kalaseshwara Ancient Shiva Temple', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80' }
  ]
};

const POPULAR_DESTINATIONS_CHIPS = [
  { label: '🌿 Ooty (12 Places)', query: 'Ooty' },
  { label: '🌲 Kodaikanal (11 Places)', query: 'Kodaikanal' },
  { label: '⛰️ Munnar (8 Places)', query: 'Munnar' },
  { label: '🌴 Kochi (12 Places)', query: 'Kochi' },
  { label: '🚣 Kollam (12 Places)', query: 'Kollam' },
  { label: '🐅 Wayanad (6 Places)', query: 'Wayanad' },
  { label: '🌊 Athirappilly (4 Places)', query: 'Athirappilly' },
  { label: '🛕 Kashi & Ayodhya', query: 'Kashi' },
  { label: '❄️ Kashmir (8 Places)', query: 'Kashmir' },
  { label: '🐘 Parambikulam (4 Places)', query: 'Parambikulam' },
  { label: '🕉️ Puri & Konark (6 Places)', query: 'Puri' },
  { label: '🌺 Gundlupet Blooms', query: 'Gundlupet' },
  { label: '🦚 Tiruchendur & Thenkasi', query: 'Tiruchendur' },
  { label: '🌾 Horanadu Shrine', query: 'Horanadu' }
];

// Known curated locations — used to auto-sync the image studio only for real destinations,
// preventing generic fallback images from polluting the tour form while typing partial words.
const isKnownLocation = (loc) => {
  const n = (loc || '').trim().toLowerCase();
  if (!n) return false;
  if (LOCATION_PLACE_IMAGES[n]) return true;
  return Object.keys(LOCATION_PLACE_IMAGES).some(k =>
    n.includes(k) || k.includes(n)
  );
};

// Real-photo fallback when an image lookup misses, so a card never renders broken/empty
const GENERIC_FALLBACK_IMG = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

// ── Real photo sources ──────────────────────────────────────────────────────────
// 1) Google Images (Google Custom Search JSON API) — used automatically when the
//    keys are configured in .env (VITE_GOOGLE_CSE_KEY + VITE_GOOGLE_CSE_CX).
// 2) Wikipedia / Wikimedia Commons — always available fallback of real photographs.
const GOOGLE_CSE_KEY = import.meta.env.VITE_GOOGLE_CSE_KEY || '';
const GOOGLE_CSE_CX = import.meta.env.VITE_GOOGLE_CSE_CX || '';
const GOOGLE_IMAGES_ACTIVE = Boolean(GOOGLE_CSE_KEY && GOOGLE_CSE_CX);

const realImageCache = new Map();

const fetchFromGoogleImages = async (query) => {
  if (!GOOGLE_IMAGES_ACTIVE) return null;
  try {
    const res = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${encodeURIComponent(GOOGLE_CSE_KEY)}&cx=${encodeURIComponent(GOOGLE_CSE_CX)}&q=${encodeURIComponent(query)}&searchType=image&num=1&imgSize=large&safe=active`
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.items?.[0]?.link || null;
  } catch (err) {
    console.warn('Google Images lookup failed:', err);
    return null;
  }
};

const fetchFromWikipedia = async (query) => {
  try {
    const res = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrlimit=3&prop=pageimages&piprop=original|thumbnail&pithumbsize=1000`
    );
    if (!res.ok) return null;
    const data = await res.json();
    const pages = data.query?.pages ? Object.values(data.query.pages) : [];
    return pages.find(p => p.original?.source)?.original?.source
      || pages.find(p => p.thumbnail?.source)?.thumbnail?.source
      || null;
  } catch (err) {
    console.warn('Wikipedia image lookup failed:', err);
    return null;
  }
};

// Resolve a "wiki:<place name>" marker to a real photo — Google Images first, Wikipedia fallback
const fetchRealImage = async (query) => {
  const key = query.toLowerCase().trim();
  if (realImageCache.has(key)) return realImageCache.get(key);
  let url = null;
  if (GOOGLE_IMAGES_ACTIVE) url = await fetchFromGoogleImages(query);
  if (!url) url = await fetchFromWikipedia(query);
  realImageCache.set(key, url);
  return url;
};

// Replace any "wiki:" placeholder URLs in a place list with the place's real photo (concurrently)
const enrichWithWikipediaImages = async (list) => {
  const results = await Promise.all(list.map(async (p) => {
    if (typeof p.url === 'string' && p.url.startsWith('wiki:')) {
      const real = await fetchRealImage(p.url.slice(5));
      return real ? { ...p, url: real } : { ...p, url: GENERIC_FALLBACK_IMG };
    }
    return p;
  }));
  return results;
};

export default function AiPlaceImageSelector({
  locationName = 'Ooty',
  onSelectCoverImage,
  onSelectMixImages,
  onSelectMainPlaces,
  onSelectIncludedHighlights,
  onAutoFillPackage
}) {
  const [searchInput, setSearchInput] = useState(locationName || 'Ooty');
  const [activeLocation, setActiveLocation] = useState(locationName || 'Ooty');
  const [placesList, setPlacesList] = useState([]);
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [selectedMixUrls, setSelectedMixUrls] = useState([]);
  const [blendStyle, setBlendStyle] = useState('collage-blend');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [aiGeneratingId, setAiGeneratingId] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const isFirstLoad = useRef(true);

  // Initial load on mount only (activeLocation starts from locationName prop)
  useEffect(() => {
    loadLocationPlaces(activeLocation);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync whenever parent passes a different locationName
  useEffect(() => {
    if (!locationName || !locationName.trim()) return;
    const cleanLoc = locationName.trim();
    if (cleanLoc.length < 3) return; // avoid generic fallback images from partial words
    if (!isKnownLocation(cleanLoc)) return; // only auto-sync known destinations, never mixed generic images
    if (cleanLoc.toLowerCase() !== activeLocation.trim().toLowerCase()) {
      setSearchInput(cleanLoc);
      setActiveLocation(cleanLoc);
      loadLocationPlaces(cleanLoc);
    }
  }, [locationName]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadLocationPlaces = async (loc) => {
    setIsLoading(true);
    const norm = loc.trim().toLowerCase();
    
    // Priority-ordered lookup to avoid substring collisions (kashi vs kashmir, etc.)
    const PRIORITY_KEYS = [
      'silent valley', 'athirappilly', 'parambikulam', 'tiruchendur',
      'kodaikanal', 'gundlupet', 'horanadu', 'wayanad', 'kashmir',
      'munnar', 'kashi', 'ayodhya', 'kochi', 'cochin', 'kollam', 'puri', 'ooty'
    ];

    let found = [];
    let matchedLocationKey = null;
    // First try exact match
    if (LOCATION_PLACE_IMAGES[norm]) {
      found = LOCATION_PLACE_IMAGES[norm];
      matchedLocationKey = norm;
    } else {
      // Try priority-ordered partial match
      const matchedKey = PRIORITY_KEYS.find(key => norm.includes(key) || key.includes(norm));
      if (matchedKey) {
        // Find actual key in data (e.g. 'cochin' -> 'cochin')
        const dataKey = Object.keys(LOCATION_PLACE_IMAGES).find(k => k === matchedKey || k.includes(matchedKey) || matchedKey.includes(k));
        if (dataKey) {
          found = LOCATION_PLACE_IMAGES[dataKey];
          matchedLocationKey = dataKey;
        }
      }
    }

    // STRICT FILTER: when a curated location matches, show ONLY that location's images.
    if (found.length === 0) {
      // Fallback generator from aiDestinationGenerator (real place names; photos resolved below)
      const guideData = generateAiDestinationGuide(loc);
      found = guideData.attractions ? guideData.attractions.map((a, i) => ({
        id: a.id || `place-${i}`,
        placeName: a.name,
        category: a.category || 'Tourist Place',
        url: a.image && !a.image.includes('images.unsplash.com') ? a.image : `wiki:${a.name}`,
        isDefaultCover: i === 0
      })) : [];

      // Also attempt real-time Wikipedia / Wikimedia image discovery for custom locations
      try {
        const wikiRes = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(loc + ' tourism attractions')}&gsrlimit=8&prop=pageimages|extracts&piprop=original|thumbnail&pithumbsize=1000&exintro=1&explaintext=1`
        );
        if (wikiRes.ok) {
          const wikiData = await wikiRes.json();
          const pages = wikiData.query?.pages ? Object.values(wikiData.query.pages) : [];
          // Keep real result pages from the location-scoped search; only skip the location's own article
          const wikiPlaces = pages
            .filter(p => (p.thumbnail?.source || p.original?.source) && p.title.toLowerCase().trim() !== norm)
            .map((p, idx) => ({
              id: `wiki-${p.pageid || idx}`,
              placeName: p.title,
              category: 'Heritage & Culture',
              url: p.original?.source || p.thumbnail?.source,
              isDefaultCover: false
            }));
          if (wikiPlaces.length > 0) {
            found = [...found, ...wikiPlaces];
          }
        }
      } catch (err) {
        console.warn('Live wiki fetch note:', err);
      }
    }

    // Resolve real Wikipedia photos for any "wiki:" placeholders (curated entries + fallback)
    if (found.some(p => typeof p.url === 'string' && p.url.startsWith('wiki:'))) {
      found = await enrichWithWikipediaImages(found);
    }

    setPlacesList(found);
    setIsLoading(false);

    const cover = found.find(p => p.isDefaultCover)?.url || found[0]?.url || '';
    setCoverImageUrl(cover);

    const initialMix = found.slice(0, 4).map(p => p.url);
    setSelectedMixUrls(initialMix);

    // After the very first mount, push the loaded location's images + places into the
    // parent tour form so "enter kochi => ONLY kochi images everywhere in the form".
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
    } else {
      if (onSelectCoverImage && cover) onSelectCoverImage(cover);
      if (onSelectMixImages && initialMix.length) onSelectMixImages(initialMix);
      if (onSelectMainPlaces) {
        const names = found.slice(0, 5).map(p => p.placeName);
        if (names.length) onSelectMainPlaces(names.join(', '));
      }
      setStatusMsg(`✅ Showing only ${matchedLocationKey ? 'verified' : ''} tourist places & images for "${loc.trim()}" (${found.length} spots). Images synced into the tour form.`);
      setTimeout(() => setStatusMsg(''), 4000);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;
    setActiveLocation(searchInput.trim());
    loadLocationPlaces(searchInput.trim());
    setStatusMsg(`🔍 Loaded authentic spots & photography for "${searchInput.trim()}"`);
    setTimeout(() => setStatusMsg(''), 3500);
  };

  const handleSelectPreset = (chip) => {
    setSearchInput(chip.query);
    setActiveLocation(chip.query);
    loadLocationPlaces(chip.query);
    setStatusMsg(`✨ Displaying all tourist attractions in ${chip.query}`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleToggleMixPlace = (url) => {
    if (selectedMixUrls.includes(url)) {
      const updated = selectedMixUrls.filter(u => u !== url);
      setSelectedMixUrls(updated);
      if (onSelectMixImages) onSelectMixImages(updated);
    } else {
      const updated = [...selectedMixUrls, url];
      setSelectedMixUrls(updated);
      if (onSelectMixImages) onSelectMixImages(updated);
    }
  };

  const handleSetCover = (url, name) => {
    setCoverImageUrl(url);
    if (onSelectCoverImage) onSelectCoverImage(url);
    setStatusMsg(`✓ Selected cover image: "${name || 'Selected Place'}"`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  // After editing one place's image, keep cover/mix + parent form in sync
  const applyEditedImage = (item, newUrl) => {
    const updatedList = placesList.map(p => p.id === item.id ? { ...p, url: newUrl } : p);
    setPlacesList(updatedList);

    const coverChanged = coverImageUrl === item.url;
    const cover = coverChanged ? newUrl : coverImageUrl;
    if (coverChanged) setCoverImageUrl(cover);

    const mix = selectedMixUrls.map(u => u === item.url ? newUrl : u);
    const mixChanged = mix.some((u, i) => u !== selectedMixUrls[i]) || mix.length !== selectedMixUrls.length;
    if (mixChanged) {
      setSelectedMixUrls(mix);
      if (onSelectMixImages) onSelectMixImages(mix);
    }

    if (coverChanged && onSelectCoverImage) onSelectCoverImage(cover);
  };

  // Build a photo prompt specific to THIS place by pulling its real description
  // from the curated guide database (matched by shared name words).
  const buildPlaceAiPrompt = (item) => {
    const attrs = generateAiDestinationGuide(activeLocation).attractions || [];
    const sigWords = (s) => (s || '').toLowerCase().replace(/[^a-z ]/g, '').split(/\s+/).filter(w => w.length > 3);
    const w1 = sigWords(item.placeName);
    let best = null, bestScore = 0;
    for (const a of attrs) {
      const w2 = sigWords(a.name);
      const common = w1.filter(w => w2.includes(w)).length;
      if (common > bestScore) { bestScore = common; best = a; }
    }
    const detail = bestScore >= 2 && best?.shortDescription
      ? best.shortDescription.split('.')[0]
      : '';
    return `${item.placeName} in ${activeLocation}. ${detail ? detail + '. ' : ''}ultra-realistic photorealistic travel photograph of this exact tourist place, golden hour lighting, vibrant colors, sharp detail, no text, no watermark`;
  };

  // Per-place button: get the BEST image for this exact place.
  // 1) Try the real photo (Google Images → Wikipedia) searched by the place name.
  // 2) If no real photo exists, fall back to AI generation via Gemini.
  // 3) If both fail, keep the current image and suggest manual upload.
  const handleGeneratePlaceAi = async (item) => {
    if (aiGeneratingId) return;
    setAiGeneratingId(item.id);

    const searchQuery = `${item.placeName} ${activeLocation}`;

    setStatusMsg(`🔍 Searching real photo for "${item.placeName}"...`);
    try {
      const realUrl = await fetchRealImage(searchQuery);
      if (realUrl) {
        applyEditedImage(item, realUrl);
        setStatusMsg(`📷 Real photo found for "${item.placeName}" ${GOOGLE_IMAGES_ACTIVE ? '(from Google Images)' : '(from Wikipedia)'}.`);
        setTimeout(() => setStatusMsg(''), 4500);
        return;
      }
    } catch (err) {
      console.warn('Real photo search failed:', err);
    }

    setStatusMsg(`🎨 No real photo found — generating AI image for "${item.placeName}"...`);
    try {
      const aiUrl = await geminiService.generatePosterImage(
        buildPlaceAiPrompt(item),
        'photorealistic'
      );
      applyEditedImage(item, aiUrl);
      setStatusMsg(`🤖 AI image ready for "${item.placeName}". Not right? Tap 📤 Upload to add your own photo.`);
      setTimeout(() => setStatusMsg(''), 5000);
    } catch (err) {
      console.warn('Place AI generation failed:', err);
      setStatusMsg(`⚠️ No photo found for "${item.placeName}". You can upload a photo manually instead.`);
      setTimeout(() => setStatusMsg(''), 4500);
    } finally {
      setAiGeneratingId(null);
    }
  };

  // Per-place: upload a real photo manually (used when the AI image isn't correct)
  const handleUploadPlaceImage = (item, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      applyEditedImage(item, reader.result);
      setStatusMsg(`✅ Uploaded your own photo for "${item.placeName}".`);
      setTimeout(() => setStatusMsg(''), 3500);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyAllToForm = () => {
    const selectedPlacesNames = placesList
      .filter(p => selectedMixUrls.includes(p.url) || p.url === coverImageUrl)
      .map(p => p.placeName);
    
    const mainPlacesStr = selectedPlacesNames.join(', ');
    const highlightsText = selectedPlacesNames.map(p => `✓ Sightseeing Excursion to ${p}`).join('\n');

    if (onSelectCoverImage && coverImageUrl) onSelectCoverImage(coverImageUrl);
    if (onSelectMixImages) onSelectMixImages(selectedMixUrls);
    if (onSelectMainPlaces) onSelectMainPlaces(mainPlacesStr);
    if (onSelectIncludedHighlights) onSelectIncludedHighlights(highlightsText);

    setStatusMsg(`✨ Applied ${selectedPlacesNames.length} AI places & Hero Mix to Form!`);
    setTimeout(() => setStatusMsg(''), 4000);
  };

  // Generate real AI photographs for every place in the current location, keeping names.
  const handleGenerateAiImages = async () => {
    if (isGeneratingImages) return;
    if (!placesList.length) {
      setStatusMsg('⚠️ Load a location first (e.g. Kochi) before generating AI images.');
      setTimeout(() => setStatusMsg(''), 3500);
      return;
    }

    setIsGeneratingImages(true);
    setStatusMsg(`🎨 Preparing to generate ${placesList.length} AI images for "${activeLocation}"...`);

    const targets = placesList;
    const generated = [];
    for (let i = 0; i < targets.length; i++) {
      const place = targets[i];
      setStatusMsg(`🎨 Generating AI image ${i + 1}/${targets.length}: "${place.placeName}"...`);
      try {
        const aiUrl = await geminiService.generatePosterImage(
          buildPlaceAiPrompt(place),
          'photorealistic'
        );
        generated.push({ ...place, url: aiUrl });
      } catch (err) {
        console.warn(`AI generation failed for "${place.placeName}":`, err);
        generated.push({ ...place });
      }
    }

    setPlacesList(generated);

    const cover = generated.find(p => p.isDefaultCover)?.url || generated[0]?.url || '';
    setCoverImageUrl(cover);

    const initialMix = generated.slice(0, 4).map(p => p.url);
    setSelectedMixUrls(initialMix);

    if (onSelectCoverImage && cover) onSelectCoverImage(cover);
    if (onSelectMixImages && initialMix.length) onSelectMixImages(initialMix);
    if (onSelectMainPlaces) {
      const names = generated.slice(0, 5).map(p => p.placeName);
      if (names.length) onSelectMainPlaces(names.join(', '));
    }

    setIsGeneratingImages(false);
    setStatusMsg(`✅ AI-generated ${generated.length} real photos for "${activeLocation}" tourist places (with names) & synced into the tour form!`);
    setTimeout(() => setStatusMsg(''), 5000);
  };

  const handleAutoFillEntireTour = () => {
    const locLower = activeLocation.toLowerCase().trim();
    const guideData = generateAiDestinationGuide(activeLocation);
    const selectedPlacesNames = placesList.map(p => p.placeName);
    const mainPlacesStr = selectedPlacesNames.slice(0, 5).join(', ');
    const highlightsText = guideData.attractions ? guideData.attractions.slice(0, 4).map(a => `✓ ${a.name} (${a.distance}): ${a.openingHours} | Fee: ${a.entryFee}`).join('\n') : '';
    const itineraryText = guideData.oneDayItinerary ? guideData.oneDayItinerary.map(slot => `• ${slot.time} - ${slot.title} (${slot.place}): ${slot.desc}`).join('\n') : '';
    const fullIncludedText = `${highlightsText}\n\n1-DAY SIGHTSEEING TIMETABLE:\n${itineraryText}`;

    // Tailored title and metadata based strictly on the selected location
    let packageTitle = `${activeLocation} Scenic Highlights & Heritage Trail`;
    let packageSubtitle = `Thrissur Direct Departure Special • ${placesList.length}+ Sightseeing Spots`;
    let destinationId = 'ooty-nilgiri-hills';
    let packagePrice = 14999;
    let packageOriginalPrice = 17999;
    let duration = '3 Days / 2 Nights';

    if (locLower.includes('kochi') || locLower.includes('cochin') || locLower.includes('ernakulam')) {
      packageTitle = 'Queen of Arabian Sea: Kochi Heritage Harbor & Chinese Nets Yatra';
      packageSubtitle = 'Thrissur Direct Departure Special • Fort Kochi, Dutch Palace & Marine Drive Sunset Cruise';
      destinationId = 'kochi-heritage-harbor';
      packagePrice = 8999;
      packageOriginalPrice = 10999;
      duration = '2 Days / 1 Night';
    } else if (locLower.includes('kollam') || locLower.includes('quilon')) {
      packageTitle = 'Ashtamudi Backwaters & Jatayu Rock: Kollam Heritage Cruise Yatra';
      packageSubtitle = 'Thrissur Direct Departure Special • Ashtamudi Houseboat, Thangassery Light House & Munroe Island';
      destinationId = 'kollam-ashtamudi-lake';
      packagePrice = 13999;
      packageOriginalPrice = 16999;
      duration = '2 Days / 1 Night';
    } else if (locLower.includes('ooty') || locLower.includes('nilgiri')) {
      packageTitle = 'Queen of Nilgiris: Ooty Heritage Toy Train & Tea Highlands Yatra';
      packageSubtitle = 'Thrissur Departure Special • Reserved UNESCO Steam Train & Ooty Lake Boating';
      destinationId = 'ooty-nilgiri-hills';
      packagePrice = 14999;
      packageOriginalPrice = 17999;
      duration = '3 Days / 2 Nights';
    } else if (locLower.includes('munnar')) {
      packageTitle = 'Emerald Munnar: Kolukkumalai Sunrise & Rajamalai Tahr Safari';
      packageSubtitle = 'Thrissur Direct Pickup Escorted Hill Station • World’s Highest Tea Estate at 7,900 ft';
      destinationId = 'munnar-tea-plantations';
      packagePrice = 16999;
      packageOriginalPrice = 19999;
      duration = '3 Days / 2 Nights';
    } else if (locLower.includes('kodaikanal') || locLower.includes('kodai')) {
      packageTitle = 'Princess of Hill Stations: Kodaikanal Star Lake & Pine Forest Yatra';
      packageSubtitle = 'Thrissur Departure Special • Pedal Boating, Coaker’s 180° Valley Walk & Guna Caves';
      destinationId = 'kodaikanal-princess-hills';
      packagePrice = 15999;
      packageOriginalPrice = 18999;
      duration = '3 Days / 2 Nights';
    } else if (locLower.includes('wayanad')) {
      packageTitle = 'Wayanad Misty Rainforests & Heart Lake Expedition';
      packageSubtitle = 'Thrissur Direct Escorted Tour • Chembra Peak & Banasura Sagar Lake Speedboating';
      destinationId = 'wayanad-misty-hills';
      packagePrice = 16999;
      packageOriginalPrice = 19999;
      duration = '3 Days / 2 Nights';
    } else if (locLower.includes('athirappilly')) {
      packageTitle = 'Niagara of India: Athirappilly & Vazhachal Falls Day Trail';
      packageSubtitle = 'Thrissur Direct Pickup Eco-Excursion & Rainforest Safari';
      destinationId = 'athirappilly-waterfalls';
      packagePrice = 4999;
      packageOriginalPrice = 6999;
      duration = '1 Day / Full Day Tour';
    } else if (locLower.includes('silent valley')) {
      packageTitle = 'Silent Valley Rainforest & Wilderness Expedition';
      packageSubtitle = 'Thrissur Direct Pickup Ecotourism & Rainforest Trail';
      destinationId = 'silent-valley-national-park';
      packagePrice = 18999;
      packageOriginalPrice = 22999;
      duration = '3 Days / 2 Nights';
    } else if (locLower.includes('kashi') || locLower.includes('varanasi')) {
      packageTitle = 'Sacred North Yatra: Kashi Vishwanath, Ayodhya Ram Mandir & Prayagraj';
      packageSubtitle = 'Thrissur Departure VIP Pilgrimage • Ganga Aarti & Triveni Sangam Holy Dip';
      destinationId = 'kashi-varanasi';
      packagePrice = 24999;
      packageOriginalPrice = 29999;
      duration = '7 Days / 6 Nights';
    } else if (locLower.includes('ayodhya')) {
      packageTitle = 'Shri Ram Janmabhoomi & Sacred Ayodhya Pilgrimage';
      packageSubtitle = 'Thrissur Direct Flight Escorted Tour • VIP Darshan & Saryu Aarti';
      destinationId = 'ayodhya-ram-mandir';
      packagePrice = 28999;
      packageOriginalPrice = 32999;
      duration = '6 Days / 5 Nights';
    } else if (locLower.includes('kashmir')) {
      packageTitle = 'Paradise on Earth: Kashmir Valley, Gulmarg Snow & Dal Lake Shikara';
      packageSubtitle = 'Thrissur Direct Flight Escorted Tour • Deluxe Houseboat & Apharwat Peak Gondola';
      destinationId = 'kashmir-punjab-golden-trail';
      packagePrice = 32999;
      packageOriginalPrice = 38999;
      duration = '6 Days / 5 Nights';
    } else if (locLower.includes('parambikulam')) {
      packageTitle = 'Parambikulam Tiger Reserve Rainforest Safari';
      packageSubtitle = 'Thrissur Direct AC Coach • Bamboo Rafting & Kannimara Giant Teak';
      destinationId = 'parambikulam-tiger-reserve';
      packagePrice = 13999;
      packageOriginalPrice = 16999;
      duration = '3 Days / 2 Nights';
    } else if (locLower.includes('puri') || locLower.includes('jagannath') || locLower.includes('konark')) {
      packageTitle = 'Sacred Odisha Golden Triangle: Puri Jagannath & Konark Sun Temple';
      packageSubtitle = 'Thrissur Departure Special • 56 Bhog Mahaprasad & Golden Beach';
      destinationId = 'puri-jagannath';
      packagePrice = 26999;
      packageOriginalPrice = 31999;
      duration = '5 Days / 4 Nights';
    } else if (locLower.includes('tiruchendur') || locLower.includes('thenkasi')) {
      packageTitle = 'Tiruchendur Seashore Murugan & Thenkasi Kasi Viswanathar Yatra';
      packageSubtitle = 'Thrissur Departure Special • Coastal Temple Darshan & Courtallam Falls';
      destinationId = 'tiruchendur-murugan';
      packagePrice = 15999;
      packageOriginalPrice = 18999;
      duration = '3 Days / 2 Nights';
    } else if (locLower.includes('gundlupet')) {
      packageTitle = 'Gundlupet Sunflower Valley & Bandipur Tiger Safari';
      packageSubtitle = 'Thrissur Direct Pickup Escorted Tour • Golden Flower Blooming Meadows';
      destinationId = 'gundlupet-sunflowers';
      packagePrice = 11999;
      packageOriginalPrice = 14999;
      duration = '2 Days / 1 Night';
    } else if (locLower.includes('horanadu')) {
      packageTitle = 'Annapoorneshwari Horanadu & Western Ghats Pilgrimage';
      packageSubtitle = 'Thrissur Direct AC Bus Transport • Sacred Mahaprasadam & Kalasa';
      destinationId = 'annapoorneshwari-horanadu';
      packagePrice = 14999;
      packageOriginalPrice = 17999;
      duration = '3 Days / 2 Nights';
    }

    // Ensure ONLY images matching this location are used
    const strictlyLocationMix = selectedMixUrls.length 
      ? selectedMixUrls 
      : placesList.slice(0, 4).map(p => p.url);

    const autoPackageData = {
      title: packageTitle,
      subtitle: packageSubtitle,
      duration: duration,
      price: packagePrice,
      originalPrice: packageOriginalPrice,
      badge: '✨ AI Curated Special',
      image: coverImageUrl || placesList[0]?.url || guideData.heroImage,
      bgMixImages: strictlyLocationMix,
      bgMixStyle: blendStyle,
      mainPlaces: mainPlacesStr,
      included: fullIncludedText,
      destinationId: destinationId
    };

    if (onAutoFillPackage) {
      onAutoFillPackage(autoPackageData);
    } else {
      if (onSelectCoverImage) onSelectCoverImage(autoPackageData.image);
      if (onSelectMixImages) onSelectMixImages(autoPackageData.bgMixImages);
      if (onSelectMainPlaces) onSelectMainPlaces(autoPackageData.mainPlaces);
      if (onSelectIncludedHighlights) onSelectIncludedHighlights(autoPackageData.included);
    }

    setStatusMsg(`⚡ Auto-filled complete tour package for "${activeLocation}" with strictly related images!`);
    setTimeout(() => setStatusMsg(''), 4500);
  };

  // Categories list
  const categories = ['All', ...new Set(placesList.map(p => p.category).filter(Boolean))];
  const filteredPlaces = activeCategory === 'All' 
    ? placesList 
    : placesList.filter(p => p.category === activeCategory);

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(6, 12, 23, 0.95), rgba(12, 24, 48, 0.95))', border: '1px solid var(--border-gold)', borderRadius: '16px', padding: '1.4rem', marginBottom: '1.4rem', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
      
      {/* Studio Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--gold-primary)" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', margin: 0 }}>
              AI Location Image &amp; Tourist Places Explorer
            </h4>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Enter ANY location name (e.g. <strong style={{ color: '#fef08a' }}>Ooty</strong>, <strong style={{ color: '#fef08a' }}>Munnar</strong>, <strong style={{ color: '#fef08a' }}>Kodaikanal</strong>) to instantly load all authentic tourist spots &amp; real photography.{' '}
            {GOOGLE_IMAGES_ACTIVE ? (
              <span style={{ color: '#34d399', fontWeight: 700 }}>📷 Photos from Google Images</span>
            ) : (
              <span style={{ color: '#93c5fd', fontWeight: 700 }}>📷 Real photos from Wikipedia/Wikimedia</span>
            )}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-gold"
            onClick={handleGenerateAiImages}
            disabled={isGeneratingImages}
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', gap: '0.4rem', fontWeight: 800, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', opacity: isGeneratingImages ? 0.7 : 1, cursor: isGeneratingImages ? 'wait' : 'pointer' }}
          >
            {isGeneratingImages ? <RefreshCw size={14} className="spin" /> : <ImageIcon size={14} />}
            {isGeneratingImages ? 'Generating AI Photos...' : '✨ AI Generate Place Photos (with Names)'}
          </button>
          <button
            type="button"
            className="btn-gold"
            onClick={handleAutoFillEntireTour}
            style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', gap: '0.4rem', fontWeight: 800, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            <Zap size={14} /> ⚡ Auto-Fill Complete Tour Package
          </button>
          <button
            type="button"
            className="btn-glass"
            onClick={handleApplyAllToForm}
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', gap: '0.35rem', color: 'var(--gold-light)' }}
          >
            <Wand2 size={14} /> Apply Images to Form
          </button>
        </div>
      </div>

      {/* DYNAMIC SEARCH BAR (Uses div and type="button" to prevent outer form submission/modal close) */}
      <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.8rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={16} color="var(--gold-primary)" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                handleSearchSubmit(e);
              }
            }}
            placeholder="Type ANY location: e.g. Ooty, Munnar, Kodaikanal, Wayanad, Kashmir, Goa, Manali, Paris..."
            style={{
              width: '100%',
              background: '#040812',
              border: '1.5px solid var(--border-gold)',
              borderRadius: '12px',
              color: '#fff',
              padding: '0.65rem 1rem 0.65rem 2.5rem',
              fontSize: '0.9rem',
              fontWeight: 600,
              outline: 'none'
            }}
          />
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSearchSubmit(e);
          }}
          className="btn-gold"
          style={{ padding: '0.65rem 1.3rem', fontSize: '0.85rem', gap: '0.4rem', fontWeight: 800 }}
        >
          {isLoading ? <RefreshCw size={15} className="spin" /> : <Sparkles size={15} />}
          Get All Images in {searchInput || 'Location'}
        </button>
      </div>

      {/* POPULAR DESTINATION PRESET CHIPS */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
          Quick Locations:
        </span>
        {POPULAR_DESTINATIONS_CHIPS.map(chip => {
          const isActive = activeLocation.toLowerCase() === chip.query.toLowerCase();
          return (
            <button
              key={chip.query}
              type="button"
              onClick={() => handleSelectPreset(chip)}
              style={{
                background: isActive ? 'var(--gold-primary)' : 'rgba(255,255,255,0.06)',
                color: isActive ? '#000' : 'var(--gold-light)',
                border: isActive ? '1px solid var(--gold-primary)' : '1px solid rgba(245,158,11,0.25)',
                borderRadius: '20px',
                padding: '0.3rem 0.75rem',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {chip.label}
            </button>
          );
        })}
      </div>

      {statusMsg && (
        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981', padding: '0.5rem 0.9rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={16} /> {statusMsg}
        </div>
      )}

      {/* LIVE HERO MIXED BACKGROUND PREVIEW */}
      <div style={{ background: '#02060e', border: '1px solid rgba(245,158,11,0.35)', borderRadius: '14px', padding: '0.9rem', marginBottom: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--gold-light)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={15} color="var(--gold-primary)" /> Live Hero Mixed Background ({selectedMixUrls.length} Tourist Places Blended)
          </span>

          {/* Blend Style Selector */}
          <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Blend Mode:</span>
            {['collage-blend', 'split-grid', 'fade-slide'].map(st => (
              <button
                key={st}
                type="button"
                onClick={() => setBlendStyle(st)}
                style={{
                  background: blendStyle === st ? 'var(--gold-primary)' : 'rgba(255,255,255,0.06)',
                  color: blendStyle === st ? '#000' : 'var(--text-muted)',
                  border: 'none', borderRadius: '12px', padding: '0.2rem 0.65rem',
                  fontSize: '0.68rem', fontWeight: 700, cursor: 'pointer'
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Mixed Background Hero Preview Box */}
        <div style={{ position: 'relative', height: '150px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-gold)' }}>
          <MixedBackground images={selectedMixUrls} style={blendStyle} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(6,12,23,0.85) 0%, transparent 65%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '0.7rem', left: '0.9rem', zIndex: 10 }}>
            <span style={{ background: 'rgba(245,158,11,0.9)', color: '#000', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '10px' }}>
              Hero Banner Composite
            </span>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff', marginTop: '0.2rem' }}>
              {activeLocation} Multi-Attraction Mixed Visual Panorama
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER TABS */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--gold-light)' }}>
          All Images &amp; Tourist Spots in <span style={{ color: '#fef08a' }}>{activeLocation}</span> ({filteredPlaces.length} Attractions Found):
        </div>

        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)',
                color: activeCategory === cat ? '#fef08a' : 'var(--text-muted)',
                border: activeCategory === cat ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '8px', padding: '0.2rem 0.55rem', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* IMAGES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem', maxHeight: '340px', overflowY: 'auto', paddingRight: '0.3rem' }}>
        {filteredPlaces.map((item, idx) => {
          const isCover = coverImageUrl === item.url;
          const inMix = selectedMixUrls.includes(item.url);
          return (
            <div
              key={item.id || idx}
              style={{
                background: isCover ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)',
                border: isCover ? '2px solid var(--gold-primary)' : inMix ? '1.5px solid rgba(139,92,246,0.7)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px', overflow: 'hidden', padding: '0.55rem',
                transition: 'all 0.2s ease', position: 'relative', display: 'flex', flexDirection: 'column'
              }}
            >
              {/* Place Thumbnail Image */}
              <div style={{ position: 'relative', height: '105px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.45rem' }}>
                <img 
                  src={item.url} 
                  alt={item.placeName} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <span style={{ position: 'absolute', top: '0.3rem', left: '0.3rem', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '8px' }}>
                  #{idx + 1}
                </span>

                {isCover && (
                  <span style={{ position: 'absolute', top: '0.3rem', right: '0.3rem', background: '#f59e0b', color: '#000', fontSize: '0.6rem', fontWeight: 900, padding: '0.15rem 0.45rem', borderRadius: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.4)' }}>
                    COVER
                  </span>
                )}
                {inMix && !isCover && (
                  <span style={{ position: 'absolute', top: '0.3rem', right: '0.3rem', background: '#8b5cf6', color: '#fff', fontSize: '0.6rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '8px' }}>
                    IN MIX
                  </span>
                )}
              </div>

              {/* Place Name & Category */}
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', lineHeight: '1.2', marginBottom: '0.2rem' }}>
                {item.placeName}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.6rem', marginTop: 'auto' }}>
                {item.category}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => handleSetCover(item.url, item.placeName)}
                  style={{
                    flex: 1, padding: '0.3rem 0.35rem', borderRadius: '7px', border: 'none',
                    background: isCover ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                    color: isCover ? '#000' : 'var(--gold-light)',
                    fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  {isCover ? '✓ Cover' : 'Set Cover'}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleMixPlace(item.url)}
                  style={{
                    flex: 1, padding: '0.3rem 0.35rem', borderRadius: '7px', border: 'none',
                    background: inMix ? '#8b5cf6' : 'rgba(255,255,255,0.08)',
                    color: '#fff', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  {inMix ? '✓ Hero Mix' : '+ Mix'}
                </button>
              </div>

              {/* AI Generate / Manual Upload row — generate with name, or upload your own photo */}
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem' }}>
                <button
                  type="button"
                  onClick={() => handleGeneratePlaceAi(item)}
                  disabled={Boolean(aiGeneratingId)}
                  style={{
                    flex: 1, padding: '0.3rem 0.35rem', borderRadius: '7px', border: '1px solid rgba(139,92,246,0.5)',
                    background: aiGeneratingId === item.id ? 'rgba(139,92,246,0.35)' : 'rgba(139,92,246,0.15)',
                    color: '#c4b5fd', fontSize: '0.65rem', fontWeight: 800, cursor: aiGeneratingId ? 'wait' : 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  {aiGeneratingId === item.id ? <RefreshCw size={11} className="spin" /> : <Sparkles size={11} />}
                  {' '}{aiGeneratingId === item.id ? 'Generating...' : '🤖 AI Image'}
                </button>

                <label
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem',
                    padding: '0.3rem 0.35rem', borderRadius: '7px', border: '1px solid rgba(52,211,153,0.5)',
                    background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', fontSize: '0.65rem', fontWeight: 800, cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  <Upload size={11} /> 📤 Upload
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      handleUploadPlaceImage(item, e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                </label>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
