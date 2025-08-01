// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

const app = express();
app.use(cors());
const upload = multer({ storage: multer.memoryStorage() });
const visionClient = new ImageAnnotatorClient({ keyFilename: 'credentials.json' });

app.post('/api/upload', upload.single('flyerImage'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ninguna imagen.' });
  }

  try {
    const imageBuffer = req.file.buffer;
    const [result] = await visionClient.annotateImage({
      image: { content: imageBuffer },
      features: [
        { type: 'TEXT_DETECTION' },
        { type: 'IMAGE_PROPERTIES' },
      ],
    });

    // --- INICIO DE LA NUEVA LÓGICA INTELIGENTE ---

    const detections = result.textAnnotations;
    let structuredContent = {};

    if (detections && detections.length > 0) {
      // El primer elemento (índice 0) es el texto completo, lo ignoramos para el análisis estructural.
      // Trabajaremos con el resto, que tienen información de cada bloque de texto.
      const textBlocks = detections.slice(1);

      // HEURÍSTICA 1: Encontrar el título.
      // Asumimos que el título es el bloque de texto con el área más grande.
      let largestArea = 0;
      let titleText = "Título Editable";

      textBlocks.forEach(block => {
        const vertices = block.boundingPoly.vertices;
        const width = Math.abs(vertices[0].x - vertices[1].x);
        const height = Math.abs(vertices[0].y - vertices[2].y);
        const area = width * height;

        if (area > largestArea) {
          largestArea = area;
          titleText = block.description;
        }
      });

      // HEURÍSTICA 2: El resto del texto son los párrafos.
      // Extraemos todo el texto y lo limpiamos un poco.
      const fullText = detections[0].description;
      // Quitamos el título que ya encontramos para no repetirlo.
      const paragraphsText = fullText.replace(titleText, '').trim();
      const paragraphs = paragraphsText.split('\n').filter(line => line.trim().length > 2);

      structuredContent = {
        title: titleText,
        paragraphs: paragraphs.length > 0 ? paragraphs : ["Contenido editable. Haz clic aquí para empezar a escribir."]
      };

    } else {
      // Fallback si no se detecta texto
      structuredContent = {
        title: "Título Editable",
        paragraphs: ["No se pudo detectar texto. ¡Pero puedes empezar a crear tu página desde cero!"]
      };
    }

    // --- FIN DE LA NUEVA LÓGICA INTELIGENTE ---


    // --- Procesamiento del COLOR (esto se queda igual) ---
    const colorProperties = result.imagePropertiesAnnotation.dominantColors.colors;
    const palette = colorProperties.map(colorInfo => ({
      rgb: colorInfo.color,
      score: colorInfo.score
    }));

    // --- RESPUESTA FINAL ---
    res.json({
      content: structuredContent,
      palette: palette
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