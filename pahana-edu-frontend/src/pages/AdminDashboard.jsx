import { useState, useEffect } from "react";
import { useAuth } from "../store/AuthContext";
import { addSampleBooks } from "../utils/addSampleBooks";
import { api } from "../api/axios";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'manage-users'
  const [stats, setStats] = useState({
    totalBooks: 1247,
    totalUsers: 892,
    totalOrders: 156,
    revenue: 45230
  });

  const [recentOrders, setRecentOrders] = useState([
    { id: 1, customer: "John Doe", book: "The Great Gatsby", amount: 25.99, status: "completed" },
    { id: 2, customer: "Jane Smith", book: "To Kill a Mockingbird", amount: 19.99, status: "pending" },
    { id: 3, customer: "Mike Johnson", book: "1984", amount: 22.50, status: "processing" },
    { id: 4, customer: "Sarah Wilson", book: "Pride and Prejudice", amount: 18.75, status: "completed" },
  ]);

  const [topBooks, setTopBooks] = useState([
    { name: "The Great Gatsby", sales: 45, revenue: 1169.55 },
    { name: "To Kill a Mockingbird", sales: 38, revenue: 759.62 },
    { name: "1984", sales: 32, revenue: 720.00 },
    { name: "Pride and Prejudice", sales: 28, revenue: 525.00 },
  ]);
  const [isAddingBooks, setIsAddingBooks] = useState(false);
  
  // Manage Users State
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'ROLE_USER',
    password: ''
  });

  const handleAddSampleBooks = async () => {
    setIsAddingBooks(true);
    try {
      const results = await addSampleBooks();
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      if (successCount > 0) {
        toast.success(`Successfully added ${successCount} books! 🎉`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} books failed to add. Check console for details.`);
      }
      
      // Log detailed results
      console.log('Sample books addition results:', results);
      
    } catch (error) {
      toast.error('Failed to add sample books');
      console.error('Error adding sample books:', error);
    } finally {
      setIsAddingBooks(false);
    }
  };

  // User Management Functions
  const loadUsers = async () => {
    setLoadingUsers(true);
    let response;
    let usersData;
    
    // Debug: Check current user (session-based auth)
    const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
    console.log('Current user:', currentUser);
    console.log('User role:', currentUser?.role);
    console.log('Session-based auth - no token needed');
    
    try {
      try {
        response = await api.get('/api/admin/users');
        usersData = response.data;
        
        // Handle paginated response - extract content array
        const users = usersData.content || usersData;
        
        // Transform UserDto to dashboard format
        const formattedUsers = users.map(user => ({
          id: user.id,
          name: user.fullName || user.name || 'Unknown User',
          email: user.email || 'No email',
          username: user.username || 'N/A',
          phone: user.phone || 'N/A',
          role: user.role || 'CUSTOMER',
          status: 'active',
          createdAt: new Date().toISOString().split('T')[0]
        }));
        
        setUsers(formattedUsers);
        
      } catch (adminError) {
        if (adminError.response?.status === 403) {
          // Fallback to customers endpoint if not admin
          console.log('Admin access denied, trying customers endpoint...');
          response = await api.get('/api/customers');
          const customers = response.data;
          
          // Transform customer data to user display format
          const formattedUsers = customers.map(customer => ({
            id: customer.id,
            name: customer.name || customer.fullName || 'Unknown Customer',
            email: customer.email || 'No email',
            username: customer.username || customer.email?.split('@')[0] || 'N/A',
            phone: customer.phone || 'N/A',
            role: 'CUSTOMER',
            status: 'active',
            createdAt: customer.createdAt ? new Date(customer.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }));
          
          setUsers(formattedUsers);
          toast.info('Showing customers data (Admin access required for full user management)');
        } else {
          throw adminError; // Re-throw other errors
        }
      }
      
    } catch (error) {
      console.error('Error loading users:', error);
      
      if (error.response?.status === 404) {
        toast.error('API endpoint not found. Check if backend server is running.');
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Please login with admin credentials.');
      } else {
        toast.error('Failed to load users from database');
      }
      
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleUpdateUser = async (updatedUser) => {
    try {
      // Update user in database
      // Send original role without conversion - backend might expect exact format
      let normalizedRole = updatedUser.role;
      
      // Don't convert - send exactly what we have
      // Backend seems to have specific role enum values
      
      const updateData = {
        fullName: updatedUser.name,
        Username: updatedUser.username || updatedUser.email?.split('@')[0] || 'user',
        email: updatedUser.email,
        phone: updatedUser.phone || '',
        role: normalizedRole
      };
      console.log('Original user data:', JSON.stringify(updatedUser, null, 2));
      console.log('Sending update data:', JSON.stringify(updateData, null, 2));
      console.log('Update URL:', `/api/admin/users/${updatedUser.id}`);
      
      const response = await api.put(`/api/admin/users/${updatedUser.id}`, updateData);
      console.log('Update response:', response.data);
      
      setUsers(prev => prev.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));
      
      setEditingUser(null);
      toast.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      console.error('Error response data:', JSON.stringify(error.response?.data, null, 2));
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      if (error.response?.data?.message) {
        toast.error(`Update failed: ${error.response.data.message}`);
      } else if (error.response?.status === 500) {
        toast.error('Server error - check backend logs for validation errors');
      } else {
        toast.error('Failed to update user');
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      // Delete user from database
      await api.delete(`/api/admin/users/${userId}`);
      
      setUsers(prev => prev.filter(user => user.id !== userId));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
      console.error('Error deleting user:', error);
    }
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      // Add user to database
      // Send original role without conversion
      let createRole = newUser.role;
      
      const createData = {
        username: newUser.email.split('@')[0], // Generate username from email
        password: newUser.password,
        fullName: newUser.name,
        email: newUser.email,
        phone: newUser.phone || '',
        role: createRole
      };
      const response = await api.post('/api/admin/users', createData);
      const createdUser = response.data;
      
      const userToAdd = {
        id: createdUser.id,
        name: createdUser.fullName,
        email: createdUser.email,
        username: createdUser.username,
        phone: createdUser.phone,
        role: createdUser.role || 'CUSTOMER',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setUsers(prev => [userToAdd, ...prev]);
      setNewUser({ name: '', email: '', phone: '', role: 'ROLE_USER', password: '' });
      setShowAddUser(false);
      toast.success('User added successfully');
    } catch (error) {
      toast.error('Failed to add user');
      console.error('Error adding user:', error);
    }
  };

  const toggleUserStatus = async (userId) => {
    try {
      const user = users.find(u => u.id === userId);
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      
      // Note: UserDto doesn't have status field, so this is UI-only
      // In a real implementation, you might add a status field to User model
      
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: newStatus }
          : user
      ));
      
      toast.success('User status updated');
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Error updating user status:', error);
    }
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  // Load users when switching to manage users view
  useEffect(() => {
    if (currentView === 'manage-users') {
      loadUsers();
    }
  }, [currentView]);

  // Debug: Log users data to console
  useEffect(() => {
    console.log('Current users data:', users);
  }, [users]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {currentView === 'dashboard' ? 'Admin Dashboard' : 'Manage Users'}
              </h1>
              <p className="text-lg text-gray-600">
                {currentView === 'dashboard' 
                  ? `Welcome back, ${user?.name || 'Admin'}! Here's what's happening today.`
                  : 'View and manage user accounts'
                }
              </p>
            </div>
            {currentView === 'manage-users' && (
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                ← Back to Dashboard
              </button>
            )}
          </div>
        </div>

        {/* View Navigation */}
        {currentView === 'dashboard' && (
          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('manage-users')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Manage Users
              </button>
            </div>
          </div>
        )}

        {currentView === 'manage-users' && (
          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentView('dashboard')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => setCurrentView('manage-users')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium"
              >
                Manage Users
              </button>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {currentView === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard 
                title="Total Books" 
                value={stats.totalBooks.toLocaleString()} 
                icon="📚" 
                color="blue"
                change="+12%"
                changeType="positive"
              />
              <StatCard 
                title="Total Users" 
                value={stats.totalUsers.toLocaleString()} 
                icon="👥" 
                color="green"
                change="+8%"
                changeType="positive"
              />
              <StatCard 
                title="Total Orders" 
                value={stats.totalOrders.toLocaleString()} 
                icon="🛒" 
                color="purple"
                change="+23%"
                changeType="positive"
              />
              <StatCard 
                title="Revenue" 
                value={`$${stats.revenue.toLocaleString()}`} 
                icon="💰" 
                color="orange"
                change="+15%"
                changeType="positive"
              />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Recent Orders */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">View All</button>
                  </div>
                  
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <OrderItem key={order.id} order={order} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Books */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Top Selling Books</h2>
                  
                  <div className="space-y-4">
                    {topBooks.map((book, index) => (
                      <TopBookItem key={index} book={book} rank={index + 1} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <QuickActionCard 
                    title="Add New Book"
                    description="Add a new book to the catalog"
                    icon="📖"
                    color="blue"
                    onClick={() => window.location.href = '/admin/add-book'}
                  />
                  <QuickActionCard 
                    title="Edit Books"
                    description="Update existing books and photos"
                    icon="✏️"
                    color="green"
                    onClick={() => setCurrentView('manage-books')}
                  />
                  <QuickActionCard 
                    title="Manage Users"
                    description="View and manage user accounts"
                    icon="👥"
                    color="purple"
                    onClick={() => setCurrentView('manage-users')}
                  />
                  <QuickActionCard 
                    title="View Reports"
                    description="Generate sales and analytics reports"
                    icon="📊"
                    color="orange"
                    onClick={() => console.log('View reports')}
                  />
                  <QuickActionCard 
                    title="System Settings"
                    description="Configure system preferences"
                    icon="⚙️"
                    color="gray"
                    onClick={() => console.log('Settings')}
                  />
                  <QuickActionCard 
                    title="Add Sample Books"
                    description="Add 15 sample books to the catalog"
                    icon="📚"
                    color="red"
                    onClick={handleAddSampleBooks}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {/* Manage Books Content */}
        {currentView === 'manage-books' && (
          <ManageBooksSection />
        )}

        {/* Manage Users Content */}
        {currentView === 'manage-users' && (
          <ManageUsersSection 
            users={filteredUsers}
            loadingUsers={loadingUsers}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            editingUser={editingUser}
            setEditingUser={setEditingUser}
            handleEditUser={handleEditUser}
            handleUpdateUser={handleUpdateUser}
            handleDeleteUser={handleDeleteUser}
            handleAddUser={handleAddUser}
            toggleUserStatus={toggleUserStatus}
            showAddUser={showAddUser}
            setShowAddUser={setShowAddUser}
            newUser={newUser}
            setNewUser={setNewUser}
          />
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, change, changeType }) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600"
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          <div className="flex items-center mt-2">
            <span className={`text-sm font-medium ${
              changeType === 'positive' ? 'text-green-600' : 'text-red-600'
            }`}>
              {change}
            </span>
            <span className="text-sm text-gray-500 ml-1">from last month</span>
          </div>
        </div>
        <div className={`w-16 h-16 ${colorClasses[color]} rounded-2xl flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );
}

function OrderItem({ order }) {
  const statusColors = {
    completed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    cancelled: "bg-red-100 text-red-700"
  };

  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-gray-600">📦</span>
        </div>
        <div>
          <p className="font-semibold text-gray-900">{order.customer}</p>
          <p className="text-sm text-gray-600">{order.book}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">${order.amount}</p>
        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
          {order.status}
        </span>
      </div>
    </div>
  );
}

