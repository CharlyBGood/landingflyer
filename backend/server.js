// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

const app = express();
app.use(cors()); // Habilita CORS para todas las rutas

// Configura Multer para guardar la imagen en memoria
const upload = multer({ storage: multer.memoryStorage() });

// Crea un cliente para la API de Vision
const visionClient = new ImageAnnotatorClient({
  keyFilename: 'credentials.json' // Asegúrate de que el archivo esté en la raíz del backend
});

// Define la ruta para la subida de la imagen
app.post('/api/upload', upload.single('flyerImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen.' });
  }

  try {
    // Usa el buffer de la imagen subida
    const imageBuffer = req.file.buffer;

    // Llama a la API de Google Vision para detectar texto
    const [result] = await visionClient.textDetection(imageBuffer);
    const detections = result.textAnnotations;

    // Para el esqueleto, solo devolveremos el texto completo detectado.
    // Más adelante, puedes analizar 'detections' para obtener la estructura.
    const fullText = detections.length > 0 ? detections[0].description : 'No se encontró texto.';

    res.json({
      extractedText: fullText
    });

  } catch (error) {
    console.error('Error procesando la imagen con Google Vision:', error);
    res.status(500).json({ error: 'Error al procesar la imagen.' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});