import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

export async function getUnsplashImageUrl(term) {
  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error('UNSPLASH_ACCESS_KEY is not set in environment variables');
  }

  const cacheKey = `unsplash:${term}`;
  const cachedImageUrl = cache.get(cacheKey);

  if (cachedImageUrl) {
    return cachedImageUrl;
  }

  const url = 'https://api.unsplash.com/search/photos';
  try {
    const response = await axios.get(url, {
      params: {
        query: term,
        per_page: 1,
        orientation: 'landscape',
        content_filter: 'high',
      },
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });
    const results = response.data.results;
    if (results && results.length > 0) {
      const imageUrl = results[0].urls.small;
      cache.set(cacheKey, imageUrl);
      return imageUrl;
    } else {
      // Fallback: Unsplash default image (or you can use your own placeholder)
      return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
    }
  } catch (error) {
    console.error('Unsplash API error:', error.message);
    throw error;
  }
}
