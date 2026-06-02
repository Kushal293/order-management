import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  selectCartItems,
  selectCartTotal,
  selectCartItemCount,
  clearCart,
} from '../features/cart/cartSlice';
import {
  placeOrder,
  selectPlacingOrder,
  selectOrderError,
} from '../features/order/orderSlice';
import CheckoutForm from '../components/CheckoutForm';
import OrderSummary from '../components/OrderSummary';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);
  const itemCount = useSelector(selectCartItemCount);
  const isPlacing = useSelector(selectPlacingOrder);
  const orderError = useSelector(selectOrderError);

  const handleSubmit = async (customerData) => {
    const orderData = {
      items: cartItems.map((item) => ({
        menuItem: item.menuItem._id,
        quantity: item.quantity,
      })),
      customer: customerData,
    };

    try {
      const result = await dispatch(placeOrder(orderData)).unwrap();

      // Clear cart and navigate to order tracking
      dispatch(clearCart());
      toast.success('Order placed successfully! 🎉', { duration: 4000 });
      navigate(`/orders/${result._id}`);
    } catch (error) {
      toast.error(error || 'Failed to place order');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            message="Add some items from the menu before checking out."
            action={
              <Link to="/" className="btn btn-primary no-underline">
                Browse Menu
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-900 no-underline transition-colors mb-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Menu
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900">
            Checkout
          </h1>
          <p className="text-surface-500 mt-1">
            {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {/* Error Message */}
        {orderError && (
          <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-xl text-sm text-danger-700 animate-slide-up">
            <strong>Error:</strong> {orderError}
          </div>
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-3">
            <div className="card p-6 md:p-8">
              <CheckoutForm onSubmit={handleSubmit} isSubmitting={isPlacing} />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-24">
              <OrderSummary items={cartItems} total={cartTotal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
