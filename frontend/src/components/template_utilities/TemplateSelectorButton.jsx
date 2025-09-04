import { SquareCheckBig } from "lucide-react"
import { useState } from "react";

export default function TemplateSelectorButton({ template, onSelectTemplate, onCloseModal }) {
  const [hover, setHover] = useState(false);

  const onHover = () => {
    setHover(true);
  }

  const onLeave = () => {
    setHover(false);
  };

  const handleSelectTemplate = () => {
    onSelectTemplate(template);
    onCloseModal();
  };

  return (
    <div className="flex justify-center items-center">
      <button
        onClick={handleSelectTemplate}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        // disabled={hover}
        className="flex items-center text-portfolio-gradient-1 rounded-full outline-0 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer">
        <SquareCheckBig />
        {hover && <span className="text-portfolio-gradient-1 text-xs ml-1">seleccionar</span>}
      </button>
    </div>
  )
}
