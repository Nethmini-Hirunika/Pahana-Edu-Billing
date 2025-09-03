import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Help() {
  const [activeTab, setActiveTab] = useState('faq');

  const faqs = [
    {
      category: "Shopping",
      questions: [
        {
          question: "How do I place an order?",
          answer: "Browse our catalog, add items to your cart, and proceed to checkout. You'll need to create an account or sign in to complete your purchase."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, debit cards, and digital wallets. Cash on delivery is also available for local orders in Colombo."
        },
        {
          question: "How long does shipping take?",
          answer: "Local delivery in Colombo takes 1-2 business days. Island-wide delivery takes 3-5 business days. International shipping varies by location."
        },
        {
          question: "Do you offer free shipping?",
          answer: "Yes! We offer free shipping for orders over Rs. 2,500 within Colombo. Island-wide free shipping for orders over Rs. 5,000."
        }
      ]
    },
    {
      category: "Returns & Refunds",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We accept returns within 14 days of delivery for books in original condition. Damaged or defective items can be returned within 30 days."
        },
        {
          question: "How do I return a book?",
          answer: "Contact our customer service team with your order number and reason for return. We'll provide you with return instructions and a prepaid shipping label if applicable."
        },
        {
          question: "When will I receive my refund?",
          answer: "Refunds are processed within 3-5 business days after we receive your return. The refund will appear in your original payment method within 5-10 business days."
        }
      ]
    },
    {
      category: "Account & Orders",
      questions: [
        {
          question: "How do I track my order?",
          answer: "Log into your account and visit the 'My Orders' section. You'll find tracking information and delivery updates there."
        },
        {
          question: "Can I cancel my order?",
          answer: "Orders can be cancelled within 2 hours of placement if they haven't been processed for shipping. Contact customer service immediately."
        },
        {
          question: "How do I update my account information?",
          answer: "Log into your account and go to 'Account Settings' to update your personal information, shipping addresses, and payment methods."
        }
      ]
    },
    {
      category: "Books & Products",
      questions: [
        {
          question: "Do you have rare or out-of-print books?",
          answer: "Yes, we have a special collection of rare and out-of-print books. Contact us directly for availability and pricing."
        },
        {
          question: "Can I request a book that's not in stock?",
          answer: "Absolutely! We offer a special ordering service. Contact our customer service team with the book details and we'll source it for you."
        },
        {
          question: "Do you sell e-books?",
          answer: "Currently, we focus on physical books. However, we're working on expanding our digital collection. Stay tuned for updates!"
        }
      ]
    }
  ];

  const contactInfo = {
    phone: "+94 11 234 5678",
    email: "info@pahanaedu.lk",
    address: "123 Book Street, Colombo 03, Sri Lanka",
    hours: "Monday - Saturday: 9:00 AM - 8:00 PM\nSunday: 10:00 AM - 6:00 PM"
  };

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
              Help & Support
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're here to help you find the perfect book and answer any questions
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Quick Contact Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">📞</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
            <p className="text-gray-600 mb-4">{contactInfo.phone}</p>
            <p className="text-sm text-gray-500">Available during business hours</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">✉️</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">{contactInfo.email}</p>
            <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Available on website</p>
            <p className="text-sm text-gray-500">Instant help during business hours</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-3 font-semibold rounded-t-lg transition-colors ${
                activeTab === 'faq'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Frequently Asked Questions
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 font-semibold rounded-t-lg transition-colors ${
                activeTab === 'contact'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Contact Information
            </button>
            <button
              onClick={() => setActiveTab('shipping')}
              className={`px-6 py-3 font-semibold rounded-t-lg transition-colors ${
                activeTab === 'shipping'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Shipping & Returns
            </button>
          </div>
        </div>

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <div className="space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{category.category}</h2>
                <div className="space-y-6">
                  {category.questions.map((faq, faqIndex) => (
                    <FAQItem key={faqIndex} question={faq.question} answer={faq.answer} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                    <p className="text-gray-600">{contactInfo.phone}</p>
                    <p className="text-sm text-gray-500 mt-1">Monday - Saturday: 9:00 AM - 8:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">✉️</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                    <p className="text-gray-600">{contactInfo.email}</p>
                    <p className="text-sm text-gray-500 mt-1">We'll respond within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Address</h3>
                    <p className="text-gray-600">{contactInfo.address}</p>
                    <p className="text-sm text-gray-500 mt-1">Visit us in person</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Hours</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium">Monday - Friday</span>
                  <span className="text-gray-600">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium">Saturday</span>
                  <span className="text-gray-600">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-medium">Sunday</span>
                  <span className="text-gray-600">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-medium">Public Holidays</span>
                  <span className="text-gray-600">10:00 AM - 6:00 PM</span>
                </div>
              </div>
              <div className="mt-8 p-4 bg-blue-50 rounded-xl">
                <h3 className="font-semibold text-blue-900 mb-2">Need Immediate Help?</h3>
                <p className="text-blue-700 text-sm">
                  For urgent matters, please call us directly during business hours. 
                  Our friendly staff is always ready to assist you.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Tab */}
        {activeTab === 'shipping' && (
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Local Delivery (Colombo)</h3>
                  <p className="text-gray-600">1-2 business days</p>
                  <p className="text-sm text-gray-500">Free for orders over Rs. 2,500</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Island-wide Delivery</h3>
                  <p className="text-gray-600">3-5 business days</p>
                  <p className="text-sm text-gray-500">Free for orders over Rs. 5,000</p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">Express Delivery</h3>
                  <p className="text-gray-600">Same day (Colombo only)</p>
                  <p className="text-sm text-gray-500">Additional Rs. 500 fee</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Return Policy</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">14-Day Return Window</h3>
                    <p className="text-gray-600 text-sm">Return books in original condition within 14 days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">30-Day Defect Policy</h3>
                    <p className="text-gray-600 text-sm">Return damaged or defective items within 30 days</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Free Return Shipping</h3>
                    <p className="text-gray-600 text-sm">We cover return shipping for defective items</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-1">
                    <span className="text-green-600 text-sm">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Quick Refunds</h3>
                    <p className="text-gray-600 text-sm">Refunds processed within 3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Still Need Help Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
          <p className="text-xl mb-8 opacity-90">
            Our customer service team is here to help you with any questions or concerns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${contactInfo.phone}`}
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Call Us Now
            </a>
            <a
              href={`mailto:${contactInfo.email}`}
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-colors"
            >
              Send Email
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <span className={`text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
