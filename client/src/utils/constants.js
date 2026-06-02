/**
 * Frontend constants — mirrors backend status values
 */

export const ORDER_STATUSES = {
  ORDER_RECEIVED: 'Order Received',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const STATUS_PROGRESSION = [
  ORDER_STATUSES.ORDER_RECEIVED,
  ORDER_STATUSES.PREPARING,
  ORDER_STATUSES.OUT_FOR_DELIVERY,
  ORDER_STATUSES.DELIVERED,
];

export const MENU_CATEGORIES = ['All', 'Pizza', 'Burger', 'Drink', 'Dessert', 'Side'];

export const CATEGORY_ICONS = {
  All: '🍽️',
  Pizza: '🍕',
  Burger: '🍔',
  Drink: '🥤',
  Dessert: '🍰',
  Side: '🥗',
};

export const STATUS_COLORS = {
  [ORDER_STATUSES.ORDER_RECEIVED]: {
    bg: 'bg-info-100',
    text: 'text-info-500',
    badge: 'badge-received',
  },
  [ORDER_STATUSES.PREPARING]: {
    bg: 'bg-warning-100',
    text: 'text-warning-500',
    badge: 'badge-preparing',
  },
  [ORDER_STATUSES.OUT_FOR_DELIVERY]: {
    bg: 'bg-primary-100',
    text: 'text-primary-600',
    badge: 'badge-delivery',
  },
  [ORDER_STATUSES.DELIVERED]: {
    bg: 'bg-accent-100',
    text: 'text-accent-600',
    badge: 'badge-delivered',
  },
  [ORDER_STATUSES.CANCELLED]: {
    bg: 'bg-danger-100',
    text: 'text-danger-600',
    badge: 'badge-cancelled',
  },
};

export const API_BASE_URL = import.meta.env.VITE_API_URL || '';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
