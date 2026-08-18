// Gemini AI Service for OASIS India Thrissur
// Generates slogans and poster images using Google Gemini API

import { storageService, firestoreService, isFirebaseConnected } from './firebase';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';

export const geminiService = {
  // Generate AI slogans for travel posters
  async generateSlogans(destination = 'Kerala', count = 5) {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured. Set VITE_GEMINI_API_KEY in .env');
    }

    const prompt = `Generate ${count} catchy, short travel poster slogans for OASIS India Thrissur travel agency specializing in ${destination} tours. 
    Each slogan should be:
    - Maximum 8-10 words
    - Evocative and inspiring
    - Suitable for a luxury travel poster
    - Focus on the beauty, spirituality, or adventure of the destination
    
    Return ONLY a JSON array of strings, no other text. Example format:
    ["Slogan 1", "Slogan 2", "Slogan 3"]`;

    try {
      const response = await fetch(
        `${GEMINI_BASE_URL}/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.9,
              maxOutputTokens: 200
            }
          })
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to generate slogans');
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Extract JSON array from response
      const match = text.match(/\[[\s\S]*?\]/);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw new Error('Could not parse slogan response');
    } catch (error) {
      console.error('Slogan generation error:', error);
      throw error;
    }
  },

  // Generate AI scenic travel image with multi-tier AI synthesis & Firebase Storage auto-upload
  async generatePosterImage(prompt, style = 'photorealistic') {
    const cleanPrompt = (prompt || 'Scenic Nepal Himalaya').replace(/[^\w\s,.-]/gi, ' ').trim();
    
    // Tier 1: Gemini API generation if key is present
    if (GEMINI_API_KEY) {
      try {
        const fullPrompt = `Photorealistic stunning scenic travel photograph of ${cleanPrompt}, ultra high resolution, golden hour lighting, cinematic travel photography for luxury tour agency.`;
        const response = await fetch(
          `${GEMINI_BASE_URL}/models/gemini-2.0-flash-exp:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: fullPrompt }] }],
              generationConfig: {
                responseModalities: ['TEXT', 'IMAGE'],
                temperature: 0.8
              }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const parts = data.candidates?.[0]?.content?.parts || [];
          for (const part of parts) {
            if (part.inlineData?.data) {
              const base64Str = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
              if (storageService.isConfigured()) {
                const uploaded = await storageService.uploadBase64(base64Str, `ai_${Date.now()}.png`, 'sightseeing');
                return uploaded?.url || base64Str;
              }
              return base64Str;
            }
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini image generation note, falling back to AI synthesis engine:', geminiErr.message);
      }
    }

    // Tier 2: Real-time High-Resolution AI Image Synthesis (Pollinations AI Engine)
    try {
      const aiPrompt = encodeURIComponent(`stunning photorealistic travel photograph of ${cleanPrompt}, 8k resolution, cinematic golden hour lighting, sharp focus, award winning travel photography`);
      const aiImageUrl = `https://image.pollinations.ai/prompt/${aiPrompt}?width=1200&height=800&nologo=true&enhance=true&seed=${Math.floor(Math.random() * 999999)}`;
      
      // Upload AI image to Firebase Cloud Storage for permanent hosting
      if (storageService.isConfigured()) {
        try {
          const blobRes = await fetch(aiImageUrl);
          if (blobRes.ok) {
            const blob = await blobRes.blob();
            const uploaded = await storageService.uploadFile(blob, 'sightseeing');
            if (uploaded?.url) return uploaded.url;
          }
        } catch (uploadErr) {
          console.warn('Direct AI URL will be used:', uploadErr.message);
        }
      }
      return aiImageUrl;
    } catch (tier2Err) {
      console.warn('AI image generator tier 2 fallback:', tier2Err);
      return `https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80`;
    }
  },

  // Generate multiple poster images in sequence
  async generateMultiplePosters(prompts, style = 'photorealistic', onProgress = null) {
    const results = [];
    for (let i = 0; i < prompts.length; i++) {
      try {
        if (onProgress) onProgress(i + 1, prompts.length, 'generating');
        const imageUrl = await this.generatePosterImage(prompts[i], style);
        results.push({ 
          id: `poster-${Date.now()}-${i}`,
          prompt: prompts[i],
          imageUrl,
          createdAt: new Date().toISOString()
        });
        if (onProgress) onProgress(i + 1, prompts.length, 'done');
      } catch (error) {
        console.error(`Failed to generate poster ${i + 1}:`, error);
        if (onProgress) onProgress(i + 1, prompts.length, 'error');
        results.push({
          id: `poster-${Date.now()}-${i}`,
          prompt: prompts[i],
          imageUrl: null,
          error: error.message,
          createdAt: new Date().toISOString()
        });
      }
    }
    return results;
  }
};

