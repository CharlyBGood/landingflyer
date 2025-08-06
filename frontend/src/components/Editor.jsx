import { useState, useEffect, useRef } from 'react';
import { PencilIcon, CheckIcon } from '../utilities';
import { useBackgroundButtons } from '../hooks/useBackgroundButtons';
import '../styles/Editor.css';

function Editor() {
  const [htmlContent, setHtmlContent] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const contentRef = useRef(null);
  const toolbarRef = useRef(null);

  // Callback para cuando se cambia una imagen de fondo
  const handleBackgroundImageChange = (imageUrl, element) => {
    console.log('Background changed:', element.tagName, element.id);
    
    // Guardar cambios
    if (contentRef.current) {
      const clone = contentRef.current.cloneNode(true);
      clone.querySelectorAll('.bg-btn-container').forEach(container => container.remove());
      localStorage.setItem('editableHtml', clone.innerHTML);
    }
  };

  useBackgroundButtons(contentRef, isEditMode, handleBackgroundImageChange);

  useEffect(() => {
    const updateToolbarHeight = () => {
      if (toolbarRef.current) {
        const height = toolbarRef.current.offsetHeight;
        document.documentElement.style.setProperty('--toolbar-height', `${height}px`);
      }
    };

    updateToolbarHeight();

    const resizeObserver = new ResizeObserver(updateToolbarHeight);
    if (toolbarRef.current) {
      resizeObserver.observe(toolbarRef.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [isEditMode]);

  useEffect(() => {
    const savedContent = localStorage.getItem('editableHtml') || '<h1>No hay contenido para editar. Genera una vista previa en la página principal.</h1>';
    setHtmlContent(savedContent);
  }, []);

  // Sincroniza cambios externos
  useEffect(() => {
    const handler = e => e.key === 'editableHtml' && setHtmlContent(e.newValue || '');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Activa edición de texto
  useEffect(() => {
    if (!contentRef.current) return;

    // Limpiar estilos de edición
    const allElements = contentRef.current.querySelectorAll('*');
    allElements.forEach(el => {
      el.removeAttribute('contenteditable');
      el.style.outline = '';
      el.style.outlineOffset = '';
    });

    // Aplicar edición solo si está activa
    if (isEditMode) {
      const editableElements = contentRef.current.querySelectorAll('[data-editable="true"], button, a');
      
      editableElements.forEach(el => {
        el.setAttribute('contenteditable', 'true');
        el.style.outline = '2px dashed #007bff';
        el.style.outlineOffset = '2px';
      });
    }
  }, [isEditMode, htmlContent]);

  useEffect(() => {
    const handleClick = (e) => {
      if (isEditMode && (e.target.tagName === 'BUTTON' || e.target.tagName === 'A')) {        
        if (!e.target.closest('.editor-toolbar')) {
          e.preventDefault();
        }
      }
    };

    if (contentRef.current) {
      contentRef.current.addEventListener('click', handleClick, true);
    }

    return () => {
      if (contentRef.current) {
        contentRef.current.removeEventListener('click', handleClick, true);
      }
    };
  }, [isEditMode]);

  const handleSaveChanges = () => {
    if (!contentRef.current) return;
    
    // Limpiar botones y estilos
    contentRef.current.querySelectorAll('.bg-btn-container').forEach(container => container.remove());
    const allElements = contentRef.current.querySelectorAll('*');
    allElements.forEach(el => {
      el.removeAttribute('contenteditable');
      el.style.outline = '';
      el.style.outlineOffset = '';
    });

    // Guardar
    const clone = contentRef.current.cloneNode(true);
    localStorage.setItem('editableHtml', clone.innerHTML);
    setHtmlContent(clone.innerHTML);
    setIsEditMode(false);
    setSaveMessage('Cambios guardados exitosamente');

    setTimeout(() => setSaveMessage(''), 3000);
  };

  return (
    <div>
      <div className="editor-toolbar" ref={toolbarRef}>
        <div className="toolbar-main">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`edit-mode-btn ${isEditMode ? 'active' : ''}`}
            aria-label={isEditMode ? 'Salir de edición' : 'Activar edición'}
          >
            <PencilIcon size={20} />
            <span className="btn-text">
              {isEditMode ? 'Salir' : 'Editar'}
            </span>
          </button>

          {isEditMode && (
            <button
              onClick={handleSaveChanges}
              className="save-changes-btn"
              aria-label="Guardar cambios"
            >
              <CheckIcon className="w-4 h-4" size={16} />
              <span className="btn-text">Guardar</span>
            </button>
          )}
        </div>

        {(isEditMode || saveMessage) && (
          <div className="toolbar-instructions">
            <div className={`instructions-content ${saveMessage ? 'success-message' : ''}`}>
              <span className="instruction-icon">
                {saveMessage ? '✅' : '💡'}
              </span>
              <span className="instruction-text">
                {saveMessage ? (
                  <span className="font-medium">{saveMessage}</span>
                ) : (
                  <>
                    <span className="font-medium">Editar:</span>
                    <span className="hidden sm:inline"> Click en textos y botones</span>
                    <span className="sm:hidden"> Toca textos/botones</span>
                  </>
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      <div
        ref={contentRef}
        className="content-area"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}

export default Editor;