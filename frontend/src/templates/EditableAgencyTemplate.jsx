import React from 'react';
import { ArrowUpRight, Palette, Target, Lightbulb } from 'lucide-react';

const EditableAgencyTemplate = ({ content }) => {
  const getText = (id) => content.texts.find(t => t.id === id)?.content || '';
  const getImage = (id) => content.images.find(i => i.id === id)?.src || '';
  const getColor = (id) => content.colors.find(c => c.id === id)?.value || '';

  return (
    <div style={{ backgroundColor: getColor('background') }}>
      {/* Hero Section */}
      <section className="min-h-screen flex items-center text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div 
                className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg"
                style={{ color: getColor('primary') }}
              >
                {getText('tagline')}
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">
                {getText('heroTitle')}
                <span 
                  className="block text-transparent bg-clip-text"
                  style={{ 
                    background: `linear-gradient(90deg, ${getColor('primary')} 0%, ${getColor('secondary')} 100%)`,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text'
                  }}
                >
                  {getText('heroHighlight')}
                </span>
                {getText('heroSubtitle')}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                {getText('heroDescription')}
              </p>
              <button 
                className="group text-white px-6 sm:px-8 py-3 sm:py-4 rounded-none font-bold transition-all duration-300 flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base hover:opacity-90"
                style={{ backgroundColor: getColor('primary') }}
              >
                {getText('primaryButton')}
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
            <div className="relative">
              <img
                src={getImage('heroImage')}
                alt="Hero"
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-20 lg:py-24 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
              style={{ color: getColor('primary') }}
            >
              {getText('servicesTitle')}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto">
              {getText('servicesDescription')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Service 1 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 sm:p-8 hover:bg-white/10 transition-colors">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: getColor('primary') }}
              >
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">
                {getText('service1Title')}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                {getText('service1Description')}
              </p>
            </div>

            {/* Service 2 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 sm:p-8 hover:bg-white/10 transition-colors">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: getColor('secondary') }}
              >
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">
                {getText('service2Title')}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                {getText('service2Description')}
              </p>
            </div>

            {/* Service 3 */}
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 sm:p-8 hover:bg-white/10 transition-colors">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                style={{ backgroundColor: getColor('accent') }}
              >
                <Lightbulb className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold mb-3 text-white">
                {getText('service3Title')}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base">
                {getText('service3Description')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-white">
            {getText('ctaTitle')}
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8">
            {getText('ctaDescription')}
          </p>
          <button 
            className="text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold transition-all duration-300 hover:opacity-90"
            style={{ backgroundColor: getColor('primary') }}
          >
            {getText('ctaButton')}
          </button>
        </div>
      </section>
    </div>
  );
};

export default EditableAgencyTemplate;