
export default function HeroSection({isLoading, handleGeneratePreview, handleFileChange, selectedFile, error}) {
  return (
    <>
      <header className="App-header">
        <h1>Sube tu Flyer y crea tu Landing Page</h1>
        <p>Vamos a generar una vista previa. Luego, podrás editarla y perfeccionarla como prefieras.</p>
      </header>
      <main className="App-main">
        <div className="uploader">
          <div className="file-input-container">
            <input 
              type="file" 
              id="file-input"
              onChange={handleFileChange} 
              accept="image/*" 
              disabled={isLoading}
              className="file-input-hidden" 
            />
            <label htmlFor="file-input" className="file-input-label">
              {selectedFile ? selectedFile.name : 'Seleccionar imagen'}
            </label>
          </div>
          <button onClick={handleGeneratePreview} disabled={isLoading || !selectedFile}>
            {isLoading ? 'Generando...' : 'Generar Vista Previa'}
          </button>
        </div>

        {isLoading && <p>Analizando diseño y construyendo tu web...</p>}
        {error && <p className="error-message">{error}</p>}
      </main>

    </>
  )
}
