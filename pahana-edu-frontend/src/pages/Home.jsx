import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import { getSampleBooks } from "../utils/addSampleBooks";
import { getBookImageUrl, handleImageError } from "../utils/imageUtils";

const DEMO_CATEGORIES = [
  { name: "Fiction", slug: "fiction", icon: "📚", color: "from-indigo-500 to-purple-600" },
  { name: "Science", slug: "science", icon: "🔬", color: "from-emerald-500 to-teal-600" },
  { name: "Business", slug: "business", icon: "💼", color: "from-violet-500 to-purple-600" },
  { name: "History", slug: "history", icon: "🏛️", color: "from-amber-500 to-orange-600" },
  { name: "Technology", slug: "technology", icon: "💻", color: "from-blue-500 to-indigo-600" },
  { name: "Philosophy", slug: "philosophy", icon: "🤔", color: "from-slate-500 to-gray-600" },
  { name: "Psychology", slug: "psychology", icon: "🧠", color: "from-rose-500 to-pink-600" },
  { name: "Biography", slug: "biography", icon: "👤", color: "from-orange-500 to-red-600" },
  { name: "Self-Help", slug: "self-help", icon: "💪", color: "from-cyan-500 to-blue-600" },
  { name: "Cooking", slug: "cooking", icon: "👨‍🍳", color: "from-red-500 to-rose-600" },
];

export default function Home() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/v1/items", { params: { page: 0, size: 12 } })
      .then(({ data }) => {
        console.log('Home page API response:', data);
        let rows = [];
        
        if (Array.isArray(data)) {
          rows = data;
        } else if (data && data.content) {
          rows = data.content;
        } else if (data) {
          rows = [data];
        }
        
        // If no books from API, use sample books instead of demo items
        if (rows.length === 0) {
          console.log('No books from API, using sample books');
          const sampleBooks = getSampleBooks().map((book, index) => ({
            ...book,
            id: index + 1,
            unitPrice: Math.round(book.unitPrice * 100) // Convert to cents
          }));
          setItems(sampleBooks);
        } else {
          setItems(rows);
        }
      })
      .catch((error) => {
        console.error('Error fetching books for home page:', error);
        console.log('Using sample books as fallback');
        const sampleBooks = getSampleBooks().map((book, index) => ({
          ...book,
          id: index + 1,
          unitPrice: Math.round(book.unitPrice * 100) // Convert to cents
        }));
        setItems(sampleBooks);
      })
      .finally(() => setLoading(false));
  }, []);

  function onSearch(e) {
    e.preventDefault();
    if (!q.trim()) return toast.error("Type something to search");
    nav(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Hero q={q} setQ={setQ} onSearch={onSearch} />

      <Section title="Browse by Category" subtitle="Explore our diverse collection">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {DEMO_CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/catalog/${c.slug}`}
              className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-white/20 hover:bg-white/90"
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {c.icon}
              </div>
              <h3 className="font-semibold text-gray-900 group-hover:text-gray-700 transition-colors">
                {c.name}
              </h3>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </Link>
          ))}
        </div>
      </Section>

      <Section title="New Arrivals" subtitle="Discover the latest additions to our collection">
        {loading ? (
          <GridSkeleton />
        ) : (
          <Grid>
            {items.map((it) => (
              <Card key={it.id} item={it} />
            ))}
          </Grid>
        )}
      </Section>

      {/* Features Section */}
      <Section title="Why Choose Pahana Edu?" subtitle="Your trusted learning partner">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon="🚀" 
            title="Fast Learning" 
            description="Accelerate your knowledge with our curated content and expert-led courses."
            color="from-indigo-500 to-blue-600"
          />
          <FeatureCard 
            icon="🎯" 
            title="Personalized Experience" 
            description="Get recommendations tailored to your learning style and preferences."
            color="from-violet-500 to-purple-600"
          />
          <FeatureCard 
            icon="🛡️" 
            title="Secure & Reliable" 
            description="Your data is protected with enterprise-grade security and privacy."
            color="from-emerald-500 to-teal-600"
          />
        </div>
      </Section>
    </main>
  );
}

function Hero({ q, setQ, onSearch }) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
      {/* Background Image - Quality Books Photo */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
          alt="Beautiful books background"
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      
      {/* Overlay Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Find Your Next Read
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover thousands of titles and categories at PahanaEDU. 
            Your journey to knowledge starts here.
          </p>
          
          <form onSubmit={onSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  className="w-full px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 bg-white/90 backdrop-blur-md border border-gray-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400/50 shadow-xl text-lg transition-all duration-200"
                  placeholder="Search books, authors, topics…"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button 
                type="submit"
                className="px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold rounded-xl hover:from-slate-800 hover:to-slate-900 transition-all duration-200 shadow-xl hover:shadow-slate-500/20 text-lg border border-slate-600/50"
              >
                Search
              </button>
            </div>
          </form>
          
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-blue-200">
            <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">📚 10,000+ Books</span>
            <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">🏛️ 20+ Years in Colombo</span>
            <span className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm">⭐ Expert Recommendations</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, subtitle, children }) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{title}</h2>
          {subtitle && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function Grid({ children }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {children}
    </div>
  );
}

function Card({ item }) {
  // Handle price conversion (from cents to dollars if needed)
  let price = Number(item.unitPrice || item.price || 0);
  if (price > 1000) { // If price is in cents, convert to dollars
    price = price / 100;
  }
  const priceFormatted = price.toFixed(2);
  
  // Use the new image utility function to get proper book covers
  const imageSrc = getBookImageUrl(item);
  
  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100">
      <div className="relative overflow-hidden">
        <img 
          src={imageSrc}
          alt={item.name}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => handleImageError(e)}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
          ${priceFormatted}
        </div>
        {item.stockQuantity < 5 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Low Stock
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {item.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3">{item.author}</p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <span className="text-yellow-400">⭐</span>
            <span className="text-sm font-medium text-gray-700">{item.rating}</span>
          </div>
          <span className="text-sm text-gray-500">Stock: {item.stockQuantity}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-gray-900">
            ${priceFormatted}
          </span>
          <button className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-indigo-500/25">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

function GridSkeleton() {
  return (
    <Grid>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="h-48 bg-gray-200 animate-pulse"></div>
          <div className="p-6 space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            <div className="flex justify-between">
              <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
              <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </Grid>
  );
}

function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="text-center group">
      <div className={`w-16 h-16 bg-gradient-to-br ${color} rounded-2xl flex items-center justify-center text-3xl mb-6 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </div>
  );
}

