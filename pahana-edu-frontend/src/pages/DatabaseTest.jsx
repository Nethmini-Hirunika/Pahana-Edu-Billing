import { useState } from "react";
import { api } from "../api/axios";

export default function DatabaseTest() {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testImage, setTestImage] = useState(null);

  // Create a test image with known size
  function createTestImage() {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    // Draw a simple test pattern
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 400, 600);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(100, 100, 200, 400);
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(150, 150, 100, 300);
    
    const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setTestImage(dataUrl);
    return dataUrl;
  }

  async function testDatabaseConnection() {
    setLoading(true);
    try {
      // Test 1: Basic API connection
      const healthResponse = await api.get('/health');
      console.log('Health check response:', healthResponse);
      
      // Test 2: Get existing items
      const itemsResponse = await api.get('/api/v1/items');
      console.log('Items response:', itemsResponse);
      
      setTestResult({
        success: true,
        healthCheck: '✅ Connected',
        itemsCount: Array.isArray(itemsResponse.data) ? itemsResponse.data.length : 'Unknown',
        message: 'Database connection successful'
      });
    } catch (error) {
      console.error('Database test failed:', error);
      setTestResult({
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        message: 'Database connection failed'
      });
    } finally {
      setLoading(false);
    }
  }

  async function testImageUpload() {
    if (!testImage) {
      alert('Please create a test image first');
      return;
    }

    setLoading(true);
    try {
      const testPayload = {
        name: 'TEST_BOOK_' + Date.now(),
        description: 'This is a test book to verify database column size',
        author: 'Test Author',
        category: 'TEST',
        imageUrl: testImage,
        unitPrice: 1000, // $10.00 in cents
        stockQuantity: 1
      };

      console.log('Testing image upload with size:', Math.round(testImage.length / 1024), 'KB');
      
      const response = await api.post('/api/v1/items', testPayload);
      console.log('Test upload successful:', response.data);
      
      setTestResult({
        success: true,
        message: `✅ Image upload test successful! Image size: ${Math.round(testImage.length / 1024)}KB`,
        uploadedBook: response.data
      });
      
      // Clean up test book
      setTimeout(async () => {
        try {
          if (response.data.id) {
            await api.delete(`/api/v1/items/${response.data.id}`);
            console.log('Test book cleaned up');
          }
        } catch (cleanupError) {
          console.log('Could not clean up test book:', cleanupError);
        }
      }, 5000);
      
    } catch (error) {
      console.error('Image upload test failed:', error);
      setTestResult({
        success: false,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data,
        message: `❌ Image upload test failed. Image size: ${Math.round(testImage.length / 1024)}KB`
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Database Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Database Connection</h2>
          <p className="text-sm text-gray-600 mb-4">
            This will test if your backend is running and can connect to the database.
          </p>
          <button
            onClick={testDatabaseConnection}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Image Upload</h2>
          <p className="text-sm text-gray-600 mb-4">
            This will test if your database can handle large image data (verifies the VARCHAR(MAX) fix).
          </p>
          <div className="space-y-4">
            <button
              onClick={createTestImage}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Create Test Image
            </button>
            
            {testImage && (
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Test image created: {Math.round(testImage.length / 1024)}KB
                </p>
                <img src={testImage} alt="Test" className="w-32 h-48 object-cover border rounded" />
                <button
                  onClick={testImageUpload}
                  disabled={loading}
                  className="ml-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? 'Testing...' : 'Test Upload'}
                </button>
              </div>
            )}
          </div>
        </div>

        {testResult && (
          <div className={`bg-white rounded-lg shadow-lg p-6 ${testResult.success ? 'border-l-4 border-green-500' : 'border-l-4 border-red-500'}`}>
            <h2 className="text-xl font-semibold mb-4">
              {testResult.success ? '✅ Test Results' : '❌ Test Failed'}
            </h2>
            
            <div className="space-y-2">
              <p className="font-medium">{testResult.message}</p>
              
              {testResult.success ? (
                <div className="text-green-700">
                  {testResult.healthCheck && <p>Health Check: {testResult.healthCheck}</p>}
                  {testResult.itemsCount && <p>Items in Database: {testResult.itemsCount}</p>}
                  {testResult.uploadedBook && <p>Test Book ID: {testResult.uploadedBook.id}</p>}
                </div>
              ) : (
                <div className="text-red-700">
                  {testResult.error && <p>Error: {testResult.error}</p>}
                  {testResult.status && <p>Status: {testResult.status}</p>}
                  {testResult.data && <p>Response: {JSON.stringify(testResult.data, null, 2)}</p>}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">What This Tests</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li><strong>Connection Test:</strong> Verifies your backend is running and can reach the database</li>
            <li><strong>Image Upload Test:</strong> Verifies the VARCHAR(MAX) fix allows large image storage</li>
            <li><strong>Database Schema:</strong> Confirms the image_url column can handle base64 data</li>
          </ol>
          
          <div className="mt-4 p-3 bg-yellow-50 rounded">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> If the image upload test fails with a truncation error, 
              you need to run: <code className="bg-yellow-100 px-1 rounded">ALTER TABLE dbo.item ALTER COLUMN image_url VARCHAR(MAX)</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
