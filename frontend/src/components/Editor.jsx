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