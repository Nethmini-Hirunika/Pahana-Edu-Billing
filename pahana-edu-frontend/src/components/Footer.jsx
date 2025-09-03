import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const contactInfo = {
    phone: "+94 11 234 5678",
    email: "info@pahanaedu.lk",
    address: "123 Book Street, Colombo 03, Sri Lanka",
    hours: "Mon-Sat: 9:00 AM - 8:00 PM\nSun: 10:00 AM - 6:00 PM"
  };

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "Catalog", path: "/catalog" },
    { name: "About Us", path: "/about" },
    { name: "Help & Support", path: "/help" },
    { name: "Contact", path: "/contact" }
  ];

  const categories = [
    { name: "Fiction", path: "/catalog/fiction" },
    { name: "Science", path: "/catalog/science" },
    { name: "Business", path: "/catalog/business" },
    { name: "Technology", path: "/catalog/technology" },
    { name: "History", path: "/catalog/history" },
    { name: "Self-Help", path: "/catalog/self-help" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "📘", url: "https://facebook.com/pahanaedu" },
    { name: "Instagram", icon: "📷", url: "https://instagram.com/pahanaedu" },
    { name: "Twitter", icon: "🐦", url: "https://twitter.com/pahanaedu" },
    { name: "YouTube", icon: "📺", url: "https://youtube.com/pahanaedu" }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <div className="text-3xl mr-3">📚</div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                PahanaEDU
              </h3>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Colombo's premier bookstore, serving book lovers and knowledge seekers for over two decades. 
              Your gateway to discovery and learning.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                  title={social.name}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Categories</h4>
            <ul className="space-y-3">
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    to={category.path}
                    className="text-gray-300 hover:text-white transition-colors duration-200"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-white">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 mt-1">
                  <span className="text-blue-400">📞</span>
                </div>
                <div>
                  <p className="text-gray-300">{contactInfo.phone}</p>
                  <p className="text-sm text-gray-400">Call us anytime</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 mt-1">
                  <span className="text-green-400">✉️</span>
                </div>
                <div>
                  <p className="text-gray-300">{contactInfo.email}</p>
                  <p className="text-sm text-gray-400">We'll respond within 24h</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 mt-1">
                  <span className="text-purple-400">📍</span>
                </div>
                <div>
                  <p className="text-gray-300">{contactInfo.address}</p>
                  <p className="text-sm text-gray-400">Visit our store</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 mt-1">
                  <span className="text-orange-400">🕒</span>
                </div>
                <div>
                  <p className="text-gray-300 whitespace-pre-line">{contactInfo.hours}</p>
                  <p className="text-sm text-gray-400">Business hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="text-center">
            <h4 className="text-xl font-semibold mb-4">Stay Updated</h4>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest book releases, exclusive offers, and literary events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} PahanaEDU. All rights reserved. Colombo's Leading Bookstore.
            </div>
            <div className="flex space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                Help & Support
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 z-50"
        title="Back to top"
      >
        <span className="text-xl">↑</span>
      </button>
    </footer>
  );
}
