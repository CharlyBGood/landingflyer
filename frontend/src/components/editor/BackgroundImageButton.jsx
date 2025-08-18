import { ImageIcon } from '../../utilities';

const BackgroundImageButton = ({
  targetElement,
  onImageChange,
  className = 'editor-bg-btn',
  position = 'top-right',
  variant = 'primary',
  style = {}
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

          // Aplicar background de forma más simple
          if (targetElement) {
            // Limpiar estilos previos
            targetElement.style.backgroundImage = '';
            targetElement.style.backgroundSize = '';
            targetElement.style.backgroundPosition = '';
            targetElement.style.backgroundRepeat = '';
            
            // Aplicar nuevo background
            targetElement.style.backgroundImage = `url("${imageUrl}")`;
            targetElement.style.backgroundSize = 'cover';
            targetElement.style.backgroundPosition = 'center center';
            targetElement.style.backgroundRepeat = 'no-repeat';

            // Callback para guardar
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

  // Generar clases CSS basadas en props
  const getButtonClasses = () => {
    const baseClass = 'editor-bg-btn';
    const positionClass = position !== 'top-right' ? `editor-bg-btn--${position}` : '';
    const variantClass = variant !== 'primary' ? `editor-bg-btn--${variant}` : '';

    return [baseClass, positionClass, variantClass, className]
      .filter(Boolean)
      .join(' ');
  };

  return (
    <button
      className={getButtonClasses()}
      onClick={handleImageUpload}
  // style={style} // Justificado solo para casos donde Tailwind/custom CSS no es suficiente (animaciones dinámicas, gradientes avanzados, etc.)
  style={style}
      title="Cambiar imagen de fondo"
    >
      <ImageIcon size={14} />
      <span>Fondo</span>
    </button>
  );
};

export default BackgroundImageButton;
