import { useDispatch } from 'react-redux';
import { updateQuantity, removeFromCart } from '../features/cart/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const { menuItem, quantity } = item;

  const handleDecrement = () => {
    if (quantity <= 1) {
      dispatch(removeFromCart({ menuItemId: menuItem._id }));
    } else {
      dispatch(updateQuantity({ menuItemId: menuItem._id, quantity: quantity - 1 }));
    }
  };

  const handleIncrement = () => {
    dispatch(updateQuantity({ menuItemId: menuItem._id, quantity: quantity + 1 }));
  };

  return (
    <div className="flex items-center gap-4 py-4 border-b border-surface-100 last:border-b-0 animate-fade-in">
      {/* Image */}
      <img
        src={menuItem.image}
        alt={menuItem.name}
        className="w-16 h-16 rounded-xl object-cover flex-shrink-0 shadow-sm"
      />

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-surface-900 truncate mb-1">
          {menuItem.name}
        </h4>
        <p className="text-sm font-black text-primary-600">
          ${(menuItem.price * quantity).toFixed(2)}
        </p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center gap-3 bg-surface-50 rounded-lg p-1 border border-surface-200 shadow-inner">
        <button
          onClick={handleDecrement}
          className="w-8 h-8 rounded-md bg-white hover:bg-surface-100 flex items-center justify-center border border-surface-200 cursor-pointer transition-colors shadow-sm text-surface-600"
          aria-label="Decrease quantity"
        >
          {quantity <= 1 ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-danger-500 hover:text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          ) : (
            <span className="text-lg font-medium leading-none">−</span>
          )}
        </button>

        <span className="w-4 text-center text-sm font-bold text-surface-900">
          {quantity}
        </span>

        <button
          onClick={handleIncrement}
          className="w-8 h-8 rounded-md bg-white hover:bg-surface-100 flex items-center justify-center border border-surface-200 cursor-pointer transition-colors shadow-sm text-primary-600"
          aria-label="Increase quantity"
          disabled={quantity >= 50}
        >
          <span className="text-lg font-medium leading-none">+</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
