// import { useState } from 'react';
import ManualForm from './ManualForm.jsx';
import '../styles/HeroSection.css';
import HeroCardContainer from './HeroCardContainer.jsx';
import { useNavbarHeight } from '../hooks/useNavbarHeight.js';
// import ExtrasPreviewModal from './ExtrasPreviewModal.jsx';
// import TemplateGallery from './TemplateGallery.jsx';
// import { templatesArray } from '../utilities/templates-array.js';
// import TemplatesModal from './TemplatesModal.jsx';
// import TemplateEditor from './TemplateEditor.jsx';
// import { X, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
// import TemplatesSelectorButton from './template_utilities/TemplateSelectorButton.jsx';


export default function HeroSection({
  isLoading,
  handleGeneratePreview,
  handleFileChange,
  handleManualSubmit,
  selectedFile,
  error,
  inputMode,
  setInputMode,
  // onTemplateSelect
}) {
  // const [selectedTemplate, setSelectedTemplate] = useState(null);
  // const [templateSectionOpen, setTemplateSectionOpen] = useState(false);
  // const [selectedTemplateForGallery, setSelectedTemplateForGallery] = useState(null);
  // const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  // const [currentTemplateIndex, setCurrentTemplateIndex] = useState(0);
  // const [isEditorOpen, setIsEditorOpen] = useState(false);

  // const handleShowTemplates = () => {
  //   setTemplateSectionOpen(!templateSectionOpen);
  //   handleScrollToForm();
  // }

  // const openTemplatesModal = (template) => {
  //   const templateIndex = templatesArray.findIndex(t => t.id === template.id);
  //   setCurrentTemplateIndex(templateIndex);
  //   setSelectedTemplate(template);
  // };

  // const closeTemplatesModal = useCallback(() => {
  //   setSelectedTemplate(null);
  // }, []);

  // const navigateToNextTemplate = useCallback(() => {
  //   const nextIndex = (currentTemplateIndex + 1) % templatesArray.length;
  //   setCurrentTemplateIndex(nextIndex);
  //   setSelectedTemplate(templatesArray[nextIndex]);
  // }, [currentTemplateIndex]);

  // const navigateToPreviousTemplate = useCallback(() => {
  //   const prevIndex = currentTemplateIndex === 0 ? templatesArray.length - 1 : currentTemplateIndex - 1;
  //   setCurrentTemplateIndex(prevIndex);
  //   setSelectedTemplate(templatesArray[prevIndex]);
  // }, [currentTemplateIndex]);

  // const openTemplateEditor = useCallback(() => {
  //   if (selectedTemplate) {
  //     setIsEditorOpen(true);
  //   }
  // }, [selectedTemplate]);

  // const closeTemplateEditor = useCallback(() => {
  //   setIsEditorOpen(false);
  // }, []);

  // const handleEditorSave = useCallback((editedContent) => {
  //   console.log('Template editado:', editedContent);
  // Aquí puedes manejar el contenido editado
  // Por ejemplo, guardarlo en localStorage o enviarlo a un servidor
  // }, []);

  // const handleTemplateSelection = (template) => {
  //   setSelectedTemplateForGallery(template);
  //   onTemplateSelect(template);
  //   setSelectedTemplateId(template.id);
  //   closeTemplatesModal();
  // };

  // const handleChangeSelected = () => {
  //   setSelectedTemplateId(null);
  //   setSelectedTemplateForGallery(null);
  //   setTemplateSectionOpen(true);
  // };

  // Use navbar height hook
  useNavbarHeight();

  const handleFlyerClick = () => {
    setInputMode('image');
    document.getElementById('file-input').click();
  };

  // const handleScrollToForm = () => {
  //   const formSection = document.getElementById('form-section');
  //   if (formSection) {
  //     formSection.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  // const [showExtrasModal, setShowExtrasModal] = useState(false);

  // const handlePremiumClick = () => setShowExtrasModal(true);
  // const handleCloseExtrasModal = () => setShowExtrasModal(false);

  // const handleExtrasContinue = () => {
  //   setShowExtrasModal(false);
  //   handleScrollToForm();
  // };

  const handleCloseModal = () => {
    setInputMode('image');
  };

  return (
    <>
      <header className="text-center flex flex-col justify-evenly gap-2 items-center py-6">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-sinapsia-light mb-4">
            Publicá tu Landing Page gratis en minutos.
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-sinapsia-light mb-4">
            Convertí tu flyer en una web lista para compartir.
          </p>
          <p className="text-base sm:text-lg text-sinapsia-light mb-6">
            Una solución de <a
              href="https://www.sinapsiaLab.com"
              className="gradient-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              SinapsiaLab
            </a> para mostrar tu negocio online sin complicaciones.
          </p>
        </div>
        {/* Explicación en 3 pasos */}
        <div className="max-w-5xl mx-auto px-4 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-sinapsia-base/50 rounded-lg border border-sinapsia-accent/30">
              <div className="text-3xl mb-3">📤</div>
              <h3 className="text-lg font-semibold text-sinapsia-light mb-2">1. Subí tu flyer</h3>
              <p className="text-sinapsia-light/80">o completá el formulario</p>
            </div>
            <div className="text-center p-6 bg-sinapsia-base/50 rounded-lg border border-sinapsia-accent/30">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-sinapsia-light mb-2">2. Generá tu landing</h3>
              <p className="text-sinapsia-light/80">automáticamente</p>
            </div>
            <div className="text-center p-6 bg-sinapsia-base/50 rounded-lg border border-sinapsia-accent/30">
              <div className="text-3xl mb-3">🔗</div>
              <h3 className="text-lg font-semibold text-sinapsia-light mb-2">3. Compartí el link</h3>
              <p className="text-sinapsia-light/80">con tus clientes</p>
            </div>
          </div>
          <p className="text-center text-sinapsia-accent font-semibold mt-6">
            ⚡ Sin conocimientos técnicos, en solo minutos.
          </p>
        </div>
      </header>

      <main id="form-section" className="bg-sinapsia-base border border-sinapsia-accent p-6 sm:p-8 rounded-lg mx-auto max-w-4xl mb-8">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            accept="image/*"
            disabled={isLoading}
            className="sr-only"
          />
          <button
            onClick={handleFlyerClick}
            disabled={isLoading}
            className="btn-sinapsia-secondary w-full sm:w-auto px-4 py-2.5 disabled:bg-gray-500 text-sinapsia-light font-medium text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg min-w-0 sm:min-w-44"
          >
            📄 {selectedFile ? selectedFile.name.substring(0, 20) + '...' : 'Tengo un Flyer'}
          </button>
          <button
            onClick={() => setInputMode('manual')}
            disabled={isLoading}
            className="btn-sinapsia-secondary w-full sm:w-auto px-4 py-2.5 disabled:bg-gray-500 text-sinapsia-light font-medium text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg min-w-0 sm:min-w-44"
          >
            ✏️ Crear con formulario
          </button>
          <button
            onClick={inputMode === 'image' ? handleGeneratePreview : () => { }}
            disabled={isLoading || (inputMode === 'image' && !selectedFile)}
            className="btn-sinapsia-tertiary w-full sm:w-auto px-4 py-2.5 disabled:bg-gray-500 text-sinapsia-light font-medium text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:transform-none disabled:shadow-none min-w-0 sm:min-w-44"
          >
            {isLoading ? 'Generando...' : 'Generar Vista Previa'}
          </button>
        </div>
        {isLoading && (
          <p className="text-center text-gray-300 mt-4 sm:mt-6 text-sm sm:text-base">
            Analizando diseño y construyendo tu web...
          </p>
        )}
        {error && (
          <p className="text-center text-red-400 mt-4 sm:mt-6 text-sm sm:text-base px-4">
            {error}
          </p>
        )}
      </main>

      {inputMode === 'manual' && (
        <div className="modal-overlay fixed inset-0 bg-portfolio-dark/70 flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-sinapsia-gradient w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
            <div className="bg-sinapsia-deep flex justify-between items-center p-6 sm:p-8 border-b border-portfolio-deep/30">
              <h2 className="text-sinapsia-light m-0 text-xl sm:text-2xl font-bold">✏️ Crear Landing Page Personalizada</h2>
              <button
                onClick={handleCloseModal}
                className="bg-portfolio-base hover:bg-portfolio-medium text-gray-300 hover:text-sinapsia-light border-0 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-xl transition-all duration-200 hover:scale-110"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="modal-content-form p-0 max-h-[calc(90vh-6.25rem)] overflow-y-auto">
              <ManualForm
                onSubmit={handleManualSubmit}
                isLoading={isLoading}
                onClose={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}

      {/* {selectedTemplate && (
        <TemplateEditor
          isOpen={isEditorOpen}
          onClose={closeTemplateEditor}
          template={selectedTemplate}
          onSave={handleEditorSave}
        />
      )} */}
    </>
  );
}
