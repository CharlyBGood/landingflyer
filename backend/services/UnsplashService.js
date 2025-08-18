import axios from 'axios';

export async function getUnsplashImageUrl(term) {
  const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
  if (!UNSPLASH_ACCESS_KEY) {
    throw new Error('UNSPLASH_ACCESS_KEY is not set in environment variables');
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
      // Prefer regular size, fallback to small
      return results[0].urls.regular || results[0].urls.small;
    } else {
      // Fallback: Unsplash default image (or you can use your own placeholder)
      return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
    }
  } catch (error) {
    console.error('Unsplash API error:', error.message);
    // Fallback: Unsplash default image
    return 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';
  }
}
