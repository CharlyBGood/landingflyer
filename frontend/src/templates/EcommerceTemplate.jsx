import { ShoppingBag, Star, Truck, Shield, RefreshCw } from 'lucide-react';

const EcommerceTemplate = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-teal-50">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
                Premium Products,
                <span className="block text-green-600">
                  Unbeatable Prices
                </span>
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
                Discover our curated collection of high-quality products. From everyday essentials to luxury items, we have everything you need.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button className="bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm sm:text-base">
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  Shop Now
                </button>
                <button className="border-2 border-green-600 text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition-colors text-sm sm:text-base">
                  Browse Categories
                </button>
              </div>
            </div>

            <div className="relative mt-8 lg:mt-0">
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <img
                  src="https://images.pexels.com/photos/230544/pexels-photo-230544.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Product 1"
                  className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                />
                <img
                  src="https://images.pexels.com/photos/691710/pexels-photo-691710.jpeg?auto=compress&cs=tinysrgb&w=300"
                  alt="Product 2"
                  className="w-full h-32 sm:h-40 lg:h-48 object-cover rounded-lg shadow-lg hover:shadow-xl transition-shadow mt-4 sm:mt-8"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Why Shop With Us?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-2">We're committed to providing the best shopping experience</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
              <div className="bg-green-100 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Free Shipping</h3>
              <p className="text-sm sm:text-base text-gray-600">Free shipping on orders over $50. Fast delivery nationwide.</p>
            </div>

            <div className="text-center p-4 sm:p-6">
              <div className="bg-blue-100 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Secure Payment</h3>
              <p className="text-sm sm:text-base text-gray-600">Your payment information is always safe and secure with us.</p>
            </div>

            <div className="text-center p-4 sm:p-6">
              <div className="bg-purple-100 p-3 sm:p-4 rounded-full w-fit mx-auto mb-3 sm:mb-4">
                <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Easy Returns</h3>
              <p className="text-sm sm:text-base text-gray-600">30-day return policy. No questions asked, hassle-free returns.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">Featured Products</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 px-2">Handpicked items just for you</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Product"
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="p-4 sm:p-6">
                <div className="flex items-center mb-1 sm:mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs sm:text-sm text-gray-500 ml-2">(124)</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Premium Headphones</h3>
                <p className="text-green-600 font-bold text-lg sm:text-xl">$199.99</p>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="https://images.pexels.com/photos/336948/pexels-photo-336948.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Product"
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="p-4 sm:p-6">
                <div className="flex items-center mb-1 sm:mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs sm:text-sm text-gray-500 ml-2">(89)</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Smart Watch</h3>
                <p className="text-green-600 font-bold text-lg sm:text-xl">$299.99</p>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow sm:col-span-2 lg:col-span-1">
              <img
                src="https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=400"
                alt="Product"
                className="w-full h-40 sm:h-48 object-cover"
              />
              <div className="p-4 sm:p-6">
                <div className="flex items-center mb-1 sm:mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-xs sm:text-sm text-gray-500 ml-2">(156)</span>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">Wireless Speaker</h3>
                <p className="text-green-600 font-bold text-lg sm:text-xl">$149.99</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-green-600 to-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">Start Shopping Today</h2>
          <p className="text-base sm:text-lg lg:text-xl mb-6 sm:mb-8 opacity-90 px-2">Join thousands of satisfied customers and discover amazing products</p>
          <button className="bg-white text-green-600 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-base sm:text-lg">
            Browse All Products
          </button>
        </div>
      </section>
    </div>
  );
};

export default EcommerceTemplate;