import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import HeroSection from './components/HeroSection.jsx';
import LandingPreview from './components/LandingPreview.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { useNavbarHeight } from './hooks/useNavbarHeight.js';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedHtml, setGeneratedHtml] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [inputMode, setInputMode] = useState('image'); // Siempre comienza en modo imagen
  const iframeRef = useRef(null);

  // Hook para manejar altura dinámica del navbar
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
      
      // 🔒 NUEVO TEMPLATE: Guardar tanto contenido de trabajo como template original inmutable
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
      
      // 🔒 NUEVO TEMPLATE: Guardar tanto contenido de trabajo como template original inmutable
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
    <div className="min-h-screen">
      <Navbar />
      <section className="hero-section">
        <div className="hero-container">
          
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