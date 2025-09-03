import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import HeroSection from './components/HeroSection.jsx';
import LandingPreview from './components/LandingPreview.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { useNavbarHeight } from './hooks/useNavbarHeight.js';
import TemplateGallery from './components/TemplateGallery.jsx';
import { templatesArray } from './utilities/templates-array.js';
import TemplatesModal from './components/TemplatesModal.jsx';
import { X } from 'lucide-react';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedHtml, setGeneratedHtml] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState('image');
  const iframeRef = useRef(null);
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

  useNavbarHeight();

  const handleGeneratePreview = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError('');
    setGeneratedHtml(null);

    const formData = new FormData();
    formData.append('flyerImage', selectedFile);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.post(`${apiUrl}/api/generate-preview`, formData);
      setGeneratedHtml(response.data.generatedHtml);

      localStorage.setItem('editableHtml', response.data.generatedHtml);
      localStorage.setItem('originalTemplate', response.data.generatedHtml);
    } catch (err) {
      setError('Hubo un error al generar la página.', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async (businessData) => {
    setIsLoading(true);
    setError('');
    setGeneratedHtml(null);

    const formData = new FormData();
    formData.append('businessData', JSON.stringify(businessData));

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await axios.post(`${apiUrl}/api/generate-preview`, formData);
      setGeneratedHtml(response.data.generatedHtml);

      localStorage.setItem('editableHtml', response.data.generatedHtml);
      localStorage.setItem('originalTemplate', response.data.generatedHtml);
    } catch (err) {
      setError('Hubo un error al generar la página.', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setError('');
      setGeneratedHtml(null);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedHtml = localStorage.getItem('editableHtml');
      if (updatedHtml && updatedHtml !== generatedHtml) {
        setGeneratedHtml(updatedHtml);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [generatedHtml]);

  return (
    <div className="min-h-screen bg-sinapsia-bg">
      <Navbar />
      <section className="hero-section px-4 sm:px-8 lg:px-16 pb-8 sm:pb-12 lg:pb-16 bg-sinapsia-bg">
        <div className="max-w-7xl mx-auto text-center">
          <HeroSection
            isLoading={isLoading}
            handleGeneratePreview={handleGeneratePreview}
            handleFileChange={handleFileChange}
            handleManualSubmit={handleManualSubmit}
            selectedFile={selectedFile}
            error={error}
            inputMode={inputMode}
            setInputMode={setInputMode}
          />
          <button onClick={handleShowTemplates} className="mt-6 mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Ver templates
          </button>

          {templateSectionOpen && (
            <TemplateGallery templates={templatesArray} openModal={openModal} />
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

          {generatedHtml && (
            <LandingPreview generatedHtml={generatedHtml} iframeRef={iframeRef} />
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default App;
