
const extras = [
  { label: 'Analytics Avanzado', value: 'analytics', price: 15, desc: 'Google Analytics + reportes mensuales' },
  { label: 'Mantenimiento Mensual', value: 'maintenance', price: 20, desc: 'Actualizaciones y backups automáticos' },
  { label: 'Soporte Premium', value: 'support', price: 12, desc: 'Soporte prioritario 24/7 por chat y email' }
];

export default function ExtrasAndAddons({ formData, onChange }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="font-semibold text-sinapsia-light mb-2">Servicios Adicionales</div>
      <div className="flex flex-col gap-3">
        {extras.map(extra => (
          <label key={extra.value} className="flex items-center gap-3 cursor-pointer text-sinapsia-light text-sm">
            <input
              type="checkbox"
              checked={formData.extras.includes(extra.value)}
              onChange={() => {
                const newExtras = formData.extras.includes(extra.value)
                  ? formData.extras.filter(x => x !== extra.value)
                  : [...formData.extras, extra.value];
                onChange({ ...formData, extras: newExtras });
              }}
              className="accent-sinapsia-accent"
            />
            <span className="font-medium">{extra.label}</span>
            <span className="ml-1 text-sinapsia-accent font-semibold">+${extra.price}{extra.value === 'analytics' && '/mes'}</span>
            <span className="text-xs text-gray-400">{extra.desc}</span>
          </label>
        ))}
      </div>
      <div className="bg-sinapsia-base border border-sinapsia-accent rounded-lg p-3 mt-2 text-xs text-sinapsia-light">
        <span className="font-semibold text-yellow-400 mr-2">⚡ Consejo Profesional</span>
        Los servicios adicionales pueden contratarse o cancelarse en cualquier momento desde tu panel de control.
      </div>
    </div>
  );
}
