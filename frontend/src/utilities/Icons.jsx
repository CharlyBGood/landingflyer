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

/**
 * Icono de globo/publicación para funciones de deploy
 * @param {Object} props - Props del componente SVG
 */
export const GlobeIcon = ({ className = "", size = 24, ...props }) => (
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
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

/**
 * Icono de X para cerrar modales
 * @param {Object} props - Props del componente SVG
 * @param {string} props.className - Clases CSS adicionales
 * @param {number} props.size - Tamaño del icono (por defecto 24)
 */
export const XMarkIcon = ({ className = "", size = 24, ...props }) => (
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
    <path d="M18 6L6 18" />
    <path d="M6 6L18 18" />
  </svg>
);

/**
 * Icono de enlace externo
 * @param {Object} props - Props del componente SVG
 * @param {string} props.className - Clases CSS adicionales
 * @param {number} props.size - Tamaño del icono (por defecto 24)
 */
export const ExternalLinkIcon = ({ className = "", size = 24, ...props }) => (
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
    <path d="M15 3h6v6" />
    <path d="M10 14L21 3" />
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

/**
 * Icono de negrita (texto B)
 */
export const BoldIcon = ({ className = "", size = 24, ...props }) => (
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
    <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
    <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
  </svg>
);

/**
 * Icono de cursiva (texto I)
 */
export const ItalicIcon = ({ className = "", size = 24, ...props }) => (
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
    <line x1="19" y1="4" x2="10" y2="4" />
    <line x1="14" y1="20" x2="5" y2="20" />
    <line x1="15" y1="4" x2="9" y2="20" />
  </svg>
);

/**
 * Icono de enlace (cadena)
 */
export const LinkIcon = ({ className = "", size = 24, ...props }) => (
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
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
);

/**
 * Icono de deshacer
 */
export const UndoIcon = ({ className = "", size = 24, ...props }) => (
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
    <path d="M3 7v6h6" />
    <path d="M21 17a9 9 0 0 0-15-6.7L3 13" />
  </svg>
);

/**
 * Icono de rehacer
 */
export const RedoIcon = ({ className = "", size = 24, ...props }) => (
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
    <path d="M21 7v6h-6" />
    <path d="M3 17a9 9 0 0 1 15-6.7L21 13" />
  </svg>
);

/**
 * Icono de desvincular enlace
 */
export const UnlinkIcon = ({ className = "", size = 24, ...props }) => (
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
    <path d="M18.84 12.25l1.72-1.71a5 5 0 0 0-7.07-7.07l-1.71 1.71" />
    <path d="M5.17 11.75l-1.71 1.71a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    <line x1="8" y1="2" x2="8" y2="5" />
    <line x1="2" y1="8" x2="5" y2="8" />
    <line x1="16" y1="19" x2="16" y2="22" />
    <line x1="19" y1="16" x2="22" y2="16" />
  </svg>
);

// ===== EXPORT DEFAULT PARA FACILITAR IMPORTACIÓN =====
const Icons = {
  PencilIcon,
  CheckIcon,
  InfoIcon,
  ImageIcon,
  SuccessIcon,
  GlobeIcon,
  XMarkIcon,
  ExternalLinkIcon,
  BoldIcon,
  ItalicIcon,
  LinkIcon,
  UndoIcon,
  RedoIcon,
  UnlinkIcon,
};

export default Icons;
