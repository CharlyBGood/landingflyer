// Convierte #rgb o #rgba a #rrggbb o #rrggbbaa
// Convierte #rgb o #rgba a #rrggbb o #rrggbbaa y valida para input type=color
const expandHex = hex => {
  if (/^#([\da-fA-F])([\da-fA-F])([\da-fA-F])$/.test(hex)) {
    return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
  }
  if (/^#([\da-fA-F])([\da-fA-F])([\da-fA-F])([\da-fA-F])$/.test(hex)) {
    return '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3] + hex[4] + hex[4];
  }
  return hex;
};

// Devuelve un color válido para el input o undefined si no es válido
const getInputColor = (value) => {
  const hex = expandHex(value);
  return /^#([0-9A-Fa-f]{6})$/.test(hex) ? hex : undefined;
};
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

  // Extraer dinámicamente las variables CSS del bloque :root del <style> embebido
  const [cssVars, setCssVars] = useState([]);
  const extractRootCSSVariables = () => {
    if (!contentRef.current) return [];
    const styleTag = contentRef.current.querySelector('style');
    if (!styleTag) return [];
    const css = styleTag.textContent;
    const rootBlock = css.match(/:root\s*{([^}]*)}/);
    if (!rootBlock) return [];
    return [...rootBlock[1].matchAll(/(--[a-zA-Z0-9-_]+)\s*:\s*([^;]+);/g)]
      .map(m => ({ name: m[1], value: m[2].trim() }));
  };
  const updateCSSVariable = (variableName, newValue) => {
    document.documentElement.style.setProperty(variableName, newValue);
    if (contentRef.current) {
      const styleElement = contentRef.current.querySelector('style');
      if (styleElement) {
        let cssText = styleElement.textContent;
        // Solo modificar el valor de la variable en el bloque :root
        cssText = cssText.replace(/(:root\s*{)([^}]*)}/, (match, p1, p2) => {
          const newVars = p2.replace(new RegExp(`(${variableName}\\s*:\\s*)[^;]+`), `$1${newValue}`);
          return `${p1}${newVars}}`;
        });
        styleElement.textContent = cssText;
      }
      setCssVars(extractRootCSSVariables());
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
    setCssVars(extractRootCSSVariables());
  }, [htmlContent, isEditMode]);

  useEffect(() => {
    const handler = e => e.key === 'editableHtml' && setHtmlContent(e.newValue || '');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

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

              <div className='flex gap-0.5 items-center'>
                {cssVars.map(({ name, value }) => (
                  <div key={name} className='flex flex-col items-center'>
                    <input
                      type="color"
                      value={getInputColor(value)}
                      disabled={!getInputColor(value)}
                      onChange={e => updateCSSVariable(name, e.target.value)}
                      title={name}
                    />
                  </div>
                ))}
                <span className="block w-full text-center text-xs text-gray-700 mt-2 sm:mt-0 sm:w-auto sm:ml-4 sm:text-left">paleta de colores</span>
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