import axiosInstance from './axiosInstance';

/**
 * Place a new order.
 * @param {Object} orderData - { items: [{menuItem, quantity}], customer: {name, address, phone} }
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const placeOrder = async (orderData) => {
  const response = await axiosInstance.post('/api/orders', orderData);
  return response.data;
};

/**
 * Fetch an order by ID.
 * @param {string} id - Order ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const fetchOrderById = async (id) => {
  const response = await axiosInstance.get(`/api/orders/${id}`);
  return response.data;
};

/**
 * Fetch all orders with optional filters.
 * @param {Object} [params] - { status, page, limit }
 * @returns {Promise<{success: boolean, data: Array, total: number}>}
 */
export const fetchOrders = async (params = {}) => {
  const response = await axiosInstance.get('/api/orders', { params });
  return response.data;
};

/**
 * Update order status.
 * @param {string} id - Order ID
 * @param {string} status - New status
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const updateOrderStatus = async (id, status) => {
  const response = await axiosInstance.patch(`/api/orders/${id}/status`, { status });
  return response.data;
};

/**
 * Cancel an order.
 * @param {string} id - Order ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const cancelOrder = async (id) => {
  const response = await axiosInstance.patch(`/api/orders/${id}/cancel`);
  return response.data;
};
