import { arrayBufferToBase64 } from '../utils/helpers.js';
import { LANDING_PAGE_PROMPT } from '../prompt.js';
import type { BusinessData } from '../types.js';

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

export async function generateWithGemini(
  apiKey: string,
  model: string,
  options: {
    imageBuffer?: ArrayBuffer;
    imageMimeType?: string;
    businessData?: BusinessData;
  }
): Promise<string> {
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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${error}`);
  }

  const data = await response.json<{
    candidates: Array<{ content: { parts: Array<{ text: string }> } }>;
  }>();

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  // Strip markdown code fences if present
  return text.replace(/^```html\n?/, '').replace(/```$/, '');
}
