// FlagIcons.jsx - Iconos SVG para banderas de países

export const ArgentinaFlag = ({ className = '', size = 20, ...props }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <rect width="20" height="14" rx="2" fill="#74ACDF"/>
    <rect y="4.67" width="20" height="4.66" fill="#fff"/>
    <circle cx="10" cy="7" r="1.2" fill="#FFD600"/>
  </svg>
);

export const USAFlag = ({ className = '', size = 20, ...props }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
    <rect width="20" height="14" rx="2" fill="#fff"/>
    <rect y="1.4" width="20" height="1.4" fill="#B22234"/>
    <rect y="4.2" width="20" height="1.4" fill="#B22234"/>
    <rect y="7" width="20" height="1.4" fill="#B22234"/>
    <rect y="9.8" width="20" height="1.4" fill="#B22234"/>
    <rect y="12.6" width="20" height="1.4" fill="#B22234"/>
    <rect width="8" height="5.6" fill="#3C3B6E"/>
    <circle cx="1.2" cy="1.2" r="0.4" fill="#fff"/>
    <circle cx="2.8" cy="1.2" r="0.4" fill="#fff"/>
    <circle cx="4.4" cy="1.2" r="0.4" fill="#fff"/>
    <circle cx="6" cy="1.2" r="0.4" fill="#fff"/>
    <circle cx="1.2" cy="2.8" r="0.4" fill="#fff"/>
    <circle cx="2.8" cy="2.8" r="0.4" fill="#fff"/>
    <circle cx="4.4" cy="2.8" r="0.4" fill="#fff"/>
    <circle cx="6" cy="2.8" r="0.4" fill="#fff"/>
    <circle cx="2" cy="2" r="0.4" fill="#fff"/>
    <circle cx="3.6" cy="2" r="0.4" fill="#fff"/>
    <circle cx="5.2" cy="2" r="0.4" fill="#fff"/>
  </svg>
);

export default { ArgentinaFlag, USAFlag };
