import { useState, useEffect, useRef } from 'react';
import '../styles/Editor.css';

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

function Editor() {
  const [htmlContent, setHtmlContent] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const contentRef = useRef(null);

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

  // Activa edición de texto - SIMPLE
  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.querySelectorAll('[data-editable="true"]').forEach(el => {
      if (isEditMode) {
        el.setAttribute('contentEditable', 'true');
        el.style.outline = '2px dashed #007bff';
      } else {
        el.setAttribute('contentEditable', 'false');
        el.style.outline = 'none';
      }
    });
  }, [isEditMode, htmlContent]);

  // Agregar botones de imagen de fondo - SIMPLE
  useEffect(() => {
    if (!contentRef.current || !isEditMode) return;
    
    // Limpiar botones existentes
    contentRef.current.querySelectorAll('.editor-bg-btn').forEach(btn => btn.remove());
    
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
  }, [isEditMode, htmlContent]);

  // Guardar cambios - SIMPLE
  const handleSaveChanges = () => {
    if (!contentRef.current) return;
    const clone = contentRef.current.cloneNode(true);
    localStorage.setItem('editableHtml', clone.innerHTML);
    setHtmlContent(clone.innerHTML);
    setIsEditMode(false);
    alert('Cambios guardados. Puedes cerrar esta pestaña.');
  };

  return (
    <div>
      <div className="editor-toolbar flex items-center justify-between bg-white shadow-lg px-8 py-4 fixed top-0 left-0 w-full z-50 gap-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setIsEditMode(!isEditMode)} className={`edit-mode-btn px-4 py-2 rounded bg-blue-500 text-white font-bold hover:bg-blue-600 transition ${isEditMode ? 'ring ring-blue-300' : ''}`}>
            <PencilIcon />
            {isEditMode ? 'Salir de Edición' : 'Activar Edición'}
          </button>
          {isEditMode && (
            <button onClick={handleSaveChanges} className='save-changes-btn px-4 py-2 rounded bg-green-500 text-white font-bold hover:bg-green-600 transition'>Guardar Cambios</button>
          )}
        </div>
        {isEditMode && (
          <div className="bg-green-50 px-4 py-2 rounded-xl shadow text-sm">
            <span className="text-green-700 font-semibold">💡 Instrucciones:</span>
            <span className="text-green-600 ml-2">Click directamente en cualquier texto para editarlo</span>
          </div>
        )}
      </div>
      <div
        ref={contentRef}
        className="mt-28"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}

export default Editor;