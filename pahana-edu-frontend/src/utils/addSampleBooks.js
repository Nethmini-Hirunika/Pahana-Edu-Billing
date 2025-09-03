import { api } from "../api/axios";
import toast from "react-hot-toast";
import { getBookImageUrl } from "./imageUtils";

// Real book cover URLs from reliable sources
const BOOK_COVERS = {
  "The Great Gatsby": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1490528560i/4671.jpg",
  "A Brief History of Time": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1333578746i/3869.jpg",
  "The Lean Startup": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1328764325i/10127019.jpg",
  "Sapiens: A Brief History of Humankind": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1420595954i/23692271.jpg",
  "Clean Code: A Handbook of Agile Software Craftsmanship": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1436202607i/3735293.jpg",
  "Meditations": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327268510i/30659.jpg",
  "Thinking, Fast and Slow": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1348765669i/11468377.jpg",
  "Steve Jobs": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327866532i/11084145.jpg",
  "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1529185670i/40121378.jpg",
  "The Joy of Cooking": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1320552888i/103612.jpg",
  "To Kill a Mockingbird": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1553383690i/2657.jpg",
  "Brief Answers to the Big Questions": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1532528556i/40247241.jpg",
  "Zero to One": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1405184244i/18050143.jpg",
  "The Art of War": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327948340i/10534.jpg",
  "Mastering the Art of French Cooking": "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1327948340i/10534.jpg"
};