function TopBookItem({ book, rank }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div className="flex items-center space-x-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
          rank === 1 ? 'bg-yellow-500' : 
          rank === 2 ? 'bg-gray-400' : 
          rank === 3 ? 'bg-orange-500' : 'bg-gray-300'
        }`}>
          {rank}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{book.name}</p>
          <p className="text-sm text-gray-600">{book.sales} sales</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-semibold text-gray-900">${book.revenue}</p>
      </div>
    </div>
  );
}

function QuickActionCard({ title, description, icon, color, onClick }) {
  const colorClasses = {
    blue: "bg-indigo-100 text-indigo-600 hover:bg-indigo-200",
    green: "bg-green-100 text-green-600 hover:bg-green-200",
    purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
    orange: "bg-orange-100 text-orange-600 hover:bg-orange-200",
    red: "bg-red-100 text-red-600 hover:bg-red-200",
    gray: "bg-gray-100 text-gray-600 hover:bg-gray-200"
  };

  return (
    <button 
      onClick={onClick}
      className="p-6 bg-white/80 backdrop-blur-sm border border-white/30 rounded-2xl hover:shadow-lg hover:bg-white/90 transition-all duration-200 text-left group"
    >
      <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

// Manage Books Components
function ManageBooksSection() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadBooks();
  }, []);

  async function loadBooks() {
    try {
      setLoading(true);
      const response = await api.get("/api/v1/items", { params: { size: 1000 } });
      
      let bookData = [];
      if (Array.isArray(response.data)) {
        bookData = response.data;
      } else if (response.data?.content) {
        bookData = response.data.content;
      }
      
      setBooks(bookData);
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  }

  const filteredBooks = books.filter(book => 
    book.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
          <p className="text-gray-600 mt-2">Edit books and upload photos</p>
        </div>
        <button
          onClick={() => window.location.href = '/admin/add-book'}
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 font-medium shadow-lg hover:shadow-indigo-500/25 transition-all duration-200"
        >
          + Add New Book
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search books by title, author, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 bg-white/90 transition-all duration-200"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </div>
        </div>
      </div>

      {/* Books Grid */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading books...</p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search or add some books to get started.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} onEdit={() => window.location.href = `/admin/edit-book/${book.id}`} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookCard({ book, onEdit }) {
  const price = book.unitPrice ? (book.unitPrice / 100).toFixed(2) : "0.00";
  const stock = book.stockQuantity || 0;
  
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
      <div className="relative">
        <img
          src={book.imageUrl || "/api/placeholder/300/400"}
          alt={book.name}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = "/api/placeholder/300/400";
          }}
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold">
          ${price}
        </div>
        {stock < 5 && stock > 0 && (
          <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Low Stock
          </div>
        )}
        {stock === 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.name}</h3>
        <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
        <p className="text-xs text-gray-500 mb-3">{book.category}</p>
        
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            stock > 0 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {stock > 0 ? `${stock} in stock` : "Out of stock"}
          </span>
        </div>
        
        <button
          onClick={onEdit}
          className="w-full px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 font-medium transition-all duration-200 shadow-lg hover:shadow-indigo-500/25"
        >
          ✏️ Edit Book & Photo
        </button>
      </div>
    </div>
  );
}

// Manage Users Components
function ManageUsersSection({ 
  users, 
  loadingUsers, 
  searchTerm, 
  setSearchTerm, 
  selectedRole, 
  setSelectedRole,
  editingUser,
  setEditingUser,
  handleEditUser,
  handleUpdateUser,
  handleDeleteUser,
  handleAddUser,
  toggleUserStatus,
  showAddUser,
  setShowAddUser,
  newUser,
  setNewUser
}) {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 flex-1">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="STAFF">Staff</option>
              <option value="CUSTOMER">Customer</option>
            </select>
          </div>
          <button
            onClick={() => setShowAddUser(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add User
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loadingUsers ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <UserRow 
                    key={user.id} 
                    user={user}
                    editingUser={editingUser}
                    setEditingUser={setEditingUser}
                    handleEditUser={handleEditUser}
                    handleUpdateUser={handleUpdateUser}
                    handleDeleteUser={handleDeleteUser}
                    toggleUserStatus={toggleUserStatus}
                  />
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-600">No users found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUser && (
        <AddUserModal 
          newUser={newUser}
          setNewUser={setNewUser}
          onAdd={handleAddUser}
          onClose={() => setShowAddUser(false)}
        />
      )}
    </div>
  );
}

function UserRow({ user, editingUser, setEditingUser, handleEditUser, handleUpdateUser, handleDeleteUser, toggleUserStatus }) {
  const isEditing = editingUser?.id === user.id;

  if (isEditing) {
    return (
      <tr className="bg-blue-50">
        <td className="px-6 py-4">
          <input
            type="text"
            value={editingUser.name || ''}
            onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
            className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </td>
        <td className="px-6 py-4">
          <select
            value={editingUser.role || 'ROLE_USER'}
            onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value })}
            className="px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="ROLE_USER">Customer</option>
            <option value="ROLE_STAFF">Staff</option>
            <option value="ROLE_ADMIN">Admin</option>
          </select>
        </td>
        <td className="px-6 py-4">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            editingUser.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {editingUser.status}
          </span>
        </td>
        <td className="px-6 py-4 text-sm text-gray-500">{editingUser.createdAt}</td>
        <td className="px-6 py-4">
          <div className="flex space-x-2">
            <button
              onClick={() => handleUpdateUser(editingUser)}
              className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
            >
              Save
            </button>
            <button
              onClick={() => setEditingUser(null)}
              className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {(user.name || 'U').charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown User'}</div>
            <div className="text-sm text-gray-500">{user.email || 'No email'}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
          user.role === 'STAFF' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <button
          onClick={() => toggleUserStatus(user.id)}
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
            user.status === 'active' ? 'bg-green-100 text-green-800 hover:bg-red-100 hover:text-red-800' : 'bg-red-100 text-red-800 hover:bg-green-100 hover:text-green-800'
          }`}
        >
          {user.status}
        </button>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.createdAt || 'N/A'}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditUser(user)}
            className="text-blue-600 hover:text-blue-900 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="text-red-600 hover:text-red-900 transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
}

function AddUserModal({ newUser, setNewUser, onAdd, onClose }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New User</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ROLE_USER">Customer</option>
              <option value="ROLE_STAFF">Staff</option>
              <option value="ROLE_ADMIN">Admin</option>
            </select>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-6">
          <button
            onClick={onAdd}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Add User
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}


