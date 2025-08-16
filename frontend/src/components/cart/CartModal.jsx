import React, { useState } from 'react';
import StepIndicator from './StepIndicator';
import PublicationTypeSelection from './PublicationTypeSelection';
import ServiceConfiguration from './ServiceConfiguration';
import ExtrasAndAddons from './ExtrasAndAddons';
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
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold"
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
            <div className="flex justify-end mt-4">
              <button
                className="bg-sinapsia-accent text-white rounded-lg px-6 py-2 font-semibold hover:bg-sinapsia-gradient transition"
                onClick={handleNext}
              >Siguiente</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <ServiceConfiguration
              formData={formData}
              onChange={setFormData}
            />
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-200 text-gray-700 rounded-lg px-6 py-2 font-semibold hover:bg-gray-300 transition"
                onClick={handleBack}
              >Atrás</button>
              <button
                className="bg-sinapsia-accent text-white rounded-lg px-6 py-2 font-semibold hover:bg-sinapsia-gradient transition"
                onClick={handleNext}
              >Siguiente</button>
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
