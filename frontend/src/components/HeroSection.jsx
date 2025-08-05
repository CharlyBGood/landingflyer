
export default function HeroSection({isLoading, handleGeneratePreview, handleFileChange, selectedFile, error}) {
  return (
    <>
      <header className="mb-8 sm:mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4 text-white">
          Sube tu Flyer y crea tu Landing Page
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto px-4">
          Vamos a generar una vista previa. Luego, podrás editarla y perfeccionarla como prefieras.
        </p>
      </header>
      <main className="bg-gray-800 p-4 sm:p-8 rounded-lg border border-gray-600 mx-auto max-w-4xl">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-center">
          <div className="relative w-full sm:w-auto">
            <input 
              type="file" 
              id="file-input"
              onChange={handleFileChange} 
              accept="image/*" 
              disabled={isLoading}
              className="sr-only" 
            />
            <label 
              htmlFor="file-input" 
              className="inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-500 text-white font-medium text-sm sm:text-base rounded-lg cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg min-w-0 sm:min-w-44"
            >
              <span className="truncate">
                {selectedFile ? selectedFile.name : 'Seleccionar imagen'}
              </span>
            </label>
          </div>
          <button 
            onClick={handleGeneratePreview} 
            disabled={isLoading || !selectedFile}
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

    </>
  )
}
