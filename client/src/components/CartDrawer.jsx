import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectCartItems,
  selectCartIsOpen,
  selectCartTotal,
  selectCartItemCount,
  closeCart,
  clearCart,
} from '../features/cart/cartSlice';
import CartItem from './CartItem';

const CartDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const isOpen = useSelector(selectCartIsOpen);
  const total = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);

  const handleCheckout = () => {
    dispatch(closeCart());
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity animate-fade-in"
        onClick={() => dispatch(closeCart())}
        id="cart-overlay"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-elevated z-50 flex flex-col animate-slide-in-right"
        id="cart-drawer"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100 bg-surface-50/50 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-extrabold text-surface-900 tracking-tight">Your Order</h2>
            <p className="text-sm font-medium text-surface-500 mt-0.5">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button
            onClick={() => dispatch(closeCart())}
            className="w-10 h-10 rounded-full bg-white hover:bg-surface-200 flex items-center justify-center border border-surface-200 cursor-pointer transition-all duration-200 hover:rotate-90 shadow-sm"
            aria-label="Close cart"
            id="close-cart-btn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-fade-in">
              <div className="w-24 h-24 bg-surface-100 rounded-full flex items-center justify-center text-5xl mb-6 shadow-inner">
                🛒
              </div>
              <h3 className="text-xl font-bold text-surface-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-surface-500 max-w-[200px] leading-relaxed">
                Looks like you haven't added any delicious items yet!
              </p>
            </div>
          ) : (
            <>
              {items.map((item) => (
                <CartItem key={item.menuItem._id} item={item} />
              ))}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-surface-100 px-5 py-4 space-y-3">
            {/* Total */}
            <div className="flex items-center justify-between">
              <span className="text-surface-600 font-medium">Subtotal</span>
              <span className="text-xl font-bold text-surface-900">
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Actions */}
            <button
              onClick={handleCheckout}
              className="w-full btn btn-primary btn-lg"
              id="checkout-btn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              Proceed to Checkout
            </button>

            <button
              onClick={() => dispatch(clearCart())}
              className="w-full btn btn-ghost text-danger-500 hover:text-danger-600 hover:bg-danger-50"
              id="clear-cart-btn"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
