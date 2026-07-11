import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, UtensilsCrossed, User, LogOut, History } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchBar from './SearchBar';

export default function Navbar() {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-800 hidden sm:block">
            Khao<span className="text-orange-500">Piio</span>
          </span>
        </Link>

        <SearchBar onNavigate={(type, id) => navigate(`/search?type=${type}&id=${id}`)} />

        <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-orange-600" />
            <span className="hidden sm:inline text-sm font-medium text-orange-700">
              Cart
            </span>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/order-history"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors"
              >
                <History className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-700">Orders</span>
              </Link>
              <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-full bg-gray-50">
                <div className="w-7 h-7 bg-gradient-to-br from-orange-400 to-red-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2.5 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gray-800 hover:bg-gray-900 transition-colors"
            >
              <User className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Login</span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
