import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartItemCount, toggleCart } from '../features/cart/cartSlice';

const Navbar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const cartItemCount = useSelector(selectCartItemCount);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm supports-[backdrop-filter]:bg-white/60">
      <div className="container">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 no-underline group">
            <div className="w-10 h-10 rounded-2xl gradient-primary flex items-center justify-center text-white text-xl shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform duration-300">
              🍽️
            </div>
            <span className="text-xl font-extrabold text-surface-900 tracking-tight">
              Quick<span className="text-primary-600">Bite</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className={`px-2 py-2 text-sm font-bold no-underline transition-all duration-200 border-b-2 ${
                isActive('/')
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-surface-600 hover:text-surface-900'
              }`}
            >
              Menu
            </Link>
            <Link
              to="/orders"
              className={`px-2 py-2 text-sm font-bold no-underline transition-all duration-200 border-b-2 ${
                isActive('/orders')
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-surface-600 hover:text-surface-900'
              }`}
            >
              My Orders
            </Link>

            {/* Cart Button */}
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative ml-2 p-2.5 rounded-full bg-surface-100 hover:bg-surface-200 transition-all duration-200 border-none cursor-pointer group shadow-sm hover:shadow-md"
              aria-label="Open cart"
              id="cart-toggle-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-surface-700 group-hover:text-surface-900 group-hover:scale-110 transition-all duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
                />
              </svg>

              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm border-2 border-white animate-scale-in">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
