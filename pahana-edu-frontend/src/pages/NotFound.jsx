import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-md mx-auto">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl">
            <span className="text-white text-6xl font-bold">404</span>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Actions */}
        <div className="space-y-4">
          <Link 
            to="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go Home
          </Link>
          
          <div className="flex justify-center space-x-4">
            <Link 
              to="/catalog"
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-200"
            >
              Browse Catalog
            </Link>
            <span className="text-gray-400">|</span>
            <button 
              onClick={() => window.history.back()}
              className="text-gray-600 hover:text-gray-700 font-medium hover:underline transition-colors duration-200"
            >
              Go Back
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-12 flex justify-center space-x-2">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
}
