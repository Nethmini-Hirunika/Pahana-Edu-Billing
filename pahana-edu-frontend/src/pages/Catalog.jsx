import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/axios";
import { getSampleBooks } from "../utils/addSampleBooks";
import { getBookImageUrl, handleImageError } from "../utils/imageUtils";
import { useCart } from "../store/CartContext";
import { useAuth } from "../store/AuthContext";

const CATEGORIES = [
  { id: "all", name: "All Categories", icon: "📚" },
  { id: "fiction", name: "Fiction", icon: "📖" },
  { id: "science", name: "Science", icon: "🔬" },
  { id: "business", name: "Business", icon: "💼" },
  { id: "history", name: "History", icon: "🏛️" },
  { id: "technology", name: "Technology", icon: "💻" },
  { id: "philosophy", name: "Philosophy", icon: "🤔" },
  { id: "psychology", name: "Psychology", icon: "🧠" },
  { id: "biography", name: "Biography", icon: "👤" },
  { id: "self-help", name: "Self-Help", icon: "💪" },
  { id: "cooking", name: "Cooking", icon: "👨‍🍳" },
];

const SORT_OPTIONS = [
  { value: "name", label: "Name A-Z" },
  { value: "name_desc", label: "Name Z-A" },
  { value: "price", label: "Price Low-High" },
  { value: "price_desc", label: "Price High-Low" },
  { value: "newest", label: "Newest First" },
];

