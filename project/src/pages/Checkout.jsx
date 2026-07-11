import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  User,
  Phone,
  Home as HomeIcon,
  CreditCard,
  Smartphone,
  Wallet,
  Check,
  ArrowRight,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../services/api';

export default function Checkout() {
  const { items, subtotal, deliveryFee, tax, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [details, setDetails] = useState({
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  useEffect(() => {
    if (!user || !token) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [navigate, token, user]);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Your cart is empty
        </h2>
        <p className="text-gray-500 mb-6">
          Add some items before checking out.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-full bg-orange-500 text-white font-semibold hover:bg-orange-600 transition-colors"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!user || !token) {
      navigate('/login', { state: { from: '/checkout' } });
      return;
    }

    if (!details.name || !details.phone || !details.address || !details.city || !details.pincode) {
      setError('Please complete all delivery details before placing the order.');
      return;
    }

    const normalizedPhone = details.phone.replace(/\D/g, '');
    const normalizedPincode = details.pincode.replace(/\D/g, '');

    if (normalizedPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (normalizedPincode.length !== 6) {
      setError('Please enter a valid 6-digit PIN code.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const checkoutPayload = {
        orderItems: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        total,
        deliveryDetails: {
          ...details,
          phone: normalizedPhone,
          pincode: normalizedPincode,
        },
        paymentMethod,
        paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
        trackingStatus: paymentMethod === 'cash_on_delivery' ? 'placed' : 'confirmed',
      };

      if (paymentMethod === 'cash_on_delivery') {
        const response = await fetch(`${API_BASE_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(checkoutPayload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Unable to place order');
        }

        const orderId = `KP${data.order.id.toString().padStart(6, '0')}`;
        const eta = Math.floor(25 + Math.random() * 20);
        clearCart();
        navigate('/order-success', {
          state: {
            orderId,
            eta,
            paymentMethod,
            paymentStatus: 'pending',
            backendOrderId: data.order.id,
          },
        });
        return;
      }

      navigate('/razorpay', {
        state: {
          checkoutPayload,
        },
      });
    } catch (err) {
      setError(err.message || 'Unable to place order');
    } finally {
      setIsSubmitting(false);
    }
  };

  const paymentOptions = [
    { id: 'upi', label: 'UPI', desc: 'GPay, PhonePe, Paytm', icon: Smartphone },
    { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay', icon: CreditCard },
    { id: 'cash_on_delivery', label: 'Cash on Delivery', desc: 'Pay when you receive', icon: Wallet },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {/* Delivery Details */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-orange-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">
                Delivery Details
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={details.name}
                    onChange={(e) => setDetails({ ...details, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={details.phone}
                    onChange={(e) => setDetails({ ...details, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    placeholder="98765 43210"
                    inputMode="numeric"
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  Address
                </label>
                <div className="relative">
                  <HomeIcon className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                  <textarea
                    value={details.address}
                    onChange={(e) => setDetails({ ...details, address: e.target.value })}
                    placeholder="House no, Building, Street, Area"
                    rows={2}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-sm resize-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  City
                </label>
                <input
                  type="text"
                  value={details.city}
                  onChange={(e) => setDetails({ ...details, city: e.target.value })}
                  placeholder="Mumbai"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">
                  PIN Code
                </label>
                <input
                  type="text"
                  value={details.pincode}
                  onChange={(e) => setDetails({ ...details, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                  placeholder="400001"
                  inputMode="numeric"
                  maxLength={6}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-orange-600" />
              </div>
              <h2 className="text-lg font-bold text-gray-800">Payment Method</h2>
            </div>
            <div className="space-y-3">
              {paymentOptions.map((opt) => {
                const Icon = opt.icon;
                const selected = paymentMethod === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                      selected
                        ? 'border-orange-400 bg-orange-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        selected ? 'bg-orange-500' : 'bg-gray-100'
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 ${
                          selected ? 'text-white' : 'text-gray-500'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.desc}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selected ? 'border-orange-500 bg-orange-500' : 'border-gray-300'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50/60 p-4 text-sm text-gray-700">
              <p className="font-semibold text-orange-700 mb-1">
                Secure payment notice
              </p>
              <p>
                UPI and card payments will continue in the dedicated Razorpay page using the official Razorpay checkout SDK.
              </p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-20">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-700 truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-700">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
            <div className="rounded-xl bg-orange-50 border border-orange-100 px-3 py-2 text-xs text-orange-700 mb-3">
              Secure payment will continue on the Razorpay checkout page.
            </div>
            <div className="space-y-2 text-sm border-t border-gray-100 pt-4">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Taxes (5%)</span>
                <span>₹{tax}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 text-base pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 mt-5 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Placing Order...' : 'Place Order'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
