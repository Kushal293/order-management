import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchAllOrders,
  selectOrders,
  selectOrderLoading,
  selectOrderError,
} from '../features/order/orderSlice';
import OrderCard from '../components/OrderCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectOrders);
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className="page">
      <div className="container max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-surface-900">
            My Orders
          </h1>
          <p className="text-surface-500 mt-1">
            Track and manage your orders
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <LoadingSpinner message="Loading your orders..." />
        ) : error ? (
          <EmptyState
            icon="😕"
            title="Failed to load orders"
            message={error}
            action={
              <button
                onClick={() => dispatch(fetchAllOrders())}
                className="btn btn-primary"
              >
                Try Again
              </button>
            }
          />
        ) : orders.length === 0 ? (
          <EmptyState
            icon="📦"
            title="No orders yet"
            message="Your order history will appear here once you place your first order."
            action={
              <Link to="/" className="btn btn-primary no-underline">
                Browse Menu
              </Link>
            }
          />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
