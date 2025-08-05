import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './App.css';
import HeroSection from './components/HeroSection.jsx';
import LandingPreview from './components/LandingPreview.jsx';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [generatedHtml, setGeneratedHtml] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const iframeRef = useRef(null);

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
      <section className="px-4 py-8 sm:px-8 sm:py-12 lg:px-16 lg:py-16 pt-20 sm:pt-24">
        <div className="max-w-6xl mx-auto text-center">
          <HeroSection
            isLoading={isLoading}
            handleGeneratePreview={handleGeneratePreview}
            handleFileChange={handleFileChange}
            selectedFile={selectedFile}
            error={error}
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