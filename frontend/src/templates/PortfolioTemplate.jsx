import { ExternalLink, Download, Mail, Linkedin, Github } from 'lucide-react';

const PortfolioTemplate = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16 lg:py-20 text-center">
          <div className="mb-6 sm:mb-8">
            <img
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=200"
              alt="Profile"
              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full mx-auto mb-4 sm:mb-6 shadow-lg object-cover"
            />
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-gray-800 mb-4 sm:mb-6">
            Sarah Johnson
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 font-light">
            Creative Designer & Developer
          </p>
          <p className="text-sm sm:text-base lg:text-lg text-gray-500 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-2">
            I craft digital experiences that blend beautiful design with functional code.
            Passionate about creating solutions that make a difference.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <button className="bg-gray-800 text-white px-6 sm:px-8 py-3 rounded font-medium hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
              <Download className="w-4 h-4 sm:w-4 sm:h-4" />
              Download CV
            </button>
            <button className="border-2 border-gray-800 text-gray-800 px-6 sm:px-8 py-3 rounded font-medium hover:bg-gray-800 hover:text-white transition-colors text-sm sm:text-base">
              View Projects
            </button>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-800 mb-3 sm:mb-4">Selected Work</h2>
            <div className="w-16 h-0.5 bg-gray-800 mx-auto"></div>
          </div>

          <div className="space-y-12 sm:space-y-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div>
                <img
                  src="https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Project 1"
                  className="w-full h-48 sm:h-64 lg:h-auto object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
              <div className="mt-4 lg:mt-0">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-800 mb-3 sm:mb-4">E-commerce Platform</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  A modern e-commerce platform built with React and Node.js, featuring a clean design
                  and seamless user experience. Includes payment integration and inventory management.
                </p>
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  <span className="bg-gray-200 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">React</span>
                  <span className="bg-gray-200 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">Node.js</span>
                  <span className="bg-gray-200 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">MongoDB</span>
                </div>
                <button className="text-gray-800 hover:text-gray-600 transition-colors flex items-center gap-2 text-sm sm:text-base">
                  View Project <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-light text-gray-800 mb-3 sm:mb-4">Mobile Banking App</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  A secure and intuitive mobile banking application with biometric authentication,
                  real-time transactions, and comprehensive financial management features.
                </p>
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  <span className="bg-gray-200 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">React Native</span>
                  <span className="bg-gray-200 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">TypeScript</span>
                  <span className="bg-gray-200 px-2 sm:px-3 py-1 rounded text-xs sm:text-sm">Firebase</span>
                </div>
                <button className="text-gray-800 hover:text-gray-600 transition-colors flex items-center gap-2 text-sm sm:text-base">
                  View Project <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
              <div className="order-1 lg:order-2 mb-4 lg:mb-0">
                <img
                  src="https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Project 2"
                  className="w-full h-48 sm:h-64 lg:h-auto object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-800 mb-4 sm:mb-6">Let's Work Together</h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-8 sm:mb-12 px-2">
            I'm always open to discussing new opportunities and interesting projects.
          </p>

          <div className="flex justify-center gap-6 sm:gap-8 mb-8 sm:mb-12">
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
              <Linkedin className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-800 transition-colors">
              <Github className="w-5 h-5 sm:w-6 sm:h-6" />
            </a>
          </div>

          <button className="bg-gray-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded font-medium hover:bg-gray-900 transition-colors text-base sm:text-lg">
            Get In Touch
          </button>
        </div>
      </section>
    </div>
  );
};

export default PortfolioTemplate;