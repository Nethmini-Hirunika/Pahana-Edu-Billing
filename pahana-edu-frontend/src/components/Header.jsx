import { Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { useCart } from "../store/CartContext";

export default function Header() {
  const { user, role, isAuthenticated, logout } = useAuth();
  const { count } = (() => { try { return useCart(); } catch { return { count: 0 }; } })();
  
  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
            <span className="text-white font-bold text-lg">P</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              PahanaEDU
            </h1>
            <p className="text-xs text-gray-500 -mt-1">Colombo's Premier Bookstore</p>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/catalog" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
          >
            Catalog
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/about" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
          >
            About
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/help" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
          >
            Help
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/contact" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
          >
            Contact
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link 
            to="/cart" 
            className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group"
          >
            Cart
            {count > 0 && (
              <span className="absolute -top-3 -right-4 text-xs bg-blue-600 text-white rounded-full px-2 py-0.5">{count}</span>
            )}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          
          {isAuthenticated && role === "ADMIN" && (
            <Link 
              to="/admin" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-200 relative group"
            >
              Admin Dashboard
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}
          
          {isAuthenticated && role !== "ADMIN" && (
            <Link 
              to="/account" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-200 relative group"
            >
              My Account
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          )}
        </nav>

        {/* Auth Section */}
        <div className="flex items-center space-x-4">
          {!isAuthenticated ? (
            <>
              <Link 
                to="/login" 
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Link>
              <Link 
                to="/register" 
                className="px-6 py-2.5 border-2 border-gray-200 text-gray-700 font-medium rounded-lg hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Hi, {user?.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{role?.toLowerCase()}</p>
                </div>
              </div>
              <button 
                onClick={logout} 
                className="px-4 py-2 text-gray-600 hover:text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}