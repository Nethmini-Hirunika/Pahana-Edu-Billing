import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

function getPriceCents(item) {
  // Prefer cents if obviously in cents
  const raw = item.unitPrice ?? item.price ?? 0;
  const n = Number(raw);
  if (!Number.isFinite(n)) return 0;
  if (n > 1000) return Math.round(n);
  // treat as dollars -> to cents
  return Math.round(n * 100);
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem("app:cart:v1");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("app:cart:v1", JSON.stringify(items));
  }, [items]);

  const addItem = (product, quantity = 1) => {
    const id = product.id ?? `${product.name}-${product.isbn ?? ""}`;
    const priceCents = getPriceCents(product);
    const image = product.imageUrl || product.image || product.imageURL || product.coverImageUrl || product.coverImage || null;
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === id);
      if (idx >= 0) {
        const next = [...prev];
        const newQty = Math.max(1, Math.min(999, next[idx].quantity + quantity));
        next[idx] = { ...next[idx], quantity: newQty };
        return next;
      }
      return [
        ...prev,
        {
          id,
          productId: product.id ?? null,
          name: product.name,
          priceCents,
          quantity: Math.max(1, Math.min(999, Number(quantity) || 1)),
          image,
          category: product.category || null,
        },
      ];
    });
    toast.success("Added to cart");
  };

  const updateQuantity = (id, quantity) => {
    const q = Math.max(1, Math.min(999, Number(quantity) || 1));
    setItems(prev => prev.map(i => (i.id === id ? { ...i, quantity: q } : i)));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setItems([]);

  const totals = useMemo(() => {
    const subtotalCents = items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
    const taxRate = 0.00; // adjust if needed
    const taxCents = Math.round(subtotalCents * taxRate);
    const totalCents = subtotalCents + taxCents;
    return { subtotalCents, taxCents, totalCents };
  }, [items]);

  const value = {
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    totals,
    count: items.reduce((n, i) => n + i.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}


