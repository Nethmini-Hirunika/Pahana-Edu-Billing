import { useState } from "react";
import { api } from "../api/axios";
import { useAuth } from "../store/AuthContext";
import toast from "react-hot-toast";

export default function AuthTest() {
  const { user, isAuthenticated, login } = useAuth();
  const [testResults, setTestResults] = useState({});

  const testEndpoints = async () => {
    const results = {};
    
    // Test GET (should work without auth)
    try {
      const getResponse = await api.get("/api/v1/items");
      results.get = { success: true, status: getResponse.status, data: getResponse.data };
    } catch (error) {
      results.get = { success: false, status: error.response?.status, error: error.message };
    }
    
    // Test POST (should require auth)
    try {
      const testBook = {
        name: "Auth Test Book",
        description: "Testing authentication",
        author: "Test Author",
        unitPrice: 2500,
        stockQuantity: 5,
        category: "Technology"
      };
      
      const postResponse = await api.post("/api/v1/items", testBook);
      results.post = { success: true, status: postResponse.status, data: postResponse.data };
    } catch (error) {
      results.post = { success: false, status: error.response?.status, error: error.message };
    }
    
    setTestResults(results);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔐 Authentication Test</h1>
        
        {/* Current Auth Status */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Current Authentication Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Logged In:</strong> {isAuthenticated ? "✅ Yes" : "❌ No"}
            </div>
            <div>
              <strong>User Role:</strong> {user?.role || "None"}
            </div>
            <div>
              <strong>Username:</strong> {user?.username || "None"}
            </div>
            <div>
              <strong>User ID:</strong> {user?.id || "None"}
            </div>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">API Endpoint Tests</h2>
          <button 
            onClick={testEndpoints}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Test API Endpoints
          </button>
        </div>

        {/* Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            
            <div className="space-y-4">
              {/* GET Test */}
              <div className={`p-4 rounded ${
                testResults.get?.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className="font-semibold mb-2">GET /api/v1/items</h3>
                <div className="text-sm">
                  {testResults.get?.success ? (
                    <span className="text-green-700">✅ Success ({testResults.get.status})</span>
                  ) : (
                    <span className="text-red-700">❌ Failed ({testResults.get.status}) - {testResults.get.error}</span>
                  )}
                </div>
              </div>

              {/* POST Test */}
              <div className={`p-4 rounded ${
                testResults.post?.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}>
                <h3 className="font-semibold mb-2">POST /api/v1/items</h3>
                <div className="text-sm">
                  {testResults.post?.success ? (
                    <span className="text-green-700">✅ Success ({testResults.post.status})</span>
                  ) : (
                    <span className="text-red-700">❌ Failed ({testResults.post.status}) - {testResults.post.error}</span>
                  )}
                </div>
                {testResults.post?.status === 403 && (
                  <div className="mt-2 text-orange-700 text-sm">
                    💡 This is expected if you're not logged in as admin. Try logging in first!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">How to Fix</h2>
          <div className="space-y-2 text-blue-800">
            <p>1. <strong>Log in as Admin:</strong> Go to <code>/login</code> and use admin credentials</p>
            <p>2. <strong>Check your backend:</strong> Make sure you have admin users in your database</p>
            <p>3. <strong>Verify role:</strong> Your user should have role "ADMIN" or "STAFF"</p>
            <p>4. <strong>Test again:</strong> After logging in, try adding books again</p>
          </div>
        </div>
      </div>
    </div>
  );
}
