// backend/server.js (versión enfocada únicamente en la generación de la vista previa)
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { VertexAI } from '@google-cloud/vertexai';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

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

// --- ÚNICO ENDPOINT: Generar la Vista Previa ---
app.post('/api/generate-preview', upload.single('flyerImage'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se subió ninguna imagen.' });
    }

    try {
        const imageBuffer = req.file.buffer;

        const promptTemplate = await fs.readFile(path.join(__dirname, 'prompt.md'), 'utf8');

        const requestParts = [
            { text: promptTemplate },
            { inlineData: { mimeType: req.file.mimetype, data: imageBuffer.toString('base64') } },
        ];

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

        // Importar dinámicamente el servicio
        const { NetlifyZipService } = await import('./services/NetlifyZipService.js');
        const netlifyService = new NetlifyZipService();

        const htmlTitle = netlifyService.extractTitleFromHTML(htmlContent);
        const titleForURL = htmlTitle || siteName;

        const validSiteName = netlifyService.generateSiteName(titleForURL);

        const result = await netlifyService.createSite(validSiteName, htmlContent);

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