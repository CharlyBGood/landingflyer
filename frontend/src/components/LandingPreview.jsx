
export default function LandingPreview({ generatedHtml, iframeRef }) {
  return (
    <>
      {generatedHtml && (
        <div className="mt-8 sm:mt-12 mb-8 sm:mb-12 lg:mb-16 border border-gray-600 rounded-lg overflow-hidden shadow-lg">
          <div className="bg-portfolio-base p-4 sm:p-6 lg:p-8 text-center">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-4">
              ✨ ¡Tu vista previa está lista! ✨
            </h2>
            <p className="text-gray-300 text-sm sm:text-base lg:text-lg mb-4 sm:mb-6 max-w-3xl mx-auto">
              Abriendo el editor puedes personalizar tu página, guardar los cambios y prepararla para el lanzamiento.
            </p>
            <div className='flex justify-center'>
              <a 
                href="/editor" 
                target="_blank" 
                className='inline-flex items-center px-4 sm:px-6 py-2.5 sm:py-3 bg-portfolio-accent hover:bg-portfolio-medium text-white font-semibold text-sm sm:text-base rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg' 
                rel="noopener noreferrer"
              >
                Abrir Editor a Pantalla Completa
              </a>
            </div>
          </div>
          <iframe
            ref={iframeRef}
            srcDoc={generatedHtml}
            title="Vista Previa de la Landing Page"
            className="w-full h-[85vh] sm:h-[80vh] lg:h-[90vh] border-none block"
            key={generatedHtml}
          />
        </div>
      )}
    </>
  )
}
