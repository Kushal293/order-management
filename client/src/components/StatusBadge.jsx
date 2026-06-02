import { STATUS_COLORS, ORDER_STATUSES } from '../utils/constants';

const statusIcons = {
  [ORDER_STATUSES.ORDER_RECEIVED]: '📋',
  [ORDER_STATUSES.PREPARING]: '👨‍🍳',
  [ORDER_STATUSES.OUT_FOR_DELIVERY]: '🛵',
  [ORDER_STATUSES.DELIVERED]: '✅',
  [ORDER_STATUSES.CANCELLED]: '❌',
};

const StatusBadge = ({ status }) => {
  const colorConfig = STATUS_COLORS[status] || STATUS_COLORS[ORDER_STATUSES.ORDER_RECEIVED];

  return (
    <span className={`badge ${colorConfig.badge}`} id="status-badge">
      <span className="text-sm">{statusIcons[status]}</span>
      {status}
    </span>
  );
};

export default StatusBadge;
