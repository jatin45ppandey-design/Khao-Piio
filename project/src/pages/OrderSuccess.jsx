import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Receipt, Home as HomeIcon } from 'lucide-react';

export default function OrderSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const orderId = state?.orderId || 'KP000000';
  const eta = state?.eta || 30;
  const paymentMethod = state?.paymentMethod || 'cash_on_delivery';
  const paymentStatus = state?.paymentStatus || 'pending';

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center">
          <div className="relative inline-flex mb-6">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-11 h-11 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-500 mb-8">
            Thank you for ordering with Khao Piio. Your delicious food is on the
            way!
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-orange-50 rounded-2xl p-5">
              <Receipt className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500 mb-1">Order ID</p>
              <p className="font-bold text-gray-800 text-lg">{orderId}</p>
            </div>
            <div className="bg-orange-50 rounded-2xl p-5">
              <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500 mb-1">Estimated Delivery</p>
              <p className="font-bold text-gray-800 text-lg">{eta} min</p>
            </div>
          </div>

          <div className="bg-orange-50 rounded-2xl p-4 mb-6 text-left">
            <p className="text-xs text-gray-500 mb-1">Payment</p>
            <p className="font-semibold text-gray-800 capitalize">{paymentMethod.replace('_', ' ')}</p>
            <p className="text-sm text-gray-600 mt-1">Status: {paymentStatus}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5 mb-8 text-left">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="w-5 h-5 text-orange-500" />
              <p className="text-sm font-medium text-gray-700">
                Delivery to your address
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 rounded-full bg-orange-400" />
              <span>Order confirmed</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <span>Preparing your food</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
              <div className="w-2 h-2 rounded-full bg-gray-300" />
              <span>Out for delivery</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/track-order', { state: { backendOrderId: state?.backendOrderId } })}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-900 transition-all"
            >
              <Receipt className="w-4 h-4" />
              Track Order
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-[0.98]"
            >
              <HomeIcon className="w-4 h-4" />
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
