import { useEffect, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import BackgroundImageButton from '../components/editor/BackgroundImageButton';
import { DOMUtils, BG_BUTTON_CONFIG } from '../utilities/domUtils';

export const useBackgroundButtons = (contentRef, isEditMode, onImageChange) => {
  useEffect(() => {
    if (!contentRef.current) return;

    // Limpieza inicial usando utilidades centralizadas
    DOMUtils.removeBackgroundContainers(contentRef.current);
    DOMUtils.removeBackgroundClasses(contentRef.current);

    if (isEditMode) {
      // Obtener elementos válidos usando utilidades centralizadas
      const validElements = DOMUtils.getValidBackgroundTargets(contentRef.current);

      validElements.forEach((element, index) => {
        try {
          // Asignar ID si no existe
          if (!element.id) {
            element.id = `${BG_BUTTON_CONFIG.ID_PREFIX}${index + 1}`;
          }

          element.classList.add('has-bg-button');

          // Crear contenedor del botón
          const buttonContainer = document.createElement('div');
          buttonContainer.className = 'bg-btn-container';

          // Renderizar componente React
          const root = createRoot(buttonContainer);
          root.render(
            createElement(BackgroundImageButton, {
              targetElement: element,
              onImageChange: onImageChange,
              variant: element.tagName === 'SECTION' ? 'success' : 'primary'
            })
          );

          element.appendChild(buttonContainer);

        } catch (error) {
          console.error('❌ Error agregando botón:', error);
        }
      });
    }

    // Cleanup usando utilidades centralizadas
    return () => {
      if (contentRef.current) {
        DOMUtils.removeBackgroundContainers(contentRef.current);
        DOMUtils.removeBackgroundClasses(contentRef.current);
      }
    };
  }, [isEditMode, contentRef, onImageChange]);
};
