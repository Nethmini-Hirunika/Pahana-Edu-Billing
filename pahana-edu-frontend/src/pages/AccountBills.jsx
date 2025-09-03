import { useEffect, useState } from "react";
import { useAuth } from "../store/AuthContext";
import { api } from "../api/axios";

export default function AccountBills() {
  const { user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, paid, unpaid

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api
      .get(`/api/bills/customer/${user.id}`)
      .then(({ data }) => {
        const list = data?.content || data || [];
        console.log('Bills fetched for user:', user.id, list);
        setRows(list);
      })
      .catch((error) => {
        console.error('Error fetching bills:', error);
        // Fallback to query param approach
        return api.get(`/api/bills`, { params: { customerId: user.id } });
      })
      .then(({ data }) => {
        if (data) {
          const list = data?.content || data || [];
          console.log('Bills fetched (fallback):', list);
          
          // Filter bills by current user ID since backend returns all bills
          const userBills = list.filter(bill => {
            return bill.customerId === user.id || 
                   bill.customer?.id === user.id ||
                   bill.userId === user.id ||
                   bill.user?.id === user.id;
          });
          
          console.log('Filtered bills for user', user.id, ':', userBills);
          setRows(userBills);
        }
      })
      .catch(() => setRows([]))
      .finally(() => setLoading(false));
  }, [user]);

  function getBillAmount(bill) {
    const cents =
      bill.totalAmountCents ?? bill.amountCents ?? bill.totalCents ?? bill.total_price_cents ?? bill.grandTotalCents ?? null;
    if (cents != null) return Number(cents) / 100;

    const candidates = [
      bill.totalAmount,
      bill.total,
      bill.totalPrice,
      bill.grandTotal,
      bill.amountDue,
      bill.billTotal,
      bill.amount,
    ];

    const extractNumeric = (v) => {
      if (v == null) return null;
      if (typeof v === 'number') return v;
      if (typeof v === 'string') {
        const n = Number(v);
        return Number.isFinite(n) ? n : null;
      }
      if (typeof v === 'object') {
        return extractNumeric(v.amount ?? v.value ?? v.total ?? v.cents ?? v.dollars);
      }
      return null;
    };

    for (const c of candidates) {
      const n = extractNumeric(c);
      if (n != null) {
        return n >= 1000 && Number.isInteger(n) ? n / 100 : n;
      }
    }
    return 0;
  }

  const filteredBills = rows.filter(bill => {
    if (filter === "all") return true;
    if (filter === "paid") return bill.status === "PAID" || bill.paid;
    if (filter === "unpaid") return bill.status !== "PAID" && !bill.paid;
    return true;
  });

  const orderedBills = [...filteredBills].sort((a, b) => {
    const ad = new Date(a.billDate || a.date || a.createdAt || 0).getTime();
    const bd = new Date(b.billDate || b.date || b.createdAt || 0).getTime();
    if (bd !== ad) return bd - ad;
    const aid = Number(a.id);
    const bid = Number(b.id);
    if (Number.isFinite(aid) && Number.isFinite(bid)) return bid - aid;
    return 0;
  });

  const totalAmount = orderedBills.reduce((sum, bill) => sum + getBillAmount(bill), 0);
  const paidAmount = orderedBills
    .filter(bill => bill.status === "PAID" || bill.paid)
    .reduce((sum, bill) => sum + getBillAmount(bill), 0);

  async function fetchAndOpenServerPdf(bill, action = 'view') {
    const base = (api?.defaults?.baseURL || '').replace(/\/$/, '');
    const id = bill.id;
    const printCandidates = [
      `/api/bills/print/${id}`,
      `/api/bills/${id}/print`,
      `/api/bills/print/?id=${id}`,
      `/api/bills/print?id=${id}`,
    ];
    const downloadCandidates = [
      `/api/bills/download-pdf/${id}`,
      `/api/bills/${id}/download-pdf`,
      `/api/bills/download-pdf/?id=${id}`,
      `/api/bills/download-pdf?id=${id}`,
      `/api/bills/${id}/pdf`,
      `/api/bills/pdf?id=${id}`,
    ];

    const candidates = action === 'download' ? downloadCandidates : printCandidates;
    let lastError;
    for (const path of candidates) {
      const url = `${base}${path}`;
      try {
        const res = await api.get(url, { responseType: 'blob' });
        const contentType = res?.headers?.['content-type'] || '';
        const blob = res?.data instanceof Blob ? res.data : new Blob([res?.data || ''], { type: contentType || 'application/pdf' });
        if (blob.size === 0) throw new Error('Empty PDF response');
        const blobUrl = URL.createObjectURL(blob);
        if (action === 'download') {
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = `Bill-${id}.pdf`;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } else {
          window.open(blobUrl, '_blank');
        }
        return;
      } catch (e) {
        lastError = e;
      }
    }
    console.error('Failed to open server PDF:', lastError);
    alert('Could not open PDF from server.');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Bills</h1>
          <p className="text-lg text-gray-600">Track your billing history and payments</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Bills</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{filteredBills.length}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">📄</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Amount</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">${totalAmount.toFixed(2)}</p>
              </div>
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Paid Amount</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">${paidAmount.toFixed(2)}</p>
              </div>
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                filter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Bills
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                filter === "paid"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Paid
            </button>
            <button
              onClick={() => setFilter("unpaid")}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                filter === "unpaid"
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Unpaid
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your bills...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredBills.length === 0 && <EmptyState />}

        {/* Bills Grid */}
        {!loading && orderedBills.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orderedBills.map((bill) => (
              <BillCard
                key={bill.id}
                bill={bill}
                onView={() => fetchAndOpenServerPdf(bill, 'view')}
                onDownload={() => fetchAndOpenServerPdf(bill, 'download')}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BillCard({ bill, onView, onDownload }) {
  const isPaid = bill.status === "PAID" || bill.paid;
  const billDate = new Date(bill.billDate || bill.date || Date.now());
  const amount = (() => {
    const cents = bill.totalAmountCents ?? bill.amountCents ?? bill.totalCents ?? null;
    if (cents != null) return cents / 100;
    const raw = bill.totalAmount ?? bill.amount ?? 0;
    const n = Number(raw);
    return n >= 1000 && Number.isInteger(n) ? n / 100 : n;
  })();
  
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      {/* Header */}
      <div className={`p-6 ${isPaid ? 'bg-green-50' : 'bg-orange-50'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isPaid ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
            }`}>
              <span className="text-lg">{isPaid ? '✅' : '📄'}</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Bill #{bill.id}</h3>
              <p className="text-sm text-gray-600">{billDate.toLocaleDateString()}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            isPaid 
              ? 'bg-green-100 text-green-700' 
              : 'bg-orange-100 text-orange-700'
          }`}>
            {isPaid ? 'Paid' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Amount:</span>
            <span className="text-2xl font-bold text-gray-900">
              ${amount.toFixed(2)}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Date:</span>
            <span className="text-gray-900">{billDate.toLocaleDateString()}</span>
          </div>

          {bill.dueDate && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Due Date:</span>
              <span className="text-gray-900">{new Date(bill.dueDate).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onView}
            className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-200"
          >
            View PDF
          </button>
          <button
            onClick={onDownload}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            Download PDF
          </button>
          {!isPaid && (
            <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transform hover:scale-105 transition-all duration-200">
              Pay Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-4xl">📄</span>
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No bills found</h3>
      <p className="text-gray-600 max-w-md mx-auto">
        You don't have any bills yet. When you make purchases, your bills will appear here.
      </p>
    </div>
  );
}