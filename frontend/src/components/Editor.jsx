import { useState, useEffect, useRef, useMemo } from 'react';
import { PencilIcon, CheckIcon, GlobeIcon } from '../utilities';
import { useBackgroundButtons } from '../hooks/useBackgroundButtons';
import { DOMUtils } from '../utilities/domUtils';
import { getInputColor } from '../utilities';
import PublishModal from './editor/PublishModal.jsx';
import PublishSuccessModal from './editor/PublishSuccessModal.jsx';
import '../styles/Editor.css';


function Editor() {
  const [htmlContent, setHtmlContent] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);
  const contentRef = useRef(null);
  const toolbarRef = useRef(null);

  const [cssVars, setCssVars] = useState([]);

  // Agregar un estado para el contenido original
  const [originalContent, setOriginalContent] = useState('');

  // En el useEffect de carga inicial, guardar también como "original"
  useEffect(() => {
    const savedContent = localStorage.getItem('editableHtml') || '<h1>No hay contenido...</h1>';
    setHtmlContent(savedContent);
    setOriginalContent(savedContent); // ✅ Guardar como original
  }, []);

  const handleReset = () => {
    setHtmlContent(originalContent);
    localStorage.setItem('editableHtml', originalContent);
    setIsEditMode(false);
    showSuccessMessage('Página restaurada al estado original');
  };

  const getEditableHtml = (originalHtml, editMode) => {
    if (!originalHtml) return originalHtml;

    if (editMode) {
      const modifiedHtml = originalHtml.replace(
        /(<[^>]+data-editable="true"[^>]*?)(?:\s+contenteditable="[^"]*")?(\s*>)/g,
        '$1 contenteditable="true"$2'
      );
      return modifiedHtml;
    } else {
      const modifiedHtml = originalHtml.replace(
        /(<[^>]+data-editable="true"[^>]*?)\s+contenteditable="[^"]*"(\s*>)/g,
        '$1$2'
      );
      return modifiedHtml;
    }
  };
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
        cssText = cssText.replace(
          /(:root\s*{)([^}]*)}/,
          (match, p1, p2) => {
            const newVars = p2.replace(
              new RegExp(`(${variableName}\\s*:\\s*)[^;]+`),
              `$1${newValue}`
            );
            return `${p1}${newVars}}`;
          }
        );
        styleElement.textContent = cssText;

        setHtmlContent(contentRef.current.innerHTML);
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
    const variables = extractRootCSSVariables();

    variables.forEach(({ name, value }) => {
      document.documentElement.style.setProperty(name, value);
    });

    setCssVars(variables);
  }, [htmlContent]);

  useEffect(() => {
    const handler = e => e.key === 'editableHtml' && setHtmlContent(e.newValue || '');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const processedHtml = useMemo(() => {
    return getEditableHtml(htmlContent, isEditMode);
  }, [htmlContent, isEditMode]);

  const handleSaveChanges = () => {
    if (!contentRef.current) return;
    const savedContent = saveCleanContent(contentRef.current);
    setHtmlContent(savedContent);
    setIsEditMode(false);
    showSuccessMessage('Cambios guardados exitosamente');
  };

  const handlePublish = () => {
    setShowPublishModal(true);
  };

  const handlePublishSubmit = async (siteName) => {
    setIsPublishing(true);

    try {
      const clone = contentRef.current.cloneNode(true);
      DOMUtils.cleanAllEditingElements(clone);
      DOMUtils.removeContentEditableAttributes(clone);
      const cleanHtmlContent = clone.innerHTML;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          htmlContent: cleanHtmlContent,
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
        alert('La publicación está tardando más de lo esperado. El proceso puede estar aún completándose en segundo plano.');
      } else {
        alert(`Error al publicar: ${error.message}`);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCloseModals = () => {
    setShowPublishModal(false);
    setShowSuccessModal(false);
    setPublishResult(null);
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
          <button
            onClick={handleReset}
            className="edit-mode-btn reset-btn"
            aria-label="Restaurar al estado original"
          >
            <span className="btn-text">Reset</span>
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
                {cssVars.map(({ name, value }) => {
                  let computed = '';
                  if (contentRef.current) {
                    computed = getComputedStyle(contentRef.current).getPropertyValue(name).trim();
                  }
                  const colorValue = getInputColor(computed) || getInputColor(value);
                  return (
                    <div key={name} className='flex flex-col items-center'>
                      <input
                        type="color"
                        value={colorValue}
                        disabled={!colorValue}
                        onChange={e => updateCSSVariable(name, e.target.value)}
                        title={name}
                      />
                    </div>
                  );
                })}
                <span className="block w-full text-center text-xs text-gray-700 mt-2 sm:mt-0 sm:w-auto sm:ml-4 sm:text-left">paleta de colores</span>
              </div>
            </>
          )}
        </div>
        <button
          onClick={handlePublish}
          className="edit-mode-btn publish-btn-custom flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl sm:rounded-2xl transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          aria-label="Publicar página"
        >
          <GlobeIcon size={18} className="flex-shrink-0" />
          <span className="btn-text">Publicar</span>
        </button>

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
        data-edit-mode={isEditMode}
        dangerouslySetInnerHTML={{ __html: processedHtml }}
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
}

export default Editor;