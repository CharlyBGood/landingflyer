// frontend/src/App.jsx
import { useState, useMemo } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  // --- ESTADOS PRINCIPALES ---
  const [selectedFile, setSelectedFile] = useState(null); // <-- VOLVEMOS A AÑADIR EL ESTADO PARA EL ARCHIVO
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // --- NUEVO MANEJADOR: SOLO GUARDA EL ARCHIVO SELECCIONADO ---
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError(''); // Limpia cualquier error anterior al seleccionar un nuevo archivo
      setPageData(null); // Limpia la vista previa anterior
    }
  };

  // --- MANEJADOR DEL CLIC EN EL BOTÓN "GENERAR VISTA PREVIA" ---
  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona una imagen primero.');
      return;
    }

    setIsLoading(true);
    setError('');
    setPageData(null);
    const formData = new FormData();
    formData.append('flyerImage', selectedFile); // Usa el archivo guardado en el estado

    try {
      const response = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPageData(response.data);
    } catch (err) {
      setError('Hubo un error al subir o procesar la imagen.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // --- MANEJADORES PARA LA EDICIÓN DEL CONTENIDO ---
  const handleContentUpdate = (field, value) => {
    setPageData(prevData => ({
      ...prevData,
      content: {
        ...prevData.content,
        [field]: value
      }
    }));
  };

  const handleParagraphUpdate = (index, value) => {
    setPageData(prevData => {
      const newParagraphs = [...prevData.content.paragraphs];
      newParagraphs[index] = value;
      return {
        ...prevData,
        content: {
          ...prevData.content,
          paragraphs: newParagraphs
        }
      };
    });
  };

  // --- LÓGICA PARA CREAR LOS ESTILOS DINÁMICOS ---
  const dynamicStyles = useMemo(() => {
    if (!pageData?.palette) return {};

    const sortedPalette = [...pageData.palette].sort((a, b) => b.score - a.score);
    const toRgbString = (color) => `rgb(${color.red || 0}, ${color.green || 0}, ${color.blue || 0})`;
    
    return {
      '--color-background': toRgbString(sortedPalette[0]?.rgb),
      '--color-text': toRgbString(sortedPalette[1]?.rgb),
      '--color-primary': toRgbString(sortedPalette[1]?.rgb),
      '--color-accent': toRgbString(sortedPalette[2]?.rgb),
    };
  }, [pageData]);

  // --- RENDERIZADO DEL COMPONENTE ---
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sube tu Flyer y crea tu Landing Page</h1>
        <p>Transforma tu diseño en una página web editable con su propia paleta de colores en segundos.</p>
      </header>

      <main className="App-main">
        <div className="uploader">
          {/* El input ahora solo llama a handleFileChange */}
          <input type="file" onChange={handleFileChange} accept="image/*" disabled={isLoading} />
          
          {/* ESTE ES EL BOTÓN QUE FALTABA */}
          <button onClick={handleUpload} disabled={isLoading || !selectedFile}>
            {isLoading ? 'Procesando...' : 'Generar Vista Previa'}
          </button>
        </div>
        {isLoading && <p>Procesando tu flyer... ¡La magia está en camino!</p>}
        {error && <p className="error-message">{error}</p>}
      </main>

      {/* --- SECCIÓN DE VISTA PREVIA --- */}
      {pageData && pageData.content && (
        <section
          className="landing-preview"
          style={dynamicStyles}
        >
          <h1
            contentEditable
            suppressContentEditableWarning={true}
            onBlur={e => handleContentUpdate('title', e.currentTarget.textContent)}
          >
            {pageData.content.title}
          </h1>

          {pageData.content.paragraphs && pageData.content.paragraphs.map((p, index) => (
            <p
              key={index}
              contentEditable
              suppressContentEditableWarning={true}
              onBlur={e => handleParagraphUpdate(index, e.currentTarget.textContent)}
            >
              {p}
            </p>
          ))}
          
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