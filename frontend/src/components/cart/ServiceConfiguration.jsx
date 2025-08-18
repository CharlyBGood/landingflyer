const modifications = [
  { label: 'E-commerce Básico', value: 'ecommerce', price: 15 },
  { label: 'Sección de Blog', value: 'blog', price: 12 },
  { label: 'Sección de Testimonios', value: 'testimonials', price: 5 },
  { label: 'Formularios Avanzados', value: 'forms', price: 8 },
  { label: 'Galería de Imágenes', value: 'gallery', price: 6 }
];

const deliveryOptions = [
  { label: 'Estándar (24-48 horas)', value: 'standard', price: 0 },
  { label: 'Prioritario (12-24 horas)', value: 'priority', price: 10 },
  { label: 'Express (2-6 horas)', value: 'express', price: 25 }
];

export default function ServiceConfiguration({ formData, onChange }) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="font-semibold text-sinapsia-light mb-2">Modificaciones Adicionales</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {modifications.map(mod => (
            <label key={mod.value} className="flex items-center gap-2 cursor-pointer text-sinapsia-light text-sm">
              <input
                type="checkbox"
                checked={formData.modifications.includes(mod.value)}
                onChange={() => {
                  const mods = formData.modifications.includes(mod.value)
                    ? formData.modifications.filter(m => m !== mod.value)
                    : [...formData.modifications, mod.value];
                  onChange({ ...formData, modifications: mods });
                }}
                className="accent-sinapsia-accent"
              />
              {mod.label} <span className="ml-1 text-sinapsia-accent font-semibold">+${mod.price}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <div className="font-semibold text-sinapsia-light mb-2">Tiempo de Entrega</div>
        <div className="flex flex-col gap-2">
          {deliveryOptions.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sinapsia-light text-sm">
              <input
                type="radio"
                name="deliveryTime"
                checked={formData.deliveryTime === opt.value}
                onChange={() => onChange({ ...formData, deliveryTime: opt.value })}
                className="accent-sinapsia-accent"
              />
              {opt.label} {opt.price > 0 && <span className="ml-1 text-sinapsia-accent font-semibold">+${opt.price}</span>}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
