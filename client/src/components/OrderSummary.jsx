const OrderSummary = ({ items, total }) => {
  return (
    <div className="card p-5" id="order-summary">
      <h3 className="text-lg font-bold text-surface-900 mb-4">
        Order Summary
      </h3>

      <div className="space-y-3 mb-4">
        {items.map((item) => (
          <div
            key={item.menuItem._id}
            className="flex items-center gap-3"
          >
            <img
              src={item.menuItem.image}
              alt={item.menuItem.name}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-surface-900 truncate">
                {item.menuItem.name}
              </p>
              <p className="text-xs text-surface-500">
                Qty: {item.quantity} × ${item.menuItem.price.toFixed(2)}
              </p>
            </div>
            <span className="text-sm font-bold text-surface-900">
              ${(item.menuItem.price * item.quantity).toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-surface-100 pt-3 space-y-2">
        <div className="flex justify-between text-sm text-surface-600">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-surface-600">
          <span>Delivery Fee</span>
          <span className="text-accent-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between pt-2 border-t border-surface-100">
          <span className="text-base font-bold text-surface-900">Total</span>
          <span className="text-xl font-bold text-primary-600">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
