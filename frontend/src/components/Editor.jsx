import { useState, useEffect, useRef } from 'react';
import '../styles/Editor.css';

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

function Editor() {
  const [htmlContent, setHtmlContent] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedElement, setSelectedElement] = useState(null);
  const [color, setColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
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

  // Activa edición de texto y color en elementos editables
  useEffect(() => {
    if (!contentRef.current) return;
    contentRef.current.querySelectorAll('[data-editable="true"]').forEach(el => {
      el.setAttribute('contentEditable', isEditMode);
      el.style.outline = isEditMode ? '2px dashed #007bff' : 'none';
    });
  }, [isEditMode, htmlContent]);

  // Selección y edición de color
  useEffect(() => {
    if (!isEditMode || !contentRef.current) return;
    const node = contentRef.current;
    const handleClick = e => {
      if (e.target.getAttribute('data-editable') === 'true') {
        setSelectedElement(e.target);
        setColor(e.target.style.backgroundColor || window.getComputedStyle(e.target).backgroundColor);
        setTextColor(e.target.style.color || window.getComputedStyle(e.target).color);
      } else {
        setSelectedElement(null);
      }
    };
    node.addEventListener('click', handleClick);
    return () => node.removeEventListener('click', handleClick);
  }, [isEditMode, htmlContent]);

  // Hover visual
  useEffect(() => {
    if (!isEditMode || !contentRef.current) return;
    const node = contentRef.current;
    const over = e => e.target.getAttribute('data-editable') === 'true' && e.target.classList.add('tw-ring', 'tw-ring-blue-400', 'tw-ring-2');
    const out = e => e.target.getAttribute('data-editable') === 'true' && e.target.classList.remove('tw-ring', 'tw-ring-blue-400', 'tw-ring-2');
    node.addEventListener('mouseover', over);
    node.addEventListener('mouseout', out);
    return () => {
      node.removeEventListener('mouseover', over);
      node.removeEventListener('mouseout', out);
    };
  }, [isEditMode, htmlContent]);

  // Imagen
  useEffect(() => {
    if (!contentRef.current || !isEditMode) return;
    contentRef.current.querySelectorAll('.editor-change-image-btn').forEach(btn => btn.remove());
    contentRef.current.querySelectorAll('[data-image-placeholder="true"], [class*="hero"]').forEach(section => {
      section.style.position = 'relative';
      const btn = document.createElement('button');
      btn.className = 'editor-change-image-btn';
      btn.innerText = 'Cambiar Imagen';
      btn.onclick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = ev => {
              if (section.matches('[class*="hero"]')) {
                section.style.backgroundImage = `url(${ev.target.result})`;
              } else {
                const img = section.querySelector('img') || document.createElement('img');
                img.src = ev.target.result;
                img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover';
                section.innerHTML = '';
                section.style.border = 'none';
                section.appendChild(img);
              }
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      };
      section.appendChild(btn);
    });
  }, [isEditMode, htmlContent]);

  function getEditableIndex(element) {
    if (!contentRef.current) return -1;
    const all = Array.from(contentRef.current.querySelectorAll('[data-editable="true"]'));
    return all.indexOf(element);
  }

  // Color inline directo
  function handleColorChange(type, value) {
    if (!selectedElement) return;
    // 1. Obtener el índice del elemento editable
    const idx = getEditableIndex(selectedElement);
    if (idx === -1) return;

    // 2. Parsear el HTML y buscar el elemento editable por índice
    const parser = new window.DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const editables = doc.querySelectorAll('[data-editable="true"]');
    const el = editables[idx];
    if (!el) return;

    // 3. Modificar el atributo style
    if (type === 'bg') {
      el.style.backgroundColor = value;
      setColor(value);
    } else {
      el.style.color = value;
      setTextColor(value);
    }

    // 4. Actualizar el HTML y el estado
    const newHtml = doc.body.innerHTML;
    setHtmlContent(newHtml);
    localStorage.setItem('editableHtml', newHtml);
  }

  // Guardar
  const handleSaveChanges = () => {
    if (!contentRef.current) return;
    const clone = contentRef.current.cloneNode(true);
    clone.querySelectorAll('.editor-change-image-btn').forEach(btn => btn.remove());
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
        {isEditMode && selectedElement && (
          <div className="flex items-center gap-6 bg-blue-50 px-4 py-2 rounded-xl shadow">
            <span className="font-bold text-blue-600 uppercase">Editando: <span className="bg-blue-100 px-2 rounded">{selectedElement.tagName.toLowerCase()}</span></span>
            <label className="flex items-center gap-2">
              <span>Fondo:</span>
              <input type="color" value={color} onChange={e => handleColorChange('bg', e.target.value)} className="w-8 h-8 rounded-full border border-gray-300" />
            </label>
            <label className="flex items-center gap-2">
              <span>Texto:</span>
              <input type="color" value={textColor} onChange={e => handleColorChange('text', e.target.value)} className="w-8 h-8 rounded-full border border-gray-300" />
            </label>
            <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-semibold shadow" onClick={() => setSelectedElement(null)}>Cerrar</button>
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