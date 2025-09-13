import HeroCard from './HeroCard.jsx';

export default function HeroCardContainer({ onBasicClick }) {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-6 justify-center items-stretch max-w-3xl mx-auto mb-4">
        <HeroCard
          header="Publicación Exprés"
          paragraph="¡Tu Landing Page publicada en minutos! ► 
          Subí un flyer o completá un formulario; obtené una página moderna, responsive y editable.Hosting 1 año + dominio."
          priceUSD={199}
          priceARS={260000}
          btnText="Comenzar"
          onClick={onBasicClick}
        />
      </div>
      <span className="block text-xs text-gray-400 text-center leading-tight mb-2 mt-[-0.5rem]">Conseguí dominio personalizado al continuar con la compra.</span>
      <div className="max-w-2xl mx-auto mt-2">
        <ul className="text-sinapsia-light text-sm sm:text-base text-left list-disc pl-6">
          <li><span className="font-semibold">Opción Exprés:</span> Generación automática, editor visual y SEO básico.</li>
          {/* <li><span className="font-semibold">Opción Premium:</span> Todo lo anterior + extras como CMS básico, formularios, <span className="whitespace-nowrap">e-commerce</span> y SEO avanzado.</li> */}
        </ul>
      </div>
    </>
  )
}
