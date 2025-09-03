import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { toast } from "react-hot-toast";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    author: "",
    category: "",
    imageUrl: "",
    isbn: "",
    publisher: "",
    publicationYear: "",
    unitPrice: "",
    stockQuantity: ""
  });

  useEffect(() => {
    loadBook();
  }, [id]);

  async function loadBook() {
    try {
      const response = await api.get(`/api/v1/items/${id}`);
      const bookData = response.data;
      setBook(bookData);
      
      // Convert price from cents to dollars
      const priceInDollars = bookData.unitPrice ? (bookData.unitPrice / 100).toFixed(2) : "";
      
      setForm({
        name: bookData.name || "",
        description: bookData.description || "",
        author: bookData.author || "",
        category: bookData.category || "",
        imageUrl: bookData.imageUrl || "",
        isbn: bookData.isbn || "",
        publisher: bookData.publisher || "",
        publicationYear: bookData.publicationYear || "",
        unitPrice: priceInDollars,
        stockQuantity: bookData.stockQuantity || ""
      });
      
      if (bookData.imageUrl) {
        setImagePreview(bookData.imageUrl);
      }
    } catch (error) {
      console.error("Error loading book:", error);
      toast.error("Failed to load book");
    } finally {
      setLoading(false);
    }
  }

  function set(key, value) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function onImageFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }
    
    try {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image too large (>10MB). Please choose a smaller image.");
        return;
      }
      
      toast.loading("Processing image...", { id: "image-processing" });
      
      let compressed = null;
      let quality = 0.8;
      let maxAttempts = 8;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        try {
          compressed = await compressImageFile(file, 400, 600, quality);
          
          if (compressed.length <= 30000) {
            break;
          }
          
          quality = Math.max(0.2, quality - 0.1);
          
          if (attempt === maxAttempts - 1) {
            toast.error("Image still too large after compression. Please choose a smaller image.");
            return;
          }
        } catch (err) {
          quality = Math.max(0.2, quality - 0.1);
        }
      }
      
      if (!compressed) {
        toast.error("Failed to compress image");
        return;
      }
      
      toast.success(`Image compressed successfully! Size: ${Math.round(compressed.length / 1024)}KB`, { id: "image-processing" });
      
      setImagePreview(compressed);
      set("imageUrl", compressed);
      
    } catch (err) {
      console.error("Image processing error:", err);
      toast.error("Failed to process image. Please try a different image.", { id: "image-processing" });
    }
  }

  async function compressImageFile(file, maxW = 400, maxH = 600, quality = 0.8) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          try {
            let { width, height } = img;
            const ratio = Math.min(maxW / width, maxH / height, 1);
            const targetW = Math.round(width * ratio);
            const targetH = Math.round(height * ratio);
            
            const canvas = document.createElement("canvas");
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext("2d");
            
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

  async function onSubmit(e) {
    e.preventDefault();
    
    if (!form.name.trim() || !form.author.trim() || !form.unitPrice || !form.category) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        author: form.author.trim(),
        category: form.category,
        imageUrl: form.imageUrl.trim() || null,
        isbn: form.isbn.trim() || null,
        publisher: form.publisher.trim() || null,
        publicationYear: form.publicationYear ? Number(form.publicationYear) : null,
        unitPrice: Math.round(Number(form.unitPrice) * 100),
        stockQuantity: Number(form.stockQuantity)
      };

      await api.put(`/api/v1/items/${id}`, payload);
      toast.success("Book updated successfully! 🎉");
      navigate("/admin");
    } catch (error) {
      console.error("Error updating book:", error);
      toast.error("Failed to update book");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading book...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Book not found</p>
          <button onClick={() => navigate("/admin")} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">
            Back to Admin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Edit Book</h1>
          <p className="text-lg text-gray-600">Update book details and photo</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Book Title *</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name} 
                  onChange={e => set("name", e.target.value)}
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Author *</label>
                <input 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.author} 
                  onChange={e => set("author", e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea 
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows="4"
                value={form.description} 
                onChange={e => set("description", e.target.value)}
                disabled={saving}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select 
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.category} 
                  onChange={e => set("category", e.target.value)}
                  disabled={saving}
                >
                  <option value="">Select category</option>
                  <option value="FICTION">Fiction</option>
                  <option value="NON_FICTION">Non-Fiction</option>
                  <option value="SCIENCE">Science</option>
                  <option value="TECHNOLOGY">Technology</option>
                  <option value="HISTORY">History</option>
                  <option value="PHILOSOPHY">Philosophy</option>
                  <option value="LITERATURE">Literature</option>
                  <option value="TEST">Test</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
                <input 
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.unitPrice} 
                  onChange={e => set("unitPrice", e.target.value)}
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                <input 
                  type="number"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.stockQuantity} 
                  onChange={e => set("stockQuantity", e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={onImageFileChange}
                  disabled={saving}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                />
                <p className="mt-2 text-xs text-gray-500">
                  Upload a new image to replace the current cover
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Image</label>
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Current cover"
                    className="w-32 h-48 object-cover rounded-lg border"
                  />
                ) : (
                  <div className="w-32 h-48 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                    No image
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/admin")}
                disabled={saving}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex-1"
              >
                {saving ? "Updating..." : "Update Book"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
