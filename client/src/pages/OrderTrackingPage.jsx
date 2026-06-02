import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchOrder,
  cancelOrderThunk,
  selectCurrentOrder,
  selectOrderLoading,
  selectOrderError,
} from '../features/order/orderSlice';
import useSocket from '../hooks/useSocket';
import StatusStepper from '../components/StatusStepper';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { ORDER_STATUSES } from '../utils/constants';
import toast from 'react-hot-toast';

const OrderTrackingPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const order = useSelector(selectCurrentOrder);
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);

  // Connect to Socket.IO for real-time updates
  useSocket(id);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrder(id));
    }
  }, [dispatch, id]);

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await dispatch(cancelOrderThunk(id)).unwrap();
        toast.success('Order cancelled successfully');
      } catch (err) {
        toast.error(err || 'Failed to cancel order');
      }
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <LoadingSpinner message="Loading order details..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page">
        <div className="container">
          <EmptyState
            icon="😕"
            title="Order not found"
            message={error}
            action={
              <Link to="/orders" className="btn btn-primary no-underline">
                View All Orders
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="page">
        <div className="container">
          <LoadingSpinner message="Loading..." />
        </div>
      </div>
    );
  }

  const canCancel = ![
    ORDER_STATUSES.OUT_FOR_DELIVERY,
    ORDER_STATUSES.DELIVERED,
    ORDER_STATUSES.CANCELLED,
  ].includes(order.status);

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="page">
      <div className="container max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-900 no-underline transition-colors mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All Orders
        </Link>

        {/* Order Header Card */}
        <div className="card p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-surface-900">
                {order.orderNumber}
              </h1>
              <p className="text-sm text-surface-500 mt-1">{formattedDate}</p>
            </div>
            <StatusBadge status={order.status} />
          </div>

          {/* Status Stepper */}
          <StatusStepper
            currentStatus={order.status}
            statusHistory={order.statusHistory}
          />

          {/* Real-time indicator */}
          {order.status !== ORDER_STATUSES.DELIVERED &&
            order.status !== ORDER_STATUSES.CANCELLED && (
              <div className="flex items-center gap-2 justify-center mt-4 px-4 py-2.5 bg-accent-50 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-accent-500 animate-pulse-soft" />
                <span className="text-xs font-medium text-accent-700">
                  Live tracking — updates automatically
                </span>
              </div>
            )}
        </div>

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Items */}
          <div className="card p-6">
            <h3 className="text-base font-bold text-surface-900 mb-4">
              Order Items
            </h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-surface-100 last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-surface-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-surface-500">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-surface-900">
                    ${item.subtotal.toFixed(2)}
                  </span>
                </div>
              ))}

              <div className="flex items-center justify-between pt-3 border-t border-surface-200">
                <span className="text-base font-bold text-surface-900">
                  Total
                </span>
                <span className="text-lg font-bold text-primary-600">
                  ${order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="card p-6">
            <h3 className="text-base font-bold text-surface-900 mb-4">
              Delivery Details
            </h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Name
                </label>
                <p className="text-sm font-medium text-surface-900 mt-0.5">
                  {order.customer.name}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Address
                </label>
                <p className="text-sm font-medium text-surface-900 mt-0.5">
                  {order.customer.address}
                </p>
              </div>
              <div>
                <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                  Phone
                </label>
                <p className="text-sm font-medium text-surface-900 mt-0.5">
                  {order.customer.phone}
                </p>
              </div>
              {order.estimatedDelivery && order.status !== ORDER_STATUSES.DELIVERED && order.status !== ORDER_STATUSES.CANCELLED && (
                <div>
                  <label className="text-xs font-semibold text-surface-400 uppercase tracking-wider">
                    Estimated Delivery
                  </label>
                  <p className="text-sm font-medium text-primary-600 mt-0.5">
                    {new Date(order.estimatedDelivery).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              )}
            </div>

            {/* Cancel Button */}
            {canCancel && (
              <button
                onClick={handleCancel}
                className="w-full btn btn-danger mt-6"
                id="cancel-order-btn"
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
