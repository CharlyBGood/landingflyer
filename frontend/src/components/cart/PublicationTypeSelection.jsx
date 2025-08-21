

const options = [
  {
    value: 'basic',
    title: 'Publicación Exprés',
    price: 350,
    description: 'Página lista + hosting incluido por 1 año + dominio genérico. Generación automática y editor visual.',
    features: [
      'Landing page profesional en minutos',
      'Hosting incluido 1 año',
      'Dominio genérico .site',
      'Editor visual y SEO básico',
    ]
  },
  {
    value: 'premium',
    title: 'Premium a medida',
    price: 650,
    description: 'Personalizaciones extras, edición avanzada y pago flexible. Incluye CMS básico, formularios, e-commerce básico y SEO avanzado.',
    features: [
      'Todo lo de la opción Exprés',
      'Personalizaciones y edición avanzada',
      'CMS básico, formularios, e-commerce básico',
      'SEO avanzado',
      'Pago flexible (adelanto y saldo al terminar)'
    ],
    recommended: true
  }
];

export default function PublicationTypeSelection({ value, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 w-full">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`relative flex-1 border rounded-xl p-5 text-left transition-all duration-200 focus:outline-none 
            ${value === opt.value ? 'border-sinapsia-accent bg-sinapsia-base shadow-lg' : 'border-gray-700 bg-transparent'}`}
          onClick={() => onChange(opt.value)}
        >
          {opt.recommended && (
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sinapsia-accent text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">Recomendado</span>
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg text-sinapsia-light">{opt.title}</span>
            <span className="font-semibold text-sinapsia-accent">{opt.value === 'premium' ? 'Desde ' : ''}${opt.price}</span>
          </div>
          <div className="text-sinapsia-light text-sm mb-2">{opt.description}</div>
          <ul className="text-xs text-sinapsia-light pl-4 list-disc">
            {opt.features.map(f => <li key={f}>{f}</li>)}
          </ul>
        </button>
      ))}
    </div>
  );
}
