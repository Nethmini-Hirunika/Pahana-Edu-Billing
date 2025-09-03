import { useState, useEffect } from "react";
import { api } from "../api/axios";
import { getSampleBooks } from "../utils/addSampleBooks";
import { removeDuplicateItems, fillCategoriesToMinimum } from "../utils/dataMaintenance";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Fiction", "Science", "Business", "History", "Technology", 
  "Philosophy", "Psychology", "Biography", "Self-Help", "Cooking"
];

export default function CategoryManager() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [categoryStats, setCategoryStats] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      console.log('🔍 Fetching books for category management...');
      
      const response = await api.get("/api/v1/items");
      let bookData = [];
      
      if (Array.isArray(response.data)) {
        bookData = response.data;
      } else if (response.data && response.data.content) {
        bookData = response.data.content;
      } else if (response.data) {
        bookData = [response.data];
      }

      // If no books from API, use sample books
      if (bookData.length === 0) {
        console.log('No books from API, using sample books for preview');
        bookData = getSampleBooks().map((book, index) => ({
          ...book,
          id: index + 1,
          unitPrice: Math.round(book.unitPrice * 100)
        }));
      }

      setBooks(bookData);
      calculateCategoryStats(bookData);
      
    } catch (error) {
      console.error('Error fetching books:', error);
      // Use sample books as fallback
      const sampleBooks = getSampleBooks().map((book, index) => ({
        ...book,
        id: index + 1,
        unitPrice: Math.round(book.unitPrice * 100)
      }));
      setBooks(sampleBooks);
      calculateCategoryStats(sampleBooks);
    } finally {
      setLoading(false);
    }
  };

  const calculateCategoryStats = (bookList) => {
    const stats = {};
    CATEGORIES.forEach(cat => {
      stats[cat] = bookList.filter(book => 
        (book.category || book.categories || '').toLowerCase() === cat.toLowerCase()
      ).length;
    });
    setCategoryStats(stats);
  };

  const getBooksByCategory = (category) => {
    if (category === "all") return books;
    return books.filter(book => 
      (book.category || book.categories || '').toLowerCase() === category.toLowerCase()
    );
  };

  const addSampleBooksWithCategories = async () => {
    try {
      toast.loading('Adding all 15 categorized books...');
      const results = await addSampleBooks();
      
      const successCount = results.filter(r => r.success).length;
      const failCount = results.filter(r => !r.success).length;
      
      toast.dismiss();
      
      if (successCount > 0) {
        toast.success(`Successfully added ${successCount} categorized books! 🎉`);
        // Refresh the books list
        fetchBooks();
      }
      if (failCount > 0) {
        toast.error(`${failCount} books failed to add. Check console for details.`);
      }
      
      console.log('Sample books addition results:', results);
      
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to add sample books');
      console.error('Error adding sample books:', error);
    }
  };

  const dedupe = async () => {
    try {
      const res = await removeDuplicateItems();
      toast.success(`Removed ${res.removed} duplicates`);
      fetchBooks();
    } catch (e) {
      toast.error('Failed to remove duplicates');
    }
  };

  const fillAllCategories = async () => {
    try {
      toast.loading('Filling categories to at least 10 each...');
      const res = await fillCategoriesToMinimum(10);
      toast.dismiss();
      toast.success(`Created ${res.created} items`);
      fetchBooks();
    } catch (e) {
      toast.dismiss();
      toast.error('Failed to fill categories');
    }
  };

  const filteredBooks = getBooksByCategory(selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">📚 Category Manager</h1>
        
        {/* Category Statistics */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Category Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {CATEGORIES.map(category => (
              <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{categoryStats[category] || 0}</div>
                <div className="text-sm text-gray-600">{category}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="flex gap-4">
            <button 
              onClick={addSampleBooksWithCategories}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Add All 15 Categorized Books
            </button>
            <button 
              onClick={dedupe}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700"
            >
              Remove Duplicates
            </button>
            <button 
              onClick={fillAllCategories}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700"
            >
              Ensure 10 per Category
            </button>
            <button 
              onClick={fetchBooks}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
            >
              Refresh Book List
            </button>
          </div>
        </div>

        {/* Category Filter */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">Filter by Category</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                selectedCategory === "all"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Categories ({books.length})
            </button>
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category} ({categoryStats[category] || 0})
              </button>
            ))}
          </div>
        </div>

        {/* Books List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">
            Books in {selectedCategory === "all" ? "All Categories" : selectedCategory} 
            ({filteredBooks.length})
          </h2>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
              <p>Loading books...</p>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📚</div>
              <p>No books found in this category</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredBooks.map((book, index) => (
                <div key={book.id || index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-lg">{book.name}</div>
                      <div className="text-sm text-gray-600">
                        Author: {book.author} | Price: ${(book.unitPrice / 100).toFixed(2)} | Stock: {book.stockQuantity}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className={`px-2 py-1 rounded-full ${
                          book.category ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          Category: {book.category || book.categories || 'NOT SET'}
                        </span>
                        {book.id && ` | ID: ${book.id}`}
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {book.category ? '✅' : '❌'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-blue-900">How to Fix Category Issues</h2>
          <div className="space-y-2 text-blue-800">
            <p>1. <strong>Check your backend:</strong> Make sure your Book entity has a `category` field</p>
            <p>2. <strong>Add sample books:</strong> Use the "Add All 10 Categorized Books" button above</p>
            <p>3. <strong>Verify database:</strong> Check that books are saved with proper category values</p>
            <p>4. <strong>Test filtering:</strong> Click different categories to see if filtering works</p>
          </div>
        </div>
      </div>
    </div>
  );
}
