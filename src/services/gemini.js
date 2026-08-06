// Gemini AI Service for OASIS India Thrissur
// Generates slogans and poster images using Google Gemini API

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

  // Generate AI poster image using Gemini's image generation
  async generatePosterImage(prompt, style = 'photorealistic') {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured. Set VITE_GEMINI_API_KEY in .env');
    }

    const styleMap = {
      'photorealistic': 'Create a stunning photorealistic travel poster photograph',
      'artistic': 'Create an artistic, vibrant travel poster illustration',
      'cinematic': 'Create a cinematic, dramatic travel poster scene'
    };

    const fullPrompt = `${styleMap[style] || styleMap.photorealistic} for a luxury travel agency. The scene should depict: ${prompt}. 
    Make it visually stunning with rich colors, golden hour lighting, and a sense of luxury and wonder. 
    The image should be suitable for a travel agency hero banner.`;

    try {
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

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || 'Failed to generate image');
      }

      const data = await response.json();
      const parts = data.candidates?.[0]?.content?.parts || [];
      
      // Find the image part
      for (const part of parts) {
        if (part.inlineData?.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      
      throw new Error('No image was generated in the response');
    } catch (error) {
      console.error('Image generation error:', error);
      throw error;
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

export const posterStorage = {
  getPosters() {
    try {
      const saved = localStorage.getItem(POSTERS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  },

  savePosters(posters) {
    try {
      localStorage.setItem(POSTERS_KEY, JSON.stringify(posters));
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
