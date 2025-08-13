
import ManualForm from './ManualForm.jsx';
import './HeroSection.css';

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
  const handleFlyerClick = () => {
    setInputMode('image');
    // Trigger file input click
    document.getElementById('file-input').click();
  };

  const handleCloseModal = () => {
    setInputMode('image'); // Volver al modo por defecto
  };

  return (
    <>
      <header className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-white">
          Crea tu Landing Page Profesional
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
          Elige cómo quieres crear tu página: sube un flyer existente o créala desde cero.
        </p>
      </header>

      <main className="bg-gray-800 p-4 sm:p-8 rounded-lg border border-gray-600 mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
          
          {/* Input file oculto */}
          <input
            type="file"
            id="file-input"
            onChange={handleFileChange}
            accept="image/*"
            disabled={isLoading}
            className="sr-only"
          />

          {/* Botón "Tengo un Flyer" */}
          <button
            onClick={handleFlyerClick}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white font-medium text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg min-w-0 sm:min-w-44"
          >
            📄 {selectedFile ? selectedFile.name.substring(0, 20) + '...' : 'Tengo un Flyer'}
          </button>

          {/* Botón "Crear desde cero" */}
          <button
            onClick={() => setInputMode('manual')}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-medium text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg min-w-0 sm:min-w-44"
          >
            ✏️ Crear desde Cero
          </button>

          {/* Botón Generar */}
          <button
            onClick={inputMode === 'image' ? handleGeneratePreview : () => {}}
            disabled={isLoading || (inputMode === 'image' && !selectedFile)}
            className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-medium text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:transform-none disabled:shadow-none min-w-0 sm:min-w-44"
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

      {/* Modal para formulario manual */}
      {inputMode === 'manual' && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>✏️ Crear Landing Page Personalizada</h2>
              <button 
                onClick={handleCloseModal}
                className="modal-close-btn"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="modal-content-form">
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