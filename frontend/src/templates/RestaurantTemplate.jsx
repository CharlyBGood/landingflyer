import { MapPin, Phone, Clock, Star } from 'lucide-react';

const RestaurantTemplate = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <div className="text-orange-600 font-semibold mb-3 sm:mb-4 text-sm sm:text-base lg:text-lg">AUTHENTIC ITALIAN CUISINE</div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
                Bella Vista
                <span className="block text-orange-600 font-script text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
                  Ristorante
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Experience the authentic flavors of Italy in the heart of the city.
                Fresh ingredients, traditional recipes, and warm hospitality await you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="bg-orange-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm sm:text-base">
                  Make Reservation
                </button>
                <button className="border-2 border-orange-600 text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors text-sm sm:text-base">
                  View Menu
                </button>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <img
                src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Restaurant interior"
                className="w-full h-48 sm:h-64 lg:h-96 object-cover rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-3 -left-3 sm:-bottom-6 sm:-left-6 bg-white p-3 sm:p-6 rounded-lg shadow-lg">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-800 font-semibold text-sm sm:text-base">4.9/5 Rating</p>
                <p className="text-gray-600 text-xs sm:text-sm">Based on 500+ reviews</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Chef's Specialties</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-2">Handcrafted dishes with love and tradition</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Pasta"
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Homemade Pasta</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Fresh pasta made daily with traditional Italian techniques</p>
                <p className="text-orange-600 font-bold text-lg sm:text-xl">$18.99</p>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Pizza"
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Margherita Pizza</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Wood-fired pizza with fresh mozzarella and basil</p>
                <p className="text-orange-600 font-bold text-lg sm:text-xl">$16.99</p>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
              <img
                src="https://images.pexels.com/photos/1352199/pexels-photo-1352199.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Tiramisu"
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Classic Tiramisu</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">Traditional Italian dessert with mascarpone and coffee</p>
                <p className="text-orange-600 font-bold text-lg sm:text-xl">$8.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Restaurant Info */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="bg-orange-100 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Location</h3>
              <p className="text-sm sm:text-base text-gray-600">123 Italian Street<br />Downtown, NY 10001</p>
            </div>

            <div className="text-center p-4 sm:p-6">
              <div className="bg-green-100 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                <Phone className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Phone</h3>
              <p className="text-sm sm:text-base text-gray-600">(555) 123-4567<br />Call for reservations</p>
            </div>

            <div className="text-center p-4 sm:p-6">
              <div className="bg-blue-100 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Hours</h3>
              <p className="text-sm sm:text-base text-gray-600">Mon-Sun: 11am - 10pm<br />Happy Hour: 3pm - 6pm</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-yellow-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Book Your Table Today</h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 px-2">Experience authentic Italian cuisine in a warm, welcoming atmosphere</p>
          <button className="bg-white text-orange-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-base sm:text-lg">
            Make a Reservation
          </button>
        </div>
      </section>
    </div>
  );
};

export default RestaurantTemplate;