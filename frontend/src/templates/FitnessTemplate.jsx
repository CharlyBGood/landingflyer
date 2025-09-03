import { Zap, Users, Trophy, Calendar } from 'lucide-react';

const FitnessTemplate = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-purple-600 to-pink-600 text-white flex items-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16 lg:py-20 z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 leading-tight">
              TRANSFORM
              <span className="block bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text text-transparent">
                YOUR BODY
              </span>
            </h1>
            <p className="text-base sm:text-lg lg:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
              Join our high-energy fitness community and unlock your strongest, healthiest self with expert trainers and cutting-edge equipment.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <button className="bg-white text-purple-600 px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold hover:bg-gray-100 transition-colors text-sm sm:text-base lg:text-lg">
                START FREE TRIAL
              </button>
              <button className="border-2 border-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold hover:bg-white hover:text-purple-600 transition-colors text-sm sm:text-base lg:text-lg">
                VIEW CLASSES
              </button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Fitness"
            className="w-full h-full object-cover object-center"
          />
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-3 sm:mb-4">OUR PROGRAMS</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 px-2">Choose your path to greatness</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="group bg-gradient-to-br from-purple-600 to-pink-600 p-6 sm:p-8 rounded-xl hover:scale-105 transition-transform duration-300 sm:col-span-2 lg:col-span-1">
              <Zap className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">HIGH INTENSITY</h3>
              <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
                Push your limits with our HIIT workouts designed to maximize results in minimum time.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-pink-600 to-red-600 p-6 sm:p-8 rounded-xl hover:scale-105 transition-transform duration-300">
              <Users className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">GROUP FITNESS</h3>
              <p className="text-sm sm:text-base text-pink-100 leading-relaxed">
                Join our energetic group classes and build strength while making lasting friendships.
              </p>
            </div>

            <div className="group bg-gradient-to-br from-blue-600 to-purple-600 p-6 sm:p-8 rounded-xl hover:scale-105 transition-transform duration-300">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-white mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">PERSONAL TRAINING</h3>
              <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
                One-on-one sessions with certified trainers to achieve your specific fitness goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl lg:text-5xl font-black mb-1 sm:mb-2">5000+</div>
              <div className="text-sm sm:text-base lg:text-lg">Members</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-5xl font-black mb-1 sm:mb-2">50+</div>
              <div className="text-sm sm:text-base lg:text-lg">Classes Weekly</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-5xl font-black mb-1 sm:mb-2">15</div>
              <div className="text-sm sm:text-base lg:text-lg">Expert Trainers</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl lg:text-5xl font-black mb-1 sm:mb-2">8</div>
              <div className="text-sm sm:text-base lg:text-lg">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Class Schedule</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-2">Find the perfect time for your workout</p>
          </div>

          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 p-6 sm:p-8">
              <div className="text-center">
                <div className="bg-purple-100 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Morning Power</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">6:00 AM - 7:00 AM</p>
                <p className="text-purple-600 font-semibold text-sm sm:text-base">Monday to Friday</p>
              </div>

              <div className="text-center sm:col-span-2 lg:col-span-1">
                <div className="bg-pink-100 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-pink-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Lunch Break Fitness</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">12:00 PM - 1:00 PM</p>
                <p className="text-pink-600 font-semibold text-sm sm:text-base">Monday to Friday</p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Evening Burn</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">6:00 PM - 7:30 PM</p>
                <p className="text-blue-600 font-semibold text-sm sm:text-base">All Week</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-4 sm:mb-6">READY TO START?</h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 px-2">Your transformation begins with a single step. Take it today.</p>
          <button className="bg-white text-purple-600 px-8 sm:px-10 py-3 sm:py-4 rounded-full font-bold hover:bg-gray-100 transition-colors text-base sm:text-lg">
            JOIN NOW - 7 DAYS FREE
          </button>
        </div>
      </section>
    </div>
  );
};

export default FitnessTemplate;