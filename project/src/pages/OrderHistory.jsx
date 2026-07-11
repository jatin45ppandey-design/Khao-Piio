import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock3, PackageCheck, ReceiptText, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../services/api';

export default function OrderHistory() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
      return;
    }

    async function loadOrders() {
      try {
        const response = await fetch(`${API_BASE_URL}/orders/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to fetch order history');
        }

        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message || 'Unable to fetch order history');
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [navigate, token, user]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
          <p className="text-sm text-gray-500 mt-1">
            Your saved orders from the Khao-Pio database
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl bg-white p-6 text-sm text-gray-500">
          Loading your order history...
        </div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl bg-white p-8 text-center">
          <p className="text-gray-600 font-medium">No orders yet.</p>
          <p className="text-sm text-gray-500 mt-1">
            Place your first order to see it here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <ReceiptText className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-semibold text-gray-700">
                      Order #{order.id}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <PackageCheck className="w-4 h-4 text-green-500" />
                  <span className="font-medium text-gray-700">{order.status}</span>
                </div>
              </div>

              <div className="mt-4 space-y-2">
                {order.orderItems.map((item, index) => (
                  <div key={`${order.id}-${index}`} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2 text-sm">
                    <span className="text-gray-700">
                      {item.name || item.food || `Item ${index + 1}`}
                    </span>
                    <span className="text-gray-500">
                      Qty {item.quantity || item.qty || 1}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock3 className="w-4 h-4" />
                  <span>Order total</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-gray-800">₹{order.total}</span>
                  <button
                    onClick={() => navigate('/track-order', { state: { backendOrderId: order.id } })}
                    className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1.5 text-sm font-semibold text-orange-700 hover:bg-orange-100"
                  >
                    Track
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
