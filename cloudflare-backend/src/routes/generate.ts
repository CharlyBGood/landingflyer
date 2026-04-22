import { Hono } from 'hono';
import type { Env, BusinessData } from '../types.js';
import { generateWithGemini } from '../services/gemini.js';
import { processImagesAndReplaceSrc } from '../services/html-processor.js';

const generate = new Hono<{ Bindings: Env }>();

/**
 * POST /api/generate-preview
 * Accepts multipart/form-data with either:
 * - flyerImage / businessImage (image file)
 * - businessData (JSON string)
 * Returns: { generatedHtml: string }
 */
generate.post('/', async (c) => {
  try {
    const formData = await c.req.formData();

    // Parse businessData if present
    const businessDataRaw = formData.get('businessData') as string | null;
    let businessData: BusinessData | null = null;
    if (businessDataRaw) {
      try {
        businessData = JSON.parse(businessDataRaw);
      } catch {
        return c.json({ error: 'businessData inválido (JSON malformado)' }, 400);
      }
    }

    // Get image file (prioritize businessImage, fallback to flyerImage)
    const formImage = formData.get('businessImage') as File | null;
    const flyerImage = formData.get('flyerImage') as File | null;
    const file = formImage || flyerImage;

    // Must have at least one input
    if (!businessData && !file) {
      return c.json({ error: 'Debes subir una imagen o proporcionar datos del negocio.' }, 400);
    }

    // Prepare image buffer if present
    let imageBuffer: ArrayBuffer | undefined;
    let imageMimeType: string | undefined;
    if (file) {
      imageBuffer = await file.arrayBuffer();
      imageMimeType = file.type;
    }

    // Generate HTML with Gemini (with fallback chain)
    const primaryModel = c.env.GEMINI_MODEL || 'gemini-2.0-flash-001';
    const fallbacks = [c.env.GEMINI_FALLBACK1, c.env.GEMINI_FALLBACK2].filter(
      (m): m is string => Boolean(m)
    );
    const { html, modelUsed } = await generateWithGemini(
      c.env.GEMINI_API_KEY,
      primaryModel,
      {
        imageBuffer,
        imageMimeType,
        businessData: businessData ?? undefined,
      },
      fallbacks
    );
    console.log(`[generate-preview] modelo usado: ${modelUsed}`);
    let generatedHtml = html;

    // Adjust image URLs for preview mode
    try {
      const siteNameForPreview = businessData?.businessName?.trim() || 'preview';
      const url = new URL(c.req.url);
      const baseUrl = `${url.protocol}//${url.host}`;

      generatedHtml = await processImagesAndReplaceSrc(generatedHtml, siteNameForPreview, c.env, {
        mode: 'preview',
        baseImageUrl: baseUrl,
      });
    } catch (e) {
      console.warn('Preview image URL adjustment skipped:', (e as Error).message);
    }

    return c.json({ generatedHtml });
  } catch (error) {
    console.error('Error en el proceso de IA con Gemini:', error);
    return c.json({
      error: 'Error al generar la vista previa con IA.',
      details: (error as Error).message,
    }, 500);
  }
});

export default generate;
