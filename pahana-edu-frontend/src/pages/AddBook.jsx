import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import { isValidImageUrl } from "../utils/imageUtils";

const CATEGORIES = [
  "Fiction", "Science", "Business", "History", "Technology", 
  "Philosophy", "Psychology", "Biography", "Self-Help", "Cooking"
];

export default function AddBook() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    author: "",
    unitPrice: "",
    stockQuantity: "",
    category: "",
    imageUrl: "",
    isbn: "",
    publisher: "",
    publicationYear: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  function set(k, v) { setForm(s => ({ ...s, [k]: v })); }

  async function compressImageFile(file, maxW = 400, maxH = 600, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          try {
            // Calculate new dimensions
            let { width, height } = img;
            const ratio = Math.min(maxW / width, maxH / height, 1);
            const targetW = Math.round(width * ratio);
            const targetH = Math.round(height * ratio);
            
            // Create canvas and compress
            const canvas = document.createElement("canvas");
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext("2d");
            
            // Draw and compress
            ctx.drawImage(img, 0, 0, targetW, targetH);
            const compressed = canvas.toDataURL("image/jpeg", quality);
            
            resolve(compressed);
          } catch (err) {
            reject(err);
          }
        };
        
        img.onerror = reject;
        img.src = e.target.result;
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function onImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    
    try {
      // Check original file size first
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("Image too large (>10MB). Please choose a smaller image.");
        return;
      }
      
      // Show processing message
      toast.loading("Processing image...", { id: "image-processing" });
      
      // Compress the image with progressive quality reduction
      let compressed = null;
      let quality = 0.8;
      let maxAttempts = 8; // Increased attempts
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          compressed = await compressImageFile(file, 400, 600, quality);
          
          // Check if compressed size is acceptable for database
          if (compressed.length <= 30000) { // Reduced to 30KB for safety
            break;
          }
          
          // Reduce quality for next attempt
          quality = Math.max(0.2, quality - 0.1); // Go down to 20% quality
          
          if (attempt === maxAttempts - 1) {
            toast.error("Image still too large after compression. Please choose a smaller image or contact support.");
            return;
          }
        } catch (err) {
          console.error(`Compression attempt ${attempt + 1} failed:`, err);
          quality = Math.max(0.2, quality - 0.1);
        }
      }
      
      if (!compressed) {
        toast.error("Failed to compress image");
        return;
      }
      
      // Success!
      toast.success(`Image compressed successfully! Size: ${Math.round(compressed.length / 1024)}KB`, { id: "image-processing" });
      
      setImagePreview(compressed);
      set("imageUrl", compressed);
      
    } catch (err) {
      console.error("Image processing error:", err);
      toast.error("Failed to process image. Please try a different image.", { id: "image-processing" });
    }
  }

  function validateImageUrl(url) {
    if (!url.trim()) return true; // Empty URL is allowed
    
    if (!isValidImageUrl(url)) {
      toast.error("Please provide a valid image URL (no random image generators)");
      return false;
    }
    
    return true;
  }

  function validateForm() {
    if (!form.name.trim()) {
      toast.error("Book title is required");
      return false;
    }
    if (!form.author.trim()) {
      toast.error("Author is required");
      return false;
    }
    if (!form.unitPrice || form.unitPrice <= 0) {
      toast.error("Valid price is required");
      return false;
    }
    if (!form.stockQuantity || form.stockQuantity < 0) {
      toast.error("Valid stock quantity is required");
      return false;
    }
    if (!form.category) {
      toast.error("Category is required");
      return false;
    }
    if (!validateImageUrl(form.imageUrl)) {
      return false;
    }
    return true;
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Use the working endpoint that we know exists
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        author: form.author.trim(),
        category: form.category,
        imageUrl: form.imageUrl.trim() || null,
        isbn: form.isbn.trim() || null,
        publisher: form.publisher.trim() || null,
        publicationYear: form.publicationYear ? Number(form.publicationYear) : null,
        unitPrice: Math.round(Number(form.unitPrice) * 100), // Convert to cents
        stockQuantity: Number(form.stockQuantity)
      };

      console.log('Adding book with payload:', { ...payload, imageUrl: payload.imageUrl ? (payload.imageUrl.startsWith('data:') ? 'data-url' : payload.imageUrl) : null });
      
      // Log the image size for debugging
      if (payload.imageUrl && payload.imageUrl.startsWith('data:')) {
        console.log('Image size (base64 length):', payload.imageUrl.length);
        console.log('Image size (KB):', Math.round(payload.imageUrl.length / 1024));
        console.log('Image size (MB):', Math.round(payload.imageUrl.length / (1024 * 1024) * 100) / 100);
        
        // Warn if image is still very large (might indicate database issue)
        if (payload.imageUrl.length > 100000) { // 100KB
          console.warn('⚠️ WARNING: Image is very large. If you get database errors, ensure you ran: ALTER TABLE dbo.item ALTER COLUMN image_url VARCHAR(MAX)');
          toast.loading('⚠️ Large image detected. If upload fails, check database column size.', { duration: 5000 });
        }
      }
      
      const response = await api.post("/api/v1/items", payload);
      console.log('Book added successfully:', response.data);
      
      toast.success("Book added successfully! 🎉");
      navigate("/admin", { replace: true });
    } catch (err) {
      console.error('Error adding book:', err);
      console.error('Error response:', err?.response);
      console.error('Error status:', err?.response?.status);
      console.error('Error data:', err?.response?.data);
      
      let msg = "Could not add book";
      
      if (err?.response?.status === 401) {
        msg = "Authentication required. Please log in as admin.";
      } else if (err?.response?.status === 403) {
        msg = "Access denied. Admin privileges required. Please log in as admin first.";
      } else if (err?.response?.status === 404) {
        msg = "API endpoint not found. Please check your backend configuration.";
      } else if (err?.response?.status === 500) {
        msg = "Server error. Please try again later.";
      } else if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.response?.data?.error) {
        msg = err.response.data.error;
      } else if (err?.message) {
        msg = err.message;
      }
      
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Add New Book</h1>
          <p className="text-lg text-gray-600">Add a new book to the Pahana Edu catalog</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Book Title *
                </label>
                <input 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter book title"
                  value={form.name} 
                  onChange={e => set("name", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Author *
                </label>
                <input 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter author name"
                  value={form.author} 
                  onChange={e => set("author", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                rows="4"
                placeholder="Enter book description"
                value={form.description} 
                onChange={e => set("description", e.target.value)}
                disabled={isLoading}
              />
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) *
                </label>
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="0.00"
                  value={form.unitPrice} 
                  onChange={e => set("unitPrice", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity *
                </label>
                <input 
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="0"
                  value={form.stockQuantity} 
                  onChange={e => set("stockQuantity", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white"
                  value={form.category}
                  onChange={e => set("category", e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ISBN
                </label>
                <input 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter ISBN"
                  value={form.isbn} 
                  onChange={e => set("isbn", e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publisher
                </label>
                <input 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter publisher"
                  value={form.publisher} 
                  onChange={e => set("publisher", e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Cover Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image (Upload)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageFileChange}
                  disabled={isLoading}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white"
                />
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-gray-500">
                    <strong>Recommended:</strong> JPEG/PNG, max 5MB original size
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Auto-compression:</strong> Images will be resized to 400x600 pixels
                  </p>
                  <p className="text-xs text-gray-500">
                    <strong>Final size:</strong> Will be compressed to under 50KB for database storage
                  </p>
                </div>
                { (imagePreview || form.imageUrl) && (
                  <div className="mt-4">
                    <div className="text-sm text-gray-600 mb-2">Preview</div>
                    <img
                      src={imagePreview || form.imageUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-xl border"
                    />
                    <div className="mt-2 text-xs text-gray-500">
                      {form.imageUrl && form.imageUrl.startsWith('data:') ? (
                        <div>
                          <div>Final size: {Math.round(form.imageUrl.length / 1024)}KB</div>
                          <div className="text-green-600">✅ Ready for database storage</div>
                        </div>
                      ) : (
                        'Image URL provided'
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => { setImagePreview(""); set("imageUrl", ""); }}
                      disabled={isLoading}
                      className="mt-3 px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      Clear Image
                    </button>
                  </div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL (Alternative)
                </label>
                <input 
                  type="url"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://example.com/image.jpg"
                  value={form.imageUrl} 
                  onChange={e => { set("imageUrl", e.target.value); setImagePreview(""); }}
                  disabled={isLoading}
                />
                <p className="mt-2 text-xs text-gray-500">
                  Or provide a direct link to an image. Avoid random image generators.
                </p>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700">
                    💡 <strong>Tip:</strong> For best results, upload images directly. 
                    The system will automatically compress them to fit your database.
                  </p>
                </div>
                <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-700">
                    ⚠️ <strong>Note:</strong> If you're still getting "too large" errors, 
                    try uploading a smaller image (under 2MB) or contact support.
                  </p>
                </div>
                
                {/* CRITICAL DATABASE FIX WARNING */}
                <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-xs text-red-700 font-semibold">
                    🚨 <strong>CRITICAL:</strong> If you get "String or binary data would be truncated" error, 
                    you MUST fix your database first:
                  </p>
                  <div className="mt-2 p-2 bg-red-100 rounded text-xs font-mono text-red-800">
                    USE BKBASE;<br/>
                    ALTER TABLE dbo.item ALTER COLUMN image_url VARCHAR(MAX);
                  </div>
                  <p className="text-xs text-red-700 mt-2">
                    Run this SQL command in your database, then restart your backend server.
                  </p>
                </div>
              </div>
            </div>

            {/* Publication Year (moved above), kept as-is */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Publication Year
                </label>
                <input 
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="2024"
                  value={form.publicationYear} 
                  onChange={e => set("publicationYear", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div></div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <button 
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                    Adding Book...
                  </div>
                ) : (
                  "Add Book"
                )}
              </button>
              
              <button 
                type="button"
                onClick={() => navigate("/admin")}
                disabled={isLoading}
                className="px-6 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
