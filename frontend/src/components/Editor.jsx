import { useState, useEffect, useRef } from 'react';
import '../styles/Editor.css';

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

function Editor() {
  const [htmlContent, setHtmlContent] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const contentRef = useRef(null);
  const toolbarRef = useRef(null);

  // Actualizar altura del toolbar dinámicamente
  useEffect(() => {
    const updateToolbarHeight = () => {
      if (toolbarRef.current) {
        const height = toolbarRef.current.offsetHeight;
        document.documentElement.style.setProperty('--toolbar-height', `${height}px`);
      }
    };

    // Actualizar al montar y cuando cambie el modo de edición
    updateToolbarHeight();

    // Observer para detectar cambios de tamaño del toolbar
    const resizeObserver = new ResizeObserver(updateToolbarHeight);
    if (toolbarRef.current) {
      resizeObserver.observe(toolbarRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [isEditMode]);

  // Carga inicial
  useEffect(() => {
    setHtmlContent(localStorage.getItem('editableHtml') || '<h1>No hay contenido para editar. Genera una vista previa en la página principal.</h1>');
  }, []);

  // Sincroniza cambios externos
  useEffect(() => {
    const handler = e => e.key === 'editableHtml' && setHtmlContent(e.newValue || '');
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Activa edición de texto - EXPANDIDO para incluir botones - VERSIÓN CORREGIDA
  useEffect(() => {
    if (!contentRef.current) return;
    
    // LIMPIEZA RADICAL: Limpiar TODOS los elementos de estilos de edición
    const allElements = contentRef.current.querySelectorAll('*');
    allElements.forEach(el => {
      // Remover completamente el atributo contenteditable
      el.removeAttribute('contenteditable');
      // Limpiar estilos inline de edición
      el.style.outline = '';
      el.style.outlineOffset = '';
      el.style.pointerEvents = '';
    });
    
    // Solo aplicar estilos si estamos en modo edición
    if (isEditMode) {
      // Seleccionar elementos editables
      const editableElements = contentRef.current.querySelectorAll([
        '[data-editable="true"]',
        'button:not(.editor-bg-btn)',
        'a',
        '.btn',
        '.button',
        '[role="button"]'
      ].join(', '));
      
      editableElements.forEach(el => {
        // Usar setAttribute con minúsculas para que coincida con CSS
        el.setAttribute('contenteditable', 'true');
        
        // Aplicar estilos inline específicos
        if (el.tagName === 'BUTTON' || el.classList.contains('btn') || el.classList.contains('button')) {
          el.style.outline = '2px dashed #10b981'; // Verde para botones
          el.style.outlineOffset = '2px';
        } else if (el.tagName === 'A') {
          el.style.outline = '2px dashed #f59e0b'; // Amarillo para enlaces
          el.style.outlineOffset = '2px';
        } else {
          el.style.outline = '2px dashed #007bff'; // Azul para textos normales
          el.style.outlineOffset = '2px';
        }
        
        el.style.pointerEvents = 'auto';
      });
    }
  }, [isEditMode, htmlContent]);

  // Función para prevenir clicks accidentales durante edición usando delegación de eventos
  useEffect(() => {
    const handleClick = (e) => {
      if (isEditMode && (e.target.tagName === 'BUTTON' || e.target.tagName === 'A')) {
        // Solo prevenir si es un elemento editable, no los botones del editor
        if (!e.target.classList.contains('editor-bg-btn') && 
            !e.target.closest('.editor-toolbar')) {
          e.preventDefault();
          e.stopPropagation();
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

  // Agregar/quitar botones de imagen de fondo según el modo
  useEffect(() => {
    if (!contentRef.current) return;

    // Limpiar TODOS los botones existentes primero
    contentRef.current.querySelectorAll('.editor-bg-btn').forEach(btn => btn.remove());

    // Solo agregar botones si estamos en modo edición
    if (isEditMode) {
      // Agregar botones a elementos contenedores
      contentRef.current.querySelectorAll('section, div, header, main').forEach(element => {
        // Solo si el elemento tiene cierto tamaño (evitar divs pequeños)
        const rect = element.getBoundingClientRect();
        if (rect.width > 200 && rect.height > 100) {
          element.style.position = 'relative';

          const btn = document.createElement('button');
          btn.className = 'editor-bg-btn';
          btn.innerText = '🖼️ Fondo';
          btn.style.cssText = `
          position: absolute;
          top: 10px;
          right: 10px;
          background: rgba(59, 130, 246, 0.9);
          color: white;
          border: none;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          cursor: pointer;
          z-index: 1000;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

          btn.onclick = () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = e => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = ev => {
                  element.style.backgroundImage = `url(${ev.target.result})`;
                  element.style.backgroundSize = 'cover';
                  element.style.backgroundPosition = 'center';
                  element.style.backgroundRepeat = 'no-repeat';

                  // Guardar cambios
                  if (contentRef.current) {
                    const clone = contentRef.current.cloneNode(true);
                    clone.querySelectorAll('.editor-bg-btn').forEach(btn => btn.remove());
                    localStorage.setItem('editableHtml', clone.innerHTML);
                    setHtmlContent(clone.innerHTML);
                  }
                };
                reader.readAsDataURL(file);
              }
            };
            input.click();
          };

          element.appendChild(btn);
        }
      });
    }
  }, [isEditMode, htmlContent]);

  // Guardar cambios - CON LIMPIEZA COMPLETA
  const handleSaveChanges = () => {
    if (!contentRef.current) return;

    // Limpiar botones de fondo antes de guardar
    contentRef.current.querySelectorAll('.editor-bg-btn').forEach(btn => btn.remove());
    
    // LIMPIEZA RADICAL antes de guardar
    const allElements = contentRef.current.querySelectorAll('*');
    allElements.forEach(el => {
      el.removeAttribute('contenteditable');
      el.style.outline = '';
      el.style.outlineOffset = '';
      el.style.pointerEvents = '';
    });

    const clone = contentRef.current.cloneNode(true);
    localStorage.setItem('editableHtml', clone.innerHTML);
    setHtmlContent(clone.innerHTML);
    setIsEditMode(false);

    // Mostrar mensaje de éxito
    setSaveMessage('Cambios guardados exitosamente');

    // Limpiar mensaje después de 3 segundos
    setTimeout(() => {
      setSaveMessage('');
    }, 3000);
  };

  return (
    <div>
      {/* Toolbar Moderno Mobile-First */}
      <div className="editor-toolbar" ref={toolbarRef}>
        {/* Sección Principal - Siempre visible */}
        <div className="toolbar-main">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`edit-mode-btn ${isEditMode ? 'active' : ''}`}
            aria-label={isEditMode ? 'Salir de edición' : 'Activar edición'}
          >
            <PencilIcon />
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
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="btn-text">Guardar</span>
            </button>
          )}
        </div>

        {/* Instrucciones - Responsive */}
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