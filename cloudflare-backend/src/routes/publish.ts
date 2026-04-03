import { Hono } from 'hono';
import type { Env, PublishRequest } from '../types.js';
import { processImagesAndReplaceSrc } from '../services/html-processor.js';
import { extractTitleFromHTML, generateSiteName, deployToNetlify } from '../services/netlify.js';

const publish = new Hono<{ Bindings: Env }>();

/**
 * POST /api/publish
 * Body: { htmlContent: string, siteName: string }
 * Rehosts images to Cloudinary, then deploys to Netlify.
 */
publish.post('/', async (c) => {
  try {
    const body = await c.req.json<PublishRequest>();

    if (!body.htmlContent || !body.siteName) {
      return c.json({ error: 'Se requiere htmlContent y siteName' }, 400);
    }

    // Rehost images to Cloudinary
    const htmlWithCloudinary = await processImagesAndReplaceSrc(
      body.htmlContent,
      body.siteName,
      c.env
    );

    // Generate site name
    const htmlTitle = extractTitleFromHTML(htmlWithCloudinary);
    const titleForURL = htmlTitle || body.siteName;
    const validSiteName = generateSiteName(titleForURL);

    // Deploy to Netlify
    const result = await deployToNetlify(validSiteName, htmlWithCloudinary, c.env.NETLIFY_API_TOKEN);

    return c.json({
      success: true,
      url: result.url,
      siteName: result.siteName,
      siteId: result.siteId,
    });
  } catch (error) {
    console.error('Error publicando sitio:', error);
    return c.json({
      error: 'Error al publicar el sitio',
      details: (error as Error).message,
    }, 500);
  }
});

export default publish;
