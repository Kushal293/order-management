import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  placeOrder as placeOrderApi,
  fetchOrderById as fetchOrderByIdApi,
  fetchOrders as fetchOrdersApi,
  cancelOrder as cancelOrderApi,
} from '../../api/orderApi';

/**
 * Place a new order.
 */
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await placeOrderApi(orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to place order'
      );
    }
  }
);

/**
 * Fetch a single order by ID.
 */
export const fetchOrder = createAsyncThunk(
  'order/fetchOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await fetchOrderByIdApi(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch order'
      );
    }
  }
);

/**
 * Fetch all orders.
 */
export const fetchAllOrders = createAsyncThunk(
  'order/fetchAllOrders',
  async (params, { rejectWithValue }) => {
    try {
      const response = await fetchOrdersApi(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch orders'
      );
    }
  }
);

/**
 * Cancel an order.
 */
export const cancelOrderThunk = createAsyncThunk(
  'order/cancelOrder',
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await cancelOrderApi(orderId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to cancel order'
      );
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    currentOrder: null,
    orders: [],
    totalOrders: 0,
    loading: false,
    placingOrder: false,
    error: null,
  },
  reducers: {
    updateOrderStatus: (state, action) => {
      const { orderId, status, statusHistory } = action.payload;

      // Update current order if it matches
      if (state.currentOrder && state.currentOrder._id === orderId) {
        state.currentOrder.status = status;
        if (statusHistory) {
          state.currentOrder.statusHistory = statusHistory;
        }
      }

      // Update in orders list
      const orderIndex = state.orders.findIndex((o) => o._id === orderId);
      if (orderIndex !== -1) {
        state.orders[orderIndex].status = status;
        if (statusHistory) {
          state.orders[orderIndex].statusHistory = statusHistory;
        }
      }
    },

    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },

    clearOrderError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false;
        state.error = action.payload;
      })
      // Fetch Single Order
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
        state.totalOrders = action.payload.total;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Cancel Order
      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        const cancelledOrder = action.payload;
        if (state.currentOrder && state.currentOrder._id === cancelledOrder._id) {
          state.currentOrder = cancelledOrder;
        }
        const index = state.orders.findIndex((o) => o._id === cancelledOrder._id);
        if (index !== -1) {
          state.orders[index] = cancelledOrder;
        }
      });
  },
});

export const { updateOrderStatus, clearCurrentOrder, clearOrderError } =
  orderSlice.actions;

// Selectors
export const selectCurrentOrder = (state) => state.order.currentOrder;
export const selectOrders = (state) => state.order.orders;
export const selectOrderLoading = (state) => state.order.loading;
export const selectPlacingOrder = (state) => state.order.placingOrder;
export const selectOrderError = (state) => state.order.error;

export default orderSlice.reducer;
