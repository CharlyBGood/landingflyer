import React, { useState } from 'react';
import TemplateEditor from '../TemplateEditor';
import AgencyTemplate from '../../templates/AgencyTemplate';

/**
 * Demo del editor universal de templates
 * 
 * Este componente demuestra cómo usar el TemplateEditor universal
 * con cualquier template existente sin necesidad de crear versiones "editables"
 */
const TemplateEditorDemo = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Template de ejemplo (normalmente vendría de la selección del usuario)
  const exampleTemplate = {
    id: "agency",
    name: "Agencia Creativa",
    description: "Template moderno para estudios creativos",
    component: AgencyTemplate
  };

  const handleOpenEditor = () => {
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
  };

  const handleSaveEdits = (editedContent) => {
    console.log('Contenido editado:', editedContent);
    // Aquí puedes guardar los cambios, enviarlos a un servidor, etc.
    
    // Ejemplo de estructura del contenido editado:
    // {
    //   text_0: "Nuevo título",
    //   text_1: "Nueva descripción",
    //   image_0: "https://nueva-imagen.jpg",
    //   color_0: "#ff5722",
    //   bgcolor_0: "#000000"
    // }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Editor Universal de Templates</h1>
        <p className="text-gray-600 mb-6">
          Este editor puede analizar automáticamente cualquier template y generar controles de edición
          para textos, imágenes y colores sin necesidad de crear versiones "editables" específicas.
        </p>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">🚀 Características principales:</h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            <li><strong>Análisis automático:</strong> Extrae elementos editables del DOM</li>
            <li><strong>Edición en tiempo real:</strong> Los cambios se aplican inmediatamente</li>
            <li><strong>Modo de edición directa:</strong> Click directo en elementos del template</li>
            <li><strong>Preview responsivo:</strong> Vista previa en diferentes dispositivos</li>
            <li><strong>Universal:</strong> Funciona con cualquier template React existente</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-2">✨ Cómo funciona:</h3>
          <ol className="list-decimal list-inside text-green-700 space-y-1">
            <li>El editor renderiza el template React directamente</li>
            <li>Analiza el DOM para encontrar elementos editables (h1-h6, p, img, etc.)</li>
            <li>Genera automáticamente controles de edición organizados por categorías</li>
            <li>Permite edición directa haciendo click en los elementos</li>
            <li>Aplica cambios en tiempo real y mantiene el estado</li>
          </ol>
        </div>
      </div>

      {/* Template Preview */}
      <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold">{exampleTemplate.name}</h2>
            <p className="text-sm text-gray-600">{exampleTemplate.description}</p>
          </div>
          <button
            onClick={handleOpenEditor}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Abrir Editor
          </button>
        </div>
        
        <div className="aspect-video bg-white">
          <AgencyTemplate />
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">📝 Instrucciones de uso:</h3>
        <div className="space-y-3 text-sm text-gray-700">
          <div>
            <strong>1. Seleccionar elementos:</strong> Use las pestañas "Texto", "Colores" e "Imágenes" 
            para navegar entre diferentes tipos de contenido editable.
          </div>
          <div>
            <strong>2. Edición directa:</strong> Active el "Modo de Edición Directa" para hacer click 
            directamente en los elementos del template y editarlos.
          </div>
          <div>
            <strong>3. Preview responsivo:</strong> Use los controles de dispositivo (Móvil, Tablet, Desktop) 
            para ver cómo se ve el template en diferentes tamaños de pantalla.
          </div>
          <div>
            <strong>4. Guardar cambios:</strong> Use el botón "Guardar" para persistir los cambios 
            o "Reset" para volver a los valores originales.
          </div>
        </div>
      </div>

      {/* Editor Component */}
      <TemplateEditor
        isOpen={isEditorOpen}
        onClose={handleCloseEditor}
        template={exampleTemplate}
        onSave={handleSaveEdits}
      />
    </div>
  );
};

export default TemplateEditorDemo;