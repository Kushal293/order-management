/**
 * Application-wide constants
 */

// Order status enum values in progression order
const ORDER_STATUSES = {
  ORDER_RECEIVED: 'Order Received',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

// Valid status transitions (from -> [to])
const STATUS_TRANSITIONS = {
  [ORDER_STATUSES.ORDER_RECEIVED]: [ORDER_STATUSES.PREPARING, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.PREPARING]: [ORDER_STATUSES.OUT_FOR_DELIVERY, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.OUT_FOR_DELIVERY]: [ORDER_STATUSES.DELIVERED],
  [ORDER_STATUSES.DELIVERED]: [],
  [ORDER_STATUSES.CANCELLED]: [],
};

// Order status progression (excluding Cancelled — it's a terminal state)
const STATUS_PROGRESSION = [
  ORDER_STATUSES.ORDER_RECEIVED,
  ORDER_STATUSES.PREPARING,
  ORDER_STATUSES.OUT_FOR_DELIVERY,
  ORDER_STATUSES.DELIVERED,
];

// Menu item categories
const MENU_CATEGORIES = ['Pizza', 'Burger', 'Drink', 'Dessert', 'Side'];

// Simulation delays (ms) for auto status progression
const SIMULATION_DELAYS = {
  [ORDER_STATUSES.PREPARING]: 15000,        // 15 seconds after Order Received
  [ORDER_STATUSES.OUT_FOR_DELIVERY]: 30000,  // 30 seconds after Preparing
  [ORDER_STATUSES.DELIVERED]: 45000,          // 45 seconds after Out for Delivery
};

module.exports = {
  ORDER_STATUSES,
  STATUS_TRANSITIONS,
  STATUS_PROGRESSION,
  MENU_CATEGORIES,
  SIMULATION_DELAYS,
};
