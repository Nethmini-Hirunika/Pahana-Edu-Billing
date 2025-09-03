import { Link, useLocation } from "react-router-dom";

export default function OrderSuccess() {
  const location = useLocation();
  const state = location.state;
  let order = state;
  if (!order) {
    try {
      order = JSON.parse(sessionStorage.getItem('order:last') || 'null');
    } catch {
      order = null;
    }
  }

  const total = order ? `$${(order.totalCents / 100).toFixed(2)}` : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-8">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-green-100 p-8 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully</h1>
        <p className="text-gray-600 mb-6">Thank you for your purchase! Your order has been received and is being processed.</p>
        {order && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-700">Order ID</span>
              <span className="font-medium text-gray-900">{order.orderId}</span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-700">Total Paid</span>
              <span className="font-medium text-gray-900">{total}</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">A confirmation has been generated locally for demo purposes.</div>
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <Link to="/catalog" className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Continue Shopping</Link>
          <Link to="/account" className="px-5 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50">Go to Account</Link>
        </div>
      </div>
    </div>
  );
}


