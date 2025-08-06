import { useState, useEffect, useRef } from 'react';
import { PencilIcon, CheckIcon } from '../utilities';
import { useBackgroundButtons } from '../hooks/useBackgroundButtons';
import { DOMUtils } from '../utilities/domUtils';
import '../styles/Editor.css';

function Editor() {
  const [htmlContent, setHtmlContent] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const contentRef = useRef(null);
  const toolbarRef = useRef(null);

  // Utilidad para guardar contenido limpio
  const saveCleanContent = (container) => {
    const clone = container.cloneNode(true);
    DOMUtils.cleanAllEditingElements(clone);
    localStorage.setItem('editableHtml', clone.innerHTML);
    return clone.innerHTML;
  };

  // Utilidad para mostrar mensaje de éxito
  const showSuccessMessage = (message) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleBackgroundImageChange = (imageUrl, element) => {
    console.log(`Background changed to ${imageUrl.substring(0, 50)}... on ${element.tagName}#${element.id}`);

    if (!element.parentNode) {
      console.warn('Element was removed from DOM, skipping save');
      return;
    }

    if (contentRef.current && imageUrl) {
      saveCleanContent(contentRef.current);
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

  useEffect(() => {
    const handler = e => e.key === 'editableHtml' && setHtmlContent(e.newValue || '');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    if (!isEditMode && contentRef.current) {
      DOMUtils.removeContentEditableAttributes(contentRef.current);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode && contentRef.current) {
      DOMUtils.applyContentEditableAttributes(contentRef.current);
    }
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode && contentRef.current && htmlContent) {
      DOMUtils.applyContentEditableAttributes(contentRef.current);
    }
  }, [htmlContent, isEditMode]);

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

    const savedContent = saveCleanContent(contentRef.current);
    setHtmlContent(savedContent);
    setIsEditMode(false);

    showSuccessMessage('Cambios guardados exitosamente');
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