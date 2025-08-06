/**
 * Icons.jsx - Componentes de iconos reutilizables
 * 
 * Centraliza todos los iconos SVG utilizados en la aplicación
 * para mantener consistencia y facilitar el mantenimiento.
 */

// ===== ICONOS DE EDICIÓN =====

/**
 * Icono de lápiz para funciones de edición
 * @param {Object} props - Props del componente SVG
 * @param {string} props.className - Clases CSS adicionales
 * @param {number} props.size - Tamaño del icono (por defecto 24)
 */
export const PencilIcon = ({ className = "", size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

/**
 * Icono de check/marca de verificación para guardar/confirmar
 * @param {Object} props - Props del componente SVG
 * @param {string} props.className - Clases CSS adicionales  
 * @param {number} props.size - Tamaño del icono (por defecto 24)
 */
export const CheckIcon = ({ className = "", size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M5 13l4 4L19 7" />
  </svg>
);

// ===== ICONOS DE INTERFAZ =====

/**
 * Icono de información/ayuda
 * @param {Object} props - Props del componente SVG
 */
export const InfoIcon = ({ className = "", size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

/**
 * Icono de imagen para funciones de subida/background
 * @param {Object} props - Props del componente SVG
 */
export const ImageIcon = ({ className = "", size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

/**
 * Icono de éxito/confirmación
 * @param {Object} props - Props del componente SVG
 */
export const SuccessIcon = ({ className = "", size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg"
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

// ===== EXPORT DEFAULT PARA FACILITAR IMPORTACIÓN =====
const Icons = {
  PencilIcon,
  CheckIcon,
  InfoIcon,
  ImageIcon,
  SuccessIcon
};

export default Icons;
