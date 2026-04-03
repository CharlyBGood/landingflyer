const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80';

export async function getUnsplashImageUrl(
  term: string,
  accessKey: string,
  cache?: KVNamespace
): Promise<string> {
  // Check KV cache first
  if (cache) {
    const cached = await cache.get(`unsplash:${term}`);
    if (cached) return cached;
  }

  const params = new URLSearchParams({
    query: term,
    per_page: '1',
    orientation: 'landscape',
    content_filter: 'high',
  });

  const response = await fetch(`https://api.unsplash.com/search/photos?${params}`, {
    headers: { Authorization: `Client-ID ${accessKey}` },
  });

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status}`);
  }

  const data = await response.json<{ results: Array<{ urls: { small: string } }> }>();

  const imageUrl = data.results?.[0]?.urls?.small ?? FALLBACK_IMAGE;

  // Cache for 1 hour
  if (cache) {
    await cache.put(`unsplash:${term}`, imageUrl, { expirationTtl: 3600 });
  }

  return imageUrl;
}
