import { getUnsplashImageUrl } from './services/UnsplashService.js';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { VertexAI } from '@google-cloud/vertexai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const app = express();
app.use(cors());
app.use(express.json());
const upload = multer({ storage: multer.memoryStorage() });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vertex_ai = new VertexAI({ project: process.env.GCLOUD_PROJECT, location: 'us-central1' });
const textModel = vertex_ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

import fsSync from 'fs';
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
        fsSync.accessSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, fsSync.constants.R_OK);
    } catch (err) {
        console.error('No se pudo acceder al archivo de credenciales:', err);
    }
}

app.get('/api/image/unsplash', async (req, res) => {
    const term = req.query.term;
    if (!term) {
        return res.status(400).json({ error: 'Falta el parámetro term' });
    }
    try {
        const imageUrl = await getUnsplashImageUrl(term);
        // Proxy: descarga la imagen y la reenvía con el content-type correcto
        const response = await axios.get(imageUrl, { responseType: 'stream' });
        res.setHeader('Content-Type', response.headers['content-type'] || 'image/jpeg');
        response.data.pipe(res);
    } catch (error) {
        console.error('Error obteniendo imagen de Unsplash:', error);
        res.status(500).json({ error: 'No se pudo obtener imagen de Unsplash', details: error.message });
    }
});

// --- ENDPOINT DUAL: Generar Vista Previa (Imagen O Formulario) ---
app.post('/api/generate-preview', upload.single('flyerImage'), async (req, res) => {
    try {
        const promptTemplate = await fs.readFile(path.join(__dirname, 'prompt.md'), 'utf8');
        let requestParts = [{ text: promptTemplate }];

        // 🔄 DETECCIÓN DE MODALIDAD
        if (req.file) {
            // 📷 MODO IMAGEN: Procesamiento tradicional con imagen
            const imageBuffer = req.file.buffer;
            requestParts.push({
                inlineData: { 
                    mimeType: req.file.mimetype, 
                    data: imageBuffer.toString('base64') 
                }
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
            
            requestParts.push({ text: structuredPrompt });
        } else {
            return res.status(400).json({ 
                error: 'Debes subir una imagen O proporcionar datos del negocio.' 
            });
        }

        const result = await textModel.generateContent({ contents: [{ role: 'user', parts: requestParts }] });
        const response = result.response;

        if (!response.candidates || response.candidates.length === 0) {
            throw new Error('La respuesta de la IA estaba vacía.');
        }

        const generatedHtml = response.candidates[0].content.parts[0].text.replace(/^```html\n?/, '').replace(/```$/, '');

        res.json({ generatedHtml });

    } catch (error) {
        console.error('Error en el proceso de IA:', error);
        console.error('Stacktrace:', error.stack);
        console.error('Variables de entorno al fallar:', {
            GCLOUD_PROJECT: process.env.GCLOUD_PROJECT,
            GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS
        });
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


        // Procesar imágenes y reemplazar src por URLs Cloudinary
        let htmlWithCloudinary;
        try {
            console.log('Iniciando procesamiento de imágenes...');
            const { processImagesAndReplaceSrc } = await import('./services/processImagesAndReplaceSrc.js');
            htmlWithCloudinary = await processImagesAndReplaceSrc(htmlContent, siteName);
            console.log('Procesamiento de imágenes completado.');
        } catch (imageError) {
            console.error('Error crítico durante el procesamiento de imágenes:', imageError);
            // DEPURACIÓN FORZADA: Devolver el error en la respuesta
            return res.status(500).json({
                error: 'Falló el procesamiento de imágenes en el backend.',
                details: imageError.message,
                stack: imageError.stack,
            });
        }

        // Importar NetlifyZipService y publicar
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
