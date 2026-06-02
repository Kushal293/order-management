import axiosInstance from './axiosInstance';

/**
 * Fetch all available menu items with optional category filter.
 * @param {string} [category] - Optional category to filter by
 * @returns {Promise<{success: boolean, count: number, data: Array}>}
 */
export const fetchMenuItems = async (category) => {
  const params = {};
  if (category && category !== 'All') {
    params.category = category;
  }
  const response = await axiosInstance.get('/api/menu', { params });
  return response.data;
};

/**
 * Fetch a single menu item by ID.
 * @param {string} id - Menu item ID
 * @returns {Promise<{success: boolean, data: Object}>}
 */
export const fetchMenuItemById = async (id) => {
  const response = await axiosInstance.get(`/api/menu/${id}`);
  return response.data;
};
