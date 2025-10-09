import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { getUnsplashImageUrl } from './services/UnsplashService.js';
import { getPexelsImageUrl } from './services/PexelsService.js';

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar cliente de Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Función auxiliar para convertir el buffer de la imagen al formato de la API de Gemini
function fileToGenerativePart(buffer, mimeType) {
  return {
    inlineData: {
      data: buffer.toString('base64'),
      mimeType,
    },
  };
}

// ESTE ENDPOINT NO SE MODIFICA
app.get('/api/image/unsplash', async (req, res) => {
  const term = req.query.term;
  if (!term) {
    return res.status(400).json({ error: 'Falta el parámetro term' });
  }
  try {
    let imageUrl;
    try {
      imageUrl = await getUnsplashImageUrl(term);
    } catch (unsplashError) {
      console.error('Error obteniendo imagen de Unsplash:', unsplashError);
      try {
        imageUrl = await getPexelsImageUrl(term);
      } catch (pexelsError) {
        console.error('Error obteniendo imagen de Pexels:', pexelsError);
        let details = unsplashError.message;
        if (unsplashError.response && unsplashError.response.status) {
          details += ` (Status: ${unsplashError.response.status})`;
        }
        return res.status(500).json({ error: 'No se pudo obtener imagen ni de Unsplash ni de Pexels', details: details });
      }
    }
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
    response.data.pipe(res);
  } catch (error) {
    console.error('Error general al obtener la imagen:', error);
    res.status(500).json({ error: 'Error al obtener la imagen', details: error.message });
  }
});

// --- ENDPOINT DUAL: Generar Vista Previa (Formulario con imagen opcional + compat flyer) ---
app.post('/api/generate-preview', upload.fields([{ name: 'flyerImage' }, { name: 'businessImage' }]), async (req, res) => {
  try {
    const promptTemplate = await fs.readFile(path.join(__dirname, 'prompt-tailwincss.md'), 'utf8');

    // Parseo seguro de businessData (si viene)
    const businessDataRaw = req.body.businessData;
    let businessData = null;
    if (businessDataRaw) {
      try {
        businessData = JSON.parse(businessDataRaw);
      } catch {
        return res.status(400).json({ error: 'businessData inválido (JSON malformado)' });
      }
    }

    // Archivos: priorizar imagen del formulario; usar flyer como fallback (compatibilidad)
    const formImage = req.files?.businessImage?.[0] || null;
    const flyerImage = req.files?.flyerImage?.[0] || null;
    const file = formImage || flyerImage || null;

    // Construcción unificada de parts
    const parts = [{ text: promptTemplate }];

    if (businessData) {
      const structuredPrompt = `
**DATOS COMERCIALES ESTRUCTURADOS:**

**Información Básica:**
- Nombre del Negocio: ${businessData.businessName}
- Tipo de Negocio: ${businessData.businessType}
- Descripción: ${businessData.description}
- Estilo Preferido: ${businessData.style || 'moderno'}

**Colores Definidos:**
- Color Principal: ${businessData.primaryColor}
- Color Secundario: ${businessData.secondaryColor || businessData.primaryColor}

**Información de Contacto:**
- Teléfono: ${businessData.contact?.phone || 'No especificado'}
- Email: ${businessData.contact?.email || 'No especificado'}
- Dirección: ${businessData.contact?.address || 'No especificado'}
- Website: ${businessData.contact?.website || 'No especificado'}

**Productos/Servicios:**
${Array.isArray(businessData.services) ? businessData.services.map((service) => `- ${service.name}: ${service.description} ${service.price ? '($' + service.price + ')' : ''}`).join('\n') : '- No especificado'}

**INSTRUCCIONES ESPECIALES:**
Usa EXACTAMENTE estos colores como base de la paleta. Convierte automáticamente el teléfono a WhatsApp y la dirección a Google Maps si están especificados.
`;
      parts.push({ text: structuredPrompt });
    }

    if (file) {
      const imagePart = fileToGenerativePart(file.buffer, file.mimetype);
      parts.push(imagePart);
    }

    if (parts.length === 1) {
      return res.status(400).json({ error: 'Debes subir una imagen o proporcionar datos del negocio.' });
    }

    const response = await ai.models.generateContent({
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-001',
      contents: [{ role: 'user', parts }]
    });

    const generatedText = response.text;
    let generatedHtml = (generatedText || '').replace(/^```html\n?/, '').replace(/```$/, '');

    // Rehost provider images during preview to ensure absolute URLs and avoid collisions
    try {
      const siteNameForPreview = (businessData?.businessName || '').toString().trim() || 'preview';
      const { processImagesAndReplaceSrc } = await import('./services/processImagesAndReplaceSrc.js');
      generatedHtml = await processImagesAndReplaceSrc(generatedHtml, siteNameForPreview);
    } catch (e) {
      console.warn('Preview rehost skipped due to error:', e?.message || e);
    }

    res.json({ generatedHtml });

  } catch (error) {
    console.error('Error en el proceso de IA con Gemini:', error);
    res.status(500).json({ error: 'Error al generar la vista previa con IA.', details: error.message });
  }
});

// --- ENDPOINT: Publicar Landing Page (ESTE ENDPOINT NO SE MODIFICA) ---
app.post('/api/publish', async (req, res) => {
  try {
    const { htmlContent, siteName } = req.body;

    if (!htmlContent || !siteName) {
      return res.status(400).json({
        error: 'Se requiere htmlContent y siteName'
      });
    }

    const { processImagesAndReplaceSrc } = await import('./services/processImagesAndReplaceSrc.js');
    const htmlWithCloudinary = await processImagesAndReplaceSrc(htmlContent, siteName);

    const { NetlifyZipService } = await import('./services/NetlifyZipService.js');
    const netlifyService = new NetlifyZipService();

    const htmlTitle = netlifyService.extractTitleFromHTML(htmlWithCloudinary);
    const titleForURL = htmlTitle || siteName;

    const validSiteName = netlifyService.generateSiteName(titleForURL);

    const result = await netlifyService.createSite(validSiteName, htmlWithCloudinary);

    res.json({
      success: true,
      url: result.url,
      siteName: result.siteName,
      siteId: result.siteId
    });

  } catch (error) {
    console.error('Error publicando sitio:', error);
    res.status(500).json({
      error: 'Error al publicar el sitio',
      details: error.message
    });
  }
});

// ESTE ENDPOINT NO SE MODIFICA
app.get('/api/deploy-status/:siteId/:deployId', async (req, res) => {
  try {
    res.json({
      state: 'ready',
      ready: true,
      message: 'Deploy completado con ZIP Method atómico'
    });
  } catch (error) {
    console.error('Error verificando estado:', error);
    res.status(500).json({
      error: 'Error al verificar estado del deploy',
      details: error.message
    });
  }
});

// 6. Se actualiza el puerto y los mensajes de inicio del servidor
const PORT = process.env.PORT_GEMINI || 8080;
app.listen(PORT, () => {
  console.log(`Servidor Gemini escuchando en el puerto ${PORT}`);
  console.log(`Usando modelo Gemini: ${process.env.GEMINI_MODEL || 'gemini-1.5-flash'}`);
});