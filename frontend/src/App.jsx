// frontend/src/App.jsx
import { useState } from 'react';
import axios from 'axios';
import './App.css'; // Puedes añadir estilos básicos aquí

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setExtractedText(''); // Limpia el resultado anterior
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona una imagen primero.');
      return;
    }

    setIsLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('flyerImage', selectedFile);

    try {
      // La URL apunta a tu backend. En producción, será la URL de tu servicio de Render.
      const response = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setExtractedText(response.data.extractedText);
    } catch (err) {
      setError('Hubo un error al subir o procesar la imagen.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sube tu Flyer y crea tu Landing Page</h1>
        <p>Sube una imagen de tu flyer y nosotros extraeremos el contenido para generar una vista previa.</p>
      </header>

      <main className="App-main">
        <div className="uploader">
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button onClick={handleUpload} disabled={isLoading}>
            {isLoading ? 'Procesando...' : 'Generar Vista Previa'}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
      </main>

      {extractedText && (
        <section className="preview-section">
          <h2>Contenido Extraído (Editable)</h2>
          <p>Este es el texto que encontramos. ¡Puedes editarlo directamente!</p>
          <textarea
            className="editable-content"
            value={extractedText}
            onChange={(e) => setExtractedText(e.target.value)}
            rows="15"
          />
          <div className="cta-buttons">
            <button>Contactar para un diseño Pro</button>
            <button>Pagar y Desplegar este Template</button>
          </div>
        </section>
      )}
    </div>
  );
}

export default App;