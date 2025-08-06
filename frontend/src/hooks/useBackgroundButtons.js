import { useEffect, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import BackgroundImageButton from '../components/editor/BackgroundImageButton';


export const useBackgroundButtons = (contentRef, isEditMode, onImageChange) => {
  useEffect(() => {
    if (!contentRef.current) return;

    // Limpiar botones existentes
    const existingContainers = contentRef.current.querySelectorAll('.bg-btn-container');
    existingContainers.forEach(container => container.remove());

    // Limpiar clases de elementos previos
    const prevElements = contentRef.current.querySelectorAll('.has-bg-button');
    prevElements.forEach(element => {
      element.classList.remove('has-bg-button');
    });

    
    if (isEditMode) {      
      const selectors = [
        'section',
        '.card',
        '.service',
        'main'
      ];

      const validElements = [];

      selectors.forEach(selector => {
        const elements = contentRef.current.querySelectorAll(selector);

        elements.forEach(element => {
          // Filtro de tamaño ESTRICTO
          const rect = element.getBoundingClientRect();
          if (rect.width < 300 || rect.height < 150) return;

          // Evitar duplicados
          if (element.querySelector('.bg-btn-container')) return;

          // No agregar si ya está en la lista
          if (validElements.includes(element)) return;

          validElements.push(element);
        });
      });

      // Limitar a máximo 6 elementos para evitar sobrecarga
      const finalElements = validElements.slice(0, 6);

      console.log(`✅ Agregando botones a ${finalElements.length} elementos`);

      finalElements.forEach((element, index) => {
        try {
          // Crear ID único si no existe
          if (!element.id) {
            element.id = `bg-element-${index + 1}`;
          }

          element.classList.add('has-bg-button');

          // Crear botón
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'bg-btn-container';

          const root = createRoot(buttonContainer);
          root.render(
            createElement(BackgroundImageButton, {
              targetElement: element,
              onImageChange: onImageChange,
              variant: element.tagName === 'SECTION' ? 'success' : 'primary'
            })
          );

          element.appendChild(buttonContainer);

          console.log(`✅ Botón agregado a: ${element.tagName} (${element.id})`);

        } catch (error) {
          console.error('❌ Error agregando botón:', error);
        }
      });
    }

    // Cleanup
    return () => {
      if (contentRef.current) {
        contentRef.current.querySelectorAll('.bg-btn-container').forEach(container => container.remove());
        contentRef.current.querySelectorAll('.has-bg-button').forEach(element => {
          element.classList.remove('has-bg-button');
        });
      }
    };
  }, [isEditMode, contentRef, onImageChange]);
};
