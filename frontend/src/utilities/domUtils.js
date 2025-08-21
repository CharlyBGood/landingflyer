// Constantes centralizadas para selectores
export const DOM_SELECTORS = {
  BG_BUTTON_CONTAINER: '.bg-btn-container',
  HAS_BG_BUTTON: '.has-bg-button',
  EDITABLE_ELEMENTS: '[data-editable="true"], button, a',
  ALL_ELEMENTS: '*',
  BACKGROUND_TARGETS: ['section', '.card', '.service', 'main']
};

// Configuración para background buttons
export const BG_BUTTON_CONFIG = {
  MIN_WIDTH: 300,
  MIN_HEIGHT: 150,
  MAX_BUTTONS: 6,
  ID_PREFIX: 'bg-element-'
};

// Utilidades DOM centralizadas
export const DOMUtils = {
  // Limpieza de contenedores de botones de background
  removeBackgroundContainers(container) {
    if (!container) return;
    container.querySelectorAll(DOM_SELECTORS.BG_BUTTON_CONTAINER)
      .forEach(element => element.remove());
  },

  // Limpieza de clases has-bg-button
  removeBackgroundClasses(container) {
    if (!container) return;
    container.querySelectorAll(DOM_SELECTORS.HAS_BG_BUTTON)
      .forEach(element => element.classList.remove('has-bg-button'));
  },

  // Limpieza de atributos contenteditable
  removeContentEditableAttributes(container) {
    if (!container) return;
    container.querySelectorAll(DOM_SELECTORS.ALL_ELEMENTS)
      .forEach(element => element.removeAttribute('contenteditable'));
  },

  // Aplicar atributos contenteditable
  applyContentEditableAttributes(container) {
    if (!container) return;
    container.querySelectorAll(DOM_SELECTORS.EDITABLE_ELEMENTS)
      .forEach(element => element.setAttribute('contenteditable', 'true'));
  },

  // Limpieza completa de elementos de edición
  cleanAllEditingElements(container) {
    if (!container) return;
    this.removeBackgroundContainers(container);
    this.removeBackgroundClasses(container);
    // Eliminar overlays de edición de imagen
    container.querySelectorAll('.img-replace-btn').forEach(btn => btn.remove());
    // IMPORTANTE: Remover contentEditable para publicación
    this.removeContentEditableAttributes(container);
  },

  // Validar si un elemento es válido para botón de background
  isValidBackgroundTarget(element) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    return rect.width >= BG_BUTTON_CONFIG.MIN_WIDTH && 
           rect.height >= BG_BUTTON_CONFIG.MIN_HEIGHT;
  },

  // Obtener elementos válidos para background buttons
  getValidBackgroundTargets(container) {
    if (!container) return [];

    const validElements = [];
    
    DOM_SELECTORS.BACKGROUND_TARGETS.forEach(selector => {
      const elements = container.querySelectorAll(selector);
      
      elements.forEach(element => {
        // Validaciones
        if (!this.isValidBackgroundTarget(element)) return;
        if (element.querySelector(DOM_SELECTORS.BG_BUTTON_CONTAINER)) return;
        if (validElements.includes(element)) return;
        
        validElements.push(element);
      });
    });

    return validElements.slice(0, BG_BUTTON_CONFIG.MAX_BUTTONS);
  }
};
