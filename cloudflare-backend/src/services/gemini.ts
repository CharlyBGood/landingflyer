import { arrayBufferToBase64 } from '../utils/helpers.js';
import { LANDING_PAGE_PROMPT } from '../prompt.js';
import type { BusinessData } from '../types.js';

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

interface GenerateOptions {
  imageBuffer?: ArrayBuffer;
  imageMimeType?: string;
  businessData?: BusinessData;
}

interface GenerateResult {
  html: string;
  modelUsed: string;
}

/** Gemma models don't support vision — skip them when an image is present. */
function modelSupportsVision(model: string): boolean {
  return !/^gemma/i.test(model);
}

/** Retryable = quota, rate limit, or server-side transient errors. */
function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

async function callGemini(
  apiKey: string,
  model: string,
  parts: GeminiPart[]
): Promise<{ ok: true; text: string } | { ok: false; status: number; body: string }> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ role: 'user', parts }] }),
    }
  );

  if (!response.ok) {
    const body = await response.text();
    return { ok: false, status: response.status, body };
  }

  const data = await response.json<{
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  }>();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  return { ok: true, text };
}

function buildParts(options: GenerateOptions): GeminiPart[] {
  const parts: GeminiPart[] = [{ text: LANDING_PAGE_PROMPT }];

  if (options.businessData) {
    const bd = options.businessData;
    const services = Array.isArray(bd.services)
      ? bd.services.map(s => `- ${s.name}: ${s.description} ${s.price ? '($' + s.price + ')' : ''}`).join('\n')
      : '- No especificado';

    parts.push({
      text: `
**DATOS COMERCIALES ESTRUCTURADOS:**

**Información Básica:**
- Nombre del Negocio: ${bd.businessName}
- Tipo de Negocio: ${bd.businessType}
- Descripción: ${bd.description}
- Estilo Preferido: ${bd.style || 'moderno'}

**Colores Definidos:**
- Color Principal: ${bd.primaryColor}
- Color Secundario: ${bd.secondaryColor || bd.primaryColor}

**Información de Contacto:**
- Teléfono: ${bd.contact?.phone || 'No especificado'}
- Email: ${bd.contact?.email || 'No especificado'}
- Dirección: ${bd.contact?.address || 'No especificado'}
- Website: ${bd.contact?.website || 'No especificado'}

**Productos/Servicios:**
${services}

**INSTRUCCIONES ESPECIALES:**
Usa EXACTAMENTE estos colores como base de la paleta. Convierte automáticamente el teléfono a WhatsApp y la dirección a Google Maps si están especificados.`,
    });
  }

  if (options.imageBuffer && options.imageMimeType) {
    parts.push({
      inlineData: {
        mimeType: options.imageMimeType,
        data: arrayBufferToBase64(options.imageBuffer),
      },
    });
  }

  return parts;
}

/**
 * Try the primary model, then fall back through the chain on 429/5xx.
 * Skips non-vision models when an image is present.
 */
export async function generateWithGemini(
  apiKey: string,
  primaryModel: string,
  options: GenerateOptions,
  fallbackModels: string[] = []
): Promise<GenerateResult> {
  const parts = buildParts(options);
  const hasImage = Boolean(options.imageBuffer && options.imageMimeType);

  const chain = [primaryModel, ...fallbackModels].filter(Boolean);
  const errors: string[] = [];

  for (const model of chain) {
    if (hasImage && !modelSupportsVision(model)) {
      console.log(`[gemini] skipping ${model} (no vision support, image present)`);
      continue;
    }

    console.log(`[gemini] trying ${model}`);
    const result = await callGemini(apiKey, model, parts);

    if (result.ok) {
      console.log(`[gemini] success with ${model}`);
      const html = result.text.replace(/^```html\n?/, '').replace(/```$/, '');
      return { html, modelUsed: model };
    }

    const msg = `${model} → ${result.status}: ${result.body.slice(0, 200)}`;
    errors.push(msg);
    console.warn(`[gemini] ${msg}`);

    if (!isRetryableStatus(result.status)) {
      throw new Error(`Gemini API error ${result.status}: ${result.body}`);
    }
  }

  throw new Error(`All Gemini models exhausted. Attempts:\n${errors.join('\n')}`);
}