const SAMPLE_BOOKS = [
  {
    name: "The Great Gatsby",
    description: "A classic American novel by F. Scott Fitzgerald, exploring themes of decadence, idealism, resistance to change, social upheaval, and excess, creating a portrait of the Jazz Age or the Roaring Twenties.",
    author: "F. Scott Fitzgerald",
    unitPrice: 15.99,
    stockQuantity: 25,
    category: "Fiction",
    imageUrl: BOOK_COVERS["The Great Gatsby"],
    isbn: "978-0743273565",
    publisher: "Scribner",
    publicationYear: 1925
  },
  {
    name: "A Brief History of Time",
    description: "Stephen Hawking's landmark book explores the universe's biggest mysteries, from the Big Bang to black holes, making complex scientific concepts accessible to everyone.",
    author: "Stephen Hawking",
    unitPrice: 18.50,
    stockQuantity: 15,
    category: "Science",
    imageUrl: BOOK_COVERS["A Brief History of Time"],
    isbn: "978-0553380163",
    publisher: "Bantam",
    publicationYear: 1988
  },
  {
    name: "The Lean Startup",
    description: "Eric Ries provides a scientific approach to creating and managing successful startups in an age when companies need to innovate more than ever.",
    author: "Eric Ries",
    unitPrice: 22.99,
    stockQuantity: 30,
    category: "Business",
    imageUrl: BOOK_COVERS["The Lean Startup"],
    isbn: "978-0307887894",
    publisher: "Crown Business",
    publicationYear: 2011
  },
  {
    name: "Sapiens: A Brief History of Humankind",
    description: "Yuval Noah Harari's groundbreaking account of how an insignificant ape became the ruler of planet Earth, capable of splitting the atom, flying to the moon, and manipulating the genetic code of life.",
    author: "Yuval Noah Harari",
    unitPrice: 24.99,
    stockQuantity: 20,
    category: "History",
    imageUrl: BOOK_COVERS["Sapiens: A Brief History of Humankind"],
    isbn: "978-0062316097",
    publisher: "Harper",
    publicationYear: 2015
  },
  {
    name: "Clean Code: A Handbook of Agile Software Craftsmanship",
    description: "Robert C. Martin presents a revolutionary paradigm for writing clean, maintainable code that will help you become a better programmer.",
    author: "Robert C. Martin",
    unitPrice: 45.00,
    stockQuantity: 12,
    category: "Technology",
    imageUrl: BOOK_COVERS["Clean Code: A Handbook of Agile Software Craftsmanship"],
    isbn: "978-0132350884",
    publisher: "Prentice Hall",
    publicationYear: 2008
  },
  {
    name: "Meditations",
    description: "Marcus Aurelius' personal writings offer a unique window into the mind of a Roman emperor and Stoic philosopher, providing timeless wisdom on life, death, and virtue.",
    author: "Marcus Aurelius",
    unitPrice: 12.99,
    stockQuantity: 18,
    category: "Philosophy",
    imageUrl: BOOK_COVERS["Meditations"],
    isbn: "978-0812968255",
    publisher: "Modern Library",
    publicationYear: 180
  },
  {
    name: "Thinking, Fast and Slow",
    description: "Daniel Kahneman's groundbreaking work on the two systems that drive the way we think—the fast, intuitive, and emotional; and the slower, more deliberative, and more logical.",
    author: "Daniel Kahneman",
    unitPrice: 19.99,
    stockQuantity: 22,
    category: "Psychology",
    imageUrl: BOOK_COVERS["Thinking, Fast and Slow"],
    isbn: "978-0374533557",
    publisher: "Farrar, Straus and Giroux",
    publicationYear: 2011
  },
  {
    name: "Steve Jobs",
    description: "Walter Isaacson's definitive biography of the visionary entrepreneur who revolutionized six industries: personal computers, animated movies, music, phones, tablet computing, and digital publishing.",
    author: "Walter Isaacson",
    unitPrice: 28.99,
    stockQuantity: 16,
    category: "Biography",
    imageUrl: BOOK_COVERS["Steve Jobs"],
    isbn: "978-1451648539",
    publisher: "Simon & Schuster",
    publicationYear: 2011
  },
  {
    name: "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
    description: "James Clear's practical guide shows how tiny changes in behavior can result in remarkable outcomes, offering a proven framework for improving every day.",
    author: "James Clear",
    unitPrice: 23.99,
    stockQuantity: 35,
    category: "Self-Help",
    imageUrl: BOOK_COVERS["Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones"],
    isbn: "978-0735211292",
    publisher: "Avery",
    publicationYear: 2018
  },
  {
    name: "The Joy of Cooking",
    description: "The classic cookbook that has taught millions of people to cook, featuring over 4,500 recipes and comprehensive cooking techniques for every skill level.",
    author: "Irma S. Rombauer",
    unitPrice: 35.00,
    stockQuantity: 8,
    category: "Cooking",
    imageUrl: BOOK_COVERS["The Joy of Cooking"],
    isbn: "978-0743246262",
    publisher: "Scribner",
    publicationYear: 1931
  },
  {
    name: "To Kill a Mockingbird",
    description: "Harper Lee's timeless novel of racial injustice and childhood innocence in the Deep South.",
    author: "Harper Lee",
    unitPrice: 16.99,
    stockQuantity: 20,
    category: "Fiction",
    imageUrl: BOOK_COVERS["To Kill a Mockingbird"],
    isbn: "978-0061120084",
    publisher: "Harper Perennial",
    publicationYear: 1960
  },
  {
    name: "Brief Answers to the Big Questions",
    description: "Stephen Hawking's final thoughts on the universe's biggest mysteries.",
    author: "Stephen Hawking",
    unitPrice: 17.50,
    stockQuantity: 18,
    category: "Science",
    imageUrl: BOOK_COVERS["Brief Answers to the Big Questions"],
    isbn: "978-1984819192",
    publisher: "Bantam",
    publicationYear: 2018
  },
  {
    name: "Zero to One",
    description: "Peter Thiel's notes on startups, or how to build the future.",
    author: "Peter Thiel",
    unitPrice: 21.00,
    stockQuantity: 26,
    category: "Business",
    imageUrl: BOOK_COVERS["Zero to One"],
    isbn: "978-0804139298",
    publisher: "Crown Business",
    publicationYear: 2014
  },
  {
    name: "The Art of War",
    description: "Ancient Chinese military treatise offering strategic wisdom applicable beyond warfare.",
    author: "Sun Tzu",
    unitPrice: 11.99,
    stockQuantity: 40,
    category: "History",
    imageUrl: BOOK_COVERS["The Art of War"],
    isbn: "978-1599869773",
    publisher: "Filquarian Publishing",
    publicationYear: -500
  },
  {
    name: "Mastering the Art of French Cooking",
    description: "Julia Child's definitive guide to classic French cuisine for the home cook.",
    author: "Julia Child",
    unitPrice: 39.95,
    stockQuantity: 10,
    category: "Cooking",
    imageUrl: BOOK_COVERS["Mastering the Art of French Cooking"],
    isbn: "978-0375413407",
    publisher: "Knopf",
    publicationYear: 1961
  }
];

export async function addSampleBooks() {
  const results = [];
  
  // Use the known working endpoint
  const workingEndpoint = '/api/v1/items';
  
  console.log(`✅ Using working endpoint: ${workingEndpoint}`);
  
  // Add all sample books using the working endpoint
  for (const book of SAMPLE_BOOKS) {
    try {
      const bookData = {
        ...book,
        unitPrice: Math.round(book.unitPrice * 100), // Convert to cents
        category: book.category // Ensure category is explicitly set
      };
      
      console.log(`📝 Adding book: ${book.name} (Category: ${book.category}) via ${workingEndpoint}`);
      const response = await api.post(workingEndpoint, bookData);
      
      results.push({
        success: true,
        book: book.name,
        category: book.category,
        id: response.data.id,
        endpoint: workingEndpoint
      });
      
      // Add a small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.error(`❌ Failed to add ${book.name}:`, error.response?.status, error.message);
      results.push({
        success: false,
        book: book.name,
        category: book.category,
        error: error.response?.data?.message || error.message,
        endpoint: workingEndpoint
      });
    }
  }
  
  return results;
}

export function getSampleBooks() {
  return SAMPLE_BOOKS;
}
