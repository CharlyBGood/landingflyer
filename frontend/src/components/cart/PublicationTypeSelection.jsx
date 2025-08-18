
const options = [
  {
    value: 'basic',
    title: 'Publicación Estándar',
    price: 15,
    description: 'Solución accesible con hosting profesional por 1 año',
    features: [
      'Landing page completa',
      'URL personalizada de SinapsiaLab',
      'Hosting profesional por 1 año',
      '+2 más...'
    ]
  },
  {
    value: 'premium',
    title: 'Publicación Premium',
    price: 35,
    description: 'Dominio personalizado y funcionalidades avanzadas',
    features: [
      'Todo lo de la versión estándar',
      'Dominio personalizado (.com, .net, etc)',
      'Hosting premium por 1 año',
      '+3 más...'
    ]
  }
];

export default function PublicationTypeSelection({ value, onChange }) {
  return (
    <div className="flex flex-col sm:flex-row gap-6 w-full">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          className={`flex-1 border rounded-xl p-5 text-left transition-all duration-200 focus:outline-none 
            ${value === opt.value ? 'border-sinapsia-accent bg-sinapsia-base shadow-lg' : 'border-gray-700 bg-transparent'}`}
          onClick={() => onChange(opt.value)}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-lg text-sinapsia-light">{opt.title}</span>
            <span className="font-semibold text-sinapsia-accent">Desde ${opt.price}</span>
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
