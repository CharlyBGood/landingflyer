import { ArrowUpRight, Palette, Target, Lightbulb } from 'lucide-react';

const AgencyTemplate = () => {
  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="text-orange-500 font-semibold mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg">CREATIVE AGENCY</div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">
                WE CREATE
                <span className="block text-transparent bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text">
                  BOLD
                </span>
                EXPERIENCES
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                We're a full-service creative agency that transforms brands through powerful storytelling and innovative design solutions.
              </p>
              <button className="group bg-orange-500 hover:bg-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-none font-bold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base">
                VIEW OUR WORK
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="bg-gradient-to-br from-orange-500 to-red-500 p-1 transform rotate-3 hover:rotate-6 transition-transform duration-300">
                <img
                  src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Creative work"
                  className="w-full h-48 sm:h-64 lg:h-96 object-cover filter grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-zinc-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 sm:mb-4">OUR SERVICES</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="group bg-black p-6 sm:p-8 hover:bg-zinc-800 transition-colors duration-300 sm:col-span-2 lg:col-span-1">
              <Palette className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-orange-500 mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-orange-500 transition-colors">BRANDING</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Complete brand identity development that captures your essence and resonates with your audience.
              </p>
            </div>

            <div className="group bg-black p-6 sm:p-8 hover:bg-zinc-800 transition-colors duration-300">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-orange-500 mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-orange-500 transition-colors">STRATEGY</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Data-driven marketing strategies that deliver measurable results and sustainable growth.
              </p>
            </div>

            <div className="group bg-black p-6 sm:p-8 hover:bg-zinc-800 transition-colors duration-300">
              <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-orange-500 mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-orange-500 transition-colors">CREATIVE</h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                Innovative creative solutions that break through the noise and create lasting impressions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-4 sm:mb-6 leading-tight">LET'S CREATE SOMETHING AMAZING</h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 px-2">Ready to transform your brand? Let's talk about your next project.</p>
          <button className="bg-black text-white px-8 sm:px-10 py-3 sm:py-4 font-bold hover:bg-zinc-800 transition-colors text-base sm:text-lg">
            START A PROJECT
          </button>
        </div>
      </section>
    </div>
  );
};

export default AgencyTemplate;