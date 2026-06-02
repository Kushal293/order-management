import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchMenuItems as fetchMenuItemsApi } from '../../api/menuApi';

/**
 * Async thunk to fetch menu items from the API.
 */
export const fetchMenu = createAsyncThunk(
  'menu/fetchMenu',
  async (category, { rejectWithValue }) => {
    try {
      const response = await fetchMenuItemsApi(category);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch menu items'
      );
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedCategory: 'All',
  },
  reducers: {
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    clearMenuError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCategory, clearMenuError } = menuSlice.actions;

// Selectors
export const selectMenuItems = (state) => state.menu.items;
export const selectMenuLoading = (state) => state.menu.loading;
export const selectMenuError = (state) => state.menu.error;
export const selectSelectedCategory = (state) => state.menu.selectedCategory;

export default menuSlice.reducer;
