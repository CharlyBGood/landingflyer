import React from 'react'

export default function LandingPreview({ generatedHtml, iframeRef }) {
  return (
    <>
      {generatedHtml && (
        <div className="preview-container">
          <div className="preview-toolbar">
            <h2>✨ ¡Tu vista previa está lista! ✨</h2>
            <p>Abriendo el editor puedes personalizar tu página, guardar los cambios y prepararla para el lanzamiento.</p>
            <div className='cta-buttons'>
              <a href="/editor" target="_blank" className='contact-button' rel="noopener noreferrer">
                Abrir Editor a Pantalla Completa
              </a>
            </div>
          </div>
          <iframe
            ref={iframeRef}
            srcDoc={generatedHtml}
            title="Vista Previa de la Landing Page"
            className="preview-iframe"
            key={generatedHtml}
          />
        </div>
      )}
    </>
  )
}
