import { Hono } from 'hono';
import type { Env } from '../types.js';
import { getUnsplashImageUrl } from '../services/unsplash.js';
import { getPexelsImageUrl } from '../services/pexels.js';

const image = new Hono<{ Bindings: Env }>();

/**
 * GET /api/image/unsplash?term=...
 * Proxy: fetches an image from Unsplash (fallback to Pexels) and streams it.
 */
image.get('/unsplash', async (c) => {
  const term = c.req.query('term');
  if (!term) {
    return c.json({ error: 'Falta el parámetro term' }, 400);
  }

  try {
    let imageUrl: string;

    try {
      imageUrl = await getUnsplashImageUrl(term, c.env.UNSPLASH_ACCESS_KEY, c.env.IMAGE_CACHE);
    } catch (unsplashError) {
      console.error('Unsplash failed, trying Pexels:', (unsplashError as Error).message);
      try {
        imageUrl = await getPexelsImageUrl(term, c.env.PEXELS_API_KEY, c.env.IMAGE_CACHE);
      } catch (pexelsError) {
        return c.json({
          error: 'No se pudo obtener imagen ni de Unsplash ni de Pexels',
          details: (unsplashError as Error).message,
        }, 500);
      }
    }

    // Fetch and stream the image
    const response = await fetch(imageUrl);
    if (!response.ok) {
      return c.json({ error: 'Error al descargar la imagen' }, 500);
    }

    return new Response(response.body, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error general al obtener la imagen:', error);
    return c.json({ error: 'Error al obtener la imagen', details: (error as Error).message }, 500);
  }
});

export default image;
