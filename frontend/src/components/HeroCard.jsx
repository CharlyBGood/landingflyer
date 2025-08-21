
import { ArgentinaFlag, USAFlag } from '../utilities/FlagIcons.jsx';

export default function HeroCard({ header, paragraph, priceUSD, priceARS, btnText, fromLabel, recommended, onClick }) {
  return (
    <div className="flex-1 bg-sinapsia-base border border-sinapsia-accent rounded-xl p-4 flex flex-col items-center shadow-md relative">
      {recommended && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sinapsia-accent/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10" style={{backgroundColor: 'rgba(122,69,160,0.85)'}}>Recomendado</span>
      )}
      <h3 className="text-xl font-bold mb-2 text-white">
        {header}
      </h3>
      <p className="text-sinapsia-light mb-2 text-sm">
        {paragraph}
      </p>
      <div className="flex flex-row gap-4 items-center mb-4 w-full justify-center">
        {fromLabel && (
          <span className="text-xs sm:text-sm text-gray-400 mr-2 whitespace-nowrap">Desde</span>
        )}
        <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-sinapsia-light whitespace-nowrap">
          <ArgentinaFlag size={18} />
          <span>$ {priceARS.toLocaleString('es-AR')}</span>
        </div>
        <div className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-sinapsia-light whitespace-nowrap">
          <USAFlag size={18} />
          <span>USD {priceUSD}</span>
        </div>
      </div>
      <button className="btn-sinapsia-primary w-full sm:w-auto px-4 py-2.5 text-white font-medium text-base rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg mb-2" onClick={onClick}>{btnText}</button>
    </div>
  )
}
