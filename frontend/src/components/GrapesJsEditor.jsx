import React, { useEffect, useRef, useState } from 'react';
import 'grapesjs/dist/css/grapes.min.css';
import grapesjs from 'grapesjs';
import es from 'grapesjs/locale/es';
import 'grapesjs-preset-webpage';
import tinymce from 'tinymce';
import 'tinymce/themes/silver';
import 'tinymce/plugins/link';
import 'tinymce/plugins/image';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/code';
import 'tinymce/skins/ui/oxide/skin.min.css';
import 'grapesjs-plugin-toolbox';
import grapesjs_plugin_toolbox from 'grapesjs-plugin-toolbox';
import PublishModal from './editor/PublishModal.jsx';
import PublishSuccessModal from './editor/PublishSuccessModal.jsx';
import CartModal from './cart/CartModal.jsx';

const GrapesJsEditor = () => {
  const editorRef = useRef(null);
  const [editorInstance, setEditorInstance] = useState(null);
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

  const handlePublishSubmit = async (siteName) => {
    if (!editorInstance) {
      alert('Error: El editor no está listo.');
      return;
    }
    setIsPublishing(true);

    try {
      const htmlContent = editorInstance.getHtml();
      const cssContent = editorInstance.getCss();
      const fullHtml = `<!DOCTYPE html><html><head><style>${cssContent}</style></head><body>${htmlContent}</body></html>`;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${apiUrl}/api/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          htmlContent: fullHtml,
          siteName
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Error HTTP ${response.status}: ${errorData.details || errorData.error || 'Error desconocido'}`);
      }

      const result = await response.json();

      setPublishResult(result);
      setShowPublishModal(false);
      setShowSuccessModal(true);

    } catch (error) {
      console.error('Error publicando:', error);
      if (error.name === 'AbortError') {
        alert('La publicación está tardando más de lo esperado.');
      } else {
        alert(`Error al publicar: ${error.message}`);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCloseModals = () => {
    setShowCartModal(false);
    setShowPublishModal(false);
    setShowSuccessModal(false);
    setPublishResult(null);
  };

  useEffect(() => {
    const editableHtml = localStorage.getItem('editableHtml');

    const editor = grapesjs.init({
      container: editorRef.current,
      fromElement: true,
      height: '100vh',
      width: 'auto',
      storageManager: false, // Desactivamos el autoguardado para usar un botón manual
      plugins: ['gjs-preset-webpage', grapesjs_plugin_toolbox],
      pluginsOpts: {
        'gjs-preset-webpage': {
          // options
        },
        'grapesjs-plugin-toolbox': {
          // options
        }
      },
      // Configure TinyMCE as the RTE
      rte: {
        // The editor will be instantiated on demand
        create: (el, rteOptions) => {
          const editor = tinymce.init({
            ...rteOptions,
            target: el,
            language: 'es',
            language_url: 'https://cdn.jsdelivr.net/npm/tinymce-lang/langs/es.js',
            // ... other tinymce options
          });
          // Prevent GrapesJS from focusing the editor on init
          editor.on('init', () => el.blur());
          return editor;
        },
      },
    });

    setEditorInstance(editor);

    // Configurar el idioma después de la inicialización
    editor.I18n.addMessages({ es });
    editor.I18n.setLocale('es');

    if (editableHtml) {
      editor.setComponents(editableHtml);
    }

    // Añadir un botón de guardado
    editor.Panels.addButton('options', {
      id: 'save-db',
      className: 'fa fa-floppy-o',
      command: 'save-db',
      attributes: { title: 'Guardar' }
    });

    // Definir el comando de guardado
    editor.Commands.add('save-db', {
      run: (editor, sender) => {
        sender && sender.set('active', true);
        const updatedHtml = editor.getHtml();
        const css = editor.getCss();
        const fullHtml = `<!DOCTYPE html><html><head><style>${css}</style></head><body>${updatedHtml}</body></html>`;
        localStorage.setItem('editableHtml', fullHtml);
        alert('¡Página guardada!');
      }
    });

    // Añadir un botón de publicar
    editor.Panels.addButton('options', {
      id: 'publish',
      className: 'fa fa-globe',
      command: 'publish',
      attributes: { title: 'Publicar' }
    });

    // Definir el comando de publicar
    editor.Commands.add('publish', {
      run: () => handlePublish()
    });

    return () => {
      editor.destroy();
    };
  }, []);

  return (
    <>
      <div ref={editorRef} />
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
    </>
  );
};

export default GrapesJsEditor;
