import { STATUS_PROGRESSION, ORDER_STATUSES } from '../utils/constants';

const stepIcons = {
  [ORDER_STATUSES.ORDER_RECEIVED]: '📋',
  [ORDER_STATUSES.PREPARING]: '👨‍🍳',
  [ORDER_STATUSES.OUT_FOR_DELIVERY]: '🛵',
  [ORDER_STATUSES.DELIVERED]: '✅',
};

const stepLabels = {
  [ORDER_STATUSES.ORDER_RECEIVED]: 'Order Received',
  [ORDER_STATUSES.PREPARING]: 'Preparing',
  [ORDER_STATUSES.OUT_FOR_DELIVERY]: 'Out for Delivery',
  [ORDER_STATUSES.DELIVERED]: 'Delivered',
};

const StatusStepper = ({ currentStatus, statusHistory = [] }) => {
  const isCancelled = currentStatus === ORDER_STATUSES.CANCELLED;
  const currentIndex = STATUS_PROGRESSION.indexOf(currentStatus);

  const getStepStatus = (stepIndex) => {
    if (isCancelled) return 'cancelled';
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'upcoming';
  };

  const getTimestamp = (status) => {
    const entry = statusHistory.find((h) => h.status === status);
    if (!entry) return null;
    return new Date(entry.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isCancelled) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 rounded-full bg-danger-50 flex items-center justify-center mx-auto mb-4">
          <span className="text-4xl">❌</span>
        </div>
        <h3 className="text-xl font-bold text-danger-600 mb-1">Order Cancelled</h3>
        <p className="text-sm text-surface-500">
          This order has been cancelled
          {getTimestamp(ORDER_STATUSES.CANCELLED) && (
            <> at {getTimestamp(ORDER_STATUSES.CANCELLED)}</>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="py-6" id="status-stepper">
      <div className="flex items-start justify-between relative">
        {/* Progress Line Background */}
        <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-surface-200 rounded-full" />

        {/* Progress Line Active */}
        <div
          className="absolute top-6 left-[10%] h-1 rounded-full transition-all duration-700 ease-out"
          style={{
            width: `${Math.max(0, currentIndex) * (80 / (STATUS_PROGRESSION.length - 1))}%`,
            background: 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))',
          }}
        />

        {STATUS_PROGRESSION.map((status, index) => {
          const stepStatus = getStepStatus(index);
          const timestamp = getTimestamp(status);

          return (
            <div
              key={status}
              className="relative flex flex-col items-center z-10"
              style={{ width: `${100 / STATUS_PROGRESSION.length}%` }}
            >
              {/* Step Circle */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all duration-500 z-10 ${
                  stepStatus === 'completed'
                    ? 'gradient-primary shadow-lg shadow-primary-500/40 scale-100 border-2 border-white'
                    : stepStatus === 'current'
                    ? 'bg-white shadow-glow-strong scale-125 border-4 border-primary-500 animate-pulse-soft'
                    : 'bg-surface-100 border-2 border-surface-200'
                }`}
              >
                {stepStatus === 'completed' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={stepStatus === 'upcoming' ? 'grayscale opacity-40' : ''}>
                    {stepIcons[status]}
                  </span>
                )}
              </div>

              {/* Label */}
              <p
                className={`mt-4 text-xs font-bold text-center leading-tight transition-colors duration-300 ${
                  stepStatus === 'current'
                    ? 'text-primary-600'
                    : stepStatus === 'completed'
                    ? 'text-surface-900'
                    : 'text-surface-400 font-semibold'
                }`}
              >
                {stepLabels[status]}
              </p>

              {/* Timestamp */}
              {timestamp && (
                <p className="text-[10px] text-surface-400 mt-0.5">
                  {timestamp}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StatusStepper;
