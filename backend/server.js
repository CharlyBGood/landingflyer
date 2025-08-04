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
app.use(express.json()); // Necesario si en el futuro envías datos JSON
const upload = multer({ storage: multer.memoryStorage() });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vertex_ai = new VertexAI({ project: process.env.GCLOUD_PROJECT, location: 'us-central1' });
const textModel = vertex_ai.getGenerativeModel({ model: 'gemini-2.0-flash' });

// Logs de variables de entorno y acceso a credenciales
console.log('Variables de entorno:');
console.log('GCLOUD_PROJECT:', process.env.GCLOUD_PROJECT);
console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Verificar acceso al archivo de credenciales
import fsSync from 'fs';
if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    try {
        fsSync.accessSync(process.env.GOOGLE_APPLICATION_CREDENTIALS, fsSync.constants.R_OK);
        console.log('Credenciales accesibles:', process.env.GOOGLE_APPLICATION_CREDENTIALS);
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

        // Cargar el prompt desde el archivo externo
        const promptTemplate = await fs.readFile(path.join(__dirname, 'prompt.md'), 'utf8');

        // Preparar la petición multimodal para la IA
        const requestParts = [
            { text: promptTemplate },
            { inlineData: { mimeType: req.file.mimetype, data: imageBuffer.toString('base64') } },
        ];

        // Llamar a la IA
        const result = await textModel.generateContent({ contents: [{ role: 'user', parts: requestParts }] });
        const response = result.response;

        if (!response.candidates || response.candidates.length === 0) {
            throw new Error('La respuesta de la IA estaba vacía.');
        }

        const generatedHtml = response.candidates[0].content.parts[0].text.replace(/^```html\n?/, '').replace(/```$/, '');

        // Enviar el HTML generado al frontend
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});