import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock3, PackageCheck, Truck, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../services/api';

const TRACKING_STEPS = [
  { key: 'placed', label: 'Order confirmed' },
  { key: 'confirmed', label: 'Preparing your food' },
  { key: 'out_for_delivery', label: 'Out for delivery' },
  { key: 'delivered', label: 'Delivered' },
];

export default function TrackOrder() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const backendOrderId = location.state?.backendOrderId;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !token) {
      navigate('/login', { state: { from: '/order-history' } });
      return;
    }

    async function loadOrder() {
      if (!backendOrderId) {
        setLoading(false);
        setError('No order selected for tracking');
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/orders/${backendOrderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to track order');
        }

        setOrder(data.order);
      } catch (err) {
        setError(err.message || 'Unable to track order');
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [backendOrderId, navigate, token, user]);

  useEffect(() => {
    if (!order || order.trackingStatus === 'delivered') {
      return;
    }

    const currentStepIndex = TRACKING_STEPS.findIndex((step) => step.key === order.trackingStatus);
    if (currentStepIndex === -1 || currentStepIndex >= TRACKING_STEPS.length - 1) {
      return;
    }

    const timer = setTimeout(() => {
      setOrder((prev) => {
        if (!prev) return prev;
        const nextIndex = currentStepIndex + 1;
        const nextStatus = TRACKING_STEPS[nextIndex].key;
        return {
          ...prev,
          trackingStatus: nextStatus,
          status: nextStatus,
        };
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [order]);

  if (loading) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-gray-500">Loading tracking details...</div>;
  }

  if (error) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-red-600">{error}</div>;
  }

  const currentStepIndex = TRACKING_STEPS.findIndex((step) => step.key === order?.trackingStatus);
  const activeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Truck className="w-5 h-5 text-orange-500" />
          <h1 className="text-2xl font-bold text-gray-800">Track Your Order</h1>
        </div>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6">
          <div className="space-y-4">
            <div className="rounded-2xl bg-orange-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-lg font-bold text-gray-800">KP{String(order.id).padStart(6, '0')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-semibold text-gray-700 capitalize">{order.trackingStatus || order.status}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {TRACKING_STEPS.map((step, index) => {
                const isActive = index <= activeIndex;
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      {isActive ? <CheckCircle2 className="w-4 h-4" /> : <Clock3 className="w-4 h-4" />}
                    </div>
                    <div className="text-sm font-medium text-gray-700">{step.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="font-semibold text-gray-800">Delivery details</span>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Name:</strong> {order.deliveryDetails?.name || 'N/A'}</p>
              <p><strong>Phone:</strong> {order.deliveryDetails?.phone || 'N/A'}</p>
              <p><strong>Address:</strong> {order.deliveryDetails?.address || 'N/A'}</p>
              <p><strong>City:</strong> {order.deliveryDetails?.city || 'N/A'}</p>
              <p><strong>Pincode:</strong> {order.deliveryDetails?.pincode || 'N/A'}</p>
            </div>

            <div className="mt-4 border-t border-gray-200 pt-4">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <PackageCheck className="w-4 h-4 text-green-500" />
                <span>Payment: {order.paymentMethod}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Payment status: {order.paymentStatus}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
