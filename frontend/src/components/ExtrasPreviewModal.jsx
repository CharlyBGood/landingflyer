import React from 'react';

const extras = [
  { label: 'E-commerce Básico', price: 15 },
  { label: 'Formularios Avanzados', price: 8 },
  { label: 'Sección de Blog', price: 12 },
  { label: 'Galería de Imágenes', price: 6 },
  { label: 'Sección de Testimonios', price: 5 },
];

export default function ExtrasPreviewModal({ isOpen, onClose, onContinue }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[1000] p-4">
      <div className="bg-sinapsia-base border border-sinapsia-accent rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          className="absolute top-4 right-4 text-sinapsia-light hover:text-sinapsia-accent text-xl font-bold"
          onClick={onClose}
          aria-label="Cerrar"
        >×</button>
        <h2 className="text-center text-lg sm:text-xl font-bold text-sinapsia-light mb-6">Modificaciones Adicionales</h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
          {extras.map((extra) => (
            <label key={extra.label} className="flex flex-col items-center text-center text-sinapsia-light text-sm font-medium">

              <span>{extra.label}</span>
              <span className="text-sinapsia-accent font-semibold text-xs mt-1">+${extra.price}</span>
            </label>
          ))}
        </div>
        <button
          className="w-full py-2.5 rounded-lg bg-sinapsia-accent text-white font-semibold hover:bg-sinapsia-gradient transition text-base mt-2"
          onClick={onContinue}
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
