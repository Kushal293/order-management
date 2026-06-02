import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [], // { menuItem: {_id, name, price, image, ...}, quantity }
    isOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const { menuItem } = action.payload;
      const existingItem = state.items.find(
        (item) => item.menuItem._id === menuItem._id
      );

      if (existingItem) {
        existingItem.quantity = Math.min(existingItem.quantity + 1, 50);
      } else {
        state.items.push({ menuItem, quantity: 1 });
      }
    },

    removeFromCart: (state, action) => {
      const { menuItemId } = action.payload;
      state.items = state.items.filter(
        (item) => item.menuItem._id !== menuItemId
      );
    },

    updateQuantity: (state, action) => {
      const { menuItemId, quantity } = action.payload;
      const item = state.items.find(
        (item) => item.menuItem._id === menuItemId
      );

      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) => i.menuItem._id !== menuItemId
          );
        } else {
          item.quantity = Math.min(quantity, 50);
        }
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },

    openCart: (state) => {
      state.isOpen = true;
    },

    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartIsOpen = (state) => state.cart.isOpen;

export const selectCartItemCount = (state) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);

export const selectCartTotal = (state) =>
  state.cart.items.reduce(
    (total, item) => total + item.menuItem.price * item.quantity,
    0
  );

export const selectIsInCart = (menuItemId) => (state) =>
  state.cart.items.some((item) => item.menuItem._id === menuItemId);

export default cartSlice.reducer;
