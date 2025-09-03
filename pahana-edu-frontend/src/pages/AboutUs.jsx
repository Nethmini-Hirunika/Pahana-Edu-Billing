import React from 'react';
import { Link } from 'react-router-dom';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/3 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
              About PahanaEDU
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Colombo's Premier Bookstore - Your Gateway to Knowledge and Discovery
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Story */}
        <div className="mb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Founded in the heart of Colombo, PahanaEDU has been serving book lovers and knowledge seekers 
                for over two decades. What started as a small family bookstore has grown into one of Sri Lanka's 
                most trusted destinations for quality books and educational resources.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Our name "Pahana" represents the light of knowledge that illuminates the path to learning and growth. 
                We believe that every book has the power to transform lives, expand horizons, and connect people 
                across cultures and generations.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, we continue our mission to make quality literature and educational materials accessible 
                to everyone, fostering a love for reading and lifelong learning in our community.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8">
              <div className="text-center">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">20+ Years</h3>
                <p className="text-gray-600">Serving the Colombo community with passion and dedication</p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Mission */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              To inspire, educate, and connect people through the power of books and knowledge
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Inspire</h3>
              <p className="text-gray-600">
                We curate collections that inspire curiosity, creativity, and personal growth
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">📖</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Educate</h3>
              <p className="text-gray-600">
                Providing access to quality educational resources for all ages and backgrounds
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Connect</h3>
              <p className="text-gray-600">
                Building a community of readers, learners, and knowledge seekers
              </p>
            </div>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl text-center">
              <div className="text-3xl mb-3">🌟</div>
              <h3 className="font-bold mb-2">Quality</h3>
              <p className="text-sm opacity-90">Curating only the finest books and resources</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-2xl text-center">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="font-bold mb-2">Innovation</h3>
              <p className="text-sm opacity-90">Embracing new ways to serve our community</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl text-center">
              <div className="text-3xl mb-3">🌱</div>
              <h3 className="font-bold mb-2">Sustainability</h3>
              <p className="text-sm opacity-90">Committed to environmental responsibility</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl text-center">
              <div className="text-3xl mb-3">❤️</div>
              <h3 className="font-bold mb-2">Community</h3>
              <p className="text-sm opacity-90">Supporting and growing our local community</p>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose PahanaEDU?</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">📚</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Extensive Collection</h3>
                  <p className="text-gray-600">
                    Over 10,000 carefully curated books across all genres and subjects
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎓</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Expert Recommendations</h3>
                  <p className="text-gray-600">
                    Get personalized book suggestions from our knowledgeable staff
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🚚</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Fast Delivery</h3>
                  <p className="text-gray-600">
                    Quick and reliable delivery across Colombo and beyond
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">💬</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Personalized Service</h3>
                  <p className="text-gray-600">
                    Friendly, knowledgeable staff ready to help you find the perfect book
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🎉</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Events & Workshops</h3>
                  <p className="text-gray-600">
                    Regular book clubs, author meetups, and educational workshops
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🛡️</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Guarantee</h3>
                  <p className="text-gray-600">
                    All books are carefully inspected and guaranteed to meet our standards
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Reading Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Explore our vast collection and discover your next favorite book
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalog"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Browse Books
            </Link>
            <Link
              to="/contact"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
