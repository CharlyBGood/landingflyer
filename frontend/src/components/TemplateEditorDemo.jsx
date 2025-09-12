import React, { useState } from 'react';
import TemplateEditor from '../components/TemplateEditor.jsx';
import EditableAgencyTemplate from '../templates/EditableAgencyTemplate.jsx';
import { defaultAgencyContent } from '../templates/agencyContent.js';

// Ejemplo de template editable con su configuración
const editableTemplates = [
  {
    id: 'agency',
    name: 'Agencia Creativa',
    description: 'Template moderno para agencias y estudios creativos',
    component: EditableAgencyTemplate,
    thumbnail: '/api/image/unsplash?term=creative+agency',
    color: 'from-indigo-500 to-purple-600',
    defaultContent: defaultAgencyContent
  }
  // Aquí se pueden añadir más templates editables
];

const TemplateEditorDemo = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateContent, setTemplateContent] = useState({});

  const handleOpenEditor = (template) => {
    setSelectedTemplate(template);
    setTemplateContent(template.defaultContent);
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    setIsEditorOpen(false);
    setSelectedTemplate(null);
  };

  const handleContentChange = (newContent) => {
    setTemplateContent(newContent);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Editor de Templates - Demo
        </h1>

        {/* Lista de templates editables */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {editableTemplates.map((template) => (
            <div key={template.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={template.thumbnail}
                alt={template.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {template.description}
                </p>
                <button
                  onClick={() => handleOpenEditor(template)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Editar Template
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Vista previa del template actual */}
        {selectedTemplate && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-gray-900">
                Vista Previa: {selectedTemplate.name}
              </h2>
              <p className="text-gray-600">
                Los cambios se reflejan en tiempo real
              </p>
            </div>
            <div className="p-6">
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <selectedTemplate.component content={templateContent} />
              </div>
            </div>
          </div>
        )}

        {/* Editor Modal */}
        {isEditorOpen && selectedTemplate && (
          <TemplateEditor
            isOpen={isEditorOpen}
            onClose={handleCloseEditor}
            template={selectedTemplate}
            content={templateContent}
            onContentChange={handleContentChange}
          />
        )}
      </div>
    </div>
  );
};

export default TemplateEditorDemo;