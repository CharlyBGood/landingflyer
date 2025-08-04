import { useState, useEffect, useRef } from 'react';
import '../styles/Editor.css'; 

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
);

function Editor() {
  const [htmlContent, setHtmlContent] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const contentRef = useRef(null);

  useEffect(() => {
    const storedHtml = localStorage.getItem('editableHtml');
    if (storedHtml) {
      setHtmlContent(storedHtml);
    } else {
      setHtmlContent('<h1>No hay contenido para editar. Genera una vista previa en la página principal.</h1>');
    }
  }, []);

  const handleSaveChanges = () => {
    if (!contentRef.current) return;
    const clone = contentRef.current.cloneNode(true);
    clone.querySelectorAll('.editor-change-image-btn').forEach(btn => btn.remove());

    const finalHtml = clone.innerHTML;
    localStorage.setItem('editableHtml', finalHtml);
    setIsEditMode(false);
    alert('Cambios guardados. Puedes cerrar esta pestaña.');
  };

  // Activa/desactiva la interactividad del modo edición
  useEffect(() => {
    if (!contentRef.current) return;

    contentRef.current.querySelectorAll('.editor-change-image-btn').forEach(btn => btn.remove());

    contentRef.current.querySelectorAll('[data-editable="true"]').forEach(el => {
      el.setAttribute('contentEditable', isEditMode);
      el.style.outline = isEditMode ? '2px dashed #007bff' : 'none';
    });

    if (isEditMode) {
      const handleImageChange = (element, isBackground) => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = e => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = event => {
              if (isBackground) {
                element.style.backgroundImage = `url(${event.target.result})`;
              } else {
                const img = element.querySelector('img') || document.createElement('img');
                img.src = event.target.result;
                img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover';
                element.innerHTML = '';
                element.style.border = 'none';
                element.appendChild(img);
              }
            };
            reader.readAsDataURL(file);
          }
        };
        input.click();
      };

      contentRef.current.querySelectorAll('[data-image-placeholder="true"], [class*="hero"]').forEach(section => {
        section.style.position = 'relative';
        const changeBtn = document.createElement('button');
        changeBtn.className = 'editor-change-image-btn'; // Usamos una clase de Editor.css
        changeBtn.innerText = 'Cambiar Imagen';

        const isBackground = section.matches('[class*="hero"]');
        changeBtn.onclick = () => handleImageChange(section, isBackground);
        section.appendChild(changeBtn);
      });
    }
  }, [isEditMode, htmlContent]);

  return (
    <div>
      <div className="editor-toolbar">
        <button onClick={() => setIsEditMode(!isEditMode)} className={`edit-mode-btn ${isEditMode ? 'active' : ''}`}>
          <PencilIcon />
          {isEditMode ? 'Salir de Edición' : 'Activar Edición'}
        </button>
        {isEditMode && (
          <button onClick={handleSaveChanges} className='save-changes-btn'>Guardar Cambios</button>
        )}
      </div>
      <div
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  );
}

export default Editor;