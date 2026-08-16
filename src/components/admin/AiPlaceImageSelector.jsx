import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Check, Image as ImageIcon, Layers, Eye, Star, MapPin, Upload,
  RefreshCw, Wand2, ShieldCheck, Search, Filter, ArrowRight, Zap, CheckCircle2,
  Plus, Trash2, Tag, Compass
} from 'lucide-react';
import { geminiService } from '../../services/gemini';
import MixedBackground from '../MixedBackground';

// High-definition authentic photography bank for popular tourist places
const LOCATION_PLACE_IMAGES = {
  'ooty': [
    { id: 'ooty-1', placeName: 'Nilgiri Mountain Toy Train (UNESCO World Heritage)', category: 'Heritage & Rail', url: './ooty-toy-train-real.jpg', isDefaultCover: true, location: 'Ooty' },
    { id: 'ooty-2', placeName: 'Government Botanical Garden & Glasshouse', category: 'Gardens & Tea', url: './ooty-botanical-garden-real.jpg', location: 'Ooty' },
    { id: 'ooty-3', placeName: 'Ooty Lake & Star Boating Jetty', category: 'Lakes & Water', url: './ooty-lake-boating-real.jpg', location: 'Ooty' },
    { id: 'ooty-4', placeName: 'Nilgiri Tea Plantations & Doddabetta Slopes', category: 'Gardens & Tea', url: './ooty-tea-gardens-real.jpg', location: 'Ooty' },
    { id: 'ooty-5', placeName: 'Doddabetta Peak (8,652 ft) & Telescope House', category: 'Peaks & Views', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Doddabetta_viewOf_Ooty_1.jpg/960px-Doddabetta_viewOf_Ooty_1.jpg', location: 'Ooty' },
    { id: 'ooty-6', placeName: 'Pykara Lake & Cascading Roaring Waterfalls', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80', location: 'Ooty' },
    { id: 'ooty-7', placeName: 'Avalanche Lake & Trout Pine Sanctuary', category: 'Lakes & Water', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Avalanche_lake_ooty_1.jpg', location: 'Ooty' },
    { id: 'ooty-8', placeName: 'Government Rose Garden (20,000+ Rose Varieties)', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1200&q=80', location: 'Ooty' },
    { id: 'ooty-9', placeName: 'Wenlock Downs 9th Mile Shooting Meadow', category: 'Peaks & Views', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Nilgiri_Biosphere_Reserve-Wenlock_Downs-WUS06099.jpg/960px-Nilgiri_Biosphere_Reserve-Wenlock_Downs-WUS06099.jpg', location: 'Ooty' },
    { id: 'ooty-10', placeName: 'Emerald Lake & Silent Valley Tea Ridge', category: 'Lakes & Water', url: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Emerald_Lake_Nilgiris.jpg', location: 'Ooty' },
    { id: 'ooty-11', placeName: 'Highfield Tea Factory & Chocolate Museum', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80', location: 'Ooty' },
    { id: 'ooty-12', placeName: 'Mudumalai Tiger Reserve & Elephant Camp', category: 'Wildlife & Safari', url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80', location: 'Ooty' }
  ],
  'kodaikanal': [
    { id: 'kodai-1', placeName: 'Kodaikanal Star Lake & Pedal Boating', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80', isDefaultCover: true, location: 'Kodaikanal' },
    { id: 'kodai-2', placeName: 'Bryant Botanical Park & Floral Lawns', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1200&q=80', location: 'Kodaikanal' },
    { id: 'kodai-3', placeName: 'Coaker\'s Walk Promenade & Valley View', category: 'Peaks & Views', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Kodaikanal_Coaker%27s_Walk.JPG/960px-Kodaikanal_Coaker%27s_Walk.JPG', location: 'Kodaikanal' },
    { id: 'kodai-4', placeName: 'Pillar Rocks Vertical Granite Cliffs', category: 'Peaks & Views', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Pillar_Rocks%2C_Kodaikanal_Hills.jpg/960px-Pillar_Rocks%2C_Kodaikanal_Hills.jpg', location: 'Kodaikanal' },
    { id: 'kodai-5', placeName: 'Guna Caves (Devil\'s Kitchen Roots)', category: 'Heritage & Culture', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Guna_Caves_kodaikanal.jpg/960px-Guna_Caves_kodaikanal.jpg', location: 'Kodaikanal' },
    { id: 'kodai-6', placeName: 'Dense Pine Tree Forest Canopy', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80', location: 'Kodaikanal' },
    { id: 'kodai-7', placeName: 'Green Valley View (Suicide Point)', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80', location: 'Kodaikanal' },
    { id: 'kodai-8', placeName: 'Silver Cascade 180-ft Falls', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=1200&q=80', location: 'Kodaikanal' },
    { id: 'kodai-9', placeName: 'Dolphin\'s Nose Cliff & Echo Rock', category: 'Peaks & Views', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Dolphin_Nose%2C_Kodaikanal.jpg/960px-Dolphin_Nose%2C_Kodaikanal.jpg', location: 'Kodaikanal' },
    { id: 'kodai-10', placeName: 'Mannavanur Eco Lake & Sheep Farm', category: 'Lakes & Water', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Mannavanur_Lake_in_2024-11-09.jpg/960px-Mannavanur_Lake_in_2024-11-09.jpg', location: 'Kodaikanal' },
    { id: 'kodai-11', placeName: 'Poombarai Terraced Village & Temple', category: 'Heritage & Culture', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Poombarai_Village%2C_Kodaikanal_%2814342648914%29.jpg/960px-Poombarai_Village%2C_Kodaikanal_%2814342648914%29.jpg', location: 'Kodaikanal' }
  ],
  'munnar': [
    { id: 'mun-1', placeName: 'Munnar Emerald Tea Plantations', category: 'Gardens & Tea', url: './munnar-tea-plantations-real.jpg', isDefaultCover: true, location: 'Munnar' },
    { id: 'mun-2', placeName: 'Eravikulam National Park (Rajamalai Tahr)', category: 'Wildlife & Safari', url: 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80', location: 'Munnar' },
    { id: 'mun-3', placeName: 'Mattupetty Dam & Speedboat Lake', category: 'Lakes & Water', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Mattupetty_Lake_View.jpg/960px-Mattupetty_Lake_View.jpg', location: 'Munnar' },
    { id: 'mun-4', placeName: 'Kolukkumalai Sunrise (7,900 ft Cloud-bed)', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?auto=format&fit=crop&w=1200&q=80', location: 'Munnar' },
    { id: 'mun-5', placeName: 'Anamudi Peak Summit Lookout', category: 'Peaks & Views', url: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/AnaimudiPeak_DSC_4834.jpg', location: 'Munnar' },
    { id: 'mun-6', placeName: 'Kundala Arch Dam & Pedal Boating', category: 'Lakes & Water', url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Munnar_Kundala_Dam_%284224019133%29.jpg', location: 'Munnar' },
    { id: 'mun-7', placeName: 'Attukad Waterfalls & Forest Cascades', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80', location: 'Munnar' },
    { id: 'mun-8', placeName: 'Pothamedu Viewpoint & Cardamom Hills', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=1200&q=80', location: 'Munnar' }
  ],
  'kollam': [
    { id: 'kol-1', placeName: 'Ashtamudi Lake & Backwater Houseboat Cruise', category: 'Lakes & Water', url: 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Ashtamudi_Kerala.jpg', isDefaultCover: true, location: 'Kollam' },
    { id: 'kol-2', placeName: 'Jatayu Earth\'s Center (Chadayamangalam Rock)', category: 'Adventure & Culture', url: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Jatayu_adventure_centre.jpg', location: 'Kollam' },
    { id: 'kol-3', placeName: 'Thangassery Light House & British Fort', category: 'Heritage & Culture', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Thangassery_Lighthouse_Kollam_Kerala_Mar22_A7C_01634.jpg/960px-Thangassery_Lighthouse_Kollam_Kerala_Mar22_A7C_01634.jpg', location: 'Kollam' },
    { id: 'kol-4', placeName: 'Kollam Beach & Mahatma Gandhi Park', category: 'Lakes & Water', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Kollam_Beach_April_2023.jpg/960px-Kollam_Beach_April_2023.jpg', location: 'Kollam' },
    { id: 'kol-5', placeName: 'Munroe Island (Munroethuruth) Hidden Lagoon', category: 'Lakes & Water', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/House_Boat_DSW.jpg', location: 'Kollam' },
    { id: 'kol-6', placeName: 'Sasthamkotta Freshwater Lake', category: 'Lakes & Water', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Sasthamkotta_Lake_4.jpg/960px-Sasthamkotta_Lake_4.jpg', location: 'Kollam' },
    { id: 'kol-7', placeName: 'Thenmala Dam & Ecotourism Boardwalk', category: 'Nature & Ecotourism', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Ottakkal_Lookout%2C_Thenmala_dam.jpg/960px-Ottakkal_Lookout%2C_Thenmala_dam.jpg', location: 'Kollam' },
    { id: 'kol-8', placeName: 'Thevally Palace & Houseboat Jetty', category: 'Heritage & Culture', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Thevally_Palace.jpg', location: 'Kollam' },
    { id: 'kol-9', placeName: 'Paravur Lake & Puthenkavu Backwater Village', category: 'Lakes & Water', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Paravur_Lake%2C_Kollam_-_An_evening_scene.jpg/960px-Paravur_Lake%2C_Kollam_-_An_evening_scene.jpg', location: 'Kollam' },
    { id: 'kol-10', placeName: 'Tangasseri Fort Ruins & Ancient Trade Coast', category: 'Heritage & Culture', url: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Thangassery_Fort.jpg', location: 'Kollam' },
    { id: 'kol-11', placeName: 'Amritapuri International Ashram', category: 'Spiritual & Wellness', url: 'wiki:Amritapuri', location: 'Kollam' },
    { id: 'kol-12', placeName: 'Asramam Adventure Park & Maidan', category: 'Nature & Ecotourism', url: 'https://upload.wikimedia.org/wikipedia/commons/0/00/Asramam_Link_Road_in_Asramam%2C_Kollam.jpg', location: 'Kollam' }
  ],
  'kochi': [
    { id: 'kc-1', placeName: 'Fort Kochi Chinese Fishing Nets (Cheena Vala)', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80', isDefaultCover: true, location: 'Kochi' },
    { id: 'kc-2', placeName: 'Mattancherry Dutch Palace & Ramayana Murals', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80', location: 'Kochi' },
    { id: 'kc-3', placeName: 'Paradesi Jewish Synagogue & Jew Town Antiques', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80', location: 'Kochi' },
    { id: 'kc-4', placeName: 'Marine Drive Waterfront & Rainbow Bridge Harbor', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80', location: 'Kochi' },
    { id: 'kc-5', placeName: 'St. Francis CSI Church (Vasco da Gama 1503)', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80', location: 'Kochi' },
    { id: 'kc-6', placeName: 'Santa Cruz Cathedral Basilica Fort Kochi', category: 'Heritage & Culture', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Santa_Cruz_Basilica_Kochi.jpg/960px-Santa_Cruz_Basilica_Kochi.jpg', location: 'Kochi' },
    { id: 'kc-7', placeName: 'Hill Palace Museum Tripunithura (Royal Seat)', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80', location: 'Kochi' },
    { id: 'kc-8', placeName: 'Cherai Beach & Vypin Island Sunset Coast', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', location: 'Kochi' }
  ],
  'wayanad': [
    { id: 'way-1', placeName: 'Chembra Peak Heart-Shaped Lake', category: 'Lakes & Water', url: './wayanad_chembra_heart_lake_ai.png', isDefaultCover: true, location: 'Wayanad' },
    { id: 'way-2', placeName: 'Banasura Sagar Dam Speedboat Lake', category: 'Lakes & Water', url: './wayanad_banasura_lake_ai.png', location: 'Wayanad' },
    { id: 'way-3', placeName: 'Edakkal Prehistoric Caves Petroglyphs', category: 'Heritage & Culture', url: 'https://upload.wikimedia.org/wikipedia/commons/6/6e/Edakkal_Caves.jpg', location: 'Wayanad' },
    { id: 'way-4', placeName: 'Kuruva Island Bamboo Rafting', category: 'Lakes & Water', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Kuruva_Island%2C_Wayanad_%2849152125282%29.jpg/960px-Kuruva_Island%2C_Wayanad_%2849152125282%29.jpg', location: 'Wayanad' },
    { id: 'way-5', placeName: 'Lakkidi Ghat Viewpoint & Clouds', category: 'Peaks & Views', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80', location: 'Wayanad' },
    { id: 'way-6', placeName: 'Muthanga Wildlife Tiger Safari', category: 'Wildlife & Safari', url: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=1200&q=80', location: 'Wayanad' }
  ],
  'silent valley': [
    { id: 'sv-1', placeName: 'Misty Evergreen Rainforest Canopy', category: 'Gardens & Tea', url: './silent_valley_rainforest_ai.png', isDefaultCover: true, location: 'Silent Valley' },
    { id: 'sv-2', placeName: 'Kunthi River Crystal Stream & Bridge', category: 'Lakes & Water', url: './silent_valley_kunthi_river_ai.png', location: 'Silent Valley' },
    { id: 'sv-3', placeName: 'Lion-Tailed Macaque Wildlife Sanctuary', category: 'Wildlife & Safari', url: './silent_valley_wildlife_ai.png', location: 'Silent Valley' },
    { id: 'sv-4', placeName: 'Sairandhri Watchtower Lookout', category: 'Peaks & Views', url: './silent_valley_rainforest_ai.png', location: 'Silent Valley' }
  ],
  'athirappilly': [
    { id: 'ath-1', placeName: 'Athirappilly Roaring Waterfall Drop', category: 'Lakes & Water', url: './athirappilly_waterfall_main_ai.png', isDefaultCover: true, location: 'Athirappilly' },
    { id: 'ath-2', placeName: 'Rainbow Mist Spray & Jungle Rocks', category: 'Lakes & Water', url: './athirappilly_rainbow_spray_ai.png', location: 'Athirappilly' },
    { id: 'ath-3', placeName: 'Chalakudy Riverfront Rainforest', category: 'Gardens & Tea', url: './athirappilly_twilight_view_ai.png', location: 'Athirappilly' },
    { id: 'ath-4', placeName: 'Vazhachal Cascades & Forest Trail', category: 'Lakes & Water', url: 'https://upload.wikimedia.org/wikipedia/commons/8/81/The_View_of_the_Athirapally_Falls_during_the_onset_of_Monsoon.jpg', location: 'Athirappilly' }
  ],
  'kashi': [
    { id: 'kas-1', placeName: 'Kashi Vishwanath Jyotirlinga & Corridor', category: 'Heritage & Culture', url: './kashi-vishwanath-real.jpg', isDefaultCover: true, location: 'Kashi' },
    { id: 'kas-2', placeName: 'Dashashwamedh Ghat Evening Ganga Aarti', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80', location: 'Kashi' },
    { id: 'kas-3', placeName: 'Sarnath Deer Park & Dhamek Stupa', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80', location: 'Kashi' },
    { id: 'kas-4', placeName: 'Manikarnika Sacred Ghat Sunrise', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80', location: 'Kashi' },
    { id: 'kas-5', placeName: 'Prayagraj Triveni Sangam Holy Confluence', category: 'Lakes & Water', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Boat_Pilgrims_Triveni_Sangam_Allahabad_Jan24_A7C_08513.jpg/960px-Boat_Pilgrims_Triveni_Sangam_Allahabad_Jan24_A7C_08513.jpg', location: 'Prayagraj' }
  ],
  'ayodhya': [
    { id: 'ayo-1', placeName: 'Shri Ram Janmabhoomi Mandir Complex', category: 'Heritage & Culture', url: './ayodhya-ram-mandir-real.jpg', isDefaultCover: true, location: 'Ayodhya' },
    { id: 'ayo-2', placeName: 'Saryu River Ghats & Evening Aarti', category: 'Heritage & Culture', url: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80', location: 'Ayodhya' },
    { id: 'ayo-3', placeName: 'Hanuman Garhi Fort Temple', category: 'Heritage & Culture', url: './kashi-vishwanath-real.jpg', location: 'Ayodhya' },
    { id: 'ayo-4', placeName: 'Kanak Bhawan Royal Palace Temple', category: 'Heritage & Culture', url: './ayodhya-ram-mandir-real.jpg', location: 'Ayodhya' }
  ],
  'kashmir': [
    { id: 'kas-10', placeName: 'Dal Lake Royal Shikara & Himalayas', category: 'Lakes & Water', url: './dal-lake-shikara-real.jpg', isDefaultCover: true, location: 'Kashmir' },
    { id: 'kas-11', placeName: 'Dal Lake Houseboat & Mountain Reflection', category: 'Lakes & Water', url: './dal-lake-shikara-real.jpg', location: 'Kashmir' },
    { id: 'kas-12', placeName: 'Gulmarg Gondola & Mount Apharwat Snow', category: 'Peaks & Views', url: './gulmarg-real.jpg', location: 'Gulmarg' },
    { id: 'kas-13', placeName: 'Pahalgam Betaab Valley & Lidder River', category: 'Peaks & Views', url: './pahalgam-real.jpg', location: 'Pahalgam' },
    { id: 'kas-14', placeName: 'Sonamarg Thajiwas Glacier Snow Walk', category: 'Peaks & Views', url: './sonamarg-real.jpg', location: 'Sonamarg' },
    { id: 'kas-15', placeName: 'Srinagar Mughal Gardens (Shalimar & Nishat)', category: 'Gardens & Tea', url: './srinagar-real.jpg', location: 'Srinagar' },
    { id: 'kas-16', placeName: 'Amritsar Golden Temple (Harmandir Sahib)', category: 'Heritage & Culture', url: './golden-temple-real.jpg', location: 'Amritsar' },
    { id: 'kas-17', placeName: 'Wagah Border Beating Retreat Ceremony', category: 'Heritage & Culture', url: './wagah-border-real.jpg', location: 'Amritsar' }
  ],
  'parambikulam': [
    { id: 'pb-1', placeName: 'Parambikulam Tiger Reserve Rainforest', category: 'Wildlife & Safari', url: './parambikulam-forest-real.jpg', isDefaultCover: true, location: 'Parambikulam' },
    { id: 'pb-2', placeName: 'Parambikulam Reservoir Bamboo Rafting', category: 'Lakes & Water', url: './parambikulam-lake-real.jpg', location: 'Parambikulam' },
    { id: 'pb-3', placeName: 'Royal Bengal Tiger & Leopard Safari', category: 'Wildlife & Safari', url: './parambikulam-tiger-real.jpg', location: 'Parambikulam' },
    { id: 'pb-4', placeName: 'Kannimara 450-yr-old Giant Teak Tree', category: 'Gardens & Tea', url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80', location: 'Parambikulam' }
  ],
  'puri': [
    { id: 'puri-1', placeName: 'Shree Jagannath Temple Main Entrance', category: 'Heritage & Culture', url: './puri-jagannath-entrance-real.jpg', isDefaultCover: true, location: 'Puri' },
    { id: 'puri-2', placeName: 'Shree Jagannath 214-ft Sacred Deula Spire', category: 'Heritage & Culture', url: './puri-jagannath-real.jpg', location: 'Puri' },
    { id: 'puri-3', placeName: 'Konark Sun Temple 24 Sundial Chariot Wheels', category: 'Heritage & Culture', url: './konark-sun-temple-real.jpg', location: 'Konark' },
    { id: 'puri-4', placeName: 'Lingaraj Temple 180-ft Stone Tower Bhubaneswar', category: 'Heritage & Culture', url: './lingaraj-temple-real.jpg', location: 'Bhubaneswar' },
    { id: 'puri-5', placeName: 'Puri Blue Flag Golden Beach & Sunset', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', location: 'Puri' },
    { id: 'puri-6', placeName: 'Chilika Lake Irrawaddy Dolphin Sanctuary', category: 'Wildlife & Safari', url: 'https://upload.wikimedia.org/wikipedia/commons/9/94/Birds_eyeview_of_Chilika_Lake.jpg', location: 'Chilika' }
  ],
  'tiruchendur': [
    { id: 'tc-1', placeName: 'Tiruchendur Murugan Seashore Temple Tower', category: 'Heritage & Culture', url: './tiruchendur-murugan-real.jpg', isDefaultCover: true, location: 'Tiruchendur' },
    { id: 'tc-2', placeName: 'Tiruchendur Bay of Bengal Beach Sands', category: 'Lakes & Water', url: './tiruchendur-beach-real.jpg', location: 'Tiruchendur' },
    { id: 'tc-3', placeName: 'Thenkasi Kasi Viswanathar Temple Gopuram', category: 'Heritage & Culture', url: './thenkasi-viswanathar-real.jpg', location: 'Thenkasi' },
    { id: 'tc-4', placeName: 'Courtallam Main Herbal Waterfalls', category: 'Lakes & Water', url: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=1200&q=80', location: 'Courtallam' }
  ],
  'gundlupet': [
    { id: 'gp-1', placeName: 'Gundlupet Golden Sunflower & Marigold Meadows', category: 'Gardens & Tea', url: './gundlupet-sunflowers-real.jpg', isDefaultCover: true, location: 'Gundlupet' },
    { id: 'gp-2', placeName: 'Bandipur Tiger Reserve Jungle Trail', category: 'Wildlife & Safari', url: './parambikulam-forest-real.jpg', location: 'Bandipur' },
    { id: 'gp-3', placeName: 'Himavad Gopalaswamy Betta Misty Summit', category: 'Peaks & Views', url: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Gopalswamy_Betta.jpg', location: 'Gundlupet' }
  ],
  'horanadu': [
    { id: 'hn-1', placeName: 'Annapoorneshwari Temple Golden Shrine', category: 'Heritage & Culture', url: './horanadu-annapoorneshwari-real.jpg', isDefaultCover: true, location: 'Horanadu' },
    { id: 'hn-2', placeName: 'Chikmagalur Western Ghats Green Tea Slopes', category: 'Gardens & Tea', url: './munnar-tea-plantations-real.jpg', location: 'Chikmagalur' },
    { id: 'hn-3', placeName: 'Kalasa Kalaseshwara Ancient Shiva Temple', category: 'Heritage & Culture', url: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Kalaseshwara_Temple%2C_Kalasa.jpg', location: 'Kalasa' }
  ]
};

// Multi-Location & Combo Presets
const MULTI_LOCATION_COMBO_PRESETS = [
  { label: '🌊 Kollam + Munnar (20 Spots)', query: 'Kollam and Munnar' },
  { label: '🌿 Ooty + Kodaikanal (23 Spots)', query: 'Ooty and Kodaikanal' },
  { label: '🌴 Kochi + Kollam (20 Spots)', query: 'Kochi and Kollam' },
  { label: '⛰️ Munnar + Wayanad (14 Spots)', query: 'Munnar and Wayanad' },
  { label: '🛕 Kashi + Ayodhya (9 Spots)', query: 'Kashi and Ayodhya' },
  { label: '❄️ Kashmir + Amritsar', query: 'Kashmir and Amritsar' },
  { label: '🐅 Wayanad + Parambikulam', query: 'Wayanad and Parambikulam' }
];

const SINGLE_LOCATION_PRESETS = [
  { label: '🚣 Kollam (12 Places)', query: 'Kollam' },
  { label: '⛰️ Munnar (8 Places)', query: 'Munnar' },
  { label: '🌴 Kochi (8 Places)', query: 'Kochi' },
  { label: '🌿 Ooty (12 Places)', query: 'Ooty' },
  { label: '🌲 Kodaikanal (11 Places)', query: 'Kodaikanal' },
  { label: '🐅 Wayanad (6 Places)', query: 'Wayanad' },
  { label: '🌊 Athirappilly (4 Places)', query: 'Athirappilly' },
  { label: '🛕 Kashi (5 Places)', query: 'Kashi' },
  { label: '🕉️ Ayodhya (4 Places)', query: 'Ayodhya' },
  { label: '❄️ Kashmir (8 Places)', query: 'Kashmir' },
  { label: '🐘 Parambikulam (4 Places)', query: 'Parambikulam' },
  { label: '🌺 Gundlupet Blooms', query: 'Gundlupet' },
  { label: '🌾 Horanadu Shrine', query: 'Horanadu' },
  { label: '🕉️ Puri Jagannath', query: 'Puri' }
];

// Split input string into distinct location tokens (supports up to 4 locations)

// Common short names / alternate spellings → canonical location keyword
const LOCATION_TOKEN_ALIASES = {
  'varanasi': 'Kashi',
  'prayagraj': 'Kashi',
  'cochin': 'Kochi',
  'ernakulam': 'Kochi',
  'kodai': 'Kodaikanal',
  'quilon': 'Kollam',
  'udhagamandalam': 'Ooty',
  'ootacamund': 'Ooty',
  'gulmarg': 'Kashmir',
  'srinagar': 'Kashmir',
  'pahalgam': 'Kashmir',
  'sonamarg': 'Kashmir',
  'jagannath': 'Puri',
  'konark': 'Puri'
};

export const extractLocationTokens = (inputStr = '') => {
  if (!inputStr || typeof inputStr !== 'string') return ['Kollam', 'Munnar'];
  
  const cleaned = inputStr
    .replace(/\s+and\s+/gi, ',')
    .replace(/\s*&\s*/g, ',')
    .replace(/\s*\+\s*/g, ',')
    .replace(/\s*\/\s*/g, ',');
  
  const rawTokens = cleaned
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length >= 2);

  const KNOWN_DESTS = [
    'kollam', 'munnar', 'ooty', 'kodaikanal', 'kochi', 'cochin', 'wayanad',
    'athirappilly', 'silent valley', 'kashmir', 'kashi', 'ayodhya', 'puri',
    'parambikulam', 'tiruchendur', 'thenkasi', 'gundlupet', 'horanadu', 'amritsar'
  ];

  const results = [];
  rawTokens.forEach(tok => {
    const tLower = tok.toLowerCase();
    const matched = KNOWN_DESTS.filter(k => tLower.includes(k));
    if (matched.length > 0) {
      matched.forEach(m => {
        const formatted = m.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        if (!results.some(r => r.toLowerCase() === formatted.toLowerCase())) {
          results.push(formatted);
        }
      });
    } else {
      const formatted = tok.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      if (!results.some(r => r.toLowerCase() === formatted.toLowerCase())) {
        results.push(formatted);
      }
    }
  });

  const normalized = results.map(r => LOCATION_TOKEN_ALIASES[r.toLowerCase()] || r);
  const finalResults = [];
  normalized.forEach(r => {
    if (!finalResults.some(x => x.toLowerCase() === r.toLowerCase())) finalResults.push(r);
  });

  return finalResults.length ? finalResults.slice(0, 4) : ['Kollam', 'Munnar'];
};

const GENERIC_FALLBACK_IMG = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

// Subject-appropriate fallback when a place photo fails to load
const CATEGORY_FALLBACKS = {
  'Lakes & Water': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
  'Peaks & Views': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
  'Gardens & Tea': 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80',
  'Heritage & Culture': 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
  'Wildlife & Safari': 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80'
};
const fallbackFor = (item) => CATEGORY_FALLBACKS[item.category] || GENERIC_FALLBACK_IMG;

// Fetch real tourist places from Wikipedia (public API, no key needed)
const fetchWikipediaPlaces = async (loc, norm, existingNames = []) => {
  try {
    const wikiRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&generator=search&gsrsearch=${encodeURIComponent(loc + ' tourism attractions')}&gsrlimit=8&prop=pageimages|extracts&piprop=original|thumbnail&pithumbsize=1000&exintro=1&explaintext=1`
    );
    if (!wikiRes.ok) return [];
    const wikiData = await wikiRes.json();
    const pages = wikiData.query?.pages ? Object.values(wikiData.query.pages) : [];
    const NOISE_TITLE = /(tourism in|archeparchy|diocese|district tourism|promotion council|list of|wikipedia|railway station|municipality|archdiocese)/i;
    const existing = new Set(existingNames.map(n => n.toLowerCase()));
    const seen = new Set();
    return pages
      .filter(p => (p.thumbnail?.source || p.original?.source)
        && p.title.toLowerCase().trim() !== norm
        && !NOISE_TITLE.test(p.title)
        && !existing.has(p.title.toLowerCase()))
      .filter(p => {
        const t = p.title.toLowerCase();
        if (seen.has(t)) return false;
        seen.add(t);
        return true;
      })
      .slice(0, 6)
      .map((p, idx) => ({
        id: `wiki-${p.pageid || idx}`,
        placeName: p.title,
        category: 'Heritage & Culture',
        url: p.original?.source || p.thumbnail?.source,
        isDefaultCover: false,
        location: loc.trim(),
        description: p.extract ? p.extract.slice(0, 140) + '...' : `Explore ${p.title} in ${loc.trim()}.`
      }));
  } catch (err) {
    console.warn('Live wiki fetch note:', err);
    return [];
  }
};
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

const fetchRealImage = async (query) => {
  const key = query.toLowerCase().trim();
  if (realImageCache.has(key)) return realImageCache.get(key);
  let url = null;
  if (GOOGLE_IMAGES_ACTIVE) url = await fetchFromGoogleImages(query);
  if (!url) url = await fetchFromWikipedia(query);
  realImageCache.set(key, url);
  return url;
};

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
  locationName = 'Kollam and Munnar',
  sightseeingList = [],
  highlightsList = [],
  coverImageUrl = '',
  mixedBackgroundUrls = [],
  onSelectCoverImage,
  onSelectMixImages,
  onToggleSightseeing,
  onToggleHighlight,
  onBatchAddSightseeing,
  onBatchAddHighlights
}) {
  const initialTokens = extractLocationTokens(locationName);
  const [searchInput, setSearchInput] = useState(locationName || initialTokens.join(', '));
  const [activeLocations, setActiveLocations] = useState(initialTokens);
  const [placesList, setPlacesList] = useState([]);
  const [activeLocationTab, setActiveLocationTab] = useState('All');
  const [activeCategory, setActiveCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [aiGeneratingId, setAiGeneratingId] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [blendStyle, setBlendStyle] = useState('collage-blend');
  const [selectedMixUrls, setSelectedMixUrls] = useState(mixedBackgroundUrls || []);

  useEffect(() => {
    loadMultiLocationPlaces(activeLocations);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync if parent passes a different location string
  useEffect(() => {
    if (!locationName || !locationName.trim()) return;
    const tokens = extractLocationTokens(locationName);
    const same = tokens.length === activeLocations.length && tokens.every((t, i) => t.toLowerCase() === (activeLocations[i] || '').toLowerCase());
    if (!same) {
      setActiveLocations(tokens);
      setSearchInput(locationName);
      loadMultiLocationPlaces(tokens);
    }
  }, [locationName]); // eslint-disable-line react-hooks/exhaustive-deps

  // Load places for all active locations
  const loadMultiLocationPlaces = async (locArray) => {
    setIsLoading(true);
    const locs = Array.isArray(locArray) && locArray.length ? locArray : ['Kollam', 'Munnar'];
    let combined = [];

    for (const loc of locs) {
      const norm = loc.trim().toLowerCase();
      let found = [];

      // Check in LOCATION_PLACE_IMAGES (canonical token → exact key)
      const canonicalToken = (LOCATION_TOKEN_ALIASES[norm] || loc.trim()).toLowerCase();
      const matchedKey = Object.keys(LOCATION_PLACE_IMAGES).find(k => k === canonicalToken);

      if (matchedKey && LOCATION_PLACE_IMAGES[matchedKey]) {
        found = LOCATION_PLACE_IMAGES[matchedKey].map(p => ({
          ...p,
          id: p.id || `${norm}-${Math.random().toString(36).slice(2, 7)}`,
          location: loc.trim(),
          description: `Experience ${p.placeName} in ${loc.trim()}. Guided sightseeing and photo opportunities with OASIS Thrissur.`
        }));

        // Top up with live Wikipedia places when the curated bank is thin
        if (found.length < 4) {
          const wikiPlaces = await fetchWikipediaPlaces(loc, norm, found.map(f => f.placeName));
          if (wikiPlaces.length > 0) {
            found = [...found, ...wikiPlaces];
          }
        }
      } else {
        // Uncurated location: fetch real places from Wikipedia. The fabricated
        // generic attractions (Central Lake, Peak Viewpoint, Rose Gardens) are
        // intentionally NOT used — they mislead package creation.
        const wikiPlaces = await fetchWikipediaPlaces(loc, norm, []);
        found = wikiPlaces.length > 0
          ? wikiPlaces.map((p, i) => ({ ...p, isDefaultCover: i === 0 }))
          : [];
      }

      // Resolve real Wikipedia photos for any "wiki:" placeholders
      if (found.some(p => typeof p.url === 'string' && p.url.startsWith('wiki:'))) {
        found = await enrichWithWikipediaImages(found);
      }

      combined = [...combined, ...found];
    }

    setPlacesList(combined);
    setIsLoading(false);

    // Initial cover if not set
    const firstCover = combined.find(p => p.isDefaultCover)?.url || combined[0]?.url || '';
    if (!coverImageUrl && firstCover && onSelectCoverImage) {
      onSelectCoverImage(firstCover);
    }

    // Set initial multi-location mix
    const initialMix = [];
    locs.forEach(loc => {
      const placeForLoc = combined.find(p => (p.location || '').toLowerCase() === loc.toLowerCase());
      if (placeForLoc?.url && !initialMix.includes(placeForLoc.url)) {
        initialMix.push(placeForLoc.url);
      }
    });
    combined.forEach(p => {
      if (initialMix.length < 4 && p.url && !initialMix.includes(p.url)) {
        initialMix.push(p.url);
      }
    });

    if ((!selectedMixUrls || !selectedMixUrls.length) && initialMix.length) {
      setSelectedMixUrls(initialMix);
      if (onSelectMixImages) onSelectMixImages(initialMix);
    }

    setStatusMsg(combined.length
      ? `✅ Loaded ${combined.length} tourist spots across ${locs.join(' & ')}! Select spots below for Sightseeing & Highlights.`
      : `⚠️ No verified places found for ${locs.join(' & ')}. Try a nearby famous spot, a preset chip, or check your connection.`);
    setTimeout(() => setStatusMsg(''), 4500);
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchInput.trim()) return;
    const tokens = extractLocationTokens(searchInput.trim());
    setActiveLocations(tokens);
    loadMultiLocationPlaces(tokens);
  };

  const handleSelectPreset = (queryStr) => {
    setSearchInput(queryStr);
    const tokens = extractLocationTokens(queryStr);
    setActiveLocations(tokens);
    loadMultiLocationPlaces(tokens);
  };

  const handleRemoveLocation = (locToRemove) => {
    const updated = activeLocations.filter(l => l.toLowerCase() !== locToRemove.toLowerCase());
    if (!updated.length) updated.push('Kollam');
    setActiveLocations(updated);
    setSearchInput(updated.join(', '));
    loadMultiLocationPlaces(updated);
  };

  const handleSetCover = (url, name) => {
    if (onSelectCoverImage) onSelectCoverImage(url);
    setStatusMsg(`✓ Set cover image: "${name || 'Selected Place'}"`);
    setTimeout(() => setStatusMsg(''), 3000);
  };

  const handleToggleMixPlace = (url) => {
    const current = mixedBackgroundUrls?.length ? mixedBackgroundUrls : selectedMixUrls;
    let updated = [];
    if (current.includes(url)) {
      updated = current.filter(u => u !== url);
    } else {
      updated = [...current, url];
    }
    setSelectedMixUrls(updated);
    if (onSelectMixImages) onSelectMixImages(updated);
  };

  const applyEditedImage = (item, newUrl) => {
    const updatedList = placesList.map(p => p.id === item.id ? { ...p, url: newUrl } : p);
    setPlacesList(updatedList);

    if (coverImageUrl === item.url && onSelectCoverImage) {
      onSelectCoverImage(newUrl);
    }
    const currentMix = mixedBackgroundUrls?.length ? mixedBackgroundUrls : selectedMixUrls;
    if (currentMix.includes(item.url)) {
      const updatedMix = currentMix.map(u => u === item.url ? newUrl : u);
      setSelectedMixUrls(updatedMix);
      if (onSelectMixImages) onSelectMixImages(updatedMix);
    }
  };

  const buildPlaceAiPrompt = (item) => {
    const loc = item.location || activeLocations[0] || 'Kerala';
    return `${item.placeName} in ${loc}. Ultra-realistic photorealistic travel photograph of this exact tourist place, stunning natural lighting, sharp detail, high resolution, 4k`;
  };

  const handleGeneratePlaceAi = async (item) => {
    if (aiGeneratingId) return;
    setAiGeneratingId(item.id);
    const searchQuery = `${item.placeName} ${item.location || ''}`;
    setStatusMsg(`🔍 Searching photo for "${item.placeName}"...`);
    try {
      const realUrl = await fetchRealImage(searchQuery);
      if (realUrl) {
        applyEditedImage(item, realUrl);
        setStatusMsg(`📷 Photo found for "${item.placeName}".`);
        setTimeout(() => setStatusMsg(''), 3500);
        return;
      }
    } catch (err) {
      console.warn('Real photo search failed:', err);
    }

    setStatusMsg(`🎨 Generating AI image for "${item.placeName}"...`);
    try {
      const aiUrl = await geminiService.generatePosterImage(buildPlaceAiPrompt(item), 'photorealistic');
      applyEditedImage(item, aiUrl);
      setStatusMsg(`🤖 AI image generated for "${item.placeName}".`);
      setTimeout(() => setStatusMsg(''), 4000);
    } catch (err) {
      console.warn('Place AI generation failed:', err);
      setStatusMsg(`⚠️ Could not generate image for "${item.placeName}". You can upload a photo manually.`);
      setTimeout(() => setStatusMsg(''), 4000);
    } finally {
      setAiGeneratingId(null);
    }
  };

  const handleUploadPlaceImage = (item, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      applyEditedImage(item, reader.result);
      setStatusMsg(`✅ Uploaded photo for "${item.placeName}".`);
      setTimeout(() => setStatusMsg(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateAiImages = async () => {
    if (isGeneratingImages || !placesList.length) return;
    setIsGeneratingImages(true);
    setStatusMsg(`🎨 Generating AI photos for all ${placesList.length} tourist spots across ${activeLocations.join(', ')}...`);

    const generated = [];
    for (let i = 0; i < placesList.length; i++) {
      const place = placesList[i];
      setStatusMsg(`🎨 Generating photo ${i + 1}/${placesList.length}: "${place.placeName}"...`);
      try {
        const aiUrl = await geminiService.generatePosterImage(buildPlaceAiPrompt(place), 'photorealistic');
        generated.push({ ...place, url: aiUrl });
      } catch (err) {
        console.warn(`AI generation failed for "${place.placeName}":`, err);
        generated.push({ ...place });
      }
    }

    setPlacesList(generated);
    if (generated[0]?.url && onSelectCoverImage) onSelectCoverImage(generated[0].url);
    const newMix = generated.slice(0, 4).map(p => p.url);
    setSelectedMixUrls(newMix);
    if (onSelectMixImages) onSelectMixImages(newMix);

    setIsGeneratingImages(false);
    setStatusMsg(`✅ AI-generated photos for ${generated.length} tourist places!`);
    setTimeout(() => setStatusMsg(''), 4500);
  };

  // Filter places by Location Tab and Category
  const availableLocationTabs = ['All', ...activeLocations];
  const placesFilteredByLocation = activeLocationTab === 'All'
    ? placesList
    : placesList.filter(p => (p.location || '').toLowerCase() === activeLocationTab.toLowerCase());

  const categories = ['All', ...new Set(placesFilteredByLocation.map(p => p.category).filter(Boolean))];
  const filteredPlaces = activeCategory === 'All'
    ? placesFilteredByLocation
    : placesFilteredByLocation.filter(p => p.category === activeCategory);

  const activeMix = mixedBackgroundUrls?.length ? mixedBackgroundUrls : selectedMixUrls;

  return (
    <div style={{ background: 'linear-gradient(135deg, rgba(6, 12, 23, 0.95), rgba(12, 24, 48, 0.95))', border: '1px solid var(--border-gold)', borderRadius: '16px', padding: '1.4rem', marginBottom: '1.4rem', boxShadow: '0 12px 30px rgba(0,0,0,0.5)' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--gold-primary)" />
            <h4 style={{ fontSize: '1.05rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--gold-light)', margin: 0 }}>
              Multi-Location Tourist Places &amp; Image Studio
            </h4>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            Enter up to 4 locations (e.g. <strong style={{ color: '#fef08a' }}>Kollam and Munnar</strong>, or <strong style={{ color: '#fef08a' }}>Kollam, Munnar, Kochi, Ooty</strong>). Select spots directly into Sightseeing &amp; Highlights!
          </p>
        </div>

        {/* Global Action Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-gold"
            onClick={handleGenerateAiImages}
            disabled={isGeneratingImages}
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.78rem', gap: '0.35rem', fontWeight: 800, background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', opacity: isGeneratingImages ? 0.7 : 1 }}
          >
            {isGeneratingImages ? <RefreshCw size={13} className="spin" /> : <ImageIcon size={13} />}
            {isGeneratingImages ? 'Generating Photos...' : '✨ AI Generate Photos'}
          </button>
        </div>
      </div>

      {/* Multi-Location Search Bar */}
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
                handleSearchSubmit(e);
              }
            }}
            placeholder="Type multiple locations: e.g. Kollam and Munnar, or Kollam, Munnar, Kochi, Ooty..."
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
          onClick={handleSearchSubmit}
          className="btn-gold"
          style={{ padding: '0.65rem 1.2rem', fontSize: '0.82rem', gap: '0.4rem', fontWeight: 800 }}
        >
          {isLoading ? <RefreshCw size={15} className="spin" /> : <Compass size={15} />}
          Load Places &amp; Photos
        </button>
      </div>

      {/* Active Locations Badges */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.9rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.74rem', color: 'var(--gold-light)', fontWeight: 800 }}>Active Locations:</span>
        {activeLocations.map((loc, lIdx) => (
          <span
            key={lIdx}
            style={{
              background: 'rgba(212,175,55,0.18)',
              border: '1px solid var(--gold-primary)',
              color: '#fef08a',
              padding: '0.25rem 0.65rem',
              borderRadius: '20px',
              fontSize: '0.78rem',
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem'
            }}
          >
            📍 {loc}
            {activeLocations.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveLocation(loc)}
                style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.8rem', cursor: 'pointer', padding: 0, lineHeight: 1 }}
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Multi-Location Combo Presets Chips */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.6rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
          Popular Combos:
        </span>
        {MULTI_LOCATION_COMBO_PRESETS.map(chip => (
          <button
            key={chip.query}
            type="button"
            onClick={() => handleSelectPreset(chip.query)}
            style={{
              background: 'rgba(139,92,246,0.12)',
              color: '#c4b5fd',
              border: '1px solid rgba(139,92,246,0.35)',
              borderRadius: '16px',
              padding: '0.22rem 0.65rem',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Single Location Chips */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
          Single Destinations:
        </span>
        {SINGLE_LOCATION_PRESETS.slice(0, 10).map(chip => (
          <button
            key={chip.query}
            type="button"
            onClick={() => handleSelectPreset(chip.query)}
            style={{
              background: 'rgba(255,255,255,0.04)',
              color: 'var(--text-muted)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '14px',
              padding: '0.2rem 0.55rem',
              fontSize: '0.7rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {statusMsg && (
        <div style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid #10b981', color: '#10b981', padding: '0.5rem 0.9rem', borderRadius: '10px', fontSize: '0.82rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <CheckCircle2 size={16} /> {statusMsg}
        </div>
      )}

      {/* Batch Select Toolbar into Sightseeing & Highlights */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(245,158,11,0.3)',
        borderRadius: '12px',
        padding: '0.75rem 1rem',
        marginBottom: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.8rem'
      }}>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <button
            type="button"
            className="btn-gold"
            onClick={() => onBatchAddSightseeing && onBatchAddSightseeing(filteredPlaces)}
            style={{
              padding: '0.42rem 0.85rem',
              fontSize: '0.76rem',
              gap: '0.35rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              color: '#000',
              fontWeight: 800
            }}
          >
            <Plus size={13} /> + Add All {filteredPlaces.length} Spots to Sightseeing
          </button>

          <button
            type="button"
            className="btn-gold"
            onClick={() => onBatchAddHighlights && onBatchAddHighlights(filteredPlaces)}
            style={{
              padding: '0.42rem 0.85rem',
              fontSize: '0.76rem',
              gap: '0.35rem',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              color: '#000',
              fontWeight: 800
            }}
          >
            <Sparkles size={13} /> + Add All {filteredPlaces.length} Spots to Highlights
          </button>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          <span>Sightseeing: <strong style={{ color: '#10b981' }}>{(sightseeingList || []).length} added</strong></span>
          <span>•</span>
          <span>Highlights: <strong style={{ color: '#f59e0b' }}>{(highlightsList || []).length} added</strong></span>
        </div>
      </div>

      {/* Location Tabs Filter */}
      {availableLocationTabs.length > 2 && (
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.8rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--gold-light)', fontWeight: 800 }}>Filter by Location:</span>
          {availableLocationTabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveLocationTab(tab)}
              style={{
                background: activeLocationTab === tab ? 'var(--gold-primary)' : 'rgba(255,255,255,0.06)',
                color: activeLocationTab === tab ? '#000' : 'var(--text-muted)',
                border: activeLocationTab === tab ? '1px solid var(--gold-primary)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '16px',
                padding: '0.22rem 0.7rem',
                fontSize: '0.74rem',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {tab === 'All' ? `All Locations (${placesList.length})` : `📍 ${tab} (${placesList.filter(p => (p.location || '').toLowerCase() === tab.toLowerCase()).length})`}
            </button>
          ))}
        </div>
      )}

      {/* Category Tabs Filter */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gold-light)' }}>
          Tourist Attractions ({filteredPlaces.length} Spots Available):
        </div>

        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.04)',
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

      {/* PLACES GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(195px, 1fr))', gap: '0.8rem', maxHeight: '420px', overflowY: 'auto', paddingRight: '0.3rem' }}>
        {filteredPlaces.map((item, idx) => {
          const isCover = coverImageUrl === item.url;
          const inMix = activeMix.includes(item.url);
          const isSightseeingAdded = (sightseeingList || []).some(s => (s.name || '').toLowerCase() === item.placeName.toLowerCase());
          const isHighlightAdded = (highlightsList || []).some(h => (h.title || '').toLowerCase() === item.placeName.toLowerCase());

          return (
            <div
              key={item.id || idx}
              style={{
                background: isCover 
                  ? 'rgba(245,158,11,0.12)' 
                  : isSightseeingAdded || isHighlightAdded 
                    ? 'rgba(16,185,129,0.08)' 
                    : 'rgba(255,255,255,0.03)',
                border: isCover 
                  ? '2px solid var(--gold-primary)' 
                  : isSightseeingAdded 
                    ? '1.5px solid rgba(16,185,129,0.6)' 
                    : inMix 
                      ? '1.5px solid rgba(139,92,246,0.7)' 
                      : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px',
                overflow: 'hidden',
                padding: '0.55rem',
                transition: 'all 0.2s ease',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Thumbnail + Badges */}
              <div style={{ position: 'relative', height: '110px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.45rem' }}>
                <img
                  src={item.url}
                  alt={item.placeName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    const fb = fallbackFor(item);
                    if (e.target.src !== fb) e.target.src = fb;
                  }}
                />
                <span style={{ position: 'absolute', top: '0.3rem', left: '0.3rem', background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '8px' }}>
                  #{idx + 1}
                </span>

                {/* Location Badge */}
                {item.location && (
                  <span style={{ position: 'absolute', bottom: '0.3rem', left: '0.3rem', background: 'rgba(9,20,38,0.88)', color: '#fef08a', fontSize: '0.62rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '8px', border: '1px solid rgba(245,158,11,0.4)' }}>
                    📍 {item.location}
                  </span>
                )}

                <div style={{ position: 'absolute', top: '0.3rem', right: '0.3rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', alignItems: 'flex-end' }}>
                  {isCover && (
                    <span style={{ background: '#f59e0b', color: '#000', fontSize: '0.58rem', fontWeight: 900, padding: '0.1rem 0.4rem', borderRadius: '6px' }}>
                      COVER
                    </span>
                  )}
                  {inMix && !isCover && (
                    <span style={{ background: '#8b5cf6', color: '#fff', fontSize: '0.58rem', fontWeight: 800, padding: '0.1rem 0.4rem', borderRadius: '6px' }}>
                      MIX
                    </span>
                  )}
                  {isSightseeingAdded && (
                    <span style={{ background: '#10b981', color: '#000', fontSize: '0.58rem', fontWeight: 900, padding: '0.1rem 0.4rem', borderRadius: '6px' }}>
                      ✓ SIGHTSEEING
                    </span>
                  )}
                  {isHighlightAdded && (
                    <span style={{ background: '#eab308', color: '#000', fontSize: '0.58rem', fontWeight: 900, padding: '0.1rem 0.4rem', borderRadius: '6px' }}>
                      ✓ HIGHLIGHT
                    </span>
                  )}
                </div>
              </div>

              {/* Place Name & Category */}
              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#fff', lineHeight: '1.25', marginBottom: '0.2rem' }}>
                {item.placeName}
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: '0.55rem', marginTop: 'auto' }}>
                {item.category} {item.location ? `• ${item.location}` : ''}
              </div>

              {/* Action Row 1: Add to Sightseeing & Add to Highlights */}
              <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => onToggleSightseeing && onToggleSightseeing(item)}
                  style={{
                    flex: 1, padding: '0.32rem 0.35rem', borderRadius: '7px',
                    border: isSightseeingAdded ? '1px solid #10b981' : '1px solid rgba(16,185,129,0.35)',
                    background: isSightseeingAdded ? 'rgba(16,185,129,0.28)' : 'rgba(16,185,129,0.1)',
                    color: isSightseeingAdded ? '#6ee7b7' : '#a7f3d0',
                    fontSize: '0.67rem', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem',
                    transition: 'all 0.15s ease'
                  }}
                  title="Add this place into package Sightseeing with photo & description"
                >
                  {isSightseeingAdded ? <Check size={11} /> : <Plus size={11} />}
                  {isSightseeingAdded ? 'Sightseeing ✓' : '+ Sightseeing'}
                </button>

                <button
                  type="button"
                  onClick={() => onToggleHighlight && onToggleHighlight(item)}
                  style={{
                    flex: 1, padding: '0.32rem 0.35rem', borderRadius: '7px',
                    border: isHighlightAdded ? '1px solid #f59e0b' : '1px solid rgba(245,158,11,0.35)',
                    background: isHighlightAdded ? 'rgba(245,158,11,0.28)' : 'rgba(245,158,11,0.1)',
                    color: isHighlightAdded ? '#fef08a' : 'var(--gold-light)',
                    fontSize: '0.67rem', fontWeight: 800, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem',
                    transition: 'all 0.15s ease'
                  }}
                  title="Add this place into package Highlights cards"
                >
                  {isHighlightAdded ? <Check size={11} /> : <Sparkles size={11} />}
                  {isHighlightAdded ? 'Highlight ✓' : '+ Highlight'}
                </button>
              </div>

              {/* Action Row 2: Set Cover & Mix */}
              <div style={{ display: 'flex', gap: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => handleSetCover(item.url, item.placeName)}
                  style={{
                    flex: 1, padding: '0.28rem 0.35rem', borderRadius: '7px', border: 'none',
                    background: isCover ? '#f59e0b' : 'rgba(255,255,255,0.08)',
                    color: isCover ? '#000' : 'var(--gold-light)',
                    fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer'
                  }}
                >
                  {isCover ? '✓ Cover' : 'Set Cover'}
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleMixPlace(item.url)}
                  style={{
                    flex: 1, padding: '0.28rem 0.35rem', borderRadius: '7px', border: 'none',
                    background: inMix ? '#8b5cf6' : 'rgba(255,255,255,0.08)',
                    color: '#fff', fontSize: '0.64rem', fontWeight: 800, cursor: 'pointer'
                  }}
                >
                  {inMix ? '✓ Mix' : '+ Mix'}
                </button>
              </div>

              {/* Action Row 3: AI Image / Upload */}
              <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.35rem' }}>
                <button
                  type="button"
                  onClick={() => handleGeneratePlaceAi(item)}
                  disabled={Boolean(aiGeneratingId)}
                  style={{
                    flex: 1, padding: '0.28rem 0.35rem', borderRadius: '7px',
                    border: '1px solid rgba(139,92,246,0.5)',
                    background: aiGeneratingId === item.id ? 'rgba(139,92,246,0.35)' : 'rgba(139,92,246,0.15)',
                    color: '#c4b5fd', fontSize: '0.64rem', fontWeight: 800,
                    cursor: aiGeneratingId ? 'wait' : 'pointer'
                  }}
                >
                  {aiGeneratingId === item.id ? <RefreshCw size={10} className="spin" /> : <Sparkles size={10} />}
                  {' '}{aiGeneratingId === item.id ? 'Generating...' : '🤖 AI Image'}
                </button>

                <label
                  style={{
                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2rem',
                    padding: '0.28rem 0.35rem', borderRadius: '7px',
                    border: '1px solid rgba(52,211,153,0.5)',
                    background: 'rgba(16,185,129,0.15)', color: '#6ee7b7', fontSize: '0.64rem', fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <Upload size={10} /> 📤 Upload
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
