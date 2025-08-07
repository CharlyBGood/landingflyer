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

  // Variables CSS comunes que suele generar la LLM
  const commonCSSVariables = [
    '--primary-color',
    '--secondary-color', 
    '--accent-color',
    '--neutral-color',
    '--neutral-light',
    '--text-color',
    '--bg-color'
  ];


  // Actualizar variable CSS de forma simple
  const updateCSSVariable = (variableName, newValue) => {
    console.log(`🎨 Actualizando ${variableName} a ${newValue}`);

    // Actualizar en el DOM
    document.documentElement.style.setProperty(variableName, newValue);

    // Guardar cambios si hay contenido
    if (contentRef.current) {
      // También actualizar en el <style> embebido para persistencia
      const styleElement = contentRef.current.querySelector('style');
      if (styleElement) {
        let cssText = styleElement.textContent;
        const regex = new RegExp(`(${variableName}\\s*:\\s*)[^;]+`, 'g');
        cssText = cssText.replace(regex, `$1${newValue}`);
        styleElement.textContent = cssText;        
      }

      saveCleanContent(contentRef.current);
    }
  };

  const saveCleanContent = (container) => {
    const clone = container.cloneNode(true);
    DOMUtils.cleanAllEditingElements(clone);
    localStorage.setItem('editableHtml', clone.innerHTML);
    return clone.innerHTML;
  };

  const showSuccessMessage = (message) => {
    setSaveMessage(message);
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleBackgroundImageChange = (imageUrl, element) => {
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
      console.log('🧹 Limpieza al salir del modo edición');
    }
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode && contentRef.current) {
      DOMUtils.applyContentEditableAttributes(contentRef.current);
    }
  }, [isEditMode]);

  // NO más useEffect que cargue colores automáticamente

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
            <>
              <button
                onClick={handleSaveChanges}
                className="save-changes-btn"
                aria-label="Guardar cambios"
              >
                <CheckIcon className="w-4 h-4" size={16} />
                <span className="btn-text">Guardar</span>
              </button>

              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {commonCSSVariables.map(variableName => (
                  <input
                    key={variableName}
                    type="color"
                    defaultValue="#2563eb"
                    onChange={(e) => updateCSSVariable(variableName, e.target.value)}
                    title={variableName}
                    style={{ width: '32px', height: '32px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                  />
                ))}
              </div>
            </>
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