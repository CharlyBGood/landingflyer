import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export async function getPexelsImageUrl(term) {
  const PEXELS_API_KEY = process.env.PEXELS_API_KEY;
  if (!PEXELS_API_KEY) {
    throw new Error('PEXELS_API_KEY is not set in environment variables');
  }

  const cacheKey = `pexels:${term}`;
  const cachedImageUrl = cache.get(cacheKey);

  if (cachedImageUrl) {
    return cachedImageUrl;
  }

  const url = 'https://api.pexels.com/v1/search';
  try {
    const response = await axios.get(url, {
      params: {
        query: term,
        per_page: 1,
        orientation: 'landscape',
      },
      headers: {
        Authorization: PEXELS_API_KEY,
      },
    });
    const results = response.data.photos;
    if (results && results.length > 0) {
      const imageUrl = results[0].src.medium;
      cache.set(cacheKey, imageUrl);
      return imageUrl;
    } else {
      // Fallback: Pexels default image (or you can use your own placeholder)
      return 'https://www.pexels.com/photo/1108099/download/'; // Replace with a valid Pexels image URL
    }
  } catch (error) {
    console.error('Pexels API error:', error.message);
    throw error;
  }
}
