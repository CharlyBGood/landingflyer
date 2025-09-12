import { useEffect, useCallback } from 'react';


const ModalTemplate = ({ isOpen, onClose, onNavigateNext, onNavigatePrev, children, disableKeyboardNavigation = false }) => {
  
  const handleKeyDown = useCallback((e) => {
    // Si la navegación por teclado está deshabilitada, solo permitir Escape
    if (disableKeyboardNavigation) {
      if (e.key === 'Escape') {
        onClose();
      }
      return;
    }

    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowRight' && onNavigateNext) {
      onNavigateNext();
    } else if (e.key === 'ArrowLeft' && onNavigatePrev) {
      onNavigatePrev();
    }
  }, [onClose, onNavigateNext, onNavigatePrev, disableKeyboardNavigation]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative min-h-screen w-[95%] mx-auto my-10 flex items-center justify-center p-4">
        <div className="bg-portfolio-text shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ModalTemplate;