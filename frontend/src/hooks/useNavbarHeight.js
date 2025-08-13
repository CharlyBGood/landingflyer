import { useEffect } from 'react';

export const useNavbarHeight = () => {
  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.querySelector('nav.navbar, nav');
      if (navbar) {
        const height = navbar.offsetHeight;
        document.documentElement.style.setProperty('--navbar-height', `${height}px`);
        
        // Debug opcional (remover en producción)
        // console.log(`Navbar height updated: ${height}px`);
      }
    };

    // Actualizar inmediatamente
    updateNavbarHeight();

    // Observer para cambios en el navbar
    let resizeObserver;
    const navbar = document.querySelector('nav.navbar, nav');
    
    if (navbar && window.ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        // Debounce para evitar demasiadas actualizaciones
        setTimeout(updateNavbarHeight, 10);
      });
      resizeObserver.observe(navbar);
    }

    // Listeners adicionales para mayor robustez
    const handleResize = () => {
      setTimeout(updateNavbarHeight, 50);
    };

    const handleLoad = () => {
      setTimeout(updateNavbarHeight, 100);
    };

    // Múltiples eventos para capturar todos los cambios
    window.addEventListener('resize', handleResize);
    window.addEventListener('load', handleLoad);
    window.addEventListener('orientationchange', handleResize);

    // Verificación periódica en caso de cambios dinámicos
    const interval = setInterval(updateNavbarHeight, 5000);

    // Cleanup
    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('load', handleLoad);
      window.removeEventListener('orientationchange', handleResize);
      clearInterval(interval);
    };
  }, []);
};
