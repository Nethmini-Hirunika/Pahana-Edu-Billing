import { useCart } from "../store/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totals, clearCart } = useCart();
  const navigate = useNavigate();

  const format = (cents) => `$${(cents / 100).toFixed(2)}`;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
          <p className="text-gray-600 mb-6">Add some books from the catalog to get started.</p>
          <Link to="/catalog" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Browse Catalog</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white rounded-2xl shadow border border-gray-100 p-6">
          <h1 className="text-2xl font-bold mb-6">Shopping Cart</h1>
          <div className="space-y-4">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded-xl">
                <img src={item.image || `https://picsum.photos/100/140?random=${item.id}`} alt={item.name} className="w-16 h-20 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.category || 'Book'}</div>
                  <div className="text-sm text-gray-900 mt-1">{format(item.priceCents)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={999}
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, e.target.value)}
                    className="w-20 px-3 py-2 border rounded-lg"
                  />
                  <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-700 px-3 py-2">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <button onClick={clearCart} className="text-gray-600 hover:text-gray-800">Clear Cart</button>
            <Link to="/catalog" className="text-blue-600 hover:text-blue-700">Continue Shopping →</Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{format(totals.subtotalCents)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{format(totals.taxCents)}</span></div>
            <div className="border-t my-3"></div>
            <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>{format(totals.totalCents)}</span></div>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}


