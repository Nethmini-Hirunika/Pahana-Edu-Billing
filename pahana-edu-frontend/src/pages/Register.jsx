import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ 
    fullName: "", 
    email: "", 
    phone: "", 
    username: "", 
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  function set(k, v) { setForm(s => ({ ...s, [k]: v })); }

  function validateForm() {
    if (!form.fullName.trim()) {
      toast.error("Full name is required");
      return false;
    }
    if (!form.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    if (!form.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (!form.username.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // backend often expects 'name' (not fullName). Adjust if your DTO differs.
      const payload = {
        name: form.fullName.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        username: form.username.trim(),
        password: form.password
      };
      await register(payload);
      toast.success("Account created successfully! 🎉");
      nav("/account", { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.message || "Could not register";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-white text-2xl">🚀</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Pahana Edu</h1>
            <p className="text-gray-600">Create your account and start learning today</p>
          </div>

          {/* Form */}
          <form onSubmit={onSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your full name"
                    value={form.fullName} 
                    onChange={e => set("fullName", e.target.value)}
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    👤
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    type="email"
                    placeholder="Enter your email"
                    value={form.email} 
                    onChange={e => set("email", e.target.value)}
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📧
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Enter your phone number"
                    value={form.phone} 
                    onChange={e => set("phone", e.target.value)}
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    📱
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    placeholder="Choose a username"
                    value={form.username} 
                    onChange={e => set("username", e.target.value)}
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🎯
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    type="password"
                    placeholder="Create a password"
                    value={form.password} 
                    onChange={e => set("password", e.target.value)}
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔒
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input 
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm"
                    type="password"
                    placeholder="Confirm your password"
                    value={form.confirmPassword} 
                    onChange={e => set("confirmPassword", e.target.value)}
                    disabled={isLoading}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔐
                  </div>
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-1 border-t border-gray-200"></div>
            <span className="px-4 text-sm text-gray-500">or</span>
            <div className="flex-1 border-t border-gray-200"></div>
          </div>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link 
                to="/login" 
                className="text-green-600 hover:text-green-700 font-semibold hover:underline transition-colors duration-200"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-green-600 hover:underline">Terms of Service</a>
            {" "}and{" "}
            <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