export default function Catalog() {
  const { category } = useParams();
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  async function load(p = page) {
    try {
      setLoading(true);
      setErr("");

      // Build query parameters (fetch more when filtering by category to avoid pagination hiding items)
      const fetchSize = selectedCategory !== "all" ? 1000 : size;
      const params = { 
        page: p, 
        size: fetchSize
      };
      
      if (q && q.trim()) {
        params.q = q.trim();
      }
      
      // Do NOT send category to backend; filter on client to work with any API
      
      if (sortBy && sortBy !== "newest") {
        params.sort = sortBy;
      }

      console.log('Fetching books with params:', params);

      const res = await api.get("/api/v1/items", { params });

      console.log('API response:', res.data);

      // Handle different response formats
      let data = [];
      let totalPages = 1;
      
      if (Array.isArray(res.data)) {
        data = res.data;
        totalPages = Math.ceil(data.length / size);
      } else if (res.data && res.data.content) {
        data = res.data.content;
        totalPages = res.data.totalPages || Math.ceil((res.data.totalElements || 0) / size);
      } else if (res.data) {
        data = [res.data];
        totalPages = 1;
      }

             // If no books from API, use sample books instead
       if (data.length === 0) {
         console.log('No books from API, using sample books');
         const sampleBooks = getSampleBooks().map((book, index) => ({
           ...book,
           id: index + 1,
           unitPrice: Math.round(book.unitPrice * 100) // Convert to cents
         }));
         
         // Filter by category if selected
         let filteredBooks = sampleBooks;
         if (selectedCategory !== "all") {
           filteredBooks = sampleBooks.filter(book => 
             book.category.toLowerCase() === selectedCategory.toLowerCase()
           );
         }
         
         setItems(filteredBooks);
         setTotalPages(Math.max(1, Math.ceil(filteredBooks.length / size)));
       } else {
         // Dedupe and filter the actual API data by category
         let filteredBooks = Array.isArray(data) ? data.slice() : [];
         // De-duplicate by ISBN or name+author
         const seen = new Set();
         filteredBooks = filteredBooks.filter((book) => {
           const isbn = (book.isbn || '').toString().trim().toLowerCase();
           const name = (book.name || '').toString().trim().toLowerCase();
           const author = (book.author || '').toString().trim().toLowerCase();
           const key = isbn ? `isbn:${isbn}` : `name:${name}|author:${author}`;
           if (seen.has(key)) return false;
           seen.add(key);
           return true;
         });
         if (selectedCategory !== "all") {
           filteredBooks = filteredBooks.filter(book => {
             const bookCategory = (book.category || book.categories || '').toString().trim().toLowerCase();
             const selected = selectedCategory.toString().trim().toLowerCase();
             return bookCategory === selected;
           });
         }
         
         setItems(filteredBooks);
         setTotalPages(Math.max(1, Math.ceil(filteredBooks.length / fetchSize)));
       }
       
     } catch (e) {
       console.error('Error fetching books:', e);
       console.log('Using sample books as fallback');
       
       // Use sample books as fallback
       const sampleBooks = getSampleBooks().map((book, index) => ({
         ...book,
         id: index + 1,
         unitPrice: Math.round(book.unitPrice * 100) // Convert to cents
       }));
       
       // Filter by category if selected
       let filteredBooks = sampleBooks;
       if (selectedCategory !== "all") {
         filteredBooks = sampleBooks.filter(book => 
           book.category.toLowerCase() === selectedCategory.toLowerCase()
         );
       }
       
       setItems(filteredBooks);
       setTotalPages(Math.max(1, Math.ceil(filteredBooks.length / size)));
       
       const r = e?.response;
       const msg = r ? `Error ${r.status}: ${r.statusText}` : e?.message || "Network Error";
       setErr(msg);
     } finally {
       setLoading(false);
     }
  }

  useEffect(() => {
    load(0); // initial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update selected category when URL parameter changes
  useEffect(() => {
    if (category && category !== selectedCategory) {
      setSelectedCategory(category);
      setPage(0);
      load(0);
    }
  }, [category, selectedCategory]);

  // when page changes via buttons
  useEffect(() => {
    if (page >= 0) load(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  function onSearch() {
    setPage(0);
    load(0);
  }

  function onCategoryChange(category) {
    setSelectedCategory(category);
    setPage(0);
    load(0);
  }

  function onSortChange(sort) {
    setSortBy(sort);
    setPage(0);
    load(0);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Our Catalog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover thousands of books across various categories. Find your next favorite read today.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search books, authors, or topics..."
                  className="w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 transition-all duration-200 bg-white/90"
                  onKeyPress={(e) => e.key === 'Enter' && onSearch()}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 transition-all duration-200 bg-white/90"
              >
                {SORT_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  viewMode === "grid" 
                    ? "bg-indigo-100 text-indigo-600" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                ⏹️
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-3 rounded-xl transition-all duration-200 ${
                  viewMode === "list" 
                    ? "bg-indigo-100 text-indigo-600" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                📋
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Categories</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategoryChange(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                  selectedCategory === category.id
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-white/30"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading books...</p>
          </div>
        )}

        {err && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 text-lg mb-2">⚠️</div>
            <p className="text-red-700">{err}</p>
          </div>
        )}

        {/* Results */}
        {!loading && !err && items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or browse different categories.</p>
          </div>
        )}

        {/* Items Grid/List */}
        {!loading && !err && items.length > 0 && (
          <>
            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                : "grid-cols-1"
            }`}>
              {items.map((item) => (
                <CatalogCard key={item.id} item={item} viewMode={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-12">
                <button
                  disabled={page <= 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  ← Previous
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(0, Math.min(totalPages - 5, page - 2)) + i;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`w-10 h-10 rounded-xl transition-all duration-200 ${
                          page === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        {pageNum + 1}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function CatalogCard({ item, viewMode }) {
  const { addItem } = useCart();
  const { user } = useAuth();
  
  // Check if user is admin
  const isAdmin = user?.role === 'ROLE_ADMIN';
  // Convert price from cents to dollars if needed
  let price = Number(item.price ?? item.unitPrice ?? 0);
  if (price > 1000) { // If price is in cents, convert to dollars
    price = price / 100;
  }
  const priceFormatted = price.toFixed(2);
  const stock = Number(item.stock ?? item.stockQuantity ?? 0);
  
  // Use the new image utility function to get proper book covers
  const imgSrc = getBookImageUrl(item);
  
  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
        <div className="flex gap-6">
          <img
            src={imgSrc}
            alt={item.name}
            className="w-24 h-32 object-cover rounded-xl flex-shrink-0"
            onError={(e) => handleImageError(e)}
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.name}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
            <div className="flex items-center justify-between">
                             <div className="flex items-center gap-4">
                 <span className="text-2xl font-bold text-gray-900">${priceFormatted}</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  stock > 0 
                    ? "bg-green-100 text-green-700" 
                    : "bg-red-100 text-red-700"
                }`}>
                  {stock > 0 ? `In Stock (${stock})` : "Out of Stock"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min={1} defaultValue={1} className="w-20 px-3 py-2 border rounded-lg" onChange={(e)=>{item.__qty = Math.max(1, Number(e.target.value)||1)}} />
                <button onClick={()=> addItem(item, item.__qty || 1)} className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-indigo-500/25">
                  Add to Cart
                </button>
              </div>
            </div>
            
            {/* Edit Button for Admin Only */}
            {isAdmin && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <button 
                  onClick={() => window.location.href = `/admin/edit-book/${item.id}`}
                  className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm"
                >
                  ✏️ Edit Book & Photo
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative">
        <img
          src={imgSrc}
          alt={item.name}
          className="w-full h-48 object-cover"
          onError={(e) => handleImageError(e)}
        />
                 <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
           ${priceFormatted}
         </div>
        {stock < 5 && stock > 0 && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Low Stock
          </div>
        )}
        {stock === 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Out of Stock
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
        
        <div className="flex items-center justify-between mb-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            stock > 0 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {stock > 0 ? `${stock} available` : "Out of stock"}
          </span>
        </div>
        
        {stock > 0 ? (
          <div className="flex gap-2">
            <input type="number" min={1} defaultValue={1} className="w-24 px-3 py-2 border rounded-lg" onChange={(e)=>{item.__qty = Math.max(1, Number(e.target.value)||1)}} />
            <button onClick={()=> addItem(item, item.__qty || 1)} className="flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-indigo-500/25">
              Add to Cart
            </button>
          </div>
        ) : (
          <button disabled className="w-full px-4 py-2 bg-gray-200 text-gray-500 font-medium rounded-xl disabled:opacity-50">Out of Stock</button>
        )}
        
        {/* Edit Button for Admin Only */}
        {isAdmin && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <button 
              onClick={() => window.location.href = `/admin/edit-book/${item.id}`}
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm"
            >
              ✏️ Edit Book & Photo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
