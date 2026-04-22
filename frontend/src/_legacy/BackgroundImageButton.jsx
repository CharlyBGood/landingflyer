import { ImageIcon } from '../../utilities';

// Este componente usa style solo para background-image dinámico, justificado por requerimiento de URL runtime.
const BackgroundImageButton = ({
  targetElement,
  onImageChange,
  style = {},
}) => {
  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const imageUrl = ev.target.result;
          if (targetElement) {
            targetElement.style.backgroundImage = `url("${imageUrl}")`;
            targetElement.style.backgroundSize = 'cover';
            targetElement.style.backgroundPosition = 'center center';
            targetElement.style.backgroundRepeat = 'no-repeat';
            if (onImageChange) {
              onImageChange(imageUrl, targetElement);
            }
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };


  return (
    <button
      type="button"
      className="flex items-center gap-1 rounded-md bg-primary-600 text-black hover:bg-primary-700 transition-colors p-2 text-xs font-medium shadow-md focus:outline-none focus:ring-2 focus:ring-primary-400"
      onClick={handleImageUpload}
      title="Cambiar imagen de fondo"
      style={style} // Justificado: background-image dinámico solo se puede aplicar así
    >
      <ImageIcon size={14} />
      <span>Fondo</span>
    </button>
  );
};

export default BackgroundImageButton;
