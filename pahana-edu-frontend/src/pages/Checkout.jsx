import { useCart } from "../store/CartContext";
import { useNavigate } from "react-router-dom";
import { api } from "../api/axios";
import { useAuth } from "../store/AuthContext";

export default function CheckoutPage() {
  const { items, totals, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const format = (cents) => `$${(cents / 100).toFixed(2)}`;

  async function placeOrder(e) {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    const formData = new FormData(e.target);
    const reference = `PE-${Date.now()}`;
    const payload = {
      customerId: user.id,
      items: items.map((i) => ({
        itemId: i.productId || i.id,
        quantity: i.quantity,
      })),
      // reference is optional; backend may ignore
      reference,
    };

    try {
      const res = await api.post('/api/bills', payload);

      const data = res?.data || {};
      const orderId = data.id || data.orderId || reference;
      const successState = { orderId, totalCents: totals.totalCents, items };
      try {
        sessionStorage.setItem('order:last', JSON.stringify(successState));
      } catch {}
      clearCart();
      navigate('/order-success', { state: successState, replace: true });
    } catch (err) {
      console.error('Failed to place order:', err);
      alert('Sorry, we could not place your order. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
        <form onSubmit={placeOrder} className="md:col-span-2 bg-white rounded-2xl shadow border border-gray-100 p-6">
          <h1 className="text-2xl font-bold mb-6">Checkout</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input name="fullName" className="w-full px-4 py-3 border rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input name="email" type="email" className="w-full px-4 py-3 border rounded-xl" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input name="address" className="w-full px-4 py-3 border rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
              <input name="city" className="w-full px-4 py-3 border rounded-xl" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
              <input name="postalCode" className="w-full px-4 py-3 border rounded-xl" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <select name="paymentMethod" className="w-full px-4 py-3 border rounded-xl">
                <option value="Cash on Delivery">Cash on Delivery</option>
                <option value="Card">Credit / Debit Card</option>
              </select>
            </div>
          </div>
          
          <button type="submit" className="mt-6 w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700">Place Order</button>
        </form>

        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="space-y-3">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between text-sm">
                <div className="text-gray-700">{i.name} × {i.quantity}</div>
                <div className="text-gray-900">{format(i.priceCents * i.quantity)}</div>
              </div>
            ))}
            <div className="border-t my-3"></div>
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>{format(totals.subtotalCents)}</span></div>
            <div className="flex justify-between text-sm"><span>Tax</span><span>{format(totals.taxCents)}</span></div>
            <div className="flex justify-between font-semibold text-lg"><span>Total</span><span>{format(totals.totalCents)}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}


