import { useState } from "react";
import { api } from "../api/axios";

export default function ApiTest() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoints = [
    { name: "Get All Items", method: "GET", url: "/api/v1/items" },
    { name: "Get Items with Params", method: "GET", url: "/api/v1/items?page=0&size=5" },
    { name: "Get Items by Category", method: "GET", url: "/api/v1/items?category=Fiction" },
    { name: "POST Add Item", method: "POST", url: "/api/v1/items" },
    { name: "Test Different Endpoints", method: "GET", url: "/api/v1/books" },
    { name: "Test Products Endpoint", method: "GET", url: "/api/v1/products" },
    { name: "Test Root API", method: "GET", url: "/api" },
    { name: "Test Health Check", method: "GET", url: "/health" },
    { name: "Test Actuator", method: "GET", url: "/actuator/health" },
  ];

  const testEndpoint = async (endpoint) => {
    setLoading(true);
    try {
      console.log(`Testing ${endpoint.name}: ${endpoint.url}`);
      
      let response;
      if (endpoint.method === "GET") {
        response = await api.get(endpoint.url);
      } else if (endpoint.method === "POST") {
        // For POST test, send a simple test book
        const testBook = {
          name: "Test Book",
          description: "Test Description",
          author: "Test Author",
          unitPrice: 2000, // $20.00 in cents
          stockQuantity: 10,
          category: "Fiction"
        };
        response = await api.post(endpoint.url, testBook);
      }
      
      setResults(prev => ({
        ...prev,
        [endpoint.name]: {
          success: true,
          data: response.data,
          status: response.status,
          headers: response.headers
        }
      }));
      
      console.log(`${endpoint.name} success:`, response.data);
      
    } catch (error) {
      console.error(`${endpoint.name} error:`, error);
      setResults(prev => ({
        ...prev,
        [endpoint.name]: {
          success: false,
          error: error.message,
          status: error.response?.status,
          data: error.response?.data
        }
      }));
    } finally {
      setLoading(false);
    }
  };

  const testAll = async () => {
    setLoading(true);
    for (const endpoint of testEndpoints) {
      await testEndpoint(endpoint);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Test Page</h1>
        
        <div className="mb-8">
          <button 
            onClick={testAll}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Testing..." : "Test All Endpoints"}
          </button>
        </div>

        <div className="space-y-6">
          {testEndpoints.map((endpoint) => (
            <div key={endpoint.name} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{endpoint.name}</h3>
                <button 
                  onClick={() => testEndpoint(endpoint)}
                  disabled={loading}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
                >
                  Test
                </button>
              </div>
              
              <div className="text-sm text-gray-600 mb-2">
                {endpoint.method} {endpoint.url}
              </div>

              {results[endpoint.name] && (
                <div className={`p-4 rounded ${
                  results[endpoint.name].success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="font-semibold mb-2">
                    {results[endpoint.name].success ? '✅ Success' : '❌ Error'}
                    {results[endpoint.name].status && ` (${results[endpoint.name].status})`}
                  </div>
                  
                  {results[endpoint.name].success ? (
                    <pre className="text-sm overflow-auto max-h-64">
                      {JSON.stringify(results[endpoint.name].data, null, 2)}
                    </pre>
                  ) : (
                    <div>
                      <div className="text-red-700 mb-2">{results[endpoint.name].error}</div>
                      {results[endpoint.name].data && (
                        <pre className="text-sm overflow-auto max-h-64">
                          {JSON.stringify(results[endpoint.name].data, null, 2)}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
