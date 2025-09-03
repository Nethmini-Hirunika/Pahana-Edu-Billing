import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

export default function Account() {
  const { user } = useAuth();
  const { state } = useLocation();

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        {state?.msg && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="text-green-600 text-xl mr-3">✅</div>
              <p className="text-green-700 font-medium">{state.msg}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Account</h1>
          <p className="text-lg text-gray-600">Manage your profile and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              {/* Profile Header */}
              <div className="text-center mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-white text-3xl font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name || 'User'}</h2>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                  {user.role || 'Customer'}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-green-600">📚</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Books Purchased</p>
                      <p className="font-semibold text-gray-900">12</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-purple-600">⭐</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Reviews Given</p>
                      <p className="font-semibold text-gray-900">8</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-orange-600">🎯</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Wishlist Items</p>
                      <p className="font-semibold text-gray-900">5</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-3">
                <Link 
                  to="/account/bills" 
                  className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                >
                  View Bills
                </Link>
                <button className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h3>
              
              <div className="space-y-6">
                <InfoRow 
                  label="Full Name" 
                  value={user.name || "-"} 
                  icon="👤"
                />
                <InfoRow 
                  label="Username" 
                  value={user.username || "-"} 
                  icon="🎯"
                />
                <InfoRow 
                  label="Email Address" 
                  value={user.email || "-"} 
                  icon="📧"
                />
                <InfoRow 
                  label="Phone Number" 
                  value={user.phone || "-"} 
                  icon="📱"
                />
                <InfoRow 
                  label="Account Type" 
                  value={user.role || "Customer"} 
                  icon="🔐"
                />
                <InfoRow 
                  label="Member Since" 
                  value="January 2024" 
                  icon="📅"
                />
              </div>

              {/* Recent Activity */}
              <div className="mt-12">
                <h4 className="text-xl font-semibold text-gray-900 mb-6">Recent Activity</h4>
                <div className="space-y-4">
                  <ActivityItem 
                    icon="📚"
                    title="Purchased 'The Great Gatsby'"
                    time="2 days ago"
                    color="green"
                  />
                  <ActivityItem 
                    icon="⭐"
                    title="Reviewed 'To Kill a Mockingbird'"
                    time="1 week ago"
                    color="purple"
                  />
                  <ActivityItem 
                    icon="🎯"
                    title="Added '1984' to wishlist"
                    time="2 weeks ago"
                    color="orange"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon }) {
  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mr-4 shadow-sm">
        <span className="text-xl">{icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm text-gray-600 font-medium">{label}</p>
        <p className="text-gray-900 font-semibold">{value}</p>
      </div>
      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
        Edit
      </button>
    </div>
  );
}

function ActivityItem({ icon, title, time, color }) {
  const colorClasses = {
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
    blue: "bg-blue-100 text-blue-600"
  };

  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-xl">
      <div className={`w-10 h-10 ${colorClasses[color]} rounded-lg flex items-center justify-center mr-4`}>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-gray-900 font-medium">{title}</p>
        <p className="text-sm text-gray-600">{time}</p>
      </div>
    </div>
  );
}

