import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const OrderCard = ({ order }) => {
  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Link
      to={`/orders/${order._id}`}
      className="card p-5 no-underline hover:shadow-card hover:-translate-y-0.5 transition-all duration-300 block"
      id={`order-card-${order._id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base font-bold text-surface-900">
            {order.orderNumber}
          </h3>
          <p className="text-xs text-surface-500 mt-0.5">{formattedDate}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Items Preview */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex -space-x-2">
          {order.items.slice(0, 3).map((item, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm"
              title={item.name}
            >
              {/* Show placeholder since we might not have image URL in order */}
              <div className="w-full h-full bg-primary-100 flex items-center justify-center text-xs">
                🍽️
              </div>
            </div>
          ))}
          {order.items.length > 3 && (
            <div className="w-8 h-8 rounded-full border-2 border-white bg-surface-100 flex items-center justify-center text-[10px] font-bold text-surface-600 shadow-sm">
              +{order.items.length - 3}
            </div>
          )}
        </div>
        <span className="text-sm text-surface-500">
          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-surface-100">
        <span className="text-sm text-surface-600">
          {order.customer.name}
        </span>
        <span className="text-base font-bold text-primary-600">
          ${order.totalAmount.toFixed(2)}
        </span>
      </div>
    </Link>
  );
};

export default OrderCard;
