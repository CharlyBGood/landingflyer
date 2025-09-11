import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
// 1. Reemplazamos la dependencia de Groq por la de Google GenAI
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

// 2. Inicializar cliente de Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// Función auxiliar necesaria para convertir el buffer de la imagen al formato de la API de Gemini
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

// --- ENDPOINT DUAL: Generar Vista Previa (Adaptado a Gemini) ---
app.post('/api/generate-preview', upload.single('flyerImage'), async (req, res) => {
  try {
    const promptTemplate = await fs.readFile(path.join(__dirname, 'prompt-grapesjs.md'), 'utf8');
    let generatedText;
    
    // 🔄 DETECCIÓN DE MODALIDAD
    if (req.file) {
      // 📷 MODO IMAGEN: Usando la nueva API de @google/genai
      const imageBuffer = req.file.buffer;
      const imagePart = fileToGenerativePart(imageBuffer, req.file.mimetype);
      
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-001',
        contents: [
          {
            role: 'user',
            parts: [
              { text: promptTemplate },
              imagePart
            ]
          }
        ]
      });

      generatedText = response.text;

    } else if (req.body.businessData) {
      // 📋 MODO FORMULARIO: La lógica interna no cambia, solo el contenedor final
      const businessData = JSON.parse(req.body.businessData);

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
- Teléfono: ${businessData.contact.phone || 'No especificado'}
- Email: ${businessData.contact.email || 'No especificado'}
- Dirección: ${businessData.contact.address || 'No especificado'}
- Website: ${businessData.contact.website || 'No especificado'}

**Productos/Servicios:**
${businessData.services.map((service, index) => `- ${service.name}: ${service.description} ${service.price ? '($' + service.price + ')' : ''}`).join('\n')}

**INSTRUCCIONES ESPECIALES:**
Usa EXACTAMENTE estos colores como base de la paleta. Convierte automáticamente el teléfono a WhatsApp y la dirección a Google Maps si están especificado.
`;

      const finalPrompt = promptTemplate + '\n' + structuredPrompt;
      
      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || 'gemini-2.0-flash-001',
        contents: finalPrompt
      });

      generatedText = response.text;
      
    } else {
      return res.status(400).json({
        error: 'Debes subir una imagen O proporcionar datos del negocio.'
      });
    }

    // Esta parte de procesamiento posterior no necesita cambios
    const { processImagesAndReplaceSrc } = await import('./services/processImagesAndReplaceSrc.js');
    const htmlWithCloudinary = await processImagesAndReplaceSrc(generatedText, 'preview'); // Usar 'preview' como siteName temporal
    let generatedHtml = htmlWithCloudinary.replace(/^```html\n?/, '').replace(/```$/, '');

    res.json({ generatedHtml: generatedHtml });

  } catch (error) {
    // Se actualiza el mensaje de error para reflejar que el error es con Gemini
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