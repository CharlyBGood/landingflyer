import calculatePrice from '../../utilities/calculatePrice';

export default function OrderSummary({ formData, onBack, onPublish }) {
  const { total, monthly } = calculatePrice(formData);
  return (
    <div className="flex flex-col gap-6">
      <div className="font-semibold text-sinapsia-light mb-2">Resumen de tu Pedido</div>
      <div className="bg-sinapsia-base border border-sinapsia-accent rounded-lg p-4 flex flex-col gap-2">
        <div className="flex justify-between text-sinapsia-light text-sm">
          <span>Tipo de Publicación:</span>
          <span className="font-semibold flex items-center gap-2">
            {formData.publicationType === 'basic' ? 'Publicación Exprés' : 'Premium a medida'}
            {formData.publicationType === 'premium' && (
              <span className="bg-sinapsia-accent text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">Recomendado</span>
            )}
          </span>
        </div>
        <div className="flex justify-between text-sinapsia-light text-sm">
          <span>Entrega:</span>
          <span>{formData.deliveryTime === 'standard' ? '24-48 horas' : formData.deliveryTime === 'priority' ? '12-24 horas' : '2-6 horas'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="font-semibold text-sinapsia-light">Modificaciones Incluidas</div>
          <ul className="list-disc pl-5 text-xs">
            {formData.modifications.length === 0 ? <li>Ninguna</li> : formData.modifications.map(m => <li key={m}>{m.replace(/^[a-z]/, c => c.toUpperCase()).replace('-', ' ')}</li>)}
          </ul>
        </div>
        {formData.extras.length > 0 && (
          <div className="flex flex-col gap-1">
            <div className="font-semibold text-sinapsia-light">Servicios Adicionales</div>
            <ul className="list-disc pl-5 text-xs">
              {formData.extras.map(e => <li key={e}>{e.replace(/^[a-z]/, c => c.toUpperCase()).replace('-', ' ')}</li>)}
            </ul>
          </div>
        )}
      </div>
      <div className="bg-sinapsia-base border border-sinapsia-accent rounded-lg p-4">
        <div className="flex justify-between text-sinapsia-light text-sm">
          <span>Costo base:</span>
          <span>${formData.publicationType === 'basic' ? 350 : 650}</span>
        </div>
        <div className="flex justify-between text-sinapsia-light text-sm">
          <span>Extras únicos:</span>
          <span>+${total - (formData.publicationType === 'basic' ? 350 : 650) - (monthly * 1)}</span>
        </div>
        <div className="flex justify-between text-sinapsia-light text-sm">
          <span>Servicios mensuales:</span>
          <span>+${monthly}/mes</span>
        </div>
        <div className="text-2xl font-bold text-sinapsia-accent mt-2">${total}</div>
        {monthly > 0 && <div className="text-xs text-sinapsia-light">+ ${monthly}/mes después</div>}
      </div>
      <div className="flex gap-2 mt-2">
        <button onClick={onBack} className="flex-1 py-2 rounded-lg bg-gray-700 text-sinapsia-light font-semibold hover:bg-gray-600 transition">← Volver a editar</button>
        <button onClick={onPublish} className="flex-1 py-2 rounded-lg bg-sinapsia-accent text-white font-semibold hover:bg-sinapsia-gradient transition">Publicar</button>
      </div>
    </div>
  );
}
