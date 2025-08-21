import HeroCard from './HeroCard.jsx';

export default function HeroCardContainer() {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch max-w-3xl mx-auto mb-4">
        <HeroCard
          header="Publicación Exprés"
          paragraph="Página lista para publicar + hosting 1 año + dominio genérico al instante."
          price="USD 350"
          btnText="Ver detalles"
        />
        <HeroCard
          header="Premium a medida"
          paragraph="Todo lo del plan básico + Personalizaciones extras + pago flexible contra entrega."
          price="Desde USD 500"
          btnText="Ver personalización"
        />
      </div>
      <div className="max-w-2xl mx-auto mt-2">
        <ul className="text-sinapsia-light text-sm sm:text-base text-left list-disc pl-6">
          <li><span className="font-semibold">Opción Exprés:</span> Generación automática, editor visual y SEO básico.</li>
          <li><span className="font-semibold">Opción Premium:</span> Todo lo anterior + extras como CMS básico, formularios, e-commerce y SEO avanzado.</li>
          <li>Buscá y comprá tu <span className="font-semibold">dominio personalizado</span> al realizar la compra.</li>
        </ul>
      </div>
    </>
  )
}
