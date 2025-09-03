import { ArrowRight, Zap, Shield, Users } from 'lucide-react';

const SaasTemplate = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              Transform Your
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Business Today
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto opacity-90 px-2">
              Streamline operations, boost productivity, and scale your business with our cutting-edge SaaS platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors text-sm sm:text-base">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Why Choose Our Platform?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-2">Built for modern businesses that demand excellence</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-blue-100 p-2 sm:p-3 rounded-lg w-fit mb-3 sm:mb-4">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Lightning Fast</h3>
              <p className="text-sm sm:text-base text-gray-600">Experience blazing-fast performance with our optimized infrastructure and global CDN.</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-purple-100 p-2 sm:p-3 rounded-lg w-fit mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Enterprise Security</h3>
              <p className="text-sm sm:text-base text-gray-600">Bank-level security with end-to-end encryption and compliance certifications.</p>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
              <div className="bg-green-100 p-2 sm:p-3 rounded-lg w-fit mb-3 sm:mb-4">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Team Collaboration</h3>
              <p className="text-sm sm:text-base text-gray-600">Seamless collaboration tools that bring your team together, wherever they are.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Ready to Get Started?</h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 px-2">Join over 10,000+ companies already using our platform</p>
          <button className="bg-white text-blue-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-base sm:text-lg">
            Start Your Free Trial
          </button>
        </div>
      </section>
    </div>
  );
};

export default SaasTemplate;