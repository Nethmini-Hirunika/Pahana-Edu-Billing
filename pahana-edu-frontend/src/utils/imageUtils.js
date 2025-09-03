// Image utility functions for book covers

// Default fallback image for books without covers
export const DEFAULT_BOOK_COVER = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300&h=400&fit=crop&crop=center";

// Alternative fallback images for different categories
export const CATEGORY_FALLBACKS = {
  "Fiction": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop&crop=center",
  "Science": "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=300&h=400&fit=crop&crop=center",
  "Business": "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop&crop=center",
  "History": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center",
  "Technology": "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=400&fit=crop&crop=center",
  "Philosophy": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center",
  "Psychology": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=300&h=400&fit=crop&crop=center",
  "Biography": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center",
  "Self-Help": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center",
  "Cooking": "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=400&fit=crop&crop=center"
};

/**
 * Get the best available image URL for a book
 * @param {Object} book - The book object
 * @param {string} fallbackUrl - Optional custom fallback URL
 * @returns {string} The image URL to use
 */
export function getBookImageUrl(book, fallbackUrl = null) {
  if (!book) {
    return fallbackUrl || DEFAULT_BOOK_COVER;
  }

  // Check for valid image URLs in order of preference
  const imageFields = [
    'imageUrl',
    'image', 
    'imageURL',
    'coverImageUrl',
    'coverImage',
    'cover'
  ];

  for (const field of imageFields) {
    const value = book[field];
    if (value && typeof value === 'string' && value.trim()) {
      // Skip random image generators
      if (!value.includes('picsum.photos') && !value.includes('random')) {
        return value.trim();
      }
    }
  }

  // If no valid image found, use category-specific fallback
  if (book.category && CATEGORY_FALLBACKS[book.category]) {
    return CATEGORY_FALLBACKS[book.category];
  }

  // Return default fallback
  return fallbackUrl || DEFAULT_BOOK_COVER;
}

/**
 * Check if an image URL is valid and not a random generator
 * @param {string} url - The URL to check
 * @returns {boolean} True if valid, false if random generator
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  // Check for random image generators
  const randomGenerators = [
    'picsum.photos',
    'random',
    'placeholder.com',
    'placehold.it'
  ];
  
  return !randomGenerators.some(generator => url.includes(generator));
}

/**
 * Get a fallback image for a specific category
 * @param {string} category - The book category
 * @returns {string} The fallback image URL
 */
export function getCategoryFallback(category) {
  if (category && CATEGORY_FALLBACKS[category]) {
    return CATEGORY_FALLBACKS[category];
  }
  return DEFAULT_BOOK_COVER;
}

/**
 * Handle image loading errors by replacing with fallback
 * @param {Event} event - The error event
 * @param {string} fallbackUrl - The fallback image URL
 */
export function handleImageError(event, fallbackUrl = DEFAULT_BOOK_COVER) {
  const img = event.target;
  if (img.src !== fallbackUrl) {
    img.src = fallbackUrl;
    img.alt = 'Book cover not available';
  }
}

/**
 * Preload images for better performance
 * @param {Array<string>} urls - Array of image URLs to preload
 */
export function preloadImages(urls) {
  if (!Array.isArray(urls)) return;
  
  urls.forEach(url => {
    if (url && isValidImageUrl(url)) {
      const img = new Image();
      img.src = url;
    }
  });
}
