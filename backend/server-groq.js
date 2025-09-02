import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { Groq } from 'groq-sdk';
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

// Inicializar cliente de Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

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
                console.log('Imagen obtenida de Pexels:', imageUrl);
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

// --- ENDPOINT DUAL: Generar Vista Previa (Imagen O Formulario) ---
app.post('/api/generate-preview', upload.single('flyerImage'), async (req, res) => {
    try {
        const promptTemplate = await fs.readFile(path.join(__dirname, 'prompt.md'), 'utf8');
        const messages = [];

        // 🔄 DETECCIÓN DE MODALIDAD
        if (req.file) {
            // 📷 MODO IMAGEN: Procesamiento con imagen
            const imageBuffer = req.file.buffer;
            const base64Image = imageBuffer.toString('base64');
            const mimeType = req.file.mimetype;

            messages.push({
                role: "user",
                content: [
                    { type: "text", text: promptTemplate },
                    {
                        type: "image_url",
                        image_url: {
                            url: `data:${mimeType};base64,${base64Image}`,
                        },
                    },
                ],
            });
        } else if (req.body.businessData) {
            // 📋 MODO FORMULARIO: Procesamiento con datos estructurados
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
Usa EXACTAMENTE estos colores como base de la paleta. Convierte automáticamente el teléfono a WhatsApp y la dirección a Google Maps si están especificados.
`;
            
            const finalPrompt = promptTemplate + '\n' + structuredPrompt;
            messages.push({
                role: "user",
                content: finalPrompt,
            });
        } else {
            return res.status(400).json({ 
                error: 'Debes subir una imagen O proporcionar datos del negocio.' 
            });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: messages,
            model: process.env.GROQ_MODEL || "meta-llama/llama-4-scout-17b-16e-instruct",
        });

        const generatedText = chatCompletion.choices[0]?.message?.content;

        if (!generatedText) {
            throw new Error('La respuesta de la IA estaba vacía.');
        }

        const generatedHtml = generatedText.replace(/^```html\n?/, '').replace(/```$/, '');

        res.json({ generatedHtml });

    } catch (error) {
        console.error('Error en el proceso de IA con Groq:', error);
        res.status(500).json({ error: 'Error al generar la vista previa con IA.', details: error.message });
    }
});

// --- ENDPOINT: Publicar Landing Page ---
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

const PORT = process.env.PORT_GROQ || 8080; // Usar un puerto diferente para evitar conflictos
app.listen(PORT, () => {
    console.log(`Servidor Groq escuchando en el puerto ${PORT}`);
    console.log(`Usando modelo Groq: ${process.env.GROQ_MODEL || 'meta-llama/llama-4-scout-17b-16e-instruct'}`);
});
