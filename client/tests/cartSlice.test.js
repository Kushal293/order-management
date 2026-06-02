import { describe, it, expect } from 'vitest';
import cartReducer, {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  toggleCart,
  selectCartTotal,
  selectCartItemCount,
} from '../src/features/cart/cartSlice';

const mockMenuItem1 = {
  _id: '1',
  name: 'Test Pizza',
  price: 12.99,
  image: 'test.jpg',
  category: 'Pizza',
};

const mockMenuItem2 = {
  _id: '2',
  name: 'Test Burger',
  price: 11.99,
  image: 'test2.jpg',
  category: 'Burger',
};

describe('Cart Slice', () => {
  const initialState = { items: [], isOpen: false };

  describe('addToCart', () => {
    it('should add a new item to the cart', () => {
      const state = cartReducer(
        initialState,
        addToCart({ menuItem: mockMenuItem1 })
      );

      expect(state.items).toHaveLength(1);
      expect(state.items[0].menuItem._id).toBe('1');
      expect(state.items[0].quantity).toBe(1);
    });

    it('should increment quantity for existing item', () => {
      const stateWithItem = {
        items: [{ menuItem: mockMenuItem1, quantity: 1 }],
        isOpen: false,
      };

      const state = cartReducer(
        stateWithItem,
        addToCart({ menuItem: mockMenuItem1 })
      );

      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(2);
    });

    it('should not exceed max quantity of 50', () => {
      const stateWithItem = {
        items: [{ menuItem: mockMenuItem1, quantity: 50 }],
        isOpen: false,
      };

      const state = cartReducer(
        stateWithItem,
        addToCart({ menuItem: mockMenuItem1 })
      );

      expect(state.items[0].quantity).toBe(50);
    });
  });

  describe('removeFromCart', () => {
    it('should remove an item from the cart', () => {
      const stateWithItems = {
        items: [
          { menuItem: mockMenuItem1, quantity: 2 },
          { menuItem: mockMenuItem2, quantity: 1 },
        ],
        isOpen: false,
      };

      const state = cartReducer(
        stateWithItems,
        removeFromCart({ menuItemId: '1' })
      );

      expect(state.items).toHaveLength(1);
      expect(state.items[0].menuItem._id).toBe('2');
    });
  });

  describe('updateQuantity', () => {
    it('should update quantity of an item', () => {
      const stateWithItem = {
        items: [{ menuItem: mockMenuItem1, quantity: 1 }],
        isOpen: false,
      };

      const state = cartReducer(
        stateWithItem,
        updateQuantity({ menuItemId: '1', quantity: 5 })
      );

      expect(state.items[0].quantity).toBe(5);
    });

    it('should remove item if quantity is 0 or less', () => {
      const stateWithItem = {
        items: [{ menuItem: mockMenuItem1, quantity: 1 }],
        isOpen: false,
      };

      const state = cartReducer(
        stateWithItem,
        updateQuantity({ menuItemId: '1', quantity: 0 })
      );

      expect(state.items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from the cart', () => {
      const stateWithItems = {
        items: [
          { menuItem: mockMenuItem1, quantity: 2 },
          { menuItem: mockMenuItem2, quantity: 1 },
        ],
        isOpen: false,
      };

      const state = cartReducer(stateWithItems, clearCart());

      expect(state.items).toHaveLength(0);
    });
  });

  describe('toggleCart', () => {
    it('should toggle cart open state', () => {
      const state = cartReducer(initialState, toggleCart());
      expect(state.isOpen).toBe(true);

      const state2 = cartReducer(state, toggleCart());
      expect(state2.isOpen).toBe(false);
    });
  });

  describe('selectors', () => {
    const storeState = {
      cart: {
        items: [
          { menuItem: mockMenuItem1, quantity: 2 },
          { menuItem: mockMenuItem2, quantity: 3 },
        ],
        isOpen: false,
      },
    };

    it('selectCartItemCount should return total quantity', () => {
      expect(selectCartItemCount(storeState)).toBe(5);
    });

    it('selectCartTotal should calculate correct total', () => {
      const expected = 12.99 * 2 + 11.99 * 3;
      expect(selectCartTotal(storeState)).toBeCloseTo(expected);
    });
  });
});
