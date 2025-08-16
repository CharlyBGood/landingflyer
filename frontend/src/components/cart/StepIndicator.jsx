import React from 'react';

export default function StepIndicator({ step, steps }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      {steps.map((label, idx) => (
        <div key={label} className="flex items-center gap-2">
          <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-base transition-colors duration-200 
            ${step === idx + 1 ? 'bg-sinapsia-accent text-white' : 'bg-gray-700 text-sinapsia-light'}`}>{idx + 1}</div>
          <span className={`text-xs sm:text-sm font-medium ${step === idx + 1 ? 'text-sinapsia-accent' : 'text-sinapsia-light'}`}>{label}</span>
          {idx < steps.length - 1 && <div className="w-8 h-0.5 bg-gray-700 mx-1" />}
        </div>
      ))}
    </div>
  );
}
