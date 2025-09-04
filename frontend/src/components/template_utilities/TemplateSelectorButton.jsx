import { SquareCheckBig } from "lucide-react"

export default function TemplateSelectorButton({ template, onSelectTemplate, onCloseModal }) {
  const handleSelectTemplate = () => {
    onSelectTemplate(template);
    onCloseModal();
  };

  return (
    <button
      onClick={handleSelectTemplate}
      className="p-1 text-portfolio-gradient-1 rounded-full outline-0 hover:p-2 hover:bg-portfolio-text/80 transition">
      <SquareCheckBig />
    </button>
  )
}
