
import React, { useState } from 'react';
import ManualForm from './ManualForm.jsx';
import '../styles/HeroSection.css';
import HeroCardContainer from './HeroCardContainer.jsx';
import ExtrasPreviewModal from './ExtrasPreviewModal.jsx';
import TemplateGallery from './TemplateGallery.jsx';
import { templatesArray } from '../utilities/templates-array.js';
import TemplatesModal from './TemplatesModal.jsx';
import { X } from 'lucide-react';


export default function HeroSection({
  isLoading,
  handleGeneratePreview,
  handleFileChange,
  handleManualSubmit,
  selectedFile,
  error,
  inputMode,
  setInputMode
}) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateSectionOpen, setTemplateSectionOpen] = useState(false);

  const handleShowTemplates = () => {
    setTemplateSectionOpen(!templateSectionOpen);
  }

  const openModal = (template) => {
    setSelectedTemplate(template);
  };

  const closeModal = () => {
    setSelectedTemplate(null);
  };

  const handleFlyerClick = () => {
    setInputMode('image');
    document.getElementById('file-input').click();
  };

  const handleScrollToForm = () => {
    const formSection = document.getElementById('form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const [showExtrasModal, setShowExtrasModal] = React.useState(false);
  const handlePremiumClick = () => setShowExtrasModal(true);
  const handleCloseExtrasModal = () => setShowExtrasModal(false);
  const handleExtrasContinue = () => {
    setShowExtrasModal(false);
    handleScrollToForm();
  };

  const handleCloseModal = () => {
    setInputMode('image');
  };

  return (
    <>
      <header className="text-center">
        {/* <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-sinapsia-light">
          Tu sitio web en segundos
        </h1> */}
        <p className="text-base sm:text-lg lg:text-xl max-w-3xl mx-auto px-4 mb-6 text-sinapsia-light">
          Elige tu camino y publica tu web profesional de forma automática.<br />
          <span className="text-sinapsia-accent font-semibold">Una solución de <a
            href="https://www.sinapsialab.com"
            className="gradient-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            SinapsiaLab
          </a></span>
        </p>
        <HeroCardContainer
          onBasicClick={handleScrollToForm}
          onPremiumClick={handlePremiumClick}
        />
        {/* Modal para extras premium (solo preview) */}
        {showExtrasModal && (
          <ExtrasPreviewModal
            isOpen={showExtrasModal}
            onClose={handleCloseExtrasModal}
            onContinue={handleExtrasContinue}
          />
        )}
      </header>

      <button onClick={handleShowTemplates} className="m-6 px-4 py-2 bg-portfolio-gradient-1 text-portfolio-text rounded hover:bg-portfolio-gradient-2 transition">
        Elegir template
      </button>
      {templateSectionOpen && (
        <TemplateGallery templates={templatesArray} onTemplateClick={openModal} />
      )}
      <TemplatesModal isOpen={!!selectedTemplate} onClose={closeModal}>
        {selectedTemplate && (
          <div className="w-full h-full overflow-y-auto">
            <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xs border-b border-gray-200 p-4">
              <div className="flex justify-between items-center max-w-6xl mx-auto">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedTemplate.name}</h2>
                  <p className="text-gray-600">{selectedTemplate.description}</p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="pb-8">
              <selectedTemplate.component />
            </div>
          </div>
        )}
      </TemplatesModal>

      <main id="form-section" className="bg-sinapsia-base border border-sinapsia-accent p-4 sm:p-8 rounded-lg mx-auto max-w-4xl mb-4">
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
            className="btn-sinapsia-primary w-full sm:w-auto px-4 py-2.5 disabled:bg-gray-500 text-sinapsia-light font-medium text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg min-w-0 sm:min-w-44"
          >
            📄 {selectedFile ? selectedFile.name.substring(0, 20) + '...' : 'Tengo un Flyer'}
          </button>

          <button
            onClick={() => setInputMode('manual')}
            disabled={isLoading}
            className="btn-sinapsia-secondary w-full sm:w-auto px-4 py-2.5 disabled:bg-gray-500 text-sinapsia-light font-medium text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg min-w-0 sm:min-w-44"
          >
            ✏️ Crear desde Cero
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
        <div className="modal-overlay fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4">
          <div className="modal-container bg-sinapsia-gradient w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl">
            <div className="bg-sinapsia-deep flex justify-between items-center p-6 sm:p-8 border-b border-gray-600/30">
              <h2 className="text-sinapsia-light m-0 text-xl sm:text-2xl font-bold">✏️ Crear Landing Page Personalizada</h2>
              <button
                onClick={handleCloseModal}
                className="bg-gray-600 hover:bg-gray-500 text-gray-300 hover:text-sinapsia-light border-0 rounded-full w-10 h-10 flex items-center justify-center cursor-pointer text-xl transition-all duration-200 hover:scale-110"
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
    </>
  );
}
