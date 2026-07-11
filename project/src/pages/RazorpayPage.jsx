import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { API_BASE_URL } from '../services/api';

export default function RazorpayPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user, token } = useAuth();
  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentState, setPaymentState] = useState('Initializing payment...');
  
  // Prevent double-init in React 18 Strict Mode
  const hasInitialized = useRef(false);

  const checkoutPayload = useMemo(() => {
    return state?.checkoutPayload || null;
  }, [state]);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login', { state: { from: '/razorpay' } });
      return;
    }

    if (!checkoutPayload) {
      setError('Checkout session was not found. Please try again.');
      setLoading(false);
      return;
    }

    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const loadRazorpay = async () => {
      try {
        setPaymentState('Loading Razorpay checkout...');

        if (!window.Razorpay) {
          // Check if script is already downloading to avoid duplicates
          const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
          if (existingScript) {
            existingScript.addEventListener('load', initPayment);
            return;
          }

          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.async = true;
          script.onload = initPayment;
          script.onerror = () => {
            setError('Unable to load Razorpay SDK. Please check your internet connection.');
            setLoading(false);
          };
          document.body.appendChild(script);
          return;
        }

        initPayment();
      } catch (err) {
        setError(err.message || 'Unable to start payment.');
        setLoading(false);
      }
    };

    const initPayment = async () => {
      try {
        setPaymentState('Creating Razorpay order...');

        const orderResponse = await fetch(`${API_BASE_URL}/payments/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            amount: Number(checkoutPayload.total),
            currency: 'INR',
            receipt: `khao-pio-${Date.now()}`,
          }),
        });

        const orderData = await orderResponse.json();

        if (!orderResponse.ok) {
          throw new Error(orderData.message || 'Unable to create Razorpay order.');
        }

        const options = {
          key: orderData.order.key,
          amount: orderData.order.amount,
          currency: orderData.order.currency,
          name: 'Khao Pio',
          description: 'Food order payment',
          order_id: orderData.order.id,
          handler: async function (response) {
            // CRITICAL FIX: Added try/catch block around verification logic
            try {
              setLoading(true);
              setPaymentState('Verifying payment...');

              const verifyResponse = await fetch(`${API_BASE_URL}/payments/verify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  order_id: response.razorpay_order_id,
                  payment_id: response.razorpay_payment_id,
                  signature: response.razorpay_signature,
                }),
              });

              const verifyData = await verifyResponse.json();

              if (!verifyResponse.ok) {
                throw new Error(verifyData.message || 'Payment verification failed.');
              }

              const saveOrderResponse = await fetch(`${API_BASE_URL}/orders`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  ...checkoutPayload,
                  paymentMethod: checkoutPayload.paymentMethod,
                  paymentStatus: 'paid',
                  trackingStatus: 'confirmed',
                }),
              });

              const savedOrderData = await saveOrderResponse.json();

              if (!saveOrderResponse.ok) {
                throw new Error(savedOrderData.message || 'Unable to place order after payment.');
              }

              const orderId = `KP${savedOrderData.order.id.toString().padStart(6, '0')}`;
              const eta = Math.floor(25 + Math.random() * 20);
              clearCart();
              navigate('/order-success', {
                state: {
                  orderId,
                  eta,
                  paymentMethod: checkoutPayload.paymentMethod,
                  paymentStatus: 'paid',
                  backendOrderId: savedOrderData.order.id,
                },
              });
            } catch (err) {
              setError(err.message || 'Payment verification failed. Please contact support if your account was debited.');
              setLoading(false);
            }
          },
          // CRITICAL FIX: Safe navigation with fallback values
          prefill: {
            name: checkoutPayload?.deliveryDetails?.name || '',
            contact: checkoutPayload?.deliveryDetails?.phone || '',
          },
          theme: {
            color: '#f97316',
          },
          modal: {
            ondismiss: () => {
              setError('Payment was cancelled.');
              setLoading(false);
            },
          },
        };

        const razorpayCheckout = new window.Razorpay(options);
        setPaymentState('Opening Razorpay checkout...');
        razorpayCheckout.open();
        setLoading(false);
      } catch (err) {
        setError(err.message || 'Unable to open Razorpay checkout.');
        setLoading(false);
      }
    };

    loadRazorpay();
  }, [checkoutPayload, clearCart, navigate, token, user]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 bg-gradient-to-br from-orange-50 via-amber-50 to-red-50">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-xl border border-orange-100 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 mb-4">
          <span className="text-2xl">💳</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Razorpay Payment</h1>
        <p className="text-sm text-gray-500 mt-2">
          Secure UPI and card checkout powered by the official Razorpay SDK.
        </p>

        <div className="mt-6 rounded-2xl bg-orange-50 border border-orange-100 p-4 text-left">
          <p className="text-xs uppercase tracking-wide text-gray-500">Status</p>
          <p className="mt-1 text-sm font-semibold text-orange-700">{paymentState}</p>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading && !error && (
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500">
            <span className="inline-block h-3 w-3 animate-pulse rounded-full bg-orange-500" />
            Processing payment setup...
          </div>
        )}

        <button
          onClick={() => navigate('/checkout')}
          className="mt-6 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 hover:border-orange-400 hover:text-orange-600"
        >
          Back to Checkout
        </button>
      </div>
    </div>
  );
}