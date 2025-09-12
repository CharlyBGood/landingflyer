import React, { useState, useEffect, useRef } from 'react';
import { X, Type, Palette, Image, Save, RotateCcw, Monitor, Smartphone, Tablet, Edit3 } from 'lucide-react';

const TemplateEditor = ({
  isOpen,
  onClose,
  template,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('text');
  const [previewDevice, setPreviewDevice] = useState('desktop');
  const [isEditMode, setIsEditMode] = useState(false);
  const [extractedContent, setExtractedContent] = useState({
    texts: [],
    images: [],
    colors: []
  });
  const [editedContent, setEditedContent] = useState({});
  const templateRef = useRef(null);

  // Analiza el template automáticamente para extraer elementos editables
  const analyzeTemplate = React.useCallback(() => {
    const templateContainer = templateRef.current;
    if (!templateContainer) return;

    const texts = [];
    const images = [];
    const colors = [];

    // Extraer elementos de texto editables
    const textElements = templateContainer.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a, div[class*="text"], div[class*="title"]');
    textElements.forEach((element, index) => {
      if (element.textContent.trim()) {
        const id = `text_${index}`;
        texts.push({
          id,
          content: element.textContent,
          type: getTextType(element),
          element: element,
          selector: getElementSelector(element)
        });
      }
    });

    // Extraer imágenes
    const imageElements = templateContainer.querySelectorAll('img');
    imageElements.forEach((img, index) => {
      const id = `image_${index}`;
      images.push({
        id,
        src: img.src,
        alt: img.alt || `Imagen ${index + 1}`,
        element: img,
        selector: getElementSelector(img)
      });
    });

    // Sistema mejorado de detección de colores para Tailwind CSS
    const colorMap = extractTailwindColors(templateContainer);
    colorMap.forEach((colorInfo, index) => {
      colors.push({
        id: `color_${index}`,
        value: colorInfo.value,
        name: colorInfo.name,
        type: colorInfo.type,
        property: colorInfo.property,
        element: colorInfo.element,
        selector: getElementSelector(colorInfo.element),
        className: colorInfo.className
      });
    });

    setExtractedContent({ texts, images, colors });
    
    // Inicializar contenido editado con valores actuales
    const initialContent = {};
    texts.forEach(text => initialContent[text.id] = text.content);
    images.forEach(img => initialContent[img.id] = img.src);
    colors.forEach(color => initialContent[color.id] = color.value);
    
    setEditedContent(initialContent);
  }, []);

  useEffect(() => {
    if (isOpen && template && templateRef.current) {      
      const timer = setTimeout(() => {
        analyzeTemplate();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, template, analyzeTemplate]);

  // Función para extraer colores de clases Tailwind CSS
  const extractTailwindColors = (container) => {
    const colorElements = [];
    const elements = container.querySelectorAll('*');
    
    // Mapeo de colores Tailwind comunes
    const tailwindColorMap = {
      'text-white': '#ffffff',
      'text-black': '#000000',
      'text-gray-300': '#d1d5db',
      'text-gray-600': '#4b5563',
      'text-gray-900': '#111827',
      'text-orange-500': '#f97316',
      'text-red-500': '#ef4444',
      'text-blue-500': '#3b82f6',
      'text-green-500': '#10b981',
      'text-purple-500': '#8b5cf6',
      'text-yellow-500': '#eab308',
      'bg-black': '#000000',
      'bg-white': '#ffffff',
      'bg-gray-100': '#f3f4f6',
      'bg-gray-900': '#111827',
      'bg-orange-500': '#f97316',
      'bg-red-500': '#ef4444',
      'bg-blue-500': '#3b82f6',
      'bg-green-500': '#10b981',
      'bg-purple-500': '#8b5cf6',
      'bg-yellow-500': '#eab308'
    };

    elements.forEach((element) => {
      const classList = Array.from(element.classList);
      
      classList.forEach(className => {
        // Detectar clases de texto
        if (className.startsWith('text-') && tailwindColorMap[className]) {
          colorElements.push({
            value: tailwindColorMap[className],
            name: `Color de texto (${className})`,
            type: 'text',
            property: 'color',
            element: element,
            className: className
          });
        }
        
        // Detectar clases de fondo
        if (className.startsWith('bg-') && tailwindColorMap[className]) {
          colorElements.push({
            value: tailwindColorMap[className],
            name: `Color de fondo (${className})`,
            type: 'background',
            property: 'backgroundColor',
            element: element,
            className: className
          });
        }
      });

      // También verificar estilos inline como antes
      const style = element.style;
      if (style.color) {
        colorElements.push({
          value: style.color,
          name: `Color inline`,
          type: 'text',
          property: 'color',
          element: element,
          className: null
        });
      }
      
      if (style.backgroundColor) {
        colorElements.push({
          value: style.backgroundColor,
          name: `Fondo inline`,
          type: 'background',
          property: 'backgroundColor',
          element: element,
          className: null
        });
      }
    });

    // Eliminar duplicados basados en elemento y tipo
    const uniqueColors = [];
    const seen = new Set();
    
    colorElements.forEach(color => {
      const key = `${color.element.tagName}-${color.type}-${color.value}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueColors.push(color);
      }
    });

    return uniqueColors;
  };

  const getTextType = (element) => {
    const tagName = element.tagName.toLowerCase();
    if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tagName)) return 'heading';
    if (tagName === 'button') return 'button';
    if (tagName === 'a') return 'link';
    return 'paragraph';
  };

  const getElementSelector = (element) => {
    // Genera un selector CSS para el elemento
    let selector = element.tagName.toLowerCase();
    if (element.id) selector += `#${element.id}`;
    if (element.className) selector += `.${element.className.split(' ').join('.')}`;
    return selector;
  };

  const updateText = (id, newContent) => {
    const textItem = extractedContent.texts.find(t => t.id === id);
    if (textItem && textItem.element) {
      textItem.element.textContent = newContent;
      setEditedContent(prev => ({...prev, [id]: newContent}));
    }
  };

  const updateImage = (id, newSrc) => {
    const imageItem = extractedContent.images.find(i => i.id === id);
    if (imageItem && imageItem.element) {
      imageItem.element.src = newSrc;
      setEditedContent(prev => ({...prev, [id]: newSrc}));
    }
  };

  const updateColor = (id, newValue) => {
    const colorItem = extractedContent.colors.find(c => c.id === id);
    if (colorItem && colorItem.element) {
      if (colorItem.className) {
        // Si es una clase Tailwind, cambiar a estilo inline
        colorItem.element.style[colorItem.property] = newValue;
      } else {
        // Si ya es un estilo inline, simplemente actualizarlo
        colorItem.element.style[colorItem.property] = newValue;
      }
      setEditedContent(prev => ({...prev, [id]: newValue}));
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(editedContent);
    }
    // Limpiar modo de edición si está activo
    if (isEditMode) {
      disableDirectEditing();
      setIsEditMode(false);
    }
    onClose();
  };

  const handleReset = () => {
    analyzeTemplate(); // Re-analizar para restaurar valores originales
  };

  const toggleEditMode = () => {
    const newEditMode = !isEditMode;
    setIsEditMode(newEditMode);
    
    if (newEditMode) {
      enableDirectEditing();
    } else {
      disableDirectEditing();
    }
  };

  const enableDirectEditing = () => {
    const templateContainer = templateRef.current;
    if (!templateContainer) return;

    // Agregar listeners para edición directa de texto
    const textElements = templateContainer.querySelectorAll('h1, h2, h3, h4, h5, h6, p, span, button, a');
    textElements.forEach(element => {
      if (element.textContent.trim()) {
        element.style.outline = '2px dashed #3b82f6';
        element.style.cursor = 'text';
        element.setAttribute('data-editable', 'true');
        element.addEventListener('click', handleDirectTextEdit);
      }
    });

    const imageElements = templateContainer.querySelectorAll('img');
    imageElements.forEach(element => {
      element.style.outline = '2px dashed #10b981';
      element.style.cursor = 'pointer';
      element.setAttribute('data-editable', 'true');
      element.addEventListener('click', handleDirectImageEdit);
    });

    // Agregar indicador visual
    const indicator = document.createElement('div');
    indicator.id = 'edit-mode-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #3b82f6;
      color: white;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 1000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    indicator.textContent = '✏️ Modo edición activo - Click en elementos para editar';
    document.body.appendChild(indicator);
  };

  const disableDirectEditing = () => {
    const templateContainer = templateRef.current;
    if (!templateContainer) return;

    const allElements = templateContainer.querySelectorAll('[data-editable="true"]');
    allElements.forEach(element => {
      element.style.outline = '';
      element.style.cursor = '';
      element.removeAttribute('data-editable');
      element.removeEventListener('click', handleDirectTextEdit);
      element.removeEventListener('click', handleDirectImageEdit);
    });

    // Remover indicador visual
    const indicator = document.getElementById('edit-mode-indicator');
    if (indicator) {
      indicator.remove();
    }
  };

  const handleDirectTextEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.target;
    const textItem = extractedContent.texts.find(t => t.element === element);
    if (textItem) {
      const newText = prompt('Editar texto:', textItem.content);
      if (newText !== null && newText.trim()) {
        updateText(textItem.id, newText);
      }
    }
  };

  const handleDirectImageEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const element = e.target;
    const imageItem = extractedContent.images.find(i => i.element === element);
    if (imageItem) {
      const newSrc = prompt('URL de la nueva imagen:', imageItem.src);
      if (newSrc !== null && newSrc.trim()) {
        updateImage(imageItem.id, newSrc);
      }
    }
  };

  const getDeviceSize = () => {
    switch (previewDevice) {
      case 'mobile':
        return { 
          width: '375px', 
          height: '667px',
          containerWidth: '375px',
          scale: 1
        };
      case 'tablet':
        return { 
          width: '768px', 
          height: '1024px',
          containerWidth: '768px',
          scale: 0.8 // Escalar un poco para que quepa mejor
        };
      default:
        return { 
          width: '100%', 
          height: '800px',
          containerWidth: '1200px',
          scale: 1
        };
    }
  };

  // Aplicar estilos cuando cambie el dispositivo de preview
  useEffect(() => {
    const templateContainer = templateRef.current;
    if (!templateContainer) return;

    // Remover estilos previos
    templateContainer.style.transform = '';
    templateContainer.style.transformOrigin = '';
    templateContainer.style.width = '';

    // Configuración del dispositivo inline
    let deviceConfig;
    switch (previewDevice) {
      case 'mobile':
        deviceConfig = { 
          containerWidth: '375px',
          scale: 1
        };
        break;
      case 'tablet':
        deviceConfig = { 
          containerWidth: '768px',
          scale: 0.8
        };
        break;
      default:
        deviceConfig = { 
          containerWidth: '1200px',
          scale: 1
        };
    }
    
    if (previewDevice !== 'desktop') {
      // Simular viewport del dispositivo
      templateContainer.style.width = deviceConfig.containerWidth;
      
      // Si es necesario escalar para que quepa
      if (deviceConfig.scale !== 1) {
        templateContainer.style.transform = `scale(${deviceConfig.scale})`;
        templateContainer.style.transformOrigin = 'top left';
      }
    } else {
      templateContainer.style.width = '100%';
    }
  }, [previewDevice]);

  // Cleanup simple al desmontar
  useEffect(() => {
    return () => {
      const indicator = document.getElementById('edit-mode-indicator');
      if (indicator) {
        indicator.remove();
      }
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50">
      <div className="flex h-screen">
        {/* Sidebar Controls */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Editor Universal</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Template Info */}
            <div className="mb-4">
              <h3 className="font-medium text-gray-900">{template?.name}</h3>
              <p className="text-sm text-gray-600">{template?.description}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Guardar
              </button>
              <button
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>

            {/* Edit Mode Toggle */}
            <button
              onClick={toggleEditMode}
              className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                isEditMode 
                  ? 'bg-green-100 text-green-800 border border-green-300' 
                  : 'bg-gray-100 text-gray-700 border border-gray-300'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              {isEditMode ? 'Salir de Edición Directa' : 'Activar Edición Directa'}
            </button>
          </div>

          {/* Tabs */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
              <button
                onClick={() => setActiveTab('text')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'text'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Type className="w-4 h-4" />
                <span className="hidden sm:inline">Texto</span>
              </button>
              <button
                onClick={() => setActiveTab('colors')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'colors'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Colores</span>
              </button>
              <button
                onClick={() => setActiveTab('images')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'images'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Image className="w-4 h-4" />
                <span className="hidden sm:inline">Imágenes</span>
              </button>
            </div>

            {/* Device Preview Controls */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-4">
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  previewDevice === 'mobile'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Móvil</span>
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  previewDevice === 'tablet'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Tablet className="w-4 h-4" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                  previewDevice === 'desktop'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
            </div>
          </div>

          {/* Content Controls */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Text Tab */}
            {activeTab === 'text' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 mb-3">Textos Editables</h4>
                {extractedContent.texts?.map((text) => (
                  <div key={text.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 capitalize">
                      {text.type}: {text.id}
                    </label>
                    {text.type === 'paragraph' ? (
                      <textarea
                        value={editedContent[text.id] || text.content}
                        onChange={(e) => updateText(text.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    ) : (
                      <input
                        type="text"
                        value={editedContent[text.id] || text.content}
                        onChange={(e) => updateText(text.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    )}
                  </div>
                ))}
                {extractedContent.texts.length === 0 && (
                  <p className="text-gray-500 text-sm">No se encontraron textos editables en este template.</p>
                )}
              </div>
            )}

            {/* Colors Tab */}
            {activeTab === 'colors' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 mb-3">Paleta de Colores</h4>
                {extractedContent.colors?.map((color) => (
                  <div key={color.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {color.name}
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={editedContent[color.id] || color.value}
                        onChange={(e) => updateColor(color.id, e.target.value)}
                        className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={editedContent[color.id] || color.value}
                        onChange={(e) => updateColor(color.id, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                ))}
                {extractedContent.colors.length === 0 && (
                  <p className="text-gray-500 text-sm">No se encontraron colores editables en este template.</p>
                )}
              </div>
            )}

            {/* Images Tab */}
            {activeTab === 'images' && (
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 mb-3">Imágenes</h4>
                {extractedContent.images?.map((image) => (
                  <div key={image.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {image.alt}
                    </label>
                    <div className="space-y-2">
                      <img
                        src={editedContent[image.id] || image.src}
                        alt={image.alt}
                        className="w-full h-32 object-cover rounded border border-gray-300"
                      />
                      <input
                        type="url"
                        value={editedContent[image.id] || image.src}
                        onChange={(e) => updateImage(image.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="URL de la imagen"
                      />
                    </div>
                  </div>
                ))}
                {extractedContent.images.length === 0 && (
                  <p className="text-gray-500 text-sm">No se encontraron imágenes editables en este template.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-gray-100 flex items-center justify-center p-8">
          <div 
            className="bg-white shadow-xl overflow-hidden transition-all duration-300 relative"
            style={{
              width: getDeviceSize().width,
              height: getDeviceSize().height,
              maxWidth: '100%',
              maxHeight: '100%'
            }}
          >
            {/* Header del dispositivo para contexto visual */}
            <div className="absolute top-0 left-0 right-0 bg-gray-800 text-white text-xs px-3 py-1 flex justify-between items-center z-10">
              <span className="capitalize">{previewDevice} Preview</span>
              <span className="text-gray-300">
                {previewDevice === 'mobile' && '375x667'}
                {previewDevice === 'tablet' && '768x1024'}
                {previewDevice === 'desktop' && 'Responsive'}
              </span>
            </div>
            
            <div className="w-full h-full overflow-auto pt-6">
              {/* Container que simula el viewport del dispositivo */}
              <div 
                ref={templateRef} 
                className="min-h-full"
                style={{
                  width: previewDevice === 'desktop' ? '100%' : getDeviceSize().containerWidth,
                  transform: getDeviceSize().scale !== 1 ? `scale(${getDeviceSize().scale})` : 'none',
                  transformOrigin: 'top left'
                }}
              >
                {template?.component && <template.component />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateEditor;