import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { addSampleBooks } from "../utils/addSampleBooks";
import toast from "react-hot-toast";

export default function DebugBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiInfo, setApiInfo] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔍 Fetching books from API...');
      
      // Try different endpoints
      const endpoints = [
        '/api/v1/items',
        '/api/v1/books', 
        '/api/products',
        '/api/items'
      ];

      for (const endpoint of endpoints) {
        try {
          console.log(`📡 Trying endpoint: ${endpoint}`);
          const response = await api.get(endpoint);
          console.log(`✅ Success with ${endpoint}:`, response.data);
          
          setApiInfo(prev => ({
            ...prev,
            [endpoint]: {
              success: true,
              data: response.data,
              status: response.status
            }
          }));

          // If we get data, use it
          if (response.data) {
            let bookData = [];
            
            if (Array.isArray(response.data)) {
              bookData = response.data;
            } else if (response.data.content) {
              bookData = response.data.content;
            } else if (response.data.items) {
              bookData = response.data.items;
            } else if (response.data.books) {
              bookData = response.data.books;
            } else {
              bookData = [response.data];
            }

            if (bookData.length > 0) {
              setBooks(bookData);
              console.log(`📚 Found ${bookData.length} books from ${endpoint}`);
              break; // Stop trying other endpoints
            }
          }
          
        } catch (err) {
          console.log(`❌ Failed with ${endpoint}:`, err.response?.status, err.message);
          setApiInfo(prev => ({
            ...prev,
            [endpoint]: {
              success: false,
              error: err.message,
              status: err.response?.status
            }
          }));
        }
      }
      
    } catch (err) {
      console.error('🚨 Error fetching books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addSampleBook = async () => {
    try {
      const testBook = {
        name: "Debug Test Book",
        description: "This is a test book to debug the API",
        author: "Debug Author",
        unitPrice: 2500, // $25.00
        stockQuantity: 5,
        category: "Technology"
      };

      console.log('📝 Adding test book:', testBook);
      
      // Try different endpoints for adding
      const endpoints = ['/api/v1/items', '/api/v1/books', '/api/products'];
      
      for (const endpoint of endpoints) {
        try {
          const response = await api.post(endpoint, testBook);
          console.log(`✅ Successfully added book via ${endpoint}:`, response.data);
          toast.success(`Book added via ${endpoint}!`);
          fetchBooks(); // Refresh the list
          return;
        } catch (err) {
          console.log(`❌ Failed to add book via ${endpoint}:`, err.response?.status);
        }
      }
      
      toast.error('Failed to add book to any endpoint');
      
    } catch (err) {
      console.error('🚨 Error adding test book:', err);
      toast.error('Error adding test book');
    }
  };

  const addAllSampleBooks = async () => {
    try {
      toast.loading('Adding all 15 sample books...');
      const results = await addSampleBooks();
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      toast.dismiss();
      
      if (successCount > 0) {
        toast.success(`Successfully added ${successCount} books! 🎉`);
      }
      if (failCount > 0) {
        toast.error(`${failCount} books failed to add. Check console for details.`);
      }
      
      // Log detailed results
      console.log('Sample books addition results:', results);
      
      // Refresh the books list
      fetchBooks();
      
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to add sample books');
      console.error('Error adding sample books:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">🔍 Book Debug Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Status */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">API Endpoint Status</h2>
            
            <div className="space-y-3">
              {Object.entries(apiInfo).map(([endpoint, info]) => (
                <div key={endpoint} className={`p-3 rounded ${
                  info.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="font-medium">{endpoint}</div>
                  <div className="text-sm">
                    {info.success ? (
                      <span className="text-green-700">✅ Success ({info.status})</span>
                    ) : (
                      <span className="text-red-700">❌ Failed ({info.status}) - {info.error}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={fetchBooks}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Refresh API Status
            </button>
          </div>

          {/* Books List */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Books in Database</h2>
              <div className="flex gap-2">
                <button 
                  onClick={addSampleBook}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Add Test Book
                </button>
                <button 
                  onClick={addAllSampleBooks}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add All 10 Books
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p>Loading books...</p>
              </div>
            ) : error ? (
              <div className="text-red-600 p-4 bg-red-50 rounded">
                Error: {error}
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📚</div>
                <p>No books found in database</p>
                <p className="text-sm">Try adding a test book or check your backend</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {books.map((book, index) => (
                  <div key={book.id || index} className="p-3 border rounded">
                    <div className="font-medium">{book.name}</div>
                    <div className="text-sm text-gray-600">
                      Author: {book.author} | Price: ${(book.unitPrice / 100).toFixed(2)} | Stock: {book.stockQuantity}
                    </div>
                    <div className="text-xs text-gray-500">
                      Category: {book.category} | ID: {book.id}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Backend Info */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Backend Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <strong>API Base URL:</strong> http://localhost:8080
            </div>
            <div>
              <strong>Total Books Found:</strong> {books.length}
            </div>
            <div>
              <strong>Working Endpoints:</strong> {
                Object.entries(apiInfo)
                  .filter(([_, info]) => info.success)
                  .map(([endpoint, _]) => endpoint)
                  .join(', ') || 'None'
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
