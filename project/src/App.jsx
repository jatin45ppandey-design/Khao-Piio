import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderHistory from './pages/OrderHistory';
import TrackOrder from './pages/TrackOrder';
import SearchResults from './pages/SearchResults';
import RazorpayPage from './pages/RazorpayPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/razorpay" element={<RazorpayPage />} />
                <Route path="/order-success" element={<OrderSuccess />} />
                <Route path="/order-history" element={<OrderHistory />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/search" element={<SearchResults />} />
              </Routes>
            </main>
            <Footer />
            <CartModal />
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
