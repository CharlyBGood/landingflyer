
export default function TemplateSelectorButton({selectedTemplate}) {
  return (
    <button 
    onClick={selectedTemplate}
    className="px-4 py-2 bg-blue-500 text-portfolio-text rounded hover:bg-portfolio-accent transition">
      Seleccionar Template
    </button>
  )
}
