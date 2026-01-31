// src/redux/slices/wishlistSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Ensure items is always an array
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      // Ensure state.items is an array before using find
      if (!Array.isArray(state.items)) {
        state.items = [];
      }
      const newItem = action.payload;
      const existingItem = state.items.find(item => item._id === newItem._id);
      if (!existingItem) {
        state.items.push(newItem);
        // Update localStorage after modifying state
        localStorage.setItem('wishlistItems', JSON.stringify(state.items));
      }
    },
    removeFromWishlist: (state, action) => {
      if (!Array.isArray(state.items)) {
        state.items = [];
      }
      state.items = state.items.filter(item => item._id !== action.payload);
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlistItems');
    },
    setWishlist: (state, action) => {
      // Ensure the payload is an array
      state.items = Array.isArray(action.payload) ? action.payload : [];
      localStorage.setItem('wishlistItems', JSON.stringify(state.items));
    }
  }
});

// Add a selector to safely get wishlist items
export const selectWishlistItems = state => {
  return Array.isArray(state.wishlist?.items) ? state.wishlist.items : [];
};

export const { 
  addToWishlist, 
  removeFromWishlist, 
  clearWishlist,
  setWishlist 
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
