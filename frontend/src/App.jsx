// frontend/src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedHtml, setGeneratedHtml] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const iframeRef = useRef(null); // Ref para acceder al iframe

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setGeneratedHtml(null);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError('');
    setGeneratedHtml(null);
    const formData = new FormData();
    formData.append('flyerImage', selectedFile);

    try {
      const response = await axios.post('http://localhost:3001/api/upload', formData);
      setGeneratedHtml(response.data.generatedHtml);
    } catch (err) {
      setError('Hubo un error al generar la página.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // --- EFECTO PARA HACER EL CONTENIDO DEL IFRAME INTERACTIVO ---
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    // Esta función se ejecutará CADA VEZ que el contenido del iframe termine de cargar
    const makeContentEditable = () => {
      // Accedemos al documento DENTRO del iframe
      const iframeDocument = iframe.contentDocument;
      if (!iframeDocument) return;

      // Buscamos todos los elementos que la IA marcó como editables
      const editableElements = iframeDocument.querySelectorAll('[data-editable="true"]');
      editableElements.forEach(el => {
        el.setAttribute('contentEditable', 'true');
        el.style.outline = '2px dashed transparent'; // Borde invisible
        el.style.transition = 'outline 0.2s';
        
        el.addEventListener('focus', () => el.style.outline = '2px dashed #007bff');
        el.addEventListener('blur', () => el.style.outline = '2px dashed transparent');
      });
    };

    // Añadimos el "listener" para cuando el iframe esté listo
    iframe.addEventListener('load', makeContentEditable);

    // Función de limpieza para evitar errores cuando el componente se desmonte
    return () => {
      iframe.removeEventListener('load', makeContentEditable);
    };
  }, [generatedHtml]); // Se ejecuta cuando 'generatedHtml' cambia

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sube tu Flyer y crea tu Landing Page</h1>
        <p>Nuestra IA analizará tu flyer y generará una propuesta de landing page en segundos.</p>
      </header>

      <main className="App-main">
        <div className="uploader">
          <input type="file" onChange={handleFileChange} accept="image/*" disabled={isLoading} />
          <button onClick={handleUpload} disabled={isLoading || !selectedFile}>
            {isLoading ? 'Procesando con IA...' : 'Generar Vista Previa'}
          </button>
        </div>
        {isLoading && <p>Analizando diseño y construyendo tu web...</p>}
        {error && <p className="error-message">{error}</p>}
      </main>

      {generatedHtml && (
        <div className="preview-container">
          <div className="preview-toolbar">
            <h2>✨ ¡Tu vista previa está lista! ✨</h2>
            <p>Puedes hacer clic en cualquier texto para editarlo directamente.</p>
            <div className='cta-buttons'>
              <button className='contact-button'>Contactar para Mejoras</button>
              <button className='buy-button'>Pagar y Descargar Template</button>
            </div>
          </div>
          {/* Volvemos a usar el iframe para un aislamiento perfecto */}
          <iframe
            ref={iframeRef}
            srcDoc={generatedHtml}
            title="Vista Previa de la Landing Page"
            className="preview-iframe"
          />
        </div>
      )}
    </div>
  );
}

export default App;