// Poster storage helpers (localStorage)
const POSTERS_KEY = 'oasis_ai_posters';

const DEFAULT_POSTERS = [
  {
    id: 'ai-poster-athirappilly',
    slogan: 'Athirappilly Waterfalls: The Niagara of India Rainforest Expedition',
    prompt: 'Breathtaking 4K HDR luxury travel photograph of Athirappilly Waterfalls Kerala, 80-foot high roaring waterfall cascading down cliff',
    style: 'cinematic',
    imageUrl: './athirappilly_waterfall_main_ai.png',
    createdAt: '2026-08-07T10:20:00.000Z'
  },
  {
    id: 'ai-poster-silent-valley',
    slogan: 'Silent Valley Rainforest & Kunthi River Expedition',
    prompt: 'Cinematic 4K luxury travel photograph of Silent Valley National Park Kerala, pristine ancient tropical rainforest',
    style: 'cinematic',
    imageUrl: './silent_valley_rainforest_ai.png',
    createdAt: '2026-08-07T10:15:00.000Z'
  },
  {
    id: 'ai-poster-kashi',
    slogan: 'Kashi Vishwanath & Ganga Aarti Sacred Yatra',
    prompt: 'Cinematic 4K luxury travel poster of Kashi Vishwanath Temple and Varanasi Ganga Aarti at golden hour sunset',
    style: 'cinematic',
    imageUrl: './kashi_yatra_ai.png',
    createdAt: '2026-08-07T10:00:00.000Z'
  },
  {
    id: 'ai-poster-kashmir',
    slogan: 'Heaven on Earth: Kashmir Dal Lake & Himalayan Retreat',
    prompt: 'Breathtaking 4K HDR luxury travel banner of Dal Lake Srinagar Kashmir with traditional Shikara boat',
    style: 'photorealistic',
    imageUrl: './kashmir_paradise_ai.png',
    createdAt: '2026-08-07T10:05:00.000Z'
  },
  {
    id: 'ai-poster-ayodhya',
    slogan: 'Shri Ram Janmabhoomi Ayodhya Heritage & Saryu Aarti',
    prompt: 'Grand 4K cinematic luxury travel poster of Shri Ram Janmabhoomi temple in Ayodhya at twilight',
    style: 'cinematic',
    imageUrl: './ayodhya_ram_mandir_ai.png',
    createdAt: '2026-08-07T10:10:00.000Z'
  }
];

export const posterStorage = {
  getPosters() {
    try {
      const saved = localStorage.getItem(POSTERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return DEFAULT_POSTERS;
    } catch {
      return DEFAULT_POSTERS;
    }
  },

  savePosters(posters) {
    try {
      localStorage.setItem(POSTERS_KEY, JSON.stringify(posters));
      if (isFirebaseConnected()) {
        firestoreService.syncCatalogToCloud('posters', posters);
      }
    } catch (e) {
      console.error('Failed to save posters:', e);
    }
  },

  addPoster(poster) {
    const posters = this.getPosters();
    posters.unshift(poster);
    this.savePosters(posters);
    return posters;
  },

  deletePoster(id) {
    const posters = this.getPosters().filter(p => p.id !== id);
    this.savePosters(posters);
    if (isFirebaseConnected()) {
      firestoreService.deleteCatalogItem('posters', id);
    }
    return posters;
  },

  updatePoster(id, updates) {
    const posters = this.getPosters().map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    this.savePosters(posters);
    return posters;
  }
};
