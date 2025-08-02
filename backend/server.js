// backend/server.js (versión final, con modelo verificado y sintaxis garantizada)
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
const upload = multer({ storage: multer.memoryStorage() });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const vertex_ai = new VertexAI({ project: process.env.GCLOUD_PROJECT, location: 'us-central1' });

// --- EL CEREBRO: El modelo multimodal más potente y estable, según la documentación oficial ---
const generativeModel = vertex_ai.getGenerativeModel({ model: 'gemini-2.5-pro' });

app.post('/api/upload', upload.single('flyerImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen.' });
  }

  try {
    const imageBase64 = req.file.buffer.toString('base64');
    const promptTemplate = await fs.readFile(path.join(__dirname, 'prompt.md'), 'utf8');

    // --- PREPARACIÓN DE LA PETICIÓN MULTIMODAL ---
    const requestParts = [
      { text: promptTemplate },
      { inlineData: { mimeType: req.file.mimetype, data: imageBase64 } },
    ];

    const result = await generativeModel.generateContent({ contents: [{ role: 'user', parts: requestParts }] });
    const response = result.response;

    // Verificación robusta de la respuesta de la IA
    if (!response.candidates || response.candidates.length === 0 || !response.candidates[0].content || !response.candidates[0].content.parts || !response.candidates[0].content.parts[0].text) {
      throw new Error('La respuesta de la IA estaba vacía o en un formato inesperado.');
    }

    const generatedHtml = response.candidates[0].content.parts[0].text.replace(/^```html\n?/, '').replace(/```$/, '');

    res.json({ generatedHtml });

  } catch (error) {
    console.error('Error en el proceso de IA:', error.message, error.stack);
    res.status(500).json({ error: 'Error al generar la vista previa con IA. El modelo de visión puede no estar disponible o requerir configuración adicional en la consola de Google Cloud.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});