import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../src/features/cart/cartSlice';
import menuReducer from '../src/features/menu/menuSlice';
import MenuCard from '../src/components/MenuCard';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockMenuItem = {
  _id: 'test-123',
  name: 'Margherita Pizza',
  description: 'Classic pizza with tomato sauce and mozzarella',
  price: 12.99,
  image: 'https://example.com/pizza.jpg',
  category: 'Pizza',
  isAvailable: true,
};

const renderWithStore = (component, preloadedState = {}) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      menu: menuReducer,
    },
    preloadedState,
  });

  return render(<Provider store={store}>{component}</Provider>);
};

describe('MenuCard', () => {
  it('renders menu item details correctly', () => {
    renderWithStore(<MenuCard item={mockMenuItem} />);

    expect(screen.getByText('Margherita Pizza')).toBeInTheDocument();
    expect(
      screen.getByText('Classic pizza with tomato sauce and mozzarella')
    ).toBeInTheDocument();
    expect(screen.getByText('$12.99')).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
  });

  it('renders food image with correct alt text', () => {
    renderWithStore(<MenuCard item={mockMenuItem} />);

    const img = screen.getByAltText('Margherita Pizza');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/pizza.jpg');
  });

  it('renders "Add to Cart" button when item is not in cart', () => {
    renderWithStore(<MenuCard item={mockMenuItem} />);

    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });

  it('renders "Add More" button when item is in cart', () => {
    renderWithStore(<MenuCard item={mockMenuItem} />, {
      cart: {
        items: [{ menuItem: mockMenuItem, quantity: 1 }],
        isOpen: false,
      },
      menu: { items: [], loading: false, error: null, selectedCategory: 'All' },
    });

    expect(screen.getByText('Add More')).toBeInTheDocument();
  });

  it('calls addToCart when button is clicked', async () => {
    const user = userEvent.setup();
    const store = configureStore({
      reducer: {
        cart: cartReducer,
        menu: menuReducer,
      },
    });

    render(
      <Provider store={store}>
        <MenuCard item={mockMenuItem} />
      </Provider>
    );

    await user.click(screen.getByText('Add to Cart'));

    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].menuItem._id).toBe('test-123');
  });
});
