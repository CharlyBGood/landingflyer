
import StepIndicator from './StepIndicator';
import CartNavButton from './CartNavButton';
import PublicationTypeSelection from './PublicationTypeSelection';
import ServiceConfiguration from './ServiceConfiguration';
import OrderSummary from './OrderSummary';

const steps = [
  'Tipo de publicación',
  'Servicios y entrega',
  'Extras y resumen'
];

const defaultFormData = {
  publicationType: 'basic',
  modifications: [],
  deliveryTime: 'standard',
  extras: []
};

export default function CartModal({ isOpen, onClose, onConfirm }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(defaultFormData);

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, steps.length));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleConfirm = () => {
    onConfirm(formData);
    setStep(1);
    setFormData(defaultFormData);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-sinapsia-base text-sinapsia-light rounded-2xl shadow-xl w-full max-w-lg p-6 relative border border-sinapsia-accent">
        <button
          className="absolute top-4 right-4 text-sinapsia-light hover:text-sinapsia-accent text-xl font-bold"
          onClick={onClose}
          aria-label="Cerrar"
        >×</button>
        <StepIndicator step={step} steps={steps} />
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <PublicationTypeSelection
              value={formData.publicationType}
              onChange={val => setFormData(f => ({ ...f, publicationType: val }))}
            />
            <CartNavButton onClick={handleNext} align="end">Siguiente</CartNavButton>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <ServiceConfiguration
              formData={formData}
              onChange={setFormData}
            />
            <div className="flex justify-between mt-4">
              <CartNavButton onClick={handleBack} variant="secondary" align="start">Atrás</CartNavButton>
              <CartNavButton onClick={handleNext} align="end">Siguiente</CartNavButton>
            </div>
          </div>
        )}
        {step === 3 && (
          <OrderSummary
            formData={formData}
            onBack={handleBack}
            onPublish={handleConfirm}
          />
        )}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
