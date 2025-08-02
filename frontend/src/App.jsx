// frontend/src/App.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css'; // Usaremos el CSS de App para la estructura principal

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedHtml, setGeneratedHtml] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const iframeRef = useRef(null);

  const handleGeneratePreview = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError('');
    setGeneratedHtml(null);

    const formData = new FormData();
    formData.append('flyerImage', selectedFile);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await axios.post(`${apiUrl}/api/generate-preview`, formData);
      setGeneratedHtml(response.data.generatedHtml);
      localStorage.setItem('editableHtml', response.data.generatedHtml);
    } catch (err) {
      setError('Hubo un error al generar la página.', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setGeneratedHtml(null);
    }
  };

  // Efecto para escuchar cambios guardados en el editor
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedHtml = localStorage.getItem('editableHtml');
      if (updatedHtml && updatedHtml !== generatedHtml) {
        setGeneratedHtml(updatedHtml);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [generatedHtml]);


  return (
    <div className="App">
      <header className="App-header">
        <h1>Sube tu Flyer y crea tu Landing Page</h1>
        <p>Vamos a generar una vista previa. Luego, podrás abrirla en un editor a pantalla completa para perfeccionarla.</p>
      </header>

      <main className="App-main">
        <div className="uploader">
          <input type="file" onChange={handleFileChange} accept="image/*" disabled={isLoading} />
          <button onClick={handleGeneratePreview} disabled={isLoading || !selectedFile}>
            {isLoading ? 'Generando...' : 'Generar Vista Previa'}
          </button>
        </div>

        {isLoading && <p>Analizando diseño y construyendo tu web...</p>}
        {error && <p className="error-message">{error}</p>}
      </main>

      {generatedHtml && (
        <div className="preview-container">
          <div className="preview-toolbar">
            <h2>✨ ¡Tu vista previa está lista! ✨</h2>
            <p>Abre el editor para personalizar tu página, guardar los cambios y prepararla para el lanzamiento.</p>
            <div className='cta-buttons'>
              <a href="/editor" target="_blank" className='contact-button' rel="noopener noreferrer">
                Abrir Editor a Pantalla Completa
              </a>
            </div>
          </div>
          <iframe
            ref={iframeRef}
            srcDoc={generatedHtml}
            title="Vista Previa de la Landing Page"
            className="preview-iframe"
            key={generatedHtml}
          />
        </div>
      )}
    </div>
  );
}

export default App;