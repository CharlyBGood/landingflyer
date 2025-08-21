import HeroCard from './HeroCard.jsx';

export default function HeroCardContainer({ onBasicClick, onPremiumClick }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch max-w-3xl mx-auto mb-4">
        <HeroCard
          header="Publicación Exprés"
          paragraph="Página lista para publicar + hosting 1 año + dominio genérico al instante."
          priceUSD={300}
          priceARS={390000}
          btnText="Comenzar"
          onClick={onBasicClick}
        />
        <HeroCard
          header="Premium a medida"
          paragraph="Todo lo del plan básico + Personalizaciones extras + pago flexible contra entrega."
          priceUSD={500}
          priceARS={650000}
          btnText="Ver personalización"
          fromLabel
          recommended
          onClick={onPremiumClick}
        />
      </div>
      <span className="block text-xs text-gray-400 text-center leading-tight mb-2 mt-[-0.5rem]">Conseguí dominio personalizado al realizar la compra.</span>
      <div className="max-w-2xl mx-auto mt-2">
        <ul className="text-sinapsia-light text-sm sm:text-base text-left list-disc pl-6">
          <li><span className="font-semibold">Opción Exprés:</span> Generación automática, editor visual y SEO básico.</li>
          <li><span className="font-semibold">Opción Premium:</span> Todo lo anterior + extras como CMS básico, formularios, <span className="whitespace-nowrap">e-commerce</span> y SEO avanzado.</li>
        </ul>
      </div>
    </>
  )
}
