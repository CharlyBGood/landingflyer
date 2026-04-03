const FALLBACK_IMAGE = 'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800';

export async function getPexelsImageUrl(
  term: string,
  apiKey: string,
  cache?: KVNamespace
): Promise<string> {
  // Check KV cache first
  if (cache) {
    const cached = await cache.get(`pexels:${term}`);
    if (cached) return cached;
  }

  const params = new URLSearchParams({
    query: term,
    per_page: '1',
    orientation: 'landscape',
  });

  const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
    headers: { Authorization: apiKey },
  });

  if (!response.ok) {
    throw new Error(`Pexels API error: ${response.status}`);
  }

  const data = await response.json<{ photos: Array<{ src: { medium: string } }> }>();

  const imageUrl = data.photos?.[0]?.src?.medium ?? FALLBACK_IMAGE;

  // Cache for 1 hour
  if (cache) {
    await cache.put(`pexels:${term}`, imageUrl, { expirationTtl: 3600 });
  }

  return imageUrl;
}
