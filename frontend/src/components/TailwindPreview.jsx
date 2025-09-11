import React, { useEffect, useState } from 'react';
import { GlobeIcon } from '../utilities';
import PublishModal from './editor/PublishModal.jsx';
import PublishSuccessModal from './editor/PublishSuccessModal.jsx';
import CartModal from './cart/CartModal.jsx';

const TailwindPreview = () => {
  const [htmlContent, setHtmlContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);

  const handlePublish = () => {
    setShowCartModal(true);
  };

  const handleCartConfirm = () => {
    setShowCartModal(false);
    setShowPublishModal(true);
  };

  const handleCloseModals = () => {
    setShowCartModal(false);
    setShowPublishModal(false);
    setShowSuccessModal(false);
  };

  const handlePublishSubmit = async (siteName) => {
    setIsPublishing(true);

    try {
      const storedHtml = localStorage.getItem('editableHtml') || localStorage.getItem('originalTemplate');
      if (!storedHtml) {
        throw new Error('No hay contenido para publicar');
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      console.log('Intentando conectar a:', `${apiUrl}/api/publish`);
      
      const response = await fetch(`${apiUrl}/api/publish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          htmlContent: storedHtml,
          siteName: siteName
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setPublishResult(result);
      setShowPublishModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error publishing:', error);
      let errorMessage = 'Error desconocido al publicar';
      
      if (error.name === 'AbortError') {
        errorMessage = 'La publicación tardó demasiado tiempo (timeout)';
      } else if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
        errorMessage = 'No se puede conectar al servidor backend. Asegúrate de que el servidor esté corriendo en el puerto 8080';
      } else {
        errorMessage = error.message;
      }
      
      alert(`Error al publicar: ${errorMessage}`);
    } finally {
      setIsPublishing(false);
    }
  };

  useEffect(() => {
    // Obtener el HTML generado desde localStorage
    const storedHtml = localStorage.getItem('editableHtml') || localStorage.getItem('originalTemplate');

    if (storedHtml) {
      // Añadir Tailwind CSS al HTML
      const htmlWithTailwind = addTailwindToHTML(storedHtml);
      setHtmlContent(htmlWithTailwind);
    } else {
      setHtmlContent(`
        <div class="min-h-screen bg-gray-100 flex items-center justify-center">
          <div class="text-center">
            <h1 class="text-2xl font-bold text-gray-800 mb-4">No hay contenido disponible</h1>
            <p class="text-gray-600">Genera una página desde la pantalla principal primero.</p>
            <a href="/" class="inline-block mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Volver al inicio
            </a>
          </div>
        </div>
      `);
    }
    setIsLoading(false);
  }, []);

  const addTailwindToHTML = (html) => {
    // Verificar si ya tiene Tailwind CSS
    if (html.includes('tailwindcss') || html.includes('tailwind')) {
      return html;
    }

    // Añadir Tailwind CSS CDN al HTML
    const tailwindCDN = `
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Inter', 'system-ui', 'sans-serif'],
            }
          }
        }
      }
    </script>
    `;

    // Insertar Tailwind antes del cierre del head o al inicio del body si no hay head
    if (html.includes('</head>')) {
      return html.replace('</head>', `${tailwindCDN}</head>`);
    } else if (html.includes('<body>')) {
      return html.replace('<body>', `<body>${tailwindCDN}`);
    } else {
      // Si no tiene estructura HTML completa, envolver en HTML básico
      return `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Vista Previa</title>
          ${tailwindCDN}
        </head>
        <body>
          ${html}
        </body>
        </html>
      `;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando vista previa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden">
      {/* Barra superior similar a Editor.jsx */}
      <div className="bg-gray-900 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">


          <span className="text-sm text-gray-400">Vista Previa</span>
        </div>

        <button
          onClick={handlePublish}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Publicar página"
        >
          <GlobeIcon size={18} className="flex-shrink-0" />
          <span>Publicar</span>
        </button>
      </div>

      {/* Contenido del iframe */}
      <iframe
        srcDoc={htmlContent}
        title="Vista Previa"
        className="w-full h-[calc(100vh-64px)] border-none"
        sandbox="allow-scripts allow-same-origin"
      />

      {/* Modales */}
      <CartModal
        isOpen={showCartModal}
        onClose={handleCloseModals}
        onConfirm={handleCartConfirm}
      />

      <PublishModal
        isOpen={showPublishModal}
        onClose={handleCloseModals}
        onPublish={handlePublishSubmit}
        isPublishing={isPublishing}
      />

      <PublishSuccessModal
        isOpen={showSuccessModal}
        onClose={handleCloseModals}
        publishResult={publishResult}
      />
    </div>
  );
};

export default TailwindPreview;