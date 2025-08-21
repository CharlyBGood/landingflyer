
export default function HeroCard({ header, paragraph, price, btnText }) {
  return (
    <div className="flex-1 bg-sinapsia-base border border-sinapsia-accent rounded-xl p-4 flex flex-col items-center shadow-md">
      <h3 className="text-xl font-bold mb-2 text-white">
        {header}
      </h3>
      <p className="text-sinapsia-light mb-2 text-sm">
        {paragraph}
      </p>
      <div className="text-2xl font-bold text-sinapsia-accent mb-4">
        {price}
      </div>
      <button className="btn-sinapsia-primary w-full sm:w-auto px-4 py-2.5 text-white font-medium text-base rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg mb-2">{btnText}</button>
    </div>
  )
}
